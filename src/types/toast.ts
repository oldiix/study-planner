export type ToastType = 'success' | 'error' | 'info'

export type ToastMessage = {
    id: number
    message: string
    type: ToastType
}