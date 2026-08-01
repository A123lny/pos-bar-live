/* breakfast-art.jsx — illustrazioni a tratto del "mondo colazione", animate.
   Tutto stroke-based, colore guidato dall'accento del tema.
   Esporta: CoffeeCup, Croissant, Bean, Sun, BreakfastMotifs, FeatureArt */

// Tazzina con vapore che sale (il vapore è animato via useTime)
function CoffeeCup({ size = 120, color = '#fff', stroke = 2.4, steam = true }) {
  const time = useTime();
  const wisps = [0, 1, 2];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {steam && wisps.map((i) => {
        const cyc = ((time * 0.55 + i * 0.34) % 1 + 1) % 1;
        const y = 34 - cyc * 18;
        const op = Math.sin(cyc * Math.PI) * 0.85;
        const x = 38 + i * 12 + Math.sin(time * 1.6 + i) * 1.6;
        return (
          <path key={i} d={`M${x} ${y} q 3 -5 0 -10`}
            opacity={op} strokeWidth={stroke * 0.8} />
        );
      })}
      {/* corpo tazzina */}
      <path d="M26 44 h44 v10 a22 22 0 0 1 -44 0 z" />
      {/* manico */}
      <path d="M70 47 a10 10 0 0 1 0 18" />
      {/* piattino */}
      <path d="M20 78 h60" />
      <path d="M28 78 a22 8 0 0 0 44 0" />
    </svg>
  );
}

// Cornetto stilizzato (mezzaluna con tagli)
function Croissant({ size = 110, color = '#fff', stroke = 2.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <g transform="rotate(-38 50 50)">
        <path d="M50 16 a 34 34 0 1 0 26 60 a 27 27 0 1 1 -26 -60 Z" />
        <path d="M40 34 l 8 7" opacity="0.65" />
        <path d="M33 47 l 9 6" opacity="0.65" />
        <path d="M33 61 l 9 4" opacity="0.65" />
      </g>
    </svg>
  );
}

// Chicco di caffè
function Bean({ size = 60, color = '#fff', stroke = 2.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="50" cy="50" rx="26" ry="34" transform="rotate(28 50 50)" />
      <path d="M40 28 C 56 42, 44 58, 60 72" />
    </svg>
  );
}

// Sole/mattino
function Sun({ size = 90, color = '#fff', stroke = 2.4 }) {
  const time = useTime();
  const rot = (time * 8) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="16" />
      <g transform={`rotate(${rot} 50 50)`} opacity="0.85">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1="50" y1="22" x2="50" y2="14"
            transform={`rotate(${a} 50 50)`} />
        ))}
      </g>
    </svg>
  );
}

// Singolo elemento che fluttua dolcemente (translateY + leggera rotazione)
function Floater({ x, y, delay = 0, amp = 10, rot = 6, opacity = 0.18, children }) {
  const time = useTime();
  const ph = time + delay;
  const dy = Math.sin(ph * 0.8) * amp;
  const dr = Math.sin(ph * 0.6 + 1) * rot;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, opacity,
      transform: `translateY(${dy}px) rotate(${dr}deg)`,
    }}>{children}</div>
  );
}

// Layer ambientale di motivi colazione — discreto, sopra lo scrim
function BreakfastMotifs({ color, intensity = 1 }) {
  const o = 0.16 * intensity;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Floater x={1080} y={70} amp={9} opacity={o}>
        <Bean size={64} color={color} />
      </Floater>
      <Floater x={1150} y={250} delay={1.4} amp={12} rot={10} opacity={o * 0.85}>
        <Bean size={44} color={color} />
      </Floater>
      <Floater x={70} y={90} delay={0.7} amp={11} opacity={o * 0.9}>
        <Croissant size={96} color={color} />
      </Floater>
    </div>
  );
}

// Illustrazione protagonista (per intro e segnaposto vuoto)
function FeatureArt({ color, kind = 'cup', size = 200 }) {
  if (kind === 'croissant') return <Croissant size={size} color={color} stroke={2.2} />;
  if (kind === 'sun') return <Sun size={size} color={color} stroke={2.2} />;
  return <CoffeeCup size={size} color={color} stroke={2.2} />;
}

Object.assign(window, {
  CoffeeCup, Croissant, Bean, Sun, Floater, BreakfastMotifs, FeatureArt,
});
