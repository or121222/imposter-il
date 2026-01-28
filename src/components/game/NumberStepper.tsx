import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
}

export const NumberStepper = ({ value, onChange, min, max, label }: NumberStepperProps) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <motion.button
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary disabled:opacity-30 disabled:cursor-not-allowed"
        whileHover={{ scale: value > min ? 1.05 : 1 }}
        whileTap={{ scale: value > min ? 0.95 : 1 }}
      >
        <Minus className="w-6 h-6" />
      </motion.button>

      <div className="min-w-[60px] text-center">
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold text-primary"
        >
          {value}
        </motion.span>
        {label && (
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        )}
      </div>

      <motion.button
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary disabled:opacity-30 disabled:cursor-not-allowed"
        whileHover={{ scale: value < max ? 1.05 : 1 }}
        whileTap={{ scale: value < max ? 0.95 : 1 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};
