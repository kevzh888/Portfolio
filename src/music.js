// Singleton music engine — autoplays muted, unmutes on first interaction.
//
// Add your DMCA-free tracks here. Each entry:
//   title, artist, album   — displayed in the player UI
//   duration               — display string e.g. "3:24"
//   color                  — [darkColor, darkerColor] used as album art background
//   cover                  — path inside /public  e.g. "/music/my-track-cover.jpg"
//   src                    — path inside /public  e.g. "/music/my-track.mp3"
//
// Good sources for DMCA-free music:
//   https://freemusicarchive.org  (filter by CC license)
//   https://pixabay.com/music
//   https://soundcloud.com/search?filter.license=to_use_commercially

const SONGS = [
  { title: "Lofi Beats",        artist: "Mondamusic",  album: "Pixabay",  duration: "2:24", color: ["#2a1f3d", "#0f0a1a"], cover: null, src: "/music/lofi-beats.mp3" },
  { title: "Lofi Instrumental", artist: "Pulsebox",    album: "Pixabay",  duration: "2:12", color: ["#1a2d3d", "#080f18"], cover: null, src: "/music/lofi-instrumental.mp3" },
  { title: "The Mountain",      artist: "The Mountain",album: "Pixabay",  duration: "1:42", color: ["#1f2d1f", "#090f09"], cover: null, src: "/music/lofi-mountain.mp3" },
  { title: "Lofi Chill",        artist: "Watermello",  album: "Pixabay",  duration: "2:16", color: ["#2d1f2a", "#100810"], cover: null, src: "/music/lofi-chill.mp3" },
];

const state = {
  songs: SONGS,
  idx: 0,
  playing: false,
  muted: true,
  progress: 0,
  duration: 0,
  listeners: new Set(),
};

let audio = null;
let intentionalChange = false; // prevents error handler from firing during deliberate song switches

function emit() { state.listeners.forEach(fn => fn()); }

function loadSong() {
  if (!SONGS.length) return;
  intentionalChange = true;
  audio.src = SONGS[state.idx].src;
  audio.muted = state.muted;
  // setTimeout so the src assignment settles before we clear the flag
  setTimeout(() => { intentionalChange = false; }, 0);
  if (state.playing) {
    audio.play().catch(() => { state.playing = false; emit(); });
  }
}

function loadAndPlay() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.55;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        state.progress = (audio.currentTime / audio.duration) * 100;
        state.duration = audio.duration;
        emit();
      }
    });
    audio.addEventListener("ended", () => {
      state.idx = (state.idx + 1) % SONGS.length;
      state.progress = 0;
      loadSong();
      emit();
    });
    // Only auto-advance on genuine errors, not intentional src changes
    audio.addEventListener("error", () => {
      if (intentionalChange) return;
      // Give up rather than looping if network is unavailable
      state.playing = false;
      emit();
    });
  }

  loadSong();
}

export const musicEngine = {
  play() {
    state.playing = true;
    if (!audio) loadAndPlay();
    else audio.play().catch(() => { state.playing = false; emit(); });
    emit();
  },
  pause() {
    state.playing = false;
    audio?.pause();
    emit();
  },
  toggle() { state.playing ? this.pause() : this.play(); },
  next() { state.idx = (state.idx + 1) % SONGS.length; state.progress = 0; loadAndPlay(); emit(); },
  prev() { state.idx = (state.idx - 1 + SONGS.length) % SONGS.length; state.progress = 0; loadAndPlay(); emit(); },
  select(i) { state.idx = i; state.progress = 0; loadAndPlay(); emit(); },
  setMuted(m) {
    state.muted = m;
    if (audio) audio.muted = m;
    if (!m && !state.playing) {
      state.playing = true;
      if (!audio) loadAndPlay();
      else audio.play().catch(() => { state.playing = false; emit(); });
    }
    emit();
  },
  seek(pct) {
    if (audio?.duration) {
      audio.currentTime = (pct / 100) * audio.duration;
      state.progress = pct;
      emit();
    }
  },
  subscribe(fn) { state.listeners.add(fn); return () => state.listeners.delete(fn); },
  snapshot() {
    return {
      song: SONGS[state.idx],
      songs: SONGS,
      idx: state.idx,
      playing: state.playing,
      muted: state.muted,
      progress: state.progress,
      duration: state.duration,
    };
  },
  // Auto-start muted when engine is first imported
  boot() {
    if (!SONGS.length) return;
    state.playing = true;
    loadAndPlay();
    emit();
  },
};

// Boot on import
musicEngine.boot();
