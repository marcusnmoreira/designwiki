// Marquee of design words
const { useEffect: useEff_M } = React;

function Marquee({ speed }) {
  // speed: seconds for one full loop (lower = faster)
  const words = ["TÉCNICAS", "METODOLOGIAS", "FRAMEWORKS"];
  // Repeat enough to fill, x2 for seamless loop
  const seq = [...words, ...words, ...words, ...words];
  return (
    <section className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[...seq, ...seq].map((w, i) => {
          const filled = i % 3 === 1;
          return (
            <span key={i} className={`marquee-word ${filled ? "filled" : ""}`}>
              {w}
              <span className="marquee-dot" aria-hidden="true" />
            </span>
          );
        })}
      </div>
    </section>
  );
}

window.Marquee = Marquee;
