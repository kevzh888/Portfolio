export default function Icon({ name, size = 22, color = "currentColor", style = {} }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", style };
  switch (name) {
    case "person": return <svg {...p}><circle cx="12" cy="8" r="3.6"/><path d="M4.5 19.5c1.4-3.4 4.4-5.2 7.5-5.2s6.1 1.8 7.5 5.2"/></svg>;
    case "briefcase": return <svg {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12h18"/></svg>;
    case "cap": return <svg {...p}><path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5z"/><path d="M6.5 11.5v4.2c0 1 2.5 2.3 5.5 2.3s5.5-1.3 5.5-2.3v-4.2"/><path d="M21 9.5v5"/></svg>;
    case "rosette": return <svg {...p}><circle cx="12" cy="9" r="5"/><path d="M9 13.5 7 21l5-2.5L17 21l-2-7.5"/><circle cx="12" cy="9" r="2.2"/></svg>;
    case "sparkle": return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "camera": return <svg {...p}><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case "heart": return <svg {...p}><path d="M12 20s-7-4.5-7-10a4.2 4.2 0 0 1 7-3 4.2 4.2 0 0 1 7 3c0 5.5-7 10-7 10z"/></svg>;
    case "globe": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 4.2 6 4.2 9s-1.4 6-4.2 9c-2.8-3-4.2-6-4.2-9S9.2 6 12 3z"/></svg>;
    case "envelope": return <svg {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3.5 7 12 13l8.5-6"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>;
    case "chevron-left": return <svg {...p}><path d="M14 6l-6 6 6 6"/></svg>;
    case "chevron-right": return <svg {...p}><path d="M10 6l6 6-6 6"/></svg>;
    case "chevron-down": return <svg {...p}><path d="M6 10l6 6 6-6"/></svg>;
    case "ellipsis": return <svg {...p} strokeWidth="2.4"><circle cx="6" cy="12" r=".6"/><circle cx="12" cy="12" r=".6"/><circle cx="18" cy="12" r=".6"/></svg>;
    case "plus": return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "share": return <svg {...p}><path d="M12 4v11M12 4l-3.5 3.5M12 4l3.5 3.5"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>;
    case "info": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8.2v.1"/></svg>;
    case "map": return <svg {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>;
    case "moon": return <svg {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>;
    case "sun": return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>;
    case "grid": return <svg {...p}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>;
    case "list": return <svg {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "heart-fill": return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}><path d="M12 20.5s-8-5-8-11.2a4.7 4.7 0 0 1 8-3.4 4.7 4.7 0 0 1 8 3.4c0 6.2-8 11.2-8 11.2z"/></svg>;
    default: return null;
  }
}
