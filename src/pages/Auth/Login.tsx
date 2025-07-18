import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { type ChangeEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth';
import { login } from '@/services/authService'
import { useAlert } from '@/ui/Alert/useAlert';

export const Login = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            setTimeout(() => navigate('/users'), 3500)
        }
    }, [isAuthenticated, navigate])

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const toggleShowPassword = () => setShowPassword(show => !show)

    const { showAlert } = useAlert()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(form);
            showAlert({ type: 'success', message: 'Log in successfully' })
        } catch (err) {
            showAlert({ type: 'error', message: 'Login error' })
            console.error(err)
        }
    }


    return (
        <Box
            component="form"
            sx={{
                width: 400,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
            }}
            onSubmit={handleSubmit}
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
                value={form.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
            />
            <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
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
