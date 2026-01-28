import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
    fillHeight?: boolean;
}

export const ScrollReveal = ({ 
    children, 
    width = "100%", 
    delay = 0.1, 
    direction = "up",
    className = "",
    fillHeight = false
}: ScrollRevealProps) => {
    
    const getInitialProps = () => {
        switch (direction) {
            case "up": return { opacity: 0, y: 30 };
            case "down": return { opacity: 0, y: -30 };
            case "left": return { opacity: 0, x: 30 };
            case "right": return { opacity: 0, x: -30 };
            default: return { opacity: 0, y: 30 };
        }
    };

    return (
        <div 
            style={{ position: "relative", width, overflow: "visible" }} 
            className={`${className} ${fillHeight ? "h-full" : ""}`}
        >
            <motion.div
                variants={{
                    hidden: getInitialProps(),
                    visible: { opacity: 1, x: 0, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                    duration: 0.8, 
                    delay, 
                    ease: [0.21, 0.47, 0.32, 0.98] 
                }}
                className={fillHeight ? "h-full" : ""}
            >
                {children}
            </motion.div>
        </div>
    );
};
