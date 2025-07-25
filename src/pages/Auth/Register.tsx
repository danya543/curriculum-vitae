import { useMutation } from '@apollo/client';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SIGNUP } from '@/api/mutations/auth';
import { setId, setTokens } from '@/components/constants';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/ui/Alert/useAlert';

export const Register = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const { isAuthenticated } = useAuth()
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/users')
        }
    }, [])

    const [signup, { loading }] = useMutation(SIGNUP);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = 'Invalid email format';
            }
        } else if (name === 'password') {
            if (!value) {
                error = 'Password is required';
            } else if (value.length < 6) {
                error = 'Password must be at least 6 characters';
            }
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const isFormValid = !errors.email && !errors.password && form.email && form.password;

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        validateField('email', form.email);
        validateField('password', form.password);
        if (!isFormValid) return;

        try {
            const { data } = await signup({
                variables: {
                    auth: {
                        email: form.email,
                        password: form.password
                    }
                }
            })

            const { access_token, refresh_token, user } = data.signup
            if (access_token && user) {
                setTokens(access_token, refresh_token)
                setId(user.id)
                showAlert({ type: 'success', message: 'Sign up successfully' })
                navigate('/users')
            }
        } catch (err) {
            console.error(err);
            showAlert({ type: 'error', message: 'Sign up error' });
        }
    };

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
                disabled={!isFormValid || loading}
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
                        e.preventDefault();
                        navigate('/users');
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
    );
};
