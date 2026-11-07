/* =====================================================================
   PORTAFOLIO · Federico Castro · interacciones
   ---------------------------------------------------------------------
   El CONTENIDO está en js/data.js. Este archivo solo lo dibuja en la
   página y le da vida. Está dividido en bloques numerados:

     0. Utilidades
     1. Navegación
     2. Timecode del hero
     3. Skills (tarjetas con estrellas)
     4. Videos (YouTube, videos propios, reels, destacado, sonido,
        barra de tiempo para adelantar / retroceder)
     5. Flyers (animado con sonido, comparador antes/después, galería)
     6. Branding (caso de estudio y logos)
     7. Lightbox (ver imágenes en grande)
     8. Animaciones al hacer scroll
   ===================================================================== */
(() => {
  /* =================================================================
     0. UTILIDADES
     ================================================================= */
  const DATA = window.PORTFOLIO || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Crea un elemento a partir de un texto HTML
  const html = (markup) => {
    const t = document.createElement("template");
    t.innerHTML = markup.trim();
    return t.content.firstElementChild;
  };

  // Evita que textos como "</>" se lean como código HTML
  const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Estrellas de 0 a 5 (acepta medias)
  const stars = (level) => `
    <span class="stars" role="img" aria-label="${level} de 5 estrellas">
      <span class="stars__fill" style="--w:${(level / 5) * 100}%"></span>
    </span>`;

  $("#year").textContent = new Date().getFullYear();

  /* =================================================================
     1. NAVEGACIÓN
     ================================================================= */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  $(".nav__burger").addEventListener("click", (e) => {
    const open = nav.classList.toggle("is-open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  $$(".nav__links a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-open")));

  /* =================================================================
     2. TIMECODE DEL HERO (estilo Premiere, 24 fps)
     ================================================================= */
  const timecode = $("#timecode");
  if (timecode && !reduceMotion) {
    const start = performance.now();
    const pad = (n) => String(n).padStart(2, "0");
    const tick = (now) => {
      const frames = Math.floor(((now - start) / 1000) * 24);
      const s = Math.floor(frames / 24), m = Math.floor(s / 60), h = Math.floor(m / 60);
      timecode.textContent = `${pad(h)}:${pad(m % 60)}:${pad(s % 60)}:${pad(frames % 24)}`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* =================================================================
     3. SKILLS
     ================================================================= */
  const skillCard = (s) => html(`
    <div class="skill reveal">
      <span class="skill__badge ${s.badge.length > 2 ? "skill__badge--sm" : ""}" style="--c:${s.color};--b:${s.bg}">${esc(s.badge)}</span>
      <div>
        <div class="skill__name">${esc(s.name)}</div>
        <div class="skill__note">${esc(s.note || "")}</div>
        ${stars(s.level)}
      </div>
    </div>`);

  const skills = DATA.skills || {};
  (skills.creative || []).forEach((s) => $("#skills-creative").appendChild(skillCard(s)));
  (skills.code || []).forEach((s) => $("#skills-code").appendChild(skillCard(s)));

  /* =================================================================
     4. VIDEOS
     ================================================================= */

  /* ---- 4.1 Sonido: un solo interruptor para todos los videos ---- */
  let soundOn = false;
  let current = null; // tarjeta que se está reproduciendo

  const syncSoundButtons = () =>
    $$("[data-sound]").forEach((b) => {
      b.classList.toggle("is-on", soundOn);
      b.setAttribute("aria-label", soundOn ? "Silenciar" : "Activar sonido");
    });

  const applySound = (card) => {
    if (!card) return;
    if (card._video) card._video.muted = !soundOn;
    const p = card._player;
    if (p && p.mute) {
      if (soundOn) { p.unMute(); p.setVolume(80); } else p.mute();
    }
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-sound]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    soundOn = !soundOn;
    syncSoundButtons();
    const card = btn.closest(".vcard");
    if (card && !card.classList.contains("is-playing")) play(card);
    applySound(card);
  });

  /* ---- 4.2 YouTube ---- */
  let ytReady;
  const loadYouTubeAPI = () =>
    ytReady ||
    (ytReady = new Promise((resolve) => {
      if (window.YT && YT.Player) return resolve();
      window.onYouTubeIframeAPIReady = resolve;
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }));

  function youtubeCard(v, extraClass = "") {
    const card = html(`
      <article class="vcard reveal ${extraClass}" data-yt="${v.id}" data-start="${v.start || 0}">
        <div class="vcard__media">
          <img class="vcard__thumb" src="https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg" alt="" loading="lazy" />
          <div class="vcard__player"><div></div></div>
          <span class="vcard__play" aria-hidden="true"></span>
          ${v.tag ? `<span class="vcard__tag">${v.tag}</span>` : ""}
          <button class="sound-btn" data-sound aria-label="Activar sonido"></button>
        </div>
        <div class="vcard__info">
          <div>
            <h4 data-title>${v.title || ""}</h4>
            <p data-author>YouTube</p>
          </div>
          <a class="vcard__yt" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Ver ↗</a>
        </div>
      </article>`);

    // Si no hay miniatura en alta, YouTube devuelve una gris de 120px → usar la normal
    const img = $(".vcard__thumb", card);
    img.addEventListener("load", () => {
      if (img.naturalWidth <= 120) img.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    });
    fetchTitle(v.id, card);
    return card;
  }

  // Lee el título real del video (servicio público, sin clave)
  function fetchTitle(id, root) {
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d || !d.title) return;
        $$("[data-title]", root).forEach((t) => (t.textContent = d.title));
        const author = $("[data-author]", root);
        if (author && d.author_name) author.textContent = d.author_name;
      })
      .catch(() => {});
  }

  async function playYouTube(card) {
    card._want = true;
    await loadYouTubeAPI();
    if (!card._want) return;

    if (card._player && card._player.playVideo) {
      applySound(card);
      card._player.playVideo();
      return;
    }
    if (card._creating) return;
    card._creating = true;

    const id = card.dataset.yt;
    card._player = new YT.Player($(".vcard__player > div", card), {
      host: "https://www.youtube-nocookie.com",
      videoId: id,
      playerVars: {
        autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, rel: 0,
        iv_load_policy: 3, modestbranding: 1, playsinline: 1,
        start: +card.dataset.start || 0, loop: 1, playlist: id,
      },
      events: {
        onReady: (e) => {
          e.target.mute();
          if (card._want) { e.target.playVideo(); applySound(card); }
          else e.target.pauseVideo();
        },
        onStateChange: (e) => {
          if (e.data !== YT.PlayerState.PLAYING) return;
          if (card._want) { card.classList.add("is-playing"); applySound(card); }
          else e.target.pauseVideo();
        },
      },
    });
  }

  function stopYouTube(card) {
    card._want = false;
    card.classList.remove("is-playing");
    if (card._player && card._player.pauseVideo) card._player.pauseVideo();
  }

  /* ---- 4.3 Videos alojados en el sitio (assets/video) ---- */
  function playLocal(card) {
    const v = card._video;
    const started = () => card.classList.add("is-playing");
    v.muted = !soundOn;
    v.play().then(started).catch(() => {
      // Si el navegador bloquea el sonido, reproducir en silencio
      v.muted = true; soundOn = false; syncSoundButtons();
      v.play().then(started).catch(() => {});
    });
  }
  function stopLocal(card) {
    card.classList.remove("is-playing");
    card._video.pause();
  }

  /* ---- 4.4 Barra de tiempo: muestra el avance y permite adelantar / retroceder ----
     addScrubBar(contenedor, fuente)
     "fuente" es una función que devuelve { duration, current, seek(segundos) } */
  const scrubBars = [];
  const formatTime = (sec) => {
    sec = Math.max(0, Math.floor(sec || 0));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  };

  function addScrubBar(host, source) {
    const bar = html(`
      <div class="scrub" role="slider" aria-label="Barra de tiempo" tabindex="0">
        <span class="scrub__time">0:00</span>
        <div class="scrub__rail"><div class="scrub__fill"></div><div class="scrub__knob"></div></div>
      </div>`);
    host.appendChild(bar);
    let dragging = false;

    const seekFromEvent = (e) => {
      const media = source();
      if (!media || !media.duration) return;
      const r = $(".scrub__rail", bar).getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      media.seek(pct * media.duration);
      host.style.setProperty("--p", pct.toFixed(4));
    };

    bar.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      dragging = true;
      bar.classList.add("is-dragging");
      bar.setPointerCapture(e.pointerId);
      seekFromEvent(e);
    });
    bar.addEventListener("pointermove", (e) => { if (dragging) seekFromEvent(e); });
    ["pointerup", "pointercancel"].forEach((t) =>
      bar.addEventListener(t, () => { dragging = false; bar.classList.remove("is-dragging"); })
    );
    // que el clic en la barra no abra el lightbox ni pause el video
    bar.addEventListener("click", (e) => e.stopPropagation());
    // teclado: flechas = 5 segundos
    bar.addEventListener("keydown", (e) => {
      const media = source();
      if (!media) return;
      if (e.key === "ArrowLeft") media.seek(Math.max(0, media.current - 5));
      if (e.key === "ArrowRight") media.seek(Math.min(media.duration, media.current + 5));
    });

    scrubBars.push({ host, bar, source, isDragging: () => dragging });
  }

  // Un solo ciclo actualiza todas las barras
  (function updateScrubBars() {
    scrubBars.forEach(({ host, bar, source, isDragging }) => {
      const media = source();
      if (!media || !media.duration) return;
      if (!isDragging()) host.style.setProperty("--p", (media.current / media.duration).toFixed(4));
      $(".scrub__time", bar).textContent = `${formatTime(media.current)} / ${formatTime(media.duration)}`;
    });
    requestAnimationFrame(updateScrubBars);
  })();

  // Fuente para una etiqueta <video>
  const videoSource = (v) => () => ({
    duration: v.duration, current: v.currentTime,
    seek: (t) => { v.currentTime = t; },
  });

  // Fuente para una tarjeta (video propio o YouTube)
  const cardSource = (card) => () => {
    if (card._video) return videoSource(card._video)();
    const p = card._player;
    if (p && p.getDuration) {
      return { duration: p.getDuration(), current: p.getCurrentTime(), seek: (t) => p.seekTo(t, true) };
    }
    return null;
  };

  /* ---- 4.5 Control común: reproducir / detener ---- */
  function play(card) {
    if (card.classList.contains("is-full")) return;
    if (current && current !== card) stop(current);
    current = card;
    card.classList.add("is-active");
    card._video ? playLocal(card) : playYouTube(card);
  }
  function stop(card) {
    card.classList.remove("is-active");
    card._video ? stopLocal(card) : stopYouTube(card);
    if (current === card) current = null;
  }

  // Computador: pasar el cursor · Celular: tocar para reproducir/pausar
  function bindVideoCard(card) {
    card._video = $("video", card) || null;
    addScrubBar($(".vcard__media", card), cardSource(card));
    if (canHover) {
      let delay;
      card.addEventListener("mouseenter", () => { delay = setTimeout(() => play(card), 180); });
      card.addEventListener("mouseleave", () => { clearTimeout(delay); stop(card); });
    } else {
      $(".vcard__media", card).addEventListener("click", (e) => {
        if (e.target.closest("[data-sound]")) return;
        card.classList.contains("is-playing") ? stop(card) : play(card);
      });
    }
  }

  /* ---- 4.6 Dibujar la grilla de YouTube y los videos locales ---- */
  (DATA.youtube || []).forEach((v) => {
    const card = youtubeCard(v);
    $("#yt-grid").appendChild(card);
    bindVideoCard(card);
  });

  // Videos propios (horizontales) y reels (verticales) desde data.js
  const localCard = (v, extraClass = "") => html(`
    <article class="vcard vcard--local reveal ${extraClass}">
      <div class="vcard__media">
        <video src="${v.src}" poster="${v.poster || ""}" muted loop playsinline preload="none"></video>
        <span class="vcard__play" aria-hidden="true"></span>
        ${v.tag ? `<span class="vcard__tag">${esc(v.tag)}</span>` : ""}
        <button class="sound-btn" data-sound aria-label="Activar sonido"></button>
      </div>
      <div class="vcard__info">
        <h4>${esc(v.title)}</h4>
        <p>${esc(v.text || "")}</p>
      </div>
    </article>`);

  (DATA.localVideos || []).forEach((v) => {
    const card = localCard(v);
    $("#local-grid").appendChild(card);
    bindVideoCard(card);
  });
  (DATA.reels || []).forEach((v) => {
    const card = localCard(v, "vcard--reel");
    $("#reel-grid").appendChild(card);
    bindVideoCard(card);
  });

  /* ---- 4.7 Video destacado (fondo blanco) ---- */
  const F = DATA.featured;
  const featuredBox = $("#featured");
  if (F && featuredBox) {
    const card = youtubeCard(F, "featured__card");
    card.classList.remove("reveal");
    $(".vcard__info", card).remove();

    const text = html(`
      <div class="featured__text">
        <span class="featured__label">Trabajo destacado</span>
        <h3 class="featured__title" data-title>${F.title}</h3>
        <p class="muted">Uno de los formatos más exigentes que he editado: <b style="color:#fff">fondo blanco</b>.
        Aquí cualquier cambio de luz, sombra o tono se nota, así que cada plano lleva su corrección
        para que el blanco se mantenga limpio y parejo de principio a fin.</p>
        ${F.views ? `<div class="featured__stats"><div><strong>${F.views}</strong><span>Vistas en YouTube</span></div></div>` : ""}
        <div class="featured__chips"><span>Fondo blanco</span><span>Corrección de color</span><span>Edición completa</span></div>
        <div class="featured__actions">
          <button class="btn btn--primary" data-full>▶ Ver completo</button>
          <a class="btn btn--ghost" href="https://www.youtube.com/watch?v=${F.id}" target="_blank" rel="noopener">Abrir en YouTube</a>
        </div>
      </div>`);

    featuredBox.append(card, text);
    fetchTitle(F.id, text);
    bindVideoCard(card);

    // "Ver completo": reproductor normal con controles y sonido
    $("[data-full]", text).addEventListener("click", () => {
      stop(card);
      if (card._player && card._player.destroy) card._player.destroy();
      card._player = null;
      card.classList.add("is-full");
      $(".vcard__player", card).innerHTML = `
        <iframe src="https://www.youtube-nocookie.com/embed/${F.id}?autoplay=1&start=${F.start || 0}&rel=0&modestbranding=1&playsinline=1"
          title="Video destacado" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  }

  /* =================================================================
     5. FLYERS
     ================================================================= */
  const flyers = DATA.flyers || {};

  /* ---- 5.1 Flyer animado (grande, centrado, con sonido y barra de tiempo) ---- */
  if (flyers.animated) {
    const a = flyers.animated;
    const fig = html(`
      <figure class="flyer flyer--feature" data-zoom="${a.video}" data-zoom-type="video">
        <div class="flyer__media">
          <video src="${a.video}" poster="${a.poster}" muted loop playsinline preload="none" data-autoplay></video>
          <button class="sound-btn sound-btn--show" data-flyer-sound aria-label="Activar sonido"></button>
        </div>
        <figcaption><span>${esc(a.title)}</span><em>Flyer animado</em></figcaption>
      </figure>`);
    $("#flyer-animated").appendChild(fig);

    const video = $("video", fig);
    const soundBtn = $("[data-flyer-sound]", fig);
    soundBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // que no abra el lightbox
      video.muted = !video.muted;
      if (!video.muted) video.play().catch(() => {});
      soundBtn.classList.toggle("is-on", !video.muted);
      soundBtn.setAttribute("aria-label", video.muted ? "Activar sonido" : "Silenciar");
    });
    // si se sale de la pantalla, vuelve a silencio
    new IntersectionObserver(([en]) => {
      if (!en.isIntersecting && !video.muted) soundBtn.click();
    }).observe(video);

    addScrubBar($(".flyer__media", fig), videoSource(video));
  }

  /* ---- 5.2 Comparador antes / después con línea deslizable ----
     Abajo está la foto SIN editar y encima el flyer EDITADO, recortado
     hasta la línea. Línea a la derecha = todo editado; a la izquierda = sin editar. */
  function compareCard(f) {
    const el = html(`
      <figure class="compare reveal" style="--pos:100%">
        <div class="compare__frame" tabindex="0" role="slider" aria-label="Comparar ${f.title}"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
          <img class="compare__img" src="${f.before}" alt="${f.title} sin editar" loading="lazy" draggable="false" />
          <img class="compare__img compare__after" src="${f.after}" alt="${f.title} editado" loading="lazy" draggable="false" />
          <span class="compare__tag compare__tag--after">Editado</span>
          <span class="compare__tag compare__tag--before">Sin editar</span>
          <div class="compare__line" aria-hidden="true"><span class="compare__handle"></span></div>
        </div>
        <figcaption>
          <span class="compare__title">${f.title}</span>
          <div class="compare__switch" role="group" aria-label="Ver versión">
            <button type="button" data-to="0">Sin editar</button>
            <button type="button" data-to="100">Editado</button>
          </div>
        </figcaption>
      </figure>`);

    const frame = $(".compare__frame", el);
    let dragging = false;

    // Mueve la línea a un porcentaje (0 = sin editar, 100 = editado)
    const setPos = (pct, animate = false) => {
      pct = Math.max(0, Math.min(100, pct));
      el.classList.toggle("is-animating", animate);
      el.style.setProperty("--pos", pct + "%");
      el.dataset.state = pct <= 3 ? "before" : pct >= 97 ? "after" : "mix";
      frame.setAttribute("aria-valuenow", Math.round(pct));
    };
    const pctFromEvent = (e) => {
      const r = frame.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    };

    // Mouse: la línea sigue al cursor · Dedo: arrastrar
    frame.addEventListener("pointermove", (e) => {
      if (e.pointerType === "mouse" || dragging) setPos(pctFromEvent(e));
    });
    frame.addEventListener("pointerdown", (e) => {
      dragging = true;
      setPos(pctFromEvent(e));
      frame.setPointerCapture(e.pointerId);
    });
    ["pointerup", "pointercancel"].forEach((t) => frame.addEventListener(t, () => (dragging = false)));

    // Teclado: flechas izquierda / derecha
    frame.addEventListener("keydown", (e) => {
      const now = parseFloat(el.style.getPropertyValue("--pos"));
      if (e.key === "ArrowLeft") { setPos(now - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(now + 5); e.preventDefault(); }
    });

    // Botones "Sin editar" / "Editado"
    $$("[data-to]", el).forEach((b) => b.addEventListener("click", () => setPos(+b.dataset.to, true)));

    // Al aparecer en pantalla: la línea entra desde la derecha hasta la mitad
    el._onReveal = () => setTimeout(() => setPos(50, true), 450);
    setPos(100);
    return el;
  }
  (flyers.compare || []).forEach((f) => $("#flyer-compare").appendChild(compareCard(f)));

  /* ---- 5.3 Galería de flyers ---- */
  (flyers.gallery || []).forEach((f) =>
    $("#flyer-gallery").appendChild(html(`
      <figure class="flyer reveal" data-zoom="${f.src}">
        <img src="${f.src}" alt="Flyer ${f.title}" loading="lazy" />
        <figcaption><span>${f.title}</span></figcaption>
      </figure>`))
  );

  /* ---- 5.4 Los flyers animados solo se reproducen si están en pantalla ---- */
  const autoplayObserver = new IntersectionObserver((entries) =>
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    }), { threshold: 0.35 });
  $$("video[data-autoplay]").forEach((v) => autoplayObserver.observe(v));

  /* =================================================================
     6. BRANDING
     ================================================================= */

  /* ---- 6.1 Caso de estudio con carrusel ---- */
  const bc = DATA.brandCase;
  const track = $("#case-track");
  if (bc && track) {
    $("[data-case-title]").textContent = bc.title;
    $("[data-case-text]").textContent = bc.text;
    bc.pages.forEach((src, i) =>
      track.appendChild(html(`<img src="${src}" alt="${bc.title} · página ${i + 1}" loading="lazy" data-zoom="${src}" />`))
    );
    const slide = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.7 });
    $("[data-case-prev]").addEventListener("click", () => slide(-1));
    $("[data-case-next]").addEventListener("click", () => slide(1));
  } else if ($("#brand-case")) {
    $("#brand-case").remove();
  }

  /* ---- 6.2 Logos (varias imágenes = una al lado de la otra) ---- */
  (DATA.logos || []).forEach((logo) => {
    const imgs = logo.images
      .map((src) => `<img src="${src}" alt="Logo ${logo.name}" loading="lazy" data-zoom="${src}" />`)
      .join("");
    $("#logo-grid").appendChild(html(`
      <figure class="logo-card reveal ${logo.images.length > 1 ? "logo-card--pair" : ""}" style="--card:${logo.bg}">
        <div class="logo-card__box">${imgs}</div>
        <figcaption><strong>${logo.name}</strong><span>${logo.caption || ""}</span></figcaption>
      </figure>`));
  });

  /* =================================================================
     7. LIGHTBOX: clic en cualquier elemento con data-zoom
     ================================================================= */
  const lightbox = $("#lightbox");
  const lightboxContent = $(".lightbox__content", lightbox);

  let pausedByLightbox = [];
  const openLightbox = (src, type, alt = "") => {
    // pausar los videos de la página para que no suenen dos a la vez
    pausedByLightbox = $$("main video").filter((v) => !v.paused);
    pausedByLightbox.forEach((v) => v.pause());
    lightboxContent.innerHTML = type === "video"
      ? `<video src="${src}" controls autoplay loop playsinline></video>`
      : `<img src="${src}" alt="${alt}" />`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const v = $("video", lightboxContent);
    if (v) v.pause();
    pausedByLightbox.forEach((pv) => pv.play().catch(() => {}));
    pausedByLightbox = [];
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-zoom]");
    if (!el) return;
    const img = el.matches("img") ? el : $("img", el);
    openLightbox(el.dataset.zoom, el.dataset.zoomType, img ? img.alt : "");
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.closest(".lightbox__close")) closeLightbox();
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* =================================================================
     8. ANIMACIONES AL HACER SCROLL (clase .reveal)
     ================================================================= */
  const revealObserver = new IntersectionObserver((entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible");
      if (en.target._onReveal) en.target._onReveal();
      revealObserver.unobserve(en.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  $$(".reveal").forEach((el) => {
    // pequeño escalonado entre elementos vecinos
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
    revealObserver.observe(el);
  });
})();
