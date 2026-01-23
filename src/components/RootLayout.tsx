import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import MobileNav from './MobileNav';

export default function RootLayout() {

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-hidden">
            <Navbar />
            <div className="pt-24 pb-20 md:pb-0 flex-1">
                <Breadcrumbs />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
            <Footer />
            <MobileNav />
            <MobileNav />
        </div>
    );
}
