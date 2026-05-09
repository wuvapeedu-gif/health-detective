import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getScenarioById } from '../scenarios';
import { getBadge } from '../lib/badges';
import { usePlayerStore } from '../store/playerStore';
import { useUIStore } from '../store/uiStore';
import DialogueBubble from '../components/DialogueBubble';
import ChoiceCard from '../components/ChoiceCard';
import SpotTheLie from '../components/minigames/SpotTheLie';
import OrderCards from '../components/minigames/OrderCards';
import type { Choice, ScenarioNode } from '../types';

export default function ScenarioPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const stageId = Number(id);
  const scenario = getScenarioById(stageId);
  const addXP = usePlayerStore(s => s.addXP);
  const awardBadge = usePlayerStore(s => s.awardBadge);
  const completeStage = usePlayerStore(s => s.completeStage);
  const pushXP = useUIStore(s => s.pushXP);
  const pushBadge = useUIStore(s => s.pushBadge);

  const [showIntro, setShowIntro] = useState(true);
  const [history, setHistory] = useState<ScenarioNode[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>(scenario?.startNode || '');

  useEffect(() => {
    if (!scenario) return;
    if (!showIntro && history.length === 0) {
      const startNode = scenario.nodes.find(n => n.id === scenario.startNode);
      if (startNode) {
        setHistory([startNode]);
        setCurrentNodeId(startNode.id);
      }
    }
  }, [showIntro, scenario, history.length]);

  if (!scenario) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-600 mb-4">ด่านนี้ยังไม่พร้อมเล่น</p>
        <button onClick={() => nav('/')} className="btn-primary">กลับหน้าแรก</button>
      </div>
    );
  }

  const currentNode = scenario.nodes.find(n => n.id === currentNodeId);

  const goToNext = (nextId: string) => {
    const next = scenario.nodes.find(n => n.id === nextId);
    if (!next) return;
    setHistory(prev => [...prev, next]);
    setCurrentNodeId(nextId);
  };

  const handleChoice = (choice: Choice) => {
    if (choice.xp && choice.xp > 0) {
      addXP(choice.xp);
      pushXP(choice.xp);
    }
    if (choice.badge) {
      const newly = awardBadge(choice.badge);
      const b = getBadge(choice.badge);
      if (newly && b) pushBadge(b.name, b.emoji);
    }
    goToNext(choice.next);
  };

  const handleMinigameComplete = (success: boolean) => {
    if (!currentNode || currentNode.type !== 'minigame') return;
    if (success) {
      addXP(currentNode.xpOnSuccess);
      pushXP(currentNode.xpOnSuccess);
      if (currentNode.badge) {
        const newly = awardBadge(currentNode.badge);
        const b = getBadge(currentNode.badge);
        if (newly && b) pushBadge(b.name, b.emoji);
      }
    } else {
      // ตอบไม่ครบ — ให้ XP บางส่วน
      const partial = Math.floor(currentNode.xpOnSuccess / 2);
      addXP(partial);
      pushXP(partial);
    }
    goToNext(currentNode.next);
  };

  const handleEnd = () => {
    if (!currentNode || currentNode.type !== 'end') return;
    addXP(currentNode.xp);
    pushXP(currentNode.xp);
    if (currentNode.badge) {
      const newly = awardBadge(currentNode.badge);
      const b = getBadge(currentNode.badge);
      if (newly && b) pushBadge(b.name, b.emoji);
    }
    completeStage(stageId);
    nav('/');
  };

  // ---- Intro screen ----
  if (showIntro) {
    return (
      <div className="h-full flex flex-col p-6 max-w-md mx-auto">
        <button onClick={() => nav('/')} className="self-start text-detective-500 mb-4">← กลับ</button>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-detective-300 text-sm mb-1">ด่านที่ {scenario.id}</p>
          <h1 className="text-3xl font-display font-bold text-detective-700 mb-2">{scenario.title}</h1>
          {scenario.subtitle && <p className="text-gray-600 mb-6">{scenario.subtitle}</p>}
          <div className="space-y-3 mb-6">
            {(scenario.intro || []).map((line, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4 }}
                className="text-gray-700 leading-relaxed border-l-4 border-detective-500 pl-3">
                {line}
              </motion.p>
            ))}
          </div>
        </div>
        <button onClick={() => setShowIntro(false)} className="btn-primary w-full">
          เริ่มภารกิจ →
        </button>
      </div>
    );
  }

  // ---- Game loop ----
  return (
    <div className="min-h-full bg-detective-50 pb-8">
      <header className="sticky top-0 bg-white shadow-sm p-3 flex items-center gap-3 z-10">
        <button onClick={() => nav('/')} className="text-detective-500 px-2">←</button>
        <div className="flex-1">
          <p className="text-xs text-gray-500">ด่าน {scenario.id}</p>
          <p className="font-semibold text-sm text-detective-700">{scenario.title}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {/* แสดง history dialogue/feedback */}
        <div className="space-y-1 mb-4">
          <AnimatePresence>
            {history.slice(0, -1).map((node) => (
              node.type === 'dialogue' ? (
                <DialogueBubble key={node.id} speaker={node.speaker} text={node.text} />
              ) : node.type === 'feedback' ? (
                <motion.div key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card bg-warning-50 border-l-4 border-warning-500 mb-3">
                  <p className="font-semibold text-warning-600 mb-1">{node.title}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{node.body}</p>
                </motion.div>
              ) : node.type === 'educationalPopup' ? (
                <motion.div key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card bg-success-50 border-l-4 border-success-500 mb-3">
                  <p className="font-semibold text-success-600 mb-1">💡 รู้หรือไม่?</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{node.fact}</p>
                  <p className="text-xs text-gray-500 mt-1">📚 {node.source}</p>
                </motion.div>
              ) : null
            ))}
          </AnimatePresence>
        </div>

        {/* current node */}
        {currentNode && (
          <AnimatePresence mode="wait">
            <motion.div key={currentNode.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {currentNode.type === 'dialogue' && (
                <>
                  <DialogueBubble speaker={currentNode.speaker} text={currentNode.text} />
                  <button onClick={() => goToNext(currentNode.next)}
                    className="btn-primary w-full mt-2">ต่อไป →</button>
                </>
              )}

              {currentNode.type === 'choice' && (
                <div>
                  {currentNode.speaker && (
                    <p className="text-sm text-detective-700 font-semibold mb-2">{currentNode.prompt}</p>
                  )}
                  {currentNode.choices.map((c, i) => (
                    <ChoiceCard key={i} choice={c} index={i} onPick={handleChoice} />
                  ))}
                </div>
              )}

              {currentNode.type === 'minigame' && currentNode.game === 'spot-the-lie' && currentNode.claims && (
                <SpotTheLie title={currentNode.title} claims={currentNode.claims}
                  onComplete={handleMinigameComplete} />
              )}

              {currentNode.type === 'minigame' && currentNode.game === 'order-cards' && currentNode.cards && currentNode.correctOrder && (
                <OrderCards title={currentNode.title} cards={currentNode.cards}
                  correctOrder={currentNode.correctOrder}
                  onComplete={handleMinigameComplete} />
              )}

              {currentNode.type === 'feedback' && (
                <>
                  <div className="card bg-warning-50 border-l-4 border-warning-500 mb-3">
                    <p className="font-semibold text-warning-600 mb-1">{currentNode.title}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{currentNode.body}</p>
                  </div>
                  <button onClick={() => goToNext(currentNode.next)} className="btn-primary w-full">
                    ต่อไป →
                  </button>
                </>
              )}

              {currentNode.type === 'educationalPopup' && (
                <>
                  <div className="card bg-success-50 border-l-4 border-success-500 mb-3">
                    <p className="font-semibold text-success-600 mb-1">💡 รู้หรือไม่?</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{currentNode.fact}</p>
                    <p className="text-xs text-gray-500 mt-1">📚 {currentNode.source}</p>
                  </div>
                  <button onClick={() => goToNext(currentNode.next)} className="btn-primary w-full">
                    ต่อไป →
                  </button>
                </>
              )}

              {currentNode.type === 'end' && (
                <div className="card text-center py-8">
                  <div className="text-6xl mb-3">🎉</div>
                  <h2 className="font-display text-2xl font-bold text-detective-700 mb-2">
                    {currentNode.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">{currentNode.message}</p>
                  <p className="text-warning-500 font-bold text-xl mb-6">+{currentNode.xp} XP</p>
                  <button onClick={handleEnd} className="btn-primary w-full">
                    กลับหน้าแรก
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
