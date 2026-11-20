/* Armador libre de combos navideños · Izzy Impresiones 3D */
(function () {
  "use strict";

  const ARTICULOS = [
    { id: "bandeja", nombre: "Bandeja", precio: 4000, emoji: "" },
    { id: "arbolito", nombre: "Arbolito de Navidad", precio: 4600, emoji: "🎄" },
    { id: "papa-noel", nombre: "Papá Noel", precio: 5000, emoji: "🎅" },
    { id: "mama-noel", nombre: "Mamá Noel", precio: 5000, emoji: "🤶" },
    { id: "nieve", nombre: "Muñeco de nieve", precio: 4600, emoji: "☃️" },
    { id: "reno", nombre: "Reno", precio: 3600, emoji: "🦌" },
    { id: "galletita", nombre: "Galletita", precio: 4000, emoji: "🍪" },
    { id: "perrito", nombre: "Perrito", precio: 3600, emoji: "🐶" },
    { id: "gatito", nombre: "Gatito", precio: 4800, emoji: "🐱" },
    { id: "jesus", nombre: "Jesús", precio: 4800, emoji: "✨" }
  ];
  const EJEMPLO_TRADICIONAL = { bandeja: 1, arbolito: 1, "papa-noel": 1, "mama-noel": 1 };
  const DESCUENTO = 0.10;
  const moneda = n => "$ " + n.toLocaleString("es-AR");
  const FOTOS = {
    arbolito: "img/combos/arbolito.webp",
    "papa-noel": "img/combos/papa-noel.webp",
    "mama-noel": "img/combos/mama-noel.webp",
    nieve: "img/combos/muneco-nieve.webp",
    reno: "img/combos/reno.webp",
    galletita: "img/combos/galletita.webp",
    perrito: "img/combos/perrito.webp",
    gatito: "img/combos/gatito.webp",
    jesus: "img/combos/jesus.webp"
  };
  const ilustracion = a => a.id === "bandeja"
    ? '<span class="combo-tray" aria-hidden="true"></span>'
    : FOTOS[a.id]
      ? '<span class="combo-figure"><span class="combo-emoji" aria-hidden="true">' + a.emoji +
        '</span><img src="' + FOTOS[a.id] + '" alt="" loading="lazy" decoding="async" onerror="this.remove()"></span>'
      : '<span aria-hidden="true">' + a.emoji + '</span>';

  function iniciar() {
    document.querySelectorAll("[data-armador-navidad]").forEach(destino => {
      const cantidades = Object.fromEntries(ARTICULOS.map(a => [a.id, EJEMPLO_TRADICIONAL[a.id] || 0]));

      destino.innerHTML = [
        '<div class="combo-builder">',
          '<div class="combo-intro">',
            '<span class="combo-eyebrow">🎄 ESPECIAL NAVIDAD · IZZY IMPRESIONES 3D</span>',
            '<h3>Una Navidad<br><em>a tu manera.</em></h3>',
            '<p>Armá tu combo como más te guste: elegí las piezas que quieras, repetí tus favoritas y agregá tantas como necesites. No hay figuras obligatorias.</p>',
            '<div class="combo-selection-head"><span>TU COMBO</span><span data-items-count>4 piezas</span></div>',
            '<div class="combo-selected" data-resumen aria-live="polite"></div>',
            '<div class="combo-preview-footer"><span>✨ Empezamos con el combo tradicional como ejemplo.</span>',
              '<button type="button" data-reiniciar>Restaurar ejemplo</button></div>',
          '</div>',
          '<div class="combo-config">',
            '<div class="combo-config-header"><span class="combo-kicker">ELEGÍ TUS PIEZAS</span><span class="combo-discount">10% OFF desde 2 piezas</span></div>',
            '<p class="combo-includes">Sumá o quitá cualquier producto. Podés elegir varias unidades del mismo diseño.</p>',
            '<div class="combo-options" role="group" aria-label="Elegí las cantidades de cada producto">',
              ...ARTICULOS.map(a =>
                '<div class="combo-choice" data-articulo="' + a.id + '">' +
                  '<span class="combo-choice-art">' + ilustracion(a) + '</span>' +
                  '<span class="combo-choice-copy"><strong>' + a.nombre + '</strong><small>' + moneda(a.precio) + ' c/u</small></span>' +
                  '<div class="combo-counter">' +
                    '<button type="button" data-operacion="restar" data-id="' + a.id + '" aria-label="Quitar una unidad de ' + a.nombre + '">−</button>' +
                    '<output data-cantidad="' + a.id + '" aria-label="Cantidad de ' + a.nombre + '">0</output>' +
                    '<button type="button" data-operacion="sumar" data-id="' + a.id + '" aria-label="Agregar una unidad de ' + a.nombre + '">+</button>' +
                  '</div>' +
                '</div>'
              ),
            '</div>',
            '<div class="combo-price-box">',
              '<div class="combo-price-top"><span>Total de tu selección</span><strong data-precio aria-live="polite"></strong></div>',
              '<div class="combo-price-bottom"><span>Por separado: <s data-original></s></span><span class="combo-saving" data-ahorro></span></div>',
              '<p class="combo-rule" data-regla></p>',
            '</div>',
            '<a class="btn wa combo-buy" data-pedir target="_blank" rel="noopener">Pedir mi combo por WhatsApp ↗</a>',
            '<p class="combo-confirm">Pedido sujeto a disponibilidad · Hecho en Corrientes Capital</p>',
          '</div>',
        '</div>'
      ].join("");

      function actualizar() {
        const elegidos = ARTICULOS.filter(a => cantidades[a.id] > 0);
        const piezas = elegidos.reduce((acc, a) => acc + cantidades[a.id], 0);
        const total = elegidos.reduce((acc, a) => acc + a.precio * cantidades[a.id], 0);
        const aplicaDescuento = piezas >= 2;
        const final = aplicaDescuento ? Math.round(total * (1 - DESCUENTO) / 100) * 100 : total;
        const ahorro = total - final;

        ARTICULOS.forEach(a => {
          destino.querySelector('[data-cantidad="' + a.id + '"]').textContent = cantidades[a.id];
          destino.querySelector('[data-articulo="' + a.id + '"]').classList.toggle("combo-active", cantidades[a.id] > 0);
          destino.querySelector('[data-operacion="restar"][data-id="' + a.id + '"]').disabled = cantidades[a.id] === 0;
        });

        destino.querySelector("[data-items-count]").textContent = piezas + (piezas === 1 ? " pieza" : " piezas");
        destino.querySelector("[data-resumen]").innerHTML = elegidos.length
          ? elegidos.map(a =>
              '<div class="combo-selected-item"><span class="combo-selected-art">' + ilustracion(a) + '</span>' +
              '<span>' + a.nombre + '</span><strong>×' + cantidades[a.id] + '</strong></div>'
            ).join("")
          : '<div class="combo-empty">Tu combo está vacío. Elegí algo de la lista para empezar. 🎁</div>';

        destino.querySelector("[data-precio]").textContent = moneda(final);
        destino.querySelector("[data-original]").textContent = moneda(total);
        destino.querySelector("[data-original]").hidden = !aplicaDescuento;
        destino.querySelector("[data-original]").previousSibling.textContent = aplicaDescuento ? "Por separado: " : "Precio: ";
        destino.querySelector("[data-ahorro]").textContent = ahorro ? "Ahorrás " + moneda(ahorro) : "";
        destino.querySelector("[data-regla]").textContent = piezas === 0
          ? "Agregá al menos una pieza para hacer un pedido."
          : piezas === 1 ? "Sumá otra pieza para activar el descuento del 10%."
          : "Descuento del 10% aplicado a tu combo.";

        const boton = destino.querySelector("[data-pedir]");
        boton.classList.toggle("combo-disabled", piezas === 0);
        boton.setAttribute("aria-disabled", piezas === 0 ? "true" : "false");
        if (piezas === 0) {
          boton.removeAttribute("href");
        } else {
          const mensaje = [
            "¡Hola! Armé mi propio combo navideño en la web de Izzy 🎄",
            "Estas son las piezas que elegí (" + piezas + " en total):",
            ...elegidos.map(a => "• " + cantidades[a.id] + " × " + a.nombre),
            "",
            "Total calculado: " + moneda(final) + " ARS" + (aplicaDescuento ? " (con 10% de descuento)." : "."),
            "¿Me confirmás disponibilidad y coordinamos el pedido?"
          ].join("\n");
          boton.href = "https://wa.me/" + IZZY.whatsapp + "?text=" + encodeURIComponent(mensaje);
        }
      }

      destino.addEventListener("click", e => {
        const boton = e.target.closest("button[data-operacion]");
        if (boton && destino.contains(boton)) {
          const id = boton.dataset.id;
          if (boton.dataset.operacion === "sumar") cantidades[id] += 1;
          else cantidades[id] = Math.max(0, cantidades[id] - 1);
          actualizar();
        }
        if (e.target.closest("[data-reiniciar]")) {
          ARTICULOS.forEach(a => { cantidades[a.id] = EJEMPLO_TRADICIONAL[a.id] || 0; });
          actualizar();
        }
      });
      destino.querySelector("[data-pedir]").addEventListener("click", e => {
        if (e.currentTarget.getAttribute("aria-disabled") === "true") e.preventDefault();
      });
      actualizar();
    });
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
