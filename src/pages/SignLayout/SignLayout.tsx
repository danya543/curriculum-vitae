import { Outlet } from 'react-router-dom';

import { SignHeader } from '@/components/Header/Sign';

export const SignLayout = () => {
    return (
        <section>
            <SignHeader />
            <main>
                <Outlet />
            </main>
        </section>
    );
};
