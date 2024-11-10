import { Unsubscribe } from 'firebase/auth'
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  limit,
  onSnapshot,
  type DocumentData,
  type QueryDocumentSnapshot,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../db'

export class UserService {

  /**
   * Get the User document from the firestore database.
   *
   * @param  {string} user_id - user identifier number
   * @returns {Promise<DocumentData | undefined>} - Promise which resolve with Document Data or undefined if the user doesn't exists.
   * */
  static async get(user_id: string): Promise<DocumentData | undefined> {
    const userRef = doc(db, 'users', user_id)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists())
      throw new Error("User Document doesn't exists")

    return { id: userDoc.id, ...userDoc.data() }
  }

  static async getWithUID(uid: string): Promise<QueryDocumentSnapshot<DocumentData>> {
    const q = query(collection(db, 'users'), where('uid', '==', uid), limit(1))
    const snapshots = await getDocs(q)
  
    if (snapshots.empty) 
      throw new Error("Cannot find User with UID")

    const docs = snapshots.docs
    return docs[0]
  } 

  static async update(
    user_id: string,
    data: { name?: string, photo?: File | string, description?: string }
  ): Promise<boolean> {
    const formdata = new FormData()

    formdata.append('user_id', user_id)

    if (data.name)
      formdata.append('name', data.name)

    if (data.description)
      formdata.append('description', data.description)
    
    if (data.photo) 
      formdata.append('photo', data.photo)    


    const res = await fetch('/api/user/update', {
      method: 'POST',
      body: formdata
    })

    if (res.status != 200) 
      throw new Error(((await res.json()).error) || "ERROR in User::Update::Method")

    const json = await res.json()

    return json
  }

  static async exists(user_id: string): Promise<boolean> {
    const userRef = doc(collection(db, 'users'), user_id)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) return true
    return false
  }

  static async create(uid: string, email: string, name?: string, description?: string) {
    const formdata = new FormData() 
    formdata.append('uid', uid)
    formdata.append('email', email)

    name && formdata.append('name', name)
    description && formdata.append('description', description)

    const res = await fetch('/api/user/create', {
      method: 'POST',
      body: formdata
    })

    if (res.status == 400) 
      throw new Error(( await res.json() ).error || "Error in User::Create::Method")

    const json = await res.json()
    return json
  }

  static listenForUserChanges(user_id: string, cb: (snapshot: DocumentSnapshot<DocumentData>) => void): Unsubscribe {
    const ref = doc(collection(db, 'users'), user_id)
    const unsub = onSnapshot(ref, cb)

    return unsub
  }
}
