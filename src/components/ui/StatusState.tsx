import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import RippleButton from './RippleButton';

interface StatusStateProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
    };
    type?: 'default' | 'error' | 'success';
    className?: string;
}

export default function StatusState({
    title,
    description,
    icon: Icon,
    action,
    type = 'default',
    className = ''
}: StatusStateProps) {
    const isError = type === 'error';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto ${className}`}
        >
            {Icon && (
                <div className={`mb-6 p-4 rounded-full ${isError ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-900'}`}>
                    <Icon size={32} strokeWidth={1.5} />
                </div>
            )}

            <h3 className="text-xl font-bold mb-2 text-gray-900 tracking-tight">
                {title}
            </h3>

            {description && (
                <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                    {description}
                </p>
            )}

            {action && (
                <RippleButton
                    onClick={action.onClick}
                    variant={isError ? 'primary' : 'primary'} // can customize further
                >
                    {action.label}
                </RippleButton>
            )}
        </motion.div>
    );
}
