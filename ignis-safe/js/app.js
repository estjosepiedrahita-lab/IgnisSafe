/* ==========================================================================
   IGNIS SAFE · Lógica de la página
   Rutas (hash):  #/  #/analisis  #/analizando  #/practica  #/resultados
                  #/prevencion  #/guia[/seccion]  #/como-usar
   ========================================================================== */
(function () {
  'use strict';

  const D = window.IGNIS_DATA;
  const Analyzer = window.FireAnalyzer;
  const app = document.getElementById('app');
  const overlayRoot = document.getElementById('overlay-root');

  /* ---------- utilidades ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = (list, id) => list.find((x) => x.id === id);

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
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 15v4h14v-4"/>',
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
    leaf: '<path d="M20 4c-8 0-14 3-14 9 0 3 2 5 5 5 6 0 9-6 9-14Z"/><path d="M4 21c2-5 6-9 12-12"/>',
    alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M18.5 16a8 8 0 1 1 .6-8.7L20 11"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
    pin: '<circle cx="7" cy="8" r="3"/><path d="m9.5 9.5 9 9M13 13l2-2M16 16l2-2"/>',
    nozzle: '<path d="M4 8h9l3 3-3 3H8"/><path d="m8 14-3 6M17 14l3 3"/>',
    press: '<path d="M7 13V8a1.5 1.5 0 0 1 3 0v3-5a1.5 1.5 0 0 1 3 0v5-4a1.5 1.5 0 0 1 3 0v5"/><path d="M7 11 5.5 9.5a1.5 1.5 0 0 0-2 2L8 18c1 1.5 2.5 2 4 2h2c3 0 5-2 5-5v-4a1.5 1.5 0 0 0-3 0"/>',
    sweep: '<path d="M4 12h16M7 8l-4 4 4 4M17 8l4 4-4 4"/><path d="M9 6c2-1 4-1 6 0M9 18c2 1 4 1 6 0"/>',
    book: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/>',
    extinguisher: '<path d="M9 7h7v14H8V9a2 2 0 0 1 2-2Z"/><path d="M11 7V4h4v3M10 4h7M17 4l3 2M8 12h8M6 20h12"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5"/><path d="M12 17h.01"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 21h4"/>',
    exit: '<path d="M14 4h5v16h-5"/><path d="M3 12h11"/><path d="m8 8-4 4 4 4"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>'
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

  /* ---------- estado ---------- */
  const state = {
    file: null,
    previewUrl: '',
    result: null,
    extinguisher: '',
    pass: [],
    validation: 'idle',
    submitted: false,
    selectedClass: null
  };

  let cleanup = null;
  let analysisToken = 0;
  let pendingTour = false;

  function resetPractice() {
    state.result = null;
    state.extinguisher = '';
    state.pass = [];
    state.validation = 'idle';
    state.submitted = false;
  }

  function clearFile() {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    state.file = null;
    state.previewUrl = '';
  }

  function resetAll() {
    resetPractice();
    clearFile();
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
    '': { view: viewHome, title: 'Inicio', nav: '' },
    'analisis': { view: viewHome, title: 'Analizar imagen', nav: 'analisis' },
    'guia': { view: viewGuide, title: 'Guía de seguridad', nav: 'guia' },
    'como-usar': { view: viewTutorial, title: 'Cómo usar la página', nav: 'como-usar' },
    'analizando': { view: viewLoading, title: 'Analizando imagen', nav: 'analisis' },
    'practica': { view: viewPractice, title: 'Modo análisis', nav: 'analisis' },
    'resultados': { view: viewResults, title: 'Resultados de la práctica', nav: 'analisis' },
    'prevencion': { view: viewPrevention, title: 'Resultado: sin fuego', nav: 'analisis' }
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
    closeMenu();

    const parsed = parseHash();
    const def = ROUTES[parsed.route];
    if (!def) { window.location.replace('#/'); return; }

    /* Protecciones: cada pantalla exige haber pasado por la anterior */
    if (parsed.route === 'analizando' && !state.file) { window.location.replace('#/analisis'); return; }
    if (parsed.route === 'practica' && !(state.result && state.result.fire)) { window.location.replace(state.file ? '#/analizando' : '#/analisis'); return; }
    if (parsed.route === 'resultados' && !state.submitted) { window.location.replace(state.result && state.result.fire ? '#/practica' : '#/analisis'); return; }

    document.title = def.title + ' · IGNIS SAFE';
    $$('#main-nav a').forEach((a) => {
      if (a.dataset.nav === def.nav) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    const result = def.view(parsed.sub, parsed.route);
    if (typeof result === 'function') cleanup = result;
    hydrateIcons(app);

    window.scrollTo(0, 0);
    if (parsed.sub && parsed.route === 'guia') {
      const target = document.getElementById(parsed.sub);
      if (target) window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } else if (parsed.route === 'analisis') {
      const panel = $('#upload-panel');
      if (panel) window.setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
    if (!parsed.sub && parsed.route !== 'analisis') app.focus({ preventScroll: true });

    if ((parsed.route === '' || parsed.route === 'analisis') && pendingTour) {
      pendingTour = false;
      window.setTimeout(() => runTour(0), 120);
    } else if (parsed.route === '') {
      maybeWelcome();
    }
  }

  /* ======================================================================
     PANTALLAS
     ====================================================================== */

  /* ---------- Inicio / subir imagen ---------- */
  function viewHome() {
    app.innerHTML = `
      <section class="home container">
        <div class="home-grid">
          <div class="hero-copy">
            <p class="eyebrow"><span class="eyebrow-dot"></span>Modo análisis</p>
            <h1>Asistente de Prevención <span class="h1-soft">de Incendios</span></h1>
            <p class="lead">Analiza una situación real, identifica el tipo de fuego y practica la respuesta adecuada en un entorno seguro.</p>
            <ul class="feature-list">
              <li><span class="feature-icon">${ic('image')}</span><span><strong>Análisis visual</strong><small>Procesamiento inteligente de imágenes</small></span></li>
              <li><span class="feature-icon">${ic('shield')}</span><span><strong>Práctica guiada</strong><small>Extintores y método PASS</small></span></li>
            </ul>
            <ol class="how-strip" aria-label="Cómo funciona">
              <li><span class="how-n">1</span><span>Sube una imagen</span></li>
              <li><span class="how-n">2</span><span>Elige el extintor</span></li>
              <li><span class="how-n">3</span><span>Ordena el método PASS</span></li>
            </ol>
            <a class="text-link" href="#/como-usar">¿Primera vez? Mira cómo usar la página ${ic('arrow', 16)}</a>
          </div>

          <section class="upload-panel card" id="upload-panel" aria-labelledby="upload-title">
            <div class="panel-head">
              <div>
                <p class="step-kicker">Paso 1 de 3</p>
                <h2 id="upload-title">Sube una imagen</h2>
              </div>
              <span class="lock">${ic('shield', 16)} Privado</span>
            </div>
            <div class="drop-zone" id="drop-zone">
              <input type="file" id="file-input" accept="image/png,image/jpeg,image/webp" hidden>
              <div class="upload-icon">${ic('upload', 30)}</div>
              <h3>Arrastra tu imagen aquí</h3>
              <p>o selecciona un archivo desde tu dispositivo</p>
              <button class="btn btn-primary" type="button" id="pick-file">Seleccionar imagen</button>
              <small>JPG, PNG o WEBP · Máximo 10 MB</small>
            </div>
            <p class="form-error" id="upload-error" role="alert" hidden></p>
            <div class="upload-footer">
              ${ic('shield', 16)}
              <p><strong>Práctica segura y confidencial</strong><span>Tu imagen no se almacena ni se comparte.</span></p>
            </div>
            <button class="no-fire-link" type="button" data-action="go" data-go="#/prevencion">Ver ejemplo sin presencia de fuego ${ic('arrow', 15)}</button>
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

    const zone = $('#drop-zone');
    const input = $('#file-input');
    $('#pick-file').addEventListener('click', (e) => { e.stopPropagation(); input.click(); });
    zone.addEventListener('click', (e) => { if (e.target === zone || e.target.closest('h3, p, .upload-icon, small')) input.click(); });
    input.addEventListener('change', () => {
      const f = input.files && input.files[0];
      input.value = '';
      if (f) startAnalysis(f);
    });
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragging'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragging');
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) startAnalysis(f);
    });
  }

  function uploadError(msg) {
    const el = $('#upload-error');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }

  function startAnalysis(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.indexOf(file.type) === -1) { uploadError('Ese formato no es compatible. Sube una imagen JPG, PNG o WEBP.'); return; }
    if (file.size > 10 * 1024 * 1024) { uploadError('La imagen supera los 10 MB. Elige un archivo más liviano.'); return; }
    resetAll();
    state.file = file;
    state.previewUrl = URL.createObjectURL(file);
    go('#/analizando');
  }

  /* ---------- Analizando ---------- */
  function viewLoading() {
    app.innerHTML = `
      <section class="center-page loading-page">
        <div class="scanner" aria-hidden="true">
          <div class="scan-box">${ic('image', 54)}<span class="scan-line"></span></div>
          <span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>
        </div>
        <p class="eyebrow">Análisis en curso</p>
        <h1 class="center-title">Analizando imagen con procesamiento de imágenes…</h1>
        <p class="lead" id="loading-text">Detectando presencia de fuego y clasificando material.</p>
        <div class="progress-block" id="progress-block">
          <div class="progress-meta"><span>Procesando patrones visuales</span><strong id="progress-pct">8%</strong></div>
          <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="8" id="progress-track"><span id="progress-bar" style="width:8%"></span></div>
        </div>
        <div class="error-box" id="analysis-error" hidden role="alert">
          <p><strong>No pudimos analizar la imagen.</strong><span id="analysis-error-msg"></span></p>
          <div class="btn-row">
            <button class="btn btn-primary" type="button" data-action="retry-analysis">${ic('refresh', 18)} Reintentar</button>
            <a class="btn btn-ghost" href="#/analisis">Elegir otra imagen</a>
          </div>
        </div>
        <p class="security-note">${ic('shield', 16)} Tu imagen se utiliza únicamente durante esta práctica.</p>
      </section>`;

    const token = ++analysisToken;
    let progress = 8;
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

    Promise.all([Promise.resolve().then(() => Analyzer.analyze(state.file)), minWait])
      .then((out) => {
        if (token !== analysisToken) return;
        window.clearInterval(timer);
        const res = out[0];
        if (!res || typeof res.fire !== 'boolean') throw new Error('La respuesta del analizador no tiene el formato esperado.');
        if (res.fire && !D.FIRE_CLASSES[res.fireClass]) throw new Error('El analizador devolvió una clase de fuego desconocida.');
        setProgress(100);
        state.result = {
          fire: res.fire,
          fireClass: res.fire ? res.fireClass : null,
          confidence: Math.max(0, Math.min(1, Number(res.confidence) || 0)),
          demo: !!res.demo
        };
        window.setTimeout(() => {
          if (token !== analysisToken) return;
          go(res.fire ? '#/practica' : '#/prevencion');
        }, 250);
      })
      .catch((err) => {
        if (token !== analysisToken) return;
        window.clearInterval(timer);
        $('#progress-block').hidden = true;
        $('#loading-text').hidden = true;
        $('#analysis-error-msg').textContent = ' ' + (err && err.message ? err.message : 'Intenta de nuevo en unos segundos.');
        $('#analysis-error').hidden = false;
      });

    return () => { window.clearInterval(timer); analysisToken++; };
  }

  /* ---------- Sin fuego / prevención ---------- */
  function viewPrevention() {
    const tips = D.PREVENTION.slice(0, 3);
    app.innerHTML = `
      <section class="center-page prevention-page">
        <div class="success-icon">${ic('check', 34)}</div>
        <p class="eyebrow">Resultado del análisis</p>
        <h1 class="center-title">No se detectó fuego en la imagen</h1>
        <p class="lead">El entorno parece seguro. Aun así, la prevención comienza con pequeñas revisiones cotidianas.</p>
        ${state.result && state.result.demo ? '<p class="demo-badge">Resultado de demostración · el analizador aún no está conectado</p>' : ''}
        <div class="tips-grid">
          ${tips.map((t, i) => `<article class="card tip"><span class="tip-n">0${i + 1}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></article>`).join('')}
        </div>
        <div class="btn-row center">
          <button class="btn btn-ghost" type="button" data-action="new-analysis">${ic('home', 20)} Volver al inicio</button>
          <a class="btn btn-quiet" href="#/guia/prevencion">Ver la lista completa de prevención ${ic('arrow', 16)}</a>
        </div>
      </section>`;
  }

  /* ---------- Práctica ---------- */
  function viewPractice() {
    const r = state.result;
    const fc = D.FIRE_CLASSES[r.fireClass];
    const pct = Math.round(r.confidence * 100);
    app.innerHTML = `
      <section class="practice container">
        <header class="page-head">
          <div>
            <p class="eyebrow">Modo análisis</p>
            <h1>Pon a prueba tus conocimientos</h1>
            <p class="lead">Interpreta el resultado y decide cómo actuar de forma segura.</p>
          </div>
          <div class="completion" aria-live="polite">
            <span id="completion-text">0 de 2</span>
            <div class="completion-bar"><i id="completion-bar" style="width:0%"></i></div>
          </div>
        </header>

        <div class="practice-layout">
          <aside class="analysis-panel card" aria-label="Resultado del análisis">
            <div class="uploaded-image">
              ${state.previewUrl ? `<img src="${esc(state.previewUrl)}" alt="Imagen subida para el análisis">` : ic('image', 44)}
              <span class="image-tag"><i></i> Imagen analizada</span>
            </div>
            <div class="detection">
              <span class="detection-icon">${ic('flame', 22)}</span>
              <div>
                <p class="kicker-red">Fuego detectado</p>
                <h2>Clase ${esc(fc.key)}</h2>
                <p>${esc(fc.detected)}</p>
              </div>
            </div>
            <p class="confidence"><span>Confianza del análisis</span><strong>${pct}%</strong></p>
            <div class="confidence-bar"><span style="width:${pct}%"></span></div>
            <p class="analysis-caption">El sistema identificó patrones compatibles con ${esc(fc.detected.toLowerCase())}.</p>
            ${r.demo ? '<p class="demo-badge small">Resultado de demostración · analizador no conectado</p>' : ''}
            <button class="btn btn-quiet btn-block" type="button" data-action="new-analysis">${ic('refresh', 17)} Cambiar de imagen</button>
          </aside>

          <div class="questions">
            <div class="step-bar"><span class="step-n">2</span><span>Paso 2 de 3 · Elección de extintor</span></div>
            <article class="card question-card">
              <h2>Elige el extintor más adecuado</h2>
              <p class="muted">Piensa en el material que arde. Puedes cambiar tu respuesta antes de continuar.</p>
              <div class="ext-options" id="ext-options"></div>
            </article>

            <div class="step-bar"><span class="step-n">3</span><span>Paso 3 de 3 · Método PASS</span></div>
            <article class="card pass-card" id="pass-card"></article>

            <div class="submit-row">
              <button class="btn btn-primary btn-lg" type="button" id="submit-btn" data-action="submit" disabled>Ver resultado de la práctica ${ic('arrow', 20)}</button>
              <p class="muted" id="submit-hint">Elige un extintor y ordena los cuatro pasos para continuar.</p>
            </div>
          </div>
        </div>
      </section>`;
    renderExt();
    renderPass();
    updateProgress();
  }

  function renderExt(focusId) {
    const box = $('#ext-options');
    if (!box) return;
    box.innerHTML = D.EXTINGUISHERS.map((e) => {
      const sel = state.extinguisher === e.id;
      return `<button type="button" class="ext-opt${sel ? ' selected' : ''}" data-action="pick-ext" data-id="${e.id}" aria-pressed="${sel}">
        <span class="ext-icon">${ic(e.icon, 20)}</span>
        <span class="ext-name">${esc(e.short)}</span>
        <span class="ext-mark">${sel ? ic('check', 14) : ''}</span>
      </button>`;
    }).join('');
    if (focusId) { const b = $('[data-id="' + focusId + '"]', box); if (b) b.focus(); }
  }

  function renderPass(focusId) {
    const card = $('#pass-card');
    if (!card) return;
    const val = state.validation;
    const items = D.PASS_SHUFFLED.map((id) => {
      const step = byId(D.PASS_STEPS, id);
      const pos = state.pass.indexOf(id);
      const selected = pos >= 0;
      const right = val !== 'idle' && selected && D.CORRECT_PASS[pos] === id;
      const wrong = val === 'incorrect' && selected && !right;
      const badge = right ? ic('check', 16) : wrong ? ic('alert', 16) : selected ? String(pos + 1) : '—';
      return `<button type="button" class="pass-opt${selected ? ' selected' : ''}${right ? ' correct' : ''}${wrong ? ' incorrect' : ''}" data-action="pass-pick" data-id="${id}" aria-pressed="${selected}">
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
      ${val === 'incorrect' ? `<div class="notice error" role="alert">${ic('alert', 20)}<p><strong>Revisa el orden.</strong> Recuerda: primero retiras el pasador, luego apuntas a la base.</p></div>` : ''}
      ${val === 'correct' ? `<div class="notice success" role="status">${ic('check', 20)}<p><strong>Secuencia correcta.</strong> Ya conoces los cuatro pasos para actuar con seguridad.</p></div>` : ''}
      <div class="pass-actions">
        <button type="button" class="btn btn-ghost" data-action="pass-reset" ${state.pass.length ? '' : 'disabled'}>Reiniciar</button>
        <button type="button" class="btn btn-primary" data-action="pass-check" ${state.pass.length === 4 ? '' : 'disabled'}>Comprobar orden ${ic('check', 17)}</button>
      </div>`;
    if (focusId) { const b = $('[data-id="' + focusId + '"]', card); if (b) b.focus(); }
  }

  function updateProgress() {
    const done = (state.extinguisher ? 1 : 0) + (state.pass.length === 4 ? 1 : 0);
    const t = $('#completion-text'), b = $('#completion-bar'), s = $('#submit-btn'), h = $('#submit-hint');
    if (t) t.textContent = done + ' de 2';
    if (b) b.style.width = (done / 2 * 100) + '%';
    if (s) s.disabled = done < 2;
    if (h) {
      if (done === 2) h.textContent = 'Todo listo. Puedes ver tu resultado.';
      else if (!state.extinguisher && state.pass.length < 4) h.textContent = 'Elige un extintor y ordena los cuatro pasos para continuar.';
      else if (!state.extinguisher) h.textContent = 'Falta elegir el extintor.';
      else h.textContent = 'Falta ordenar los cuatro pasos del método PASS.';
    }
  }

  /* ---------- Resultados ---------- */
  function viewResults() {
    const fc = D.FIRE_CLASSES[state.result.fireClass];
    const chosen = byId(D.EXTINGUISHERS, state.extinguisher);
    const best = byId(D.EXTINGUISHERS, fc.best);
    const isBest = chosen.id === fc.best;
    const isOk = fc.ok.indexOf(chosen.id) !== -1;
    const extOk = isBest || isOk;
    const passOk = D.CORRECT_PASS.every((id, i) => state.pass[i] === id);
    const score = (extOk ? 1 : 0) + (passOk ? 1 : 0);
    const alsoValid = fc.ok.map((id) => byId(D.EXTINGUISHERS, id).short);

    let explanation;
    if (isBest) {
      explanation = fc.why;
    } else if (isOk) {
      explanation = chosen.name + ' también es una opción válida para fuegos de Clase ' + fc.key + '. La más adecuada es ' + best.name + ': ' + fc.why;
    } else {
      explanation = chosen.name + ' no es la opción más segura para este escenario. ' +
        (chosen.id === 'agua' && fc.warning ? fc.warning + ' ' : '') +
        'Lo recomendado es ' + best.name + ': ' + fc.why;
    }

    app.innerHTML = `
      <section class="results container">
        <header class="page-head">
          <div>
            <p class="eyebrow">Resultados de la práctica</p>
            <h1>Revisemos tus decisiones</h1>
            <p class="lead">Compara tu respuesta con el análisis y refuerza el procedimiento.</p>
          </div>
          <div class="score-badge${score === 2 ? ' good' : ''}"><strong>${score}/2</strong><span>decisiones correctas</span></div>
        </header>

        <div class="compare-grid">
          <article class="card compare">
            <p class="kicker">Sistema detectó</p>
            <h3>Clase ${esc(fc.key)}</h3>
            <p>${esc(fc.detected)}</p>
          </article>
          <article class="card compare ${extOk ? 'ok' : 'bad'}">
            <p class="kicker">${extOk ? ic('check', 15) : ic('alert', 15)} Tu elección</p>
            <h3>${esc(chosen.short)}</h3>
            <p>${isBest ? 'Es la opción recomendada' : isOk ? 'Opción válida' : 'No es la más segura aquí'}</p>
          </article>
          <article class="card compare best">
            <p class="kicker">${ic('check', 15)} Respuesta recomendada</p>
            <h3>${esc(best.short)}</h3>
            <p>Extintor recomendado${alsoValid.length ? ' · también válidos: ' + esc(alsoValid.join(', ')) : ''}</p>
          </article>
        </div>

        <div class="notice ${extOk ? 'success' : 'warn'} explain">
          <span class="notice-icon">${ic(extOk ? 'check' : 'alert', 20)}</span>
          <div><h2>¿Por qué?</h2><p>${esc(explanation)}</p></div>
        </div>

        <article class="card pass-review">
          <div>
            <p class="kicker">Método PASS</p>
            <h2>${passOk ? 'Secuencia correcta' : 'Revisa la secuencia'}</h2>
            ${passOk ? '' : `<p class="muted">Tu orden: ${state.pass.map((id, i) => (i + 1) + '. ' + esc(byId(D.PASS_STEPS, id).short)).join(' · ')}</p>`}
          </div>
          <ol class="pass-flow">
            ${D.CORRECT_PASS.map((id) => { const s = byId(D.PASS_STEPS, id); return `<li><span class="flow-ico">${ic(s.icon, 20)}</span><span><strong>${esc(s.letter)}-${esc(s.english.slice(1))}</strong>${esc(s.label)}</span></li>`; }).join('')}
          </ol>
        </article>

        <div class="btn-row">
          <button class="btn btn-primary" type="button" data-action="new-analysis">${ic('refresh', 18)} Analizar otra imagen</button>
          <button class="btn btn-ghost" type="button" data-action="go" data-go="#/guia">${ic('book', 18)} Repasar la guía</button>
          <button class="btn btn-quiet" type="button" data-action="go" data-go="#/">${ic('home', 18)} Volver al inicio</button>
        </div>
      </section>`;
  }

  /* ---------- Guía de seguridad ---------- */
  function sectionHead(n, kicker, title, text) {
    return `<div class="section-head"><span class="section-n">${n}</span><div><p class="eyebrow">${kicker}</p><h2>${title}</h2><p class="muted">${text}</p></div></div>`;
  }

  function viewGuide() {
    const classes = Object.keys(D.FIRE_CLASSES);
    app.innerHTML = `
      <section class="guide container">
        <header class="hero-card">
          <div>
            <p class="eyebrow">Centro de aprendizaje</p>
            <h1>Prepárate antes de actuar</h1>
            <p class="lead">Reconoce el tipo de fuego, elige el extintor adecuado y aprende a utilizarlo con el método PASS.</p>
          </div>
          <div class="hero-mark">${ic('book', 40)}</div>
        </header>

        <nav class="guide-nav" id="guide-nav" aria-label="Contenido de la guía">
          <button type="button" data-action="scroll-to" data-target="tipos-fuego">${ic('flame', 18)} Tipos de fuego</button>
          <button type="button" data-action="scroll-to" data-target="extintores">${ic('extinguisher', 18)} Extintores</button>
          <button type="button" data-action="scroll-to" data-target="metodo-pass">${ic('shield', 18)} Método PASS</button>
          <button type="button" data-action="scroll-to" data-target="plan-de-accion">${ic('exit', 18)} Plan de acción</button>
          <button type="button" data-action="scroll-to" data-target="prevencion">${ic('check', 18)} Prevención</button>
        </nav>

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
            <div><span class="cta-icon">${ic('shield', 24)}</span><p><strong>¿Listo para ponerlo en práctica?</strong><span>Analiza una imagen y comprueba tus conocimientos.</span></p></div>
            <a class="btn btn-primary" href="#/analisis">Ir al modo análisis ${ic('arrow', 18)}</a>
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

        <section class="guide-section" id="prevencion">
          ${sectionHead('05', 'Antes de que ocurra', 'Prevención', 'Pequeñas revisiones cotidianas reducen el riesgo. Marca las que ya cumples.')}
          <div class="checklist" id="checklist">
            ${D.PREVENTION.map((p, i) => `
              <label class="check-item">
                <input type="checkbox" data-check="${i}">
                <span class="check-box">${ic('check', 14)}</span>
                <span><strong>${esc(p.title)}</strong><small>${esc(p.text)}</small></span>
              </label>`).join('')}
          </div>
          <p class="check-count" id="check-count" aria-live="polite">0 de ${D.PREVENTION.length} revisadas</p>
        </section>
      </section>`;

    updateClassDetail();

    /* Resaltado de la sección activa en la barra de la guía */
    let observer = null;
    if ('IntersectionObserver' in window) {
      const buttons = $$('#guide-nav button');
      observer = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            buttons.forEach((b) => b.classList.toggle('active', b.dataset.target === en.target.id));
          }
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      $$('.guide-section').forEach((s) => observer.observe(s));
    }
    return () => { if (observer) observer.disconnect(); };
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
        <header class="hero-card">
          <div>
            <p class="eyebrow">Guía de uso</p>
            <h1>Cómo usar esta página</h1>
            <p class="lead">Seis pasos, en este orden, para sacarle el máximo provecho: de leer la guía a revisar tus resultados.</p>
            <div class="btn-row">
              <button class="btn btn-primary" type="button" data-action="start-tour">${ic('compass', 18)} Iniciar recorrido guiado</button>
              <a class="btn btn-ghost" href="#/analisis">Ir directo a analizar ${ic('arrow', 17)}</a>
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

          <aside class="tutorial-aside">
            <article class="card info-card">
              <h3>${ic('image', 20)} Consejos para tu imagen</h3>
              <ul>${D.IMAGE_TIPS.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            </article>
            <article class="card info-card">
              <h3>${ic('help', 20)} ¿Te perdiste?</h3>
              <p>El botón <strong>?</strong> de la esquina inferior derecha está en todas las pantallas. Desde ahí reabres el recorrido, esta guía o la guía de seguridad.</p>
              <a class="text-link" href="#/">Volver al inicio ${ic('arrow', 16)}</a>
            </article>
          </aside>
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
    { sel: ['#main-nav', '#menu-toggle'], title: 'Menú principal', text: 'Desde aquí vas al inicio, a la guía de seguridad, a este tutorial o directo a analizar una imagen. El logo también te lleva al inicio.' },
    { sel: ['#upload-panel'], title: 'Paso 1: sube una imagen', text: 'Arrastra una foto o pulsa «Seleccionar imagen». Acepta JPG, PNG o WEBP de hasta 10 MB.' },
    { sel: ['.how-strip'], title: 'Qué viene después', text: 'Al terminar el análisis eliges el extintor, ordenas el método PASS y ves tus resultados.' },
    { sel: ['#learning-entry'], title: '¿Prefieres aprender primero?', text: 'La guía de seguridad explica los tipos de fuego, los extintores y el método PASS. Conviene leerla antes de practicar.' },
    { sel: ['#help-fab'], title: 'Ayuda siempre a mano', text: 'Este botón reabre el recorrido, el tutorial o la guía desde cualquier pantalla.' }
  ];
  let tourIdx = -1;
  let tourOpen = false;

  function startTour() {
    closeHelp();
    closeMenu();
    closeWelcome();
    const p = parseHash();
    if (p.route !== '' && p.route !== 'analisis') {
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

  /* ---------- menú de ayuda y menú móvil ---------- */
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
  function closeMenu() {
    const h = $('#site-header'), t = $('#menu-toggle');
    if (h) h.classList.remove('nav-open');
    if (t) t.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    const h = $('#site-header'), t = $('#menu-toggle');
    const open = !h.classList.contains('nav-open');
    h.classList.toggle('nav-open', open);
    t.setAttribute('aria-expanded', String(open));
  }

  /* ======================================================================
     EVENTOS GLOBALES
     ====================================================================== */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');

    if (e.target.closest('#help-fab')) { toggleHelp(); return; }
    if (e.target.closest('#menu-toggle')) { toggleMenu(); return; }
    if (e.target.closest('#help-menu a')) closeHelp();
    else if (!e.target.closest('#help')) closeHelp();
    if (e.target.closest('#main-nav a')) closeMenu();

    if (!t) return;
    const id = t.dataset.id;

    switch (t.dataset.action) {
      case 'go': go(t.dataset.go); break;
      case 'scroll-to': {
        const el = document.getElementById(t.dataset.target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'pick-class':
        state.selectedClass = state.selectedClass === t.dataset.class ? null : t.dataset.class;
        updateClassDetail();
        break;
      case 'pick-ext':
        state.extinguisher = id;
        renderExt(id);
        updateProgress();
        break;
      case 'pass-pick':
        state.pass = state.pass.indexOf(id) >= 0 ? state.pass.filter((x) => x !== id) : state.pass.concat(id);
        state.validation = 'idle';
        renderPass(id);
        updateProgress();
        break;
      case 'pass-reset':
        state.pass = [];
        state.validation = 'idle';
        renderPass();
        updateProgress();
        break;
      case 'pass-check':
        state.validation = D.CORRECT_PASS.every((x, i) => state.pass[i] === x) ? 'correct' : 'incorrect';
        renderPass();
        break;
      case 'submit':
        if (state.extinguisher && state.pass.length === 4) { state.submitted = true; go('#/resultados'); }
        break;
      case 'new-analysis':
        resetAll();
        go('#/analisis');
        break;
      case 'retry-analysis':
        render();
        break;
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

  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-check]')) {
      const n = $$('[data-check]:checked').length;
      const out = $('#check-count');
      if (out) out.textContent = n + ' de ' + D.PREVENTION.length + ' revisadas';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (tourOpen) closeTour();
      else if ($('.modal-backdrop')) closeWelcome();
      else { closeHelp(); closeMenu(); }
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
