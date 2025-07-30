import { ApolloError, useLazyQuery } from '@apollo/client';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { type ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { LOGIN } from '@/api/mutations/auth';
import { redInputSx, setInfo, setTokens } from '@/components/constants';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/ui/Alert/useAlert';

type LoginForm = { email: string; password: string };

const getApolloErrorMessage = (e: ApolloError) => {
    const gqlMsg = e.graphQLErrors?.[0]?.message;
    if (gqlMsg) return gqlMsg;

    const networkMsg =
        // @ts-expect-error - networkError 
        e.networkError?.result?.errors?.[0]?.message ||
        e.networkError?.message;

    return networkMsg || e.message || 'Unknown error';
};

export const Login = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/users');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const [submittedSnapshot, setSubmittedSnapshot] = useState<LoginForm | null>(null);

    const [loginQuery, { loading }] = useLazyQuery(LOGIN, {
        fetchPolicy: 'no-cache',
        onCompleted: ({ login }) => {
            if (login?.access_token && login?.refresh_token) {
                setTokens(login.access_token, login.refresh_token);
                setInfo(login.user.id, login.user.role);
                showAlert({ type: 'success', message: 'Log in successfully' });
                navigate('/users');
            }
        },
        onError: (e) => {
            const message = getApolloErrorMessage(e);
            showAlert({ type: 'error', message });
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleShowPassword = () => setShowPassword((show) => !show);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const isPasswordValid = form.password.trim().length > 0;
    const isFormValid = isEmailValid && isPasswordValid;

    const isChangedSinceLastSubmit =
        !submittedSnapshot ||
        form.email !== submittedSnapshot.email ||
        form.password !== submittedSnapshot.password;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isChangedSinceLastSubmit) return;

        setSubmittedSnapshot({ ...form });

        await loginQuery({
            variables: {
                auth: {
                    email: form.email,
                    password: form.password,
                },
            },
        });
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
                sx={redInputSx}
                error={!!form.email && !isEmailValid}
                helperText={form.email && !isEmailValid ? 'Invalid email' : ''}
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
                sx={redInputSx}
                error={!isPasswordValid && !!form.password}
                helperText={!isPasswordValid && !!form.password ? 'Password is required' : ''}
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
                disabled={!isFormValid || loading || !isChangedSinceLastSubmit}
                sx={{
                    backgroundColor: 'rgb(198, 48, 49)',
                    ':hover': { backgroundColor: 'rgb(170, 40, 42)' },
                }}
            >
                {loading ? 'Logging in…' : 'Log in'}
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
    );
};
