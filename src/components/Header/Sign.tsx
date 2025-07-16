import { Box, Tab, Tabs } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export const SignHeader = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const currentTab = location.pathname.includes('/register') ? 'register' : 'login'

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        navigate(`/sign/${newValue}`)
    }

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
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
                    label="Вход"
                    value="login"
                    sx={{
                        color: currentTab === 'login' ? '#C63031' : 'inherit',
                        fontWeight: currentTab === 'login' ? 600 : 400,
                    }}
                />
                <Tab
                    label="Регистрация"
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
