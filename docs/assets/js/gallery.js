/**
 * Aperture3D static demo — cinematic Three.js carousel + scroll-reveal grid
 * + kinetic title + page fade + single-photo loader.
 */
(function () {
  'use strict';

  const data = (window.Aperture3DData && window.Aperture3DData.photos) || [];
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Boot once everything (Three.js, photos.js, DOM) is ready.
  document.addEventListener('DOMContentLoaded', () => {
    initCarousel(data);
    buildGrid(data);
    initScrollReveal();
    initTiltGrid();
    initKineticTitle();
    initPageTransitions();
    initSinglePhoto(data);
  });

  /* ------------------------------------------------------------------ */
  /* 1. Cinematic Three.js carousel                                      */
  /* ------------------------------------------------------------------ */
  function initCarousel(photos) {
    const canvas  = document.getElementById('a3d-canvas');
    const loading = document.getElementById('a3d-loading');
    if (!canvas || typeof THREE === 'undefined') return;

    const sources = (photos.length ? photos : defaultPlaceholders()).map(p => p.image || p);

    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x05050a, 1);

    const scene = new THREE.Scene();
    scene.fog   = new THREE.Fog(0x05050a, 6, 22);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 22);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const ring = new THREE.Group();
    scene.add(ring);

    const count  = Math.max(sources.length, 6);
    const radius = Math.max(4.5, 0.9 * count / Math.PI);
    const cardW  = 2.0, cardH = 2.6;
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    let loaded = 0;
    const meshes = [];

    for (let i = 0; i < count; i++) {
      const src   = sources[i % sources.length];
      const angle = (i / count) * Math.PI * 2;

      const material = new THREE.MeshBasicMaterial({
        color: 0x222228, side: THREE.DoubleSide,
        transparent: true, opacity: 0.0,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(cardW, cardH, 1, 1), material);
      mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
      mesh.lookAt(0, 0, 0);
      mesh.userData.phase = Math.random() * Math.PI * 2;
      ring.add(mesh);
      meshes.push(mesh);

      loader.load(src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        material.map = tex;
        material.color.set(0xffffff);
        material.needsUpdate = true;
        loaded += 1;
        if (loaded >= Math.min(sources.length, 4) && loading) {
          loading.style.opacity = '0';
          loading.style.transition = 'opacity 1s ease';
          setTimeout(() => loading.remove(), 1200);
        }
      }, undefined, () => { loaded += 1; });
    }

    const state = {
      rotationY: 0, targetRotation: 0,
      velocity: 0.0008, dragging: false, lastX: 0,
      cameraZ: 22, targetCameraZ: 9.5,
      mouseX: 0, mouseY: 0, targetMouseX: 0, targetMouseY: 0,
      fov: 38, targetFov: 55,
      introProgress: 0,
    };

    canvas.addEventListener('pointerdown', (e) => {
      state.dragging = true; state.lastX = e.clientX; state.velocity = 0;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      state.targetMouseX = ((e.clientX - r.left) / r.width)  * 2 - 1;
      state.targetMouseY = ((e.clientY - r.top)  / r.height) * 2 - 1;
      if (!state.dragging) return;
      const dx = e.clientX - state.lastX;
      state.lastX = e.clientX;
      state.targetRotation += dx * 0.004;
      state.velocity = dx * 0.0006;
    });
    const stopDrag = () => { state.dragging = false; };
    canvas.addEventListener('pointerup',     stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('pointerleave',  () => {
      state.dragging = false;
      state.targetMouseX = 0; state.targetMouseY = 0;
    });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      state.targetCameraZ = clamp(state.targetCameraZ + e.deltaY * 0.002, 6.5, 13);
    }, { passive: false });

    const resize = () => {
      const hero = canvas.parentElement;
      renderer.setSize(hero.clientWidth, hero.clientHeight, false);
      camera.aspect = hero.clientWidth / hero.clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    const introDuration = prefersReducedMotion ? 0.5 : 2.8;

    const tick = () => {
      const t  = clock.elapsedTime;
      const dt = Math.min(clock.getDelta(), 0.05);

      if (state.introProgress < 1) {
        state.introProgress = Math.min(1, state.introProgress + dt / introDuration);
        const e = easeInOutCubic(state.introProgress);
        camera.position.z = lerp(22, state.targetCameraZ, e);
        camera.fov        = lerp(38, state.targetFov, e);
        camera.updateProjectionMatrix();
        meshes.forEach((m, i) => {
          const stagger = clamp(state.introProgress * meshes.length - i * 0.35, 0, 1);
          m.material.opacity = easeOutCubic(stagger);
        });
      } else {
        state.cameraZ += (state.targetCameraZ - state.cameraZ) * 0.05;
        camera.position.z = state.cameraZ;
        meshes.forEach((m) => { m.material.opacity = 1; });
      }

      if (!state.dragging) {
        state.targetRotation += state.velocity;
        state.velocity *= 0.97;
        if (Math.abs(state.velocity) < 0.0001) state.velocity = 0.0008;
      }
      state.rotationY += (state.targetRotation - state.rotationY) * 0.04;
      ring.rotation.y = state.rotationY;

      state.mouseX += (state.targetMouseX - state.mouseX) * 0.03;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.03;
      camera.position.x = state.mouseX * 0.9;
      camera.position.y = Math.sin(t * 0.25) * 0.18 + 0.4 - state.mouseY * 0.5;
      camera.lookAt(0, 0, 0);

      meshes.forEach((m) => {
        m.position.y = Math.sin(t * 0.6 + m.userData.phase) * 0.12;
      });

      if (state.introProgress >= 1) {
        camera.fov = 55 + Math.sin(t * 0.25) * 0.6;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
  }

  function defaultPlaceholders() {
    const colors = [
      ['#1e1e2a', '#3b2a56'], ['#24242e', '#205063'], ['#2a1e2a', '#6a3a3a'],
      ['#1e2a24', '#2f6a4a'], ['#2a2418', '#7a5a22'], ['#181824', '#444488'],
    ];
    return colors.map(([a, b]) => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='640'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>
        </linearGradient></defs>
        <rect width='512' height='640' fill='url(#g)'/>
      </svg>`;
      return { image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) };
    });
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function easeInOutCubic(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }
  function easeOutCubic(t)   { return 1 - Math.pow(1 - t, 3); }

  /* ------------------------------------------------------------------ */
  /* 2. Build the gallery grid in the DOM                                */
  /* ------------------------------------------------------------------ */
  function buildGrid(photos) {
    const grid = document.getElementById('a3d-tilt-grid');
    if (!grid) return;

    // Homepage shows the first 8, gallery page shows all.
    const showAll = grid.dataset.full === '1';
    const list = showAll ? photos : photos.slice(0, 8);

    const frag = document.createDocumentFragment();
    list.forEach((p) => {
      const a = document.createElement('a');
      a.className = 'a3d-card';
      a.href = p.url;

      const img = document.createElement('img');
      img.src = p.thumb || p.image;
      img.alt = p.title || '';
      img.loading = 'lazy';

      const cap = document.createElement('span');
      cap.className = 'a3d-caption';
      cap.textContent = p.title || '';

      a.appendChild(img);
      if (p.title) a.appendChild(cap);
      frag.appendChild(a);
    });
    grid.appendChild(frag);
  }

  /* ------------------------------------------------------------------ */
  /* 3. Tilt on hover + scroll-reveal                                    */
  /* ------------------------------------------------------------------ */
  function initTiltGrid() {
    const cards = document.querySelectorAll('.a3d-card');
    if (!cards.length || prefersReducedMotion) return;
    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (!card.classList.contains('is-revealed')) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top)  / r.height;
        card.style.transform =
          `perspective(1000px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 16}deg) translateZ(10px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  function initScrollReveal() {
    const cards = document.querySelectorAll('.a3d-card');
    if (!cards.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-revealed'), idx * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    cards.forEach(c => io.observe(c));
  }

  /* ------------------------------------------------------------------ */
  /* 4. Kinetic title                                                    */
  /* ------------------------------------------------------------------ */
  function initKineticTitle() {
    const el = document.querySelector('.a3d-hero-overlay h1');
    if (!el || el.dataset.kinetic === '1') return;
    el.dataset.kinetic = '1';

    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);

    let letterIndex = 0;
    text.split(/(\s+)/).forEach((word) => {
      if (/^\s+$/.test(word)) { el.appendChild(document.createTextNode(word)); return; }
      const wrap = document.createElement('span');
      wrap.className = 'a3d-word';
      [...word].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'a3d-letter';
        s.textContent = ch;
        s.style.animationDelay = (0.4 + letterIndex * 0.045) + 's';
        letterIndex += 1;
        wrap.appendChild(s);
      });
      el.appendChild(wrap);
    });
    el.classList.add('a3d-kinetic');
  }

  /* ------------------------------------------------------------------ */
  /* 5. Page-fade overlay                                                */
  /* ------------------------------------------------------------------ */
  function initPageTransitions() {
    if (prefersReducedMotion) return;
    const overlay = document.createElement('div');
    overlay.className = 'a3d-page-fade';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-ready'));

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      if (link.hasAttribute('download')) return;
      let url;
      try { url = new URL(href, window.location.href); } catch (_) { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      e.preventDefault();
      overlay.classList.add('is-fading');
      setTimeout(() => { window.location.href = url.href; }, 520);
    });
    window.addEventListener('pageshow', () => overlay.classList.remove('is-fading'));
  }

  /* ------------------------------------------------------------------ */
  /* 6. Single-photo page: pick by ?id= and populate                     */
  /* ------------------------------------------------------------------ */
  function initSinglePhoto(photos) {
    const img = document.getElementById('a3d-single-img');
    if (!img) return;
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
    const photo = photos.find(p => p.id === id) || photos[0];
    if (!photo) return;
    img.src = photo.full || photo.image;
    img.alt = photo.title;
    const t = document.getElementById('a3d-single-title'); if (t) t.textContent = photo.title;
    const g = document.getElementById('a3d-single-tags');  if (g) g.textContent = photo.tags || '';
    const b = document.getElementById('a3d-single-body');  if (b) b.textContent = photo.body || '';
    document.title = `${photo.title} — Aperture`;
  }
})();
