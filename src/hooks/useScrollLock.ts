import { useEffect } from 'react';

export function useScrollLock(lock: boolean) {
    useEffect(() => {
        if (lock) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [lock]);
}
