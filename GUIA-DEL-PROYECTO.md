# Guía del proyecto · Portafolio de Federico Castro

> En un chat nuevo con Claude, adjunta este archivo (y los que quieras cambiar) y di qué quieres hacer.

Repositorio: `efecastro.github.io` → https://efecastro.github.io
Se edita en VS Code (extensión Live Server para verlo) y se publica con GitHub Desktop (Commit + Push).
La carpeta `sitio-web` es una copia vieja: se trabaja en la carpeta del repositorio.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `js/data.js` | **Todo el contenido**: skills, video destacado, clientes y sus videos, flyers, miniaturas, logos, caso de marca y servicios. |
| `index.html` | Estructura y textos fijos: portada, sobre mí, educación, contacto. |
| `js/main.js` | Dibuja el contenido de `data.js` y le da vida. Bloques numerados 0 a 8. |
| `css/styles.css` | Estilos. Colores y fuentes en `:root` al principio. |
| `assets/` | Imágenes y videos optimizados (`img`, `video`, `flyers`, `logos`, `thumbs`). |

## Orden de la página

1. Portada (nombre grande, timecode)
2. Sobre mí: bio y foto
3. Trabajos: video destacado (fondo blanco) → destacados lado a lado (color grading y motion, en `highlights`)
   → Reels y TikToks (en `reels`)
   → clientes desplegables (Andresitow primero y abierto, El Muñetones, Ñero Entertainment, c.kickssVlog, Pelicanger, say_guz,
   LaJotadera, Karen Giraldo). Foto de perfil con `avatar` (imágenes en `assets/avatars/`, 200×200).
4. Diseño: carrusel de flyers + miniaturas de YouTube
5. Logos & branding: tarjetas por marca + caso Los Perritos del Piti
6. Habilidades: skills con estrellas, educación, idiomas
7. Servicios con botón "Cotizar" por WhatsApp
8. Contacto + botón flotante de WhatsApp

**Al publicar cambios grandes:** en `index.html` sube el número `?v=...` de `styles.css`, `data.js` y `main.js`
(ej. `?v=20261113j` → `?v=20261120`). Así los navegadores no mezclan archivos viejos con nuevos.
Si aun así ves algo raro, recarga con Cmd + Shift + R.

## Cómo agregar cosas (todo en `js/data.js`)

**Un video de YouTube a un cliente:** dentro de `videos` del cliente: `{ yt: "ID", title: "Título" }`
(ID = lo que va después de `watch?v=`). Clic = reproductor de YouTube con sonido ("Omitir" en anuncios).
Opcional `preview: "assets/previews/clip.mp4"` para vista previa sin anuncios al pasar el cursor.

**Un video propio o reel:** `{ src: "assets/video/x.mp4", poster: "assets/video/x.jpg", title: "Nombre", vertical: true }`
(`vertical: true` = formato 9:16). Videos comprimidos: 720–1280 px, menos de 30 MB.

**Un cliente nuevo:** copia un bloque completo `{ name: "...", about: "...", videos: [ ... ] }` en `clients`.
`own: true` = grupo de proyectos propios.

**Un flyer:** en `flyers`: normal `{ title, src }`, antes/después `{ title, before, after }`, animado `{ title, video, poster }`.

**Una miniatura:** en `thumbnails`: `{ title, src }` (imagen 1280×720 en `assets/thumbs/`). Se ven de a 3 por fila.
**Una serie de miniaturas apiladas:** `{ title, note, stack: [ { title, src }, ... ] }` → sale como pila de fotos y al tocarla se despliegan todas.

**Un logo:** en `logos`: `{ name, caption, bg: "#color", dark: true/false, images: ["...", "..."] }`.
Varias imágenes = variaciones que cambian al tocar. Usa PNG/WebP con fondo transparente.

**Un servicio:** en `services`: `{ title, msg, text }` (msg = lo que va en el mensaje de WhatsApp).

**Vistas del video destacado:** `featured.views` (ej. `"25 K"`). Vacío = no se muestra.

**Educación / idiomas / "Además":** en `index.html`, sección Sobre mí.

## Estilo visual

- Fondo `#070609`, morado `#b43cf0`, rojo neón `#ff3355`, azul cabezal `#3a9cff`.
- Fuentes: Anton (títulos), Archivo (texto), IBM Plex Mono (detalles).
- Efectos sutiles: grano, destello en el nombre, cabezal azul, aparición al hacer scroll.

## Ideas pendientes

- [ ] Nuevo video de color grading (antes/después).
- [ ] Vistas del video de fondo blanco.
- [ ] Clips de vista previa para los videos de YouTube.
- [ ] Showreel de 30–60 s, testimonios de clientes, TikTok ya está en Contacto (@efecastrooo).
