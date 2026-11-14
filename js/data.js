/* =====================================================================
   DATOS DEL PORTAFOLIO  ·  Federico Castro (@efecastrooo)
   ---------------------------------------------------------------------
   Aquí está TODO el contenido: cifras, skills, clientes y sus videos,
   flyers, miniaturas, logos y servicios. Para agregar algo, copia un
   bloque { ... }, pégalo debajo (separado por coma) y cambia los datos.

   Las imágenes y videos van en assets/ y se escriben con su ruta,
   por ejemplo: "assets/flyers/mi-flyer.webp"
   ===================================================================== */

window.PORTFOLIO = {

  /* ------------------------------------------------------------------
     1. SKILLS · level de 0 a 5 estrellas (se permiten medias: 4.5)
     badge: letras del icono · color: color de las letras · bg: fondo
     ------------------------------------------------------------------ */
  skills: {
    creative: [
      { name: "Premiere Pro",  badge: "Pr", color: "#9999ff", bg: "#00005b", level: 5 },
      { name: "After Effects", badge: "Ae", color: "#9999ff", bg: "#00005b", level: 3 },
      { name: "CapCut Pro",    badge: "Cc", color: "#ffffff", bg: "#161616", level: 5 },
      { name: "Photoshop",     badge: "Ps", color: "#31a8ff", bg: "#001e36", level: 4 },
      { name: "Illustrator",   badge: "Ai", color: "#ff9a00", bg: "#330000", level: 3 },
      { name: "Lightroom",     badge: "Lr", color: "#31a8ff", bg: "#001e36", level: 5 }
    ],
    code: [
      { name: "Python",               badge: "Py",  color: "#ffd43b", bg: "#14304f", level: 4 },
      { name: "C#",                   badge: "C#",  color: "#d9a7ff", bg: "#2b0f3a", level: 5 },
      { name: "Java",                 badge: "Jv",  color: "#f89820", bg: "#2a1406", level: 2 },
      { name: "HTML & CSS",           badge: "</>", color: "#ff7a45", bg: "#2a0f05", level: 4 },
      { name: "SQL y MySQL",          badge: "DB",  color: "#4fd1c5", bg: "#062a2a", level: 4 },
      { name: "Servicios en la nube", badge: "☁",   color: "#8ec5ff", bg: "#0a1e33", level: 3 }
    ]
  },

  /* ------------------------------------------------------------------
     2. VIDEO DESTACADO (fondo blanco), arriba de los clientes
     views: escríbelas como quieres que se vean ("25 K"). Vacío = no sale.
     ------------------------------------------------------------------ */
  featured: {
    id: "fNx1N6XFDZk",
    start: 0,
    client: "Andresosky",
    title: "Adivina la streamer 2",
    views: ""
  },

  /* ------------------------------------------------------------------
     3. CLIENTES Y SUS VIDEOS (cada cliente es una fila que se despliega)
     Cada video puede ser:
       - de YouTube:  { yt: "ID" }   (ID = lo que va después de watch?v=)
         opcional:    preview: "assets/previews/clip.mp4" (vista previa sin anuncios)
       - propio:      { src: "assets/video/x.mp4", poster: "assets/video/x.jpg",
                        title: "Nombre", vertical: true }   (vertical = reel 9:16)
     Para agregar un cliente nuevo, copia un bloque completo { name: ... }.
     ------------------------------------------------------------------ */
  clients: [
    { name: "c.kickssVlog", about: "Vlogs de sneakers y emprendimiento", videos: [
      { yt: "vXFsQtfSjt4", title: "El día que hicimos más de $5,000 vendiendo sneakers" },
      { yt: "ibprGbaymQs", title: "Montamos nuestra tienda en el mall más grande del Caribe" }
    ]},
    { name: "Andresosky", about: "Entretenimiento y reacciones", videos: [
      { yt: "ukBh2uggr-k", title: "El violín caso real · La Rosa de Guadalupe" },
      { yt: "KK1nc_PxGos", title: "El episodio más PDF de La Rosa" }
    ]},
    { name: "LaJotadera", about: "Fútbol y creadores", videos: [
      { yt: "fp6rIgDhjpE", title: "¡Campeones! Medellín FC destruyó La Copa Creadores" }
    ]},
    { name: "Pelicanger", about: "Gaming y streams", videos: [
      { yt: "VvJ3CB8Ldms", title: "Lo mejor de Pelicanger 2024" }
    ]},
    { name: "say_guz", about: "Streamers y entretenimiento", videos: [
      { yt: "FdMZ-978Uks", title: "Calificando streamers con mis amigas" }
    ]},
    { name: "El Muñetones", about: "Gaming", videos: [
      { yt: "3-H3vd8yy_s", title: "Locura de partidas en Hell Let Loose" }
    ]},
    { name: "Karen Giraldo", about: "Reel publicitario · FEM", videos: [
      { src: "assets/video/reel-karen-giraldo.mp4", poster: "assets/video/reel-karen-giraldo.jpg",
        title: "FEM · Reel publicitario", vertical: true }
    ]},
    { name: "Color, motion y reels", own: true, about: "Corrección de color, intros y contenido vertical", videos: [
      { src: "assets/video/color-grading.mp4", poster: "assets/video/color-grading.jpg",
        title: "Corrección de color · LOG → REC" },
      { src: "assets/video/intro-vlog.mp4", poster: "assets/video/intro-vlog.jpg",
        title: "Intro para vlog" },
      { src: "assets/video/reel-amor.mp4", poster: "assets/video/reel-amor.jpg",
        title: "Make up 21 años · TikTok", vertical: true }
    ]}
  ],

  /* ------------------------------------------------------------------
     4. FLYERS (carrusel)
     - animado:  { title, video, poster }
     - antes/después: { title, before, after }
     - normal:   { title, src }
     ------------------------------------------------------------------ */
  flyers: [
    { title: "Halloween",            video: "assets/video/flyer-halloween.mp4", poster: "assets/flyers/halloween-base.webp" },
    { title: "Simulacro Decembrino", before: "assets/flyers/simulacro-antes.webp",   after: "assets/flyers/simulacro.webp" },
    { title: "San Valentín",         before: "assets/flyers/san-valentin-antes.webp", after: "assets/flyers/san-valentin.webp" },
    { title: "Bienvenida Diciembre", src: "assets/flyers/diciembre.webp" },
    { title: "Día de la Mujer",      src: "assets/flyers/dia-mujer.webp" },
    { title: "Special Birthday",     src: "assets/flyers/special-birthday.webp" }
  ],

  /* ------------------------------------------------------------------
     5. MINIATURAS PARA YOUTUBE (imágenes 16:9 en assets/thumbs)
     ------------------------------------------------------------------ */
  thumbnails: [
    { title: "Squid Games Colombia · Día 1", src: "assets/thumbs/squid-games-dia-1.webp" },
    { title: "Squid Games Colombia · Día 4", src: "assets/thumbs/squid-games-dia-4.webp" },
    { title: "GTA San Andreas Colombia",     src: "assets/thumbs/gta-san-andreas-colombia.webp" }
  ],

  /* ------------------------------------------------------------------
     6. LOGOS · una tarjeta por marca; tocar = siguiente variación
     bg: color de fondo · dark: true si el fondo es oscuro
     ------------------------------------------------------------------ */
  logos: [
    { name: "Adonay", caption: "Fonda Bar", bg: "#f5efe3",
      images: ["assets/logos/adonay-fonda.webp", "assets/logos/adonay-bar.webp"] },
    { name: "Brasa Negra", caption: "Restaurante", bg: "#0e0d10", dark: true,
      images: ["assets/logos/brasa-negra-rojo.webp", "assets/logos/brasa-negra-blanco.webp"] },
    { name: "MD Lash Studio", caption: "Estudio de pestañas", bg: "#fbf1f6",
      images: ["assets/logos/md-lash-rosa.webp", "assets/logos/md-lash-negro.webp", "assets/logos/md-lash-sticker.webp"] },
    { name: "Mandipalmas", caption: "Mascota", bg: "#fff3e4",
      images: ["assets/logos/mandipalmas.webp"] }
  ],

  // Caso de estudio con carrusel de páginas
  brandCase: {
    title: "Los Perritos del Piti",
    text: "Concepto (frescura, flow urbano, sabor de hogar), logotipo, variaciones, personaje, área de respeto, aplicaciones y menú.",
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

  /* ------------------------------------------------------------------
     7. SERVICIOS (cada uno con botón "Cotizar" por WhatsApp)
     msg: lo que aparece en el mensaje ("quiero cotizar ...")
     ------------------------------------------------------------------ */
  whatsapp: "573116784485",
  services: [
    { title: "Reels y TikToks",     msg: "edición de reels / TikToks",
      text: "Edición vertical con ritmo, subtítulos dinámicos, efectos y música para que la gente vea hasta el final." },
    { title: "Videos para YouTube", msg: "edición de videos para YouTube",
      text: "Edición completa: cortes, color, sonido y motion graphics para que tu video se sienta pro." },
    { title: "Miniaturas",          msg: "miniaturas para YouTube",
      text: "Miniaturas llamativas y claras que invitan al clic." },
    { title: "Flyers y logos",      msg: "flyers o logos",
      text: "Piezas para eventos y redes, e identidad de marca completa." }
  ]
};
