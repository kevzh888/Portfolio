import { useEffect, useRef, useCallback } from 'react';
import { MacAppWindow } from './MacShell.jsx';

const W = 700, H = 230;
const GROUND = 188;
const DX = 80, DW = 40, DH = 50;
const JUMP_V = -15;
const GRAVITY = 0.65;

export function DinoGame({ onClose }) {
  const canvasRef = useRef(null);
  const g = useRef({ running: false, over: false, score: 0, y: GROUND - DH, vy: 0, cacti: [], frame: 0 });

  const jump = useCallback(() => {
    const s = g.current;
    if (s.over) {
      Object.assign(s, { running: true, over: false, score: 0, y: GROUND - DH, vy: 0, cacti: [], frame: 0 });
      return;
    }
    if (!s.running) s.running = true;
    if (s.y >= GROUND - DH - 2) s.vy = JUMP_V;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const s = g.current;
    s.y = GROUND - DH;
    let raf;

    const tick = () => {
      if (s.running && !s.over) {
        s.vy += GRAVITY;
        s.y = Math.min(s.y + s.vy, GROUND - DH);
        if (s.y >= GROUND - DH) s.vy = 0;
        s.frame++;
        const interval = Math.max(38, 72 - Math.floor(s.score / 400) * 6);
        if (s.frame % interval === 0) s.cacti.push({ x: W + 10 });
        const spd = 4.5 + s.score / 500;
        s.cacti = s.cacti.map(c => ({ x: c.x - spd })).filter(c => c.x > -40);
        s.score += 0.12;
        // collision (tight hitbox)
        for (const c of s.cacti) {
          if (DX + 12 < c.x + 21 && DX + DW - 12 > c.x + 3 &&
              s.y + 10 < GROUND && s.y + DH > GROUND - 43) {
            s.over = true; s.running = false;
          }
        }
      }

      // ── Draw ────────────────────────────────────────────────────────────
      ctx.fillStyle = '#111113';
      ctx.fillRect(0, 0, W, H);

      // ground line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, GROUND + 2); ctx.lineTo(W, GROUND + 2); ctx.stroke();

      // dino
      const dc = s.over ? '#FF5F57' : '#e8e8ea';
      ctx.fillStyle = dc;
      // body
      ctx.fillRect(DX, s.y, DW, DH - 10);
      // head
      ctx.fillRect(DX + 12, s.y - 16, 24, 20);
      // eye
      ctx.fillStyle = '#111113';
      ctx.fillRect(DX + 29, s.y - 11, 5, 5);
      // tail
      ctx.fillStyle = dc;
      ctx.fillRect(DX - 9, s.y + 9, 13, 7);
      // legs
      if (s.running && !s.over) {
        const lk = Math.floor(s.frame / 5) % 2;
        ctx.fillRect(DX + 5, s.y + DH - 10, 9, lk ? 14 : 8);
        ctx.fillRect(DX + 22, s.y + DH - 10, 9, lk ? 8 : 14);
      } else {
        ctx.fillRect(DX + 5, s.y + DH - 10, 9, 12);
        ctx.fillRect(DX + 22, s.y + DH - 10, 9, 12);
      }

      // cacti
      ctx.fillStyle = '#32d74b';
      for (const c of s.cacti) {
        // stem
        ctx.fillRect(c.x + 8, GROUND - 44, 8, 44);
        // left arm
        ctx.fillRect(c.x, GROUND - 38, 8, 10);
        ctx.fillRect(c.x, GROUND - 32, 8, 16);
        // right arm
        ctx.fillRect(c.x + 16, GROUND - 43, 8, 10);
        ctx.fillRect(c.x + 16, GROUND - 36, 8, 16);
      }

      // score
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(String(Math.floor(s.score)).padStart(5, '0'), W - 16, 22);

      // messages
      ctx.textAlign = 'center';
      if (!s.running && !s.over) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = '15px -apple-system, system-ui, sans-serif';
        ctx.fillText('Press Space or Click to start', W / 2, H / 2 + 14);
      }
      if (s.over) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 19px -apple-system, system-ui, sans-serif';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 10);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '13px -apple-system, system-ui, sans-serif';
        ctx.fillText('Space / click to restart · ' + String(Math.floor(s.score)).padStart(5, '0') + ' pts', W / 2, H / 2 + 14);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const fn = e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [jump]);

  return (
    <MacAppWindow title="Internet" onClose={onClose}>
      <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:'#111113' }}>
        {/* Fake URL bar */}
        <div style={{ height:38, padding:'0 16px', display:'flex', alignItems:'center', gap:10, borderBottom:'0.5px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <div style={{ flex:1, background:'rgba(255,255,255,0.07)', borderRadius:6, height:24, display:'flex', alignItems:'center', padding:'0 10px', gap:6 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/><path d="M6 1C4.5 2.5 4.5 9.5 6 11M6 1C7.5 2.5 7.5 9.5 6 11M1 6h10M1.5 3.5Q6 2 10.5 3.5M1.5 8.5Q6 10 10.5 8.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/></svg>
            <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.3)', letterSpacing:-0.1 }}>chrome://dino</span>
          </div>
        </div>
        {/* Game */}
        <div onClick={jump} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none' }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display:'block', borderRadius:8 }}/>
        </div>
      </div>
    </MacAppWindow>
  );
}
