import { motion } from 'framer-motion';

interface AnimatedSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export default function AnimatedSwitch({ checked, onChange, label }: AnimatedSwitchProps) {
    return (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(!checked)}>
            <motion.div
                className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer ${checked ? 'bg-black' : 'bg-gray-300'
                    }`}
                animate={{ backgroundColor: checked ? '#000000' : '#d1d5db' }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                    animate={{ x: checked ? 20 : 0 }}
                />
            </motion.div>
            {label && <span className="text-sm font-medium text-gray-700 select-none">{label}</span>}
        </div>
    );
}
