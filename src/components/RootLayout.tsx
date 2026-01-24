import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="pt-24 flex-1 flex flex-col">
                <main className="flex-1 relative">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}
