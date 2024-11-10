import { createContext } from 'react'

interface ISnackbarOptions {
  severity: "success" | "info" | "error"
  autoHideDuration: number
}

interface ISnackbarQueueItem {
  text: string
  severity: "success" | "info" | "error"
  autoHideDuration: number
}

interface ISnackbarContext {
  queue: ISnackbarQueueItem[] 
  show: (text: string, opts: ISnackbarOptions) => void
  onClose: () => string
}

const SnackBarContext = createContext<ISnackbarContext>({
  queue: [],
  show: () => {},
  onClose: () => ""
})
