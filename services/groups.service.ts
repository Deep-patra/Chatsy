import { db } from './db'
import {
  doc,
  collection,
  getDoc,
  addDoc,
  updateDoc,
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

interface IGroup {
  name: string
  group_id: string
  photoURL: string
  members: IUserData[]
  group_chat_id: string
  created_at: Date
}

/**
 * @desc Fetches the group documents
 * @type {DocumentReference<DocumentData>}
 * @type {IGroup}
 * @param {DocumentReference<DocumentData>[]} groupRefs - An array of group document references
 * @returns {Promise<IGroup[]>} - A promise witch resolves with an array of group
 * */
async function getGroupDoc(groupRefs: DocumentReference<DocumentData>[]): Promise<IGroup[]> {
  return [] satisfies IGroup[]
}


export class Group {

  /**
   * @dec Fetches all the groups
   * @param {string} uid - Unique identifier of the user
   * */
  static async getGroups(uid: string): Promise<IGroup[]> {
     const userRef = doc(db, 'user', uid)
     const docSnap = await getDoc(userRef)

     if (!docSnap.exists()) return []

     const groupRefs = docSnap.data().groups

     return []
  }
}
