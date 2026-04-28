// Spec page renderer + app
const { useState: useSt, useEffect: useEf, useRef: useRf } = React;

function Block({ block }) {
  const t = block.type;
  if (t === "p") {
    if (block.html) return <p dangerouslySetInnerHTML={{ __html: block.html }} />;
    return <p>{block.text}</p>;
  }
  if (t === "h2") return <h2>{block.text}</h2>;
  if (t === "h3") return <h3>{block.text}</h3>;
  if (t === "list") {
    return (
      <ul className="spec-list">
        {block.items.map((it, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
        ))}
      </ul>
    );
  }
  if (t === "callout") {
    return (
      <div className="spec-callout">
        {block.icon && <span className="spec-callout-icon">{block.icon}</span>}
        <div className="spec-callout-text" dangerouslySetInnerHTML={{ __html: block.text }} />
      </div>
    );
  }
  if (t === "quote") return <blockquote className="spec-quote">{block.text}</blockquote>;
  if (t === "two-col") {
    return (
      <div className="spec-twocol">
        {[block.left, block.right].map((c, i) => (
          <div key={i} className="spec-twocol-card">
            <span className="spec-twocol-kicker">{c.kicker}</span>
            <h4 className="spec-twocol-title">{c.title}</h4>
            <p className="spec-twocol-body">{c.body}</p>
          </div>
        ))}
      </div>
    );
  }
  if (t === "table") {
    return (
      <div className="spec-table-wrap">
        <table className="spec-table">
          <thead>
            <tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (t === "stage") {
    return (
      <div className="spec-stage">
        <div className="spec-stage-letter">{block.letter}</div>
        <div className="spec-stage-text">
          <h3 className="spec-stage-name">{block.name}</h3>
          <p className="spec-stage-desc">{block.desc}</p>
        </div>
      </div>
    );
  }
  if (t === "diagram" && block.id === "cerve") {
    const steps = [
      { l: "C", n: "Contextualizar" },
      { l: "E", n: "Elicitar" },
      { l: "R", n: "Refinar" },
      { l: "V", n: "Validar" },
      { l: "E", n: "Especificar" },
    ];
    return (
      <div className="cerve-diagram">
        {steps.map((s, i) => (
          <div key={i} className="cerve-step">
            <div className="cerve-step-letter">{s.l}</div>
            <div className="cerve-step-name">{s.n}</div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function SpecApp() {
  const chapters = window.ALL_SPEC_CHAPTERS;
  const [idx, setIdx] = useSt(0);
  const contentRef = useRf(null);

  // Sync from URL hash
  useEf(() => {
    const sync = () => {
      const h = location.hash.replace("#", "");
      const i = chapters.findIndex((c) => c.id === h);
      if (i >= 0) setIdx(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEf(() => {
    if (contentRef.current) contentRef.current.scrollTo?.(0, 0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [idx]);

  const goTo = (i) => {
    setIdx(i);
    history.replaceState(null, "", "#" + chapters[i].id);
  };

  const ch = chapters[idx];
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <div className="spec-app">
      <div className="spec-topbar">
        <a href="index.html" className="spec-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
          </svg>
          Biblioteca
        </a>
        <a href="index.html" style={{ display: "flex", alignItems: "center" }}>
          <img src="assets/logo.png" alt="DesignWiki" />
        </a>
      </div>

      <div className="spec-layout">
        <aside className="spec-sidebar">
          <p className="spec-side-label">Especificação de Requisitos</p>
          <ul className="spec-side-list">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <button
                  className={`spec-side-item ${i === idx ? "active" : ""}`}
                  onClick={() => goTo(i)}
                >
                  <span className="spec-side-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{c.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="spec-content" ref={contentRef}>
          <article className="spec-content-inner">
            <div className="spec-eyebrow">{ch.eyebrow}</div>
            <h1 className="spec-title">{ch.title}</h1>
            <div className="spec-divider" />
            {ch.blocks.map((b, i) => <Block key={i} block={b} />)}

            <nav className="spec-footer-nav">
              <button
                className={`spec-foot-btn ${prev ? "" : "invisible"}`}
                onClick={() => prev && goTo(idx - 1)}
                disabled={!prev}
              >
                <span className="spec-foot-kicker">← Capítulo anterior</span>
                <span className="spec-foot-title">{prev?.title || ""}</span>
              </button>
              <button
                className={`spec-foot-btn next ${next ? "" : "invisible"}`}
                onClick={() => next && goTo(idx + 1)}
                disabled={!next}
              >
                <span className="spec-foot-kicker">Próximo capítulo →</span>
                <span className="spec-foot-title">{next?.title || ""}</span>
              </button>
            </nav>
          </article>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SpecApp />);
