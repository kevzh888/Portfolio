import { useState, useEffect, useRef, useMemo } from 'react';
import Icon from './Icon.jsx';

function Cover({ album, density }) {
  const src = album.cover || album.shots?.[0]?.src;
  if (src) return <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>;
  if (album.gradient) {
    const [a,b,c] = album.gradient;
    const g = c ? `linear-gradient(135deg,${a},${b},${c})` : `linear-gradient(135deg,${a},${b})`;
    return (
      <div style={{ width:'100%', height:'100%', background:g, position:'relative', display:'grid', placeItems:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 30%,rgba(255,255,255,0.25),transparent 55%)' }}/>
        <Icon name="camera" size={density==='tight'?32:44} color="rgba(255,255,255,0.95)"/>
      </div>
    );
  }
  return null;
}

function AlbumTile({ album, onOpen, dark, density }) {
  const [pressed, setPressed] = useState(false);
  const tileSize = density==='tight'?100:density==='loose'?168:134;
  return (
    <button onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)} onMouseLeave={()=>setPressed(false)} onClick={()=>onOpen(album)}
      style={{ background:'none', border:0, padding:0, cursor:'pointer', width:'100%', textAlign:'left', color:'inherit', transition:'transform 220ms cubic-bezier(.2,.7,.2,1)', transform:pressed?'scale(0.94)':'scale(1)' }}>
      <div style={{ width:'100%', aspectRatio:'1/1', borderRadius:14, overflow:'hidden', position:'relative', boxShadow:dark?'0 1px 0 rgba(255,255,255,0.04)':'0 1px 2px rgba(0,0,0,0.05)' }}>
        <Cover album={album} dark={dark} density={density}/>
      </div>
      <div style={{ marginTop:8, paddingLeft:2 }}>
        <div style={{ fontSize:density==='tight'?13:15, fontWeight:500, color:dark?'#fff':'#000', letterSpacing:-0.2, lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{album.title}</div>
        <div style={{ fontSize:density==='tight'?11:13, color:dark?'rgba(235,235,245,0.55)':'rgba(60,60,67,0.55)', marginTop:1 }}>{album.subtitle}</div>
      </div>
    </button>
  );
}

function HomeView({ data, onOpen, dark, density, query, setQuery }) {
  const filtered = useMemo(() => {
    if (!query.trim()) return data.albums;
    const q = query.toLowerCase();
    return data.albums.filter(a=>a.title.toLowerCase().includes(q)||(a.subtitle||'').toLowerCase().includes(q));
  }, [data, query]);
  const cols = density==='tight'?3:2;

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ padding:'62px 20px 6px' }}>
        <h1 style={{ fontSize:34, fontWeight:700, letterSpacing:-0.6, margin:0, color:dark?'#fff':'#000' }}>Albums</h1>
      </div>
      {data.links?.portfolio && (
        <div style={{ padding:'8px 16px 4px' }}>
          <a href={data.links.portfolio} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:12, background:dark?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)', textDecoration:'none' }}>
            <div style={{ width:34, height:34, borderRadius:8, background:'#0A84FF', display:'grid', placeItems:'center', flexShrink:0 }}>
              <Icon name="globe" size={18} color="#fff"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#0A84FF', letterSpacing:-0.2 }}>View full portfolio</div>
              <div style={{ fontSize:11.5, color:dark?'rgba(235,235,245,0.45)':'rgba(60,60,67,0.5)', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>zjhphotography.myportfolio.com</div>
            </div>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H4M8 2V6" stroke="rgba(10,132,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      )}
      <div style={{ padding:'8px 16px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:10, background:dark?'rgba(118,118,128,0.24)':'rgba(118,118,128,0.12)' }}>
          <Icon name="search" size={17} color={dark?'rgba(235,235,245,0.6)':'rgba(60,60,67,0.6)'}/>
          <input placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} style={{ flex:1, border:0, outline:'none', background:'transparent', font:'inherit', fontSize:17, color:dark?'#fff':'#000', letterSpacing:-0.4 }}/>
          {query && <button onClick={()=>setQuery('')} style={{ border:0, background:dark?'rgba(235,235,245,0.3)':'rgba(60,60,67,0.3)', color:dark?'#000':'#fff', width:18, height:18, borderRadius:9, fontSize:13, lineHeight:'18px', cursor:'pointer', padding:0 }}>×</button>}
        </div>
      </div>
      <div style={{ padding:'6px 20px 12px', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <h2 style={{ fontSize:22, fontWeight:700, letterSpacing:-0.4, margin:0, color:dark?'#fff':'#000' }}>My Albums</h2>
        <button style={{ border:0, background:'transparent', font:'inherit', fontSize:15, color:'#0A84FF', cursor:'pointer', padding:0 }}>See All</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:density==='tight'?'16px 12px':'22px 16px', padding:'0 16px' }}>
        {filtered.map(a=><AlbumTile key={a.id} album={a} onOpen={onOpen} dark={dark} density={density}/>)}
        {filtered.length===0 && <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px 20px', color:dark?'rgba(235,235,245,0.5)':'rgba(60,60,67,0.5)', fontSize:15 }}>No results for "{query}"</div>}
      </div>
    </div>
  );
}

function DetailPhotography({ album, dark }) {
  const [open, setOpen] = useState(null);
  const [year, setYear] = useState('All');
  const years = useMemo(() => {
    const set = new Set(album.shots.map(s=>(s.date||'').split(' ').pop()).filter(Boolean));
    return ['All',...Array.from(set).sort().reverse()];
  }, [album]);
  const shots = useMemo(() => year==='All'?album.shots:album.shots.filter(s=>(s.date||'').endsWith(year)), [album,year]);

  return (
    <div style={{ padding:'0 0 40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:5, backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', background:dark?'rgba(0,0,0,0.55)':'rgba(255,255,255,0.55)', padding:'8px 16px', display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none' }}>
        {years.map(y=><button key={y} onClick={()=>setYear(y)} style={{ padding:'6px 14px', borderRadius:999, border:0, font:'inherit', fontSize:13, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap', background:year===y?'#0A84FF':(dark?'rgba(118,118,128,0.24)':'rgba(118,118,128,0.16)'), color:year===y?'#fff':(dark?'#fff':'#000'), transition:'background 200ms' }}>{y}</button>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2, marginTop:6, padding:'0 2px' }}>
        {shots.map((s,i)=>(
          <button key={i} onClick={()=>setOpen(i)} style={{ border:0, padding:0, cursor:'pointer', background:'none', aspectRatio:'1/1', overflow:'hidden', position:'relative' }}>
            {s.src ? <img src={s.src} alt={s.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${s.gradient[0]},${s.gradient[1]}${s.gradient[2]?`,${s.gradient[2]}`:''})` }}/>}
          </button>
        ))}
      </div>
      {open!==null && <Lightbox shots={shots} start={open} onClose={()=>setOpen(null)} dark={dark}/>}
    </div>
  );
}

function Lightbox({ shots, start, onClose, dark }) {
  const [idx, setIdx] = useState(start);
  const [info, setInfo] = useState(true);
  const [dragX, setDragX] = useState(0);
  const dragRef = useRef({ x:0, dragging:false });
  const next = ()=>setIdx(i=>Math.min(shots.length-1,i+1));
  const prev = ()=>setIdx(i=>Math.max(0,i-1));
  useEffect(()=>{
    const fn = e=>{if(e.key==='Escape')onClose();if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev();};
    window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn);
  },[shots.length]);
  const s = shots[idx];
  return (
    <div style={{ position:'absolute', inset:0, zIndex:100, background:'#000', color:'#fff', display:'flex', flexDirection:'column', animation:'lb-fade 240ms ease' }}>
      <style>{`@keyframes lb-fade{from{opacity:0}}`}</style>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 16px 10px', flexShrink:0 }}>
        <button onClick={onClose} style={{ border:0, background:'rgba(255,255,255,0.12)', width:32, height:32, borderRadius:16, color:'#fff', display:'grid', placeItems:'center', cursor:'pointer', padding:0 }}>
          <Icon name="chevron-left" size={20} color="#fff"/>
        </button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:15, fontWeight:600 }}>{s.title}</div>
          <div style={{ fontSize:12, opacity:0.6 }}>{s.date} · {idx+1} of {shots.length}</div>
        </div>
        <button onClick={()=>setInfo(v=>!v)} style={{ border:0, background:info?'rgba(10,132,255,0.9)':'rgba(255,255,255,0.12)', width:32, height:32, borderRadius:16, color:'#fff', display:'grid', placeItems:'center', cursor:'pointer', padding:0 }}>
          <Icon name="info" size={18} color="#fff"/>
        </button>
      </div>
      <div onMouseDown={e=>{dragRef.current={x:e.clientX,dragging:true};}} onMouseMove={e=>{if(!dragRef.current.dragging)return;setDragX(e.clientX-dragRef.current.x);}} onMouseUp={()=>{const dx=dragX;dragRef.current.dragging=false;if(dx<-60)next();else if(dx>60)prev();setDragX(0);}} onMouseLeave={()=>{dragRef.current.dragging=false;setDragX(0);}} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 16px', overflow:'hidden', cursor:'grab', touchAction:'pan-y' }}>
        <div style={{ maxWidth:'100%', maxHeight:'100%', width:'100%', aspectRatio:'1/1', borderRadius:8, overflow:'hidden', transform:`translateX(${dragX}px)`, transition:dragRef.current.dragging?'none':'transform 280ms cubic-bezier(.2,.7,.2,1)' }}>
          {s.src ? <img src={s.src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', pointerEvents:'none' }}/> : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${s.gradient[0]},${s.gradient[1]}${s.gradient[2]?`,${s.gradient[2]}`:''})` }}/>}
        </div>
      </div>
      {info && (
        <div style={{ padding:'16px 20px 26px', flexShrink:0, background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.7))', animation:'lb-up 280ms cubic-bezier(.2,.7,.2,1)' }}>
          <style>{`@keyframes lb-up{from{transform:translateY(20px);opacity:0}}`}</style>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:0.6, textTransform:'uppercase', opacity:0.6 }}>{s.camera}</div>
              <div style={{ fontSize:13, marginTop:2, opacity:0.85 }}>{s.lens}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:0.6, textTransform:'uppercase', opacity:0.6 }}>{s.place}</div>
              <div style={{ fontSize:13, marginTop:2, opacity:0.85, fontVariantNumeric:'tabular-nums' }}>{s.settings}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:4, justifyContent:'center', marginTop:8 }}>
            {shots.map((_,i)=><div key={i} style={{ width:i===idx?18:4, height:4, borderRadius:2, background:i===idx?'#fff':'rgba(255,255,255,0.4)', transition:'width 200ms' }}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailContact({ album, dark }) {
  return (
    <div style={{ padding:'0 20px 40px' }}>
      <div style={{ borderRadius:16, overflow:'hidden', background:dark?'rgba(118,118,128,0.16)':'#fff' }}>
        {album.links.map((l,i)=>(
          <a key={i} href={l.href} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', textDecoration:'none', borderBottom:i<album.links.length-1?`0.5px solid ${dark?'rgba(255,255,255,0.08)':'rgba(60,60,67,0.18)'}`:'' }}>
            <span style={{ fontSize:15, color:dark?'rgba(235,235,245,0.6)':'rgba(60,60,67,0.6)' }}>{l.label}</span>
            <span style={{ fontSize:15, color:'#0A84FF', letterSpacing:-0.2 }}>{l.value}</span>
          </a>
        ))}
      </div>
      <div style={{ marginTop:22, padding:'14px 16px', borderRadius:14, background:dark?'rgba(10,132,255,0.16)':'rgba(10,132,255,0.08)', textAlign:'center' }}>
        <div style={{ fontSize:13.5, color:dark?'rgba(255,255,255,0.85)':'#1c1c1e', lineHeight:1.6 }}>
          <div style={{ fontWeight:600, marginBottom:4 }}>🔍 Open to opportunities · Sept–Nov 2026</div>
          <div style={{ opacity:0.75 }}>IT Strategy · Digital Transformation · PM/PO · Project Manager</div>
          <div style={{ opacity:0.6, fontSize:12, marginTop:3 }}>Unicorn · Tech company · Consulting</div>
        </div>
      </div>
    </div>
  );
}

function DetailView({ album, data, onBack, dark }) {
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);
  useEffect(()=>{
    const el = scrollRef.current; if(!el)return;
    const fn = ()=>setScrollY(el.scrollTop);
    el.addEventListener('scroll',fn,{passive:true}); return()=>el.removeEventListener('scroll',fn);
  },[]);
  const collapsed = scrollY > 40;

  const body = {
    photography: <DetailPhotography album={album} dark={dark}/>,
    contact: <DetailContact album={album} dark={dark}/>,
  }[album.kind] || null;

  return (
    <div ref={scrollRef} style={{ position:'absolute', inset:0, overflow:'auto', animation:'detail-in 320ms cubic-bezier(.2,.7,.2,1)', background:dark?'#000':'#F2F2F7' }}>
      <style>{`@keyframes detail-in{from{opacity:0;transform:scale(0.96)}}`}</style>
      <div style={{ position:'sticky', top:0, zIndex:10, background:collapsed?(dark?'rgba(0,0,0,0.72)':'rgba(255,255,255,0.72)'):'transparent', backdropFilter:collapsed?'blur(20px) saturate(180%)':'none', WebkitBackdropFilter:collapsed?'blur(20px) saturate(180%)':'none', transition:'background 200ms', padding:'62px 12px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button onClick={onBack} style={{ border:0, background:'transparent', display:'flex', alignItems:'center', gap:2, color:'#0A84FF', font:'inherit', fontSize:17, cursor:'pointer', padding:'4px 6px', letterSpacing:-0.4 }}>
          <Icon name="chevron-left" size={22} color="#0A84FF"/> Albums
        </button>
        <div style={{ fontSize:17, fontWeight:600, letterSpacing:-0.4, color:dark?'#fff':'#000', opacity:collapsed?1:0, transition:'opacity 200ms' }}>{album.title}</div>
        <div style={{ width:40 }}/>
      </div>
      {album.kind!=='photography' && (
        <div style={{ padding:'4px 20px 10px' }}>
          <div style={{ fontSize:32, fontWeight:700, letterSpacing:-0.6, color:dark?'#fff':'#000' }}>{album.title}</div>
          <div style={{ fontSize:15, color:dark?'rgba(235,235,245,0.55)':'rgba(60,60,67,0.55)', marginTop:2 }}>{album.subtitle}</div>
        </div>
      )}
      {body}
    </div>
  );
}

export default function PhotosApp({ dark = false, density = 'normal', data }) {
  const [openAlbum, setOpenAlbum] = useState(null);
  const [query, setQuery] = useState('');
  const bg = dark ? '#000' : '#F2F2F7';

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:bg, overflow:'hidden', fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif", color:dark?'#fff':'#000', WebkitFontSmoothing:'antialiased' }}>
      <div style={{ position:'absolute', inset:0, overflow:'auto', opacity:openAlbum?0:1, transform:openAlbum?'scale(0.96)':'scale(1)', transition:'opacity 260ms cubic-bezier(.2,.7,.2,1),transform 320ms cubic-bezier(.2,.7,.2,1)', pointerEvents:openAlbum?'none':'auto' }}>
        <HomeView data={data} onOpen={setOpenAlbum} dark={dark} density={density} query={query} setQuery={setQuery}/>
      </div>
      {openAlbum && <DetailView album={openAlbum} data={data} dark={dark} onBack={()=>setOpenAlbum(null)}/>}
      {!openAlbum && (
        <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:30, padding:'10px 20px 28px', background:dark?'rgba(0,0,0,0.62)':'rgba(255,255,255,0.62)', backdropFilter:'blur(28px) saturate(180%)', WebkitBackdropFilter:'blur(28px) saturate(180%)', borderTop:`0.5px solid ${dark?'rgba(255,255,255,0.08)':'rgba(60,60,67,0.18)'}`, display:'flex', justifyContent:'space-around', alignItems:'center' }}>
          {[{name:'grid',label:'Library'},{name:'heart',label:'For You'},{name:'person',label:'People'},{name:'search',label:'Search'}].map((t,i)=>(
            <button key={i} style={{ border:0, background:'transparent', display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', padding:4, color:i===0?'#0A84FF':(dark?'rgba(235,235,245,0.6)':'rgba(60,60,67,0.6)') }}>
              <Icon name={t.name} size={22} color={i===0?'#0A84FF':(dark?'rgba(235,235,245,0.7)':'rgba(60,60,67,0.7)')}/>
              <span style={{ fontSize:10, fontWeight:600, letterSpacing:-0.1 }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
