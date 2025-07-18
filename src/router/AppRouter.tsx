import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { CVs } from '@/components/CVs/CVs';
import { Languages } from '@/components/Languages/Languages';
import { Skills } from '@/components/Skills/Skills';
import { Login } from '@/pages/Auth/Login';
import { Register } from '@/pages/Auth/Register';
import { AuthLayout } from '@/pages/AuthLayout/AuthLayout';
import { CVPage } from '@/pages/CV/CV';
import { ForgotPassword } from '@/pages/ForgotPassword/ForgotPassword';
import { MainPage } from '@/pages/Main/Main';
import { MainLayout } from '@/pages/MainLayout/MainLayout';
import { UserPage } from '@/pages/User/User';
import { UsersPage } from '@/pages/Users/Users';

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
                        <Skills />
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
