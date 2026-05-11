import { useState } from 'react';
import { useMusic } from './useMusic.js';
import { musicEngine } from './music.js';
import Icon from './Icon.jsx';
import { SpotifyGlyph } from './OsChrome.jsx';

function MacNoteBody({ text }) {
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
    <div style={{ fontSize:14, lineHeight:1.7, color:'rgba(235,235,245,0.92)' }}>
      {lines.map((line, i) => {
        const logo = line.trim().match(/^\[logo:(.+)\]$/);
        if (logo) return (
          <div key={i} style={{ display:'inline-block', background:'rgba(255,255,255,0.92)', borderRadius:6, padding:'4px 12px', marginTop:5, marginBottom:8 }}>
            <img src={logo[1]} style={{ height:20, display:'block', objectFit:'contain' }} alt=""/>
          </div>
        );
        if (isSep(line)) return <div key={i} style={{ height:1, background:'rgba(255,255,255,0.08)', margin:'10px 0' }}/>;
        if (isEmpty(line)) return <div key={i} style={{ height:'0.6em' }}/>;
        if (isIndented(line)) return <div key={i} style={{ color:'rgba(235,235,245,0.75)', paddingLeft:4 }}>{line}</div>;
        if (titles.has(i)) return <div key={i} style={{ fontSize:15, fontWeight:700, color:'#fff', marginTop: i > 0 ? 6 : 0 }}>{line}</div>;
        return <div key={i} style={{ color:'rgba(235,235,245,0.88)' }}>{line}</div>;
      })}
    </div>
  );
}

// ─── Traffic light button ─────────────────────────────────────────────────
const tl = c => ({ width:12, height:12, borderRadius:6, background:c, border:0, cursor:'pointer', padding:0, display:'inline-block' });

// ─── Mac window shell ─────────────────────────────────────────────────────
export function MacAppWindow({ title, sidebar, onClose, children }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', borderRadius:10, overflow:'hidden', background:'#1c1c1e', color:'#fff', fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif", boxShadow:'0 30px 80px rgba(0,0,0,0.55),0 0 0 1px rgba(0,0,0,0.3)', position:'relative' }}>
      {/* Traffic lights */}
      <div style={{ position:'absolute', top:12, left:14, zIndex:10, display:'flex', gap:8 }}>
        <button onClick={onClose} style={tl('#FF5F57')} title="Close"/>
        <span style={tl('#FEBC2E')}/>
        <span style={tl('#28C840')}/>
      </div>
      {sidebar && (
        <div style={{ width:220, flexShrink:0, background:'rgba(40,40,42,0.92)', borderRight:'0.5px solid rgba(255,255,255,0.08)', padding:'44px 12px 12px', overflow:'auto' }}>
          {sidebar}
        </div>
      )}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ height:44, padding:'0 16px 0 90px', display:'flex', alignItems:'center', borderBottom:'0.5px solid rgba(255,255,255,0.08)', background:'rgba(40,40,42,0.6)', flexShrink:0 }}>
          <span style={{ fontSize:13.5, fontWeight:600 }}>{title}</span>
        </div>
        <div style={{ flex:1, minHeight:0, overflow:'auto', display:'flex', flexDirection:'column' }}>{children}</div>
      </div>
    </div>
  );
}

function MacSidebar({ sections, active, onPick }) {
  return (
    <>
      {sections.map((s,si)=>(
        <div key={si} style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:0.4, textTransform:'uppercase', color:'rgba(235,235,245,0.45)', padding:'6px 10px' }}>{s.title}</div>
          {s.items.map(it=>(
            <button key={it.id} onClick={()=>!it.disabled&&onPick(it.id)} disabled={it.disabled} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'5px 10px', borderRadius:6, border:0, background:active===it.id?'rgba(10,132,255,0.85)':'transparent', color:it.disabled?'rgba(235,235,245,0.4)':'#fff', font:'inherit', fontSize:13.5, cursor:it.disabled?'default':'pointer', textAlign:'left', letterSpacing:-0.2, marginBottom:1 }}>
              <span style={{ flex:1 }}>{it.label}</span>
              {it.count!=null&&<span style={{ fontSize:11, color:'rgba(235,235,245,0.4)' }}>{it.count}</span>}
            </button>
          ))}
        </div>
      ))}
    </>
  );
}

// ─── Mac NOTES ────────────────────────────────────────────────────────────
export function MacNotesApp({ data, onClose }) {
  const notes = data.notes || [];
  const [idx, setIdx] = useState(0);
  const n = notes[idx];
  const sections = [{ title:'iCloud', items:notes.map((nn,i)=>({ id:i, label:`${nn.icon} ${nn.title}` })) }];
  return (
    <MacAppWindow title="Notes" sidebar={<MacSidebar sections={sections} active={idx} onPick={setIdx}/>} onClose={onClose}>
      {n && (
        <div style={{ padding:'28px 44px 60px' }}>
          <div style={{ fontSize:12, color:'rgba(235,235,245,0.45)', marginBottom:8 }}>{n.date}</div>
          <div style={{ fontSize:26, fontWeight:700, letterSpacing:-0.4, marginBottom:18 }}>{n.icon} {n.title}</div>
          <MacNoteBody text={n.body}/>
        </div>
      )}
    </MacAppWindow>
  );
}

// ─── Mac MUSIC ────────────────────────────────────────────────────────────
export function MacMusicApp({ onClose }) {
  const m = useMusic();
  const sections = [{ title:'Library', items:[{ id:'_songs', label:'Songs' },{ id:'_albums', label:'Albums', disabled:true },{ id:'_artists', label:'Artists', disabled:true }] }];

  return (
    <MacAppWindow title="Music" sidebar={<MacSidebar sections={sections} active="_songs" onPick={()=>{}}/>} onClose={onClose}>
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:28, padding:'28px 32px', height:'100%', boxSizing:'border-box' }}>
        <div>
          <div style={{ width:'100%', aspectRatio:'1/1', borderRadius:12, boxShadow:'0 24px 48px rgba(0,0,0,0.5)', marginBottom:20, overflow:'hidden' }}>
            {m.song.cover
              ? <img src={m.song.cover} alt={m.song.album} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
              : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${m.song.color[0]},${m.song.color[1]})`, display:'grid', placeItems:'center' }}><svg width="80" height="80" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg></div>
            }
          </div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:-0.3 }}>{m.song.title}</div>
          <div style={{ fontSize:13, color:'rgba(235,235,245,0.65)', marginTop:2 }}>{m.song.artist} · {m.song.album}</div>
          <div style={{ marginTop:20 }}>
            <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,0.1)', overflow:'hidden', cursor:'pointer' }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();musicEngine.seek(((e.clientX-r.left)/r.width)*100);}}>
              <div style={{ height:'100%', width:`${m.progress}%`, background:'#fff' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(235,235,245,0.5)', marginTop:6, fontVariantNumeric:'tabular-nums' }}>
              <span>{fmtTime(m.duration*(m.progress/100))}</span>
              <span>-{fmtTime(m.duration-m.duration*(m.progress/100))}</span>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:18, marginTop:16 }}>
            <button onClick={()=>musicEngine.prev()} style={macBtn}><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M6 6h2v12H6zM9.5 12L18 6v12z"/></svg></button>
            <button onClick={()=>musicEngine.toggle()} style={{ ...macBtn, width:48, height:48, borderRadius:24, background:'#fff', color:'#000' }}>
              {m.playing ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><path d="M6 4l14 8-14 8z"/></svg>}
            </button>
            <button onClick={()=>musicEngine.next()} style={macBtn}><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z"/></svg></button>
            <button onClick={()=>musicEngine.setMuted(!m.muted)} style={{ ...macBtn, marginLeft:18 }} title={m.muted?'Unmute':'Mute'}>
              {m.muted
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M3 9v6h4l5 5V4L7 9H3zM16.5 12L19 14.5l1.5-1.5L18 11l2.5-2.5L19 7l-2.5 2.5L14 7l-1.5 1.5L15 11l-2.5 2.5L14 15z"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>}
            </button>
          </div>
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:0.4, textTransform:'uppercase', color:'rgba(235,235,245,0.5)', marginBottom:8 }}>Up Next · {m.songs.length} tracks</div>
          {m.songs.map((s,i)=>(
            <button key={i} onClick={()=>musicEngine.select(i)} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'10px 12px', borderRadius:8, border:0, background:i===m.idx?'rgba(255,255,255,0.06)':'transparent', color:'#fff', textAlign:'left', cursor:'pointer', marginBottom:2 }}>
              <div style={{ width:22, color:'rgba(235,235,245,0.45)', fontSize:12, fontVariantNumeric:'tabular-nums' }}>{i===m.idx&&m.playing?'♪':i+1}</div>
              <div style={{ width:38, height:38, borderRadius:5, flexShrink:0, overflow:'hidden' }}>
                {s.cover ? <img src={s.cover} alt={s.album} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${s.color[0]},${s.color[1]})` }}/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:500, color:i===m.idx?'#1ED760':'#fff' }}>{s.title}</div>
                <div style={{ fontSize:12, color:'rgba(235,235,245,0.55)' }}>{s.artist}</div>
              </div>
              <div style={{ fontSize:12, color:'rgba(235,235,245,0.45)', fontVariantNumeric:'tabular-nums' }}>{s.duration}</div>
            </button>
          ))}
        </div>
      </div>
    </MacAppWindow>
  );
}

// ─── Mac WALLET ───────────────────────────────────────────────────────────
export function MacWalletApp({ data, onClose }) {
  return (
    <MacAppWindow title="Wallet" onClose={onClose}>
      <div style={{ height:'100%', padding:'24px 28px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'1fr', gap:16, boxSizing:'border-box' }}>

        {/* Apple Cash */}
        <div style={{ display:'flex', flexDirection:'column', padding:22, borderRadius:16, background:'linear-gradient(145deg,#1a1a1c 0%,#2c2c2e 100%)', border:'0.5px solid rgba(255,255,255,0.12)', boxShadow:'0 16px 32px rgba(0,0,0,0.5)', color:'#fff', minHeight:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:10, color:'rgba(235,235,245,0.5)', letterSpacing:0.5, textTransform:'uppercase' }}>Apple Cash</div>
            <svg width="12" height="14" viewBox="0 0 14 16" fill="#fff"><path d="M11.5 12.5c-.6.9-1.2 1.7-2.2 1.7s-1.3-.6-2.4-.6-1.5.6-2.4.6c-1 0-1.7-.9-2.3-1.8C.6 10.6 0 7.4 1.5 5.4c.7-1 2-1.6 3.2-1.6 1 0 2 .7 2.4.7s1.6-.8 2.7-.7c.5 0 1.8.2 2.7 1.4-2.4 1.4-2 4.7.4 5.3-.3.8-.7 1.4-1.4 2zM7.5 3.4c-.5.5-1.3.9-2 .9-.1-.7.2-1.5.7-2 .5-.5 1.3-.9 2-.9.1.7-.2 1.5-.7 2z"/></svg>
          </div>
          <div style={{ marginTop:22, fontSize:12, color:'rgba(235,235,245,0.6)' }}>Available Balance</div>
          <div style={{ fontSize:46, fontWeight:200, letterSpacing:-2, marginTop:4 }}>€0<span style={{ fontSize:22, color:'rgba(235,235,245,0.45)' }}>.00</span></div>
          <div style={{ marginTop:20, padding:'14px 16px', borderRadius:12, background:'linear-gradient(135deg,rgba(255,59,48,0.18),rgba(255,149,0,0.18))', border:'0.5px solid rgba(255,149,0,0.3)' }}>
            <div style={{ fontSize:10, color:'#FF9500', fontWeight:600, letterSpacing:0.3, textTransform:'uppercase' }}>Suggested action</div>
            <div style={{ fontSize:14, marginTop:4, fontWeight:500 }}>Please hire me 🥺</div>
            <div style={{ fontSize:12, color:'rgba(235,235,245,0.65)', marginTop:3, lineHeight:1.5 }}>Salary deposits go great in this account.</div>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:11, color:'rgba(235,235,245,0.25)', letterSpacing:2 }}>•••• •••• •••• 0000</div>
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none"><circle cx="10" cy="9" r="9" fill="rgba(235,235,245,0.15)"/><circle cx="18" cy="9" r="9" fill="rgba(235,235,245,0.1)"/></svg>
          </div>
        </div>

        {/* Boarding Pass */}
        <div style={{ display:'flex', flexDirection:'column', padding:22, borderRadius:16, background:'linear-gradient(145deg,#0A84FF 0%,#0050a8 100%)', boxShadow:'0 16px 32px rgba(10,132,255,0.3)', color:'#fff', minHeight:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:0.5 }}>
            <span>Boarding Pass</span><span>Sept 2026</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:22 }}>
            <div>
              <div style={{ fontSize:11, opacity:0.7 }}>From</div>
              <div style={{ fontSize:34, fontWeight:700, letterSpacing:-0.5 }}>JOB</div>
              <div style={{ fontSize:11, opacity:0.8, marginTop:2 }}>Job hunting</div>
            </div>
            <div style={{ fontSize:24, opacity:0.9 }}>✈</div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, opacity:0.7 }}>To</div>
              <div style={{ fontSize:34, fontWeight:700, letterSpacing:-0.5 }}>YOU</div>
              <div style={{ fontSize:11, opacity:0.8, marginTop:2 }}>Your team</div>
            </div>
          </div>
          <div style={{ marginTop:18, paddingTop:14, borderTop:'1px dashed rgba(255,255,255,0.3)', display:'flex', justifyContent:'space-between', fontSize:12 }}>
            <div><div style={{ opacity:0.7 }}>Passenger</div><div style={{ fontWeight:600, marginTop:3 }}>{data.name}</div></div>
            <div><div style={{ opacity:0.7 }}>Seat</div><div style={{ fontWeight:600, marginTop:3 }}>PM · Consultant</div></div>
            <div><div style={{ opacity:0.7 }}>Class</div><div style={{ fontWeight:600, marginTop:3 }}>Eager AF</div></div>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ marginTop:16, paddingTop:14, borderTop:'1px dashed rgba(255,255,255,0.25)', display:'flex', justifyContent:'center' }}>
            <div style={{ background:'white', borderRadius:8, padding:8, display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, width:80 }}>
              {[1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1].map((v,i)=>(
                <div key={i} style={{ aspectRatio:'1', background:v?'#000':'transparent', borderRadius:1 }}/>
              ))}
            </div>
          </div>
        </div>

        {/* Coffee Card */}
        <div style={{ display:'flex', flexDirection:'column', padding:22, borderRadius:16, background:'linear-gradient(145deg,#6f4e37,#3a261a)', boxShadow:'0 16px 32px rgba(0,0,0,0.4)', color:'#fff', minHeight:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'rgba(255,255,255,0.7)', letterSpacing:0.5, textTransform:'uppercase' }}>
            <span>Coffee Card</span><span>9 / 10</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginTop:18 }}>
            {Array.from({length:10}).map((_,i)=>(
              <div key={i} style={{ aspectRatio:'1', borderRadius:10, background:i<9?'rgba(255,255,255,0.88)':'rgba(255,255,255,0.12)', display:'grid', placeItems:'center', fontSize:20 }}>{i<9?'☕':''}</div>
            ))}
          </div>
          <div style={{ marginTop:16, fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>Free coffee on the next interview ☕</div>
          <div style={{ flex:1 }}/>
          <div style={{ marginTop:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:8 }}>
              <span>Progress to free drink</span><span>90%</span>
            </div>
            <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.12)', overflow:'hidden' }}>
              <div style={{ height:'100%', width:'90%', borderRadius:3, background:'linear-gradient(90deg,#c8956c,#f0d0a8)' }}/>
            </div>
          </div>
        </div>

      </div>
    </MacAppWindow>
  );
}

// ─── Mac CONTACTS ─────────────────────────────────────────────────────────
export function MacContactsApp({ data, onClose }) {
  const links = data.contactLinks || [];
  const sections = [{ title:'All Contacts', items:[{ id:0, label:data.name }] }];
  return (
    <MacAppWindow title="Contacts" sidebar={<MacSidebar sections={sections} active={0} onPick={()=>{}}/>} onClose={onClose}>
      <div style={{ padding:'40px 48px', display:'flex', gap:40, alignItems:'flex-start' }}>
        {/* Left: photo + name */}
        <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:14, width:180 }}>
          <img src={data.headshot} style={{ width:160, height:160, borderRadius:'50%', objectFit:'cover', boxShadow:'0 12px 32px rgba(0,0,0,0.5)' }}/>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:700, letterSpacing:-0.3 }}>{data.name}</div>
            <div style={{ fontSize:12.5, color:'rgba(235,235,245,0.5)', marginTop:3, lineHeight:1.4 }}>{data.tagline}</div>
          </div>
        </div>
        {/* Right: links + bio */}
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:20 }}>
          {/* Contact links */}
          <div style={{ borderRadius:12, overflow:'hidden', background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.07)' }}>
            {links.map((l,i)=>(
              <a key={i} href={l.href} target="_blank" rel="noreferrer" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 18px', textDecoration:'none', color:'#fff', borderTop:i?'0.5px solid rgba(255,255,255,0.06)':'none' }}>
                <span style={{ fontSize:12.5, color:'rgba(235,235,245,0.5)', width:80 }}>{l.label}</span>
                <span style={{ fontSize:13.5, color:'#5ea9ff', flex:1 }}>{l.value}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H4M8 2V6" stroke="rgba(235,235,245,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}
          </div>
          {/* Bio */}
          <div style={{ borderRadius:12, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.07)', padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:0.4, textTransform:'uppercase', color:'rgba(235,235,245,0.4)', marginBottom:8 }}>Notes</div>
            <div style={{ fontSize:13.5, lineHeight:1.65, color:'rgba(235,235,245,0.75)' }}>Open to <strong style={{color:'rgba(235,235,245,0.95)'}}>IT Strategy · Digital Transformation · PM/PO · Project Manager</strong> roles in unicorns, tech cos or consulting. EU-based.</div>
          </div>
          {/* Quick stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { label:'Experience', value:'2 years', sub:'Scale-ups · Startups · Consulting' },
              { label:'Countries', value:'10+' },
              { label:'Availability', value:'Sept – Nov 2026' },
            ].map((s,i)=>(
              <div key={i} style={{ borderRadius:12, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.07)', padding:'14px 16px' }}>
                <div style={{ fontSize:11, color:'rgba(235,235,245,0.4)', letterSpacing:0.3, textTransform:'uppercase' }}>{s.label}</div>
                <div style={{ fontSize:16, fontWeight:600, marginTop:4 }}>{s.value}</div>
                {s.sub && <div style={{ fontSize:10.5, color:'rgba(235,235,245,0.4)', marginTop:3, lineHeight:1.4 }}>{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MacAppWindow>
  );
}

// ─── Mac PHOTOS (photography only) ────────────────────────────────────────
export function MacPhotosApp({ data, onClose }) {
  const photoAlbums = data.albums.filter(a=>a.kind==='photography');
  const [activeId, setActiveId] = useState(photoAlbums[0]?.id);
  const [selPhoto, setSelPhoto] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const album = photoAlbums.find(a=>a.id===activeId) || photoAlbums[0];

  const sidebarSections = [
    { title:'Library', items:[{ id:'_recent', label:'Recents', disabled:true },{ id:'_memories', label:'Memories', disabled:true }] },
    { title:'Albums', items:photoAlbums.map(a=>({ id:a.id, label:a.title, count:a.shots?.length })) },
  ];

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif", background:'#1c1c1e', color:'#fff', WebkitFontSmoothing:'antialiased', overflow:'hidden', borderRadius:10, boxShadow:'0 30px 80px rgba(0,0,0,0.55),0 0 0 1px rgba(0,0,0,0.3)' }}>
      <div style={{ position:'absolute', top:12, left:14, zIndex:10, display:'flex', gap:8 }}>
        <button onClick={onClose} style={tl('#FF5F57')} title="Close"/>
        <span style={tl('#FEBC2E')}/><span style={tl('#28C840')}/>
      </div>
      {/* Sidebar */}
      <div style={{ width:220, flexShrink:0, background:'rgba(40,40,42,0.92)', borderRight:'0.5px solid rgba(255,255,255,0.08)', padding:'44px 12px 12px', overflow:'auto', display:'flex', flexDirection:'column' }}>
        <MacSidebar sections={sidebarSections} active={activeId} onPick={id=>{setActiveId(id);setSelPhoto(0);}}/>
        {data.links?.portfolio && (
          <div style={{ marginTop:'auto', paddingTop:12, borderTop:'0.5px solid rgba(255,255,255,0.07)' }}>
            <a href={data.links.portfolio} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8, textDecoration:'none', color:'#5ea9ff', fontSize:12.5, letterSpacing:-0.1 }}>
              <Icon name="globe" size={13} color="#5ea9ff"/>
              <span style={{ flex:1 }}>View full portfolio</span>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H4M8 2V6" stroke="#5ea9ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ height:44, padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'0.5px solid rgba(255,255,255,0.08)', background:'rgba(40,40,42,0.6)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Icon name="chevron-left" size={14} color="rgba(235,235,245,0.4)"/>
            <Icon name="chevron-right" size={14} color="rgba(235,235,245,0.7)"/>
            <div style={{ fontSize:13.5, fontWeight:600, marginLeft:8 }}>{album?.title}</div>
            <div style={{ fontSize:11.5, color:'rgba(235,235,245,0.5)', marginLeft:6 }}>· {album?.subtitle}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Icon name="grid" size={14} color="rgba(235,235,245,0.7)"/>
            <Icon name="share" size={14} color="rgba(235,235,245,0.7)"/>
            <button onClick={()=>setShowInfo(v=>!v)} style={{ border:0, background:showInfo?'rgba(10,132,255,0.6)':'transparent', padding:4, borderRadius:4, cursor:'pointer', display:'grid', placeItems:'center' }}>
              <Icon name="info" size={14} color="#fff"/>
            </button>
          </div>
        </div>
        <div style={{ flex:1, overflow:'hidden', display:'flex', minHeight:0 }}>
          <div style={{ flex:1, overflow:'auto', padding:'20px 24px 30px' }}>
            {album && (
              <div>
                {(() => {
                  const grouped = album.shots.reduce((acc,s,i)=>{ const y=(s.date||'').split(' ').pop()||'Unknown'; (acc[y]=acc[y]||[]).push({...s,_i:i}); return acc; },{});
                  const years = Object.keys(grouped).sort().reverse();
                  return years.map(y=>(
                    <div key={y} style={{ marginBottom:26 }}>
                      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
                        <div style={{ fontSize:17, fontWeight:700, letterSpacing:-0.3 }}>{y}</div>
                        <div style={{ fontSize:12, color:'rgba(235,235,245,0.5)' }}>{grouped[y].length} photos</div>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:4 }}>
                        {grouped[y].map(s=>(
                          <div key={s._i} onClick={()=>setSelPhoto(s._i)} style={{ aspectRatio:'1/1', borderRadius:4, overflow:'hidden', cursor:'pointer', outline:selPhoto===s._i?'2.5px solid #0A84FF':'none', outlineOffset:1 }}>
                            {s.src ? <img src={s.src} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${s.gradient[0]},${s.gradient[1]})` }}/>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
          {showInfo && album && (
            <div style={{ width:260, flexShrink:0, borderLeft:'0.5px solid rgba(255,255,255,0.08)', background:'rgba(28,28,30,0.92)', padding:16, overflow:'auto' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:0.4, textTransform:'uppercase', color:'rgba(235,235,245,0.5)', marginBottom:8 }}>Info</div>
              {(() => {
                const p = album.shots[selPhoto];
                return p ? (
                  <>
                    <div style={{ borderRadius:8, overflow:'hidden', aspectRatio:'1/1', marginBottom:10 }}>
                      {p.src ? <img src={p.src} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${p.gradient[0]},${p.gradient[1]})` }}/>}
                    </div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{p.title}</div>
                    <div style={{ fontSize:12, color:'rgba(235,235,245,0.55)' }}>{p.date} · {p.place}</div>
                    <div style={{ marginTop:14, padding:10, borderRadius:8, background:'rgba(255,255,255,0.04)', fontSize:11.5, lineHeight:1.6 }}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'rgba(235,235,245,0.5)' }}>Camera</span><span>{p.camera}</span></div>
                      <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'rgba(235,235,245,0.5)' }}>Lens</span><span>{p.lens}</span></div>
                      <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'rgba(235,235,245,0.5)' }}>Settings</span><span style={{ fontVariantNumeric:'tabular-nums' }}>{p.settings}</span></div>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
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

const macBtn = { border:0, background:'transparent', cursor:'pointer', width:38, height:38, borderRadius:19, display:'grid', placeItems:'center', color:'#fff' };

// ─── Mac Magic 8 Ball ─────────────────────────────────────────────────────
const M8_ANSWERS = [
  { text:"It is certain",        cat:"yes" },
  { text:"Without a doubt",      cat:"yes" },
  { text:"Yes, definitely",      cat:"yes" },
  { text:"You may rely on it",   cat:"yes" },
  { text:"As I see it, yes",     cat:"yes" },
  { text:"Most likely",          cat:"yes" },
  { text:"Outlook good",         cat:"yes" },
  { text:"Signs point to yes",   cat:"yes" },
  { text:"Reply hazy, try again",      cat:"meh" },
  { text:"Ask again later",            cat:"meh" },
  { text:"Better not tell you now",    cat:"meh" },
  { text:"Cannot predict now",         cat:"meh" },
  { text:"Don't count on it",    cat:"no" },
  { text:"My reply is no",       cat:"no" },
  { text:"Outlook not so good",  cat:"no" },
  { text:"Very doubtful",        cat:"no" },
];
const M8_COLOR = { yes:"#0A84FF", meh:"#FF9F0A", no:"#FF453A" };

export function MacMagic8BallApp({ onClose }) {
  const [answer, setAnswer] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [history, setHistory] = useState([]);

  const shake = () => {
    if (shaking) return;
    setShaking(true);
    setAnswer(null);
    setTimeout(() => {
      const a = M8_ANSWERS[Math.floor(Math.random() * M8_ANSWERS.length)];
      setAnswer(a);
      setHistory(h => [a, ...h].slice(0, 8));
      setShaking(false);
    }, 650);
  };

  const color = answer ? M8_COLOR[answer.cat] : '#4facfe';

  const sidebar = (
    <div style={{ paddingTop:4 }}>
      <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.35)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:10 }}>History</div>
      {history.length === 0 && <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)', lineHeight:1.5 }}>No answers yet.</div>}
      {history.map((a, i) => (
        <div key={i} style={{ fontSize:12, color: M8_COLOR[a.cat], padding:'4px 0', borderBottom:'0.5px solid rgba(255,255,255,0.06)', lineHeight:1.4 }}>{a.text}</div>
      ))}
    </div>
  );

  return (
    <MacAppWindow title="Magic 8 Ball" onClose={onClose} sidebar={sidebar}>
      <style>{`@keyframes m8shake{0%,100%{transform:rotate(0deg) scale(1)}12%{transform:rotate(-9deg) scale(0.93)}28%{transform:rotate(10deg) scale(0.96)}44%{transform:rotate(-7deg) scale(0.97)}60%{transform:rotate(7deg) scale(1.03)}78%{transform:rotate(-3deg) scale(0.99)}90%{transform:rotate(3deg) scale(1.01)}}`}</style>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:36, background:'#111', userSelect:'none' }}>
        <div onClick={shake} style={{ width:260, height:260, borderRadius:'50%', cursor:'pointer', position:'relative',
          background:'radial-gradient(circle at 38% 30%, #3a3a3a 0%, #111 40%, #000 100%)',
          boxShadow:'0 30px 80px rgba(0,0,0,0.9), inset 0 -8px 18px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)',
          animation: shaking ? 'm8shake 650ms ease-in-out' : 'none',
          display:'grid', placeItems:'center' }}>
          <div style={{ position:'absolute', top:'10%', left:'18%', width:'42%', height:'30%', borderRadius:'50%', background:'radial-gradient(ellipse, rgba(255,255,255,0.13) 0%, transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ width:110, height:110, borderRadius:'50%',
            background:'radial-gradient(circle at 42% 36%, #1a1a2e, #080808)',
            border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {answer ? (
              <svg width="58" height="50" viewBox="0 0 58 50">
                <polygon points="29,2 56,48 2,48" fill={color} opacity="0.92"/>
                <polygon points="29,14 46,46 12,46" fill="rgba(0,0,0,0.35)"/>
              </svg>
            ) : (
              <div style={{ fontSize:44, fontWeight:900, color:'#fff', fontFamily:"Georgia, 'Times New Roman', serif", lineHeight:1 }}>8</div>
            )}
          </div>
        </div>
        <div style={{ textAlign:'center', minHeight:54, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          {answer ? (
            <>
              <div style={{ fontSize:22, fontWeight:600, color, textAlign:'center', lineHeight:1.4 }}>{answer.text}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Click to ask again</div>
            </>
          ) : (
            <div style={{ fontSize:16, color:'rgba(255,255,255,0.4)', lineHeight:1.6, textAlign:'center' }}>
              {shaking ? '✨ Consulting the spirits…' : 'Think of a question,\nthen click the ball'}
            </div>
          )}
        </div>
      </div>
    </MacAppWindow>
  );
}
