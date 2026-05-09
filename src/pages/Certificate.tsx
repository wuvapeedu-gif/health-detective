import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import { issueCertificate } from '../lib/cloudSync';

export default function Certificate() {
  const nav = useNavigate();
  const player = usePlayerStore();
  const setCertificate = usePlayerStore(s => s.setCertificate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certNo, setCertNo] = useState(player.certificateNo || '');
  const [verifyCode, setVerifyCode] = useState('');
  const [issueDate, setIssueDate] = useState(player.certificateIssuedAt || '');
  const [qrDataUrl, setQrDataUrl] = useState('');

  // ออก cert (ถ้ายังไม่มี)
  useEffect(() => {
    const eligible = player.stagesCompleted.length >= 8 || player.totalXP >= 1500;
    if (!eligible) return;
    if (player.certificateNo) {
      // มีอยู่แล้ว ใช้ของเดิม — แต่ต้องเรียก backend เพื่อขอ verifyCode
      (async () => {
        const res = await issueCertificate(player.userIdHash);
        if (res.ok && res.certificateNo && res.verifyCode) {
          setCertNo(res.certificateNo);
          setVerifyCode(res.verifyCode);
          setIssueDate(res.issueDate || player.certificateIssuedAt || '');
        }
      })();
      return;
    }
    setLoading(true);
    issueCertificate(player.userIdHash).then(res => {
      setLoading(false);
      if (res.ok && res.certificateNo && res.verifyCode) {
        setCertNo(res.certificateNo);
        setVerifyCode(res.verifyCode);
        setIssueDate(res.issueDate || new Date().toISOString());
        setCertificate(res.certificateNo, res.issueDate || new Date().toISOString());
      } else {
        setError(res.message || res.error || 'ไม่สามารถออก certificate ได้');
      }
    });
  }, [player.userIdHash, player.certificateNo, player.stagesCompleted.length, player.totalXP, setCertificate, player.certificateIssuedAt]);

  // สร้าง QR code
  useEffect(() => {
    if (!verifyCode) return;
    const verifyUrl = `${location.origin}/health-detective/verify?code=${verifyCode}`;
    QRCode.toDataURL(verifyUrl, { width: 220, margin: 1, color: { dark: '#534AB7', light: '#FFFFFF' } })
      .then(setQrDataUrl)
      .catch(() => { /* ignore */ });
  }, [verifyCode]);

  const eligible = player.stagesCompleted.length >= 8 || player.totalXP >= 1500;

  if (!eligible) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-display font-bold text-detective-700 mb-2">ยังไม่ถึงเกณฑ์</h2>
        <p className="text-gray-600 mb-6">
          ต้องจบครบ 8 ด่าน หรือเก็บ XP ครบ 1,500
          <br/>(ตอนนี้ {player.stagesCompleted.length}/8 ด่าน, {player.totalXP} XP)
        </p>
        <button onClick={() => nav('/')} className="btn-primary">กลับไปเล่นต่อ</button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-detective-50 pb-8">
      <header className="sticky top-0 bg-white shadow-sm p-3 flex items-center gap-3 z-10">
        <button onClick={() => nav('/')} className="text-detective-500 px-2">←</button>
        <h2 className="font-display font-bold text-detective-700">Certificate</h2>
      </header>

      <main className="max-w-md mx-auto p-4">
        {loading && (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3 animate-pulse">🏆</div>
            <p className="text-gray-600">กำลังออก Certificate...</p>
          </div>
        )}

        {error && (
          <div className="card border-2 border-danger-500 text-center">
            <p className="text-danger-500 font-semibold mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button onClick={() => location.reload()} className="btn-primary">ลองใหม่</button>
          </div>
        )}

        {certNo && !loading && !error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {/* Cert artwork */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-detective-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-detective-50 text-9xl font-bold leading-none -mr-4 -mt-4">🏆</div>
              <div className="relative">
                <p className="text-center text-detective-300 text-xs uppercase tracking-widest">Certificate of Completion</p>
                <h1 className="text-center font-display font-bold text-2xl text-detective-700 mt-2">
                  ใบประกาศนียบัตร
                </h1>
                <p className="text-center text-sm text-gray-500 mt-1">นักสืบสุขภาพ: ภารกิจปกป้องลมหายใจ</p>
                <hr className="my-4 border-detective-100" />

                <p className="text-center text-gray-600 text-sm mb-2">มอบให้แก่</p>
                <h2 className="text-center font-display text-3xl font-bold text-detective-700 my-3">
                  {player.nickname}
                </h2>
                {player.school && (
                  <p className="text-center text-gray-500 text-sm">{player.grade} • {player.school}</p>
                )}

                <p className="text-center text-gray-600 text-sm mt-4 leading-relaxed">
                  ผ่านการเรียนรู้ทักษะปฏิเสธบุหรี่ไฟฟ้าและภัยจากนิโคติน
                  <br/>ครบทุกด่าน รวม {player.totalXP} XP
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6 text-xs">
                  <div>
                    <p className="text-gray-400">เลขที่</p>
                    <p className="font-mono font-bold text-detective-700">{certNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">วันที่ออก</p>
                    <p className="font-semibold text-detective-700">
                      {issueDate && new Date(issueDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {qrDataUrl && (
                  <div className="mt-4 flex flex-col items-center">
                    <img src={qrDataUrl} alt="Verify QR" className="w-32 h-32" />
                    <p className="text-xs text-gray-400 mt-1">สแกน QR เพื่อยืนยัน</p>
                    <p className="text-xs font-mono text-detective-500 mt-0.5">รหัส: {verifyCode}</p>
                  </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-4">
                  Walailak University • โครงการ Health Detective
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button onClick={() => nav('/')} className="btn-primary w-full">
                กลับหน้าแรก
              </button>
              {verifyCode && (
                <button
                  onClick={() => navigator.clipboard?.writeText(`รหัสยืนยัน Certificate: ${verifyCode}`)}
                  className="btn-secondary w-full"
                >
                  📋 ก๊อปรหัสยืนยัน
                </button>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
