import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { AuthHeader } from '@/components/Header/Auth'

export const AuthLayout = () => {
    return (
        <Box component="section"
            sx={{
                height: '100%',
            }}>
            <AuthHeader />
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100vh - 50px)',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}
