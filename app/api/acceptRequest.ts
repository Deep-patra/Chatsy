import type { NextApiRequest, NextApiResponse } from 'next'
import { 
  type DocumentReference,
  type DocumentData
} from 'firebase-admin/firestore'
import { db } from '../../components/utils/firebase_admin_app'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
     
  }
}
