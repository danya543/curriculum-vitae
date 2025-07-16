import { Outlet } from 'react-router-dom';

import { MainHeader } from '@/components/Header/Main';

export const MainLayout = () => {
    return (
        <section>
            <MainHeader />
            <main>
                <Outlet />
            </main>
        </section>
    );
};
