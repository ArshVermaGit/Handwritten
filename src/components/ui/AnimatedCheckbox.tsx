import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}

export default function AnimatedCheckbox({ checked, onChange, label, className = '' }: AnimatedCheckboxProps) {
    return (
        <div
            className={`flex items-center gap-3 cursor-pointer group ${className}`}
            onClick={() => onChange(!checked)}
        >
            <div className={`relative w-6 h-6 rounded-md border-2 transition-colors duration-300 flex items-center justify-center ${checked ? 'bg-black border-black' : 'bg-white border-gray-300 group-hover:border-gray-400'
                }`}>
                <motion.div
                    initial={false}
                    animate={checked ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Check size={16} className="text-white" strokeWidth={3} />
                </motion.div>
            </div>
            {label && <span className="text-sm font-medium text-gray-700 select-none">{label}</span>}
        </div>
    );
}
