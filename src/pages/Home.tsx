import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import { SCENARIO_META, isStageUnlocked } from '../scenarios';
import XPBar from '../components/XPBar';

const AVATAR_EMOJI = ['🧒', '👧', '👦', '🧑'];

export default function Home() {
  const nav = useNavigate();
  const player = usePlayerStore();
  const certEligible = player.stagesCompleted.length >= 8 || player.totalXP >= 1500;

  return (
    <div className="min-h-full bg-gradient-to-b from-detective-50 to-white pb-8">
      {/* Header */}
      <header className="bg-detective-500 text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center text-3xl">
            {AVATAR_EMOJI[player.avatar - 1] || '🧒'}
          </div>
          <div className="flex-1">
            <p className="text-detective-100 text-sm">นักสืบ</p>
            <h2 className="font-display font-bold text-xl">{player.nickname || 'ผู้เล่น'}</h2>
          </div>
          <button onClick={() => nav('/profile')}
            className="bg-white/20 rounded-full p-2 active:bg-white/30">
            <span className="text-xl">⚙️</span>
          </button>
        </div>
        <div className="mt-4 bg-white/10 rounded-xl p-3">
          <XPBar />
        </div>
      </header>

      {/* Body */}
      <main className="max-w-md mx-auto px-4 mt-6">
        {certEligible && !player.certificateNo && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card border-2 border-warning-500 bg-warning-50 mb-4">
            <p className="text-warning-600 font-bold mb-2">🏆 พร้อมรับ Certificate แล้ว!</p>
            <button onClick={() => nav('/certificate')} className="btn-primary w-full">
              รับใบประกาศนียบัตร
            </button>
          </motion.div>
        )}

        {player.certificateNo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card border-2 border-success-500 bg-success-50 mb-4">
            <p className="text-success-600 font-bold mb-1">🏆 Certificate ของคุณ</p>
            <p className="text-sm text-gray-600 mb-2">เลขที่ {player.certificateNo}</p>
            <button onClick={() => nav('/certificate')} className="btn-secondary w-full">
              ดู Certificate
            </button>
          </motion.div>
        )}

        <h3 className="font-display font-bold text-detective-700 mb-3 text-lg">📍 แผนที่ภารกิจ</h3>

        <div className="space-y-3">
          {SCENARIO_META.map((meta, i) => {
            const unlocked = isStageUnlocked(meta.id, player.stagesCompleted);
            const completed = player.stagesCompleted.includes(meta.id);
            const playable = meta.available && unlocked;

            return (
              <motion.button
                key={meta.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                disabled={!playable}
                onClick={() => playable && nav(`/scenario/${meta.id}`)}
                className={`w-full text-left card flex items-center gap-3 ${
                  !playable ? 'opacity-60 grayscale' : 'active:scale-[0.98]'
                } ${completed ? 'border-2 border-success-500' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  completed ? 'bg-success-500 text-white'
                  : playable ? 'bg-detective-500 text-white'
                  : 'bg-gray-300 text-gray-500'
                }`}>
                  {completed ? '✓' : meta.id}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{meta.title}</p>
                  <p className="text-xs text-gray-500">
                    {!meta.available ? '🚧 เร็วๆ นี้'
                      : !unlocked ? `🔒 ปลดล็อกหลังจบด่าน ${meta.unlockAfter}`
                      : meta.subtitle}
                  </p>
                  {meta.estMinutes && playable && (
                    <p className="text-xs text-gray-400 mt-0.5">⏱ ~{meta.estMinutes} นาที</p>
                  )}
                </div>
                {playable && <span className="text-detective-500 text-2xl">→</span>}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          v0.1.0 — MVP (ด่าน 1-2 พร้อมเล่น)
        </div>
      </main>
    </div>
  );
}
