import { useState, useEffect } from 'react';

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function MacLockScreen({ onUnlock, dark = true }) {
  const now = useClock();
  const [fading, setFading] = useState(false);

  const unlock = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onUnlock, 420);
  };

  useEffect(() => {
    const fn = () => unlock();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const h = now.getHours(), m = now.getMinutes();
  const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  const wallpaper = dark
    ? 'radial-gradient(ellipse at 30% 25%,#2c5b87 0%,#14304a 45%,#060d18 100%)'
    : 'radial-gradient(ellipse at 30% 25%,#b2e8c8 0%,#6dbd94 50%,#3a7d5c 100%)';

  return (
    <div onClick={unlock} style={{
      position:'absolute', inset:0, zIndex:9999,
      background: wallpaper,
      backdropFilter:'blur(40px) saturate(160%)',
      WebkitBackdropFilter:'blur(40px) saturate(160%)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      cursor:'pointer', userSelect:'none',
      opacity: fading ? 0 : 1,
      transition:'opacity 420ms cubic-bezier(.2,.7,.2,1)',
      fontFamily:'-apple-system,BlinkMacSystemFont,system-ui,sans-serif',
    }}>
      <img src="/uploads/headshot.jpg" alt="Kevin Zhu"
        style={{ width:90, height:90, borderRadius:45, marginBottom:18, border:'2px solid rgba(255,255,255,0.28)', objectFit:'cover', boxShadow:'0 8px 24px rgba(0,0,0,0.45)' }}
        onError={e => { e.currentTarget.style.display='none'; }}
      />
      <div style={{ fontSize:17, fontWeight:600, color:'#fff', marginBottom:36, letterSpacing:-0.3, textShadow:'0 1px 4px rgba(0,0,0,0.4)' }}>Kevin Zhu</div>
      <div style={{ fontSize:86, fontWeight:300, color:'#fff', letterSpacing:-4, lineHeight:1, textShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>{timeStr}</div>
      <div style={{ fontSize:18, color:'rgba(255,255,255,0.78)', marginTop:10, letterSpacing:-0.2 }}>{dateStr}</div>
      <div style={{ position:'absolute', bottom:90, fontSize:12, color:'rgba(255,255,255,0.38)', letterSpacing:0.4 }}>
        Click anywhere or press any key to unlock
      </div>
    </div>
  );
}

export function IOSLockScreen({ onUnlock }) {
  const now = useClock();
  const [fading, setFading] = useState(false);

  const unlock = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onUnlock, 340);
  };

  const h = now.getHours(), m = now.getMinutes();
  const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  return (
    <div onClick={unlock} style={{
      position:'absolute', inset:0, zIndex:9999,
      background:'radial-gradient(circle at 25% 15%,#2c5b87 0%,transparent 50%),radial-gradient(circle at 80% 75%,#1d4d4a 0%,transparent 55%),linear-gradient(180deg,#0e1a26 0%,#070d14 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      cursor:'pointer', userSelect:'none',
      opacity: fading ? 0 : 1,
      transition:'opacity 340ms ease',
      fontFamily:'-apple-system,system-ui,sans-serif',
    }}>
      <div style={{ marginTop:'22%', textAlign:'center', color:'#fff' }}>
        <div style={{ fontSize:76, fontWeight:300, letterSpacing:-3, lineHeight:1, textShadow:'0 2px 10px rgba(0,0,0,0.35)' }}>{timeStr}</div>
        <div style={{ fontSize:15, marginTop:8, opacity:0.78, letterSpacing:-0.2 }}>{dateStr}</div>
      </div>
      <div style={{ position:'absolute', bottom:42, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
          <path d="M4 12 L14 4 L24 12" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.38)', letterSpacing:0.3 }}>Tap to unlock</div>
      </div>
    </div>
  );
}
