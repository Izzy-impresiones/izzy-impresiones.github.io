/* ===== Vista previa de color =====
   Detecta el cuerpo del producto en la foto y lo pinta del color elegido,
   manteniendo las sombras y los detalles (ojos, cachetes, etc.).
   Funciona con fotos de fondo liso y claro. Si la foto no cumple eso,
   devuelve null y la página muestra la foto original. */
(function () {
  const MAX = 900;              // tamaño máximo de trabajo (px)
  const cache = new Map();      // src -> análisis

  /* --- color: sRGB <-> Lab --- */
  const lin = c => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const unlin = c => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const fi = t => t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;
  function rgb2lab(r, g, b) {
    r = lin(r); g = lin(g); b = lin(b);
    const x = f((r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047);
    const y = f(r * 0.2126 + g * 0.7152 + b * 0.0722);
    const z = f((r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }
  function lab2rgb(L, a, b) {
    const y = (L + 16) / 116, x = a / 500 + y, z = y - b / 200;
    const X = fi(x) * 0.95047, Y = fi(y), Z = fi(z) * 1.08883;
    const cl = v => Math.max(0, Math.min(255, Math.round(unlin(v))));
    return [cl(X * 3.2406 - Y * 1.5372 - Z * 0.4986), cl(-X * 0.9689 + Y * 1.8758 + Z * 0.0415), cl(X * 0.0557 - Y * 0.204 + Z * 1.057)];
  }
  const hex2lab = h => rgb2lab(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16));

  function cargar(src) {
    return new Promise((ok, mal) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = mal;
      im.src = src;
    });
  }

  /* --- 1. fondo: relleno desde los bordes --- */
  function fondo(lab, w, h) {
    const n = w * h, bg = new Uint8Array(n);
    // color medio del borde
    let sL = 0, sa = 0, sb = 0, k = 0;
    const borde = [];
    for (let x = 0; x < w; x++) borde.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) borde.push(y * w, y * w + w - 1);
    for (const i of borde) { sL += lab[i * 3]; sa += lab[i * 3 + 1]; sb += lab[i * 3 + 2]; k++; }
    const ref = [sL / k, sa / k, sb / k];
    if (ref[0] < 55) return null; // fondo oscuro: no aplica
    const lejos = i => {
      const dL = lab[i * 3] - ref[0], da = lab[i * 3 + 1] - ref[1], db = lab[i * 3 + 2] - ref[2];
      return Math.sqrt(0.25 * dL * dL + da * da + db * db);
    };
    const pila = [];
    for (const i of borde) if (!bg[i] && lejos(i) < 22) { bg[i] = 1; pila.push(i); }
    const vec = (i, j) => {
      const dL = lab[i * 3] - lab[j * 3], da = lab[i * 3 + 1] - lab[j * 3 + 1], db = lab[i * 3 + 2] - lab[j * 3 + 2];
      return Math.sqrt(dL * dL + da * da + db * db);
    };
    while (pila.length) {
      const i = pila.pop(), x = i % w;
      const vs = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w];
      for (const j of vs) {
        if (j < 0 || j >= n || bg[j]) continue;
        if (vec(i, j) < 3.2 && lejos(j) < 22) { bg[j] = 1; pila.push(j); }
      }
    }
    let bordeBg = 0;
    for (const i of borde) bordeBg += bg[i];
    if (bordeBg / borde.length < 0.8) return null; // foto con ambiente, no fondo liso
    return bg;
  }

  /* --- 2. grupos de color del producto (k-means en Lab) --- */
  function grupos(lab, idx, K) {
    const paso = Math.max(1, Math.floor(idx.length / 6000));
    const m = [];
    for (let s = 0; s < idx.length; s += paso) m.push(idx[s]);
    let c = [];
    for (let k = 0; k < K; k++) {
      const i = m[Math.floor((k + 0.5) * m.length / K)];
      c.push([lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2]]);
    }
    const asign = new Int32Array(m.length);
    for (let it = 0; it < 12; it++) {
      const s = c.map(() => [0, 0, 0, 0]);
      m.forEach((i, t) => {
        let best = 0, bd = 1e9;
        for (let k = 0; k < K; k++) {
          const dL = lab[i * 3] - c[k][0], da = lab[i * 3 + 1] - c[k][1], db = lab[i * 3 + 2] - c[k][2];
          const d = 0.5 * dL * dL + da * da + db * db;
          if (d < bd) { bd = d; best = k; }
        }
        asign[t] = best;
        const q = s[best]; q[0] += lab[i * 3]; q[1] += lab[i * 3 + 1]; q[2] += lab[i * 3 + 2]; q[3]++;
      });
      c = s.map((q, k) => q[3] ? [q[0] / q[3], q[1] / q[3], q[2] / q[3]] : c[k]);
    }
    const n = c.map(() => 0);
    asign.forEach(k => n[k]++);
    return c.map((v, k) => ({ L: v[0], a: v[1], b: v[2], n: n[k] / m.length })).filter(g => g.n > 0);
  }

  // ¿el píxel pertenece al cuerpo? 0..1 (borde suave)
  function pertenencia(cuerpo, L, a, b) {
    const C = Math.hypot(cuerpo.a, cuerpo.b);
    let d;
    if (C > 12) {
      // color con tono: comparo el tono; la luz y la saturación cambian con brillos y sombras
      const c = Math.hypot(a, b);
      let dh = Math.abs(Math.atan2(b, a) - Math.atan2(cuerpo.b, cuerpo.a)) * 180 / Math.PI;
      if (dh > 180) dh = 360 - dh;
      d = Math.max(0, dh - 8) * 0.9
        + (c < C ? Math.max(0, Math.log(C / Math.max(c, 0.5)) - 1.6) * 25   // bordes y sombras: menos saturados
                 : Math.max(0, Math.log(c / C) - 0.65) * 25)
        + Math.max(0, Math.abs(L - cuerpo.L) - 40) * 0.8;
    } else {
      // negro, blanco, gris: comparo luz, y que no tenga color
      d = Math.hypot(a - cuerpo.a, b - cuerpo.b) * 1.4 + Math.max(0, Math.abs(L - cuerpo.L) - 2.2 * cuerpo.sL);
    }
    return d < 10 ? 1 : d > 22 ? 0 : (22 - d) / 12;
  }

  function cuerpoDe(gs) {
    // el grupo más grande, sumando los que son el mismo color con otra luz
    const g0 = gs.slice().sort((x, y) => y.n - x.n)[0];
    const C0 = Math.hypot(g0.a, g0.b);
    const mismos = gs.filter(g => C0 > 12
      ? Math.hypot(g.a, g.b) > 8 && Math.abs(((Math.atan2(g.b, g.a) - Math.atan2(g0.b, g0.a)) * 180 / Math.PI + 540) % 360 - 180) < 15
      : Math.hypot(g.a, g.b) < 12 && Math.abs(g.L - g0.L) < 22);
    const N = mismos.reduce((s, g) => s + g.n, 0);
    const prom = k => mismos.reduce((s, g) => s + g[k] * g.n, 0) / N;
    return { L: prom("L"), a: prom("a"), b: prom("b"), sL: 6, n: N };
  }

  async function analizar(src, ref) {
    const clave = src + "|" + (ref ? ref.L.toFixed(1) : "");
    if (cache.has(clave)) return cache.get(clave);
    const im = await cargar(src);
    const esc = Math.min(1, MAX / Math.max(im.naturalWidth, im.naturalHeight));
    const w = Math.round(im.naturalWidth * esc), h = Math.round(im.naturalHeight * esc);
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    cx.drawImage(im, 0, 0, w, h);
    const px = cx.getImageData(0, 0, w, h);
    const n = w * h, lab = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = rgb2lab(px.data[i * 4], px.data[i * 4 + 1], px.data[i * 4 + 2]);
      lab[i * 3] = v[0]; lab[i * 3 + 1] = v[1]; lab[i * 3 + 2] = v[2];
    }
    let res = null;
    const bg = fondo(lab, w, h);
    if (bg) {
      const fg = [];
      for (let i = 0; i < n; i++) if (!bg[i]) fg.push(i);
      const frac = fg.length / n;
      if (frac > 0.02 && frac < 0.8) {
        let cuerpo = null;
        const medir = c => {
          // promedio y dispersión de luz de los píxeles que pertenecen
          let s = 0, s2 = 0, k = 0;
          for (const i of fg) {
            if (pertenencia(c, lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2]) > 0.9) { s += lab[i * 3]; s2 += lab[i * 3] ** 2; k++; }
          }
          return k ? { k, L: s / k, sL: Math.max(2, Math.sqrt(Math.max(0, s2 / k - (s / k) ** 2))) } : { k: 0 };
        };
        if (ref) {
          // fotos extra: busco el mismo color que el cuerpo de la foto principal
          const m = medir(ref);
          if (m.k / fg.length > 0.12) cuerpo = { ...ref, L: m.L, sL: m.sL };
        }
        if (!cuerpo) {
          const c = cuerpoDe(grupos(lab, fg, 5));
          const m = medir(c);
          if (m.k / fg.length > 0.2) cuerpo = { ...c, L: m.L, sL: m.sL };
        }
        if (cuerpo) {
          const peso = new Float32Array(n);
          for (const i of fg) peso[i] = pertenencia(cuerpo, lab[i * 3], lab[i * 3 + 1], lab[i * 3 + 2]);
          // bordes: los brillos claros del contorno pueden haber quedado como "fondo";
          // si están pegados al cuerpo y tienen su mismo tono, también se pintan
          const C = Math.hypot(cuerpo.a, cuerpo.b);
          if (C > 12) {
            const h0 = Math.atan2(cuerpo.b, cuerpo.a);
            let borde = [];
            for (const i of fg) if (peso[i] > 0.5) borde.push(i);
            const visto = new Uint8Array(n);
            for (let paso = 0; paso < 8 && borde.length; paso++) {
              const sig = [];
              for (const i of borde) {
                const x = i % w;
                for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
                  if (j < 0 || j >= n || peso[j] > 0 || visto[j]) continue;
                  visto[j] = 1;
                  const a = lab[j * 3 + 1], b = lab[j * 3 + 2], c = Math.hypot(a, b);
                  if (c < 2.5) continue;
                  let dh = Math.abs(Math.atan2(b, a) - h0) * 180 / Math.PI;
                  if (dh > 180) dh = 360 - dh;
                  if (dh > 30) continue;
                  peso[j] = Math.min(1, c / (0.3 * C)) * (dh < 15 ? 1 : (30 - dh) / 15);
                  if (peso[j] > 0.15) sig.push(j);
                }
              }
              borde = sig;
            }
          }
          res = { w, h, lab, peso, px, cuerpo };
        }
      }
    }
    cache.set(clave, res);
    return res;
  }

  function pintar(A, hex) {
    const [Lt, at, bt] = hex2lab(hex);
    const { w, h, lab, peso, px, cuerpo } = A;
    // contraste de sombras: el color nuevo tiene sombras parecidas a una foto real
    const sObj = Math.min(9, 3 + Lt * 0.12);
    const k = Math.max(0.5, Math.min(2.5, sObj / cuerpo.sL));
    const out = new ImageData(new Uint8ClampedArray(px.data), w, h);
    const d = out.data;
    for (let i = 0; i < w * h; i++) {
      const p = peso[i];
      if (!p) continue;
      const L = Math.max(0, Math.min(100, Lt + (lab[i * 3] - cuerpo.L) * k));
      const luz = Math.max(0.6, Math.min(1.25, L / Math.max(Lt, 1)));
      const [r, g, b] = lab2rgb(L, at * luz, bt * luz);
      d[i * 4] += (r - d[i * 4]) * p;
      d[i * 4 + 1] += (g - d[i * 4 + 1]) * p;
      d[i * 4 + 2] += (b - d[i * 4 + 2]) * p;
    }
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    cv.getContext("2d").putImageData(out, 0, 0);
    return cv.toDataURL("image/jpeg", 0.9);
  }

  /* API: devuelve una imagen (data URL) pintada, o null si no se puede */
  window.vistaPreviaColor = async function (src, hex, principal) {
    try {
      const ref = principal && principal !== src ? (await analizar(principal, null))?.cuerpo : null;
      const A = await analizar(src, ref || null);
      return A ? pintar(A, hex) : null;
    } catch (e) {
      console.warn("Vista previa no disponible", e);
      return null;
    }
  };
})();
