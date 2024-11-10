import { IPhoto } from '@/services'
import { events } from './events'

type SnackbarType = "success" | "info" | "error"

interface ISnackbarPayload {
  text: string
  type: SnackbarType
}

export const dispatchSnackbarEvent = (payload: ISnackbarPayload) => {
  document.body.dispatchEvent(new CustomEvent(events.open_add_snackbar, { detail: payload }))
}

export const dispatchImagePreviewEvent = (payload: IPhoto | string) => {
  document.body.dispatchEvent(new CustomEvent(events.open_image_preview, { detail: payload }))
}
