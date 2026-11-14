# Guía del proyecto · Portafolio de Federico Castro

> Si trabajas con Claude en un chat nuevo, adjunta este archivo (y los que quieras cambiar)
> y dile qué quieres hacer. Aquí está todo lo necesario para entender el proyecto.

## Qué es

Repositorio: `efecastro.github.io` → publicado en https://efecastro.github.io
(la carpeta `sitio-web` es una copia vieja; se trabaja en la carpeta del repositorio).

Portafolio personal estático (HTML + CSS + JavaScript puro, sin frameworks ni instalaciones),
publicado gratis en GitHub Pages. Se edita en VS Code y se previsualiza con la extensión **Live Server**.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `js/data.js` | **Contenido**: skills, videos de YouTube, videos propios, reels, video destacado, flyers, logos y caso de marca. Lo que más se edita. |
| `index.html` | Estructura y textos fijos: hero, sobre mí, educación, contacto. Las demás secciones son "contenedores" vacíos que llena `main.js`. |
| `js/main.js` | Dibuja el contenido de `data.js` y le da vida. Dividido en bloques numerados (0 a 8). |
| `css/styles.css` | Estilos. Colores y fuentes en `:root` al principio. Un bloque comentado por sección. |
| `assets/` | Imágenes y videos optimizados (`img`, `video`, `flyers`, `logos`). |

## Orden de las secciones

1. Hero (`#inicio`)
2. Sobre mí (`#sobre-mi`)
3. Skills (`#skills`): creativas + programación, con estrellas
4. Educación (`#educacion`)
5. Videos (`#videos`): YouTube con vista previa al pasar el cursor, "Color grading y motion design" (videos propios), Reels verticales y video destacado de fondo blanco. Todos tienen botón de sonido con barrita de volumen (se recuerda entre visitas) y barra de tiempo para adelantar / retroceder. En celular los reproductores de YouTube se preparan antes de tocarlos para que arranquen con un solo toque.
6. Flyers (`#diseno`): animado grande (con sonido y barra de tiempo), comparador antes/después, galería y miniaturas para YouTube
7. Branding (`#branding`): caso Los Perritos del Piti + logos
8. Servicios (`#servicios`): tarjetas con botón "Cotizar" que abre WhatsApp con un mensaje ya escrito
9. Contacto (`#contacto`) + botón flotante de WhatsApp

## Cómo agregar cosas

**Un video de YouTube:** en `data.js` → `youtube`, copia una línea y cambia el `id` (lo que va después de `watch?v=`).
Al hacer clic se abre el reproductor normal de YouTube (con sonido y botón "Omitir" en los anuncios).
En celular se muestra el reproductor de YouTube directamente.
Opcional: `preview: "assets/previews/archivo.mp4"` = clip corto propio (10–15 s, sin audio importante)
que se reproduce al pasar el cursor, sin anuncios. Sin preview, la miniatura solo se anima.

**Vistas del video destacado:** `data.js` → `featured.views` (ej. `"25 K"`). Vacío = no se muestra.

**Un flyer normal:** guarda la imagen en `assets/flyers/` y agrega en `flyers.gallery`:
`{ title: "Nombre", src: "assets/flyers/archivo.webp" }`

**Un flyer antes/después:** agrega en `flyers.compare`:
`{ title: "Nombre", before: "assets/flyers/foto-original.webp", after: "assets/flyers/flyer-final.webp" }`

**Un logo:** agrega en `logos`. Si pones varias imágenes en `images`, salen lado a lado:
`{ name: "Marca", caption: "Variaciones", bg: "#0d0c0f", images: ["assets/logos/a.webp", "assets/logos/b.webp"] }`

**Una skill:** agrega en `skills.creative` o `skills.code`:
`{ name: "DaVinci Resolve", badge: "Dr", color: "#ff6b6b", bg: "#2a0a0a", level: 4, note: "Color" }`

**Una miniatura de YouTube:** guarda la imagen (1280×720) en `assets/thumbs/` y agrega en `thumbnails`:
`{ title: "Nombre del video", src: "assets/thumbs/archivo.webp" }`

**Un servicio:** en `data.js` → `services`:
`{ title: "Nombre", msg: "lo que va en el mensaje de WhatsApp", text: "Descripción corta" }`

**Cuántos videos de YouTube se ven al inicio:** en `main.js`, `VISIBLE_VIDEOS = 4`. El resto sale con "Ver más videos".

**Un estudio:** en `index.html`, sección Educación, copia un `<li class="reveal">…</li>` completo.

**Un video propio horizontal (sección "Color grading y motion design"):** guarda el .mp4 y una imagen
de portada en `assets/video/` y agrega en `localVideos`:
`{ title: "Nombre", text: "Descripción corta", tag: "Color grading", src: "assets/video/mi-video.mp4", poster: "assets/video/mi-video.jpg" }`

**Un reel vertical (TikTok / Instagram):** lo mismo, pero en `reels`. Se muestra en formato 9:16.

## Recomendaciones para imágenes y videos

- Imágenes en **.webp**, máximo ~1000 px de ancho (flyers 720×1280).
- Videos en **.mp4 (H.264)**, 1280 px de ancho, idealmente menos de 15 MB.
  GitHub no acepta archivos de más de 100 MB.
- Videos largos: mejor subirlos a YouTube y agregarlos por `id`.

## Estilo visual

- Fondo negro `#070609`, morado de los clips de Premiere `#b43cf0`, rojo neón `#ff3355`, azul del cabezal `#3a9cff`.
- Títulos: **Anton** (condensada, mayúsculas). Texto: **Archivo**. Detalles técnicos: **IBM Plex Mono**.
- Las etiquetas tipo "V1", "A1" imitan las pistas de video y audio de la línea de tiempo.
- Efectos sutiles: grano de película, destello en el título, cabezal azul que cruza el hero,
  aparición suave al hacer scroll. Se desactivan si el sistema pide "reducir movimiento".

## Pendientes / ideas

- [ ] Nuevo video de **color grading** (antes/después) para la sección "Color grading y motion design".
- [ ] Número de vistas del video de fondo blanco.
- [ ] Showreel de 30–60 s al inicio.
- [ ] CV en PDF descargable, servicios/precios, testimonios de clientes.
