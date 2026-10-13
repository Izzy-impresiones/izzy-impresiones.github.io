/* ===== Versión "hoja por hoja" =====
   Cada sección es una hoja a pantalla completa que se da vuelta hacia arriba,
   siguiendo el dedo. El riel de la derecha es un filamento: la boquilla lo
   "imprime" hasta la hoja en la que estás. La última hoja es el catálogo,
   que se recorre deslizando hacia abajo como siempre.
   Usa las funciones de app.js (tarjeta, impresora, probador, etc.). */

const Hojas = (() => {
  let hojas = [], actual = 0, ocupado = false;
  const DUR = 650, DUR_RAPIDA = 280;
  const riel = () => $("#riel");

  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const scrollDe = i => hojas[i].querySelector(".hoja-scroll");
  const alFinal = el => el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
  const alInicio = el => el.scrollTop <= 0;

  // --p: 0 = hoja apoyada, 1 = hoja dada vuelta. La de abajo recibe sombra.
  function setP(i, p) {
    hojas[i].style.setProperty("--p", p.toFixed(4));
    if (hojas[i + 1]) hojas[i + 1].style.setProperty("--s", ((1 - p) * .35).toFixed(3));
    pintarRiel((i + p) / (hojas.length - 1));
  }

  function pintarRiel(frac) {
    const r = riel(); if (!r) return;
    const y = `${(frac * 100).toFixed(2)}%`;
    r.querySelector(".filamento").setAttribute("y2", y);
    const caja = r.querySelector(".riel-puntos");
    r.querySelector(".boquilla").style.setProperty("--y", `calc(14px + ${frac} * ${caja.clientHeight}px)`);
    r.querySelectorAll(".riel-puntos button").forEach((b, i) => b.classList.toggle("hecho", i / (hojas.length - 1) <= frac + 1e-3));
  }

  // Solo se muestran la hoja actual y sus vecinas (las demás se ocultan para que todo vaya fluido)
  function visibles(...extra) {
    const ver = new Set([actual, actual + 1, ...extra]);
    hojas.forEach((h, i) => h.classList.toggle("oculta", !ver.has(i)));
  }

  function asentar() {
    hojas.forEach((h, i) => {
      h.style.zIndex = hojas.length - i;
      h.classList.toggle("viva", i === actual);
      h.toggleAttribute("inert", i !== actual);
      h.setAttribute("aria-hidden", i !== actual);
    });
    const h = hojas[actual];
    document.body.dataset.tema = h.dataset.tema || "claro";
    document.body.dataset.hoja = h.id || "inicio";
    document.querySelectorAll("#riel-puntos button, #indice-lista button").forEach(b => b.setAttribute("aria-current", +b.dataset.i === actual));
    pintarRiel(actual / (hojas.length - 1));
    visibles();
    history.replaceState(null, "", h.id ? `#${h.id}` : location.pathname + location.search);
  }

  function animar(i, desde, hasta, dur) {
    return new Promise(res => {
      const t0 = performance.now();
      const paso = t => {
        const k = Math.min((t - t0) / dur, 1);
        setP(i, desde + (hasta - desde) * ease(k));
        k < 1 ? requestAnimationFrame(paso) : res();
      };
      requestAnimationFrame(paso);
    });
  }

  // Ir a la hoja k: pasa las hojas una por una (rápido si son varias) mientras la boquilla imprime la línea
  async function ir(k, { rapido = false } = {}) {
    k = Math.max(0, Math.min(hojas.length - 1, k));
    if (ocupado || k === actual) return;
    ocupado = true;
    const dur = rapido || Math.abs(k - actual) > 1 ? DUR_RAPIDA : DUR;
    while (actual !== k) {
      if (k > actual) {
        visibles(actual + 1);
        hojas[actual + 1].classList.add("viva");
        await animar(actual, +hojas[actual].style.getPropertyValue("--p") || 0, 1, dur);
        actual++;
      } else {
        visibles(actual - 1);
        hojas[actual - 1].classList.add("viva");
        await animar(actual - 1, +hojas[actual - 1].style.getPropertyValue("--p") || 1, 0, dur);
        actual--;
      }
    }
    asentar();
    ocupado = false;
  }

  /* --- Gestos con el dedo: la hoja sigue al dedo --- */
  function gestos() {
    const mazo = $("#mazo");
    let g = null;
    mazo.addEventListener("touchstart", e => {
      if (ocupado || e.touches.length > 1) { g = null; return; }
      const t = e.touches[0];
      g = { x0: t.clientX, y0: t.clientY, t0: performance.now(), modo: null, p: 0, alto: innerHeight };
    }, { passive: true });

    mazo.addEventListener("touchmove", e => {
      if (!g) return;
      const t = e.touches[0], dx = t.clientX - g.x0, dy = t.clientY - g.y0;
      if (!g.modo) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        const sc = scrollDe(actual);
        if (Math.abs(dx) > Math.abs(dy)) g.modo = "nada";
        else if (dy < 0) g.modo = alFinal(sc) && actual < hojas.length - 1 ? "adelante" : "nada";
        else g.modo = alInicio(sc) && actual > 0 ? "atras" : "nada";
        if (g.modo === "adelante") { visibles(actual + 1); hojas[actual + 1].classList.add("viva"); }
        if (g.modo === "atras") { visibles(actual - 1); hojas[actual - 1].classList.add("viva"); }
      }
      if (g.modo === "nada") return;
      e.preventDefault();
      if (g.modo === "adelante") { g.p = Math.min(Math.max(-dy / (g.alto * .7), 0), 1); setP(actual, g.p); }
      else { g.p = Math.min(Math.max(1 - dy / (g.alto * .7), 0), 1); setP(actual - 1, g.p); }
    }, { passive: false });

    const soltar = async e => {
      if (!g || !g.modo || g.modo === "nada") { g = null; return; }
      const t = (e.changedTouches || [])[0];
      const v = t ? (t.clientY - g.y0) / (performance.now() - g.t0) : 0; // px por ms
      const modo = g.modo, p = g.p; g = null;
      ocupado = true;
      if (modo === "adelante") {
        if (p > .28 || v < -.45) { await animar(actual, p, 1, DUR * (1 - p) + 120); actual++; }
        else await animar(actual, p, 0, 260);
      } else {
        if (p < .72 || v > .45) { await animar(actual - 1, p, 0, DUR * p + 120); actual--; }
        else await animar(actual - 1, p, 1, 260);
      }
      asentar();
      ocupado = false;
    };
    mazo.addEventListener("touchend", soltar);
    mazo.addEventListener("touchcancel", soltar);

    // Rueda del mouse y teclado (compu)
    let acum = 0, bloqueo = 0;
    mazo.addEventListener("wheel", e => {
      const sc = scrollDe(actual);
      const quiereBajar = e.deltaY > 0, quiereSubir = e.deltaY < 0;
      if ((quiereBajar && !alFinal(sc)) || (quiereSubir && !alInicio(sc))) { acum = 0; return; }
      e.preventDefault();
      if (ocupado || performance.now() < bloqueo) return;
      acum += e.deltaY;
      if (Math.abs(acum) > 40) {
        const dir = Math.sign(acum); acum = 0; bloqueo = performance.now() + 900;
        ir(actual + dir);
      }
    }, { passive: false });
    addEventListener("keydown", e => {
      if (!$("#indice").hidden || /input|select|textarea/i.test(document.activeElement.tagName)) return;
      const sc = scrollDe(actual);
      if (["ArrowDown", "PageDown"].includes(e.key) && alFinal(sc)) { e.preventDefault(); ir(actual + 1); }
      if (["ArrowUp", "PageUp"].includes(e.key) && alInicio(sc)) { e.preventDefault(); ir(actual - 1); }
    });
  }

  /* --- Riel, índice y botones que llevan a otra hoja --- */
  function navegacion() {
    $("#riel-puntos").innerHTML = hojas.map((h, i) =>
      `<button data-i="${i}" style="top:${(i / (hojas.length - 1) * 100).toFixed(2)}%" aria-label="Ir a ${esc(h.dataset.nombre)}"></button>`).join("");
    const linea = riel().querySelectorAll("line");
    linea.forEach(l => { l.setAttribute("x1", "50%"); l.setAttribute("x2", "50%"); l.setAttribute("y1", "0"); });
    linea[0].setAttribute("y2", "100%");
    $("#riel-puntos").addEventListener("click", e => { const b = e.target.closest("button"); if (b) ir(+b.dataset.i, { rapido: true }); });

    $("#indice-lista").innerHTML = hojas.map((h, i) =>
      `<li><button data-i="${i}"><small>${i + 1}</small>${esc(h.dataset.nombre)}</button></li>`).join("");
    const indice = $("#indice"), btn = $("#btn-indice");
    const cerrar = () => { indice.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", () => { indice.hidden = !indice.hidden; btn.setAttribute("aria-expanded", String(!indice.hidden)); });
    $("#indice-cerrar").addEventListener("click", cerrar);
    indice.addEventListener("click", e => {
      if (e.target === indice) return cerrar();
      const b = e.target.closest("#indice-lista button"); if (!b) return;
      cerrar(); setTimeout(() => ir(+b.dataset.i, { rapido: true }), 120);
    });
    addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });

    document.addEventListener("click", async e => {
      const a = e.target.closest("[data-ir]");
      if (a) return ir(+a.dataset.ir);
      const c = e.target.closest("[data-catalogo]");
      if (c) {
        await ir(hojas.length - 1, { rapido: true });
        const chip = document.querySelector(`.chip[data-v="${c.dataset.catalogo}"]`);
        if (chip) chip.click();
        scrollDe(hojas.length - 1).scrollTo({ top: 0 });
      }
    });
  }

  async function iniciar() {
    if (!diaMadreActivo()) $("#dia-madre")?.remove();
    hojas = [...document.querySelectorAll(".hoja")];
    const desdeHash = hojas.findIndex(h => h.id && `#${h.id}` === location.hash);
    actual = desdeHash > 0 ? desdeHash : 0;
    hojas.forEach((h, i) => h.style.setProperty("--p", i < actual ? 1 : 0));
    navegacion();
    asentar();
    gestos();

    // WhatsApp flotante y enlaces de WhatsApp
    document.body.insertAdjacentHTML("beforeend",
      `<a class="fab" href="${waGeneral()}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">${ICON.wa}</a>`);
    document.querySelectorAll("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

    impresora();
    probador();
    try {
      const productos = await cargarProductos();
      const mom = productos.filter(p => p.dia_de_la_madre);
      const fila = $("#dia-madre-grid");
      if (fila && mom.length) fila.innerHTML = mom.slice(0, 6).map((p, i) => tarjeta(p, i)).join("");
      cuentaRegresiva();
      await paginaCatalogo();
      alternarFotos();
    } catch (err) {
      console.error(err);
      $("#grid").innerHTML = `<p class="empty">No se pudieron cargar los productos. Probá recargar la página.</p>`;
    }
  }

  return { iniciar, ir };
})();

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "hojas") Hojas.iniciar();
});
