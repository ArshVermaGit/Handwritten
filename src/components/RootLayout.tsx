import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';

export default function RootLayout() {
    const location = useLocation();
    const isEditor = location.pathname === '/editor';

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-hidden">
            {!isEditor && <Navbar />}
            <div className={`${isEditor ? 'h-screen' : 'pt-24 pb-20 md:pb-0'} flex-1 flex flex-col`}>
                {!isEditor && <Breadcrumbs />}
                <main className="flex-1 relative">
                    <Outlet />
                </main>
            </div>
            {!isEditor && <Footer />}
        </div>
    );
}
