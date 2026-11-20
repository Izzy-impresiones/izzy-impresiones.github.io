/* Armador de combos navideños de Izzy: bandeja + arbolito + dos figuras. */
(function () {
  "use strict";
  const FIGURAS = [
    { id: "papa-noel", nombre: "Papá Noel", precio: 5000, icono: "🎅" },
    { id: "mama-noel", nombre: "Mamá Noel", precio: 5000, icono: "🤶" },
    { id: "arbol", nombre: "Muñeco de nieve", precio: 4600, icono: "☃️" },
    { id: "reno", nombre: "Reno", precio: 3600, icono: "🦌" },
    { id: "galletita", nombre: "Galletita", precio: 4000, icono: "🍪" },
    { id: "perrito", nombre: "Perrito", precio: 3600, icono: "🐶" },
    { id: "gatito", nombre: "Gatito", precio: 4800, icono: "🐱" },
    { id: "jesus", nombre: "Jesús", precio: 4800, icono: "✨" }
  ];
  const PRECIO_BANDEJA = 4000;
  const PRECIO_ARBOLITO = 4600;
  const DESCUENTO = 0.10;
  const moneda = n => "$ " + n.toLocaleString("es-AR");

  function montarArmadores() {
    document.querySelectorAll("[data-armador-navidad]").forEach((destino, indice) => {
      const idUno = "combo-figura-uno-" + indice;
      const idDos = "combo-figura-dos-" + indice;
      const opciones = FIGURAS.map(f =>
        '<option value="' + f.id + '">' + f.nombre + ' · ' + moneda(f.precio) + '</option>'
      ).join("");

      destino.innerHTML = [
        '<div class="combo-builder">',
          '<div class="combo-intro">',
            '<span class="combo-eyebrow">🎄 ESPECIAL NAVIDAD · IMPRESIÓN 3D</span>',
            '<h3>Armá tu propio<br><em>combo navideño.</em></h3>',
            '<p>Una bandeja, un arbolito y dos figuras que elegís vos. Combiná tus favoritas y llevate el conjunto con descuento.</p>',
            '<div class="combo-pieces" aria-label="Las cuatro piezas de tu combo">',
              '<div class="combo-piece"><span class="combo-piece-icon combo-tray" aria-hidden="true"></span><small>Bandeja</small><b class="combo-fixed">Incluida</b></div>',
              '<div class="combo-piece"><span class="combo-piece-icon" aria-hidden="true">🎄</span><small>Arbolito</small><b class="combo-fixed">Incluido</b></div>',
              '<div class="combo-piece"><span class="combo-piece-icon" data-icono="0" aria-hidden="true">🎅</span><small data-nombre="0">Papá Noel</small><b>Tu elección</b></div>',
              '<div class="combo-piece"><span class="combo-piece-icon" data-icono="1" aria-hidden="true">🦌</span><small data-nombre="1">Reno</small><b>Tu elección</b></div>',
            '</div>',
            '<span class="combo-footnote">4 piezas para decorar, regalar y disfrutar ✨</span>',
          '</div>',
          '<div class="combo-config">',
            '<div class="combo-config-header"><span class="combo-kicker">PERSONALIZÁ TU COMBO</span><span class="combo-discount">10% OFF</span></div>',
            '<p class="combo-includes">La <strong>bandeja</strong> y el <strong>arbolito de Navidad</strong> ya vienen incluidos.</p>',
            '<div class="combo-field"><label for="' + idUno + '"><span class="combo-num">01</span> Elegí tu primera figura</label>',
              '<select id="' + idUno + '" data-figura="0">' + opciones + '</select></div>',
            '<div class="combo-field"><label for="' + idDos + '"><span class="combo-num">02</span> Elegí tu segunda figura</label>',
              '<select id="' + idDos + '" data-figura="1">' + opciones + '</select></div>',
            '<p class="combo-helper">Podés elegir dos figuras iguales. Los colores se coordinan por WhatsApp.</p>',
            '<div class="combo-price-box">',
              '<div class="combo-price-top"><span>Tu combo navideño</span><strong data-precio aria-live="polite"></strong></div>',
              '<div class="combo-price-bottom"><span>Por separado: <s data-original></s></span><span class="combo-saving" data-ahorro></span></div>',
            '</div>',
            '<a class="btn wa combo-buy" data-pedir href="#" target="_blank" rel="noopener">Pedir mi combo por WhatsApp ↗</a>',
            '<p class="combo-confirm">Pedido a coordinar · Impreso en 3D en Corrientes</p>',
          '</div>',
        '</div>'
      ].join("");

      const selects = destino.querySelectorAll("[data-figura]");
      selects[0].value = "papa-noel";
      selects[1].value = "reno";

      function actualizar() {
        const elegidos = [...selects].map(s => FIGURAS.find(f => f.id === s.value));
        const total = PRECIO_BANDEJA + PRECIO_ARBOLITO + elegidos[0].precio + elegidos[1].precio;
        const combo = Math.round(total * (1 - DESCUENTO) / 100) * 100;
        elegidos.forEach((f, n) => {
          destino.querySelector('[data-icono="' + n + '"]').textContent = f.icono;
          destino.querySelector('[data-nombre="' + n + '"]').textContent = f.nombre;
        });
        destino.querySelector("[data-precio]").textContent = moneda(combo);
        destino.querySelector("[data-original]").textContent = moneda(total);
        destino.querySelector("[data-ahorro]").textContent = "Ahorrás " + moneda(total - combo);
        const mensaje = [
          "¡Hola! Vi el armador de combos navideños de Izzy 🎄",
          "Quiero pedir el siguiente combo de 4 piezas:",
          "• Bandeja",
          "• Arbolito de Navidad",
          "• " + elegidos[0].nombre,
          "• " + elegidos[1].nombre,
          "",
          "Precio del combo: " + moneda(combo) + " ARS.",
          "¿Podemos coordinar colores y entrega?"
        ].join("\n");
        destino.querySelector("[data-pedir]").href =
          "https://wa.me/" + IZZY.whatsapp + "?text=" + encodeURIComponent(mensaje);
      }

      selects.forEach(s => s.addEventListener("change", actualizar));
      actualizar();
    });
  }

  document.addEventListener("DOMContentLoaded", montarArmadores);
})();
