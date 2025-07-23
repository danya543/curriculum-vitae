import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { noAuthClient } from '@/api/noAuthClient';

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

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>Reset</button>
            {error && <div>Error: {error.message}</div>}
            {data && <div>Password reset successful</div>}
        </form>
    );
};
