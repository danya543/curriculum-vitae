import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material'
import { type ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { signup } from '@/services/authService'
import { useAlert } from '@/ui/Alert/useAlert'

export const Register = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const { showAlert } = useAlert()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/users')
        }
    }, [isAuthenticated, navigate])

    const validate = () => {
        const newErrors = { email: '', password: '' }

        if (!form.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!form.password) {
            newErrors.password = 'Password is required'
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return !newErrors.email && !newErrors.password
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const toggleShowPassword = () => setShowPassword(prev => !prev)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await signup(form)
            showAlert({ type: 'success', message: 'Sign up successfully' })
            navigate('/')
        } catch (err) {
            console.error(err)
            showAlert({ type: 'error', message: 'Sign up error' })
        } finally {
            setLoading(false)
        }
    }

    const isSubmitDisabled = !form.email || !form.password || !!errors.email || !!errors.password || loading

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
                Register now
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" mb={2}>
                Welcome! Sign up to continue
            </Typography>

            <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={validate}
                variant="outlined"
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
            />
            <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                onBlur={validate}
                variant="outlined"
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
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
                disabled={isSubmitDisabled}
                sx={{
                    backgroundColor: 'rgba(198, 48, 49, 1)',
                    ':hover': { backgroundColor: 'rgba(170, 40, 42, 1)' }
                }}
            >
                {loading ? 'Creating...' : 'Create account'}
            </Button>

            <Box textAlign="center" mt={1}>
                <Typography
                    component="a"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()
                        navigate('/users')
                    }}
                    sx={{
                        color: 'rgb(118, 118, 118)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    I have an account
                </Typography>
            </Box>
        </Box>
    )
}
