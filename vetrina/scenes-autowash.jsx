/* scenes-autowash.jsx — temi e scene per il video autolavaggio (1280×800).
   Autonomo: definisce i propri helper (awRise, AWLayer). Esporta su window. */

const AW = { W: 1280, H: 800 };

const AW_THEMES = {
  'Acqua': {
    bg: 'radial-gradient(120% 120% at 30% 10%, #0d426e 0%, #07223b 55%, #04162a 100%)',
    text: '#ffffff', sub: 'rgba(255,255,255,0.72)',
    accent: '#37d7e6', accentInk: '#062a45',
    streak: 'rgba(120,225,245,0.16)', drop: 'rgba(180,240,255,0.6)',
    headFont: "'Archivo', sans-serif", headWeight: 900, headTrack: '-0.02em',
  },
  'Notte Eni': {
    bg: 'radial-gradient(120% 120% at 70% 0%, #1a1a1a 0%, #0c0c0c 60%, #050505 100%)',
    text: '#ffffff', sub: 'rgba(255,255,255,0.66)',
    accent: '#ffd400', accentInk: '#0b0b0b',
    streak: 'rgba(255,212,0,0.12)', drop: 'rgba(255,255,255,0.5)',
    headFont: "'Archivo', sans-serif", headWeight: 900, headTrack: '-0.02em',
  },
  'Acciaio': {
    bg: 'radial-gradient(120% 120% at 25% 15%, #2a2f37 0%, #181b21 55%, #0e1014 100%)',
    text: '#ffffff', sub: 'rgba(255,255,255,0.70)',
    accent: '#56a8ff', accentInk: '#0b1726',
    streak: 'rgba(120,180,255,0.14)', drop: 'rgba(200,225,255,0.55)',
    headFont: "'Archivo', sans-serif", headWeight: 900, headTrack: '-0.02em',
  },
};

const AW_INTRO = { start: 0, end: 5.2 };
const AW_SERVIZI = { start: 4.7, end: 12.3 };
const AW_OUTRO = { start: 11.8, end: 17.6 };
const AW_DURATION = 17.6;

function awRise(t, at, d = 0.5, dist = 30) {
  const p = clamp((t - at) / d, 0, 1);
  const e = Easing.easeOutCubic(p);
  return { opacity: e, transform: `translateY(${(1 - e) * dist}px)` };
}

function AWLayer({ start, end, fadeIn = 0.5, fadeOut = 0.5, z = 1, children }) {
  const time = useTime();
  let raw = 0;
  if (time >= start - 0.001 && time <= end + 0.001) {
    raw = Math.min(clamp((time - start) / fadeIn, 0, 1), clamp((end - time) / fadeOut, 0, 1));
  }
  const opacity = Easing.easeInOutSine(raw);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, zIndex: z, pointerEvents: raw > 0.55 ? 'auto' : 'none' }}>
      {children}
    </div>
  );
}

// Sfondo animato comune (gradiente tema + energia)
function AWEnergy({ theme, hero = false }) {
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: theme.bg }}></div>
      {hero && (
        <React.Fragment>
          <image-slot
            id="autowash-hero" fit="cover" shape="rect"
            placeholder="Trascina qui una foto dell’auto"
            style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%',
              color: 'transparent', '--slot-bg': 'transparent', '--slot-ring': 'transparent' }}
          ></image-slot>
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(115deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.2) 100%)' }}></div>
        </React.Fragment>
      )}
      <SpeedStreaks color={theme.streak} />
      <DropletField color={theme.drop} count={18} />
      <ShineSweep color="rgba(255,255,255,0.14)" />
    </React.Fragment>
  );
}

// ── INTRO: claim impattante ───────────────────────────────────────────────
function AWIntro({ theme, brand, showEn }) {
  const time = useTime();
  const lt = time - AW_INTRO.start;
  const words = [
    { t: 'ENTRA.', accent: false },
    { t: 'BRILLA.', accent: true },
    { t: 'RIPARTI.', accent: false },
  ];
  return (
    <AWLayer start={AW_INTRO.start} end={AW_INTRO.end} z={5}>
      <AWEnergy theme={theme} hero={true} />
      <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, right: 80,
        display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, ...awRise(lt, 0.05, 0.5),
        }}>
          <div style={{ width: 40, height: 4, background: theme.accent, borderRadius: 2 }}></div>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
            letterSpacing: '0.26em', textTransform: 'uppercase', color: theme.accent, whiteSpace: 'nowrap' }}>
            Autolavaggio · {brand}
          </div>
        </div>
        {words.map((w, i) => (
          <div key={i} style={{
            fontFamily: theme.headFont, fontWeight: theme.headWeight, fontSize: 118, lineHeight: 0.92,
            letterSpacing: theme.headTrack, textTransform: 'uppercase',
            color: w.accent ? theme.accent : theme.text, ...awRise(lt, 0.25 + i * 0.16, 0.5, 40),
          }}>{w.t}</div>
        ))}
        {showEn && (
          <div style={{ marginTop: 26, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600,
            fontSize: 24, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.sub,
            ...awRise(lt, 0.75, 0.5) }}>
            Drive in · Shine · Drive out
          </div>
        )}
      </div>
    </AWLayer>
  );
}

// ── SERVIZI + prezzo ──────────────────────────────────────────────────────
function ServiceRow({ Icon, theme, name, en, desc, lt, at, showEn }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, ...awRise(lt, at, 0.5, 26) }}>
      <div style={{ flexShrink: 0, width: 96, height: 96, borderRadius: 18,
        background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${theme.accent}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={72} color={theme.accent} stroke={2.6} />
      </div>
      <div>
        <div style={{ fontFamily: theme.headFont, fontWeight: 800, fontSize: 40, lineHeight: 1,
          letterSpacing: '-0.01em', textTransform: 'uppercase', color: theme.text, whiteSpace: 'nowrap' }}>
          {name}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap' }}>
          {showEn && <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700,
            fontSize: 16, letterSpacing: '0.14em', color: theme.accent }}>{en}</span>}
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400,
            fontSize: 21, color: theme.sub, lineHeight: 1.3 }}>{desc}</span>
        </div>
      </div>
    </div>
  );
}

function AWServizi({ theme, showEn }) {
  const time = useTime();
  const lt = time - AW_SERVIZI.start;
  const pulse = 1 + 0.025 * Math.sin(time * 3);
  return (
    <AWLayer start={AW_SERVIZI.start} end={AW_SERVIZI.end} z={10}>
      <AWEnergy theme={theme} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 80px' }}>
        {/* colonna servizi */}
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 30 }}>
          <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: 22,
            letterSpacing: '0.26em', textTransform: 'uppercase', color: theme.accent, ...awRise(lt, 0.05, 0.5) }}>
            I nostri servizi
          </div>
          <ServiceRow Icon={CarIcon} theme={theme} name="Dentro & Fuori" en="WASH & VAC"
            desc="Lavaggio completo, interni ed esterni" lt={lt} at={0.2} showEn={showEn} />
          <ServiceRow Icon={SprayIcon} theme={theme} name="Detailing" en="DETAILING"
            desc="Pulizia profonda e cura dei dettagli" lt={lt} at={0.36} showEn={showEn} />
          <ServiceRow Icon={ShineIcon} theme={theme} name="Lucidatura" en="POLISH"
            desc="La carrozzeria torna a brillare" lt={lt} at={0.52} showEn={showEn} />
        </div>
        {/* badge prezzo */}
        <div style={{ flexShrink: 0, width: 360, display: 'flex', justifyContent: 'center', ...awRise(lt, 0.4, 0.6, 30) }}>
          <div style={{ transform: `scale(${pulse})`, width: 320, padding: '46px 32px', borderRadius: 28,
            background: theme.accent, color: theme.accentInk, textAlign: 'center',
            boxShadow: `0 24px 60px ${theme.accent}33` }}>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: 20,
              letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.78 }}>A partire da</div>
            <div style={{ fontFamily: theme.headFont, fontWeight: 900, fontSize: 132, lineHeight: 0.9,
              letterSpacing: '-0.04em', marginTop: 6 }}>28€</div>
            <div style={{ marginTop: 14, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600,
              fontSize: 21, lineHeight: 1.3 }}>Lavaggio completo<br />e a mano</div>
          </div>
        </div>
      </div>
    </AWLayer>
  );
}

// ── OUTRO: orari + invito ───────────────────────────────────────────────
function AWOutro({ theme, brand, showEn }) {
  const time = useTime();
  const lt = time - AW_OUTRO.start;
  return (
    <AWLayer start={AW_OUTRO.start} end={AW_OUTRO.end} z={20}>
      <AWEnergy theme={theme} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...awRise(lt, 0.05, 0.5) }}>
          <Drop size={40} color={theme.accent} stroke={3} />
          <div style={{ fontFamily: theme.headFont, fontWeight: 900, fontSize: 104, lineHeight: 0.95,
            letterSpacing: '-0.02em', textTransform: 'uppercase', color: theme.text }}>Autolavaggio</div>
        </div>
        <div style={{ marginTop: 26, fontFamily: theme.headFont, fontWeight: 800, fontSize: 52,
          letterSpacing: '-0.01em', color: theme.accent, whiteSpace: 'nowrap', ...awRise(lt, 0.28, 0.5) }}>7:30 – 18:00</div>
        <div style={{ marginTop: 12, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 30,
          color: theme.text, letterSpacing: '0.02em', whiteSpace: 'nowrap', ...awRise(lt, 0.42, 0.5) }}>
          Lunedì – Sabato{showEn ? '  ·  Monday – Saturday' : ''}
        </div>
        <div style={{ marginTop: 44, ...awRise(lt, 0.6, 0.5) }}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap', fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700,
            fontSize: 24, letterSpacing: '0.04em', color: theme.accentInk, background: theme.accent,
            padding: '16px 34px', borderRadius: 999 }}>
            {showEn ? 'Chiedi alla cassa · Ask at the till' : 'Chiedi alla cassa'}
          </span>
        </div>
      </div>
    </AWLayer>
  );
}

Object.assign(window, {
  AW, AW_THEMES, AW_INTRO, AW_SERVIZI, AW_OUTRO, AW_DURATION,
  awRise, AWLayer, AWEnergy, AWIntro, AWServizi, AWOutro,
});
