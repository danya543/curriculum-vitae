import {
    Alert as MuiAlert,
    LinearProgress,
    Slide,
    Snackbar,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { AlertPortalProps } from '@/types/types'

export const AlertPortal = ({ type, message, duration = 3000 }: AlertPortalProps) => {
    const [progress, setProgress] = useState(100)
    const [open, setOpen] = useState(true)
    const animationRef = useRef<number | null>(null)
    const startRef = useRef<number | null>(null)

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startRef.current) startRef.current = timestamp
            const elapsed = timestamp - startRef.current
            const percentage = Math.max(100 - (elapsed / duration) * 100, 0)
            setProgress(percentage)

            if (elapsed < duration) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                setOpen(false)
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return createPortal(
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={Slide}
        >
            <MuiAlert
                severity={type}
                variant="filled"
                sx={{
                    width: '100%',
                    position: 'relative',
                    flexDirection: 'column',
                }}
            >
                {message}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: '100%', marginTop: 1 }}
                    color={type}
                />
            </MuiAlert>
        </Snackbar>,
        document.body
    )
}
