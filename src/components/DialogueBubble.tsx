import { motion } from 'framer-motion';
import type { SpeakerKey } from '../types';

const SPEAKERS: Record<SpeakerKey, { name: string; emoji: string; align: 'left' | 'right'; bg: string }> = {
  narrator:      { name: 'เล่าเรื่อง',    emoji: '📖', align: 'left',  bg: 'bg-gray-100 text-gray-700' },
  player:        { name: 'คุณ',          emoji: '🧒', align: 'right', bg: 'bg-detective-500 text-white' },
  doctor:        { name: 'พี่หมอเก๋',     emoji: '👩‍⚕️', align: 'left',  bg: 'bg-success-50 text-gray-800' },
  baitoey:       { name: 'น้องใบเตย',    emoji: '🌿', align: 'left',  bg: 'bg-warning-50 text-gray-800' },
  vapor:         { name: 'Vapor',       emoji: '👤', align: 'left',  bg: 'bg-danger-50 text-gray-800' },
  friend1:       { name: 'เพื่อน',       emoji: '🧑', align: 'left',  bg: 'bg-blue-50 text-gray-800' },
  friend2:       { name: 'เพื่อน',       emoji: '👦', align: 'left',  bg: 'bg-purple-50 text-gray-800' },
  shopkeeper:    { name: 'เจ้าของร้าน',   emoji: '🧓', align: 'left',  bg: 'bg-yellow-50 text-gray-800' },
  'dm-stranger': { name: 'คนใน DM',     emoji: '💬', align: 'left',  bg: 'bg-red-50 text-gray-800' },
  system:        { name: 'ระบบ',        emoji: '⚙️', align: 'left',  bg: 'bg-gray-200 text-gray-700' },
};

interface Props {
  speaker: SpeakerKey;
  text: string;
}

export default function DialogueBubble({ speaker, text }: Props) {
  const s = SPEAKERS[speaker];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 mb-3 ${s.align === 'right' ? 'flex-row-reverse' : ''}`}
    >
      <div className="text-2xl flex-shrink-0">{s.emoji}</div>
      <div className={`flex flex-col ${s.align === 'right' ? 'items-end' : 'items-start'} max-w-[85%]`}>
        <span className="text-xs text-gray-500 mb-1 px-1">{s.name}</span>
        <div className={`px-4 py-2 rounded-2xl ${s.bg} ${s.align === 'right' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
          <p className="leading-relaxed whitespace-pre-line">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}
