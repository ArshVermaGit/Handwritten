import { useRef, useEffect, memo, type ReactNode } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
    fillHeight?: boolean;
}

export const ScrollReveal = memo(({ 
    children, 
    width = "100%", 
    delay = 0.1, 
    direction = "up",
    className = "",
    fillHeight = false
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const getInitialProps = () => {
        switch (direction) {
            case "up": return { opacity: 0, y: 40 };
            case "down": return { opacity: 0, y: -40 };
            case "left": return { opacity: 0, x: 40 };
            case "right": return { opacity: 0, x: -40 };
            default: return { opacity: 0, y: 40 };
        }
    };

    return (
        <div 
            ref={ref}
            style={{ 
                position: "relative", 
                width, 
                overflow: "visible" 
            }} 
            className={`${className} ${fillHeight ? 'h-full flex flex-col' : ''}`}
        >
            <motion.div
                variants={{
                    hidden: getInitialProps(),
                    visible: { opacity: 1, x: 0, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ 
                    duration: 0.8, 
                    delay, 
                    ease: [0.21, 0.47, 0.32, 0.98] 
                }}
                className={fillHeight ? 'h-full flex flex-col' : ''}
                style={{ willChange: 'transform, opacity' }}
            >
                {children}
            </motion.div>
        </div>
    );
});

ScrollReveal.displayName = "ScrollReveal";
