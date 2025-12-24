import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import MobileNav from './MobileNav';
import WelcomeModal from './onboarding/WelcomeModal';
import TourOverlay from './onboarding/TourOverlay';
import { useState } from 'react';

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

export default function RootLayout() {
    const location = useLocation();
    const [isTourOpen, setIsTourOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-hidden">
            <Navbar />
            <div className="pt-24 pb-20 md:pb-0 flex-1">
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
            <MobileNav />
            <WelcomeModal onStartTour={() => setIsTourOpen(true)} />
            <TourOverlay isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
        </div>
    );
}
