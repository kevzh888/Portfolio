import { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import { useMusic } from './useMusic.js';
import { musicEngine } from './music.js';

function BackBtn({ onBack, label = 'Home', accent = '#0A84FF' }) {
  return (
    <button onClick={onBack} style={{ border:0, background:'transparent', padding:0, cursor:'pointer', color:accent, fontSize:14, display:'flex', alignItems:'center', gap:2 }}>
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M11 3L4 9L11 15" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {label}
    </button>
  );
}

// Renders a note body with styled section headers, separators, and bullets.
// Only the first non-indented line after a blank/separator (i.e. section opener) is bold.
function NoteBody({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const isSep = l => /^[─\-]{4,}$/.test(l.trim());
  const isEmpty = l => !l.trim();
  const isIndented = l => /^\s/.test(l);
  const isLogo = l => /^\[logo:.+\]$/.test(l.trim());
  const titles = new Set();
  let prevWasBreak = true;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (isSep(l) || isEmpty(l)) { prevWasBreak = true; continue; }
    if (isLogo(l)) continue;
    if (!isIndented(l) && prevWasBreak) titles.add(i);
    prevWasBreak = false;
  }
  return (
    <div style={{ marginTop:12, fontSize:15, lineHeight:1.65, color:'rgba(235,235,245,0.92)' }}>
      {lines.map((line, i) => {
        const logo = line.trim().match(/^\[logo:(.+)\]$/);
        if (logo) return (
          <div key={i} style={{ display:'inline-block', background:'rgba(255,255,255,0.92)', borderRadius:6, padding:'4px 10px', marginTop:5, marginBottom:8 }}>
            <img src={logo[1]} style={{ height:18, display:'block', objectFit:'contain' }} alt=""/>
          </div>
        );
        if (isSep(line)) return <div key={i} style={{ height:1, background:'rgba(255,255,255,0.1)', margin:'12px 0' }}/>;
        if (isEmpty(line)) return <div key={i} style={{ height:'0.7em' }}/>;
        if (isIndented(line)) return <div key={i} style={{ fontSize:14, color:'rgba(235,235,245,0.75)', paddingLeft:4 }}>{line}</div>;
        if (titles.has(i)) return <div key={i} style={{ fontSize:16, fontWeight:700, color:'#fff', marginTop: i > 0 ? 4 : 0, letterSpacing:-0.2 }}>{line}</div>;
        return <div key={i} style={{ fontSize:15, color:'rgba(235,235,245,0.88)' }}>{line}</div>;
      })}
    </div>
  );
}

// ─── NOTES ────────────────────────────────────────────────────────────────
export function NotesApp({ data, onBack }) {
  const [open, setOpen] = useState(null);
  const notes = (data.notes||[]).map(n=>({ ...n, preview:(n.body||'').split('\n')[0].replace(/^\s*[•\-]\s*/,'').slice(0,80) }));
  const bg = '#1c1c1e';

  if (open !== null) {
    const n = notes[open];
    return (
      <div style={{ width:'100%', height:'100%', background:bg, color:'#fff', overflow:'auto', fontFamily:'-apple-system,system-ui,sans-serif' }}>
        <div style={{ padding:'62px 18px 8px', position:'sticky', top:0, background:'rgba(28,28,30,0.85)', backdropFilter:'blur(30px)', WebkitBackdropFilter:'blur(30px)', borderBottom:'0.5px solid rgba(255,255,255,0.07)', zIndex:5 }}>
          <BackBtn onBack={()=>setOpen(null)} label="Notes" accent="#FFD60A"/>
        </div>
        <div style={{ padding:'16px 22px 80px' }}>
          <div style={{ fontSize:12, color:'rgba(235,235,245,0.5)', textAlign:'center' }}>{n.date} at 9:41</div>
          <div style={{ fontSize:24, fontWeight:700, marginTop:12 }}>{n.icon} {n.title}</div>
          <NoteBody text={n.body}/>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width:'100%', height:'100%', background:bg, color:'#fff', overflow:'auto', fontFamily:'-apple-system,system-ui,sans-serif' }}>
      <div style={{ padding:'62px 18px 8px', background:'rgba(20,20,22,0.85)', backdropFilter:'blur(30px)', WebkitBackdropFilter:'blur(30px)', borderBottom:'0.5px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:5 }}>
        <BackBtn onBack={onBack} label="Home" accent="#FFD60A"/>
        <div style={{ fontSize:28, fontWeight:700, letterSpacing:-0.6, marginTop:6 }}>All Notes</div>
        <div style={{ fontSize:13, color:'rgba(235,235,245,0.55)', marginTop:2 }}>{notes.length} Notes</div>
      </div>
      <div style={{ padding:'14px 20px 36px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, background:'rgba(255,255,255,0.07)', marginBottom:14 }}>
          <Icon name="search" size={15} color="rgba(235,235,245,0.5)"/>
          <span style={{ fontSize:15, color:'rgba(235,235,245,0.5)' }}>Search</span>
        </div>
        <div style={{ borderRadius:14, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
          {notes.map((n,i)=>(
            <button key={n.id} onClick={()=>setOpen(i)} style={{ display:'block', width:'100%', padding:'15px 18px', border:0, background:'transparent', color:'#fff', textAlign:'left', cursor:'pointer', borderBottom:i<notes.length-1?'0.5px solid rgba(255,255,255,0.06)':'none' }}>
              <div style={{ fontSize:15, fontWeight:600 }}>{n.icon} {n.title}</div>
              <div style={{ fontSize:12.5, color:'rgba(235,235,245,0.55)', marginTop:4, display:'flex', gap:8 }}>
                <span>{n.date}</span>
                <span style={{ color:'rgba(235,235,245,0.4)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.preview}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MUSIC (Spotify-style) ────────────────────────────────────────────────
export function MusicApp({ onBack }) {
  const m = useMusic();
  const song = m.song;
  if (!song) return null;

  return (
    <div style={{ width:'100%', height:'100%', overflowY:'auto', background:`linear-gradient(180deg,${song.color[0]} 0%,${song.color[1]} 60%,#000 100%)`, color:'#fff', fontFamily:'-apple-system,system-ui,sans-serif', transition:'background 600ms' }}>
      <div style={{ padding:'62px 18px 8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={onBack} style={{ border:0, background:'rgba(0,0,0,0.3)', color:'#fff', borderRadius:'50%', width:32, height:32, cursor:'pointer', display:'grid', placeItems:'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M3 7l4-4M3 7l4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, opacity:0.7, textTransform:'uppercase', letterSpacing:1 }}>Playing from</div>
          <div style={{ fontSize:13, fontWeight:600 }}>Kev's Picks</div>
        </div>
        <div style={{ width:32 }}/>
      </div>

      {/* Album cover */}
      <div style={{ display:'grid', placeItems:'center', padding:'20px 36px 12px' }}>
        <div style={{ width:'100%', aspectRatio:'1/1', borderRadius:8, boxShadow:'0 30px 60px rgba(0,0,0,0.6)', overflow:'hidden', position:'relative' }}>
          {song.cover
            ? <img src={song.cover} alt={song.album} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
            : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${song.color[0]},${song.color[1]})`, display:'grid', placeItems:'center' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'#fff' }}/>
              </div>
          }
        </div>
      </div>

      <div style={{ padding:'0 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:22, fontWeight:700, letterSpacing:-0.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{song.title}</div>
            <div style={{ fontSize:16, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{song.artist}</div>
          </div>
          <button onClick={()=>musicEngine.setMuted(!m.muted)} style={{ border:0, background:'transparent', color:m.muted?'rgba(255,255,255,0.5)':'#1ED760', cursor:'pointer', fontSize:26 }}>♥</button>
        </div>

        <div style={{ marginTop:14 }}>
          <div style={{ height:3, background:'rgba(255,255,255,0.25)', borderRadius:2, position:'relative', cursor:'pointer' }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();musicEngine.seek(((e.clientX-r.left)/r.width)*100);}}>
            <div style={{ width:`${m.progress}%`, height:'100%', background:'#fff', borderRadius:2, transition:'width 500ms linear' }}/>
            <div style={{ position:'absolute', left:`${m.progress}%`, top:'50%', transform:'translate(-50%,-50%)', width:10, height:10, borderRadius:5, background:'#fff' }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:4, fontVariantNumeric:'tabular-nums' }}>
            <span>{fmtTime(m.duration*(m.progress/100))}</span>
            <span>-{fmtTime(m.duration-m.duration*(m.progress/100))}</span>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16 }}>
          <button style={{ border:0, background:'transparent', color:'#fff', cursor:'pointer', fontSize:18, opacity:0.7 }}>↻</button>
          <button onClick={()=>musicEngine.prev()} style={{ border:0, background:'transparent', color:'#fff', cursor:'pointer' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="#fff"><path d="M22 6L10 16L22 26V6Z M9 6h-2v20h2V6z"/></svg>
          </button>
          <button onClick={()=>musicEngine.toggle()} style={{ border:0, background:'#fff', color:'#000', cursor:'pointer', width:64, height:64, borderRadius:'50%', display:'grid', placeItems:'center' }}>
            {m.playing
              ? <svg width="22" height="22" viewBox="0 0 22 22" fill="#000"><rect x="4" y="3" width="5" height="16" rx="1.4"/><rect x="13" y="3" width="5" height="16" rx="1.4"/></svg>
              : <svg width="22" height="22" viewBox="0 0 22 22" fill="#000"><path d="M5 3L19 11L5 19V3z"/></svg>}
          </button>
          <button onClick={()=>musicEngine.next()} style={{ border:0, background:'transparent', color:'#fff', cursor:'pointer' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="#fff"><path d="M10 6L22 16L10 26V6Z M23 6h2v20h-2V6z"/></svg>
          </button>
          <button style={{ border:0, background:'transparent', color:'#fff', cursor:'pointer', fontSize:18, opacity:0.7 }}>⤴</button>
        </div>
      </div>

      {/* Up next — scrollable list */}
      <div style={{ padding:'20px 18px 36px' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', color:'rgba(255,255,255,0.6)', marginBottom:8 }}>Up next</div>
        {m.songs.map((s,i)=>i!==m.idx&&(
          <button key={i} onClick={()=>musicEngine.select(i)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 4px', border:0, background:'transparent', color:'#fff', cursor:'pointer', textAlign:'left' }}>
            <div style={{ width:38, height:38, borderRadius:4, overflow:'hidden', flexShrink:0 }}>
              {s.cover
                ? <img src={s.cover} alt={s.album} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${s.color[0]},${s.color[1]})` }}/>
              }
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.title}</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)' }}>{s.artist}</div>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', fontVariantNumeric:'tabular-nums' }}>{s.duration}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── WALLET ───────────────────────────────────────────────────────────────
export function WalletApp({ data, onBack }) {
  return (
    <div style={{ width:'100%', height:'100%', background:'#000', color:'#fff', overflow:'auto', fontFamily:'-apple-system,system-ui,sans-serif' }}>
      <div style={{ padding:'62px 18px 8px', display:'flex', justifyContent:'space-between' }}>
        <BackBtn onBack={onBack} accent="#0A84FF"/>
        <div style={{ fontSize:28, color:'#0A84FF' }}>+</div>
      </div>
      <div style={{ padding:'8px 18px 16px' }}>
        <div style={{ fontSize:32, fontWeight:700, letterSpacing:-0.6 }}>Wallet</div>
      </div>
      <div style={{ padding:'0 18px', display:'flex', flexDirection:'column', gap:12 }}>
        {/* Balance card */}
        <div style={{ padding:18, borderRadius:14, background:'linear-gradient(135deg,#1a1a1c 0%,#2c2c2e 100%)', border:'0.5px solid rgba(255,255,255,0.12)', boxShadow:'0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:11, color:'rgba(235,235,245,0.5)', letterSpacing:0.5, textTransform:'uppercase' }}>Apple Cash</div>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="#fff"><path d="M11.5 12.5c-.6.9-1.2 1.7-2.2 1.7s-1.3-.6-2.4-.6-1.5.6-2.4.6c-1 0-1.7-.9-2.3-1.8C.6 10.6 0 7.4 1.5 5.4c.7-1 2-1.6 3.2-1.6 1 0 2 .7 2.4.7s1.6-.8 2.7-.7c.5 0 1.8.2 2.7 1.4-2.4 1.4-2 4.7.4 5.3-.3.8-.7 1.4-1.4 2zM7.5 3.4c-.5.5-1.3.9-2 .9-.1-.7.2-1.5.7-2 .5-.5 1.3-.9 2-.9.1.7-.2 1.5-.7 2z"/></svg>
          </div>
          <div style={{ marginTop:18, fontSize:13, color:'rgba(235,235,245,0.6)' }}>Available Balance</div>
          <div style={{ fontSize:46, fontWeight:200, letterSpacing:-1.5, marginTop:2 }}>€0<span style={{ fontSize:22, color:'rgba(235,235,245,0.5)' }}>.00</span></div>
          <div style={{ marginTop:14, padding:'10px 12px', borderRadius:10, background:'linear-gradient(135deg,rgba(255,59,48,0.18),rgba(255,149,0,0.18))', border:'0.5px solid rgba(255,149,0,0.3)' }}>
            <div style={{ fontSize:12, color:'#FF9500', fontWeight:600, letterSpacing:0.3, textTransform:'uppercase' }}>Suggested action</div>
            <div style={{ fontSize:14.5, marginTop:3, fontWeight:500 }}>Please hire me 🥺</div>
            <div style={{ fontSize:12, color:'rgba(235,235,245,0.65)', marginTop:2 }}>Salary deposits go great in this account.</div>
          </div>
        </div>
        {/* Boarding pass */}
        <div style={{ padding:18, borderRadius:14, background:'linear-gradient(135deg,#0A84FF 0%,#0050a8 100%)', boxShadow:'0 20px 40px rgba(10,132,255,0.3)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:0.5 }}>
            <span>Boarding Pass</span><span>Spring 2026</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
            <div><div style={{ fontSize:11, opacity:0.7 }}>From</div><div style={{ fontSize:24, fontWeight:700, letterSpacing:-0.3 }}>JOB</div><div style={{ fontSize:11, opacity:0.8 }}>Job hunting</div></div>
            <div style={{ fontSize:18 }}>✈</div>
            <div style={{ textAlign:'right' }}><div style={{ fontSize:11, opacity:0.7 }}>To</div><div style={{ fontSize:24, fontWeight:700, letterSpacing:-0.3 }}>YOU</div><div style={{ fontSize:11, opacity:0.8 }}>Your team</div></div>
          </div>
          <div style={{ marginTop:14, paddingTop:12, borderTop:'1px dashed rgba(255,255,255,0.3)', display:'flex', justifyContent:'space-between', fontSize:11 }}>
            <div><div style={{ opacity:0.7 }}>Passenger</div><div style={{ fontWeight:600, marginTop:2 }}>{data.name}</div></div>
            <div><div style={{ opacity:0.7 }}>Seat</div><div style={{ fontWeight:600, marginTop:2 }}>PM · Consultant</div></div>
            <div><div style={{ opacity:0.7 }}>Class</div><div style={{ fontWeight:600, marginTop:2 }}>Eager AF</div></div>
          </div>
        </div>
        {/* Coffee loyalty */}
        <div style={{ padding:14, borderRadius:14, background:'linear-gradient(135deg,#6f4e37,#3a261a)', boxShadow:'0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.7)', letterSpacing:0.5, textTransform:'uppercase' }}>
            <span>Coffee Card</span><span>9 / 10</span>
          </div>
          <div style={{ display:'flex', gap:4, marginTop:10 }}>
            {Array.from({length:10}).map((_,i)=><div key={i} style={{ flex:1, height:22, borderRadius:4, background:i<9?'#fff':'rgba(255,255,255,0.15)', display:'grid', placeItems:'center', fontSize:11 }}>{i<9?'☕':''}</div>)}
          </div>
          <div style={{ marginTop:8, fontSize:12, color:'rgba(255,255,255,0.7)' }}>Free coffee on the next interview ☕</div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACTS ─────────────────────────────────────────────────────────────
export function ContactsApp({ data, onBack }) {
  const links = data.contactLinks || [];
  return (
    <div style={{ width:'100%', height:'100%', background:'#1c1c1e', color:'#fff', overflow:'auto', fontFamily:'-apple-system,system-ui,sans-serif' }}>
      <div style={{ padding:'62px 20px 10px', display:'flex', justifyContent:'space-between' }}>
        <BackBtn onBack={onBack} label="Lists" accent="#0A84FF"/>
        <button style={{ border:0, background:'transparent', color:'#0A84FF', fontSize:14, cursor:'pointer' }}>Edit</button>
      </div>
      <div style={{ padding:'24px 20px 30px', textAlign:'center' }}>
        <img src={data.headshot} style={{ width:110, height:110, borderRadius:'50%', objectFit:'cover', margin:'0 auto', display:'block', boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}/>
        <div style={{ fontSize:26, fontWeight:700, marginTop:14, letterSpacing:-0.4 }}>{data.name}</div>
        <div style={{ fontSize:13, color:'rgba(235,235,245,0.55)', marginTop:4, maxWidth:200, margin:'4px auto 0', lineHeight:1.4 }}>{data.tagline}</div>
      </div>
      <div style={{ padding:'0 20px 40px' }}>
        <div style={{ borderRadius:14, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
          {links.map((l,i)=>(
            <a key={i} href={l.href} target="_blank" rel="noreferrer" style={{ display:'block', padding:'14px 18px', textDecoration:'none', color:'#fff', borderBottom:i<links.length-1?'0.5px solid rgba(255,255,255,0.06)':'none' }}>
              <div style={{ fontSize:11, color:'rgba(235,235,245,0.55)' }}>{l.label}</div>
              <div style={{ fontSize:15, color:'#0A84FF', marginTop:3 }}>{l.value}</div>
            </a>
          ))}
        </div>
        <div style={{ marginTop:16, borderRadius:14, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
          <div style={{ padding:'14px 18px' }}>
            <div style={{ fontSize:11, color:'rgba(235,235,245,0.55)' }}>notes</div>
            <div style={{ fontSize:14, marginTop:6, lineHeight:1.6 }}>Open to <strong>IT Strategy · Digital Transformation · PM/PO · Project Manager</strong> roles in unicorns, tech cos or consulting. EU-based.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s/60); const r = Math.floor(s%60);
  return `${m}:${String(r).padStart(2,'0')}`;
}

// ─── Magic 8 Ball ─────────────────────────────────────────────────────────
const M8_ANSWERS = [
  { text:"It is certain",        cat:"yes" },
  { text:"Without a doubt",      cat:"yes" },
  { text:"Yes, definitely",      cat:"yes" },
  { text:"You may rely on it",   cat:"yes" },
  { text:"As I see it, yes",     cat:"yes" },
  { text:"Most likely",          cat:"yes" },
  { text:"Outlook good",         cat:"yes" },
  { text:"Signs point to yes",   cat:"yes" },
  { text:"Reply hazy, try again",   cat:"meh" },
  { text:"Ask again later",         cat:"meh" },
  { text:"Better not tell you now", cat:"meh" },
  { text:"Cannot predict now",      cat:"meh" },
  { text:"Don't count on it",  cat:"no" },
  { text:"My reply is no",     cat:"no" },
  { text:"Outlook not so good",cat:"no" },
  { text:"Very doubtful",      cat:"no" },
];
const M8_COLOR = { yes:"#0A84FF", meh:"#FF9F0A", no:"#FF453A" };

export function Magic8BallApp({ onBack }) {
  const [answer, setAnswer] = useState(null);
  const [shaking, setShaking] = useState(false);

  const shake = () => {
    if (shaking) return;
    setShaking(true);
    setAnswer(null);
    setTimeout(() => {
      setAnswer(M8_ANSWERS[Math.floor(Math.random() * M8_ANSWERS.length)]);
      setShaking(false);
    }, 650);
  };

  const color = answer ? M8_COLOR[answer.cat] : '#4facfe';

  return (
    <div style={{ width:'100%', height:'100%', background:'#000', display:'flex', flexDirection:'column', fontFamily:'-apple-system,system-ui,sans-serif', userSelect:'none' }}>
      <style>{`@keyframes m8shake{0%,100%{transform:rotate(0deg) scale(1)}12%{transform:rotate(-9deg) scale(0.93)}28%{transform:rotate(10deg) scale(0.96)}44%{transform:rotate(-7deg) scale(0.97)}60%{transform:rotate(7deg) scale(1.03)}78%{transform:rotate(-3deg) scale(0.99)}90%{transform:rotate(3deg) scale(1.01)}}`}</style>
      <div style={{ padding:'54px 18px 10px', display:'flex', alignItems:'center' }}>
        <BackBtn onBack={onBack} label="Home" accent="#fff"/>
        <div style={{ flex:1, textAlign:'center', fontSize:17, fontWeight:600, color:'#fff', marginRight:60 }}>Magic 8 Ball</div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:30 }}>
        <div onClick={shake} style={{ width:210, height:210, borderRadius:'50%', cursor:'pointer', position:'relative',
          background:'radial-gradient(circle at 38% 30%, #3a3a3a 0%, #111 40%, #000 100%)',
          boxShadow:'0 24px 64px rgba(0,0,0,0.9), inset 0 -6px 14px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)',
          animation: shaking ? 'm8shake 650ms ease-in-out' : 'none',
          display:'grid', placeItems:'center' }}>
          <div style={{ position:'absolute', top:'10%', left:'18%', width:'42%', height:'30%', borderRadius:'50%', background:'radial-gradient(ellipse, rgba(255,255,255,0.13) 0%, transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ width:88, height:88, borderRadius:'50%', background:'radial-gradient(circle at 42% 36%, #1a1a2e, #080808)',
            border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {answer ? (
              <svg width="44" height="38" viewBox="0 0 44 38">
                <polygon points="22,2 42,36 2,36" fill={color} opacity="0.92"/>
                <polygon points="22,11 35,34 9,34" fill="rgba(0,0,0,0.35)"/>
              </svg>
            ) : (
              <div style={{ fontSize:34, fontWeight:900, color:'#fff', fontFamily:"Georgia, 'Times New Roman', serif", lineHeight:1 }}>8</div>
            )}
          </div>
        </div>
        <div style={{ textAlign:'center', minHeight:48, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 40px' }}>
          {answer ? (
            <div style={{ fontSize:18, fontWeight:600, color, textAlign:'center', lineHeight:1.4, whiteSpace:'pre-line' }}>{answer.text}</div>
          ) : (
            <div style={{ fontSize:15, color:'rgba(255,255,255,0.42)', lineHeight:1.6, textAlign:'center' }}>
              {shaking ? '✨ Consulting the spirits…' : 'Think of a question,\nthen tap the ball'}
            </div>
          )}
        </div>
        {answer && (
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Tap to ask again</div>
        )}
      </div>
    </div>
  );
}
