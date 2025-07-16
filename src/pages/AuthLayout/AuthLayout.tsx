import { Outlet } from 'react-router-dom';

import { AuthHeader } from '@/components/Header/Auth';

export const AuthLayout = () => {
    return (
        <section>
            <AuthHeader />
            <main>
                <Outlet />
            </main>
        </section>
    );
};
