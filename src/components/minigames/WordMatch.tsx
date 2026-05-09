import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { WordMatchPair } from '../../types';

interface Props {
  title: string;
  pairs: WordMatchPair[];
  onComplete: (allCorrect: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ItemL { side: 'L'; pairIdx: number; text: string }
interface ItemR { side: 'R'; pairIdx: number; text: string }

// จับคู่คำ — แตะคำซ้าย แล้วแตะคำขวาที่จับคู่กัน
export default function WordMatch({ title, pairs, onComplete }: Props) {
  const lefts = useMemo<ItemL[]>(
    () => shuffle(pairs.map((p, i) => ({ side: 'L' as const, pairIdx: i, text: p.left }))),
    [pairs]
  );
  const rights = useMemo<ItemR[]>(
    () => shuffle(pairs.map((p, i) => ({ side: 'R' as const, pairIdx: i, text: p.right }))),
    [pairs]
  );

  // เก็บการจับคู่: leftPairIdx -> rightPairIdx (ถ้าตรง = ถูก)
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [pendingLeft, setPendingLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const matchedLefts  = new Set(Object.keys(matches).map(Number));
  const matchedRights = new Set(Object.values(matches));

  const handleLeft = (pairIdx: number) => {
    if (submitted || matchedLefts.has(pairIdx)) return;
    setPendingLeft(pairIdx);
  };

  const handleRight = (pairIdx: number) => {
    if (submitted || matchedRights.has(pairIdx)) return;
    if (pendingLeft === null) return;
    setMatches(m => ({ ...m, [pendingLeft]: pairIdx }));
    setPendingLeft(null);
  };

  const handleClear = (leftPairIdx: number) => {
    if (submitted) return;
    const next = { ...matches };
    delete next[leftPairIdx];
    setMatches(next);
  };

  const allMatched = Object.keys(matches).length === pairs.length;
  const correctCount = Object.entries(matches).reduce(
    (sum, [l, r]) => sum + (Number(l) === r ? 1 : 0),
    0
  );

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onComplete(correctCount === pairs.length), 1800);
  };

  const isCorrect = (leftPairIdx: number) =>
    submitted && matches[leftPairIdx] === leftPairIdx;
  const isWrong = (leftPairIdx: number) =>
    submitted && matches[leftPairIdx] !== undefined && matches[leftPairIdx] !== leftPairIdx;

  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold text-lg text-detective-700">🔗 {title}</h3>
      <p className="text-sm text-gray-600">
        แตะคำฝั่งซ้ายก่อน แล้วแตะคำฝั่งขวาที่จับคู่กัน — กดซ้ำเพื่อยกเลิก
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* ซ้าย */}
        <div className="space-y-2">
          {lefts.map(item => {
            const matched = matchedLefts.has(item.pairIdx);
            const pending = pendingLeft === item.pairIdx;
            const correct = isCorrect(item.pairIdx);
            const wrong   = isWrong(item.pairIdx);
            return (
              <motion.button
                key={`L${item.pairIdx}`}
                whileTap={{ scale: 0.97 }}
                onClick={() => matched ? handleClear(item.pairIdx) : handleLeft(item.pairIdx)}
                disabled={submitted}
                className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                  correct ? 'bg-success-50 border-success-500 text-success-600'
                  : wrong  ? 'bg-danger-50 border-danger-500 text-danger-600'
                  : matched ? 'bg-detective-100 border-detective-400 text-detective-700'
                  : pending ? 'bg-warning-50 border-warning-500 ring-2 ring-warning-300'
                  : 'bg-white border-detective-100'
                }`}
              >
                {item.text}
                {matched && !submitted && <span className="float-right opacity-60">✕</span>}
              </motion.button>
            );
          })}
        </div>

        {/* ขวา */}
        <div className="space-y-2">
          {rights.map(item => {
            const matched = matchedRights.has(item.pairIdx);
            const fromLeft = Object.entries(matches).find(([, r]) => r === item.pairIdx)?.[0];
            const correct = submitted && fromLeft !== undefined && Number(fromLeft) === item.pairIdx;
            const wrong   = submitted && matched && !correct;
            return (
              <motion.button
                key={`R${item.pairIdx}`}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRight(item.pairIdx)}
                disabled={submitted || matched}
                className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${
                  correct ? 'bg-success-50 border-success-500 text-success-600'
                  : wrong  ? 'bg-danger-50 border-danger-500 text-danger-600'
                  : matched ? 'bg-detective-100 border-detective-400 text-detective-700 opacity-70'
                  : pendingLeft !== null ? 'bg-white border-detective-300 hover:border-detective-500'
                  : 'bg-white border-detective-100'
                }`}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allMatched}
          className="btn-primary w-full disabled:opacity-50"
        >
          ยืนยันการจับคู่
        </button>
      )}

      {submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-2">
          <p className="font-semibold">
            จับคู่ถูก {correctCount}/{pairs.length}
          </p>
        </motion.div>
      )}
    </div>
  );
}
