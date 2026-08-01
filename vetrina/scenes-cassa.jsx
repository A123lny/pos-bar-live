/* scenes-cassa.jsx — impaginazione full-bleed per schermo 10.1" (1280×800)
   Riusa THEMES, CHAPTERS, INTRO, OUTRO, DURATION, rise, TimedLayer, EnLabel (da scenes.jsx)
   e i motivi di breakfast-art.jsx. Esporta CassaApp parts su window. */

const CW = 1280, CH = 800;

// Tinta scura per il riquadro foto vuoto, coerente per ogni tema (così il
// testo bianco in overlay resta sempre leggibile, anche nel tema chiaro).
const PLATE_BG = {
  'Caffè & Legno': '#241811',
  'Giallo & Nero': '#0c0c0c',
  'Crema Minimal': '#2a2018',
};

const FEATURE_KIND = {
  colazione: 'croissant', pranzo: 'cup', merenda: 'cup', aperitivo: 'cup',
};

// Foto "di fabbrica" già incorporate nel video (un drop dell'utente le sostituisce).
const PHOTO_SRC = {
  colazione: 'assets/colazione.jpg',
  pranzo: 'assets/pranzo.jpg',
  merenda: 'assets/merenda.jpg',
  aperitivo: 'assets/aperitivo.jpg',
};

function plateBg(themeName) { return PLATE_BG[themeName] || '#241811'; }

// Foto a tutto schermo (Ken Burns) con segnaposto illustrato sotto l'image-slot
function CassaPhoto({ chapter, themeName, theme }) {
  const time = useTime();
  const p = clamp((time - chapter.start) / (chapter.end - chapter.start), 0, 1);
  const scale = 1.04 + 0.08 * Easing.easeInOutSine(p);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '55% 45%' }}>
        {/* segnaposto illustrato (coperto dalla foto quando caricata) */}
        <div style={{
          position: 'absolute', inset: 0, background: plateBg(themeName),
          pointerEvents: 'none',
        }}>
          {/* illustrazione protagonista, centrata in alto per non coprire il testo */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 150,
            display: 'flex', justifyContent: 'center', opacity: 0.92,
          }}>
            <FeatureArt color={theme.accent} kind={FEATURE_KIND[chapter.id]} size={172} />
          </div>
          {/* hint discreto in alto a destra */}
          <div style={{
            position: 'absolute', top: 60, right: 70,
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 16,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)',
          }}>
            <span style={{ fontSize: 18 }}>⤓</span> Trascina una foto
          </div>
        </div>
        <image-slot
          id={`cassa-photo-${chapter.id}`}
          src={PHOTO_SRC[chapter.id] || undefined}
          fit="cover" shape="rect" placeholder={chapter.ph}
          style={{
            position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%',
            color: 'transparent', '--slot-bg': 'transparent', '--slot-ring': 'transparent',
          }}
        ></image-slot>
      </div>
      {/* scrim per leggibilità del testo */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.78) 100%)',
      }}></div>
    </div>
  );
}

function CassaChapter({ chapter, theme, themeName, showEn, z }) {
  const time = useTime();
  const lt = time - chapter.start;
  const itSize = theme.enMode === 'italic' ? 118 : 96;
  return (
    <TimedLayer start={chapter.start} end={chapter.end} z={z}>
      <CassaPhoto chapter={chapter} theme={theme} themeName={themeName} />
      <BreakfastMotifs color="#ffffff" intensity={0.7} />

      {/* testo in overlay, in basso a sinistra */}
      <div style={{
        position: 'absolute', left: 70, right: 70, bottom: 64,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, ...rise(lt, 0.15, 0.5) }}>
          <div style={{ width: 46, height: 3, background: theme.accent, borderRadius: 2 }}></div>
          <div style={{
            fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 19,
            color: 'rgba(255,255,255,0.78)', letterSpacing: '0.12em',
          }}>{chapter.num} / 04</div>
        </div>

        <div style={{
          fontFamily: theme.headFont, fontWeight: theme.headWeight, fontSize: itSize,
          color: '#fff', lineHeight: 0.92, letterSpacing: theme.headTrack, whiteSpace: 'nowrap',
          ...rise(lt, 0.28, 0.6),
        }}>{chapter.it}</div>

        {showEn && (
          <div style={{ marginTop: 10, ...rise(lt, 0.42, 0.6) }}>
            <EnLabel text={chapter.en} theme={theme} size={24} />
          </div>
        )}

        <div style={{
          marginTop: 18, maxWidth: 980,
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, fontSize: 24,
          color: 'rgba(255,255,255,0.86)', lineHeight: 1.36, textWrap: 'pretty',
          ...rise(lt, 0.56, 0.6),
        }}>{chapter.desc}</div>

        <div style={{ marginTop: 24, ...rise(lt, 0.72, 0.6) }}>
          <span style={{
            display: 'inline-block', whiteSpace: 'nowrap',
            fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 19,
            letterSpacing: '0.04em', color: theme.accentInk, background: theme.accent,
            padding: '10px 20px', borderRadius: 999,
          }}>{chapter.tag}</span>
        </div>
      </div>
    </TimedLayer>
  );
}

function CassaBrand({ theme, barName }) {
  return (
    <TimedLayer start={CHAPTERS[0].start - 0.4} end={OUTRO.start} z={30}>
      <div style={{ position: 'absolute', left: 70, top: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 11, height: 11, borderRadius: 3, background: theme.accent }}></div>
        <div style={{
          fontFamily: theme.headFont, fontWeight: theme.enMode === 'italic' ? 400 : 700,
          fontSize: 26, color: '#fff', letterSpacing: theme.headTrack, whiteSpace: 'nowrap',
          textShadow: '0 1px 14px rgba(0,0,0,0.5)',
        }}>{barName}</div>
      </div>
    </TimedLayer>
  );
}

function CassaIntro({ theme, themeName, barName, slogan, showEn }) {
  const time = useTime();
  const lt = time - INTRO.start;
  const lineW = interpolate([0, 1], [0, 92], Easing.easeOutCubic)(clamp((lt - 0.2) / 0.8, 0, 1));
  return (
    <TimedLayer start={INTRO.start} end={INTRO.end} z={5}>
      <div style={{ position: 'absolute', inset: 0, background: theme.pageBg }}>
        <BreakfastMotifs color={theme.accent} intensity={1} />
      </div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 60,
      }}>
        <div style={{ marginBottom: 22, ...rise(lt, 0.05, 0.6) }}>
          <FeatureArt color={theme.accent} kind="cup" size={130} />
        </div>
        <div style={{
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 21,
          letterSpacing: '0.32em', textTransform: 'uppercase', color: theme.accent,
          whiteSpace: 'nowrap', ...rise(lt, 0.18, 0.6),
        }}>{showEn ? 'Benvenuti · Welcome' : 'Benvenuti'}</div>
        <div style={{
          marginTop: 18, fontFamily: theme.headFont, fontWeight: theme.headWeight,
          fontSize: theme.enMode === 'italic' ? 132 : 116, color: theme.text,
          lineHeight: 0.95, letterSpacing: theme.headTrack, whiteSpace: 'nowrap', ...rise(lt, 0.32, 0.7),
        }}>{barName}</div>
        <div style={{ height: 3, background: theme.accent, width: lineW, margin: '26px 0', borderRadius: 2 }}></div>
        <div style={{
          maxWidth: 820, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 400, fontSize: 27,
          color: theme.sub, lineHeight: 1.4, textWrap: 'pretty', ...rise(lt, 0.62, 0.7),
        }}>{slogan}</div>
      </div>
    </TimedLayer>
  );
}

function CassaOutro({ theme, barName, showEn }) {
  const time = useTime();
  const lt = time - OUTRO.start;
  return (
    <TimedLayer start={OUTRO.start} end={OUTRO.end} z={20}>
      <div style={{ position: 'absolute', inset: 0, background: theme.pageBg }}>
        <BreakfastMotifs color={theme.accent} intensity={0.85} />
      </div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 60,
      }}>
        <div style={{
          fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, fontSize: 21,
          letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.accent,
          whiteSpace: 'nowrap', ...rise(lt, 0.1, 0.6),
        }}>{showEn ? 'Ti aspettiamo · See you soon' : 'Ti aspettiamo'}</div>
        <div style={{
          marginTop: 18, fontFamily: theme.headFont, fontWeight: theme.headWeight,
          fontSize: theme.enMode === 'italic' ? 150 : 128, color: theme.text,
          lineHeight: 0.94, letterSpacing: theme.headTrack, whiteSpace: 'nowrap', ...rise(lt, 0.26, 0.7),
        }}>7:30 – 20:00</div>
        <div style={{
          marginTop: 18, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500, fontSize: 30,
          color: theme.text, letterSpacing: '0.02em', whiteSpace: 'nowrap', ...rise(lt, 0.46, 0.7),
        }}>Lunedì – Sabato{showEn ? '  ·  Monday – Saturday' : ''}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 44, ...rise(lt, 0.66, 0.7) }}>
          <div style={{ width: 9, height: 9, borderRadius: 3, background: theme.accent }}></div>
          <div style={{
            fontFamily: theme.headFont, fontWeight: theme.enMode === 'italic' ? 400 : 700,
            fontSize: 28, color: theme.sub, letterSpacing: theme.headTrack, whiteSpace: 'nowrap',
          }}>{barName}</div>
        </div>
      </div>
    </TimedLayer>
  );
}

Object.assign(window, {
  CW, CH, CassaPhoto, CassaChapter, CassaBrand, CassaIntro, CassaOutro,
});
