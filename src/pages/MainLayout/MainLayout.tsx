import { Box } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { SideMenu } from '@/components/SideMenu/SideMenu'

export const MainLayout = () => {
    const [open, setOpen] = useState(true)
    const toggleMenu = () => setOpen(prev => !prev)

    return (
        <Box>
            <SideMenu open={open} toggleMenu={toggleMenu} />
            <Box
                component="main"
                sx={{
                    ml: open ? '240px' : '56px',
                    transition: 'margin-left 0.3s ease-in-out',
                    p: 3,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}
