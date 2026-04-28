// Hero with interactive particle sphere
const { useEffect, useRef, useState } = React;

function ParticleSphere({ accentColors }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rotRef = useRef({ x: 0.3, y: 0, vx: 0, vy: 0.003 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W, H, cx, cy, R;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;H = rect.height;
      canvas.width = W * dpr;canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;cy = H / 2;
      R = Math.min(W, H) * 0.36;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Generate points on a sphere using Fibonacci lattice
    const N = 900;
    const points = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - i / (N - 1) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      points.push({
        x: Math.cos(theta) * r,
        y: y,
        z: Math.sin(theta) * r
      });
    }

    // Mouse handling
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.x = mx;
      mouseRef.current.y = my;
      mouseRef.current.active = true;
    };
    const onLeave = () => {mouseRef.current.active = false;};
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchmove", (e) => {
      if (e.touches[0]) {
        onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    }, { passive: true });

    // Parse accent colors → rgb
    function hexToRgb(hex) {
      const h = hex.replace("#", "");
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16)
      };
    }
    let c1, c2;
    function refreshColors() {
      c1 = hexToRgb(accentColors[0]);
      c2 = hexToRgb(accentColors[1]);
    }
    refreshColors();

    let raf;
    function frame(t) {
      // Rotation: idle drift + ease toward mouse
      const rot = rotRef.current;
      const m = mouseRef.current;
      if (m.active) {
        rot.vy += (m.x * 0.004 - rot.vy) * 0.05;
        rot.vx += (m.y * 0.003 - rot.vx) * 0.05;
      } else {
        rot.vy += (0.003 - rot.vy) * 0.02;
        rot.vx += (0 - rot.vx) * 0.02;
      }
      rot.y += rot.vy;
      rot.x += rot.vx;

      const sx = Math.sin(rot.x),cosx = Math.cos(rot.x);
      const sy = Math.sin(rot.y),cosy = Math.cos(rot.y);

      ctx.clearRect(0, 0, W, H);

      // (background glow removed — keep canvas seamless with hero bg)

      // Project + sort
      const projected = points.map((p) => {
        // rotate around X
        let y = p.y * cosx - p.z * sx;
        let z = p.y * sx + p.z * cosx;
        // rotate around Y
        let x = p.x * cosy + z * sy;
        z = -p.x * sy + z * cosy;
        const persp = 1.4 / (1.4 - z);
        return {
          sx: cx + x * R * persp,
          sy: cy + y * R * persp,
          z,
          persp
        };
      });
      projected.sort((a, b) => a.z - b.z);

      // Connection lines between nearby points (front-facing only, sparse)
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i += 4) {
        const a = projected[i];
        if (a.z < 0) continue;
        for (let j = i + 1; j < Math.min(i + 14, projected.length); j++) {
          const b = projected[j];
          if (b.z < 0) continue;
          const dx = a.sx - b.sx,dy = a.sy - b.sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < 900) {
            const op = (1 - d2 / 900) * 0.15 * a.z;
            ctx.strokeStyle = `rgba(${c1.r},${c1.g},${c1.b},${op})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // Draw points
      for (const p of projected) {
        const t = (p.z + 1) / 2; // 0 (back) → 1 (front)
        const r = Math.max(0.4, 1.4 * p.persp * (0.4 + t * 0.8));
        // Color blend along z
        const rr = c1.r + (c2.r - c1.r) * t;
        const gg = c1.g + (c2.g - c1.g) * t;
        const bb = c1.b + (c2.b - c1.b) * t;
        const alpha = 0.25 + t * 0.75;
        ctx.fillStyle = `rgba(${rr | 0},${gg | 0},${bb | 0},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [accentColors[0], accentColors[1]]);

  return <canvas ref={canvasRef} style={{ width: "450px", height: "450px" }} />;
}

// Wireframe grid mesh (alt 3D option)
function GridMesh({ accentColors }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, raf;
    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width;H = r.height;
      canvas.width = W * dpr;canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);ro.observe(canvas);
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - r.left) / r.width - 0.5;
      mouseRef.current.y = (e.clientY - r.top) / r.height - 0.5;
    };
    canvas.addEventListener("mousemove", onMove);

    const cols = 28,rows = 28;
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      const m = mouseRef.current;
      const time = t / 1000;
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, accentColors[0]);
      grad.addColorStop(1, accentColors[1]);

      const cellW = W / cols;
      const cellH = H / rows;
      ctx.lineWidth = 1;

      const points = [];
      for (let r = 0; r <= rows; r++) {
        const row = [];
        for (let c = 0; c <= cols; c++) {
          const x = c * cellW;
          const y = r * cellH;
          // distortion: sine waves + mouse pull
          const cx = W * (0.5 + m.x);
          const cy = H * (0.5 + m.y);
          const dx = x - cx,dy = y - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          const wave = Math.sin(d * 0.02 - time * 1.5) * 18 * Math.exp(-d / 280);
          const sx = Math.sin(x * 0.02 + time) * 4;
          const sy = Math.cos(y * 0.02 + time * 0.8) * 4;
          row.push({ x: x + sx + dx / (d + 1) * wave, y: y + sy + dy / (d + 1) * wave });
        }
        points.push(row);
      }
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.55;
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const p = points[r][c];
          if (c === 0) ctx.moveTo(p.x, p.y);else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const p = points[r][c];
          if (r === 0) ctx.moveTo(p.x, p.y);else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => {cancelAnimationFrame(raf);ro.disconnect();canvas.removeEventListener("mousemove", onMove);};
  }, [accentColors[0], accentColors[1]]);
  return <canvas ref={canvasRef} />;
}

// Floating cards parallax (alt 3D option)
function FloatingCards({ accentColors }) {
  const wrapRef = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = wrapRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
    };
    const onLeave = () => setT({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {el.removeEventListener("mousemove", onMove);el.removeEventListener("mouseleave", onLeave);};
  }, []);
  const cards = [
  { z: -120, scale: 0.7, rot: -12, label: "Atomic Design", tag: "Framework" },
  { z: -40, scale: 0.85, rot: 6, label: "Design Sprint", tag: "Framework" },
  { z: 60, scale: 1, rot: -3, label: "Especificação", tag: "Metodologia" },
  { z: 140, scale: 0.78, rot: 14, label: "Fluxograma", tag: "Técnica" }];

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%", perspective: 1200 }}>
      {cards.map((c, i) => {
        const offX = (i - 1.5) * 80 + t.x * (40 + Math.abs(c.z) * 0.3);
        const offY = (i % 2 === 0 ? -1 : 1) * 30 + t.y * (30 + Math.abs(c.z) * 0.2);
        return (
          <div key={i} style={{
            position: "absolute",
            left: "50%", top: "50%",
            width: 220, height: 280,
            transform: `translate(-50%, -50%) translate3d(${offX}px, ${offY}px, ${c.z}px) rotateZ(${c.rot + t.x * 4}deg) scale(${c.scale})`,
            transformStyle: "preserve-3d",
            transition: "transform 200ms cubic-bezier(.2,.6,.2,1)",
            background: `linear-gradient(135deg, ${accentColors[0]}18, ${accentColors[1]}18)`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: `1px solid ${accentColors[0]}33`,
            borderRadius: 18,
            boxShadow: "none",
            padding: 20,
            display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accentColors[0] }}>
              {c.tag}
            </div>
            <div>
              <div style={{ width: "100%", height: 80, borderRadius: 12, background: `linear-gradient(135deg, ${accentColors[0]}, ${accentColors[1]})`, marginBottom: 16 }} />
              <div style={{ fontFamily: "Instrument Serif, serif", fontSize: 24, lineHeight: 1.1 }}>{c.label}</div>
            </div>
          </div>);

      })}
    </div>);

}

window.ParticleSphere = ParticleSphere;
window.GridMesh = GridMesh;
window.FloatingCards = FloatingCards;