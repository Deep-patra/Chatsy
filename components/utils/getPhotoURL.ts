import { IPhoto } from "@/services";

export const getPhotoURL = (photo: IPhoto | string): string => {
  if (photo instanceof Object) 
    return photo.thumbnail_url

  return photo
}
