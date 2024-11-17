import type { NextRequest } from 'next/server'
import { auth, db } from './firebase_admin_app'

/**
 * @param { NextRequest } req - Request object
 * @return { Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> } a document snapshot of the user
 *
 *  @throws {InvalidSession} - invalid session cookie
 *  @throws {UserNotFound} - cannot get the user
 * */
export const getUserFromSession = async (
  req: NextRequest
): Promise<
  FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
> => {
  const session = req.cookies.get('session')

  if (!session) throw new Error('session is not valid')

  const claims = await auth.verifySessionCookie(session.value, true)

  if (!claims) throw new Error('cannot get the user from the sesssion')

  const snapshots = await db
    .collection('users')
    .where('uid', '==', claims.uid)
    .limit(1)
    .get()

  if (snapshots.size === 0) throw new Error('cannot found the user')

  const doc = snapshots.docs[0]

  return doc
}
