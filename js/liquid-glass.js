/* ============================================
   OverBitCore – Liquid Glass panels (uveg.html)
   + local dent hover (smooth), navbar controls
   live as separate glass chips
   ============================================ */

/*
  MINI TUTORIAL – az üveg nem CSS blur.
  A .glass / .liquid-glass elemeket ez a fájl mintavételezi és WebGL-lel torzítja.
  Új üvegpanel: add rá a "glass liquid-glass" osztályt a HTML-ben, a collectPanels összeszedi.
  Hover horpadás: updateCardTilts. Ha egy kártya nem "él", nézd meg, rajta van-e az osztály.
*/


(function () {
  'use strict';

  const MAX_PANELS = 32;

  function initLiquidGlass() {
    const canvas = document.getElementById('liquidGlassCanvas');
    const vertexCanvas = document.getElementById('vertexCanvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true
    });
    if (!gl) {
      console.warn('WebGL unavailable – liquid glass disabled');
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
precision mediump float;

uniform vec3 iResolution;
uniform vec4 iMouse;   // xy = smoothed mouse (buffer px, top-left), z = hover strength 0..1
uniform sampler2D iChannel0;
uniform int uCount;
uniform vec4 uPanels[${MAX_PANELS}];
uniform float uRadii[${MAX_PANELS}];

void main() {
  vec2 frag = gl_FragCoord.xy;
  float cssY = iResolution.y - frag.y;
  vec2 cssPos = vec2(frag.x, cssY);

  vec4 result = vec4(0.0);
  float bestT = 0.0;

  vec2 mousePos = iMouse.xy;
  float hoverStr = iMouse.z;

  for (int i = 0; i < ${MAX_PANELS}; i++) {
    if (i >= uCount) break;

    vec4 p = uPanels[i];
    vec2 boxPos = p.xy;
    vec2 boxSize = p.zw;

    vec2 local = cssPos - boxPos;
    if (local.x < 0.0 || local.y < 0.0 ||
        local.x > boxSize.x || local.y > boxSize.y) {
      continue;
    }

    float rad = uRadii[i];
    vec2 halfSize = boxSize * 0.5;
    vec2 q = abs(local - halfSize) - (halfSize - vec2(rad));
    float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rad;
    float edge = 1.0 - smoothstep(-1.0, 1.5, sd);
    if (edge < 0.05) continue;

    vec2 uv = frag / iResolution.xy;

    // Base liquid refraction (panel-local)
    vec2 localN = (local - halfSize) / max(halfSize, vec2(1.0));
    float roundedBox = pow(abs(localN.x), 6.0) + pow(abs(localN.y), 6.0);
    float radial = (1.0 - smoothstep(0.55, 1.4, roundedBox)) * edge;

    vec2 centerUV = (boxPos + halfSize);
    centerUV.y = iResolution.y - centerUV.y;
    centerUV /= iResolution.xy;
    float lensAmt = radial * 0.14;
    vec2 lens = (uv - centerUV) * (1.0 - lensAmt) + centerUV;

    // --- Local DENT under cursor (inverse bulge) ---
    // Only when mouse is over THIS panel
    vec2 mouseLocal = (mousePos - boxPos) / max(boxSize, vec2(1.0));
    float inside = step(0.0, mouseLocal.x) * step(mouseLocal.x, 1.0)
                 * step(0.0, mouseLocal.y) * step(mouseLocal.y, 1.0);

    vec2 pixelLocal = local / max(boxSize, vec2(1.0));
    vec2 delta = pixelLocal - mouseLocal;
    // aspect-correct distance in panel space
    float aspect = boxSize.x / max(boxSize.y, 1.0);
    float dist = length(delta * vec2(aspect, 1.0));
    // soft circular falloff around cursor
    float dentMask = inside * (1.0 - smoothstep(0.0, 0.42, dist));
    dentMask *= hoverStr;

    // Concave: pull UVs toward mouse → surface "horpad be"
    vec2 mouseUV = boxPos + mouseLocal * boxSize;
    mouseUV.y = iResolution.y - mouseUV.y;
    mouseUV /= iResolution.xy;
    float dentAmt = dentMask * 0.28;
    lens = (lens - mouseUV) * (1.0 - dentAmt) + mouseUV;

    // Card tilt in shader (same motion as HTML) so glass leans with the card
    vec2 tiltOff = (mouseLocal - 0.5) * inside * hoverStr;
    lens.x += tiltOff.x * 0.04 * localN.y;
    lens.y += tiltOff.y * 0.04 * localN.x;
    lens.x += tiltOff.x * 0.025;
    lens.y += tiltOff.y * 0.025;

    // Multi-sample for liquid blur
    vec4 col = vec4(0.0);
    float total = 0.0;
    for (int x = -3; x <= 3; x++) {
      for (int y = -3; y <= 3; y++) {
        vec2 offset = vec2(float(x), float(y)) * 0.48 / iResolution.xy; /* blur amount */
        col += texture2D(iChannel0, clamp(offset + lens, 0.0, 1.0));
        total += 1.0;
      }
    }
    col /= total;

    // dent only – no white ring
    vec4 glass = col;
    glass.rgb *= 0.92;
    glass.a = edge * 0.97;

    if (edge > bestT) {
      bestT = edge;
      result = glass;
    }
  }

  if (bestT < 0.01) discard;
  gl_FragColor = result;
}
`;
    // #region createShader
    function createShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('LiquidGlass:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('LiquidGlass link:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, 'iResolution'),
      mouse: gl.getUniformLocation(program, 'iMouse'),
      tex: gl.getUniformLocation(program, 'iChannel0'),
      count: gl.getUniformLocation(program, 'uCount'),
      panels: [],
      radii: []
    };
    for (let i = 0; i < MAX_PANELS; i++) {
      u.panels.push(gl.getUniformLocation(program, 'uPanels[' + i + ']'));
      u.radii.push(gl.getUniformLocation(program, 'uRadii[' + i + ']'));
    }

    const scene2d = document.createElement('canvas');
    const sceneCtx = scene2d.getContext('2d');
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // #endregion


    // #region themeIsLight
    function themeIsLight() {
      return document.documentElement.getAttribute('data-theme') === 'light';
    }
    // #endregion


    // #region paintSceneBackground
    function paintSceneBackground(ctx, w, h) {
      if (themeIsLight()) {
        ctx.fillStyle = '#eef1f8';
        ctx.fillRect(0, 0, w, h);
        const g1 = ctx.createRadialGradient(w * 0.1, 0, 0, w * 0.1, 0, w * 0.6);
        g1.addColorStop(0, 'rgba(107,78,247,0.28)');
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);
        const g2 = ctx.createRadialGradient(w * 0.9, 0, 0, w * 0.9, 0, w * 0.5);
        g2.addColorStop(0, 'rgba(0,144,197,0.18)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, w, h);
        const g1 = ctx.createRadialGradient(w * 0.1, 0, 0, w * 0.1, 0, w * 0.7);
        g1.addColorStop(0, 'rgba(124,92,255,0.32)');
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);
        const g2 = ctx.createRadialGradient(w * 0.9, 0, 0, w * 0.9, 0, w * 0.55);
        g2.addColorStop(0, 'rgba(0,212,255,0.2)');
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);
        const g3 = ctx.createRadialGradient(w * 0.5, h, 0, w * 0.5, h, h * 0.55);
        g3.addColorStop(0, 'rgba(255,107,157,0.14)');
        g3.addColorStop(1, 'transparent');
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, w, h);
      }
    }
    // #endregion


    // #region updateSceneTexture
    function updateSceneTexture() {
      const w = canvas.width;
      const h = canvas.height;
      if (w < 2 || h < 2) return;
      if (scene2d.width !== w || scene2d.height !== h) {
        scene2d.width = w;
        scene2d.height = h;
      }
      paintSceneBackground(sceneCtx, w, h);
      if (vertexCanvas && vertexCanvas.width > 0) {
        try {
          sceneCtx.drawImage(vertexCanvas, 0, 0, w, h);
        } catch (e) { /* */ }
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene2d);
    }

    let W = 0;
    let H = 0;
    // Smoothed mouse + hover strength (animated)
    let mouseRaw = [0, 0];
    let mouseSmooth = [0, 0];
    let hoverRaw = 0;
    let hoverSmooth = 0;
    let overPanel = false;
    let texFrame = 0;
    // #endregion


    // #region resize
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PANEL_SELECTOR =
      '.navbar.glass, .navbar.liquid-glass, .footer, .footer.liquid-glass, ' +
      '.about-card.glass, .about-card.liquid-glass, ' +
      '.project-card.glass, .project-card.liquid-glass, ' +
      '.skill-card.glass, .skill-card.liquid-glass, ' +
      '.contact-form.glass, .contact-form.liquid-glass, ' +
      '.info-card.glass, .info-card.liquid-glass, ' +
      '.hero-badge.liquid-glass, .hero-badge.glass-sm, ' +
      '.btn.glass-btn, .btn-primary.glass-btn, .btn-secondary.glass-btn, .glass-btn, ' +
      // navbar chips – each lives as its own glass
      '.nav-link, .theme-toggle, .lang-btn, .lang-switcher, .lang-switch, .logo, .glass-sm';
    // #endregion


    // #region hitTestPanels
    function hitTestPanels(clientX, clientY) {
      const nodes = document.querySelectorAll(PANEL_SELECTOR);
      for (let i = 0; i < nodes.length; i++) {
        const r = nodes[i].getBoundingClientRect();
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
          return true;
        }
      }
      return false;
    }

    window.addEventListener('mousemove', (e) => {
      mouseRaw = [e.clientX, e.clientY];
      overPanel = hitTestPanels(e.clientX, e.clientY);
      hoverRaw = overPanel ? 1 : 0;
      updateCardTilts(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      hoverRaw = 0;
      overPanel = false;
      updateCardTilts(-9999, -9999);
    });
    // #endregion


    // #region readRadiusPx
    function readRadiusPx(el, height) {
      const cs = window.getComputedStyle(el);
      const raw = (cs.borderTopLeftRadius || cs.borderRadius || '12px').split(' ')[0];
      let rad = parseFloat(raw);
      if (!isFinite(rad)) rad = 12;
      if (rad > height * 0.5) rad = height * 0.5;
      return Math.max(rad, 4);
    }

    
    /* Subtle card tilt toward cursor – state lerped each frame */
    const tiltState = new WeakMap();
    // #endregion


    // #region updateCardTilts
    function updateCardTilts(mx, my, immediate) {
      const cards = document.querySelectorAll(
        '.about-card, .project-card, .skill-card, .contact-form, .info-card'
      );
      const t = immediate ? 1 : 0.28; // responsive, still slightly smooth
      cards.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width * 0.5;
        const cy = r.top + r.height * 0.5;
        const inside =
          mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;

        let st = tiltState.get(el);
        if (!st) {
          st = { rx: 0, ry: 0, ty: 0 };
          tiltState.set(el, st);
        }

        const targetRx = inside ? -((my - cy) / Math.max(r.height, 1)) * 5 : 0;
        const targetRy = inside ? ((mx - cx) / Math.max(r.width, 1)) * 5 : 0;
        const targetTy = inside ? -2 : 0;

        st.rx += (targetRx - st.rx) * t;
        st.ry += (targetRy - st.ry) * t;
        st.ty += (targetTy - st.ty) * t;

        if (!inside && Math.abs(st.rx) < 0.02 && Math.abs(st.ry) < 0.02) {
          el.style.transform = '';
          return;
        }
        el.style.transform =
          'perspective(700px) rotateX(' + st.rx.toFixed(2) + 'deg) rotateY(' +
          st.ry.toFixed(2) + 'deg) translateY(' + st.ty.toFixed(2) + 'px)';
      });
    }
    // #endregion


    // #region syncNavBackdrop
    function syncNavBackdrop() {
      const nav = document.getElementById('navbar');
      const bd = document.getElementById('navGlassBackdrop');
      if (!nav || !bd) return;
      const r = nav.getBoundingClientRect();
      bd.style.left = r.left + 'px';
      bd.style.top = r.top + 'px';
      bd.style.width = r.width + 'px';
      bd.style.height = r.height + 'px';
      const rad = window.getComputedStyle(nav).borderTopLeftRadius;
      bd.style.borderRadius = rad || '100px';
      bd.classList.add('is-ready');
    }
    // #endregion


    // #region collectPanels
    function collectPanels() {
      const nodes = document.querySelectorAll(PANEL_SELECTOR);
      const list = [];
      const dpr = canvas.width / Math.max(W, 1);
      nodes.forEach((el) => {
        if (list.length >= MAX_PANELS) return;
        const r = el.getBoundingClientRect();
        if (r.width < 6 || r.height < 6) return;
        if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) return;
        // skip if fully inside navbar and is the navbar itself vs children – keep both
        const radCss = readRadiusPx(el, r.height);
        list.push({
          x: r.left * dpr,
          y: r.top * dpr,
          w: r.width * dpr,
          h: r.height * dpr,
          radius: radCss * dpr
        });
      });
      return list;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Smooth factor per frame (~0.12 = soft ease)
    const LERP = reduced ? 1 : 0.22;
    const LERP_HOVER = reduced ? 1 : 0.18;
    // #endregion


    // #region lerp
    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    // #endregion


    // #region render
    function render() {
      // Animate mouse + hover strength
      mouseSmooth[0] = lerp(mouseSmooth[0], mouseRaw[0], LERP);
      mouseSmooth[1] = lerp(mouseSmooth[1], mouseRaw[1], LERP);
      hoverSmooth = lerp(hoverSmooth, hoverRaw, LERP_HOVER);

      // keep HTML tilt in sync with liquid glass each frame
      updateCardTilts(mouseSmooth[0], mouseSmooth[1], false);
      syncNavBackdrop();

      texFrame++;
      if (texFrame % 2 === 0) updateSceneTexture();

      const panels = collectPanels();
      const dpr = canvas.width / Math.max(W, 1);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform3f(u.res, canvas.width, canvas.height, 1.0);
      gl.uniform4f(
        u.mouse,
        mouseSmooth[0] * dpr,
        mouseSmooth[1] * dpr,
        hoverSmooth,
        0
      );
      gl.uniform1i(u.count, panels.length);

      for (let i = 0; i < MAX_PANELS; i++) {
        if (i < panels.length) {
          const p = panels[i];
          gl.uniform4f(u.panels[i], p.x, p.y, p.w, p.h);
          gl.uniform1f(u.radii[i], p.radius);
        } else {
          gl.uniform4f(u.panels[i], 0, 0, 0, 0);
          gl.uniform1f(u.radii[i], 0);
        }
      }

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(u.tex, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reduced) requestAnimationFrame(render);
    }

    // Init smooth mouse to center
    mouseRaw = [W / 2, H / 2];
    mouseSmooth = [W / 2, H / 2];

    requestAnimationFrame(render);
  }

  window.OverBitLiquidGlass = { init: initLiquidGlass };
})();
    // #endregion
