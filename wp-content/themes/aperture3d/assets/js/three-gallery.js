/**
 * Aperture3D – Three.js 3D photo carousel + CSS 3D hover tilt grid.
 *
 * Expects `window.Aperture3DData.photos` to be an array of
 * { id, title, url, image } objects (populated by PHP).
 */
(function () {
  'use strict';

  const data = (window.Aperture3DData && Array.isArray(window.Aperture3DData.photos))
    ? window.Aperture3DData.photos
    : [];

  document.addEventListener('DOMContentLoaded', () => {
    initCarousel(data);
    initTiltGrid();
  });

  /* ------------------------------------------------------------------ */
  /*  1. Three.js 3D rotating carousel                                   */
  /* ------------------------------------------------------------------ */
  function initCarousel(photos) {
    const canvas  = document.getElementById('a3d-canvas');
    const loading = document.getElementById('a3d-loading');
    if (!canvas || typeof THREE === 'undefined') return;

    // If there are no photos, just render an ambient scene as a backdrop.
    const sources = photos.length
      ? photos.map(p => p.image)
      : defaultPlaceholders();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x05050a, 1);

    const scene  = new THREE.Scene();
    scene.fog    = new THREE.Fog(0x05050a, 8, 24);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0.4, 9);

    // Lights – subtle, images supply their own color via MeshBasicMaterial.
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    // --- Build the carousel ring -------------------------------------
    const ring  = new THREE.Group();
    scene.add(ring);

    const count  = Math.max(sources.length, 6);
    const radius = Math.max(4.5, 0.9 * count / Math.PI);
    const cardW  = 2.0;
    const cardH  = 2.6;
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    let loaded = 0;
    const meshes = [];

    for (let i = 0; i < count; i++) {
      const src   = sources[i % sources.length];
      const angle = (i / count) * Math.PI * 2;

      const material = new THREE.MeshBasicMaterial({
        color:        0x222228,
        side:         THREE.DoubleSide,
        transparent:  true,
        opacity:      0.0,
      });

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(cardW, cardH, 1, 1),
        material
      );

      mesh.position.set(
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius
      );
      // Face the center of the ring.
      mesh.lookAt(0, 0, 0);
      mesh.userData.baseY     = 0;
      mesh.userData.phase     = Math.random() * Math.PI * 2;
      mesh.userData.angle     = angle;
      ring.add(mesh);
      meshes.push(mesh);

      loader.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          material.map   = tex;
          material.color.set(0xffffff);
          // Fade in.
          const fade = () => {
            material.opacity = Math.min(material.opacity + 0.04, 1);
            if (material.opacity < 1) requestAnimationFrame(fade);
          };
          fade();
          material.needsUpdate = true;
          loaded += 1;
          if (loaded >= Math.min(sources.length, 4) && loading) {
            loading.style.opacity    = '0';
            loading.style.transition = 'opacity .6s ease';
            setTimeout(() => loading.remove(), 800);
          }
        },
        undefined,
        () => { loaded += 1; }
      );
    }

    // --- Pointer drag / wheel controls -------------------------------
    const state = {
      rotationY:       0,
      targetRotation:  0,
      velocity:        0.0015, // idle auto-rotation
      dragging:        false,
      lastX:           0,
      cameraZ:         9,
      targetCameraZ:   9,
    };

    canvas.addEventListener('pointerdown', (e) => {
      state.dragging = true;
      state.lastX    = e.clientX;
      state.velocity = 0;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!state.dragging) return;
      const dx = e.clientX - state.lastX;
      state.lastX = e.clientX;
      state.targetRotation += dx * 0.005;
      state.velocity       = dx * 0.0008;
    });
    const stopDrag = () => { state.dragging = false; };
    canvas.addEventListener('pointerup',     stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('pointerleave',  stopDrag);

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      state.targetCameraZ = clamp(state.targetCameraZ + e.deltaY * 0.003, 6, 14);
    }, { passive: false });

    // --- Resize handling ---------------------------------------------
    const resize = () => {
      const hero = canvas.parentElement;
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // --- Animation loop ----------------------------------------------
    const clock = new THREE.Clock();
    const tick = () => {
      const dt = clock.getDelta();
      const t  = clock.elapsedTime;

      if (!state.dragging) {
        state.targetRotation += state.velocity;
        state.velocity *= 0.96;
        if (Math.abs(state.velocity) < 0.0002) state.velocity = 0.0015;
      }
      state.rotationY += (state.targetRotation - state.rotationY) * 0.08;
      ring.rotation.y = state.rotationY;

      state.cameraZ += (state.targetCameraZ - state.cameraZ) * 0.08;
      camera.position.z = state.cameraZ;
      camera.position.y = Math.sin(t * 0.3) * 0.2 + 0.4;
      camera.lookAt(0, 0, 0);

      // Subtle bobbing per-card.
      meshes.forEach((m) => {
        m.position.y = Math.sin(t * 0.8 + m.userData.phase) * 0.15;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
  }

  function defaultPlaceholders() {
    // Tiny SVG gradients so the canvas isn't empty before any photos exist.
    const colors = [
      ['#1e1e2a', '#3b2a56'],
      ['#24242e', '#205063'],
      ['#2a1e2a', '#6a3a3a'],
      ['#1e2a24', '#2f6a4a'],
      ['#2a2418', '#7a5a22'],
      ['#181824', '#444488'],
    ];
    return colors.map(([a, b]) => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='640'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>
        </linearGradient></defs>
        <rect width='512' height='640' fill='url(#g)'/>
      </svg>`;
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  /* ------------------------------------------------------------------ */
  /*  2. CSS 3D tilt on the gallery grid (pointer-based parallax)        */
  /* ------------------------------------------------------------------ */
  function initTiltGrid() {
    const cards = document.querySelectorAll('.a3d-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left) / r.width;
        const y  = (e.clientY - r.top)  / r.height;
        const rx = (0.5 - y) * 14; // degrees
        const ry = (x - 0.5) * 18;
        card.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }
})();
