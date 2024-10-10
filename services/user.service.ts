import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  type DocumentSnapshot,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './db'
import ContactService from '@/services/contact.service'

interface ICreateParams {
  displayName: string
  uuid: string
  email: string
  photoURL: string
}

class User {
  /**
   * @desc Returns true, if the User document exists
   * @param   {string}           uid Unique Id of the user
   * @returns {Promise<boolean>} A Promise resolved with a boolean result
   */
  static async exists(uid: string): Promise<boolean> {
    const userDoc = await getDoc(doc(db, 'user', uid))
    if (userDoc.exists()) return true
    return false
  }

  /**
   * @desc Create a new User document
   * @param   {Object} ICreateParams
   * @param   {string} ICreateParams.displayName Name of the user
   * @param   {string} ICreateParams.uuid Unique id for the user
   * @param   {string} ICreateParams.email Email of the user
   * @param   {string} ICreateParams.photoURL Profile Picture url of the user
   * @returns {Promise<void>}
   */
  static async create({
    displayName,
    uuid,
    email,
    photoURL,
  }: ICreateParams): Promise<DocumentData | null> {
    // check if the user already exists
    const userDoc = await getDoc(doc(db, 'user', uuid))

    if (userDoc.exists()) return userDoc.data()

    const docRef = doc(db, 'user', uuid)

    await setDoc(docRef, {
      name: displayName,
      createdAt: serverTimestamp(),
      email,
      photoURL,
      contacts: [],
    })

    const _doc = await getDoc(doc(db, 'user', uuid))

    if (_doc.exists()) return _doc.data()

    return null
  }

  /**
   * Get the User document
   * @param {string} uuid Unique id of the user
   * @returns {Promise<any | null>}
   */
  static async read(uuid: string): Promise<any | null> {
    const docRef = doc(db, 'user', uuid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return docSnap.data()
  }

  /**
   * Update the user document
   * @param {string} uuid
   * @param {Object} IUpdateParams
   * @param {string | undefined} IUpdateParams.name New name of the user
   * @param {string | undefined} IUpdateParams.photoURL New Profile picture url of the user
   * @returns {Promise<void>} A Promise which resolved with a void
   */
  static async update(
    uuid: string,
    { name, photoURL }: { name?: string; photoURL?: string }
  ): Promise<void> {
    const update: { name?: string; photoURL?: string } = {}

    if (name) update.name = name
    if (photoURL) update.photoURL = photoURL

    const docRef = doc(db, 'user', uuid)
    await updateDoc(docRef, {
      ...update,
    })

    return
  }

  /**
   * @param {string} uid Unique ID of the user
   * @param {string[]} contactIds Array of contact ids to be removed
   */
  static async removeContact(uid: string, contactIds: string[]) {
    // remove the contacts from the user
    await ContactService.delete(uid, contactIds)

    const promises: Promise<void>[] = []
    contactIds.forEach((id) => {
      promises.push(ContactService.delete(id, [uid]))
    })

    await Promise.all(promises)

    return
  }

  /**
   * @param {string} uuid Unique ID of the user
   * @param {(snapshot: DocumentSnapshot<DocumentData>) => void} cb  Callback which will be called on user document changes
   * @returns {Unsubscribe}
   */
  static listenForChanges(
    uuid: string,
    cb: (snapshot: DocumentSnapshot<DocumentData>) => void
  ): Unsubscribe {
    const userDoc = doc(db, 'user', uuid)

    const unsubscribe = onSnapshot(userDoc, (snapshot) => {
      cb(snapshot)
    })

    return unsubscribe
  }
}

export default User
