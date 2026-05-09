import { usePlayerStore } from '../store/playerStore';
import { getLevelByXP, getNextLevel, getProgressToNextLevel } from '../lib/levels';

export default function XPBar() {
  const xp = usePlayerStore(s => s.totalXP);
  const lv = getLevelByXP(xp);
  const next = getNextLevel(xp);
  const progress = getProgressToNextLevel(xp);

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">{lv.emoji}</span>
          <span className="font-semibold text-detective-700">Lv.{lv.level} {lv.name}</span>
        </div>
        <span className="text-sm text-gray-500">{xp} XP</span>
      </div>
      <div className="h-3 bg-detective-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-detective-500 to-warning-500 transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {next ? (
        <p className="text-xs text-gray-500 mt-1">
          อีก {next.minXP - xp} XP จะถึง {next.name}
        </p>
      ) : (
        <p className="text-xs text-success-600 font-semibold mt-1">🏆 ระดับสูงสุดแล้ว!</p>
      )}
    </div>
  );
}
