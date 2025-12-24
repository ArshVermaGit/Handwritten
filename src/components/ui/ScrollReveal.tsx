import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';
    delay?: number;
    duration?: number;
    className?: string;
    viewportAmount?: number;
}

export default function ScrollReveal({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.5,
    className = '',
    viewportAmount = 0.3
}: ScrollRevealProps) {

    const getVariants = () => {
        switch (animation) {
            case 'fade-up':
                return {
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 }
                };
            case 'fade-in':
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                };
            case 'slide-left':
                return {
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'slide-right':
                return {
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'scale':
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                };
            default:
                return {
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 }
                };
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: viewportAmount }}
            variants={getVariants()}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.22, 1, 0.36, 1] // Custom quint-like easing
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
