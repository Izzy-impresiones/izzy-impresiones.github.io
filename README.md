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
- `"navidad": true` lo muestra en la sección de Navidad (inicio y filtro del catálogo), con la etiqueta 🎄 Navidad. La sección y la cuenta regresiva se configuran en `IZZY.navidad` de `assets/app.js` y desaparecen solas después del 25/12.
- `"oculto": true` lo esconde de toda la página (sirve para cargarlo antes y mostrarlo cuando esté listo).
- `orden` más alto = producto más nuevo (los 6 más nuevos salen en el inicio).

Si una foto es un link de internet, GitHub la copia sola a `img/productos/` (acción "Copiar fotos al repositorio").

## Vista previa de color

`assets/recolor.js` detecta el cuerpo del producto en la foto y lo pinta del color elegido, manteniendo sombras y detalles (ojos, cachetes, etc.). Se activa por producto con `"vista_previa": true`.

Funciona bien con productos **de un solo color** sobre **fondo liso y claro**. Si una foto no cumple eso (fotos con ambiente, fondos oscuros), la página muestra la foto original sin pintar. No conviene activarlo en productos de varios colores ni en productos blancos (el cuerpo se confunde con el fondo). Para la mejor vista previa, la primera foto del producto tiene que ser la más limpia.

## Reseñas

`resenas.html` muestra todas las reseñas (1 a 5 estrellas + comentario) y tiene el formulario para dejar una. En el inicio aparece el promedio y las 3 últimas. Las reseñas se guardan en un **Formulario de Google** y se leen de su **planilla de respuestas**.

Para conectarlo se completan los datos de `RESENAS` al principio de `assets/resenas.js` (link del formulario, los códigos `entry.…` de las 3 preguntas y el link de la planilla) y se pone `resenas: true` en `assets/app.js` para mostrar el link en el menú.

Para borrar una reseña (spam, insultos), se borra su fila en la planilla.

## Cambios que no se ven en el celu

Los archivos `assets/*.js` y `assets/*.css` se cargan con `?v=fecha` en los `.html`. Cuando se cambian, hay que actualizar ese número para que los celulares no sigan usando la versión vieja guardada.
