import { useState, useEffect } from 'react';
import { musicEngine } from './music.js';

export function useMusic() {
  const [s, set] = useState(() => musicEngine.snapshot());
  useEffect(() => musicEngine.subscribe(() => set(musicEngine.snapshot())), []);
  return s;
}
