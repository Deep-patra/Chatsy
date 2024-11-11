import { NextRequest } from 'next/server'

type ContextValueType =
  FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>

const context: WeakMap<NextRequest, ContextValueType> = new WeakMap()

export const getContext = (req: NextRequest): ContextValueType | undefined => {
  return context.get(req)
}

export const setContext = (req: NextRequest, value: ContextValueType) => {
  context.set(req, value)
}
