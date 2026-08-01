/* app.jsx — composizione dello Stage + pannello Tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tema": "Caffè & Legno",
  "barName": "Bar Eni",
  "slogan": "La tua pausa, dal mattino all’aperitivo",
  "showEn": true
}/*EDITMODE-END*/;

function VideoBar() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = THEMES[t.tema] || THEMES['Caffè & Legno'];

  return (
    <React.Fragment>
      <Stage
        width={1920}
        height={1080}
        duration={DURATION}
        background={theme.pageBg}
        persistKey="enibar-video"
      >
        <Backdrop theme={theme} />

        <IntroScene theme={theme} barName={t.barName} slogan={t.slogan} showEn={t.showEn} />

        {CHAPTERS.map((ch, i) => (
          <Chapter key={ch.id} chapter={ch} theme={theme} showEn={t.showEn} z={10 + i} />
        ))}

        <OutroScene theme={theme} barName={t.barName} showEn={t.showEn} />

        <BrandMark theme={theme} barName={t.barName} />
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
        <TweakText
          label="Nome del bar"
          value={t.barName}
          onChange={(v) => setTweak('barName', v)}
        />
        <TweakText
          label="Slogan (intro)"
          value={t.slogan}
          onChange={(v) => setTweak('slogan', v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<VideoBar />);
