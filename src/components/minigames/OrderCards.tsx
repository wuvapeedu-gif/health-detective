import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  cards: { id: string; text: string }[];
  correctOrder: string[];
  onComplete: (correct: boolean) => void;
}

// สลับการ์ดด้วย Fisher-Yates (deterministic เพื่อ test ได้)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OrderCards({ title, cards, correctOrder, onComplete }: Props) {
  // เริ่มต้น: แสดงเรียงแบบสุ่ม
  const initial = useMemo(() => shuffle(cards), [cards]);
  const [order, setOrder] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  // คลิกการ์ดเพื่อเลือก → คลิกอีกใบเพื่อสลับ
  const handleClick = (idx: number) => {
    if (submitted) return;
    if (selected === null) { setSelected(idx); return; }
    if (selected === idx) { setSelected(null); return; }
    const newOrder = [...order];
    [newOrder[selected], newOrder[idx]] = [newOrder[idx], newOrder[selected]];
    setOrder(newOrder); setSelected(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = order.every((c, i) => c.id === correctOrder[i]);
    setTimeout(() => onComplete(correct), 1800);
  };

  const isCardCorrect = (idx: number) => submitted && order[idx].id === correctOrder[idx];
  const isCardWrong   = (idx: number) => submitted && order[idx].id !== correctOrder[idx];

  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold text-lg text-detective-700">🧩 {title}</h3>
      <p className="text-sm text-gray-600">
        แตะการ์ดเพื่อ "เลือก" แล้วแตะอีกใบเพื่อสลับตำแหน่ง — เรียงให้ถูกต้องแล้วกดยืนยัน
      </p>

      <div className="space-y-2">
        {order.map((card, i) => (
          <motion.button
            key={card.id}
            onClick={() => handleClick(i)}
            disabled={submitted}
            layout
            transition={{ type: 'spring', damping: 20 }}
            className={`w-full text-left p-4 rounded-xl border-2 flex items-center gap-3 ${
              isCardCorrect(i) ? 'bg-success-50 border-success-500'
              : isCardWrong(i) ? 'bg-danger-50 border-danger-500'
              : selected === i ? 'bg-detective-50 border-detective-500 scale-[1.02]'
              : 'bg-white border-detective-100'
            }`}
          >
            <span className="bg-detective-500 text-white w-8 h-8 rounded-full flex items-center
                             justify-center font-bold flex-shrink-0">{i + 1}</span>
            <span className="text-gray-800 leading-relaxed flex-1">{card.text}</span>
            {isCardCorrect(i) && <span className="text-success-500 font-bold">✓</span>}
            {isCardWrong(i) && <span className="text-danger-500 font-bold">✗</span>}
          </motion.button>
        ))}
      </div>

      {!submitted && (
        <button onClick={handleSubmit} className="btn-primary w-full">
          ยืนยันลำดับ
        </button>
      )}
    </div>
  );
}
