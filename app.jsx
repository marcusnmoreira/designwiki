// DesignWiki — main app
const { useState: useS, useEffect: useE } = React;

const ACCENT_PRESETS = {
  stripe: { name: "Stripe", colors: ["#635BFF", "#00D4FF"] },
  sunset: { name: "Sunset", colors: ["#FF6B6B", "#C84BFF"] },
  cyan: { name: "Cyan", colors: ["#0EA5E9", "#10B981"] },
  amber: { name: "Amber", colors: ["#F59E0B", "#EF4444"] }
};

const HERO_3D_OPTIONS = [
{ id: "sphere", label: "Esfera de partículas" },
{ id: "mesh", label: "Grid distorcido" },
{ id: "cards", label: "Cards flutuantes" }];


const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "stripe",
  "hero3d": "sphere",
  "marqueeSpeed": 40
} /*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = ACCENT_PRESETS[tweaks.accent] || ACCENT_PRESETS.stripe;

  // Apply accent CSS vars globally
  useE(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-1", accent.colors[0]);
    root.style.setProperty("--accent-2", accent.colors[1]);
    root.style.setProperty(
      "--accent-grad",
      `linear-gradient(135deg, ${accent.colors[0]} 0%, ${accent.colors[1]} 100%)`
    );
  }, [tweaks.accent]);

  const Hero3D =
  tweaks.hero3d === "mesh" ? window.GridMesh :
  tweaks.hero3d === "cards" ? window.FloatingCards :
  window.ParticleSphere;

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid-bg" />
        <div className="hero-logo">
          <img src="assets/logo.png" alt="DesignWiki" />
        </div>
        <div className="hero-inner">
          <div>
            <span className="hero-eyebrow">
              <span className="dot">★</span>
              Trilha de Capacitação Design
            </span>
            <h1>
              Os principais <em>frameworks</em> de design utilizados na Mirai.
            </h1>
            <p className="lede">Técnicas, metodologias e frameworks selecionados a dedo para designers e analistas de negócios.


            </p>
            <div className="hero-actions">
              <a className="btn-primary" href="#library">
                Explorar a biblioteca
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          <div className="hero-canvas-wrap">
            <Hero3D accentColors={accent.colors} />
          </div>
        </div>
      </section>

      <window.Marquee speed={tweaks.marqueeSpeed} />

      <div id="library">
        <window.Library />
      </div>

      <footer className="foot">
        DesignWiki · Curadoria contínua, comunidade aberta · © 2026
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Cor de destaque">
          <TweakRadio
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={Object.entries(ACCENT_PRESETS).map(([id, p]) => ({
              value: id,
              label: p.name
            }))} />
          
        </TweakSection>
        <TweakSection title="Elemento 3D na hero">
          <TweakRadio
            value={tweaks.hero3d}
            onChange={(v) => setTweak("hero3d", v)}
            options={HERO_3D_OPTIONS.map((o) => ({ value: o.id, label: o.label }))} />
          
        </TweakSection>
        <TweakSection title="Velocidade da faixa" subtitle={`${tweaks.marqueeSpeed}s por loop`}>
          <TweakSlider
            value={tweaks.marqueeSpeed}
            onChange={(v) => setTweak("marqueeSpeed", v)}
            min={10} max={90} step={5} />
          
        </TweakSection>
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
