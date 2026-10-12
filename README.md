# Izzy Impresiones 3D

Página web de Izzy Impresiones 3D (Corrientes Capital), publicada gratis con GitHub Pages en https://izzy-impresiones.github.io

## Cómo está armada

- `index.html`: inicio (Día de la Madre, últimos productos, personalizados, colores, cómo comprar).
- `catalogo.html`: catálogo con filtros y buscador.
- `producto.html?p=slug`: ficha de cada producto.
- `data/productos.json`: **todos los productos** (nombre, precio, categoría, colores, fotos, descripción).
- `assets/app.js`: datos del negocio (WhatsApp, Instagram, fechas del Día de la Madre) y la lógica.
- `assets/styles.css`: el diseño.

## Cargar o cambiar un producto

Se edita `data/productos.json`. Cada producto tiene:

```json
{
  "slug": "nombre-en-minusculas-con-guiones",
  "nombre": "Nombre visible",
  "categoria": "Hogar | Organización | Decoración | Llaveros | Lámparas | Regalos | Figuras | Personalizados | Otros",
  "precio": 12000,
  "colores": "*",
  "imagenes": ["img/productos/foto.jpg"],
  "descripcion": "Texto. Las líneas que empiezan con * se muestran como lista.",
  "dia_de_la_madre": false,
  "orden": 44
}
```

- `"precio": null` muestra "Consultar precio".
- `"colores": "*"` = todos los colores; o una lista, por ejemplo `["Blanco", "Negro"]`.
- `"vista_previa": true` activa la vista previa de color: al tocar un color, la foto se pinta de ese color (ver abajo).
- `orden` más alto = producto más nuevo (los 6 más nuevos salen en el inicio).

Si una foto es un link de internet, GitHub la copia sola a `img/productos/` (acción "Copiar fotos al repositorio").

## Vista previa de color

`assets/recolor.js` detecta el cuerpo del producto en la foto y lo pinta del color elegido, manteniendo sombras y detalles (ojos, cachetes, etc.). Se activa por producto con `"vista_previa": true`.

Funciona bien con productos **de un solo color** sobre **fondo liso y claro**. Si una foto no cumple eso (fotos con ambiente, fondos oscuros), la página muestra la foto original sin pintar. No conviene activarlo en productos de varios colores ni en productos blancos (el cuerpo se confunde con el fondo). Para la mejor vista previa, la primera foto del producto tiene que ser la más limpia.
