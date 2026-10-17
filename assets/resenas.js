/* ===== Reseñas =====
   Las reseñas se guardan en un Formulario de Google y se leen de su planilla.
   Para conectarlo se completan estos 3 datos (ver README, sección "Reseñas"). */
const RESENAS = {
  // Link del formulario (el que termina en /viewform)
  formulario: "",
  // Códigos "entry.123456789" de cada pregunta del formulario
  campos: { nombre: "", estrellas: "", comentario: "" },
  // Link de la planilla de respuestas (compartida como "Cualquier persona con el enlace: Lector")
  planilla: "",
};

const ETIQUETAS = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"];
const R_LOCAL = "izzy-resenas-mias";
const R_ULTIMA = "izzy-resena-ultima";

const resenasConectadas = () => !!(RESENAS.formulario && RESENAS.planilla && RESENAS.campos.estrellas);

function urlEnvio() {
  return RESENAS.formulario.replace(/\/(viewform|formResponse|edit).*$/, "") + "/formResponse";
}
function urlLectura() {
  const u = RESENAS.planilla;
  const id = (u.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/) || [])[1];
  if (id && id !== "e") return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&_=${Date.now()}`;
  // Planilla "publicada en la web" como CSV
  return u.includes("output=csv") ? u : u.replace(/\/pubhtml.*$/, "/pub?output=csv");
}

/* --- CSV --- */
function leerCSV(txt) {
  const filas = []; let fila = [], campo = "", q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) {
      if (c === '"' && txt[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') q = false;
      else campo += c;
    } else if (c === '"') q = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && txt[i + 1] === "\n") i++;
      fila.push(campo); filas.push(fila); fila = []; campo = "";
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}

function fechaDe(s) {
  const m = String(s).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

function aResenas(filas) {
  if (!filas.length) return [];
  const cab = filas[0].map(h => h.toLowerCase());
  const col = re => cab.findIndex(h => re.test(h));
  const iF = Math.max(col(/marca temporal|timestamp|fecha/), 0);
  const iN = col(/nombre/), iE = col(/calific|estrella|puntaje|puntu/), iC = col(/coment|opini|rese|mensaje/);
  return filas.slice(1).map(f => ({
    fecha: fechaDe(f[iF]),
    nombre: (f[iN] || "").trim(),
    estrellas: Math.round(parseFloat(String(f[iE]).replace(",", "."))),
    comentario: (f[iC] || "").trim(),
  })).filter(r => r.estrellas >= 1 && r.estrellas <= 5);
}

/* --- Reseñas propias (para que la persona vea la suya al instante) --- */
function mias() { try { return JSON.parse(localStorage.getItem(R_LOCAL)) || []; } catch { return []; } }
function guardarMias(lista) { try { localStorage.setItem(R_LOCAL, JSON.stringify(lista)); } catch {} }
const clave = r => (r.nombre + "|" + r.comentario).toLowerCase().replace(/\s+/g, " ").trim();

async function cargarResenas() {
  let lista = [];
  if (resenasConectadas()) {
    const r = await fetch(urlLectura(), { cache: "no-store" });
    if (!r.ok) throw new Error("planilla " + r.status);
    lista = aResenas(leerCSV(await r.text()));
  }
  // Suma las que la persona envió y todavía no aparecen en la planilla
  const publicadas = new Set(lista.map(clave));
  const pendientes = mias().filter(r => !publicadas.has(clave(r)) && Date.now() - r.t < 864e5);
  guardarMias(pendientes);
  return [...pendientes.map(r => ({ ...r, fecha: new Date(r.t), tuya: true })), ...lista];
}

/* --- Dibujo --- */
const estrellasTxt = n => `<span class="stars" aria-label="${n} de 5 estrellas" style="--n:${n}"><span aria-hidden="true">★★★★★</span></span>`;
const inicial = n => (n || "?").trim().charAt(0).toUpperCase();
function cuando(d) {
  if (!d) return "";
  const dias = Math.floor((Date.now() - d) / 864e5);
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Ayer";
  if (dias < 7) return `Hace ${dias} días`;
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

function resenaHTML(r) {
  return `<article class="resena${r.tuya ? " tuya" : ""}">
    <header><span class="avatar" aria-hidden="true">${esc(inicial(r.nombre))}</span>
      <div><b>${esc(r.nombre || "Anónimo")}</b><small>${cuando(r.fecha)}${r.tuya ? " · Tu reseña" : ""}</small></div>
      ${estrellasTxt(r.estrellas)}</header>
    ${r.comentario ? `<p>${esc(r.comentario).replace(/\n/g, "<br>")}</p>` : ""}
  </article>`;
}

function resumenHTML(lista) {
  const n = lista.length;
  const prom = n ? lista.reduce((s, r) => s + r.estrellas, 0) / n : 0;
  const barras = [5, 4, 3, 2, 1].map(k => {
    const c = lista.filter(r => r.estrellas === k).length;
    return `<li><span>${k} ★</span><i><b style="width:${n ? (c / n * 100).toFixed(1) : 0}%"></b></i><em>${c}</em></li>`;
  }).join("");
  return `<div class="r-prom"><strong>${n ? prom.toFixed(1).replace(".", ",") : "–"}</strong>${estrellasTxt(Math.round(prom))}
      <small>${n === 1 ? "1 reseña" : `${n} reseñas`}</small></div>
    <ul class="r-barras">${barras}</ul>`;
}

/* --- Página de reseñas --- */
async function paginaResenas() {
  const resumen = $("#r-resumen"), cont = $("#r-lista"), orden = $("#r-orden"), filtro = $("#r-filtro");
  let lista = [];
  const render = () => {
    let v = filtro.value === "todas" ? lista : lista.filter(r => r.estrellas === +filtro.value);
    v = [...v].sort({
      recientes: (a, b) => (b.fecha || 0) - (a.fecha || 0),
      mejores: (a, b) => b.estrellas - a.estrellas || (b.fecha || 0) - (a.fecha || 0),
      peores: (a, b) => a.estrellas - b.estrellas || (b.fecha || 0) - (a.fecha || 0),
    }[orden.value]);
    resumen.innerHTML = resumenHTML(lista);
    cont.innerHTML = v.length ? v.map(resenaHTML).join("")
      : `<p class="empty">${lista.length ? "No hay reseñas con ese puntaje." : "Todavía no hay reseñas. ¡Dejá la primera!"}</p>`;
  };
  const recargar = async () => {
    try { lista = await cargarResenas(); }
    catch (e) { console.error(e); cont.innerHTML = `<p class="empty">No se pudieron cargar las reseñas. Probá recargar la página.</p>`; return; }
    render();
  };
  orden.addEventListener("change", render);
  filtro.addEventListener("change", render);
  formularioResena(r => { lista = [{ ...r, fecha: new Date(), tuya: true }, ...lista]; filtro.value = "todas"; orden.value = "recientes"; render(); });
  await recargar();
}

function formularioResena(alPublicar) {
  const f = $("#r-form"); if (!f) return;
  const msg = $("#r-msg"), btn = f.querySelector("button[type=submit]"), etiqueta = $("#r-etiqueta");
  const txt = f.comentario, cuenta = $("#r-cuenta");
  f.addEventListener("change", e => {
    if (e.target.name === "estrellas") etiqueta.textContent = ETIQUETAS[+e.target.value];
  });
  txt.addEventListener("input", () => { cuenta.textContent = `${txt.value.length}/600`; });
  f.addEventListener("submit", async e => {
    e.preventDefault();
    msg.className = "r-msg"; msg.textContent = "";
    const estrellas = +(f.estrellas.value || 0);
    const nombre = f.nombre.value.trim(), comentario = txt.value.trim();
    if (f.web.value) return; // trampa para robots
    if (!estrellas) { msg.textContent = "Elegí de 1 a 5 estrellas."; msg.classList.add("err"); f.querySelector("input[name=estrellas]").focus(); return; }
    if (!nombre) { msg.textContent = "Escribí tu nombre."; msg.classList.add("err"); f.nombre.focus(); return; }
    if (!resenasConectadas()) { msg.textContent = "Las reseñas todavía no están activadas. ¡Muy pronto!"; msg.classList.add("err"); return; }
    let ultima = 0; try { ultima = +localStorage.getItem(R_ULTIMA) || 0; } catch {}
    if (Date.now() - ultima < 60e3) { msg.textContent = "Esperá un minuto antes de enviar otra reseña."; msg.classList.add("err"); return; }
    btn.disabled = true; btn.textContent = "Enviando…";
    const datos = new URLSearchParams();
    datos.append(RESENAS.campos.nombre, nombre);
    datos.append(RESENAS.campos.estrellas, String(estrellas));
    datos.append(RESENAS.campos.comentario, comentario);
    try {
      await fetch(urlEnvio(), { method: "POST", mode: "no-cors", body: datos });
      const r = { nombre, estrellas, comentario, t: Date.now() };
      guardarMias([r, ...mias()]);
      try { localStorage.setItem(R_ULTIMA, String(Date.now())); } catch {}
      f.reset(); etiqueta.textContent = ""; cuenta.textContent = "0/600";
      msg.textContent = "¡Gracias! Tu reseña ya está publicada."; msg.classList.add("ok");
      alPublicar && alPublicar(r);
    } catch (err) {
      console.error(err);
      msg.textContent = "No se pudo enviar. Revisá tu conexión y probá de nuevo."; msg.classList.add("err");
    } finally { btn.disabled = false; btn.textContent = "Publicar reseña"; }
  });
}

/* --- Bloque del inicio --- */
async function resenasInicio() {
  const box = $("#resenas-inicio"); if (!box || !resenasConectadas()) return;
  $("#resenas").hidden = false;
  let lista = [];
  try { lista = await cargarResenas(); } catch (e) { console.error(e); }
  const ult = [...lista].sort((a, b) => (b.fecha || 0) - (a.fecha || 0)).slice(0, 3);
  box.innerHTML = `<div class="r-top">${resumenHTML(lista)}</div>
    <div class="r-grid">${ult.length ? ult.map(resenaHTML).join("") : `<p class="empty">Todavía no hay reseñas. ¡Contanos qué te pareció!</p>`}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "resenas") paginaResenas();
  if (page === "inicio") resenasInicio();
});
