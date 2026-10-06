/* ===== Datos del negocio (se cambian acá) ===== */
const IZZY = {
  whatsapp: "543794112142",
  instagram: "https://www.instagram.com/izzy.impresiones",
  diaMadre: { fecha: "2026-10-18", encargarAntes: "jueves 15/10" },
};

const COLORES = {
  "Amarillo flúor":"#e4ef3b","Verde":"#5e7952","Azul":"#3658a3","Marrón":"#76513a","Oro":"#b39a53",
  "Nova":"#b7a6ce","Magenta flúor":"#de429a","Rojo":"#b94239","Amarillo":"#e9c957","Morado":"#79548a",
  "Esmeralda":"#287f68","Rosa claro":"#e8c4c6","Rosa chicle":"#e48da8","Blanco":"#f4f2ec","Negro":"#282a28",
  "Celeste":"#99c5dc","Gris plomo":"#686c6d","Naranja":"#de8b4d","Piel":"#dab899"
};
const TODOS_LOS_COLORES = Object.keys(COLORES);
const CATEGORIAS = ["Hogar","Organización","Decoración","Llaveros","Lámparas","Regalos","Figuras","Personalizados","Otros"];

/* ===== Íconos ===== */
const ICON = {
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.42 1.31-1.95 1.36-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.1-1.47-1.1-2.81 0-1.33.7-1.99.95-2.26.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.23.54.77 1.87.84 2 .07.14.11.3.02.48-.09.18-.14.29-.27.45-.14.16-.28.35-.41.47-.14.13-.28.28-.12.55.16.27.7 1.16 1.51 1.88 1.04.93 1.92 1.22 2.19 1.35.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.6-.14.25.09 1.57.74 1.84.88.27.13.45.2.52.31.07.11.07.65-.17 1.33Z"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="26" height="26" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
};

/* ===== Utilidades ===== */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const precio = p => p == null ? "Consultar precio" : "$ " + p.toLocaleString("es-AR");
const coloresDe = p => p.colores === "*" ? TODOS_LOS_COLORES : (p.colores || []);
const waLink = msg => `https://wa.me/${IZZY.whatsapp}?text=${encodeURIComponent(msg)}`;
const waProducto = (p, color) =>
  waLink(`¡Hola! Vi en la página este producto: ${p.nombre}${color ? ` (color ${color})` : ""}. ¿Me pasás info?`);
const waGeneral = () => waLink("¡Hola! Quiero consultar por las impresiones 3D de Izzy.");
const productoURL = p => `producto.html?p=${encodeURIComponent(p.slug)}`;
const diaMadreActivo = () => new Date() <= new Date(IZZY.diaMadre.fecha + "T23:59:59-03:00");

async function cargarProductos() {
  const r = await fetch("data/productos.json", { cache: "no-cache" });
  return r.json();
}

/* ===== Header y footer compartidos ===== */
function marca() {
  return `<a class="brand" href="index.html" aria-label="Izzy Impresiones 3D, inicio">
    <img src="brand/izzy-mark.png" alt="" onerror="this.style.display='none'">
    <span><b>izzy</b><small>IMPRESIONES 3D</small></span></a>`;
}

function montarLayout() {
  const promo = diaMadreActivo()
    ? `<div class="promo">🎁 Día de la Madre: domingo 18/10. Encargá tu regalo antes del ${IZZY.diaMadre.encargarAntes}. <a href="catalogo.html?cat=dia-de-la-madre">Ver regalos</a></div>`
    : "";
  document.body.insertAdjacentHTML("afterbegin", `
    <a class="skip" href="#contenido">Ir al contenido</a>
    ${promo}
    <header class="site-header"><div class="container nav">
      ${marca()}
      <nav class="nav-links" id="menu">
        <a href="catalogo.html">Catálogo</a>
        <a href="index.html#personalizados">Personalizados</a>
        <a href="index.html#colores">Colores</a>
        <a href="index.html#como-comprar">Cómo comprar</a>
      </nav>
      <div style="display:flex;align-items:center;gap:4px">
        <a class="nav-ig" href="${IZZY.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>
        <button class="menu-btn" aria-label="Abrir menú" aria-controls="menu" aria-expanded="false">${ICON.menu}</button>
      </div>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="site-footer"><div class="container">
      <div class="foot-grid">
        <div>${marca()}<p style="opacity:.8;margin-top:16px">Ideas que toman forma.<br>Izzy Impresiones 3D · Corrientes Capital.</p></div>
        <div><h4>Explorá</h4><ul>
          <li><a href="catalogo.html">Todos los productos</a></li>
          <li><a href="index.html#personalizados">Tu idea, en 3D</a></li>
          <li><a href="index.html#colores">Nuestros colores</a></li>
          <li><a href="index.html#como-comprar">Cómo comprar</a></li>
        </ul></div>
        <div><h4>Sigamos en contacto</h4><ul>
          <li><a href="${IZZY.instagram}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="${waGeneral()}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul></div>
      </div>
      <div class="copy">© ${new Date().getFullYear()} Izzy Impresiones 3D</div>
    </div></footer>
    <a class="fab" href="${waGeneral()}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">${ICON.wa}</a>`);
  const btn = $(".menu-btn"), menu = $("#menu");
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
}

/* ===== Tarjeta de producto ===== */
function tarjeta(p) {
  const cols = coloresDe(p).slice(0, 5).map(c => `<i title="${esc(c)}" style="background:${COLORES[c] || "#ccc"}"></i>`).join("");
  const badge = p.dia_de_la_madre && diaMadreActivo() ? `<span class="badge mom-b">Día de la Madre</span>` : "";
  return `<article class="card">
    <a class="photo" href="${productoURL(p)}">${badge}<img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" loading="lazy"></a>
    <div class="body">
      <div class="meta"><span>${esc(p.categoria)}</span><span class="mini">${cols}</span></div>
      <h3><a href="${productoURL(p)}">${esc(p.nombre)}</a></h3>
      <p class="price">${precio(p.precio)}${p.precio != null ? " <small>ARS</small>" : ""}</p>
      <div class="actions">
        <a href="${productoURL(p)}">Ver detalles</a>
        <a class="wa-link" href="${waProducto(p)}" target="_blank" rel="noopener">${ICON.wa} Consultar</a>
      </div>
    </div></article>`;
}

/* ===== Descripción con formato simple ===== */
function formatoDescripcion(txt) {
  const bloques = String(txt || "").split(/\n\s*\n/);
  return bloques.map(b => {
    const lineas = b.split("\n").map(l => l.trim()).filter(Boolean);
    if (lineas.length && lineas.every(l => /^[*•-]\s/.test(l)))
      return "<ul>" + lineas.map(l => `<li>${esc(l.replace(/^[*•-]\s/, ""))}</li>`).join("") + "</ul>";
    if (lineas.length === 1 && lineas[0].length < 40 && !/[.!?]$/.test(lineas[0]))
      return `<h4>${esc(lineas[0].replace(/:$/, ""))}</h4>`;
    return `<p>${lineas.map(esc).join("<br>")}</p>`;
  }).join("");
}

/* ===== Páginas ===== */
async function paginaInicio() {
  const productos = await cargarProductos();
  const ultimos = [...productos].sort((a, b) => b.orden - a.orden).slice(0, 6);
  $("#ultimos").innerHTML = ultimos.map(tarjeta).join("");

  const mom = productos.filter(p => p.dia_de_la_madre);
  if (diaMadreActivo() && mom.length) {
    $("#dia-madre").hidden = false;
    $("#dia-madre-grid").innerHTML = mom.slice(0, 4).map(tarjeta).join("");
  }
  $("#swatches").innerHTML = TODOS_LOS_COLORES.map(c => `<div class="sw"><i style="background:${COLORES[c]}"></i>${esc(c)}</div>`).join("");
  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank"; a.rel = "noopener";
  });
}

async function paginaCatalogo() {
  const productos = await cargarProductos();
  const params = new URLSearchParams(location.search);
  let cat = params.get("cat") || "todos";
  let orden = "sugerido", q = "";

  const chips = [["todos", "Todos"]];
  if (productos.some(p => p.dia_de_la_madre)) chips.push(["dia-de-la-madre", "🎁 Día de la Madre"]);
  CATEGORIAS.filter(c => productos.some(p => p.categoria === c)).forEach(c => chips.push([c, c]));
  const cont = $("#chips");
  cont.innerHTML = chips.map(([v, l]) => `<button class="chip${v === "dia-de-la-madre" ? " mom-chip" : ""}" data-v="${esc(v)}">${esc(l)}</button>`).join("");

  function render() {
    cont.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === cat));
    let lista = productos.filter(p =>
      cat === "todos" ? true : cat === "dia-de-la-madre" ? p.dia_de_la_madre : p.categoria === cat);
    if (q) {
      const t = q.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      lista = lista.filter(p => (p.nombre + " " + p.categoria).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(t));
    }
    if (orden === "menor") lista.sort((a, b) => (a.precio ?? 1e12) - (b.precio ?? 1e12));
    if (orden === "mayor") lista.sort((a, b) => (b.precio ?? -1) - (a.precio ?? -1));
    if (orden === "nuevos") lista.sort((a, b) => b.orden - a.orden);
    $("#count").textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
    $("#grid").innerHTML = lista.length ? lista.map(tarjeta).join("")
      : `<p class="empty">No encontramos productos. ¿Lo buscás personalizado? <a href="${waGeneral()}" target="_blank" rel="noopener">Escribinos</a>.</p>`;
  }
  cont.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.v;
    const u = new URL(location); cat === "todos" ? u.searchParams.delete("cat") : u.searchParams.set("cat", cat);
    history.replaceState(null, "", u);
    render();
  });
  $("#sort").addEventListener("change", e => { orden = e.target.value; render(); });
  $("#search").addEventListener("input", e => { q = e.target.value.trim(); render(); });
  render();
}

async function paginaProducto() {
  const productos = await cargarProductos();
  const slug = new URLSearchParams(location.search).get("p");
  const p = productos.find(x => x.slug === slug);
  const main = $("#contenido");
  if (!p) {
    main.innerHTML = `<div class="container" style="padding:80px 0"><h1>No encontramos ese producto</h1><p class="lead">Puede que ya no esté en el catálogo.</p><a class="btn" href="catalogo.html">Ver el catálogo</a></div>`;
    return;
  }
  document.title = `${p.nombre} | Izzy Impresiones 3D`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = p.descripcion.split("\n")[0].slice(0, 155);

  const cols = coloresDe(p);
  let color = cols[0] || null;
  main.innerHTML = `<div class="container">
    <nav class="crumbs"><a href="index.html">Inicio</a><span>/</span><a href="catalogo.html">Catálogo</a><span>/</span>${esc(p.nombre)}</nav>
    <div class="detail">
      <div class="gallery">
        <div class="main"><img id="foto" src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}"></div>
        ${p.imagenes.length > 1 ? `<div class="thumbs">${p.imagenes.map((u, i) =>
          `<button aria-label="Ver foto ${i + 1}" aria-pressed="${i === 0}" data-src="${esc(u)}"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
      </div>
      <div class="d-copy">
        <span class="eyebrow">${esc(p.categoria)}</span>
        <h1>${esc(p.nombre)}</h1>
        <p class="d-price">${precio(p.precio)}${p.precio != null ? " <small>ARS</small>" : ""}</p>
        <span class="stock">Disponible para pedir · listo en 1 a 2 días</span>
        <div class="desc">${formatoDescripcion(p.descripcion)}</div>
        ${cols.length ? `<fieldset class="picker"><legend>Elegí tu color: <strong id="color-nombre">${esc(color)}</strong></legend>
          <div>${cols.map((c, i) => `<button style="background:${COLORES[c] || "#ccc"}" title="${esc(c)}" aria-label="${esc(c)}" aria-pressed="${i === 0}" data-c="${esc(c)}"></button>`).join("")}</div>
          <small>Los tonos son orientativos y pueden variar según la pantalla y el material.</small></fieldset>` : ""}
        <a id="wa-btn" class="btn wa" href="${waProducto(p, color)}" target="_blank" rel="noopener">${ICON.wa} Pedir por WhatsApp</a>
        <div class="notes"><span>Hecho con impresión 3D</span><span>Seña por transferencia</span><span>Entrega en Corrientes Capital</span></div>
      </div>
    </div>
    <section style="padding-top:20px">
      <div class="section-head"><h2>También te puede gustar</h2><a class="text-link" href="catalogo.html">Ver todos →</a></div>
      <div class="grid">${productos.filter(x => x.categoria === p.categoria && x.slug !== p.slug).slice(0, 4).map(tarjeta).join("")}</div>
    </section></div>`;

  main.addEventListener("click", e => {
    const t = e.target.closest(".thumbs button");
    if (t) {
      $("#foto").src = t.dataset.src;
      main.querySelectorAll(".thumbs button").forEach(b => b.setAttribute("aria-pressed", b === t));
    }
    const c = e.target.closest(".picker button");
    if (c) {
      color = c.dataset.c;
      $("#color-nombre").textContent = color;
      main.querySelectorAll(".picker button").forEach(b => b.setAttribute("aria-pressed", b === c));
      $("#wa-btn").href = waProducto(p, color);
    }
  });
}

/* ===== Arranque ===== */
document.addEventListener("DOMContentLoaded", () => {
  montarLayout();
  const page = document.body.dataset.page;
  const run = { inicio: paginaInicio, catalogo: paginaCatalogo, producto: paginaProducto }[page];
  if (run) run().catch(err => {
    console.error(err);
    const m = $("#contenido");
    if (m) m.insertAdjacentHTML("afterbegin", `<p class="container empty">No se pudieron cargar los productos. Probá recargar la página.</p>`);
  });
});
