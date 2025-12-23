import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

export default function RootLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-hidden">
            <Navbar />
            <div className="pt-24 flex-1">
                <Breadcrumbs />
                <motion.main
                    key={location.pathname}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="flex-1"
                >
                    <Outlet />
                </motion.main>
            </div>
            <Footer />
        </div>
    );
}
