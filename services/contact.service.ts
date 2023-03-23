import { db } from './db'
import {
  doc,
  collection,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  where,
  query,
  getDocs,
  type DocumentData,
  type DocumentSnapshot,
  type DocumentReference,
} from 'firebase/firestore'
import { type IContact } from '@/context/auth.context'

interface IUserData {
  uid: string
  name: string
  photoURL: string
}

async function getContactUserDocs(refs: DocumentReference<DocumentData>[]) {
  const promises: Promise<DocumentSnapshot<DocumentData>>[] = []

  refs.forEach((ref) => {
    promises.push(getDoc(ref))
  })

  const docs: { uuid: string; name: string; photoURL: string }[] = []
  await Promise.all(promises).then((results) => {
    results.forEach((result) => {
      if (result.exists()) {
        const data = result.data()

        docs.push({ uuid: result.id, name: data.name, photoURL: data.photoURL })
      }
    })
  })

  return docs
}

class Contact {
  static async getAll(uid: string): Promise<IContact[]> {
    const userRef = doc(db, 'user', uid)
    const docSnap = await getDoc(userRef)

    if (!docSnap.exists()) return []

    const contacts = docSnap.data().contacts

    const refs: DocumentReference<DocumentData>[] = []
    contacts.forEach((contact: any) => refs.push(contact.user))

    const docs = await getContactUserDocs(refs)

    const results: IContact[] = []

    docs.forEach((doc) => {
      const uuid = doc.uuid
      const docRef = contacts.find((contact: any) => contact.user.id === uuid)
      docRef &&
        results.push({
          uid: doc.uuid,
          name: doc.name,
          photoURL: doc.photoURL,
          messageGroupId: docRef.messageGroupId,
        })
    })

    return results
  }

  /**
   * @param {string} uuid
   * @param {string} contactId
   */
  static async addContact(uuid: string, contactId: string) {
    const userRef = doc(db, 'user', uuid)
    const contactUserRef = doc(db, 'user', contactId)

    // check if the user already has the contact
    const user = await getDoc(userRef)

    const messageGroupRef = await addDoc(collection(db, 'messageGroup'), {
      members: [userRef, contactUserRef],
      messages: [],
    })

    await updateDoc(userRef, {
      contacts: arrayUnion({
        user: contactUserRef,
        messageGroupId: messageGroupRef.id,
      }),
    })

    await updateDoc(contactUserRef, {
      contacts: arrayUnion({
        user: userRef,
        messageGroupId: messageGroupRef.id,
      }),
    })
  }

  static async search(text: string): Promise<DocumentData[]> {
    const results: IUserData[] = []

    const q = query(collection(db, 'user'), where('name', '==', text))
    const docs = await getDocs(q)
    docs.forEach((result) => {
      if (result.exists()) {
        const data = result.data()
        results.push({
          name: data.name,
          photoURL: data.photoURL,
          uid: result.id,
        })
      }
    })

    return results
  }

  static async delete(uid: string, contactId: string[]) {
    const userDoc = await getDoc(doc(db, 'user', uid))

    if (userDoc.exists()) {
      const contacts = userDoc.data().contacts

      const filterContacts = contacts.filter((contact: any) => {
        if (contactId.includes(contact.user.id)) return
        return contact
      })

      await updateDoc(doc(db, 'user', uid), {
        contacts: filterContacts,
      })
    }

    return
  }
}

export default Contact
