import { Alert as MuiAlert, LinearProgress, Slide, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface AlertPortalProps {
    alert: {
        type: 'success' | 'error' | 'info'
        message: string
    }
}

export const AlertPortal = ({ alert }: AlertPortalProps) => {
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev > 0 ? prev - 2.5 : 0))
        }, 70)

        return () => clearInterval(interval)
    }, [])

    return createPortal(
        <Snackbar
            open
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={Slide}
        >
            <MuiAlert
                severity={alert.type}
                variant="filled"
                sx={{ width: '100%', position: 'relative', flexDirection: 'column' }}
            >
                {alert.message}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: '100%', marginTop: 1 }}
                    color={alert.type === 'error' ? 'error' : alert.type === 'success' ? 'success' : 'info'}
                />
            </MuiAlert>
        </Snackbar>,
        document.body
    )
}
