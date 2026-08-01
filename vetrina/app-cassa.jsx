/* app-cassa.jsx — Stage 1280×800 per schermo 10.1" + Tweaks */

const CASSA_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tema": "Caffè & Legno",
  "barName": "Bar Eni",
  "slogan": "La tua pausa, dal mattino all’aperitivo",
  "showEn": true
}/*EDITMODE-END*/;

function CassaVideo() {
  const [t, setTweak] = useTweaks(CASSA_DEFAULTS);
  const themeName = THEMES[t.tema] ? t.tema : 'Caffè & Legno';
  const theme = THEMES[themeName];

  return (
    <React.Fragment>
      <Stage
        width={CW}
        height={CH}
        duration={DURATION}
        background={theme.pageBg}
        persistKey="enibar-cassa"
      >
        <div style={{ position: 'absolute', inset: 0, background: theme.pageBg, zIndex: 0 }}></div>

        <CassaIntro theme={theme} themeName={themeName} barName={t.barName} slogan={t.slogan} showEn={t.showEn} />

        {CHAPTERS.map((ch, i) => (
          <CassaChapter key={ch.id} chapter={ch} theme={theme} themeName={themeName} showEn={t.showEn} z={10 + i} />
        ))}

        <CassaOutro theme={theme} barName={t.barName} showEn={t.showEn} />

        <CassaBrand theme={theme} barName={t.barName} />
      </Stage>

      <TweaksPanel>
        <TweakSection label="Stile" />
        <TweakSelect
          label="Tema"
          value={t.tema}
          options={['Caffè & Legno', 'Giallo & Nero', 'Crema Minimal']}
          onChange={(v) => setTweak('tema', v)}
        />
        <TweakToggle
          label="Sottotitoli in inglese"
          value={t.showEn}
          onChange={(v) => setTweak('showEn', v)}
        />

        <TweakSection label="Testi" />
        <TweakText label="Nome del bar" value={t.barName} onChange={(v) => setTweak('barName', v)} />
        <TweakText label="Slogan (intro)" value={t.slogan} onChange={(v) => setTweak('slogan', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CassaVideo />);
