import { useState, lazy, Suspense } from 'react';
import { PORTFOLIO } from './data.js';
import { IOSDevice } from './IOSFrame.jsx';
import { IOSHomeScreen, MacDesktop, UnmutePill } from './OsChrome.jsx';
import { MacLockScreen, IOSLockScreen } from './LockScreen.jsx';

const PhotosApp    = lazy(() => import('./PhotosApp.jsx'));
const NotesApp     = lazy(() => import('./IOSApps.jsx').then(m => ({ default: m.NotesApp })));
const MusicApp        = lazy(() => import('./IOSApps.jsx').then(m => ({ default: m.MusicApp })));
const Magic8BallApp   = lazy(() => import('./IOSApps.jsx').then(m => ({ default: m.Magic8BallApp })));
const WalletApp    = lazy(() => import('./IOSApps.jsx').then(m => ({ default: m.WalletApp })));
const ContactsApp  = lazy(() => import('./IOSApps.jsx').then(m => ({ default: m.ContactsApp })));
const MacPhotosApp  = lazy(() => import('./MacShell.jsx').then(m => ({ default: m.MacPhotosApp })));
const MacNotesApp   = lazy(() => import('./MacShell.jsx').then(m => ({ default: m.MacNotesApp })));
const MacMusicApp   = lazy(() => import('./MacShell.jsx').then(m => ({ default: m.MacMusicApp })));
const MacWalletApp  = lazy(() => import('./MacShell.jsx').then(m => ({ default: m.MacWalletApp })));
const MacContactsApp   = lazy(() => import('./MacShell.jsx').then(m => ({ default: m.MacContactsApp })));
const MacMagic8BallApp = lazy(() => import('./MacShell.jsx').then(m => ({ default: m.MacMagic8BallApp })));
const DinoGame         = lazy(() => import('./DinoGame.jsx').then(m => ({ default: m.DinoGame })));

const AppFallback = <div style={{ width:'100%', height:'100%', background:'#1c1c1e' }}/>;

// ─── iPhone with home screen ───────────────────────────────────────────────
function PhoneWithHome({ dark: initialDark }) {
  const [open, setOpen] = useState(null);
  const [dark, setDark] = useState(initialDark);
  const [locked, setLocked] = useState(true);
  const back = () => setOpen(null);

  return (
    <IOSDevice width={390} height={780} dark={dark}>
      <div style={{ height:'100%', position:'relative', overflow:'hidden' }}>
        {locked ? (
          <IOSLockScreen onUnlock={() => setLocked(false)}/>
        ) : (
          <>
            {open === null && (
              <IOSHomeScreen
                onLaunch={setOpen}
                dark={dark}
                onToggleTheme={() => setDark(d => !d)}
                links={PORTFOLIO.links}
              />
            )}
            {open !== null && (
              <div style={{ position:'absolute', inset:0, animation:'appopen 360ms cubic-bezier(.2,.7,.2,1)' }}>
                <style>{`@keyframes appopen{from{transform:scale(0.3);opacity:0;border-radius:24px}}`}</style>
                <Suspense fallback={AppFallback}>
                  {open === 'photos'    && <PhotosApp dark={dark} density="normal" data={PORTFOLIO}/>}
                  {open === 'notes'     && <NotesApp data={PORTFOLIO} onBack={back}/>}
                  {open === 'music'     && <MusicApp onBack={back}/>}
                  {open === 'wallet'    && <WalletApp data={PORTFOLIO} onBack={back}/>}
                  {open === 'contacts'  && <ContactsApp data={PORTFOLIO} onBack={back}/>}
                  {open === 'magic8'    && <Magic8BallApp onBack={back}/>}
                </Suspense>
                {open === 'photos' && (
                  <button onClick={back} style={{ position:'absolute', top:56, right:14, zIndex:200, border:0, background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:10, padding:'3px 8px', borderRadius:999, cursor:'pointer' }}>← Home</button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </IOSDevice>
  );
}

// ─── Mac desktop with launchable apps ─────────────────────────────────────
function MacDesktopWrap() {
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState('notes');
  const [locked, setLocked] = useState(true);
  const close = () => setOpen(null);

  return (
    <div style={{ width:'100%', height:'100%', position:'relative' }}>
      <MacDesktop dark={dark} onToggleTheme={() => setDark(d => !d)} onLaunch={setOpen} active={open} links={{ ...PORTFOLIO.links, email: PORTFOLIO.email }}>
        {open && (
          <div style={{ width:'100%', height:'100%', animation:'macopen 320ms cubic-bezier(.2,.7,.2,1)' }}>
            <style>{`@keyframes macopen{from{transform:scale(0.92);opacity:0}}`}</style>
            <Suspense fallback={AppFallback}>
              {open === 'photos'   && <MacPhotosApp   data={PORTFOLIO} onClose={close}/>}
              {open === 'notes'    && <MacNotesApp    data={PORTFOLIO} onClose={close}/>}
              {open === 'music'    && <MacMusicApp    onClose={close}/>}
              {open === 'wallet'   && <MacWalletApp   data={PORTFOLIO} onClose={close}/>}
              {open === 'contacts' && <MacContactsApp   data={PORTFOLIO} onClose={close}/>}
              {open === 'magic8'   && <MacMagic8BallApp onClose={close}/>}
              {open === 'safari'   && <DinoGame         onClose={close}/>}
            </Suspense>
          </div>
        )}
      </MacDesktop>
      {locked && <MacLockScreen onUnlock={() => setLocked(false)} dark={dark}/>}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 30% 25%,#2c5b87 0%,#14304a 45%,#060d18 100%)', overflow:'hidden' }}>
      <style>{`
        .view-iphone { display: flex; }
        .view-mac    { display: none; }
        .mac-pill    { display: none; }
        @media (min-width: 900px) {
          .view-iphone { display: none; }
          .view-mac    { display: flex; }
          .mac-pill    { display: block; }
        }
      `}</style>

      {/* UnmutePill only on desktop (Mac mode) — iPhone uses Dynamic Island */}
      <div className="mac-pill">
        <UnmutePill/>
      </div>

      {/* iPhone — small screens only */}
      <div className="view-iphone" style={{ alignItems:'center', justifyContent:'center' }}>
        <PhoneWithHome dark={true}/>
      </div>

      {/* Mac — large screens only */}
      <div className="view-mac" style={{ width:'100%', height:'100%' }}>
        <MacDesktopWrap/>
      </div>
    </div>
  );
}
