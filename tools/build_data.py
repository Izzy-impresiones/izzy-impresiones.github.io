# Genera data/productos.json a partir de los datos copiados de la web anterior.
import json, os

S = "https://fdubagtethyxdsuvteoj.supabase.co/storage/v1/object/public/product-images/"
C = "https://izzy-impresiones-3d.robertito20003000400.chatgpt.site/catalog/"

def url(u):
    return S + u[2:] if u.startswith("S:") else C + u[2:]

# slug | nombre | categoria | precio | colores ("*" = todos) | imagenes
rows = [
 ["lampara-wave","Lámpara Wave","Lámparas",27000,"*",["S:17fba3a6-d67b-47c3-8674-89b3fb9a6bec/4a798140-dc15-4fe7-a82c-fc49bffb66e4.png","S:17fba3a6-d67b-47c3-8674-89b3fb9a6bec/0cd5731f-39f6-489e-803d-2418e1bb96c8.png","S:17fba3a6-d67b-47c3-8674-89b3fb9a6bec/00e5d0f6-e1f9-4d95-96fe-e199729e7191.png"]],
 ["porta-rollo-de-cocina","Porta rollo de cocina","Hogar",12000,"*",["S:a8ee832a-484b-4183-8806-1bf4bd04fd17/1e5edd81-47f3-4d5f-b56a-bd0b87cae515.jpg","S:a8ee832a-484b-4183-8806-1bf4bd04fd17/d246b318-15e3-4443-8500-8588b59c067d.jpg"]],
 ["lampara-minimalista","Lámpara minimalista","Lámparas",22000,"*",["S:0e9b7a10-d2a1-45c8-b512-3d42e1c00fe2/26873692-2728-4e79-88ba-959d4e3adc6c.png","S:0e9b7a10-d2a1-45c8-b512-3d42e1c00fe2/880479fe-5e09-4cd1-9b96-50ecb122523d.jpg","S:0e9b7a10-d2a1-45c8-b512-3d42e1c00fe2/a36d0d66-d523-402e-a080-d9cae918024d.jpg"]],
 ["posavaso-maceta","Posavaso Maceta","Decoración",25000,"*",["C:a1fd1859-84d1-41e5-9847-03ee857bdab2/050542b5-6dde-443e-a631-370cea8a1017.png","S:a1fd1859-84d1-41e5-9847-03ee857bdab2/1304ebd6-c697-4f36-b2c0-20ae4259ed0e.png","S:a1fd1859-84d1-41e5-9847-03ee857bdab2/1de595ff-d070-4485-aaad-0b7383a6b593.png"]],
 ["porta-sahumerio-zen","Porta Sahumerio Zen","Decoración",10000,"*",["C:17ab2555-47d0-4f1c-b32b-5c8ee402d049/8debd6aa-a972-4f20-acbd-17d25d5612a5.png","S:17ab2555-47d0-4f1c-b32b-5c8ee402d049/71a5d3a8-6869-45e8-8859-432514dff6ad.jpg"]],
 ["velador-little-man","Velador Little man","Lámparas",30000,"*",["S:f1de9da8-2c01-4302-8d75-fda23fc99a26/6efceac8-72ca-41f9-8365-0d634e972d6a.png","S:f1de9da8-2c01-4302-8d75-fda23fc99a26/2b396c09-6e4d-4762-9fd0-3805f3cf409a.jpg","S:f1de9da8-2c01-4302-8d75-fda23fc99a26/9d306590-e05c-4c47-8c20-8aee551a4938.jpg"]],
 ["calculadora-manual","Tabla de multiplicar manual","Otros",10000,"*",["C:1f704dc8-7c2c-4ed6-a05b-877cfc3cc325/318245a2-97bc-441f-a310-60ec8dd2eb3e.png"]],
 ["caja-de-cartas-pokemon","Caja de cartas Pokemon","Organización",17000,"Rojo|Morado|Negro",["S:30fb8f15-feed-4607-8ae7-b6b2dd15e9b3/4f2b13af-9605-4b4a-b16c-7187ad8acc39.png"]],
 ["posavaso-llanta-de-auto","Posavaso Llanta de auto","Decoración",6000,"*",["S:254ea434-4b86-43ab-bf2e-26e1251f0e48/701e9b69-1a74-42c6-911c-b3da2a3e7f5d.png"]],
 ["tabla-para-picadas","Tabla para Picadas","Otros",40000,"Amarillo|Blanco|Celeste",["C:07c822cd-f322-4c45-9b97-d9c73615934b/4e66f7cf-6659-4ddb-b61a-bd6494705ef9.png","S:07c822cd-f322-4c45-9b97-d9c73615934b/79e0faf1-c280-49cf-9573-40e3d2e52ab0.jpg","S:07c822cd-f322-4c45-9b97-d9c73615934b/412ac216-0491-487c-af71-ad8b419f33d8.jpg"]],
 ["sonajero-de-llaves","Sonajero de llaves","Otros",5000,"*",["C:ced9461d-cebd-4191-ab09-a9f50d40c163/8b1c0023-98c0-4caf-98cb-861d57e69cf9.webp"]],
 ["lapicero-mochila","Lapicero Mochila","Organización",10000,"*",["C:5df5c8b8-01de-4725-9eaf-a06f42a04ae2/69df5620-9488-4f3e-80ea-f6f5c750c19c.webp"]],
 ["llavero-corazon-geometrico","Llavero Corazón geométrico","Llaveros",3500,"*",["C:662cbc63-0433-4c25-b687-0193188c8a1e/9c0d2aa0-322f-4b7a-824c-936d02e7a718.webp"]],
 ["vincha-argentina","Vincha Argentina","Otros",3000,"Marrón|Oro|Nova|Amarillo|Rosa claro|Rosa chicle|Blanco|Celeste",["C:6bf96854-2b98-4a67-a99e-666356017bc3/c0d7f0e2-82f0-4837-bfba-1e4a0ff084cb.webp"]],
 ["pantera-rosa-pensativa-22-cm","Pantera Rosa Pensativa · 22 cm","Figuras",21000,"Rosa chicle",["C:d7529023-abfc-409b-ba83-c8c99eea087a/9c5f78d6-58ea-493f-bc4c-8be24be5eed3.webp"]],
 ["pantera-rosa-saludo-19-cm","Pantera Rosa Saludo · 19 cm","Figuras",19000,"Rosa chicle",["C:13edc5ed-c827-4e0b-95ca-eab76e8008df/bbf99968-df9f-49a2-8bb5-5bfeeed901a6.webp"]],
 ["llavero-abrebotellas-2-en-1","Llavero Abrebotellas 2 en 1","Llaveros",3000,"*",["C:57cd44e6-8e9e-4357-847a-b4ee810cee4d/c041616f-d4bf-4774-a8be-059d28abcd2e.webp"]],
 ["expositor-de-perfumes","Expositor de perfumes","Organización",27000,"Marrón|Blanco|Negro|Gris plomo",["C:bab49889-a822-44e7-a7ec-0d92de8703b3/12bf29ff-ea6b-4c1a-9626-4d8aca5fd671.webp"]],
 ["organizador-de-controles","Organizador de controles","Organización",11000,"Marrón|Blanco|Negro|Gris plomo",["C:2681e799-21cf-4e90-9d87-73c16e0c42f6/a287f5e1-0fae-4e93-8e30-ce8e26f23d0e.webp"]],
 ["portallaves-de-pared","Portallaves de pared","Organización",8000,"Verde|Azul|Marrón|Oro|Esmeralda|Blanco|Negro|Gris plomo|Naranja",["C:e1de83a7-02bf-434e-be81-937400a15c51/991bdb6d-69e2-4ac6-ba05-2529dfb15d28.webp"]],
 ["soporte-para-escobas","Soporte para escobas","Hogar",3000,"Marrón|Blanco|Negro|Gris plomo",["C:0c65f5e8-44c0-485e-9827-64888f54d08f/b59410a3-d399-400f-ae66-72034d5fabea.webp"]],
 ["expositor-de-relojes","Expositor de relojes","Organización",3000,"Marrón|Blanco|Negro|Gris plomo",["C:570f357c-9268-4abf-8dc7-539b8da8b251/c687c42f-475b-412a-b35e-40b534c5a29b.webp"]],
 ["apoyataza-patita-de-gato","Apoyataza Patita de gato","Hogar",11000,"Marrón|Rosa claro|Blanco|Negro|Gris plomo|Naranja|Piel",["C:591c6d9d-3994-4ed4-a700-227022813bf8/6d435b30-29bd-4816-bee9-3b6bc69af6e3.webp"]],
 ["llaveros-de-frutas","Llaveros de frutas","Llaveros",3000,"",["C:3324508d-a87d-49b9-877f-5272de8be132/9d17d307-0174-436b-b340-1b2e2d0021a6.webp"]],
 ["buda-porta-sahumerio","Buda porta sahumerio","Decoración",8000,"Gris plomo",["C:939ea030-09b3-4c29-b436-51589f5d874d/9829cb21-6e0d-47d8-8a78-935d24ecc36f.webp"]],
 ["caja-regalo-margarita","Caja regalo Margarita","Regalos",None,"",["C:0324e937-8c84-4a0f-bd04-6bc129ec7faf/1fd2220b-0ce5-4d49-91ed-3b95b37bd8ba.webp"]],
 ["caja-para-figuritas-mundial","Caja para figuritas Mundial","Organización",12000,"Oro|Blanco|Negro",["C:e8b0abab-1409-404f-86bb-88ad43deaad6/bbb0d110-599e-48bc-8af4-256703e9af43.webp"]],
 ["porta-labial-flores","Porta labial Flores","Llaveros",4000,"Verde|Azul|Marrón|Magenta flúor|Rojo|Amarillo|Morado|Esmeralda|Rosa claro|Rosa chicle|Blanco|Negro|Celeste|Gris plomo|Naranja",["C:d66d25af-f317-463f-8ae9-e64da146ce6b/3076fd3d-86e1-4ff4-b71a-faca09612628.webp"]],
 ["lampara-espiral-mediana","Lámpara Espiral mediana","Lámparas",19000,"Blanco",["C:44f43dc3-6224-4e2a-adb7-e830c1c642fe/678785d2-d78e-4657-b9a5-d37f3439a308.webp"]],
 ["porsche-911-gt3-rs-1-24","Porsche 911 GT3 RS · 1:24","Figuras",25000,"",["C:33dedfd4-a4fa-4953-a592-08ec99281b75/08f4cc8d-0137-4464-9749-703a16e562bb.webp"]],
 ["organizador-de-maquillaje-hexagonal","Organizador de maquillaje Hexagonal","Organización",11000,"Rosa chicle",["C:61cd3d03-40c8-44f3-9726-edf49e3e3359/d791ce15-c135-4b76-8c0a-751c26a389d2.webp"]],
 ["snoopy-decorativo","Snoopy decorativo","Figuras",13500,"",["C:e0d0e61a-83c5-4934-936e-8d118ea958f7/39d55034-93ee-4f95-93c2-bcf723e8c079.webp"]],
 ["dispenser-de-te","Dispenser de té","Hogar",15000,"Gris plomo",["C:f094a2b5-7301-4c75-8d68-f5d7f86997a4/d8e71bce-1ec0-49bc-a15f-3980838384ba.webp"]],
 ["soporte-para-auriculares","Soporte para auriculares","Organización",11500,"Verde|Azul|Marrón|Oro|Magenta flúor|Rojo|Amarillo|Morado|Esmeralda|Rosa claro|Rosa chicle|Blanco|Negro|Celeste|Gris plomo|Naranja",["C:13e97cdf-f7c6-4a5d-b8ee-95335f8543fb/5efcc0b8-6b19-4fd7-b2c8-ea221043b159.webp"]],
 ["sujeta-saquitos-flamenco","Sujeta saquitos Flamenco","Hogar",2000,"Rosa chicle",["C:3c17d38f-ed40-468a-9c13-8767f53c002e/e4edd155-c715-46a4-8e8e-8c731d9c346f.webp"]],
 ["llaveros-de-marcas-de-autos","Llaveros de marcas de autos","Llaveros",3000,"",["C:35ad8b3b-8bd7-4df2-b03a-31e7493f740d/932682fb-f5c5-44e8-97cb-5ff7c138d6a9.webp"]],
 ["secador-de-mate-y-bombilla","Secador de mate y bombilla","Hogar",6500,"*",["C:7ce9fd1e-6c49-4aa4-aa4c-9749a3f9c45e/011348e6-d85f-4cd1-a00e-4a2eca03f7d1.png"]],
 ["stand-qr-personalizable","Stand QR personalizable","Personalizados",None,"*",["C:2c80f894-1946-4166-8341-e69fefd28394/e8133cf1-c6aa-444a-a0e5-f746a1b277f2.png"]],
 ["juego-de-ordenar-colores","Juego de ordenar colores","Regalos",10000,"*",["C:114743ff-fcb3-4c02-afed-a0dacf56fd30/f2db5fe9-f7f3-4000-8579-01c1fe9bbef7.png"]],
 ["despolvillador-de-yerba","Despolvillador de yerba","Hogar",19000,"*",["C:5d31dad0-62fa-4a4b-9766-41107241e198/03feb9f2-846a-4d39-b50b-47e91f4ccd1d.png"]],
 ["sujeta-saquitos-de-te-gato","Sujeta saquitos de té Gato","Hogar",2000,"*",["C:8d22963e-1c25-4cc1-bb02-d88138b0e29e/1d31e207-cad5-41a7-8a15-11b22188a69f.png"]],
 ["maceta-con-carita-pies-y-manos","Maceta con carita, pies y manos","Decoración",10000,"*",["C:815b9ec1-463b-4d9c-93bb-121c770aa678/c3c05f16-0a3d-46d6-8831-c3b468b0670a.png"]],
 ["escurridor-de-esponjas","Escurridor de esponjas","Organización",15000,"*",["C:f28febd7-5c2e-44f7-ad76-ab5717ba2750/ea250a55-13ee-4bbe-bc0b-490d023271b6.png"]],
]

desc = {
"lampara-wave": "Una lámpara decorativa de diseño moderno, caracterizada por su campana de formas onduladas que genera un atractivo juego de luces y sombras al encenderse.\n\nSu estilo minimalista permite combinarla fácilmente con distintos ambientes, siendo ideal para mesas de luz, escritorios, dormitorios, livings o setups.\n\nMedidas\n\n* Base: 118 × 118 × 42 mm (11,8 × 11,8 × 4,2 cm)\n* Campana: 118 × 118 × 201 mm (11,8 × 11,8 × 20,1 cm)\n* Altura total aproximada: 24,3 cm\n* Ancho y profundidad: 11,8 × 11,8 cm\n\nPersonalización\n\n🎨 Base: podés elegir el color entre las opciones disponibles.\n🤍 Campana: disponible únicamente en blanco.\n\nLa campana se mantiene en color blanco porque permite un mejor paso y difusión de la luz. Utilizar colores más oscuros o intensos reduciría considerablemente la iluminación y modificaría el efecto visual del diseño.\n\nCaracterísticas\n\n* Iluminación ambiental y decorativa.\n* Diseño ondulado moderno.\n* Base personalizable.\n* Campana blanca para una mejor difusión de la luz.\n* Ideal para dormitorio, escritorio, living, mesa de luz o setup.",
"porta-rollo-de-cocina": "Portarrollos de cocina de diseño moderno y decorativo, ideal para mantener el rollo siempre organizado y al alcance de la mano.\n\nSu base circular con borde texturado ayuda a mantener el rollo en su lugar, mientras que el soporte central permite colocarlo y retirarlo fácilmente. Su diseño combina funcionalidad y decoración, adaptándose perfectamente a diferentes estilos de cocina.\n\nMedidas:\n📐 141 × 141 × 242 mm\n📐 14,1 × 14,1 × 24,2 cm\n\nCaracterísticas:\n\n* Compatible con rollos de cocina convencionales.\n* Base amplia y estable.\n* Cambio de rollo rápido y sencillo.\n* Diseño moderno y decorativo.\n* 🎨 Color personalizable según disponibilidad.\n* Ideal para cocina, comedor o quincho.",
"lampara-minimalista": "Dale un toque moderno y acogedor a cualquier espacio con esta lámpara de diseño minimalista. Su estructura curva y su pantalla impresa en 3D crean una iluminación cálida y agradable, ideal para mesas de luz, escritorios, livings u oficinas.\n\nSu diseño compacto combina decoración y funcionalidad, convirtiéndola en una excelente opción para quienes buscan algo diferente y moderno.\n\n✨ Características\n\n* Diseño moderno y minimalista.\n* Fabricada mediante impresión 3D.\n* Luz cálida y acogedora.\n* Ideal para dormitorio, escritorio, living u oficina.\n* Disponible en diferentes combinaciones de colores.\n* Fabricada a pedido.",
"posavaso-maceta": "Maceta decorativa con hojas desmontables que se usan como posavasos. Cuando terminás, las volvés a colocar en sus tallos.",
"porta-sahumerio-zen": "Porta sahumerio vertical con bandeja para recoger las cenizas. La varilla se sostiene desde la parte superior.",
"velador-little-man": "Una lámpara que no solo ilumina, sino que también le da personalidad a tu espacio. Su original diseño representa una pequeña personita sentada sosteniendo su propia pantalla, creando una pieza decorativa diferente y llamativa.\n\nAl encenderse, la luz se proyecta suavemente desde el interior de la pantalla, generando una iluminación cálida y acogedora, perfecta para acompañar tus noches o darle un toque especial a cualquier rincón.\n\nCaracterísticas:\n\n* 💡 Iluminación cálida y agradable.\n* 🧍 Diseño original en forma de personita.\n* 🏠 Ideal para mesa de luz, dormitorio, escritorio o living.\n* ✨ Funciona como lámpara y elemento decorativo.\n* 🎨 Disponible en diferentes colores.\n* 🎁 Una excelente opción para regalar.\n\nMás que un velador: una pequeña personita que ilumina y transforma tu espacio.",
"calculadora-manual": "Tabla de multiplicar con piezas deslizables para elegir los números y encontrar el resultado. Para practicar sin pantallas.",
"caja-de-cartas-pokemon": "¡Protegé y organizá tu colección con estilo! 🎴✨ Esta caja cuenta con un diseño inspirado en Gengar y cierres seguros para mantener tus cartas protegidas y ordenadas.\n\n📏 Medidas: 17 × 17 cm\n🃏 Capacidad: hasta 240 cartas\n🔒 Cierre seguro y resistente\n🎨 Diseño único impreso en 3D\n\nIdeal para coleccionistas, jugadores o como regalo para cualquier fan de Pokémon. 💜",
"posavaso-llanta-de-auto": "Dale un toque automotor a tu mesa con este posavasos inspirado en una llanta deportiva. Su diseño detallado combina la cubierta negra con la llanta en el color que elijas.\n\nIdeal para vasos, tazas, mates y latas, protegiendo la superficie de manchas y humedad.\n\n🎨 Disponible en varios colores\n🏁 Diseño estilo rueda deportiva\n🏠 Ideal para casa, oficina o setup gamer\n🎁 ¡También es una excelente opción para regalar a fanáticos de los autos!",
"tabla-para-picadas": "Tabla con la silueta de Argentina de 45 × 17 cm. Incluye tres bowls en forma de estrella para acompañar la picada.",
"sonajero-de-llaves": "Sonajero con aro y cuatro llaves de colores, realizado mediante impresión 3D. Un diseño sencillo y colorido.",
"lapicero-mochila": "Organizá tus lápices y lapiceras con este original lapicero con forma de mochila. Sus detalles de bolsillos y cierres le dan un toque divertido a tu escritorio.",
"llavero-corazon-geometrico": "Un corazón con trama geométrica para acompañar tus llaves o decorar tu mochila. Incluye argolla metálica y es un lindo detalle para regalar.",
"vincha-argentina": "Llevá los colores argentinos con esta vincha con letras, sol y estrellas. Un accesorio para acompañar festejos y alentar a la Selección.",
"pantera-rosa-pensativa-22-cm": "La Pantera Rosa en su pose pensativa, sobre una base circular. Una figura decorativa con mucho carácter para tu repisa o escritorio. Altura aproximada: 22 cm.",
"pantera-rosa-saludo-19-cm": "La Pantera Rosa con una mano levantada y su inconfundible expresión, sobre una base circular. Un detalle para decorar o regalar a fans del personaje. Altura aproximada: 19 cm.",
"llavero-abrebotellas-2-en-1": "Un accesorio práctico para llevar con tus llaves: ayuda a abrir botellas y levantar las anillas de las latas. Diseño compacto con argolla metálica.",
"expositor-de-perfumes": "Organizá y exhibí tus perfumes en este expositor escalonado de tres niveles. Su diseño permite tener los frascos a la vista y darle orden a tu espacio. Perfumes no incluidos.",
"organizador-de-controles": "Tené tus controles remotos ordenados y siempre a mano con este organizador de líneas simples. También disponible con 2 o 4 espacios.",
"portallaves-de-pared": "Un lugar para dejar tus llaves apenas llegás a casa. Este portallaves de pared cuenta con cuatro ganchos y un diseño discreto para mantenerlas organizadas. Llaves y llaveros no incluidos.",
"soporte-para-escobas": "Organizá tu espacio de limpieza con este soporte de pared para escobas y escurridores. Sujeta el mango para mantenerlos colgados y a mano. Elementos de limpieza no incluidos.",
"expositor-de-relojes": "Dale un lugar a tu reloj con este expositor de diseño inclinado. Ideal para exhibirlo y tenerlo a mano sobre una cómoda, repisa o escritorio. Reloj no incluido.",
"apoyataza-patita-de-gato": "Un detalle para acompañar tu café o té: apoyataza con forma de patita de gato y almohadillas rosadas. Disponible con base blanca o negra. Taza no incluida.",
"llaveros-de-frutas": "Frutitas con patitas para darle un toque divertido a tus llaves o mochila. La foto muestra los modelos de durazno y cerezas, con argolla metálica. Consultanos por los otros modelos disponibles.",
"buda-porta-sahumerio": "Un Buda sonriente que sostiene el sahumerio en su mano y suma un detalle decorativo a tu espacio. Realizado mediante impresión 3D. Sahumerio no incluido.",
"caja-regalo-margarita": "Una margarita para regalar en una caja con ventana y detalles de corazones. La flor y su estuche están realizados mediante impresión 3D: un detalle para sorprender a alguien especial.",
"caja-para-figuritas-mundial": "Guardá tus figuritas en una caja con diseño futbolero, detalles dorados y la copa en relieve. Su interior permite mantenerlas juntas y a mano para seguir completando tu colección. Figuritas no incluidas.",
"porta-labial-flores": "Llevá tu labial a mano en este estuche con flores en relieve, tapa y argolla para colgar. Un accesorio para sumar a tus llaves o bolso. Labial no incluido.",
"lampara-espiral-mediana": "Sumá una luz cálida a tu mesa de luz o rincón favorito con esta lámpara mediana. Su pantalla de líneas en espiral crea un efecto decorativo al encenderla, sobre una base circular de diseño simple.",
"porsche-911-gt3-rs-1-24": "El Porsche 911 GT3 RS en una versión decorativa a escala 1:24, realizada mediante impresión 3D. Carrocería blanca, detalles negros, llantas rojas y su característico alerón: ideal para exhibir o regalar a un fan de los autos.",
"organizador-de-maquillaje-hexagonal": "Ordená tus brochas, labiales y accesorios en un solo lugar. Sus cinco compartimentos hexagonales de distintas alturas y la bandeja frontal dividida ayudan a tener todo a mano sobre tu tocador.",
"snoopy-decorativo": "Snoopy sentado, con su sonrisa y collar rojo, para darle un toque de ternura a tu escritorio o repisa. Una figura realizada mediante impresión 3D, ideal para decorar o regalar a un fan del personaje.",
"dispenser-de-te": "Organizá tus sobres de té y tenelos a mano para cada pausa. Este dispenser tiene una abertura inferior para retirarlos y un frente donde podés identificar la variedad. Té no incluido.",
"soporte-para-auriculares": "Dale un lugar a tus auriculares y mantené el escritorio despejado. Su diseño vertical con base rectangular permite dejarlos colgados y a mano entre usos. Auriculares no incluidos.",
"sujeta-saquitos-flamenco": "Un pequeño flamenco para acompañar tu momento de té. Este accesorio sujeta el hilo del saquito y suma un detalle divertido a tu taza. Realizado mediante impresión 3D.",
"llaveros-de-marcas-de-autos": "Llevá tu marca de auto favorita en las llaves, con diseños en blanco y negro y argolla metálica. Disponibles en Nissan, Ford, Honda, Peugeot, Renault y Volkswagen. Consultanos por la marca que buscás.",
"secador-de-mate-y-bombilla": "Dejá secar tu mate y tu bombilla en un solo lugar. Base con apoyo elevado y soporte lateral para mantener todo ordenado. Mate y bombilla no incluidos.",
"stand-qr-personalizable": "Tus redes y tu alias a mano en el mostrador. Stand con códigos QR para Instagram y WhatsApp, personalizable con el nombre y los datos de tu emprendimiento.",
"juego-de-ordenar-colores": "Deslizá las fichas y reuní cada color en su fila. Un juego de ingenio para resolver, mezclar y volver a empezar.",
"despolvillador-de-yerba": "Separá el exceso de polvo de la yerba antes de preparar tu mate. Diseño con filtro perforado, recipiente y tapa a rosca.",
"sujeta-saquitos-de-te-gato": "Un gatito para acompañar tu momento de té. Se apoya en el borde de la taza y sujeta el hilo del saquito con su cola. Taza y té no incluidos.",
"maceta-con-carita-pies-y-manos": "Una maceta con sonrisa, manitos y pies para darle un toque divertido a tus plantas y decorar tu espacio.",
"escurridor-de-esponjas": "Mantené tus esponjas ordenadas junto a la bacha. Sus compartimentos, base acanalada y salida frontal ayudan a escurrir el agua.",
}

# Productos que aparecen también en "Día de la Madre" (se cambia fácil acá).
dia_madre = {"caja-regalo-margarita","porta-labial-flores","organizador-de-maquillaje-hexagonal",
             "porta-sahumerio-zen","posavaso-maceta","lampara-minimalista"}

productos = []
n = len(rows)
for i, (slug, nombre, cat, precio, colores, imgs) in enumerate(rows):
    assert slug in desc, slug
    productos.append({
        "slug": slug,
        "nombre": nombre,
        "categoria": cat,
        "precio": precio,
        "colores": colores if colores == "*" else [c for c in colores.split("|") if c],
        "imagenes": [url(u) for u in imgs],
        "descripcion": desc[slug],
        "dia_de_la_madre": slug in dia_madre,
        # número de carga: el más alto es el más nuevo (los últimos de la lista)
        "orden": i + 1,
    })

out = os.path.join(os.path.dirname(__file__), "..", "data", "productos.json")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w", encoding="utf-8") as f:
    json.dump(productos, f, ensure_ascii=False, indent=2)
print(len(productos), "productos")
