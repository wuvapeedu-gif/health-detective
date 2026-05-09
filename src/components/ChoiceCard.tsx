import { motion } from 'framer-motion';
import type { Choice } from '../types';

interface Props {
  choice: Choice;
  index: number;
  onPick: (c: Choice) => void;
  disabled?: boolean;
}

export default function ChoiceCard({ choice, index, onPick, disabled }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onPick(choice)}
      disabled={disabled}
      className="w-full text-left bg-white border-2 border-detective-100 hover:border-detective-500
                 rounded-xl p-4 mb-2 shadow-sm transition-colors disabled:opacity-50
                 active:bg-detective-50"
    >
      <div className="flex items-start gap-3">
        <span className="bg-detective-500 text-white rounded-full w-7 h-7 flex items-center
                         justify-center text-sm font-bold flex-shrink-0">
          {String.fromCharCode(65 + index)}
        </span>
        <span className="text-gray-800 leading-relaxed">{choice.label}</span>
      </div>
    </motion.button>
  );
}
