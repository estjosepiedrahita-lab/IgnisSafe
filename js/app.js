/* ==========================================================================
   IGNIS SAFE · Lógica de la página
   Rutas (hash):  #/  #/cargando  #/practica  #/guia[/seccion]  #/como-usar
   ========================================================================== */
(function () {
  'use strict';

  const D = window.IGNIS_DATA;
  const app = document.getElementById('app');
  const overlayRoot = document.getElementById('overlay-root');

  /* ---------- utilidades ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = (list, id) => list.find((x) => x.id === id);

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* almacenamiento no disponible */ }
    return null;
  }

  /* ---------- iconos ---------- */
  const ICONS = {
    shield: '<path d="M12 3 5 6v5c0 4.7 2.9 8.5 7 10 4.1-1.5 7-5.3 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.6-4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 17 5-5 4 4 3-3 6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M5 12h14"/><path d="m14 7 5 5-5 5"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m10 7-5 5 5 5"/>',
    flame: '<path d="M12.8 3.3c.5 3.1-1.8 4.2-2.7 6.4-.7 1.7.1 2.9 1 3.6-.1-2 .9-3.3 2.4-4.7 2 1.6 3.5 3.8 3.5 6.3a5 5 0 0 1-10 0c0-3.6 2.4-7.2 5.8-11.6Z"/>',
    droplet: '<path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z"/>',
    wind: '<path d="M4 9h10c3 0 3-4 0-4-1.4 0-2 .8-2.3 1.5"/><path d="M4 13h14c3 0 3 4 0 4-1.4 0-2-.8-2.3-1.5"/>',
    beaker: '<path d="M9 3h6"/><path d="M10 3v6l-5 9c-.6 1 .1 3 2 3h10c1.9 0 2.6-2 2-3l-5-9V3"/><path d="M7 16h10"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M8 15h8"/><circle cx="11" cy="18" r=".6"/><circle cx="14" cy="17" r=".6"/>',
    pan: '<path d="M3 12h14v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z"/><path d="M17 13h4"/><path d="M8 4c0 2 2 2 2 4M12 4c0 2 2 2 2 4"/>',
    sparkles: '<path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"/><path d="m18 14 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14Z"/>',
    alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M18.5 16a8 8 0 1 1 .6-8.7L20 11"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
    pin: '<circle cx="7" cy="8" r="3"/><path d="m9.5 9.5 9 9M13 13l2-2M16 16l2-2"/>',
    nozzle: '<path d="M4 8h9l3 3-3 3H8"/><path d="m8 14-3 6M17 14l3 3"/>',
    press: '<path d="M7 13V8a1.5 1.5 0 0 1 3 0v3-5a1.5 1.5 0 0 1 3 0v5-4a1.5 1.5 0 0 1 3 0v5"/><path d="M7 11 5.5 9.5a1.5 1.5 0 0 0-2 2L8 18c1 1.5 2.5 2 4 2h2c3 0 5-2 5-5v-4a1.5 1.5 0 0 0-3 0"/>',
    sweep: '<path d="M4 12h16M7 8l-4 4 4 4M17 8l4 4-4 4"/><path d="M9 6c2-1 4-1 6 0M9 18c2 1 4 1 6 0"/>',
    book: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/>',
    extinguisher: '<path d="M9 7h7v14H8V9a2 2 0 0 1 2-2Z"/><path d="M11 7V4h4v3M10 4h7M17 4l3 2M8 12h8M6 20h12"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5"/><path d="M12 17h.01"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 21h4"/>',
    exit: '<path d="M14 4h5v16h-5"/><path d="M3 12h11"/><path d="m8 8-4 4 4 4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>'
  };

  function ic(name, size) {
    size = size || 20;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }

  function hydrateIcons(root) {
    $$('[data-icon]', root || document).forEach((el) => {
      el.innerHTML = ic(el.dataset.icon, parseInt(el.dataset.size, 10) || 20);
    });
  }

  /* ---------- banco de imágenes de la práctica ---------- */
  const CLASS_KEYS = ['A', 'B', 'C', 'D', 'F'];

  function getScenarios() {
    const custom = (window.IGNIS_SCENARIOS || []).filter((s) => s && s.src && D.FIRE_CLASSES[s.fireClass]);
    if (custom.length) {
      return custom.map((s, i) => ({
        id: s.id || ('img-' + i),
        src: s.src,
        fireClass: s.fireClass,
        alt: s.alt || 'Imagen de un incendio',
        placeholder: false
      }));
    }
    return CLASS_KEYS.map((k) => ({
      id: 'ejemplo-' + k,
      src: '',
      fireClass: k,
      alt: 'Ilustración de ejemplo de un fuego de Clase ' + k,
      placeholder: true
    }));
  }

  /* Baraja: recorre todas las imágenes en orden aleatorio antes de repetir, y
     nunca muestra la misma dos veces seguidas. */
  let bag = [];
  let lastId = '';
  function pickScenario() {
    const all = getScenarios();
    bag = bag.filter((s) => all.some((a) => a.id === s.id));
    if (!bag.length) {
      bag = shuffle(all);
      if (all.length > 1 && bag[bag.length - 1].id === lastId) bag.unshift(bag.pop());
    }
    const s = bag.pop();
    lastId = s.id;
    return s;
  }

  function shufflePass() {
    let order;
    do { order = shuffle(D.CORRECT_PASS); }
    while (order.every((id, i) => id === D.CORRECT_PASS[i]));
    return order;
  }

  /* Ilustración de ejemplo (se usa mientras no haya imágenes reales) */
  function sceneArt(cls, alt) {
    const objects = {
      A: '<rect x="95" y="190" width="110" height="24" rx="4" fill="#6b4a36"/><rect x="85" y="166" width="130" height="24" rx="4" fill="#80583f"/><rect x="105" y="142" width="90" height="24" rx="4" fill="#6b4a36"/>',
      B: '<rect x="108" y="150" width="84" height="72" rx="8" fill="#a33a35"/><rect x="120" y="136" width="30" height="16" rx="3" fill="#7d2b28"/><path d="M152 142h18l8 8" stroke="#7d2b28" stroke-width="6" fill="none"/><rect x="120" y="172" width="60" height="20" fill="#e8edf5" opacity=".85"/>',
      C: '<rect x="124" y="146" width="52" height="80" rx="20" fill="#3d5a73"/><rect x="140" y="132" width="20" height="16" rx="3" fill="#6c829e"/><rect x="132" y="170" width="36" height="14" fill="#a9bed6" opacity=".7"/>',
      D: '<path d="M92 222l18-50h80l18 50z" fill="#8a97a8"/><path d="M110 172h80l-8-16h-64z" fill="#b6c1cf"/>',
      F: '<ellipse cx="150" cy="206" rx="64" ry="14" fill="#2b3447"/><rect x="86" y="190" width="128" height="16" rx="6" fill="#3a4559"/><rect x="210" y="194" width="62" height="9" rx="4" fill="#2b3447"/>'
    };
    return '<svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(alt || '') + '">' +
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2744"/><stop offset="1" stop-color="#0f1a38"/></linearGradient>' +
      '<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e9833d" stop-opacity=".45"/><stop offset="1" stop-color="#e9833d" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="300" height="260" fill="url(#sky)"/><circle cx="150" cy="110" r="95" fill="url(#glow)"/>' +
      '<rect y="222" width="300" height="38" fill="#0b132b"/>' +
      (objects[cls] || '') +
      '<g transform="translate(90 34) scale(5)"><path d="M12.8 3.3c.5 3.1-1.8 4.2-2.7 6.4-.7 1.7.1 2.9 1 3.6-.1-2 .9-3.3 2.4-4.7 2 1.6 3.5 3.8 3.5 6.3a5 5 0 0 1-10 0c0-3.6 2.4-7.2 5.8-11.6Z" fill="#e9833d" stroke="#f6c177" stroke-width=".5" stroke-linejoin="round"/></g>' +
      '</svg>';
  }

  /* ---------- estado ---------- */
  const state = {
    scenario: null,
    passOrder: [],
    answerClass: '',
    extinguisher: '',
    pass: [],
    confirmed: false,
    selectedClass: null   // clase abierta en la guía
  };

  let cleanup = null;
  let pendingTour = false;

  function resetAnswers() {
    state.answerClass = '';
    state.extinguisher = '';
    state.pass = [];
    state.confirmed = false;
  }

  function startPractice() {
    resetAnswers();
    state.scenario = pickScenario();
    state.passOrder = shufflePass();
    go('#/cargando');
  }

  /* ---------- ilustraciones del método PASS ---------- */
  function passArt(id) {
    const accent = '#a9bed6';
    const body = '<rect x="40" y="46" width="36" height="62" rx="11" fill="#b8463f"/><rect x="40" y="70" width="36" height="16" fill="#e8edf5" opacity=".9"/><rect x="51" y="34" width="14" height="14" rx="3" fill="#2d3e5c"/><path d="M48 32h26l7 9" stroke="#2d3e5c" stroke-width="5" stroke-linecap="round" fill="none"/>';
    const hose = '<path d="M65 40c16 0 24 8 26 26" stroke="#1d2842" stroke-width="4" fill="none" stroke-linecap="round"/>';
    let extra = '';
    if (id === 'retirar') {
      extra = '<path d="M72 38h20" stroke="' + accent + '" stroke-width="3" stroke-linecap="round"/><circle cx="99" cy="38" r="7" stroke="' + accent + '" stroke-width="3" fill="none"/><path d="M92 56h22m-6-6 6 6-6 6" stroke="' + accent + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    } else if (id === 'dirigir') {
      extra = '<path d="M65 40c20 4 30 20 28 44" stroke="#1d2842" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="93" cy="86" r="4" fill="' + accent + '"/><path d="M93 92v8" stroke="' + accent + '" stroke-width="2.5" stroke-dasharray="3 4" stroke-linecap="round"/><path d="M93 118c-8 0-12-6-10-12 1-3 4-5 4-9 3 2 5 4 5 8 2-2 3-4 3-7 4 4 8 8 8 13 0 4-4 7-10 7Z" fill="#d48b72"/>';
    } else if (id === 'presionar') {
      extra = hose + '<path d="M56 8v18m-6-6 6 6 6-6" stroke="' + accent + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M48 32h26l7 9" stroke="' + accent + '" stroke-width="5" stroke-linecap="round" fill="none"/>';
    } else {
      extra = hose + '<path d="M91 66l22-12M91 66l25 4M91 66l22 18" stroke="#8fd0e8" stroke-width="2.5" stroke-linecap="round" opacity=".8"/><path d="M108 40c12 10 12 36 0 52" stroke="' + accent + '" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M108 40l-6 1m6-1 1 6M108 92l-6-1m6 1 1-6" stroke="' + accent + '" stroke-width="3" stroke-linecap="round" fill="none"/>';
    }
    return '<svg viewBox="0 0 128 120" role="img" aria-hidden="true" focusable="false">' + body + extra + '</svg>';
  }

  /* ---------- enrutador ---------- */
  const ROUTES = {
    '': { view: viewHome, title: 'Inicio' },
    'cargando': { view: viewLoading, title: 'Preparando la práctica' },
    'practica': { view: viewPractice, title: 'Modo práctica' },
    'guia': { view: viewGuide, title: 'Guía de seguridad' },
    'como-usar': { view: viewTutorial, title: 'Cómo usar la página' }
  };

  function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const parts = raw.split('/');
    return { route: parts[0] || '', sub: parts[1] || '' };
  }

  function go(hash) {
    if (window.location.hash === hash) render();
    else window.location.hash = hash;
  }

  function render() {
    if (typeof cleanup === 'function') { cleanup(); cleanup = null; }
    closeHelp();

    const parsed = parseHash();
    const def = ROUTES[parsed.route];
    if (!def) { window.location.replace('#/'); return; }

    /* Entrar a la práctica sin un caso preparado inicia uno nuevo */
    if (parsed.route === 'practica' && !state.scenario) { startPractice(); return; }

    document.title = def.title + ' · IGNIS SAFE';

    const result = def.view(parsed.sub);
    if (typeof result === 'function') cleanup = result;
    hydrateIcons(app);

    window.scrollTo(0, 0);
    if (parsed.sub && parsed.route === 'guia') {
      const target = document.getElementById(parsed.sub);
      if (target) window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } else {
      app.focus({ preventScroll: true });
    }

    if (parsed.route === '' && pendingTour) {
      pendingTour = false;
      window.setTimeout(() => runTour(0), 120);
    } else if (parsed.route === '') {
      maybeWelcome();
    }
  }

  /* ======================================================================
     PANTALLAS
     ====================================================================== */

  /* ---------- Inicio ---------- */
  function viewHome() {
    app.innerHTML = `
      <section class="home container">
        <div class="home-grid">
          <div class="hero-copy">
            <p class="eyebrow"><span class="eyebrow-dot"></span>Modo práctica</p>
            <h1>Asistente de Prevención <span class="h1-soft">de Incendios</span></h1>
            <p class="lead">Analiza una situación real, identifica el tipo de fuego y practica la respuesta adecuada en un entorno seguro.</p>
            <ul class="feature-list">
              <li><span class="feature-icon">${ic('image')}</span><span><strong>Casos para observar</strong><small>Imágenes de incendios elegidas al azar</small></span></li>
              <li><span class="feature-icon">${ic('shield')}</span><span><strong>Práctica guiada</strong><small>Extintores y método PASS</small></span></li>
            </ul>
            <ol class="how-strip" aria-label="Cómo funciona">
              <li><span class="how-n">1</span><span>Observa la imagen</span></li>
              <li><span class="how-n">2</span><span>Responde</span></li>
              <li><span class="how-n">3</span><span>Confirma y compara</span></li>
            </ol>
            <a class="text-link" href="#/como-usar">¿Primera vez? Mira cómo usar la página ${ic('arrow', 16)}</a>
          </div>

          <section class="start-panel card" id="start-panel" aria-labelledby="start-title">
            <div class="panel-head">
              <div>
                <p class="step-kicker">Modo práctica</p>
                <h2 id="start-title">Empieza la práctica</h2>
              </div>
            </div>
            <div class="start-zone">
              <div class="start-icon">${ic('flame', 30)}</div>
              <h3>Observa, decide y compara</h3>
              <p>El sistema te muestra la imagen de un incendio. Tú decides qué tipo de fuego es y cómo actuarías.</p>
              <button class="btn btn-primary btn-lg" type="button" data-action="start-practice">Comenzar práctica ${ic('arrow', 20)}</button>
              <small>Tres preguntas · Sin límite de tiempo</small>
            </div>
            <div class="panel-note">
              ${ic('shield', 16)}
              <p><strong>Práctica segura y confidencial</strong><span>Tus respuestas no se guardan ni se comparten.</span></p>
            </div>
          </section>
        </div>

        <article class="learning-entry card" id="learning-entry">
          <div class="learning-copy">
            <span class="learning-icon">${ic('book', 25)}</span>
            <div>
              <p class="eyebrow">Guía de seguridad</p>
              <h2>Aprende antes de practicar</h2>
              <p>Consulta las clases de fuego, los tipos de extintores y el método PASS.</p>
            </div>
          </div>
          <a class="btn btn-ghost" href="#/guia">Explorar guía ${ic('arrow', 17)}</a>
        </article>
      </section>`;
  }

  /* ---------- Carga ---------- */
  function viewLoading() {
    if (!state.scenario) {
      resetAnswers();
      state.scenario = pickScenario();
      state.passOrder = shufflePass();
    }
    const sc = state.scenario;

    app.innerHTML = `
      <section class="center-page loading-page">
        <div class="scanner" aria-hidden="true">
          <div class="scan-box">${ic('image', 54)}<span class="scan-line"></span></div>
          <span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>
        </div>
        <p class="eyebrow">Preparando la práctica</p>
        <h1 class="center-title">Seleccionando una imagen para ti…</h1>
        <p class="lead">Preparando el caso y las preguntas.</p>
        <div class="progress-block">
          <div class="progress-meta"><span>Cargando el caso</span><strong id="progress-pct">8%</strong></div>
          <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="8" id="progress-track"><span id="progress-bar" style="width:8%"></span></div>
        </div>
        <p class="security-note">${ic('shield', 16)} Tus respuestas se utilizan únicamente durante esta práctica.</p>
      </section>`;

    let progress = 8;
    let cancelled = false;
    const setProgress = (v) => {
      progress = v;
      const bar = $('#progress-bar'), pct = $('#progress-pct'), track = $('#progress-track');
      if (!bar) return;
      bar.style.width = v + '%';
      pct.textContent = v + '%';
      track.setAttribute('aria-valuenow', String(v));
    };
    const timer = window.setInterval(() => setProgress(Math.min(progress + 7, 94)), 120);
    const minWait = new Promise((r) => window.setTimeout(r, 1800));
    const preload = new Promise((resolve) => {
      if (!sc.src) { resolve(); return; }
      const im = new Image();
      im.onload = im.onerror = () => resolve();
      im.src = sc.src;
      window.setTimeout(resolve, 5000);
    });

    Promise.all([minWait, preload]).then(() => {
      if (cancelled) return;
      window.clearInterval(timer);
      setProgress(100);
      window.setTimeout(() => { if (!cancelled) go('#/practica'); }, 250);
    });

    return () => { cancelled = true; window.clearInterval(timer); };
  }

  /* ---------- Práctica ---------- */
  function viewPractice() {
    const sc = state.scenario;
    const image = sc.src
      ? '<img src="' + esc(sc.src) + '" alt="' + esc(sc.alt) + '">'
      : sceneArt(sc.fireClass, sc.alt);

    app.innerHTML = `
      <section class="practice container">
        <a class="backlink" href="#/">${ic('arrowLeft', 18)} Volver al inicio</a>
        <header class="page-head">
          <div>
            <p class="eyebrow">Modo práctica</p>
            <h1>Pon a prueba tus conocimientos</h1>
            <p class="lead">Observa la imagen y decide cómo actuar de forma segura.</p>
          </div>
          <div class="completion" aria-live="polite">
            <span id="completion-text">0 de 3</span>
            <div class="completion-bar"><i id="completion-bar" style="width:0%"></i></div>
          </div>
        </header>

        <div class="practice-layout">
          <aside class="side" id="side" aria-label="Caso de práctica">
            <div class="analysis-panel card">
              <div class="case-image" id="case-image">
                ${image}
                <span class="image-tag"><i></i> Caso de práctica${sc.placeholder ? ' · imagen de ejemplo' : ''}</span>
              </div>
              <p class="case-caption">Observa con calma: ¿qué está ardiendo y qué hay alrededor?</p>
            </div>
            <div id="reveal"></div>
          </aside>

          <div class="questions">
            <div class="step-bar"><span class="step-n">1</span><span>Pregunta 1 de 3 · Tipo de fuego</span></div>
            <article class="card question-card">
              <h2>¿Qué tipo de fuego es?</h2>
              <p class="muted">Fíjate en el material que está ardiendo.</p>
              <div class="class-options" id="class-options"></div>
            </article>

            <div class="step-bar"><span class="step-n">2</span><span>Pregunta 2 de 3 · Elección de extintor</span></div>
            <article class="card question-card">
              <h2>Elige el extintor más adecuado</h2>
              <p class="muted">Puedes cambiar tu respuesta hasta confirmar.</p>
              <div class="ext-options" id="ext-options"></div>
            </article>

            <div class="step-bar"><span class="step-n">3</span><span>Pregunta 3 de 3 · Método PASS</span></div>
            <article class="card pass-card" id="pass-card"></article>

            <div id="confirm-area"></div>
          </div>
        </div>
      </section>`;

    const img = $('#case-image img');
    if (img) {
      img.addEventListener('error', () => {
        img.insertAdjacentHTML('beforebegin', sceneArt(sc.fireClass, sc.alt));
        img.remove();
      });
    }

    renderClassOptions();
    renderExt();
    renderPass();
    renderConfirm();
    renderReveal();
    updateProgress();
  }

  function answersComplete() {
    return Boolean(state.answerClass && state.extinguisher && state.pass.length === 4);
  }

  function renderClassOptions(focusId) {
    const box = $('#class-options');
    if (!box) return;
    const cf = state.confirmed;
    box.innerHTML = CLASS_KEYS.map((k) => {
      const c = D.FIRE_CLASSES[k];
      const sel = state.answerClass === k;
      const real = state.scenario.fireClass === k;
      let cls = 'class-opt' + (sel ? ' selected' : '');
      let mark = sel ? ic('check', 14) : '';
      if (cf) {
        if (sel && real) cls += ' correct';
        else if (sel) { cls += ' incorrect'; mark = ic('alert', 14); }
        else if (real) cls += ' answer';
      }
      return `<button type="button" class="${cls}" data-action="answer-class" data-id="${k}" aria-pressed="${sel}" ${cf ? 'disabled' : ''}>
        <span class="opt-mark">${mark}</span>
        <span class="class-letter">${k}</span>
        <strong>${esc(c.title)}</strong>
        <small>${esc(c.examples)}</small>
        ${cf && real ? '<span class="opt-flag">Correcta</span>' : ''}
      </button>`;
    }).join('');
    if (focusId) { const b = $('[data-id="' + focusId + '"]', box); if (b) b.focus(); }
  }

  function renderExt(focusId) {
    const box = $('#ext-options');
    if (!box) return;
    const cf = state.confirmed;
    const fc = D.FIRE_CLASSES[state.scenario.fireClass];
    box.innerHTML = D.EXTINGUISHERS.map((e) => {
      const sel = state.extinguisher === e.id;
      const isBest = e.id === fc.best;
      const isOk = fc.ok.indexOf(e.id) !== -1;
      let cls = 'ext-opt' + (sel ? ' selected' : '');
      let mark = sel ? ic('check', 14) : '';
      let flag = '';
      if (cf) {
        if (sel) {
          if (isBest || isOk) cls += ' correct';
          else { cls += ' incorrect'; mark = ic('alert', 14); }
        } else if (isBest) cls += ' answer';
        flag = isBest ? 'Recomendado' : (isOk ? 'También válido' : '');
      }
      return `<button type="button" class="${cls}" data-action="pick-ext" data-id="${e.id}" aria-pressed="${sel}" ${cf ? 'disabled' : ''}>
        <span class="opt-mark">${mark}</span>
        <span class="ext-icon">${ic(e.icon, 20)}</span>
        <span class="ext-name">${esc(e.short)}</span>
        ${flag ? '<span class="opt-flag">' + flag + '</span>' : ''}
      </button>`;
    }).join('');
    if (focusId) { const b = $('[data-id="' + focusId + '"]', box); if (b) b.focus(); }
  }

  function renderPass(focusId) {
    const card = $('#pass-card');
    if (!card) return;
    const cf = state.confirmed;
    const items = state.passOrder.map((id) => {
      const step = byId(D.PASS_STEPS, id);
      const pos = state.pass.indexOf(id);
      const selected = pos >= 0;
      const right = cf && selected && D.CORRECT_PASS[pos] === id;
      const wrong = cf && selected && !right;
      const badge = right ? ic('check', 16) : wrong ? ic('alert', 16) : selected ? String(pos + 1) : '—';
      return `<button type="button" class="pass-opt${selected ? ' selected' : ''}${right ? ' correct' : ''}${wrong ? ' incorrect' : ''}" data-action="pass-pick" data-id="${id}" aria-pressed="${selected}" ${cf ? 'disabled' : ''}>
        <span class="pass-ico">${ic(step.icon, 24)}</span>
        <span class="pass-txt"><strong>${esc(step.label)}</strong><small>${selected ? 'Seleccionado en posición ' + (pos + 1) : 'Seleccionar'}</small></span>
        <span class="pass-badge">${badge}</span>
      </button>`;
    }).join('');

    card.innerHTML = `
      <div class="pass-head">
        <div>
          <h2>Aplica el Método PASS</h2>
          <p class="muted">Ordena los pasos correctamente para apagar el fuego de forma segura.</p>
        </div>
        <span class="pill">${state.pass.length}/4 pasos</span>
      </div>
      <p class="pass-instruction">Selecciona las acciones una a una en el orden en que las realizarías. Pulsa una acción seleccionada para quitarla.</p>
      <div class="pass-grid">${items}</div>
      ${cf ? '' : `<div class="pass-actions"><button type="button" class="btn btn-ghost" data-action="pass-reset" ${state.pass.length ? '' : 'disabled'}>Reiniciar</button></div>`}`;
    if (focusId) { const b = $('[data-id="' + focusId + '"]', card); if (b && !b.disabled) b.focus(); }
  }

  function renderConfirm() {
    const area = $('#confirm-area');
    if (!area) return;
    if (!state.confirmed) {
      area.innerHTML = `
        <div class="submit-row">
          <button class="btn btn-primary btn-lg" type="button" id="confirm-btn" data-action="confirm" disabled>Confirmar respuestas ${ic('check', 20)}</button>
          <p class="muted" id="confirm-hint"></p>
        </div>`;
    } else {
      area.innerHTML = `
        <div class="after-row">
          <button class="btn btn-primary btn-lg" type="button" data-action="new-practice">${ic('refresh', 20)} Practicar con otra imagen</button>
          <a class="btn btn-ghost" href="#/guia">${ic('book', 18)} Repasar la guía</a>
          <a class="btn btn-quiet" href="#/">${ic('home', 18)} Volver al inicio</a>
        </div>`;
    }
  }

  function updateProgress() {
    const done = (state.answerClass ? 1 : 0) + (state.extinguisher ? 1 : 0) + (state.pass.length === 4 ? 1 : 0);
    const t = $('#completion-text'), b = $('#completion-bar');
    if (t) t.textContent = done + ' de 3';
    if (b) b.style.width = (done / 3 * 100) + '%';
    const btn = $('#confirm-btn'), hint = $('#confirm-hint');
    if (btn) btn.disabled = done < 3;
    if (hint) {
      if (done === 3) hint.textContent = 'Todo listo. Confirma para ver las respuestas correctas.';
      else {
        const missing = [];
        if (!state.answerClass) missing.push('el tipo de fuego');
        if (!state.extinguisher) missing.push('el extintor');
        if (state.pass.length < 4) missing.push('el orden del método PASS');
        hint.textContent = 'Falta responder: ' + missing.join(', ') + '.';
      }
    }
  }

  function renderReveal() {
    const box = $('#reveal'), side = $('#side');
    if (!box || !side) return;
    if (!state.confirmed) { box.innerHTML = ''; side.classList.remove('revealed'); return; }
    side.classList.add('revealed');

    const sc = state.scenario;
    const fc = D.FIRE_CLASSES[sc.fireClass];
    const chosen = byId(D.EXTINGUISHERS, state.extinguisher);
    const best = byId(D.EXTINGUISHERS, fc.best);
    const mine = D.FIRE_CLASSES[state.answerClass];
    const isBest = chosen.id === fc.best;
    const isOk = fc.ok.indexOf(chosen.id) !== -1;
    const classOk = state.answerClass === sc.fireClass;
    const extOk = isBest || isOk;
    const passOk = D.CORRECT_PASS.every((id, i) => state.pass[i] === id);
    const score = (classOk ? 1 : 0) + (extOk ? 1 : 0) + (passOk ? 1 : 0);
    const alsoValid = fc.ok.map((id) => byId(D.EXTINGUISHERS, id).short);

    const classText = classOk
      ? 'Es un fuego de Clase ' + fc.key + ' (' + fc.detected.toLowerCase() + '). ' + fc.examples
      : 'Era un fuego de Clase ' + fc.key + ' (' + fc.detected.toLowerCase() + '), no de Clase ' + mine.key + '. ' + fc.examples;
    let extText;
    if (isBest) extText = fc.why;
    else if (isOk) extText = chosen.name + ' también es válido para la Clase ' + fc.key + ', aunque lo más adecuado es ' + best.name + '. ' + fc.why;
    else extText = chosen.name + ' no es la opción más segura aquí. ' + (chosen.id === 'agua' && fc.warning ? fc.warning + ' ' : '') + 'Lo recomendado es ' + best.name + '. ' + fc.why;

    const passList = D.CORRECT_PASS.map((id, i) => {
      const s = byId(D.PASS_STEPS, id);
      return '<li><span class="n">' + (i + 1) + '</span>' + esc(s.label) + '</li>';
    }).join('');
    const myPass = state.pass.map((id, i) => (i + 1) + '. ' + esc(byId(D.PASS_STEPS, id).short)).join(' · ');

    box.innerHTML = `
      <section class="reveal card" id="reveal-card" tabindex="-1" aria-live="polite" aria-label="Respuestas correctas">
        <div class="reveal-head">
          <div>
            <p class="kicker">Respuestas correctas</p>
            <h2>Revisemos tus decisiones</h2>
          </div>
          <div class="score-badge${score === 3 ? ' good' : ''}"><strong>${score}/3</strong><span>correctas</span></div>
        </div>

        <div class="reveal-row ${classOk ? 'ok' : 'bad'}">
          <p class="reveal-title">${classOk ? ic('check', 15) : ic('alert', 15)} Tipo de fuego</p>
          <div class="pair">
            <div><small>Tu respuesta</small><strong>Clase ${esc(mine.key)} · ${esc(mine.title)}</strong></div>
            <div class="right"><small>Respuesta correcta</small><strong>Clase ${esc(fc.key)} · ${esc(fc.title)}</strong></div>
          </div>
        </div>

        <div class="reveal-row ${extOk ? 'ok' : 'bad'}">
          <p class="reveal-title">${extOk ? ic('check', 15) : ic('alert', 15)} Extintor</p>
          <div class="pair">
            <div><small>Tu respuesta</small><strong>${esc(chosen.name)}</strong></div>
            <div class="right"><small>Extintor recomendado</small><strong>${esc(best.name)}</strong>${alsoValid.length ? '<small class="also">También válidos: ' + esc(alsoValid.join(', ')) + '</small>' : ''}</div>
          </div>
        </div>

        <div class="reveal-row ${passOk ? 'ok' : 'bad'}">
          <p class="reveal-title">${passOk ? ic('check', 15) : ic('alert', 15)} Método PASS</p>
          ${passOk ? '<p class="reveal-note">Tu orden fue correcto.</p>' : '<p class="reveal-note"><small>Tu orden</small>' + myPass + '</p>'}
          <small class="list-label">Orden correcto</small>
          <ol class="seq">${passList}</ol>
        </div>

        <div class="notice ${score === 3 ? 'success' : 'warn'} explain">
          <span class="notice-icon">${ic(score === 3 ? 'check' : 'alert', 20)}</span>
          <div><h3>¿Por qué?</h3><p>${esc(classText)}</p><p>${esc(extText)}</p></div>
        </div>
      </section>`;
  }

  function confirmAnswers() {
    if (!answersComplete() || state.confirmed) return;
    state.confirmed = true;
    renderClassOptions();
    renderExt();
    renderPass();
    renderConfirm();
    renderReveal();
    updateProgress();
    const side = $('#side'), card = $('#reveal-card');
    if (card) card.focus({ preventScroll: true });
    if (side) side.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Guía de seguridad ---------- */
  function sectionHead(n, kicker, title, text) {
    return `<div class="section-head"><span class="section-n">${n}</span><div><p class="eyebrow">${kicker}</p><h2>${title}</h2><p class="muted">${text}</p></div></div>`;
  }

  function viewGuide() {
    const classes = Object.keys(D.FIRE_CLASSES);
    app.innerHTML = `
      <section class="guide container">
        <a class="backlink first" href="#/">${ic('arrowLeft', 18)} Volver al inicio</a>
        <header class="hero-card">
          <div>
            <p class="eyebrow">Centro de aprendizaje</p>
            <h1>Prepárate antes de actuar</h1>
            <p class="lead">Reconoce el tipo de fuego, elige el extintor adecuado y aprende a utilizarlo con el método PASS.</p>
          </div>
          <div class="hero-mark">${ic('book', 40)}</div>
        </header>

        <section class="guide-section" id="tipos-fuego">
          ${sectionHead('01', 'Identifica el riesgo', 'Tipos de fuego', 'La clase indica qué material está ardiendo y determina cómo debes responder.')}
          <p class="hint-line">${ic('compass', 16)} Toca una clase para ver qué extintor sirve y cuál no.</p>
          <div class="fire-grid" id="fire-grid">
            ${classes.map((k) => { const c = D.FIRE_CLASSES[k]; return `
              <button type="button" class="fire-card" data-action="pick-class" data-class="${k}" aria-pressed="false">
                <span class="fire-letter">${k}</span>
                <h3>${esc(c.title)}</h3>
                <p>${esc(c.examples)}</p>
                <span class="fire-note">${ic('check', 14)}<span><strong>${esc(c.noteLabel)}:</strong> ${esc(c.note)}</span></span>
              </button>`; }).join('')}
          </div>
          <div class="class-detail" id="class-detail" aria-live="polite"></div>
        </section>

        <section class="guide-section" id="extintores">
          ${sectionHead('02', 'Elige el agente', 'Tipos de extintores', 'No todos los extintores funcionan para todos los combustibles.')}
          <div class="ext-guide" id="ext-guide">
            ${D.EXTINGUISHERS.map((e) => `
              <article class="ext-card" data-ext="${e.id}">
                <span class="ext-card-icon">${ic(e.icon, 24)}</span>
                <div class="ext-card-body">
                  <h3>${esc(e.name)}</h3>
                  <p>${esc(e.detail)}</p>
                  <p class="ext-caution">${ic('alert', 14)}<span>${esc(e.caution)}</span></p>
                </div>
                <div class="ext-card-side">
                  <div class="tags">${e.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
                  <span class="compat-badge" hidden></span>
                </div>
              </article>`).join('')}
          </div>
          <div class="notice warn">
            <span class="notice-icon">${ic('alert', 20)}</span>
            <p><strong>Equipos eléctricos energizados:</strong> no tienen clase propia en esta clasificación. Corta la energía si puedes hacerlo con seguridad y usa CO₂ o PQS; nunca agua ni espuma.</p>
          </div>
        </section>

        <section class="guide-section" id="metodo-pass">
          ${sectionHead('03', 'Actúa con seguridad', 'Método PASS', 'Cuatro acciones simples para operar un extintor de forma controlada.')}
          <ol class="pass-guide">
            ${D.CORRECT_PASS.map((id, i) => { const s = byId(D.PASS_STEPS, id); return `
              <li class="pass-guide-card">
                <div class="pass-guide-top"><span class="pass-word">${esc(s.letter)}-${esc(s.english.slice(1))}</span><small>Paso ${i + 1}</small></div>
                <h3>${esc(s.short)}</h3>
                <p>${esc(s.desc)}</p>
                <div class="pass-art">${passArt(id)}</div>
              </li>`; }).join('')}
          </ol>
          <div class="cta-row">
            <div><span class="cta-icon">${ic('shield', 24)}</span><p><strong>¿Listo para ponerlo en práctica?</strong><span>Observa una imagen y comprueba tus conocimientos.</span></p></div>
            <a class="btn btn-primary" href="#/practica">Ir al modo práctica ${ic('arrow', 18)}</a>
          </div>
        </section>

        <section class="guide-section" id="plan-de-accion">
          ${sectionHead('04', 'Si ocurre un incendio', 'Plan de acción', 'Tu seguridad va primero: el extintor es la última opción, no la primera.')}
          <ol class="plan-list">
            ${D.ACTION_PLAN.map((p, i) => `<li><span class="plan-n">${i + 1}</span><span class="plan-ico">${ic(p.icon, 22)}</span><div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div></li>`).join('')}
          </ol>
          <div class="two-col">
            <article class="card info-card">
              <h3>${ic('alert', 20)} Cuándo no combatir el fuego</h3>
              <ul>${D.DO_NOT_FIGHT.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            </article>
            <article class="card info-card">
              <h3>${ic('wind', 20)} Si hay humo</h3>
              <ul>${D.SMOKE_TIPS.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            </article>
          </div>
        </section>
      </section>`;

    updateClassDetail();
  }

  function updateClassDetail() {
    const key = state.selectedClass;
    const detail = $('#class-detail');
    if (!detail) return;
    $$('.fire-card').forEach((c) => {
      const on = c.dataset.class === key;
      c.classList.toggle('selected', on);
      c.setAttribute('aria-pressed', String(on));
    });
    const cards = $$('.ext-card');
    if (!key) {
      detail.innerHTML = '';
      detail.hidden = true;
      cards.forEach((c) => {
        c.classList.remove('compatible', 'incompatible');
        const b = $('.compat-badge', c); b.hidden = true;
      });
      return;
    }
    const fc = D.FIRE_CLASSES[key];
    const best = byId(D.EXTINGUISHERS, fc.best);
    const others = fc.ok.map((id) => byId(D.EXTINGUISHERS, id).short);
    detail.hidden = false;
    detail.innerHTML = `
      <div class="detail-main">
        <h3>Clase ${esc(key)} · ${esc(fc.title)}</h3>
        <p><strong>Mejor opción:</strong> ${esc(best.name)}${others.length ? '. <strong>También sirven:</strong> ' + esc(others.join(', ')) : ''}.</p>
        ${fc.warning ? `<p class="detail-warning">${ic('alert', 16)}<span><strong>No uses agua.</strong> ${esc(fc.warning)}</span></p>` : ''}
      </div>
      <button type="button" class="btn btn-ghost btn-sm" data-action="scroll-to" data-target="extintores">Ver extintores ${ic('arrow', 15)}</button>`;
    cards.forEach((c) => {
      const id = c.dataset.ext;
      const ext = byId(D.EXTINGUISHERS, id);
      const good = ext.classes.indexOf(key) !== -1;
      c.classList.toggle('compatible', good);
      c.classList.toggle('incompatible', !good);
      const b = $('.compat-badge', c);
      b.hidden = false;
      b.className = 'compat-badge ' + (good ? 'yes' : 'no');
      b.textContent = good ? (id === fc.best ? 'Mejor opción' : 'Sirve para Clase ' + key) : 'No usar en Clase ' + key;
    });
  }

  /* ---------- Cómo usar la página ---------- */
  function viewTutorial() {
    app.innerHTML = `
      <section class="tutorial container">
        <a class="backlink first" href="#/">${ic('arrowLeft', 18)} Volver al inicio</a>
        <header class="hero-card">
          <div>
            <p class="eyebrow">Guía de uso</p>
            <h1>Cómo usar esta página</h1>
            <p class="lead">Seis pasos, en este orden, para sacarle el máximo provecho: de leer la guía a comparar tus respuestas.</p>
            <div class="btn-row">
              <button class="btn btn-primary" type="button" data-action="start-tour">${ic('compass', 18)} Iniciar recorrido guiado</button>
              <a class="btn btn-ghost" href="#/practica">Ir directo a la práctica ${ic('arrow', 17)}</a>
            </div>
          </div>
          <div class="hero-mark">${ic('compass', 40)}</div>
        </header>

        <div class="tutorial-layout">
          <ol class="tutorial-steps">
            ${D.TUTORIAL_STEPS.map((s) => `
              <li class="t-step">
                <span class="t-n">${s.n}</span>
                <div class="t-body">
                  <p class="t-where">${esc(s.where)}</p>
                  <h2>${esc(s.title)}</h2>
                  <p><strong>Qué hace:</strong> ${esc(s.what)}</p>
                  <p><strong>Cómo se usa:</strong> ${esc(s.how)}</p>
                  ${s.cta ? `<a class="btn btn-ghost btn-sm" href="${s.href}">${esc(s.cta)} ${ic('arrow', 15)}</a>` : ''}
                </div>
              </li>`).join('')}
          </ol>
        </div>

        <section class="faq">
          <h2>Preguntas frecuentes</h2>
          ${D.FAQ.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
        </section>
      </section>`;
  }

  /* ======================================================================
     RECORRIDO GUIADO
     ====================================================================== */
  const TOUR = [
    { sel: ['#start-panel'], title: 'Empieza aquí', text: 'Pulsa «Comenzar práctica»: el sistema elige al azar la imagen de un incendio y te hace tres preguntas sobre cómo actuar.' },
    { sel: ['.how-strip'], title: 'Así se practica', text: 'Observas la imagen, respondes el tipo de fuego, el extintor y el método PASS, y al confirmar ves las respuestas correctas para compararlas con las tuyas.' },
    { sel: ['#learning-entry'], title: '¿Prefieres aprender primero?', text: 'La guía de seguridad explica los tipos de fuego, los extintores y el método PASS. Conviene leerla antes de practicar.' },
    { sel: ['#help-fab'], title: 'Ayuda y navegación', text: 'Este botón está en todas las pantallas. Desde aquí vas al inicio, a la práctica, a la guía, a este tutorial o reabres el recorrido.' }
  ];
  let tourIdx = -1;
  let tourOpen = false;

  function startTour() {
    closeHelp();
    closeWelcome();
    const p = parseHash();
    if (p.route !== '') {
      pendingTour = true;
      go('#/');
    } else {
      runTour(0);
    }
  }

  function runTour(i) {
    tourIdx = i;
    tourOpen = true;
    overlayRoot.innerHTML = `
      <div class="tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
        <div class="tour-spot"></div>
        <div class="tour-card">
          <p class="tour-count" id="tour-count"></p>
          <h2 id="tour-title"></h2>
          <p id="tour-text"></p>
          <div class="tour-actions">
            <button type="button" class="btn btn-quiet btn-sm" data-action="tour-skip">Omitir</button>
            <span class="spacer"></span>
            <button type="button" class="btn btn-ghost btn-sm" data-action="tour-prev" id="tour-prev">Anterior</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="tour-next" id="tour-next"></button>
          </div>
        </div>
      </div>`;
    updateTour();
  }

  function tourTarget(step) {
    for (let i = 0; i < step.sel.length; i++) {
      const el = $(step.sel[i]);
      if (el) {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.height > 0) return el;
      }
    }
    return null;
  }

  function updateTour() {
    const step = TOUR[tourIdx];
    $('#tour-count').textContent = 'Paso ' + (tourIdx + 1) + ' de ' + TOUR.length;
    $('#tour-title').textContent = step.title;
    $('#tour-text').textContent = step.text;
    $('#tour-prev').hidden = tourIdx === 0;
    $('#tour-next').textContent = tourIdx === TOUR.length - 1 ? 'Terminar' : 'Siguiente';
    const el = tourTarget(step);
    if (el) el.scrollIntoView({ block: 'center' });
    window.requestAnimationFrame(placeTour);
    $('#tour-next').focus({ preventScroll: true });
  }

  function placeTour() {
    if (!tourOpen) return;
    const tour = $('.tour');
    if (!tour) return;
    const spot = $('.tour-spot'), card = $('.tour-card');
    const el = tourTarget(TOUR[tourIdx]);
    if (el) {
      const r = el.getBoundingClientRect();
      const pad = 8;
      tour.classList.remove('no-target');
      spot.style.display = 'block';
      spot.style.top = (r.top - pad) + 'px';
      spot.style.left = (r.left - pad) + 'px';
      spot.style.width = (r.width + pad * 2) + 'px';
      spot.style.height = (r.height + pad * 2) + 'px';
      if (window.innerWidth < 700) { card.style.top = ''; card.style.left = ''; return; }
      const cw = card.offsetWidth, ch = card.offsetHeight;
      let top;
      if (r.bottom + 16 + ch < window.innerHeight) top = r.bottom + 16;
      else if (r.top - ch - 16 > 12) top = r.top - ch - 16;
      else top = window.innerHeight - ch - 16;
      const left = Math.min(Math.max(12, r.left), window.innerWidth - cw - 12);
      card.style.top = top + 'px';
      card.style.left = left + 'px';
    } else {
      tour.classList.add('no-target');
      spot.style.display = 'none';
      if (window.innerWidth < 700) { card.style.top = ''; card.style.left = ''; return; }
      card.style.top = Math.max(12, (window.innerHeight - card.offsetHeight) / 2) + 'px';
      card.style.left = Math.max(12, (window.innerWidth - card.offsetWidth) / 2) + 'px';
    }
  }

  function closeTour() {
    tourOpen = false;
    overlayRoot.innerHTML = '';
    store('ignis_welcome_seen', '1');
    const fab = $('#help-fab');
    if (fab) fab.focus({ preventScroll: true });
  }

  /* ---------- bienvenida (primera visita) ---------- */
  let welcomeShown = false;
  function maybeWelcome() {
    if (welcomeShown || tourOpen || store('ignis_welcome_seen')) return;
    welcomeShown = true;
    window.setTimeout(() => {
      const p = parseHash();
      if (tourOpen || (p.route !== '')) return;
      overlayRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <span class="modal-icon">${ic('shield', 28)}</span>
            <h2 id="welcome-title">Te damos la bienvenida a IGNIS SAFE</h2>
            <p>Aprende a identificar el tipo de fuego y a responder con seguridad. ¿Quieres un recorrido de un minuto por la página?</p>
            <div class="modal-actions">
              <button type="button" class="btn btn-primary" data-action="welcome-start" id="welcome-start">Iniciar recorrido</button>
              <button type="button" class="btn btn-ghost" data-action="welcome-skip">Ahora no</button>
            </div>
          </div>
        </div>`;
      const b = $('#welcome-start');
      if (b) b.focus();
    }, 700);
  }

  function closeWelcome() {
    if ($('.modal-backdrop')) overlayRoot.innerHTML = '';
    store('ignis_welcome_seen', '1');
  }

  /* ---------- menú de ayuda ---------- */
  function closeHelp() {
    const m = $('#help-menu'), f = $('#help-fab');
    if (m) m.hidden = true;
    if (f) f.setAttribute('aria-expanded', 'false');
  }
  function toggleHelp() {
    const m = $('#help-menu'), f = $('#help-fab');
    const open = m.hidden;
    m.hidden = !open;
    f.setAttribute('aria-expanded', String(open));
  }

  /* ======================================================================
     EVENTOS GLOBALES
     ====================================================================== */
  document.addEventListener('click', (e) => {
    if (e.target.closest('#help-fab')) { toggleHelp(); return; }
    if (e.target.closest('#help-menu a')) closeHelp();
    else if (!e.target.closest('#help')) closeHelp();

    const t = e.target.closest('[data-action]');
    if (!t || t.disabled) return;
    const id = t.dataset.id;

    switch (t.dataset.action) {
      case 'start-practice': startPractice(); break;
      case 'new-practice': startPractice(); break;
      case 'scroll-to': {
        const el = document.getElementById(t.dataset.target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'pick-class':
        state.selectedClass = state.selectedClass === t.dataset.class ? null : t.dataset.class;
        updateClassDetail();
        break;
      case 'answer-class':
        if (state.confirmed) break;
        state.answerClass = id;
        renderClassOptions(id);
        updateProgress();
        break;
      case 'pick-ext':
        if (state.confirmed) break;
        state.extinguisher = id;
        renderExt(id);
        updateProgress();
        break;
      case 'pass-pick':
        if (state.confirmed) break;
        state.pass = state.pass.indexOf(id) >= 0 ? state.pass.filter((x) => x !== id) : state.pass.concat(id);
        renderPass(id);
        updateProgress();
        break;
      case 'pass-reset':
        if (state.confirmed) break;
        state.pass = [];
        renderPass();
        updateProgress();
        break;
      case 'confirm': confirmAnswers(); break;
      case 'start-tour': startTour(); break;
      case 'tour-next':
        if (tourIdx >= TOUR.length - 1) closeTour();
        else { tourIdx++; updateTour(); }
        break;
      case 'tour-prev':
        if (tourIdx > 0) { tourIdx--; updateTour(); }
        break;
      case 'tour-skip': closeTour(); break;
      case 'welcome-start': startTour(); break;
      case 'welcome-skip': closeWelcome(); break;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (tourOpen) closeTour();
      else if ($('.modal-backdrop')) closeWelcome();
      else closeHelp();
    } else if (tourOpen && e.key === 'ArrowRight') {
      if (tourIdx < TOUR.length - 1) { tourIdx++; updateTour(); }
    } else if (tourOpen && e.key === 'ArrowLeft') {
      if (tourIdx > 0) { tourIdx--; updateTour(); }
    }
  });

  window.addEventListener('resize', placeTour);
  window.addEventListener('scroll', () => { if (tourOpen) placeTour(); }, { passive: true });
  window.addEventListener('hashchange', render);

  hydrateIcons(document);
  render();
})();
