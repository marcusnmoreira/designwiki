// Grid of courses with thumbnails

function Thumb({ palette, pattern, title }) {
  // SVG generative thumbnails per pattern
  const [c1, c2] = palette;
  const id = "g" + (title || "").replace(/\W/g, "");
  const common = (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={c1} />
        <stop offset="1" stopColor={c2} />
      </linearGradient>
      <linearGradient id={id + "soft"} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={c1} stopOpacity="0.15" />
        <stop offset="1" stopColor={c2} stopOpacity="0.15" />
      </linearGradient>
    </defs>
  );

  if (pattern === "rings") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {common}
        <rect width="400" height="300" fill={`url(#${id}soft)`} />
        {[...Array(8)].map((_, i) => (
          <circle key={i} cx="200" cy="150" r={20 + i * 22} fill="none" stroke={`url(#${id})`} strokeOpacity={0.6 - i * 0.06} strokeWidth={1.5} />
        ))}
        <circle cx="200" cy="150" r="12" fill={`url(#${id})`} />
      </svg>
    );
  }
  if (pattern === "grid") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {common}
        <rect width="400" height="300" fill={`url(#${id}soft)`} />
        {[...Array(8)].map((_, r) =>
          [...Array(11)].map((_, c) => (
            <rect key={`${r}-${c}`} x={c * 36 + 8} y={r * 36 + 8} width="28" height="28" rx="4"
              fill={`url(#${id})`} fillOpacity={0.1 + ((r + c) % 5) * 0.15} />
          ))
        )}
      </svg>
    );
  }
  if (pattern === "waves") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {common}
        <rect width="400" height="300" fill={`url(#${id}soft)`} />
        {[...Array(6)].map((_, i) => {
          const y = 60 + i * 35;
          const d = `M0,${y} C100,${y - 30} 200,${y + 30} 400,${y - 10}`;
          return <path key={i} d={d} fill="none" stroke={`url(#${id})`} strokeWidth="2" strokeOpacity={0.7 - i * 0.08} />;
        })}
      </svg>
    );
  }
  if (pattern === "nodes") {
    const nodes = [
      [80, 80], [200, 60], [320, 100], [120, 180], [240, 200], [340, 220], [60, 240]
    ];
    const edges = [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [2, 5], [4, 5], [3, 6]];
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {common}
        <rect width="400" height="300" fill={`url(#${id}soft)`} />
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={`url(#${id})`} strokeWidth="1.5" strokeOpacity="0.5" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 8 : 12} fill={`url(#${id})`} />
        ))}
      </svg>
    );
  }
  if (pattern === "atoms") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {common}
        <rect width="400" height="300" fill={`url(#${id}soft)`} />
        <ellipse cx="200" cy="150" rx="140" ry="50" fill="none" stroke={`url(#${id})`} strokeWidth="1.5" />
        <ellipse cx="200" cy="150" rx="140" ry="50" fill="none" stroke={`url(#${id})`} strokeWidth="1.5" transform="rotate(60 200 150)" />
        <ellipse cx="200" cy="150" rx="140" ry="50" fill="none" stroke={`url(#${id})`} strokeWidth="1.5" transform="rotate(120 200 150)" />
        <circle cx="200" cy="150" r="14" fill={`url(#${id})`} />
        <circle cx="60" cy="150" r="6" fill={c1} />
        <circle cx="340" cy="150" r="6" fill={c2} />
        <circle cx="270" cy="65" r="6" fill={c1} />
        <circle cx="130" cy="235" r="6" fill={c2} />
      </svg>
    );
  }
  if (pattern === "diamonds") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {common}
        <rect width="400" height="300" fill={`url(#${id}soft)`} />
        <path d="M40,150 L120,80 L200,150 L120,220 Z" fill="none" stroke={`url(#${id})`} strokeWidth="2" />
        <path d="M200,150 L280,80 L360,150 L280,220 Z" fill="none" stroke={`url(#${id})`} strokeWidth="2" />
        <path d="M70,150 L120,110 L170,150 L120,190 Z" fill={`url(#${id})`} fillOpacity="0.4" />
        <path d="M230,150 L280,110 L330,150 L280,190 Z" fill={`url(#${id})`} fillOpacity="0.6" />
      </svg>
    );
  }
  if (pattern === "stack") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        {common}
        <rect width="400" height="300" fill={`url(#${id}soft)`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={100 + i * 12} y={70 + i * 14} width="180" height="120" rx="8"
            fill="white" stroke={`url(#${id})`} strokeWidth="1.5"
            opacity={0.6 + i * 0.08} />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      {common}
      <rect width="400" height="300" fill={`url(#${id})`} />
    </svg>
  );
}

function Card({ item }) {
  const href = item.id === "metodologia-especificacao" ? "especificacao-requisitos.html" : null;
  const onClick = () => { if (href) window.location.href = href; };
  return (
    <article className="card" onClick={onClick} style={{ cursor: href ? "pointer" : "default" }}>
      <div className="card-thumb">
        <Thumb palette={item.palette} pattern={item.pattern} title={item.id} />
        <span className="card-cat">
          <span className="swatch" style={{ background: `linear-gradient(135deg, ${item.palette[0]}, ${item.palette[1]})` }} />
          {item.category}
        </span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-meta">
          <span>{item.sections} seções</span>
          <span className="sep" />
          <span className="updated">Atualizado {item.updated}</span>
        </div>
      </div>
    </article>
  );
}

function Library() {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState("Tudo");

  const counts = window.CATEGORIES.reduce((acc, c) => {
    acc[c] = c === "Tudo" ? window.WIKI_DATA.length : window.WIKI_DATA.filter((d) => d.category === c).length;
    return acc;
  }, {});

  const filtered = window.WIKI_DATA.filter((d) => {
    const matchesQ = d.title.toLowerCase().includes(query.toLowerCase().trim());
    const matchesC = cat === "Tudo" || d.category === cat;
    return matchesQ && matchesC;
  });

  return (
    <section className="library">
      <header className="library-head">
        <div>
          <h2>A biblioteca <em>completa</em>.</h2>
          <p>Conteúdos curados, organizados por tipo. Use a busca ou filtre por categoria para encontrar o que precisa.</p>
        </div>
      </header>

      <div className="search-row">
        <label className="search-input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Buscar técnica, metodologia, framework..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="filter-chips">
          {window.CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${cat === c ? "active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
              <span className="count">{counts[c]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>Nada por aqui.</h3>
            <p>Tente outro termo ou limpe o filtro.</p>
          </div>
        ) : (
          filtered.map((item) => <Card key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}

window.Library = Library;
