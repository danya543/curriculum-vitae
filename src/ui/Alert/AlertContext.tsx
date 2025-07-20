import { type ReactNode, useState } from 'react'

import { AlertPortal } from './Alert'
import { type Alert, AlertContext } from './useAlert'


export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<Alert | null>(null)
    const [visible, setVisible] = useState(false)

    const showAlert = (newAlert: Alert) => {
        setAlert(newAlert)
        setVisible(true)
        setTimeout(() => setVisible(false), 4000)
    }

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {visible && alert && <AlertPortal type={alert.type} message={alert.message} />}
        </AlertContext.Provider>
    )
}