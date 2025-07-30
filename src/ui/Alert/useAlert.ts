import { createContext, useContext } from "react"

export interface Alert {
    type: 'success' | 'error' | 'info'
    message: string
}

export interface AlertContextType {
    showAlert: (alert: Alert) => void
}

export const AlertContext = createContext<AlertContextType>({
    showAlert: () => { },
})

export const useAlert = () => useContext(AlertContext)