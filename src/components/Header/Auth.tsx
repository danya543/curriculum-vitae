import { Box, Tab, Tabs } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export const AuthHeader = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const currentTab = location.pathname.includes('/register') ? 'register' : 'login'

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        navigate(`/auth/${newValue}`)
    }

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={currentTab}
                onChange={handleChange}
                centered
                textColor="inherit"
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#C63031',
                    },
                }}
            >
                <Tab
                    label="Log in"
                    value="login"
                    sx={{
                        color: currentTab === 'login' ? '#C63031' : 'inherit',
                        fontWeight: currentTab === 'login' ? 600 : 400,
                    }}
                />
                <Tab
                    label="Register"
                    value="register"
                    sx={{
                        color: currentTab === 'register' ? '#C63031' : 'inherit',
                        fontWeight: currentTab === 'register' ? 600 : 400,
                    }}
                />
            </Tabs>
        </Box>
    )
}
