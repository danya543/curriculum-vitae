import {
    Box,
    Button,
    TextField,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { forgotPassword } from '@/api/mutations/forgetPassword'
import { useAuth } from '@/hooks/useAuth'

export const ForgotPassword = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    const [email, setEmail] = useState('')
    const [isSent, setIsSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await forgotPassword(email)
            setIsSent(true)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Box component={'section'} sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Box
                sx={{
                    width: 400,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                {!isSent ? (
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        autoComplete="off"
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <Typography variant="h5" component="h1" textAlign="center">
                            Forgot password
                        </Typography>
                        <Typography variant="body1" textAlign="center" color="text.secondary" mb={2}>
                            We will send you an email with further instructions
                        </Typography>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgba(198, 48, 49, 1)',
                                ':hover': { backgroundColor: 'rgba(170, 40, 42, 1)' },
                            }}
                        >
                            Reset password
                        </Button>
                        <Box textAlign="center" mt={1}>
                            <Link
                                to="/auth/login"
                                style={{
                                    color: 'rgb(118, 118, 118)',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Cancel
                            </Link>
                        </Box>
                    </Box>
                ) : (
                    <Box textAlign="center">
                        <Typography variant="h5" component="h1" mb={2}>
                            Email Sent
                        </Typography>
                        <Typography variant="body1" color="text.secondary" mb={2}>
                            We have sent an email to <b>{email}</b>.
                            <br />
                            Please check your inbox and follow the instructions to reset your password.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/auth/login')}
                            sx={{
                                backgroundColor: 'rgba(198, 48, 49, 1)',
                                ':hover': { backgroundColor: 'rgba(170, 40, 42, 1)' },
                            }}
                        >
                            Go to Login
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
