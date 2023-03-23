import { storage } from './storage'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

class Storage {
  static async storeImage(image: File): Promise<string | null> {
    const arr = image.name.split(".")
    const uuid = window.crypto.randomUUID()

    const new_fileName = `images/${uuid}.${arr[arr.length - 1]}`
    const fileRef = ref(storage, new_fileName)

    const snapshot = await uploadBytesResumable(fileRef, image)
    const url = await getDownloadURL(snapshot.ref)

    return url
  } 
}

export default Storage