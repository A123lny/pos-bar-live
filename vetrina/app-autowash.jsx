/* app-autowash.jsx — Stage 1280×800 autolavaggio + Tweaks */

const AW_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tema": "Acqua",
  "brand": "Eni",
  "showEn": true
}/*EDITMODE-END*/;

function AutoWashVideo() {
  const [t, setTweak] = useTweaks(AW_DEFAULTS);
  const themeName = AW_THEMES[t.tema] ? t.tema : 'Acqua';
  const theme = AW_THEMES[themeName];

  return (
    <React.Fragment>
      <Stage width={AW.W} height={AW.H} duration={AW_DURATION} background="#04162a" persistKey="enibar-autowash">
        <AWIntro theme={theme} brand={t.brand} showEn={t.showEn} />
        <AWServizi theme={theme} showEn={t.showEn} />
        <AWOutro theme={theme} brand={t.brand} showEn={t.showEn} />
      </Stage>

      <TweaksPanel>
        <TweakSection label="Stile" />
        <TweakSelect label="Tema" value={t.tema}
          options={['Acqua', 'Notte Eni', 'Acciaio']}
          onChange={(v) => setTweak('tema', v)} />
        <TweakToggle label="Sottotitoli in inglese" value={t.showEn}
          onChange={(v) => setTweak('showEn', v)} />

        <TweakSection label="Testi" />
        <TweakText label="Nome stazione" value={t.brand} onChange={(v) => setTweak('brand', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AutoWashVideo />);
