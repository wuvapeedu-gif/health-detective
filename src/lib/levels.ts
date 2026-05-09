export interface Level {
  level: number;
  name: string;
  minXP: number;
  emoji: string;
  description: string;
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Rookie',         minXP: 0,    emoji: '🌱', description: 'นักสืบมือใหม่' },
  { level: 2, name: 'Investigator',   minXP: 200,  emoji: '🔍', description: 'นักสืบฝึกหัด' },
  { level: 3, name: 'Detective',      minXP: 500,  emoji: '🕵️', description: 'นักสืบเต็มตัว' },
  { level: 4, name: 'Senior Detective', minXP: 900, emoji: '⭐', description: 'นักสืบอาวุโส' },
  { level: 5, name: 'Health Legend',  minXP: 1500, emoji: '🏆', description: 'ตำนานนักสืบสุขภาพ' },
];

export function getLevelByXP(xp: number): Level {
  let current = LEVELS[0];
  for (const lv of LEVELS) {
    if (xp >= lv.minXP) current = lv;
  }
  return current;
}

export function getNextLevel(xp: number): Level | null {
  for (const lv of LEVELS) {
    if (xp < lv.minXP) return lv;
  }
  return null; // อยู่ level สูงสุดแล้ว
}

export function getProgressToNextLevel(xp: number): number {
  const current = getLevelByXP(xp);
  const next = getNextLevel(xp);
  if (!next) return 1; // max level
  const span = next.minXP - current.minXP;
  const inLevel = xp - current.minXP;
  return Math.max(0, Math.min(1, inLevel / span));
}
