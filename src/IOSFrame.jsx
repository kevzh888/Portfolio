import { useMusic } from './useMusic.js';
import { musicEngine } from './music.js';

function IOSStatusBar({ dark = false }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{ display:'flex', gap:154, alignItems:'center', justifyContent:'center', padding:'21px 24px 19px', boxSizing:'border-box', position:'relative', zIndex:20, width:'100%' }}>
      <div style={{ flex:1, height:22, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:1.5 }}>
        <span style={{ fontFamily:'-apple-system,"SF Pro",system-ui', fontWeight:590, fontSize:17, lineHeight:'22px', color:c }}>9:41</span>
      </div>
      <div style={{ flex:1, height:22, display:'flex', alignItems:'center', justifyContent:'center', gap:7, paddingTop:1, paddingRight:1 }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/>
          <circle cx="8.5" cy="10.5" r="1.5" fill={c}/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

export function IOSDevice({ children, width = 390, height = 780, dark = false }) {
  const m = useMusic();
  const song = m.song;

  return (
    <div style={{ width, height, borderRadius: 48, overflow: 'hidden', position: 'relative', background: dark ? '#000' : '#F2F2F7', boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)', fontFamily: '-apple-system, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased', flexShrink: 0 }}>
      <style>{`
        @keyframes islandIn{from{transform:translateX(-50%) scaleX(0.6);opacity:0}}
        @keyframes islandPulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes islandBar{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
      `}</style>

      {/* Dynamic Island — interactive */}
      <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {song && m.muted ? (
          /* Muted: tap to unmute */
          <div onClick={()=>musicEngine.setMuted(false)}
            style={{ display:'flex', alignItems:'center', gap:8, background:'#000', padding:'0 14px 0 11px', borderRadius:22, height:36, cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.5)', animation:'islandIn 360ms cubic-bezier(.2,.7,.2,1)', whiteSpace:'nowrap' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            <span style={{ color:'rgba(255,255,255,0.85)', fontSize:11, fontWeight:500, letterSpacing:-0.1 }}>{song.title}</span>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#1ED760', animation:'islandPulse 1.4s ease-in-out infinite', flexShrink:0 }}/>
          </div>
        ) : song && m.playing && !m.muted ? (
          /* Playing: show now-playing */
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#000', padding:'0 14px 0 10px', borderRadius:22, height:36, boxShadow:'0 4px 16px rgba(0,0,0,0.5)', animation:'islandIn 360ms cubic-bezier(.2,.7,.2,1)', whiteSpace:'nowrap' }}>
            <div style={{ width:20, height:20, borderRadius:4, background:`linear-gradient(135deg,${song.color[0]},${song.color[1]})`, flexShrink:0 }}/>
            <span style={{ color:'#fff', fontSize:11, fontWeight:600, letterSpacing:-0.1, maxWidth:90, overflow:'hidden', textOverflow:'ellipsis' }}>{song.title}</span>
            <div style={{ display:'flex', alignItems:'flex-end', gap:2, height:14 }}>
              {[0,0.2,0.1].map((d,i)=>(
                <div key={i} style={{ width:2.5, background:'#1ED760', borderRadius:1, animation:`islandBar 700ms ease-in-out ${d}s infinite`, transformOrigin:'bottom', height:10 }}/>
              ))}
            </div>
          </div>
        ) : (
          /* Idle: static pill */
          <div style={{ width:126, height:36, borderRadius:22, background:'#000' }}/>
        )}
      </div>

      {/* Status bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10 }}>
        <IOSStatusBar dark={dark}/>
      </div>
      {/* Content */}
      <div style={{ height:'100%', position:'relative' }}>{children}</div>
      {/* Home indicator */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:60, height:34, display:'flex', justifyContent:'center', alignItems:'flex-end', paddingBottom:8, pointerEvents:'none' }}>
        <div style={{ width:139, height:5, borderRadius:100, background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)' }}/>
      </div>
    </div>
  );
}
