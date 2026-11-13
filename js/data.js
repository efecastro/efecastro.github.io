/* =====================================================================
   DATOS DEL PORTAFOLIO  ·  Federico Castro
   ---------------------------------------------------------------------
   Aquí está TODO el contenido que cambia seguido: skills, videos,
   flyers y logos. Para agregar algo nuevo, copia un bloque { ... },
   pégalo debajo (separado por una coma) y cambia los datos.

   Las imágenes van en la carpeta assets/ y se escriben con su ruta,
   por ejemplo: "assets/flyers/mi-flyer.webp"
   ===================================================================== */

window.PORTFOLIO = {

  /* ------------------------------------------------------------------
     1. SKILLS
     level: de 0 a 5 estrellas (se permiten medias: 4.5)
     badge: letras del icono · color: color de las letras · bg: fondo
     ------------------------------------------------------------------ */
  skills: {
    creative: [
      { name: "Premiere Pro",  badge: "Pr", color: "#9999ff", bg: "#00005b", level: 5,   note: "Edición, ritmo, multicámara" },
      { name: "After Effects", badge: "Ae", color: "#9999ff", bg: "#00005b", level: 4,   note: "Motion graphics, tracking, VFX" },
      { name: "CapCut Pro",    badge: "Cc", color: "#ffffff", bg: "#161616", level: 5,   note: "Contenido vertical y reels" },
      { name: "Photoshop",     badge: "Ps", color: "#31a8ff", bg: "#001e36", level: 4.5, note: "Flyers, retoque, composición" },
      { name: "Illustrator",   badge: "Ai", color: "#ff9a00", bg: "#330000", level: 4,   note: "Logos e identidad de marca" },
      { name: "Lightroom",     badge: "Lr", color: "#31a8ff", bg: "#001e36", level: 4,   note: "Color y revelado de foto" }
    ],
    code: [
      { name: "Python",               badge: "Py",  color: "#ffd43b", bg: "#14304f", level: 4,   note: "Scripts, lógica, automatización" },
      { name: "C#",                   badge: "C#",  color: "#d9a7ff", bg: "#2b0f3a", level: 3.5, note: "Aplicaciones y POO" },
      { name: "Java",                 badge: "Jv",  color: "#f89820", bg: "#2a1406", level: 2.5, note: "Bases y Android Studio" },
      { name: "HTML & CSS",           badge: "</>", color: "#ff7a45", bg: "#2a0f05", level: 4,   note: "Sitios web y maquetación" },
      { name: "Bases de datos",       badge: "DB",  color: "#4fd1c5", bg: "#062a2a", level: 3.5, note: "SQL y MySQL" },
      { name: "Servicios en la nube", badge: "☁",   color: "#8ec5ff", bg: "#0a1e33", level: 3,   note: "Despliegue y servicios cloud" }
    ]
  },

  /* ------------------------------------------------------------------
     2. VIDEOS DE YOUTUBE (se reproducen al pasar el cursor)
     id: lo que va después de "watch?v=" en el enlace
     start: segundo en que empieza la vista previa
     title: se usa solo si no se puede leer el título real de YouTube
     ------------------------------------------------------------------ */
  youtube: [
    { id: "vXFsQtfSjt4", start: 0, title: "Proyecto de edición 01", tag: "Edición" },
    { id: "ibprGbaymQs", start: 0, title: "Proyecto de edición 02", tag: "Edición" },
    { id: "ukBh2uggr-k", start: 0, title: "Proyecto de edición 03", tag: "Edición" },
    { id: "KK1nc_PxGos", start: 0, title: "Proyecto de edición 04", tag: "Edición" },
    { id: "3-H3vd8yy_s", start: 0, title: "Proyecto de edición 05", tag: "Edición" },
    { id: "VvJ3CB8Ldms", start: 0, title: "Proyecto de edición 06", tag: "Edición" },
    { id: "FdMZ-978Uks", start: 0, title: "Proyecto de edición 07", tag: "Edición" },
    { id: "fp6rIgDhjpE", start: 0, title: "Proyecto de edición 08", tag: "Edición" }
  ],

  /* Video especial (fondo blanco), en grande al final de la sección.
     views: escríbelas como quieres que se vean ("25 K", "1,2 M").
            Si lo dejas vacío (""), no aparece la etiqueta de vistas.  */
  featured: {
    id: "fNx1N6XFDZk",
    start: 0,
    title: "Video de fondo blanco",
    views: "",
    tag: "Fondo blanco"
  },

  /* ------------------------------------------------------------------
     2.1 VIDEOS PROPIOS (archivos en assets/video)
     Sección "Color grading y motion design". Se ven horizontales.
     src: el video .mp4 · poster: imagen que se ve antes de reproducir
     ------------------------------------------------------------------ */
  localVideos: [
    { title: "Corrección de color · LOG → REC", text: "Comparativa OFF / ON del etalonaje y efectos.", tag: "Color grading",
      src: "assets/video/color-grading.mp4", poster: "assets/video/color-grading.jpg" },
    { title: "Intro para vlog", text: "Animación de títulos, ritmo y transiciones.", tag: "Motion",
      src: "assets/video/intro-vlog.mp4", poster: "assets/video/intro-vlog.jpg" }
  ],

  /* ------------------------------------------------------------------
     2.2 REELS VERTICALES (TikTok / Instagram / Shorts)
     Mismo formato que arriba, pero se muestran verticales (9:16).
     ------------------------------------------------------------------ */
  reels: [
    { title: "Make up 21 años", text: "Reel para TikTok: subtítulos dinámicos, inserts y ritmo vertical.", tag: "TikTok",
      src: "assets/video/reel-amor.mp4", poster: "assets/video/reel-amor.jpg" },
    { title: "FEM · Karen Giraldo", text: "Reel publicitario: subtítulos dinámicos y cortes al ritmo del mensaje.", tag: "Publicidad",
      src: "assets/video/reel-karen-giraldo.mp4", poster: "assets/video/reel-karen-giraldo.jpg" }
  ],

  /* ------------------------------------------------------------------
     3. FLYERS
     ------------------------------------------------------------------ */
  flyers: {
    // Flyer animado: va grande y centrado arriba (con botón de sonido)
    animated: {
      title: "Halloween",
      video: "assets/video/flyer-halloween.mp4",
      poster: "assets/flyers/halloween-base.webp"
    },

    // Comparador con línea deslizable: before = sin editar, after = editado
    compare: [
      { title: "Simulacro Decembrino", before: "assets/flyers/simulacro-antes.webp",   after: "assets/flyers/simulacro.webp" },
      { title: "San Valentín",         before: "assets/flyers/san-valentin-antes.webp", after: "assets/flyers/san-valentin.webp" }
    ],

    // Galería normal en cuadrícula
    gallery: [
      { title: "Bienvenida Diciembre", src: "assets/flyers/diciembre.webp" },
      { title: "Día de la Mujer",      src: "assets/flyers/dia-mujer.webp" },
      { title: "Special Birthday",     src: "assets/flyers/special-birthday.webp" }
    ]
  },

  /* ------------------------------------------------------------------
     3.1 MINIATURAS PARA YOUTUBE (imágenes 16:9 en assets/thumbs)
     ------------------------------------------------------------------ */
  thumbnails: [
    { title: "Squid Games Colombia · Día 1", src: "assets/thumbs/squid-games-dia-1.webp" },
    { title: "Squid Games Colombia · Día 4", src: "assets/thumbs/squid-games-dia-4.webp" },
    { title: "GTA San Andreas Colombia",     src: "assets/thumbs/gta-san-andreas-colombia.webp" }
  ],

  /* ------------------------------------------------------------------
     4. BRANDING
     ------------------------------------------------------------------ */
  // Caso de estudio con carrusel de páginas
  brandCase: {
    title: "Los Perritos del Piti",
    text: "Manual de marca completo: concepto (frescura, flow urbano, sabor de hogar), logotipo, variaciones, ilustración del personaje, área de respeto, aplicaciones y menú.",
    pages: [
      "assets/logos/perritos-01.webp",
      "assets/logos/perritos-04.webp",
      "assets/logos/perritos-06.webp",
      "assets/logos/perritos-05.webp",
      "assets/logos/perritos-09.webp",
      "assets/logos/perritos-10.webp",
      "assets/logos/perritos-11.webp",
      "assets/logos/perritos-12.webp"
    ]
  },

  // Tarjetas de logos. Si pones varias imágenes, salen una al lado de la otra.
  // bg: color de fondo de la tarjeta
  logos: [
    { name: "Adonay",         caption: "Fonda Bar · Variaciones", bg: "#f5efe3",
      images: ["assets/logos/adonay-fonda.webp", "assets/logos/adonay-bar.webp"] },
    { name: "Brasa Negra",    caption: "Color · Monocromo",       bg: "#0d0c0f",
      images: ["assets/logos/brasa-negra-rojo.webp", "assets/logos/brasa-negra-blanco.webp"] },
    { name: "Mandipalmas",    caption: "Mascota",                 bg: "#8f8794",
      images: ["assets/logos/mandipalmas.webp"] },
    { name: "MD Lash Studio", caption: "Variaciones",             bg: "#8f8794",
      images: ["assets/logos/md-lash-studio.webp"] }
  ]
};
