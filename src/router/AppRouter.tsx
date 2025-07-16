import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Login } from '@/pages/Auth/Login';
import { Register } from '@/pages/Auth/Register';
import { AuthLayout } from '@/pages/AuthLayout/AuthLayout';
import { ForgotPassword } from '@/pages/ForgotPassword/ForgotPassword';
import { MainPage } from '@/pages/Main/Main';
import { MainLayout } from '@/pages/MainLayout/MainLayout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: (
                    <Suspense fallback={'Loader'}>
                        <MainPage />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: (
                    <Suspense fallback={'Loader'}>
                        <Login />
                    </Suspense>
                ),
            },
            {
                path: 'register',
                element: (
                    <Suspense fallback={'Loader'}>
                        <Register />
                    </Suspense>
                ),
            },
        ]
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
])
