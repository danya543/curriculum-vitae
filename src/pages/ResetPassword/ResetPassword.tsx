import { gql, useMutation } from '@apollo/client';
import { Box, Button, FormControl, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { noAuthClient } from '@/api/noAuthClient';
import { redInputSx } from '@/components/constants';
import { useAlert } from '@/ui/Alert/useAlert';

const RESET_PASSWORD = gql`
  mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
  }
`;

export const ResetPassword = () => {
    const [params] = useSearchParams();
    const token = params.get('token');
    const [newPassword, setNewPassword] = useState('');

    const [resetPassword, { loading, error, data }] = useMutation(RESET_PASSWORD, {
        client: noAuthClient,
        context: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        resetPassword({
            variables: {
                auth: { newPassword },
            },
        });
    };

    const { showAlert } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            showAlert({ type: 'error', message: 'Failed to reset password' });
        }
        if (data) {
            showAlert({ type: 'success', message: 'Password successfully changed!' });
            setTimeout(() => navigate('/auth/login'), 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, data]);

    return (
        <Box component={'section'}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    minWidth: 400,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                }}
            >
                <h1>Enter new password</h1>
                <FormControl fullWidth>
                    <TextField
                        type="password"
                        label="New password"
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        sx={redInputSx}
                    />
                </FormControl>
                <Button
                    type="submit"
                    sx={{ color: 'rgb(198, 48, 49)', cursor: 'pointer', '&:hover': { background: '#2e2e2e' }, }}
                    disabled={loading || !newPassword}
                >
                    {loading ? 'Reset...' : 'Reset password'}
                </Button>
            </Box>
        </Box>
    );
};
