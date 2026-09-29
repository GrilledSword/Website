/* ============================================
   OverBitCore – 3D Vertex / Core Scene
   Scroll-driven assembly (GPU-optimized)
   ============================================ */

/*
  MINI TUTORIAL – a háttér reaktor. Közeljövőben ide ne nyúlj, hacsak a magot nem cseréled.
  initParallax a #vertexCanvas-ra rajzol. Görgetésre a formAmount nő:
  vertex -> él -> lap -> tömör mag. A stage* függvények ennek a négy fázisa.
  Színt a getColors() olvas a CSS változókból, szóval a téma innen is követi a :root-ot.
*/


(function () {
  'use strict';

  function initParallax() {
    const scene = document.getElementById('parallaxScene');
    const canvas = document.getElementById('vertexCanvas');
    if (!scene || !canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let W = 0, H = 0, dpr = 1;
    let mouseX = 0, mouseY = 0;
    let smoothMX = 0, smoothMY = 0;
    let formAmount = 0;
    let time = 0;
    let running = true;
    let frame = 0;

    /* ---------- Geometry: geodesic sphere ---------- */
    // #region createGeodesic
    function createGeodesic(scale, subdivisions) {
      const t = (1 + Math.sqrt(5)) / 2;
      let verts = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
      ].map(([x, y, z]) => {
        const len = Math.hypot(x, y, z);
        return [x / len, y / len, z / len];
      });

      let faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
      ];

      function subdivide(vertsIn, facesIn) {
        const midCache = new Map();
        const newVerts = vertsIn.slice();
        function midpoint(a, b) {
          const key = a < b ? a + '_' + b : b + '_' + a;
          if (midCache.has(key)) return midCache.get(key);
          const va = newVerts[a], vb = newVerts[b];
          let x = (va[0] + vb[0]) / 2;
          let y = (va[1] + vb[1]) / 2;
          let z = (va[2] + vb[2]) / 2;
          const len = Math.hypot(x, y, z) || 1;
          const idx = newVerts.length;
          newVerts.push([x / len, y / len, z / len]);
          midCache.set(key, idx);
          return idx;
        }
        const newFaces = [];
        facesIn.forEach(([a, b, c]) => {
          const ab = midpoint(a, b);
          const bc = midpoint(b, c);
          const ca = midpoint(c, a);
          newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
        });
        return { verts: newVerts, faces: newFaces };
      }

      for (let i = 0; i < subdivisions; i++) {
        const r = subdivide(verts, faces);
        verts = r.verts;
        faces = r.faces;
      }

      const scaled = verts.map(([x, y, z]) => ({
        x: x * scale, y: y * scale, z: z * scale
      }));

      const edgeSet = new Set();
      const edges = [];
      faces.forEach(([a, b, c]) => {
        [[a, b], [b, c], [c, a]].forEach(([i, j]) => {
          const key = i < j ? i + '_' + j : j + '_' + i;
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push([i, j]);
          }
        });
      });

      return { verts: scaled, faces, edges };
    }
    // #endregion


    // #region createTorus
    function createTorus(R, r, segMajor, segMinor) {
      const verts = [];
      const edges = [];
      for (let i = 0; i < segMajor; i++) {
        const u = (i / segMajor) * Math.PI * 2;
        for (let j = 0; j < segMinor; j++) {
          const v = (j / segMinor) * Math.PI * 2;
          verts.push({
            x: (R + r * Math.cos(v)) * Math.cos(u),
            y: r * Math.sin(v) * 0.55,
            z: (R + r * Math.cos(v)) * Math.sin(u)
          });
        }
      }
      for (let i = 0; i < segMajor; i++) {
        for (let j = 0; j < segMinor; j++) {
          const a = i * segMinor + j;
          const b = i * segMinor + ((j + 1) % segMinor);
          const c = ((i + 1) % segMajor) * segMinor + j;
          edges.push([a, b], [a, c]);
        }
      }
      return { verts, edges };
    }

    // Lower subdivisions / segments – big GPU win, still looks solid
    const core = createGeodesic(0.72, 2);
    const shell = createGeodesic(1.05, 1);
    const ringA = createTorus(1.45, 0.12, 28, 6);
    const ringB = createTorus(1.7, 0.08, 24, 4);
    // #endregion


    // #region scatterParticle
    function scatterParticle(target, spread) {
      return {
        sx: (Math.random() - 0.5) * spread,
        sy: (Math.random() - 0.5) * spread,
        sz: (Math.random() - 0.5) * spread,
        tx: target.x, ty: target.y, tz: target.z,
        x: 0, y: 0, z: 0,
        px: 0, py: 0, sc: 1, pz: 0
      };
    }

    const coreParts = core.verts.map(v => scatterParticle(v, 9));
    const shellParts = shell.verts.map(v => scatterParticle(v, 11));
    const ringAParts = ringA.verts.map(v => scatterParticle(v, 12));
    const ringBParts = ringB.verts.map(v => scatterParticle(v, 13));

    // Fewer orbits & dust
    const orbits = [];
    for (let i = 0; i < 36; i++) {
      orbits.push({
        radius: 1.9 + Math.random() * 0.55,
        speed: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 0.9,
        size: 1.2 + Math.random() * 1.4
      });
    }

    const dust = [];
    for (let i = 0; i < 70; i++) {
      dust.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.6
      });
    }
    // #endregion


    // #region resize
    function resize() {
      // Cap DPR lower = less fill-rate cost
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // #endregion


    // #region project
    function project(x, y, z, rotY, rotX, currentFormAmount) {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const baseFov = 740;
      const zoomFactor = 1 + (currentFormAmount * 0.45);
      const fov = baseFov / zoomFactor;
      const scale = fov / (fov + z2 * 100 + 140);

      return {
        x: W * 0.5 + x1 * (350 / zoomFactor) * scale + smoothMX * 32,
        y: H * 0.48 + y1 * (350 / zoomFactor) * scale + smoothMY * 22,
        scale,
        z: z2
      };
    }
    // #endregion


    // #region getColors
    function getColors() {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      if (light) {
        return {
          line: 'rgba(107,78,247,0.35)',
          lineStrong: 'rgba(107,78,247,0.6)',
          face: 'rgba(107,78,247,0.12)',
          faceSolid: 'rgba(90,60,220,0.28)',
          faceStroke: 'rgba(107,78,247,0.22)',
          point: 'rgba(90,60,220,0.95)',
          glow: 'rgba(0,144,197,0.35)',
          coreGlow: 'rgba(124,92,255,0.45)',
          axisX: 'rgba(224,77,128,0.7)',
          axisY: 'rgba(0,144,197,0.7)',
          axisZ: 'rgba(107,78,247,0.7)',
          grid: 'rgba(0,0,0,0.055)',
          ring: 'rgba(0,144,197,0.45)',
          ring2: 'rgba(224,77,128,0.35)',
          ambient: 'rgba(107,78,247,0.22)',
          orbit: 'rgba(0,144,197,0.7)'
        };
      }
      return {
        line: 'rgba(150,120,255,0.32)',
        lineStrong: 'rgba(190,165,255,0.65)',
        face: 'rgba(124,92,255,0.1)',
        faceSolid: 'rgba(100,70,240,0.32)',
        faceStroke: 'rgba(160,130,255,0.25)',
        point: 'rgba(220,205,255,0.95)',
        glow: 'rgba(0,212,255,0.4)',
        coreGlow: 'rgba(160,120,255,0.55)',
        axisX: 'rgba(255,107,157,0.75)',
        axisY: 'rgba(0,212,255,0.75)',
        axisZ: 'rgba(150,120,255,0.75)',
        grid: 'rgba(255,255,255,0.045)',
        ring: 'rgba(0,212,255,0.5)',
        ring2: 'rgba(255,107,157,0.4)',
        ambient: 'rgba(150,120,255,0.2)',
        orbit: 'rgba(0,212,255,0.75)'
      };
    }
    // #endregion


    // #region ease
    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    // #endregion


    // #region Stages
    function stageSolid(f)  { return 1 - Math.max(0, Math.min(1, f / 0.3)); }
    function stageFace(f)   { return 1 - Math.max(0, Math.min(1, (f - 0.15) / 0.35)); }
    function stageEdge(f)   { return 1 - Math.max(0, Math.min(1, (f - 0.35) / 0.35)); }
    function stageVertex(f) { return 1 - Math.max(0, Math.min(1, (f - 0.55) / 0.45)); }
    // #endregion


    // #region updateParts
    function updateParts(parts, stage) {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x = p.sx + (p.tx - p.sx) * stage;
        p.y = p.sy + (p.ty - p.sy) * stage;
        p.z = p.sz + (p.tz - p.sz) * stage;
      }
    }
    // #endregion


    // #region projectParts
    function projectParts(parts, rotY, rotX, currentForm) {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const pr = project(p.x, p.y, p.z, rotY, rotX, currentForm);
        p.px = pr.x; p.py = pr.y; p.sc = pr.scale; p.pz = pr.z;
      }
    }
    // #endregion


    // #region drawEdges
    function drawEdges(parts, edges, color, alpha, width) {
      if (alpha < 0.02) return;
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let e = 0; e < edges.length; e++) {
        const ia = edges[e][0], ib = edges[e][1];
        const a = parts[ia], b = parts[ib];
        if (!a || !b) continue;
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // #endregion


    // #region drawFaces
    function drawFaces(parts, faces, fillColor, strokeColor, alpha, solidBoost) {
      if (alpha < 0.02) return;
      // Skip expensive sort when mostly transparent; sample subset when dense
      const step = faces.length > 120 ? 2 : 1;
      for (let fi = 0; fi < faces.length; fi += step) {
        const [ia, ib, ic] = faces[fi];
        const a = parts[ia], b = parts[ib], d = parts[ic];
        if (!a || !b || !d) continue;

        const e1x = b.x - a.x, e1y = b.y - a.y, e1z = b.z - a.z;
        const e2x = d.x - a.x, e2y = d.y - a.y, e2z = d.z - a.z;
        const nx = e1y * e2z - e1z * e2y;
        const ny = e1z * e2x - e1x * e2z;
        const nz = e1x * e2y - e1y * e2x;
        const nl = Math.hypot(nx, ny, nz) || 1;
        if (nz / nl < -0.15 && solidBoost < 0.5) continue; // back-face cull

        const lit = Math.max(0.12, Math.min(1, (nz / nl) * 0.75 + 0.4));
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);
        ctx.lineTo(d.px, d.py);
        ctx.closePath();
        ctx.globalAlpha = alpha * lit * (0.55 + solidBoost * 0.45);
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // #endregion


    // #region drawVertices
    function drawVertices(parts, color, glowColor, alpha, size) {
      if (alpha < 0.02) return;
      const step = parts.length > 80 ? 2 : 1;
      for (let i = 0; i < parts.length; i += step) {
        const p = parts[i];
        const r = size * p.sc;
        if (r < 0.4) continue;
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.fillStyle = glowColor;
        ctx.arc(p.px, p.py, r * 2.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Cache colors – only refresh on theme change
    let cachedColors = getColors();
    let lastTheme = document.documentElement.getAttribute('data-theme');
    // #endregion


    // #region draw
    function draw() {
      if (!running) return;
      frame++;

      time += 0.009;
      smoothMX += (mouseX - smoothMX) * 0.07;
      smoothMY += (mouseY - smoothMY) * 0.07;

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const raw = Math.min(1, Math.max(0, window.scrollY / (maxScroll * 0.55)));
      formAmount += (ease(raw) - formAmount) * 0.075;

      const rotY = time * 0.28 + smoothMX * 0.4;
      const rotX = 0.42 + smoothMY * 0.25 + Math.sin(time * 0.22) * 0.05;

      const theme = document.documentElement.getAttribute('data-theme');
      if (theme !== lastTheme) {
        lastTheme = theme;
        cachedColors = getColors();
      }
      const c = cachedColors;

      const vS = stageVertex(formAmount);
      const eS = stageEdge(formAmount);
      const fS = stageFace(formAmount);
      const sS = stageSolid(formAmount);

      ctx.clearRect(0, 0, W, H);

      // Floor grid – fewer lines
      const gN = 7, gS = 0.55;
      ctx.lineWidth = 1;
      ctx.strokeStyle = c.grid;
      ctx.beginPath();
      for (let i = -gN; i <= gN; i++) {
        const a1 = project(-gN * gS, 1.75, i * gS, rotY, rotX, formAmount);
        const b1 = project(gN * gS, 1.75, i * gS, rotY, rotX, formAmount);
        const a2 = project(i * gS, 1.75, -gN * gS, rotY, rotX, formAmount);
        const b2 = project(i * gS, 1.75, gN * gS, rotY, rotX, formAmount);
        ctx.moveTo(a1.x, a1.y); ctx.lineTo(b1.x, b1.y);
        ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y);
      }
      ctx.stroke();

      // Axes
      const O = project(0, 0, 0, rotY, rotX, formAmount);
      function drawAxis(tx, ty, tz, col, label) {
        const p = project(tx, ty, tz, rotY, rotX, formAmount);
        ctx.beginPath();
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.moveTo(O.x, O.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 11px Orbitron, sans-serif';
        ctx.fillStyle = col;
        ctx.fillText(label, p.x + 8, p.y - 4);
      }
      drawAxis(2.0, 0, 0, c.axisX, 'X');
      drawAxis(0, -2.0, 0, c.axisY, 'Y');
      drawAxis(0, 0, 2.0, c.axisZ, 'Z');

      updateParts(coreParts, vS);
      updateParts(shellParts, Math.min(1, vS * 1.15));
      updateParts(ringAParts, Math.min(1, vS * 1.25));
      updateParts(ringBParts, Math.min(1, vS * 1.35));

      projectParts(coreParts, rotY, rotX, formAmount);
      projectParts(shellParts, rotY, rotX, formAmount);
      projectParts(ringAParts, rotY, rotX, formAmount);
      projectParts(ringBParts, rotY, rotX, formAmount);

      drawEdges(ringBParts, ringB.edges, c.ring2, eS * 0.45, 0.9);
      drawEdges(ringAParts, ringA.edges, c.ring, eS * 0.55, 1.0);

      drawEdges(shellParts, shell.edges, c.line, eS * 0.5, 0.9);
      drawFaces(shellParts, shell.faces, c.face, c.faceStroke, fS * 0.55, sS * 0.4);

      drawFaces(
        coreParts,
        core.faces,
        sS > 0.2 ? c.faceSolid : c.face,
        c.faceStroke,
        Math.max(fS, sS * 0.9),
        sS
      );
      drawEdges(coreParts, core.edges, c.lineStrong, eS * (1 - sS * 0.5), 1.15);

      if (sS > 0.15) {
        const coreCenter = project(0, 0, 0, rotY, rotX, formAmount);
        const pulse = 0.7 + Math.sin(time * 2.2) * 0.3;
        const gr = ctx.createRadialGradient(
          coreCenter.x, coreCenter.y, 0,
          coreCenter.x, coreCenter.y, 90 * pulse * (0.5 + sS)
        );
        gr.addColorStop(0, c.coreGlow);
        gr.addColorStop(0.4, c.glow);
        gr.addColorStop(1, 'transparent');
        ctx.globalAlpha = sS * 0.7 * pulse;
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(coreCenter.x, coreCenter.y, 100 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const vertAlpha = vS * (1 - sS * 0.7);
      drawVertices(coreParts, c.point, c.glow, vertAlpha, 2.0);
      drawVertices(shellParts, c.point, c.glow, vertAlpha * 0.55, 1.4);

      if (eS > 0.1) {
        for (let oi = 0; oi < orbits.length; oi++) {
          const o = orbits[oi];
          const ang = time * o.speed + o.phase;
          const x = Math.cos(ang) * o.radius;
          const z = Math.sin(ang) * o.radius;
          const y = Math.sin(ang * 0.7 + o.phase) * o.tilt * 0.4;
          const pr = project(x, y, z, rotY, rotX, formAmount);
          const r = o.size * pr.scale * (0.6 + eS * 0.4);
          ctx.globalAlpha = (0.35 + eS * 0.45) * (0.7 + Math.sin(ang * 3) * 0.3);
          ctx.beginPath();
          ctx.fillStyle = c.orbit;
          ctx.arc(pr.x, pr.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Dust every other frame
      if (frame % 2 === 0) {
        for (let di = 0; di < dust.length; di++) {
          const p = dust[di];
          const t = time * p.speed + p.phase;
          const ax = p.x + Math.sin(t * 0.6) * 0.3;
          const ay = p.y + Math.cos(t * 0.5) * 0.25;
          const az = p.z + Math.sin(t * 0.4) * 0.3;
          const pr = project(ax, ay, az, rotY, rotX, formAmount);
          const r = 1.1 * pr.scale;
          if (r < 0.25) continue;
          ctx.globalAlpha = 0.35 + Math.sin(t * 2) * 0.12;
          ctx.beginPath();
          ctx.fillStyle = c.ambient;
          ctx.arc(pr.x, pr.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // HUD parallax – throttle DOM writes
      if (frame % 2 === 0) {
        scene.querySelectorAll('[data-depth]').forEach(layer => {
          const depth = parseFloat(layer.getAttribute('data-depth')) || 0.2;
          layer.style.transform =
            'translate3d(' + (smoothMX * depth * 34).toFixed(1) + 'px, ' +
            (smoothMY * depth * 22).toFixed(1) + 'px, 0)';
        });
      }

      if (!reducedMotion && running) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running && !reducedMotion) requestAnimationFrame(draw);
    });

    if (!isTouch && !reducedMotion) {
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / Math.max(W, 1) - 0.5) * 2;
        mouseY = (e.clientY / Math.max(H, 1) - 0.5) * 2;
      }, { passive: true });
    }

    if (!reducedMotion) {
      requestAnimationFrame(draw);
    } else {
      formAmount = 0.05;
      requestAnimationFrame(draw);
    }
  }

  window.OverBitParallax = { init: initParallax };
})();
    // #endregion
