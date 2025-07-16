import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { Login } from '@/pages/Auth/Login';
import { Register } from '@/pages/Auth/Register';
import { MainPage } from '@/pages/Main/Main';
import { MainLayout } from '@/pages/MainLayout/MainLayout';
import { SignLayout } from '@/pages/SignLayout/SignLayout';

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
        path: '/sign',
        element: <SignLayout />,
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
    }
])
