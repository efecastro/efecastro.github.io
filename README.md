# Portafolio — Federico Castro

Sitio estático (HTML + CSS + JS, sin dependencias) listo para GitHub Pages.

## Estructura

```
index.html          → contenido y secciones
css/styles.css      → estilos (colores al inicio, en :root)
js/data.js          → CONTENIDO: skills, videos, flyers, logos (lo que más se edita)
js/main.js          → interacciones (hover de videos, sonido, antes/después, lightbox)
assets/img          → hero, foto de "Sobre mí", favicon, imagen para compartir
assets/video        → videos comprimidos (color grading, intro, flyer animado)
assets/flyers       → flyers en WebP
assets/logos        → logos y páginas del manual de Los Perritos del Piti
```

## Cambios rápidos

Casi todo se cambia en `js/data.js`. La guía completa con ejemplos está en **GUIA-DEL-PROYECTO.md**.

- **Vistas del video de fondo blanco:** `featured.views` (por ejemplo `"120 K"`).
- **Video de YouTube:** copia una línea dentro de `youtube: [...]` y cambia el `id`.
- **Flyers, logos y skills:** copia un bloque `{ ... }` en su lista y cambia los datos.
- **Color principal:** `--accent` en `css/styles.css`.

## Verlo en tu computador

Abre `index.html` con doble clic. (Para que los videos de YouTube funcionen bien, mejor con un servidor local:
en la carpeta, ejecuta `python3 -m http.server` y entra a http://localhost:8000).

## Publicar en GitHub Pages (gratis)

1. Crea un repositorio en github.com con el nombre `efecastro.github.io` para que quede en la raíz.
2. Sube **el contenido de esta carpeta** (`index.html`, `css`, `js`, `assets`, `.nojekyll`).
   Con GitHub Desktop: *Add existing repository* → *Commit* → *Push*.
   O desde la web: *Add file → Upload files* y arrastra todo.
3. En el repositorio: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. En 1–2 minutos estará en `https://efecastro.github.io/` (repositorio `efecastro.github.io`).

> Si usas otro nombre de repositorio, cambia la URL de `og:image` en `index.html`
> (es la imagen que aparece al compartir el enlace por WhatsApp o redes).
