/* =====================================================================
   PORTAFOLIO · Federico Castro · interacciones
   ---------------------------------------------------------------------
   El CONTENIDO está en js/data.js. Este archivo lo dibuja y le da vida.
   Bloques:
     0. Utilidades
     1. Navegación y timecode
     2. Sobre mí (skills)
     3. Videos: sonido/volumen, barra de tiempo, tarjetas, YouTube
     4. Trabajos: video destacado + clientes desplegables
     5. Diseño: carrusel de flyers (animado, antes/después) + miniaturas
     6. Branding: logos con variaciones + caso de estudio
     7. Servicios + WhatsApp
     8. Lightbox, carruseles y animaciones al hacer scroll
   ===================================================================== */
// Seguro: el contenido solo se oculta para animarlo si este archivo carga bien.
// Si algo falla, se quita la clase "js" y todo se muestra igual (nunca queda la página en blanco).
document.documentElement.classList.add("js");
addEventListener("error", () => document.documentElement.classList.remove("js"));

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
  // Evita que textos como "</>" se lean como código
  const esc = (text) => String(text ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Estrellas de 0 a 5 (acepta medias)
  const stars = (level) => `
    <span class="stars" role="img" aria-label="${level} de 5 estrellas">
      <span class="stars__fill" style="--w:${(level / 5) * 100}%"></span>
    </span>`;

  $("#year").textContent = new Date().getFullYear();

  /* =================================================================
     1. NAVEGACIÓN Y TIMECODE
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
     2. SOBRE MÍ
     ================================================================= */
  const clients = DATA.clients || [];
  // Skills en lista compacta
  const skillRow = (s) => html(`
    <li class="skill-row">
      <span class="skill-row__badge ${s.badge.length > 2 ? "is-sm" : ""}" style="--c:${s.color};--b:${s.bg}">${esc(s.badge)}</span>
      <span class="skill-row__name">${esc(s.name)}</span>
      ${stars(s.level)}
    </li>`);
  const skills = DATA.skills || {};
  (skills.creative || []).forEach((s) => $("#skills-creative").appendChild(skillRow(s)));
  (skills.code || []).forEach((s) => $("#skills-code").appendChild(skillRow(s)));

  /* =================================================================
     3. VIDEOS
     ================================================================= */

  /* ---- 3.1 Sonido y volumen (uno solo para todo, se recuerda) ---- */
  let soundOn = false;
  let current = null;
  let volume = 0.6;
  try {
    const saved = parseFloat(localStorage.getItem("fc-volume"));
    if (!isNaN(saved)) volume = saved;
  } catch (_) {}

  const soundControl = (attr = "data-sound", extra = "") => `
    <div class="sound-ctl ${extra}">
      <input class="sound-ctl__vol" type="range" min="0" max="100" step="1"
             value="${Math.round(volume * 100)}" aria-label="Volumen" data-volume />
      <button class="sound-btn" ${attr} aria-label="Activar sonido"></button>
    </div>`;

  const syncSoundButtons = () =>
    $$("[data-sound]").forEach((b) => {
      b.classList.toggle("is-on", soundOn);
      b.parentElement.classList.toggle("is-on", soundOn);
      b.setAttribute("aria-label", soundOn ? "Silenciar" : "Activar sonido");
    });

  const applySound = (card) => {
    if (card && card._video) { card._video.muted = !soundOn; card._video.volume = volume; }
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

  document.addEventListener("input", (e) => {
    if (!e.target.matches("[data-volume]")) return;
    volume = e.target.value / 100;
    $$("[data-volume]").forEach((r) => { if (r !== e.target) r.value = e.target.value; });
    try { localStorage.setItem("fc-volume", volume); } catch (_) {}
    $$("main video").forEach((v) => (v.volume = volume));
  });

  // Tocar controles no abre el lightbox ni pausa el video
  ["click", "pointerdown"].forEach((t) =>
    document.addEventListener(t, (e) => {
      if (e.target.closest(".sound-ctl__vol")) e.stopPropagation();
    }, true)
  );

  /* ---- 3.2 Barra de tiempo (adelantar / retroceder) ---- */
  const scrubBars = [];
  const formatTime = (sec) => {
    sec = Math.max(0, Math.floor(sec || 0));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  };
  function addScrubBar(host, video) {
    const bar = html(`
      <div class="scrub" role="slider" aria-label="Barra de tiempo" tabindex="0">
        <span class="scrub__time">0:00</span>
        <div class="scrub__rail"><div class="scrub__fill"></div><div class="scrub__knob"></div></div>
      </div>`);
    host.appendChild(bar);
    let dragging = false;
    const seek = (e) => {
      if (!video.duration) return;
      const r = $(".scrub__rail", bar).getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      video.currentTime = pct * video.duration;
      host.style.setProperty("--p", pct.toFixed(4));
    };
    bar.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      dragging = true;
      bar.classList.add("is-dragging");
      bar.setPointerCapture(e.pointerId);
      seek(e);
    });
    bar.addEventListener("pointermove", (e) => { if (dragging) seek(e); });
    ["pointerup", "pointercancel"].forEach((t) =>
      bar.addEventListener(t, () => { dragging = false; bar.classList.remove("is-dragging"); }));
    bar.addEventListener("click", (e) => e.stopPropagation());
    bar.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 5);
      if (e.key === "ArrowRight") video.currentTime = Math.min(video.duration, video.currentTime + 5);
    });
    scrubBars.push({ host, bar, video, isDragging: () => dragging });
  }
  (function updateScrubBars() {
    scrubBars.forEach(({ host, bar, video, isDragging }) => {
      if (!video.duration || video.paused && !isDragging() && host._last === video.currentTime) return;
      host._last = video.currentTime;
      if (!isDragging()) host.style.setProperty("--p", (video.currentTime / video.duration).toFixed(4));
      $(".scrub__time", bar).textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });
    requestAnimationFrame(updateScrubBars);
  })();

  /* ---- 3.3 Reproducir / detener videos propios ---- */
  function play(card) {
    if (card.classList.contains("is-full") || !card._video) return;
    if (current && current !== card) stop(current);
    current = card;
    const v = card._video;
    const started = () => card.classList.add("is-playing");
    v.muted = !soundOn;
    v.volume = volume;
    v.play().then(started).catch(() => {
      v.muted = true; soundOn = false; syncSoundButtons();
      v.play().then(started).catch(() => {});
    });
  }
  function stop(card) {
    card.classList.remove("is-playing");
    if (card._video) card._video.pause();
    if (current === card) current = null;
  }

  /* ---- 3.4 YouTube: clic = reproductor normal (con "Omitir" en anuncios) ----
     La vista previa al pasar el cursor no usa YouTube (los anuncios la trababan). */
  const ytEmbed = (id, start = 0, autoplay = true) =>
    `<iframe src="https://www.youtube-nocookie.com/embed/${id}?${autoplay ? "autoplay=1&" : ""}start=${start}&rel=0&modestbranding=1&playsinline=1"
       title="Video de YouTube" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;

  let openFullCard = null;
  function openFull(card, autoplay = true) {
    if (card.classList.contains("is-full")) return;
    if (openFullCard && openFullCard !== card) closeFull(openFullCard);
    if (card._video) stop(card);
    $(".vcard__player", card).innerHTML = ytEmbed(card.dataset.yt, +card.dataset.start || 0, autoplay);
    card.classList.add("is-full");
    if (autoplay) openFullCard = card;
  }
  function closeFull(card) {
    $(".vcard__player", card).innerHTML = "";
    card.classList.remove("is-full");
    if (openFullCard === card) openFullCard = null;
  }

  // Lee el título real del video de YouTube
  function fetchTitle(id, root) {
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`)
      .then((r) => r.json())
      .then((d) => { if (d && d.title) $$("[data-title]", root).forEach((t) => (t.textContent = d.title)); })
      .catch(() => {});
  }

  /* ---- 3.5 Tarjeta de video (YouTube o propio) ---- */
  function videoCard(v, extraClass = "") {
    if (v.yt) {
      const card = html(`
        <article class="vcard ${extraClass}" data-yt="${v.yt}" data-start="${v.start || 0}">
          <div class="vcard__media">
            ${v.preview ? `<video class="vcard__preview" src="${v.preview}" muted loop playsinline preload="none"></video>` : ""}
            <img class="vcard__thumb" src="https://i.ytimg.com/vi/${v.yt}/maxresdefault.jpg" alt="" loading="lazy" />
            <div class="vcard__player"></div>
            <span class="vcard__play" aria-hidden="true"></span>
            ${v.preview ? soundControl() : ""}
          </div>
          <div class="vcard__info">
            <h4 data-title>${esc(v.title || "")}</h4>
            <a class="vcard__yt" href="https://www.youtube.com/watch?v=${v.yt}" target="_blank" rel="noopener">YouTube ↗</a>
          </div>
        </article>`);
      const img = $(".vcard__thumb", card);
      img.addEventListener("load", () => {
        if (img.naturalWidth <= 120) img.src = `https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg`;
      });
      if (!v.title) fetchTitle(v.yt, card);
      card._video = $(".vcard__preview", card);
      if (!canHover) openFull(card, false); // celular: reproductor de YouTube directo
      else {
        if (card._video) bindHover(card);
        $(".vcard__media", card).addEventListener("click", (e) => {
          if (!e.target.closest(".sound-ctl")) openFull(card);
        });
      }
      return card;
    }
    // Video propio
    const card = html(`
      <article class="vcard vcard--local ${v.vertical ? "vcard--reel" : ""} ${extraClass}">
        <div class="vcard__media">
          <video src="${v.src}" poster="${v.poster || ""}" muted loop playsinline preload="none"></video>
          <span class="vcard__play" aria-hidden="true"></span>
          ${soundControl()}
        </div>
        <div class="vcard__info"><h4>${esc(v.title)}</h4></div>
      </article>`);
    card._video = $("video", card);
    addScrubBar($(".vcard__media", card), card._video);
    if (canHover) bindHover(card);
    else $(".vcard__media", card).addEventListener("click", (e) => {
      if (e.target.closest(".sound-ctl, .scrub")) return;
      card.classList.contains("is-playing") ? stop(card) : play(card);
    });
    return card;
  }
  function bindHover(card) {
    let delay;
    card.addEventListener("mouseenter", () => { delay = setTimeout(() => play(card), 160); });
    card.addEventListener("mouseleave", () => { clearTimeout(delay); stop(card); });
  }

  /* =================================================================
     4. TRABAJOS
     ================================================================= */

  /* ---- 4.1 Video destacado (fondo blanco) ---- */
  const F = DATA.featured;
  if (F && $("#featured")) {
    const card = videoCard({ yt: F.id, start: F.start, title: F.title }, "featured__card");
    const text = html(`
      <div class="featured__text">
        <span class="featured__label">Trabajo destacado · ${esc(F.client || "")}</span>
        <h3 class="featured__title">${esc(F.title)}</h3>
        <p class="muted">Uno de los formatos más exigentes que he editado: <b style="color:#fff">fondo blanco</b>.
        Cualquier cambio de luz, sombra o tono se nota, así que cada plano lleva su corrección
        para que el blanco se mantenga limpio y parejo de principio a fin.</p>
        ${F.views ? `<div class="featured__stats"><strong>${esc(F.views)}</strong><span>Vistas en YouTube</span></div>` : ""}
        <div class="featured__chips"><span>Fondo blanco</span><span>Corrección de color</span><span>Edición completa</span></div>
        ${canHover ? `<button class="btn btn--primary" data-full>▶ Ver video</button>` : ""}
      </div>`);
    $("#featured").append(card, text);
    const fullBtn = $("[data-full]", text);
    if (fullBtn) fullBtn.addEventListener("click", () => openFull(card));
  }

  /* ---- 4.2 Destacados: color grading y motion, lado a lado ---- */
  (DATA.highlights || []).forEach((v) => {
    const card = videoCard(v, "highlight reveal");
    if (v.text) $(".vcard__info", card).insertAdjacentHTML("beforeend", `<p>${esc(v.text)}</p>`);
    $("#highlights").appendChild(card);
  });

  /* ---- 4.2b Reels y TikToks (sección propia) ---- */
  (DATA.reels || []).forEach((v) => {
    const card = videoCard(v, "reveal");
    if (v.text) $(".vcard__info", card).insertAdjacentHTML("beforeend", `<p>${esc(v.text)}</p>`);
    $("#reels").appendChild(card);
  });

  /* ---- 4.3 Clientes desplegables ---- */
  const thumbOf = (v) => v.yt ? `https://i.ytimg.com/vi/${v.yt}/mqdefault.jpg` : v.poster;
  clients.forEach((c, i) => {
    const kinds = [...new Set(c.videos.map((v) => (v.yt ? "YouTube" : v.vertical ? "Reel" : "Video")))].join(" · ");
    const item = html(`
      <div class="client reveal">
        <button class="client__head" aria-expanded="false">
          <span class="client__avatar"><img src="${c.avatar || thumbOf(c.videos[0])}" alt="" loading="lazy" /></span>
          <span class="client__name">${esc(c.name)}<small>${esc(c.about || "")}</small></span>
          <span class="client__meta">${c.videos.length} ${c.videos.length === 1 ? "video" : "videos"} · ${kinds}</span>
          <span class="client__thumbs" aria-hidden="true">
            ${c.videos.slice(0, 3).map((v) => `<img src="${thumbOf(v)}" alt="" loading="lazy" />`).join("")}
          </span>
          <span class="client__chev" aria-hidden="true"></span>
        </button>
        <div class="client__body"><div class="client__inner"><div class="client__grid"></div></div></div>
      </div>`);
    const grid = $(".client__grid", item);
    let built = false;
    const toggle = (open) => {
      if (open && !built) { c.videos.forEach((v) => grid.appendChild(videoCard(v))); built = true; }
      item.classList.toggle("is-open", open);
      $(".client__head", item).setAttribute("aria-expanded", open);
      if (!open) $$(".vcard", item).forEach((card) => { stop(card); if (card.dataset.yt && canHover) closeFull(card); });
    };
    $(".client__head", item).addEventListener("click", () => toggle(!item.classList.contains("is-open")));
    $("#clients").appendChild(item);
    if (i === 0) toggle(true); // el primero sale abierto
  });

  /* =================================================================
     5. DISEÑO
     ================================================================= */

  /* ---- 5.1 Comparador antes / después (línea deslizable) ----
     Abajo la foto SIN editar, encima el flyer EDITADO recortado hasta la línea. */
  function compareCard(f) {
    const el = html(`
      <figure class="slide compare" style="--pos:100%">
        <div class="compare__frame" tabindex="0" role="slider" aria-label="Comparar ${esc(f.title)}"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
          <img class="compare__img" src="${f.before}" alt="${esc(f.title)} sin editar" loading="lazy" draggable="false" />
          <img class="compare__img compare__after" src="${f.after}" alt="${esc(f.title)} editado" loading="lazy" draggable="false" />
          <span class="compare__tag compare__tag--after">Editado</span>
          <span class="compare__tag compare__tag--before">Sin editar</span>
          <div class="compare__line" aria-hidden="true"><span class="compare__handle"></span></div>
        </div>
        <figcaption>
          <span>${esc(f.title)}</span>
          <div class="compare__switch" role="group" aria-label="Ver versión">
            <button type="button" data-to="0">Antes</button>
            <button type="button" data-to="100">Después</button>
          </div>
        </figcaption>
      </figure>`);
    const frame = $(".compare__frame", el);
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
    if (canHover) {
      // Computador: la línea sigue al mouse
      frame.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") setPos(pctFromEvent(e)); });
    } else {
      // Celular: sin arrastre (así deslizar el carrusel no mueve la línea).
      // Un toque en la imagen cambia entre antes y después.
      frame.addEventListener("click", () => setPos(el.dataset.state === "before" ? 100 : 0, true));
    }
    frame.addEventListener("keydown", (e) => {
      const now = parseFloat(el.style.getPropertyValue("--pos"));
      if (e.key === "ArrowLeft") { setPos(now - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(now + 5); e.preventDefault(); }
    });
    $$("[data-to]", el).forEach((b) => b.addEventListener("click", () => setPos(+b.dataset.to, true)));
    // Al aparecer: la línea entra desde la derecha hasta la mitad
    new IntersectionObserver(([en], obs) => {
      if (en.isIntersecting) { setTimeout(() => setPos(50, true), 350); obs.disconnect(); }
    }, { threshold: 0.6 }).observe(el);
    setPos(100);
    return el;
  }

  /* ---- 5.2 Flyer animado (con sonido y barra de tiempo) ---- */
  function animatedCard(f) {
    const el = html(`
      <figure class="slide flyer" data-zoom="${f.video}" data-zoom-type="video">
        <div class="flyer__media">
          <video src="${f.video}" poster="${f.poster}" muted loop playsinline preload="none" data-autoplay></video>
          ${soundControl("data-flyer-sound", "sound-ctl--show")}
        </div>
        <figcaption><span>${esc(f.title)}</span><em>Animado</em></figcaption>
      </figure>`);
    const video = $("video", el);
    const btn = $("[data-flyer-sound]", el);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      video.volume = volume;
      if (!video.muted) video.play().catch(() => {});
      btn.classList.toggle("is-on", !video.muted);
      btn.parentElement.classList.toggle("is-on", !video.muted);
    });
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { video.preload = "auto"; video.play().catch(() => {}); }
      else { video.pause(); if (!video.muted) btn.click(); }
    }, { threshold: 0.4 }).observe(video);
    addScrubBar($(".flyer__media", el), video);
    return el;
  }

  /* ---- 5.3 Carrusel de flyers ---- */
  (DATA.flyers || []).forEach((f) => {
    const slide = f.video ? animatedCard(f)
      : f.before ? compareCard(f)
      : html(`
        <figure class="slide flyer" data-zoom="${f.src}">
          <div class="flyer__media"><img src="${f.src}" alt="Flyer ${esc(f.title)}" loading="lazy" /></div>
          <figcaption><span>${esc(f.title)}</span></figcaption>
        </figure>`);
    $("#flyer-track").appendChild(slide);
  });

  /* ---- 5.4 Miniaturas ----
     Las que tienen "stack" salen apiladas (como fotos acumuladas).
     Al tocar la pila se despliegan todas debajo. */
  const stackPanel = $("#stack-panel");
  (DATA.thumbnails || []).forEach((t) => {
    if (!t.stack) {
      $("#thumb-grid").appendChild(html(`
        <figure class="thumb reveal" data-zoom="${t.src}">
          <img src="${t.src}" alt="Miniatura ${esc(t.title)}" loading="lazy" />
          <figcaption>${esc(t.title)}</figcaption>
        </figure>`));
      return;
    }
    const layers = t.stack.slice(0, 3).reverse(); // la primera queda encima
    const el = html(`
      <figure class="thumb thumb--stack reveal">
        <button class="stack" aria-expanded="false" aria-controls="stack-panel">
          ${layers.map((it, i) => `<img class="stack__card stack__card--${layers.length - 1 - i}" src="${it.src}" alt="" loading="lazy" />`).join("")}
          <span class="stack__count">${t.stack.length}</span>
        </button>
        <figcaption>
          <span>${esc(t.title)}<small>${esc(t.note || "")}</small></span>
          <em class="stack__hint">Ver las ${t.stack.length} <i aria-hidden="true"></i></em>
        </figcaption>
      </figure>`);
    t.stack.forEach((it) => $("#stack-grid").appendChild(html(`
      <figure class="thumb" data-zoom="${it.src}">
        <img src="${it.src}" alt="Miniatura ${esc(t.title)} ${esc(it.title)}" loading="lazy" />
        <figcaption>${esc(it.title)}</figcaption>
      </figure>`)));
    const btn = $(".stack", el);
    const toggle = () => {
      const open = !el.classList.contains("is-open");
      el.classList.toggle("is-open", open);
      stackPanel.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open);
      $(".stack__hint", el).firstChild.textContent = open ? "Cerrar " : `Ver las ${t.stack.length} `;
    };
    btn.addEventListener("click", toggle);
    $(".stack__hint", el).addEventListener("click", toggle);
    $("#thumb-grid").appendChild(el);
  });
  // El panel va dentro de la fila: en computador sale debajo de todas,
  // en celular justo debajo de la pila (ver CSS "order")
  if (stackPanel) $("#thumb-grid").appendChild(stackPanel);

  /* =================================================================
     6. BRANDING
     ================================================================= */

  /* ---- 6.1 Logos: una tarjeta por marca, tocar = siguiente variación ---- */
  (DATA.logos || []).forEach((logo) => {
    const many = logo.images.length > 1;
    const card = html(`
      <figure class="brand reveal ${logo.dark ? "is-dark" : ""}" style="--card:${logo.bg}">
        <button class="brand__stage" aria-label="${many ? "Ver otra variación de " : ""}${esc(logo.name)}">
          ${logo.images.map((src, i) => `<img src="${src}" alt="Logo ${esc(logo.name)}" loading="lazy" class="${i === 0 ? "is-active" : ""}" />`).join("")}
          ${many ? `<span class="brand__dots">${logo.images.map((_, i) => `<i class="${i === 0 ? "is-active" : ""}"></i>`).join("")}</span>` : ""}
        </button>
        <figcaption><strong>${esc(logo.name)}</strong><span>${esc(logo.caption || "")}</span></figcaption>
      </figure>`);
    if (many) {
      let i = 0;
      const imgs = $$(".brand__stage img", card), dots = $$(".brand__dots i", card);
      const show = (n) => {
        i = (n + imgs.length) % imgs.length;
        imgs.forEach((im, k) => im.classList.toggle("is-active", k === i));
        dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
      };
      $(".brand__stage", card).addEventListener("click", () => show(i + 1));
      // en computador también cambia sola al pasar el cursor
      if (canHover) {
        let timer;
        card.addEventListener("mouseenter", () => { show(i + 1); timer = setInterval(() => show(i + 1), 1400); });
        card.addEventListener("mouseleave", () => clearInterval(timer));
      }
    } else {
      $(".brand__stage", card).dataset.zoom = logo.images[0];
    }
    $("#logo-grid").appendChild(card);
  });

  /* ---- 6.2 Caso de estudio ---- */
  const bc = DATA.brandCase;
  if (bc) {
    $("[data-case-title]").textContent = bc.title;
    $("[data-case-text]").textContent = bc.text;
    bc.pages.forEach((src, i) =>
      $("#case-track").appendChild(html(`<img src="${src}" alt="${esc(bc.title)} · página ${i + 1}" loading="lazy" data-zoom="${src}" />`)));
  } else $("#brand-case").remove();

  /* =================================================================
     7. SERVICIOS + WHATSAPP
     ================================================================= */
  const waLink = (what) =>
    `https://wa.me/${DATA.whatsapp}?text=${encodeURIComponent(`Hola Federico, vi tu portafolio y quiero cotizar ${what}.`)}`;
  (DATA.services || []).forEach((sv, i) =>
    $("#service-grid").appendChild(html(`
      <article class="service reveal">
        <span class="service__num">0${i + 1}</span>
        <h3 class="service__title">${esc(sv.title)}</h3>
        <p class="service__text">${esc(sv.text)}</p>
        <a class="service__cta" href="${waLink(sv.msg)}" target="_blank" rel="noopener">Cotizar <span aria-hidden="true">→</span></a>
      </article>`)));

  const waFloat = $("#wa-float");
  if (waFloat) {
    let pastHero = false, atContact = false;
    const update = () => waFloat.classList.toggle("is-visible", pastHero && !atContact);
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; update(); }).observe($(".hero"));
    new IntersectionObserver(([en]) => { atContact = en.isIntersecting; update(); }, { threshold: 0.2 }).observe($("#contacto"));
  }

  /* =================================================================
     8. LIGHTBOX, CARRUSELES Y ANIMACIONES
     ================================================================= */
  const lightbox = $("#lightbox");
  const lightboxContent = $(".lightbox__content", lightbox);
  let pausedByLightbox = [];
  const openLightbox = (src, type, alt = "") => {
    pausedByLightbox = $$("main video").filter((v) => !v.paused);
    pausedByLightbox.forEach((v) => v.pause());
    lightboxContent.innerHTML = type === "video"
      ? `<video src="${src}" controls autoplay loop playsinline></video>`
      : `<img src="${src}" alt="${esc(alt)}" />`;
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
    if (e.target.closest(".sound-ctl, .scrub")) return;
    const el = e.target.closest("[data-zoom]");
    if (!el) return;
    const img = el.matches("img") ? el : $("img", el);
    openLightbox(el.dataset.zoom, el.dataset.zoomType, img ? img.alt : "");
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.closest(".lightbox__close")) closeLightbox();
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  // Flechas de los carruseles: <button data-scroll="#id" data-dir="1">
  $$("[data-scroll]").forEach((b) => b.addEventListener("click", () => {
    const track = $(b.dataset.scroll);
    track.scrollBy({ left: +b.dataset.dir * track.clientWidth * 0.8 });
  }));

  // Aparición al hacer scroll (.reveal)
  const revealObserver = new IntersectionObserver((entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible");
      if (en.target._onReveal) en.target._onReveal();
      revealObserver.unobserve(en.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
    revealObserver.observe(el);
  });
})();
