/* scenes.jsx — temi, configurazione capitoli e componenti delle scene
   Esporta tutto su window per app.jsx. */

// ─────────────────────────────────────────────────────────────────────────
// TEMI — 3 direzioni visive distinte, selezionabili dai Tweaks
// ─────────────────────────────────────────────────────────────────────────
const THEMES = {
  'Caffè & Legno': {
    pageBg: '#1d140d',
    panelBg: '#1d140d',
    text: '#f6ece0',
    sub: 'rgba(246,236,224,0.62)',
    accent: '#dca06a',
    accentInk: '#1d140d',
    headFont: "'Bricolage Grotesque', sans-serif",
    headWeight: 700,
    headSize: 98,
    headTrack: '-0.02em',
    enMode: 'tracked',
    slotFg: 'rgba(246,236,224,0.6)',
    slotBg: 'rgba(255,255,255,0.05)',
    slotRing: 'rgba(246,236,224,0.28)',
    grain: true,
  },
  'Giallo & Nero': {
    pageBg: '#0c0c0c',
    panelBg: '#0c0c0c',
    text: '#ffffff',
    sub: 'rgba(255,255,255,0.56)',
    accent: '#ffd400',
    accentInk: '#0c0c0c',
    headFont: "'Archivo', sans-serif",
    headWeight: 800,
    headSize: 96,
    headTrack: '-0.03em',
    enMode: 'tracked',
    slotFg: 'rgba(255,255,255,0.55)',
    slotBg: 'rgba(255,255,255,0.05)',
    slotRing: 'rgba(255,255,255,0.22)',
    grain: false,
  },
  'Crema Minimal': {
    pageBg: '#f4ede0',
    panelBg: '#f4ede0',
    text: '#2b2620',
    sub: 'rgba(43,38,32,0.58)',
    accent: '#b8801f',
    accentInk: '#f4ede0',
    headFont: "'Instrument Serif', serif",
    headWeight: 400,
    headSize: 124,
    headTrack: '-0.01em',
    enMode: 'italic',
    slotFg: 'rgba(43,38,32,0.55)',
    slotBg: 'rgba(0,0,0,0.04)',
    slotRing: 'rgba(43,38,32,0.24)',
    grain: false,
  },
};

// ─────────────────────────────────────────────────────────────────────────
// CAPITOLI — i quattro momenti della giornata
// ─────────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  { id: 'colazione', num: '01', it: 'Colazione', en: 'Breakfast',
    desc: 'Caffè appena fatto, cornetti e dolci sfornati ogni mattina',
    tag: 'dalle 7:30', ph: 'Trascina qui una foto della colazione',
    start: 4.2, end: 11.2 },
  { id: 'pranzo', num: '02', it: 'Pranzo', en: 'Lunch',
    desc: 'Primi, panini e piatti freschi per la pausa di mezzogiorno',
    tag: '12:00 – 15:00', ph: 'Trascina qui una foto del pranzo',
    start: 10.6, end: 17.6 },
  { id: 'merenda', num: '03', it: 'Merenda', en: 'Afternoon',
    desc: 'Una pausa dolce nel pomeriggio, con un buon caffè',
    tag: 'dalle 16:00', ph: 'Trascina qui una foto della merenda',
    start: 17.0, end: 24.0 },
  { id: 'aperitivo', num: '04', it: 'Aperitivo', en: 'Aperitivo',
    desc: 'Drink, calici e stuzzichini per chiudere la giornata',
    tag: 'dalle 18:00', ph: 'Trascina qui una foto dell’aperitivo',
    start: 23.4, end: 30.4 },
];

const INTRO = { start: 0, end: 4.8 };
const OUTRO = { start: 29.8, end: 35.5 };
const DURATION = 35.5;

// ─────────────────────────────────────────────────────────────────────────
// Helpers di animazione
// ─────────────────────────────────────────────────────────────────────────
// Stagger "rise": opacità + slide-up di un elemento a partire da `at`
function rise(t, at, d = 0.6, dist = 26) {
  const p = clamp((t - at) / d, 0, 1);
  const e = Easing.easeOutCubic(p);
  return { opacity: e, transform: `translateY(${(1 - e) * dist}px)` };
}

// TimedLayer: sempre montato (per non perdere gli image-slot), opacità guidata dal tempo
function TimedLayer({ start, end, fadeIn = 0.6, fadeOut = 0.6, z = 1, children }) {
  const time = useTime();
  let raw = 0;
  if (time >= start - 0.001 && time <= end + 0.001) {
    const fi = clamp((time - start) / fadeIn, 0, 1);
    const fo = clamp((end - time) / fadeOut, 0, 1);
    raw = Math.min(fi, fo);
  }
  const opacity = Easing.easeInOutSine(raw);
  const active = raw > 0.55;
  return (
    <div style={{
      position: 'absolute', inset: 0, opacity, zIndex: z,
      pointerEvents: active ? 'auto' : 'none',
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Foto a tutta altezza sul lato destro, con leggero Ken Burns
// ─────────────────────────────────────────────────────────────────────────
function PhotoIcon({ color }) {
  return (
    <svg width="116" height="116" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M21 16l-5-5L5 20" />
    </svg>
  );
}

// Segnaposto grande e leggibile, visibile finché la foto non viene caricata.
// L'image-slot è un overlay trasparente sopra: cattura drop/click e, una volta
// riempito, l'immagine (object-fit cover) copre completamente il segnaposto.
function PhotoPlaceholder({ chapter, theme }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: theme.slotBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 40,
        border: `2px dashed ${theme.slotRing}`, borderRadius: 4,
      }}></div>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        color: theme.slotFg, textAlign: 'center', padding: 40,
      }}>
        <PhotoIcon color={theme.slotFg} />
        <div style={{
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 26,
          letterSpacing: '0.28em', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>La tua foto</div>
        <div style={{
          maxWidth: 460,
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, fontSize: 21,
          opacity: 0.85, lineHeight: 1.4,
        }}>{chapter.ph}</div>
      </div>
    </div>
  );
}

function PhotoPlate({ chapter, theme }) {
  const time = useTime();
  const p = clamp((time - chapter.start) / (chapter.end - chapter.start), 0, 1);
  const scale = 1.03 + 0.07 * Easing.easeInOutSine(p);
  return (
    <div style={{ position: 'absolute', right: 0, top: 0, width: 1100, height: 1080, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${scale})`, transformOrigin: '60% 50%',
      }}>
        <PhotoPlaceholder chapter={chapter} theme={theme} />
        <image-slot
          id={`photo-${chapter.id}`}
          fit="cover"
          shape="rect"
          placeholder={chapter.ph}
          style={{
            position: 'absolute', inset: 0,
            display: 'block', width: '100%', height: '100%',
            color: 'transparent',
            '--slot-bg': 'transparent',
            '--slot-ring': 'transparent',
          }}
        ></image-slot>
      </div>
      {/* sfumatura di raccordo con il pannello testo */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 240,
        background: `linear-gradient(90deg, ${theme.pageBg} 0%, ${theme.pageBg}00 100%)`,
        pointerEvents: 'none',
      }}></div>
    </div>
  );
}

// EN sub-label resa secondo il tema
function EnLabel({ text, theme, size = 30 }) {
  if (theme.enMode === 'italic') {
    return (
      <div style={{
        fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
        fontSize: size + 8, color: theme.accent, lineHeight: 1,
      }}>{text}</div>
    );
  }
  return (
    <div style={{
      fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600,
      fontSize: size, color: theme.accent, textTransform: 'uppercase',
      letterSpacing: '0.22em', lineHeight: 1,
    }}>{text}</div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Capitolo: pannello testo a sinistra + foto a destra (un solo crossfade)
// ─────────────────────────────────────────────────────────────────────────
function Chapter({ chapter, theme, showEn, z }) {
  const time = useTime();
  const lt = time - chapter.start; // tempo locale per lo stagger

  return (
    <TimedLayer start={chapter.start} end={chapter.end} z={z}>
      <PhotoPlate chapter={chapter} theme={theme} />

      {/* pannello testo */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: 860, height: 1080,
        padding: '90px 96px 120px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        {/* riga numero + linea accento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 30, ...rise(lt, 0.15, 0.5) }}>
          <div style={{ width: 56, height: 3, background: theme.accent, borderRadius: 2 }}></div>
          <div style={{
            fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 24,
            color: theme.sub, letterSpacing: '0.12em',
          }}>{chapter.num} / 04</div>
        </div>

        {/* parola IT */}
        <div style={{
          fontFamily: theme.headFont, fontWeight: theme.headWeight,
          fontSize: theme.headSize, color: theme.text, lineHeight: 0.94,
          letterSpacing: theme.headTrack, ...rise(lt, 0.28, 0.6),
        }}>{chapter.it}</div>

        {/* parola EN */}
        {showEn && (
          <div style={{ marginTop: 18, ...rise(lt, 0.42, 0.6) }}>
            <EnLabel text={chapter.en} theme={theme} />
          </div>
        )}

        {/* descrizione */}
        <div style={{
          marginTop: 30, maxWidth: 560,
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, fontSize: 30,
          color: theme.sub, lineHeight: 1.4, textWrap: 'pretty', ...rise(lt, 0.56, 0.6),
        }}>{chapter.desc}</div>

        {/* pill orario */}
        <div style={{ marginTop: 40, ...rise(lt, 0.72, 0.6) }}>
          <span style={{
            display: 'inline-block', whiteSpace: 'nowrap',
            fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 22,
            letterSpacing: '0.04em',
            color: theme.accentInk, background: theme.accent,
            padding: '12px 24px', borderRadius: 999,
          }}>{chapter.tag}</span>
        </div>
      </div>
    </TimedLayer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Marchio persistente in alto a sinistra durante i capitoli
// ─────────────────────────────────────────────────────────────────────────
function BrandMark({ theme, barName }) {
  return (
    <TimedLayer start={CHAPTERS[0].start - 0.4} end={OUTRO.start} z={30}>
      <div style={{
        position: 'absolute', left: 96, top: 78,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: theme.accent }}></div>
        <div style={{
          fontFamily: theme.headFont, fontWeight: theme.enMode === 'italic' ? 400 : 700,
          fontSize: 30, color: theme.text, letterSpacing: theme.headTrack, whiteSpace: 'nowrap',
        }}>{barName}</div>
      </div>
    </TimedLayer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Intro
// ─────────────────────────────────────────────────────────────────────────
function IntroScene({ theme, barName, slogan, showEn }) {
  const time = useTime();
  const lt = time - INTRO.start;
  const lineW = interpolate([0, 1], [0, 120], Easing.easeOutCubic)(clamp((lt - 0.2) / 0.8, 0, 1));
  return (
    <TimedLayer start={INTRO.start} end={INTRO.end} z={5}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 80,
      }}>
        <div style={{
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 26,
          letterSpacing: '0.34em', textTransform: 'uppercase', color: theme.accent,
          ...rise(lt, 0.1, 0.6),
        }}>{showEn ? 'Benvenuti · Welcome' : 'Benvenuti'}</div>

        <div style={{
          marginTop: 30,
          fontFamily: theme.headFont, fontWeight: theme.headWeight,
          fontSize: theme.enMode === 'italic' ? 168 : 150, color: theme.text,
          lineHeight: 0.96, letterSpacing: theme.headTrack, ...rise(lt, 0.26, 0.7),
        }}>{barName}</div>

        <div style={{ height: 3, background: theme.accent, width: lineW, margin: '38px 0', borderRadius: 2 }}></div>

        <div style={{
          maxWidth: 1000,
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, fontSize: 34,
          color: theme.sub, lineHeight: 1.4, textWrap: 'pretty', ...rise(lt, 0.6, 0.7),
        }}>{slogan}</div>
      </div>
    </TimedLayer>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Outro — orari + invito
// ─────────────────────────────────────────────────────────────────────────
function OutroScene({ theme, barName, showEn }) {
  const time = useTime();
  const lt = time - OUTRO.start;
  return (
    <TimedLayer start={OUTRO.start} end={OUTRO.end} z={20}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 80,
      }}>
        <div style={{
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 25,
          letterSpacing: '0.28em', textTransform: 'uppercase', color: theme.accent,
          whiteSpace: 'nowrap', ...rise(lt, 0.1, 0.6),
        }}>{showEn ? 'Ti aspettiamo · See you soon' : 'Ti aspettiamo'}</div>

        <div style={{
          marginTop: 26,
          fontFamily: theme.headFont, fontWeight: theme.headWeight,
          fontSize: theme.enMode === 'italic' ? 156 : 140, color: theme.text,
          lineHeight: 0.94, letterSpacing: theme.headTrack, whiteSpace: 'nowrap', ...rise(lt, 0.26, 0.7),
        }}>7:30 – 20:00</div>

        <div style={{
          marginTop: 28,
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 38,
          color: theme.text, letterSpacing: '0.02em', ...rise(lt, 0.46, 0.7),
          whiteSpace: 'nowrap',
        }}>
          Lunedì – Sabato{showEn ? '  ·  Monday – Saturday' : ''}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 56, ...rise(lt, 0.66, 0.7) }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: theme.accent }}></div>
          <div style={{
            fontFamily: theme.headFont, fontWeight: theme.enMode === 'italic' ? 400 : 700,
            fontSize: 34, color: theme.sub, letterSpacing: theme.headTrack, whiteSpace: 'nowrap',
          }}>{barName}</div>
        </div>
      </div>
    </TimedLayer>
  );
}

// Base / sfondo a tutta scena
function Backdrop({ theme }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: theme.pageBg, zIndex: 0 }}>
      {theme.grain && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(220,160,106,0.10), transparent 55%)',
        }}></div>
      )}
    </div>
  );
}

Object.assign(window, {
  THEMES, CHAPTERS, INTRO, OUTRO, DURATION,
  rise, TimedLayer, PhotoPlate, EnLabel, Chapter, BrandMark,
  IntroScene, OutroScene, Backdrop,
});
