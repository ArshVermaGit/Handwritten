import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
}

export default function Skeleton({
    className = '',
    width = '100%',
    height = '1rem',
    borderRadius = '0.5rem'
}: SkeletonProps) {
    return (
        <motion.div
            className={`bg-gray-200 ${className}`}
            style={{
                width,
                height,
                borderRadius
            }}
            animate={{
                opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}
