import { motion, type Variants } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 10, // Reduced from 20 for subtle entrance
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3, // Snappier response
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -10, // Reduced from -20
        transition: {
            duration: 0.2, // Quick exit to unblock next page
            ease: "easeIn"
        }
    }
};

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className={`w-full h-full ${className}`}
        >
            {children}
        </motion.div>
    );
}
