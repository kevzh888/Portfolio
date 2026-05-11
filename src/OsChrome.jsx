import { useState } from 'react';
import { useMusic } from './useMusic.js';
import { musicEngine } from './music.js';

// ─── Glyphs ────────────────────────────────────────────────────────────────

// iOS Photos: 8 petals, accurate Apple colors, screen blend on black bg
export function PhotosGlyph() {
  const petals = [
    { c:"#FFE030", a:90  },
    { c:"#FF9500", a:45  },
    { c:"#FF3A30", a:0   },
    { c:"#FF2D9C", a:315 },
    { c:"#BF5AF2", a:270 },
    { c:"#0A84FF", a:225 },
    { c:"#5AC8FA", a:180 },
    { c:"#30D158", a:135 },
  ];
  return (
    <svg width="48" height="48" viewBox="-24 -24 48 48">
      {petals.map((p,i)=>(
        <ellipse key={i}
          cx={Math.cos(p.a*Math.PI/180)*6.5}
          cy={-Math.sin(p.a*Math.PI/180)*6.5}
          rx="11.5" ry="11.5" fill={p.c}
          style={{mixBlendMode:"screen"}}/>
      ))}
    </svg>
  );
}

// iOS Notes: yellow header, ruled lines — fills container fully, no clipPath ID conflicts
export function NotesGlyph() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 46 46" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="46" height="46" fill="#FFFEF5"/>
      <rect x="0" y="0" width="46" height="10.5" fill="#FFD100"/>
      <rect x="0" y="10.5" width="46" height="0.8" fill="rgba(0,0,0,0.08)"/>
      <g stroke="#C7C6CC" strokeWidth="1" strokeLinecap="round">
        <line x1="7" y1="20" x2="39" y2="20"/>
        <line x1="7" y1="26" x2="39" y2="26"/>
        <line x1="7" y1="32" x2="39" y2="32"/>
        <line x1="7" y1="38" x2="28" y2="38"/>
      </g>
    </svg>
  );
}

// Spotify: green circle + 3 wave arcs
export function SpotifyGlyph() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46">
      <circle cx="23" cy="23" r="22" fill="#1DB954"/>
      <path d="M11 17.5C19.5 14 30 14 36 18.5" stroke="#000" strokeWidth="3.6" strokeLinecap="round" fill="none"/>
      <path d="M13 24C20.5 21 28.5 21 34 24.5" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M15 30C21 28 27.5 28 32 30.5" stroke="#000" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// iOS Wallet: 3 angled credit cards
export function WalletGlyph() {
  return (
    <svg width="44" height="36" viewBox="0 0 44 36">
      <rect x="2" y="13" width="40" height="22" rx="3.5" fill="#0057FF"/>
      <rect x="2" y="7"  width="40" height="22" rx="3.5" fill="#FFB800"/>
      <rect x="2" y="1"  width="40" height="22" rx="3.5" fill="#34C759"/>
      {/* chip on top card */}
      <rect x="8" y="7" width="9" height="7" rx="1.5" fill="rgba(255,255,255,0.6)"/>
    </svg>
  );
}

// iOS Contacts: gray bg, white person silhouette (no binding)
export function ContactsGlyph() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42">
      {/* head */}
      <circle cx="21" cy="15" r="7.5" fill="rgba(255,255,255,0.92)"/>
      {/* shoulders */}
      <path d="M5 40 Q5 27 21 27 Q37 27 37 40" fill="rgba(255,255,255,0.92)"/>
    </svg>
  );
}

// GitHub Octocat
export function GitHubGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 1C5.93 1 1 5.93 1 12c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-1.85c-3.06.67-3.71-1.47-3.71-1.47-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.19.91.1-.71.38-1.19.7-1.46-2.43-.28-4.98-1.21-4.98-5.4 0-1.19.43-2.17 1.12-2.93-.11-.28-.49-1.39.11-2.9 0 0 .92-.29 3 1.12a10.4 10.4 0 012.74-.37c.93 0 1.87.13 2.74.37 2.08-1.41 3-.12 3-.12.6 1.51.22 2.62.11 2.9.7.76 1.12 1.74 1.12 2.93 0 4.2-2.56 5.12-5 5.39.39.34.74 1.01.74 2.04v3.02c0 .29.19.64.75.53A11.01 11.01 0 0023 12C23 5.93 18.07 1 12 1z"/>
    </svg>
  );
}

// LinkedIn
export function LinkedInGlyph() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="8" height="24" x="4" y="12" rx="1" fill="white"/>
      <circle cx="8" cy="7.5" r="4" fill="white"/>
      <path d="M15 12h6v3.3C22.1 13.5 23.8 12 26.5 12c4.5 0 5.5 3 5.5 6.9V36h-7V20.3c0-1.6-.6-2.8-2.2-2.8-1.5 0-2.3 1-2.3 2.8V36h-7V12z" fill="white"/>
    </svg>
  );
}

// Magic 8 Ball glyph
export function Magic8BallGlyph() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="20" fill="#0a0a0a"/>
      <circle cx="22" cy="22" r="20" fill="url(#m8shine)" opacity="0.6"/>
      <defs>
        <radialGradient id="m8shine" cx="38%" cy="30%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <circle cx="22" cy="22" r="10" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
      <text x="22" y="26.5" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">8</text>
    </svg>
  );
}

// Generic internet / browser globe
export function ChromeGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" stroke="#fff" strokeWidth="2"/>
      <line x1="4" y1="20" x2="36" y2="20" stroke="#fff" strokeWidth="1.5"/>
      <path d="M20 4 C11 9 11 31 20 36" stroke="#fff" strokeWidth="1.5"/>
      <path d="M20 4 C29 9 29 31 20 36" stroke="#fff" strokeWidth="1.5"/>
      <path d="M5.5 13 Q20 9 34.5 13" stroke="#fff" strokeWidth="1.2"/>
      <path d="M5.5 27 Q20 31 34.5 27" stroke="#fff" strokeWidth="1.2"/>
    </svg>
  );
}
// Keep alias so old references still compile
export const SafariGlyph = ChromeGlyph;

// macOS Finder: two-tone smiley — fills container, no inner rounded rect
function FinderGlyph() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#4aaee6"/>
      <rect width="24" height="48" fill="#1c3e82"/>
      <ellipse cx="16" cy="20" rx="5.2" ry="6.2" fill="white"/>
      <ellipse cx="17.2" cy="21.2" rx="2.4" ry="3" fill="#0a1930"/>
      <ellipse cx="32" cy="20" rx="5.2" ry="6.2" fill="white"/>
      <ellipse cx="33.2" cy="21.2" rx="2.4" ry="3" fill="#0a1930"/>
      <path d="M12 33 Q24 44 36 33" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ─── App icon ─────────────────────────────────────────────────────────────
export function AppIcon({ label, gradient, onClick, size = 62, glyph, href }) {
  const [pressed, setPressed] = useState(false);
  const Comp = href ? 'a' : 'button';
  return (
    <Comp href={href} target={href ? '_blank' : undefined} rel={href ? 'noreferrer' : undefined}
      onClick={onClick} onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)} onMouseLeave={()=>setPressed(false)}
      style={{ border:0, background:'none', padding:0, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:7, transition:'transform 160ms cubic-bezier(.2,.7,.2,1)', transform:pressed?'scale(0.92)':'scale(1)', textDecoration:'none' }}>
      <div style={{ width:size, height:size, borderRadius:size*0.235, position:'relative', background:gradient?`linear-gradient(160deg,${gradient[0]},${gradient[1]})`:'#fff', boxShadow:'0 8px 18px rgba(0,0,0,0.28),inset 0 1px 0 rgba(255,255,255,0.3),inset 0 -1px 0 rgba(0,0,0,0.15)', display:'grid', placeItems:'center', overflow:'hidden' }}>
        {glyph}
        <div style={{ position:'absolute', inset:0, borderRadius:size*0.235, background:'linear-gradient(180deg,rgba(255,255,255,0.22),transparent 45%)', pointerEvents:'none' }}/>
      </div>
      {label && <div style={{ fontSize:11.5, color:'#fff', fontWeight:500, textShadow:'0 1px 2px rgba(0,0,0,0.55)', letterSpacing:-0.1 }}>{label}</div>}
    </Comp>
  );
}

// ─── Theme toggle ─────────────────────────────────────────────────────────
export function ThemeToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle} style={{ border:0, padding:0, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', width:36, height:36, borderRadius:'50%', cursor:'pointer', display:'grid', placeItems:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.25)' }} title={dark?'Switch to light':'Switch to dark'}>
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3.5" fill="#fff"/>
          {Array.from({length:8}).map((_,i)=>(<line key={i} x1="10" y1="2" x2="10" y2="4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${i*45} 10 10)`}/>))}
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#fff"><path d="M14 2 A8 8 0 1018 14 A6 6 0 0114 2z"/></svg>
      )}
    </button>
  );
}

// ─── Unmute pill ───────────────────────────────────────────────────────────
export function UnmutePill() {
  const m = useMusic();
  return (
    <div style={{ position:'fixed', top:14, left:'50%', transform:'translateX(-50%)', zIndex:10000, display:'flex', alignItems:'center', gap:8, padding:m.muted?'8px 14px 8px 11px':'6px 12px 6px 10px', borderRadius:999, background:'rgba(20,20,22,0.88)', color:'#fff', backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', border:'0.5px solid rgba(255,255,255,0.2)', boxShadow:'0 8px 22px rgba(0,0,0,0.4)', fontSize:m.muted?12.5:11.5, fontWeight:500, fontFamily:'-apple-system,system-ui,sans-serif', cursor:m.muted?'pointer':'default' }}
      onClick={m.muted?()=>musicEngine.setMuted(false):undefined}>
      <style>{`@keyframes bar{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}`}</style>
      {m.muted ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          Tap to unmute · {m.song?.title}
          <span style={{ width:6, height:6, borderRadius:3, background:'#1ED760', animation:'pulse 1.4s ease-in-out infinite' }}/>
        </>
      ) : (
        <>
          <span style={{ display:'inline-flex', alignItems:'flex-end', gap:2, height:12 }}>
            {[0,0.15,0.3].map((d,i)=><span key={i} style={{ width:2, height:10, background:'#1ED760', borderRadius:1, animation:`bar 800ms ease-in-out ${d}s infinite`, transformOrigin:'bottom' }}/>)}
          </span>
          <span style={{ opacity:0.95 }}>{m.song?.title} · {m.song?.artist}</span>
          <button onClick={e=>{e.stopPropagation();musicEngine.toggle();}} style={{ border:0, background:'transparent', color:'#fff', cursor:'pointer', padding:0, marginLeft:2, display:'grid', placeItems:'center' }}>
            {m.playing
              ? <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
              : <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M6 4l14 8-14 8z"/></svg>}
          </button>
        </>
      )}
    </div>
  );
}

// ─── iOS Home Screen ───────────────────────────────────────────────────────
export function IOSHomeScreen({ onLaunch, dark = false, onToggleTheme, links }) {
  const wallpaper = dark
    ? "radial-gradient(circle at 25% 15%,#2c5b87 0%,transparent 50%),radial-gradient(circle at 80% 75%,#1d4d4a 0%,transparent 55%),linear-gradient(180deg,#0e1a26 0%,#070d14 100%)"
    : "radial-gradient(circle at 25% 15%,#b2e8c8 0%,transparent 50%),radial-gradient(circle at 80% 75%,#7fcca0 0%,transparent 55%),linear-gradient(180deg,#d4f0e2 0%,#8ecfac 100%)";

  const apps = [
    [
      { id:"photos", label:"Photos", gradient:["#0a0814","#0a0814"], glyph:<PhotosGlyph/>, onClick:()=>onLaunch("photos") },
      { id:"notes", label:"Notes", gradient:["#fff5d4","#FFE189"], glyph:<NotesGlyph/>, onClick:()=>onLaunch("notes") },
      { id:"spotify", label:"Spotify", gradient:["#1ED760","#1ED760"], glyph:<SpotifyGlyph/>, onClick:()=>onLaunch("music") },
      { id:"contacts", label:"Contacts", gradient:["#FF9F0A","#E07000"], glyph:<ContactsGlyph/>, onClick:()=>onLaunch("contacts") },
    ],
    [
      { id:"wallet", label:"Wallet", gradient:["#1c1c1e","#3a3a3c"], glyph:<WalletGlyph/>, onClick:()=>onLaunch("wallet") },
      { id:"github", label:"GitHub", gradient:["#1c1c1e","#3a3a3c"], glyph:<GitHubGlyph/>, href:links.github },
      { id:"linkedin", label:"LinkedIn", gradient:["#0a66c2","#0a66c2"], glyph:<LinkedInGlyph/>, href:links.linkedin },
      null,
    ],
  ];

  const dock = [
    { id:"magic8", gradient:["#0a0a0a","#1a1a1a"], glyph:<Magic8BallGlyph/>, onClick:()=>onLaunch("magic8") },
    { id:"safari", gradient:["#1a6fc4","#0d4e99"], glyph:<ChromeGlyph/>, href:"https://theuselessweb.com/" },
    { id:"spotify-d", gradient:["#1ED760","#1ED760"], glyph:<SpotifyGlyph/>, onClick:()=>onLaunch("music") },
  ];

  return (
    <div style={{ width:'100%', height:'100%', position:'absolute', inset:0, background:wallpaper, overflow:'hidden', fontFamily:'-apple-system,system-ui,sans-serif' }}>
      {/* Theme toggle */}
      <div style={{ position:'absolute', top:56, right:18, zIndex:30 }}>
        <ThemeToggle dark={dark} onToggle={onToggleTheme}/>
      </div>

      {/* Time */}
      <div style={{ position:'absolute', top:56, left:0, right:0, textAlign:'center', color:'#fff', textShadow:'0 1px 4px rgba(0,0,0,0.35)', pointerEvents:'none' }}>
        <div style={{ fontSize:13, fontWeight:600, letterSpacing:1.5, textTransform:'uppercase', opacity:0.85 }}>Tuesday, May 6</div>
        <div style={{ fontSize:76, fontWeight:300, letterSpacing:-2, lineHeight:1, marginTop:2 }}>9:41</div>
      </div>

      {/* App grid */}
      <div style={{ position:'absolute', left:0, right:0, top:270, bottom:110, padding:'0 22px', display:'flex', flexDirection:'column', gap:26 }}>
        {apps.map((row,ri)=>(
          <div key={ri} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {row.map((a,ci)=>a ? <AppIcon key={a.id} {...a} size={62}/> : <div key={ci}/>)}
          </div>
        ))}
      </div>

      {/* Page dots */}
      <div style={{ position:'absolute', bottom:102, left:0, right:0, display:'flex', justifyContent:'center', gap:6 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:3, background:i===0?'#fff':'rgba(255,255,255,0.45)' }}/>)}
      </div>

      {/* Dock */}
      <div style={{ position:'absolute', left:14, right:14, bottom:28, padding:12, borderRadius:30, background:'rgba(255,255,255,0.22)', backdropFilter:'blur(28px) saturate(180%)', WebkitBackdropFilter:'blur(28px) saturate(180%)', border:'0.5px solid rgba(255,255,255,0.25)', display:'flex', justifyContent:'space-around' }}>
        {dock.map(a=><AppIcon key={a.id} {...a} size={56}/>)}
      </div>
    </div>
  );
}

// ─── macOS Desktop ─────────────────────────────────────────────────────────
export function MacDesktop({ children, dark = true, onToggleTheme, onLaunch, active, links = {} }) {
  const wallpaper = dark
    ? "radial-gradient(ellipse at 30% 25%,#2c5b87 0%,#14304a 45%,#060d18 100%)"
    : "radial-gradient(ellipse at 30% 25%,#b2e8c8 0%,#6dbd94 50%,#3a7d5c 100%)";
  const m = useMusic();

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:wallpaper, overflow:'hidden', fontFamily:'-apple-system,BlinkMacSystemFont,system-ui,sans-serif' }}>
      {/* Menu bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:100, height:26, padding:'0 14px', background:'rgba(0,0,0,0.18)', backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', display:'flex', alignItems:'center', justifyContent:'space-between', color:'#fff', fontSize:13.5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:18 }}>
          <svg width="14" height="16" viewBox="0 0 14 16" fill="#fff"><path d="M11.5 12.5c-.6.9-1.2 1.7-2.2 1.7s-1.3-.6-2.4-.6-1.5.6-2.4.6c-1 0-1.7-.9-2.3-1.8C.6 10.6 0 7.4 1.5 5.4c.7-1 2-1.6 3.2-1.6 1 0 2 .7 2.4.7s1.6-.8 2.7-.7c.5 0 1.8.2 2.7 1.4-2.4 1.4-2 4.7.4 5.3-.3.8-.7 1.4-1.4 2zM7.5 3.4c-.5.5-1.3.9-2 .9-.1-.7.2-1.5.7-2 .5-.5 1.3-.9 2-.9.1.7-.2 1.5-.7 2z"/></svg>
          <span style={{ fontWeight:700 }}>Photos</span>
          <span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:13 }}>
          <button onClick={onToggleTheme} style={{ border:0, background:'transparent', cursor:'pointer', padding:0, display:'grid', placeItems:'center' }}>
            {dark ? <svg width="14" height="14" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.5" fill="#fff"/>{Array.from({length:8}).map((_,i)=>(<line key={i} x1="10" y1="2" x2="10" y2="4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${i*45} 10 10)`}/>))}</svg>
              : <svg width="14" height="14" viewBox="0 0 20 20" fill="#fff"><path d="M14 2 A8 8 0 1018 14 A6 6 0 0114 2z"/></svg>}
          </button>
          <span>Tue 6 May</span><span style={{ fontWeight:600 }}>9:41 AM</span>
        </div>
      </div>

      {/* macOS now-playing banner */}
      {m.song && m.playing && !m.muted && (
        <div style={{ position:'absolute', top:38, right:14, zIndex:200, width:320, padding:12, borderRadius:12, background:'rgba(40,40,42,0.85)', backdropFilter:'blur(36px) saturate(180%)', WebkitBackdropFilter:'blur(36px) saturate(180%)', border:'0.5px solid rgba(255,255,255,0.1)', boxShadow:'0 14px 30px rgba(0,0,0,0.45)', color:'#fff', display:'flex', alignItems:'center', gap:10, animation:'noteIn 380ms cubic-bezier(.2,.7,.2,1)' }}>
          <style>{`@keyframes noteIn{from{transform:translateY(-12px);opacity:0}}`}</style>
          <div style={{ width:38, height:38, borderRadius:8, background:'#1ED760', display:'grid', placeItems:'center', flexShrink:0, overflow:'hidden' }}><SpotifyGlyph/></div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(235,235,245,0.55)' }}><span style={{ fontWeight:600, color:'#1ED760' }}>SPOTIFY</span><span>now</span></div>
            <div style={{ fontSize:13.5, fontWeight:600, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.song.title}</div>
            <div style={{ fontSize:12, color:'rgba(235,235,245,0.65)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.song.artist} · {m.song.album}</div>
          </div>
        </div>
      )}

      <div style={{ position:'absolute', inset:'40px 40px 86px 40px' }}>{children}</div>

      {/* Dock */}
      <div style={{ position:'absolute', left:'50%', bottom:10, transform:'translateX(-50%)', padding:'8px 10px', borderRadius:18, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(36px) saturate(180%)', WebkitBackdropFilter:'blur(36px) saturate(180%)', border:'0.5px solid rgba(255,255,255,0.25)', boxShadow:'0 12px 32px rgba(0,0,0,0.35)', display:'flex', gap:6, alignItems:'flex-end' }}>
        {[
          { id:"finder",   gradient:["#3DBEFF","#0F6FF1"],   glyph:<FinderGlyph/> },
          { id:"safari",   gradient:["#1a6fc4","#0d4e99"],   glyph:<ChromeGlyph/>, launch:true },
          { id:"magic8",   gradient:["#0a0a0a","#1a1a1a"],   glyph:<Magic8BallGlyph/>, launch:true },
          { id:"photos",   gradient:["#0a0814","#0a0814"],   glyph:<PhotosGlyph/>, launch:true },
          { id:"notes",    gradient:["#fff5d4","#FFE189"],   glyph:<NotesGlyph/>,  launch:true },
          { id:"music",    gradient:["#1ED760","#1ED760"],   glyph:<SpotifyGlyph/>,launch:true },
          { id:"wallet",   gradient:["#1c1c1e","#3a3a3c"],   glyph:<WalletGlyph/>, launch:true },
          { id:"contacts", gradient:["#FF9F0A","#E07000"],   glyph:<ContactsGlyph/>,launch:true },
          { id:"github",   gradient:["#1c1c1e","#3a3a3c"],   glyph:<GitHubGlyph/>, href:links.github },
          { id:"linkedin", gradient:["#0a66c2","#0a66c2"],   glyph:<LinkedInGlyph/>,href:links.linkedin },
        ].map(a => {
          const clickable = a.launch || a.href;
          const icon = (
            <div
              onClick={a.launch && onLaunch ? ()=>onLaunch(a.id) : undefined}
              style={{ width:48, height:48, borderRadius:11, overflow:'hidden', background:`linear-gradient(135deg,${a.gradient[0]},${a.gradient[1]})`, display:'grid', placeItems:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.3)', transition:'transform 200ms', cursor:clickable?'pointer':'default' }}
              onMouseEnter={e=>{if(clickable)e.currentTarget.style.transform='scale(1.18) translateY(-6px)'}}
              onMouseLeave={e=>{if(clickable)e.currentTarget.style.transform='scale(1)'}}>
              {a.glyph}
            </div>
          );
          return (
            <div key={a.id} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              {a.href ? <a href={a.href} target="_blank" rel="noreferrer" style={{ textDecoration:'none', display:'block' }}>{icon}</a> : icon}
              <div style={{ width:3, height:3, borderRadius:'50%', background:active===a.id?'rgba(255,255,255,0.85)':'transparent', marginTop:3 }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
