import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material'
import { type ChangeEvent, useState } from 'react'

export const Register = () => {
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRegisterData(prev => ({ ...prev, [name]: value }))
    }

    const toggleShowPassword = () => setShowPassword(prev => !prev)

    return (
        <Box
            component="form"
            sx={{
                maxWidth: 360,
                mx: 'auto',
                mt: 8,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
            }}
            noValidate
            autoComplete="off"
        >
            <Typography variant="h5" component="h3" textAlign="center">
                Зарегистрируйтесь
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" mb={2}>
                Добро пожаловать! Создайте аккаунт, чтобы продолжить
            </Typography>

            <TextField
                label="Username"
                name="username"
                value={registerData.username}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
            />
            <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={toggleShowPassword} edge="end" aria-label="toggle password visibility">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: 'rgba(198, 48, 49, 1)',
                    ':hover': { backgroundColor: 'rgba(170, 40, 42, 1)' }
                }}
            >
                Создать аккаунт
            </Button>

            <Box textAlign="center" mt={1}>
                <a href="#" style={{ color: 'rgb(118, 118, 118)', textDecoration: 'none', fontWeight: 500 }}>
                    У меня уже есть аккаунт
                </a>
            </Box>
        </Box>
    )
}
