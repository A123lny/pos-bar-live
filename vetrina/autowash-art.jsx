/* autowash-art.jsx — grafica animata per il video autolavaggio.
   Gocce, scia "shine", linee di velocità, icone servizi. Stroke-based.
   Esporta su window. */

// ── Utilità pseudo-casuale deterministica ────────────────────────────────
function rnd(i, salt = 0) { const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453; return x - Math.floor(x); }

// ── Goccia (icona / particella) ──────────────────────────────────────────
function Drop({ size = 40, color = '#fff', stroke = 2.4, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={fill}
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 10 C50 10 80 48 80 66 A30 30 0 1 1 20 66 C20 48 50 10 50 10 Z" />
    </svg>
  );
}

// ── Campo di gocce che cadono (parallax + loop) ──────────────────────────
function DropletField({ color = 'rgba(255,255,255,0.5)', count = 16, intensity = 1 }) {
  const time = useTime();
  const drops = [];
  for (let i = 0; i < count; i++) {
    const x = rnd(i, 1) * 1280;
    const speed = 120 + rnd(i, 2) * 220;       // px/s
    const len = 14 + rnd(i, 3) * 26;
    const span = 800 + len + 60;
    const y = ((rnd(i, 4) * span + time * speed) % span) - len - 30;
    const op = (0.12 + rnd(i, 5) * 0.5) * intensity;
    const w = 1 + rnd(i, 6) * 1.6;
    drops.push(
      <div key={i} style={{
        position: 'absolute', left: x, top: y, width: w, height: len,
        background: `linear-gradient(${color}, transparent)`,
        borderRadius: w, opacity: op,
      }}></div>
    );
  }
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>{drops}</div>;
}

// ── Scia luminosa diagonale che attraversa lo schermo ────────────────────
function ShineSweep({ period = 4.2, color = 'rgba(255,255,255,0.16)', width = 220 }) {
  const time = useTime();
  const p = ((time % period) / period);          // 0..1
  const x = -width + p * (1280 + width * 2);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -120, bottom: -120, left: x, width,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        transform: 'rotate(14deg)', filter: 'blur(2px)',
      }}></div>
    </div>
  );
}

// ── Linee di velocità diagonali (energia) ────────────────────────────────
function SpeedStreaks({ color = 'rgba(255,255,255,0.10)', count = 9 }) {
  const time = useTime();
  const items = [];
  for (let i = 0; i < count; i++) {
    const y = 60 + i * (760 / count) + rnd(i, 7) * 24;
    const len = 180 + rnd(i, 8) * 360;
    const speed = 220 + rnd(i, 9) * 260;
    const span = 1280 + len + 200;
    const x = ((time * speed + rnd(i, 10) * span) % span) - len - 100;
    items.push(
      <div key={i} style={{
        position: 'absolute', left: x, top: y, width: len, height: 2,
        background: `linear-gradient(90deg, transparent, ${color})`,
        opacity: 0.5 + rnd(i, 11) * 0.5,
      }}></div>
    );
  }
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>{items}</div>;
}

// ── Icone servizi ─────────────────────────────────────────────────────────
function CarIcon({ size = 96, color = '#fff', stroke = 3 }) {
  const time = useTime();
  return (
    <svg width={size} height={size} viewBox="0 0 120 100" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {/* gocce sopra l'auto */}
      {[28, 60, 92].map((cx, i) => {
        const dy = (Math.sin(time * 2 + i) * 0.5 + 0.5) * 4;
        return <path key={i} d={`M${cx} ${10 + dy} q3 5 0 8 q-3 -3 0 -8`} strokeWidth={stroke * 0.7} opacity="0.85" />;
      })}
      {/* carrozzeria */}
      <path d="M14 70 L14 60 Q14 54 24 53 L40 53 L52 38 Q55 35 62 35 L80 35 Q90 35 96 45 L104 54 Q110 55 110 62 L110 70" />
      {/* sottoscocca tra le ruote */}
      <path d="M44 70 L78 70" />
      {/* finestrini */}
      <path d="M54 53 L60 41 L76 41 L84 53" opacity="0.7" />
      {/* ruote */}
      <circle cx="32" cy="72" r="11" />
      <circle cx="90" cy="72" r="11" />
    </svg>
  );
}

function SprayIcon({ size = 96, color = '#fff', stroke = 3 }) {
  const time = useTime();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {/* corpo flacone */}
      <rect x="42" y="42" width="26" height="44" rx="5" />
      <path d="M48 42 L48 32 L62 32 L62 42" />
      {/* testa/grilletto */}
      <path d="M48 34 L30 30 L30 22 L48 27" />
      <path d="M42 42 L42 50 L34 52" />
      {/* spruzzo animato */}
      {[0, 1, 2].map((i) => {
        const o = (Math.sin(time * 3 - i) * 0.5 + 0.5);
        return <circle key={i} cx={20 - i * 6} cy={18 + i * 5} r="2.2" fill={color} stroke="none" opacity={o} />;
      })}
    </svg>
  );
}

function ShineIcon({ size = 96, color = '#fff', stroke = 3 }) {
  const time = useTime();
  const s = 0.85 + (Math.sin(time * 2.4) * 0.5 + 0.5) * 0.3;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {/* superficie lucida */}
      <path d="M16 74 Q50 58 84 74" />
      {/* stella shine grande */}
      <g transform={`translate(50 40) scale(${s}) translate(-50 -40)`}>
        <path d="M50 18 C52 32 56 36 70 40 C56 44 52 48 50 62 C48 48 44 44 30 40 C44 36 48 32 50 18 Z" fill={color} stroke="none" />
      </g>
      {/* scintille piccole */}
      <path d="M74 26 l0 8 M70 30 l8 0" strokeWidth={stroke * 0.8} opacity="0.8" />
      <path d="M26 30 l0 6 M23 33 l6 0" strokeWidth={stroke * 0.8} opacity="0.7" />
    </svg>
  );
}

Object.assign(window, {
  Drop, DropletField, ShineSweep, SpeedStreaks, CarIcon, SprayIcon, ShineIcon,
});
