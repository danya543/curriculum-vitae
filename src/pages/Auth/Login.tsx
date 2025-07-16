import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { type ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export const Login = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLoginData(prev => ({ ...prev, [name]: value }))
    }

    const toggleShowPassword = () => setShowPassword(show => !show)

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
                Welcome back
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" mb={2}>
                Hello again! Log in to continue
            </Typography>

            <TextField
                label="Email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
            />
            <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
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
                    backgroundColor: 'rgb(198, 48, 49)',
                    ':hover': { backgroundColor: 'rgb(170, 40, 42)' },
                }}
            >
                Log in
            </Button>

            <Box textAlign="center" mt={1}>
                <Link
                    to="/forgot-password"
                    style={{
                        color: 'rgb(118, 118, 118)',
                        textDecoration: 'none',
                        fontWeight: 500,
                    }}
                >
                    Forgot password?
                </Link>
            </Box>
        </Box>
    )
}
