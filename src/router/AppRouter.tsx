import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Login } from '@/pages/Auth/Login';
import { Register } from '@/pages/Auth/Register';
import { AuthLayout } from '@/pages/AuthLayout/AuthLayout';
import { CVPage } from '@/pages/CV/CV';
import { CVs } from '@/pages/CVs/CVs';
import { ForgotPassword } from '@/pages/ForgotPassword/ForgotPassword';
import { Languages } from '@/pages/Languages/Languages';
import { MainLayout } from '@/pages/MainLayout/MainLayout';
import { ResetPassword } from '@/pages/ResetPassword/ResetPassword';
import { ProfileSkills } from '@/pages/Skills/Skills';
import { UserPage } from '@/pages/User/User';
import { UsersPage } from '@/pages/Users/Users';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="auth/login" replace />,
            },
            {
                path: 'users',
                element: (
                    <Suspense fallback={'Loader'}>
                        <UsersPage />
                    </Suspense>
                ),
            },
            {
                path: 'users/:id',
                element: (
                    <Suspense fallback={'Loader'}>
                        <UserPage />
                    </Suspense>
                ),
            },
            {
                path: 'languages',
                element: (
                    <Suspense fallback={'Loader'}>
                        <Languages />
                    </Suspense>
                ),
            },
            {
                path: 'skills',
                element: (
                    <Suspense fallback={'Loader'}>
                        <ProfileSkills />
                    </Suspense>
                ),
            },
            {
                path: 'cvs',
                element: (
                    <Suspense fallback={'Loader'}>
                        <CVs />
                    </Suspense>
                ),
            },
            {
                path: 'cvs/:id',
                element: (
                    <Suspense fallback={'Loader'}>
                        <CVPage />
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
                path: 'signup',
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
    {
        path: '/reset-password',
        element: (
            <Suspense fallback={'Loader'}>
                <ResetPassword />
            </Suspense>
        ),
    },
])
