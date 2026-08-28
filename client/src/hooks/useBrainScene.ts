import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';

export function useBrainScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flyTitleRef = useRef<HTMLDivElement>(null);
  const txt1Ref = useRef<HTMLDivElement>(null);
  const txt2Ref = useRef<HTMLDivElement>(null);
  const txt3Ref = useRef<HTMLDivElement>(null);
  const txt4Ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current || !stageRef.current || !canvasRef.current || !flyTitleRef.current || !txt1Ref.current || !txt2Ref.current || !txt3Ref.current || !txt4Ref.current || !hintRef.current) {
      return;
    }

    const sceneEl = sceneRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const flyTitle = flyTitleRef.current;
    const hintEl = hintRef.current;
    const txt1 = txt1Ref.current;
    const txt2 = txt2Ref.current;
    const txt3 = txt3Ref.current;
    const txt4 = txt4Ref.current;

    // We assume the timeline comes after this scene. 
    // We can use document query selector to find the next section to calculate fade out.
    // Or default to viewport calculations.
    
    document.body.classList.add('brain-scene-active');

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const trap = (p: number, a: number, b: number, c: number, d: number) => 
      p <= a || p >= d ? 0 : p < b ? (p - a) / (b - a) : p < c ? 1 : 1 - (p - c) / (d - c);
    
    function progress() {
      const total = sceneEl.offsetHeight - window.innerHeight;
      const top = sceneEl.getBoundingClientRect().top;
      return total > 0 ? clamp(-top / total, 0, 1) : 0;
    }

    const INTRO = 0.13;
    const SMALL = 25.6; // navbar brand size
    const bigSize = () => Math.max(42, Math.min(140, window.innerWidth * 0.100));
    let lastT = -1;

    function layoutTitle(t: number) {
      if (Math.abs(t - lastT) < 0.0008) return; 
      lastT = t;
      flyTitle.style.fontSize = lerp(bigSize(), SMALL, t).toFixed(2) + 'px';
      const w = flyTitle.offsetWidth, h = flyTitle.offsetHeight;
      flyTitle.style.transform = 'translate(' + 
        lerp((window.innerWidth - w) / 2, 32, t).toFixed(1) + 'px,' +
        lerp((window.innerHeight - h) / 2, (74 - h) / 2, t).toFixed(1) + 'px)';
      flyTitle.classList.toggle('clickable', t > 0.9);
    }

    const handleResize = () => { lastT = -1; };
    window.addEventListener('resize', handleResize);
    
    const handleFlyTitleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    flyTitle.addEventListener('click', handleFlyTitleClick);

    function showText(el: HTMLElement, o: number) {
      el.style.opacity = o.toFixed(3);
      el.style.transform = 'translateY(calc(-50% + ' + ((1 - o) * 16).toFixed(1) + 'px))';
    }

    // --- 3D Neural Brain ---
    let renderScene: ((p: number, rlz?: number) => void) | null = null;
    let animationFrameId: number;

    let _s = 1337 >>> 0;
    const rnd = () => {
      _s = (_s + 0x6D2B79F5) | 0;
      let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);
      t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const rn = (a: number, b: number) => a + (b - a) * rnd();

    const NODES = 600, SCALE = 52;
    const nv: number[][] = [];

    function getBrainRadius(phi: number, theta: number) {
      let r = 1.0;
      
      // 1. Elongate front-to-back (Z-axis). 
      // theta=PI/2 is +Z (front), theta=3PI/2 is -Z (back)
      r *= 1.0 + 0.6 * Math.pow(Math.sin(theta), 2);

      // 2. Flatten the bottom
      if (phi > Math.PI / 2) {
        r *= 1.0 - 0.8 * Math.pow(Math.cos(phi), 2);
      }

      // 3. Longitudinal fissure (split left and right hemispheres)
      // Left/Right is the X axis. X is 0 when cos(theta) = 0.
      const distToFissure = Math.abs(Math.cos(theta)); 
      r -= 0.2 * Math.exp(-distToFissure * 15);

      // 4. Cerebellum (bulge at bottom back)
      // Back is -Z (theta = 3PI/2), bottom is phi = 3PI/4
      const bx = 0;
      const by = Math.cos(3*Math.PI/4); 
      const bz = Math.sin(3*Math.PI/4) * Math.sin(3*Math.PI/2);
      
      const px = Math.sin(phi) * Math.cos(theta);
      const py = Math.cos(phi);
      const pz = Math.sin(phi) * Math.sin(theta);
      
      const distToCerebellum = Math.sqrt((px-bx)**2 + (py-by)**2 + (pz-bz)**2);
      if (distToCerebellum < 0.6) {
        r += 0.1 * (1 - distToCerebellum/0.4);
      }

      // 5. Brainstem
      const distToStem = Math.sqrt((px-0)**2 + (pz - -0.3)**2); 
      if (phi > Math.PI - 0.5 && distToStem < 0.3) {
        r += 0.9 * (1 - distToStem/0.6);
      }

      // 6. Surface folds (Gyri and Sulci)
      const folds = 0.06 * Math.sin(phi * 22) * Math.sin(theta * 22) + 
                    0.04 * Math.sin(phi * 35) * Math.cos(theta * 35);
      r += folds;

      return r;
    }

    for (let i = 0; i < NODES; i++) {
      const theta = rn(0, Math.PI * 2);
      const phi = Math.acos(2 * rn(0, 1) - 1); 

      const maxR = getBrainRadius(phi, theta);
      // Strictly on the surface to maintain the clear brain silhouette
      const r = maxR;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      nv.push([x, y, z]);
    }

    const K = 5, MAXD = 0.6, edgeIdx: number[] = [];
    const seen = new Set();
    for (let i = 0; i < NODES; i++) {
      const a = nv[i], d: [number, number][] = [];
      for (let j = 0; j < NODES; j++) {
        if (i === j) continue;
        const b = nv[j];
        d.push([Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), j]);
      }
      d.sort((p, q) => p[0] - q[0]);
      let c = 0;
      for (let k = 0; k < d.length && c < K; k++) {
        const dist = d[k][0], j = d[k][1];
        if (dist > MAXD) break;
        const key = i < j ? i * NODES + j : j * NODES + i;
        if (!seen.has(key)) { seen.add(key); edgeIdx.push(i, j); c++; }
      }
    }

    function pickNode(tx: number, ty: number, tz: number) {
      const tl = Math.hypot(tx, ty, tz) || 1; let best = 0, bv = -2;
      for (let i = 0; i < NODES; i++) {
        const [x, y, z] = nv[i]; const l = Math.hypot(x, y, z) || 1;
        const dot = (x * tx + y * ty + z * tz) / (l * tl);
        if (dot > bv) { bv = dot; best = i; }
      }
      return best;
    }
    const hotIdx = [
      pickNode(-0.72, 0.30, 0.78),
      pickNode(0.76, 0.40, -0.45),
      pickNode(-0.76, 0.30, -0.55),
      pickNode(0.50, -0.30, 0.60)
    ];

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, 1, 1, 3000); 
    cam.position.set(0, 0, 210);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    let eMatLine: LineMaterial | null = null;
    function size() {
      if (!stage) return;
      const w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      if (eMatLine) eMatLine.resolution.set(w, h);
    }
    size();
    window.addEventListener('resize', size);

    const group = new THREE.Group(); 
    scene.add(group);

    function disc() {
      const c = document.createElement('canvas'); c.width = c.height = 64; 
      const x = c.getContext('2d');
      if (!x) return null;
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(.4, 'rgba(255,255,255,.75)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.beginPath(); x.arc(32, 32, 32, 0, 7); x.fill();
      return new THREE.CanvasTexture(c);
    }
    const tex = disc();
    const nodeTex = tex;

    // Node vertex colors: Subtle Wine base & Warm Gold focus synapses
    const OFF  = [0.12, 0.01, 0.01], RED = [0.42, 0.04, 0.02], GRN = [0.92, 0.68, 0.15];
    // Edge colors: Deep subtle wine wireframe (toned down, no glowing orange)
    const EGREY = [0.08, 0.01, 0.01], ESOFT = [0.28, 0.03, 0.02];

    const npos = new Float32Array(NODES * 3), ncol = new Float32Array(NODES * 3);
    for (let i = 0; i < NODES; i++) {
      npos[i * 3] = nv[i][0] * SCALE; 
      npos[i * 3 + 1] = nv[i][1] * SCALE; 
      npos[i * 3 + 2] = nv[i][2] * SCALE;
    }
    
    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute('position', new THREE.Float32BufferAttribute(npos, 3));
    nGeo.setAttribute('color', new THREE.Float32BufferAttribute(ncol, 3));
    const nMat = new THREE.PointsMaterial({
      size: 3.5, map: nodeTex, transparent: true, depthWrite: false,
      blending: THREE.NormalBlending, vertexColors: true, opacity: 0.90
    });
    group.add(new THREE.Points(nGeo, nMat));

    const epos = new Float32Array(edgeIdx.length * 3);
    for (let e = 0; e < edgeIdx.length; e++) {
      const n = edgeIdx[e];
      epos[e * 3] = nv[n][0] * SCALE; epos[e * 3 + 1] = nv[n][1] * SCALE; epos[e * 3 + 2] = nv[n][2] * SCALE;
    }
    // Use LineSegmentsGeometry + LineMaterial for hairline structural lines
    const eGeo = new LineSegmentsGeometry();
    eGeo.setPositions(epos);
    eMatLine = new LineMaterial({
      color: 0x4a0a10,     // Deep muted wine/crimson
      transparent: true,
      opacity: 0.70,       // higher opacity prevents washing out to pink
      depthWrite: false,
      blending: THREE.NormalBlending,
      linewidth: 1.0,      // crisp hairline
      resolution: new THREE.Vector2(stage.clientWidth, stage.clientHeight),
    });
    const eMat = eMatLine;
    group.add(new LineSegments2(eGeo, eMatLine));

    const hpos = new Float32Array(hotIdx.length * 3);
    hotIdx.forEach((idx, k) => {
      hpos[k * 3] = nv[idx][0] * SCALE; hpos[k * 3 + 1] = nv[idx][1] * SCALE; hpos[k * 3 + 2] = nv[idx][2] * SCALE;
    });
    const hGeo = new THREE.BufferGeometry(); 
    hGeo.setAttribute('position', new THREE.Float32BufferAttribute(hpos, 3));
    const hMat = new THREE.PointsMaterial({
      size: 10, map: tex, transparent: true, depthWrite: false,
      blending: THREE.NormalBlending, color: 0xe6b864, opacity: 0 // Warm Amber Gold
    });
    group.add(new THREE.Points(hGeo, hMat));

    const _v = new THREE.Vector3(), _e = new THREE.Euler();
    const info = hotIdx.map(idx => {
      const v = nv[idx], l = Math.hypot(v[0], v[1], v[2]) || 1;
      return {
        rx: -Math.asin(clamp(v[1] / l, -1, 1)), ry: Math.atan2(v[0] / l, v[2] / l),
        local: new THREE.Vector3(v[0] * SCALE, v[1] * SCALE, v[2] * SCALE)
      };
    });

    const flSeed = new Float32Array(NODES), litArr = new Float32Array(NODES);
    for (let i = 0; i < NODES; i++) flSeed[i] = rnd();

    const BR = 80, FOV = 25 * Math.PI / 180;
    function fitCz() {
      const need = BR + 10;
      return Math.max(need / Math.tan(FOV), need / (Math.tan(FOV) * cam.aspect));
    }
    function framed(st: any) { const m = fitCz(); if (st.cz < m) st.cz = m; return st; }

    const unwrappedRy = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      let ry = info[i].ry + Math.PI * 2;
      if (i > 0) {
        while (ry < unwrappedRy[i - 1]) ry += Math.PI * 2;
      }
      unwrappedRy[i] = ry;
    }

    const ZOOM_CZ = 98;
    function nodeState(i: number, sideSign: number) {
      const rx = info[i].rx, ry = unwrappedRy[i], cz = ZOOM_CZ;
      _v.copy(info[i].local).applyEuler(_e.set(rx, ry, 0, 'XYZ'));
      const W = Math.tan(FOV) * cz * cam.aspect;
      const off = sideSign * W * 0.26;
      return { rx, ry, rz: 0, px: -_v.x + off, py: -_v.y, pz: -_v.z, cz };
    }
    const START = { rx: 0.05, ry: -Math.PI / 2, rz: 0, px: 0, py: -15, pz: 0, cz: 215 };
    const TEND = { rx: 0.05, ry: -Math.PI / 2 + Math.PI * 2, rz: 0, px: 0, py: -15, pz: 0, cz: 215 };
    const lerpS = (A: any, B: any, t: number) => ({
      rx: lerp(A.rx, B.rx, t), ry: lerp(A.ry, B.ry, t), rz: lerp(A.rz, B.rz, t),
      px: lerp(A.px, B.px, t), py: lerp(A.py, B.py, t), pz: lerp(A.pz, B.pz, t), cz: lerp(A.cz, B.cz, t)
    });

    function targets(p: number) {
      let st, hi = 0; 
      const C1 = nodeState(0, 1), C2 = nodeState(1, -1), C3 = nodeState(2, 1), C4 = nodeState(3, -1);
      
      if (p < 0.15) { st = { ...START }; }
      else if (p < 0.22) {
        const a = smooth(seg(p, 0.15, 0.22));
        st = lerpS(framed({ ...START }), C1, a);
        const fl = Math.sin(a * Math.PI);
        st.rx += fl * 0.10; st.ry += fl * 0.15; st.rz += Math.sin(a * Math.PI * 2) * 0.08;
        hi = smooth(seg(p, 0.18, 0.22));
      }
      else if (p < 0.35) { st = C1; hi = 1; }
      else if (p < 0.42) { st = lerpS(C1, C2, smooth(seg(p, 0.35, 0.42))); hi = 1; }
      else if (p < 0.55) { st = C2; hi = 1; }
      else if (p < 0.62) { st = lerpS(C2, C3, smooth(seg(p, 0.55, 0.62))); hi = 1; }
      else if (p < 0.75) { st = C3; hi = 1; }
      else if (p < 0.82) { st = lerpS(C3, C4, smooth(seg(p, 0.75, 0.82))); hi = 1; }
      else if (p < 0.92) { st = C4; hi = 1; }
      else {
        const a = smooth(seg(p, 0.92, 1));
        let endRy = START.ry;
        while (endRy < C4.ry) endRy += Math.PI * 2;
        st = lerpS(C4, framed({ ...START, ry: endRy }), a);
        hi = 1 - a;
      }
      return { st, hi };
    }

    function nodeLit(env: number, t: number, seed: number) {
      if (env <= 0) return 0;
      if (env >= 1) return 1;
      const onset = seed * 0.52, le = clamp((env - onset) / (1 - onset), 0, 1);
      if (le <= 0) {
        let s = Math.sin((Math.floor(t * 24) + seed * 91) * 91.7) * 43758.5; s -= Math.floor(s);
        return s > 0.93 ? 1 : 0;
      }
      if (le >= 0.97) return 1;
      const stutter = le > 0.66;
      const ph = Math.floor(t * (stutter ? 30 : 15) + seed * 53);
      let h = Math.sin(ph * 12.9898 + seed * 78.233) * 43758.5453; h -= Math.floor(h);
      return h < (stutter ? 0.5 : (0.14 + 0.5 * le)) ? 1 : 0;
    }

    const cur = { rx: 0, ry: -Math.PI / 2, rz: 0, px: 0, py: 0, pz: 0, cz: 210, hi: 0, snap: 0 };
    let time = 0;
    
    renderScene = function (p: number, rlz?: number) {
      time += 0.016;
      const T = targets(p), st = T.st, k = 0.15, kc = 0.12;
      cur.rx += (st.rx - cur.rx) * k; cur.ry += (st.ry - cur.ry) * k; cur.rz += (st.rz - cur.rz) * k;
      cur.px += (st.px - cur.px) * k; cur.py += (st.py - cur.py) * k; cur.pz += (st.pz - cur.pz) * k;
      cur.cz += (st.cz - cur.cz) * kc; cur.hi += (T.hi - cur.hi) * 0.18;
      
      group.rotation.set(cur.rx, cur.ry, cur.rz);
      group.position.set(cur.px, cur.py, cur.pz);
      cam.position.z = cur.cz; cam.lookAt(0, 0, 0);

      let env;
      if (p < INTRO) env = seg(p, 0.02, 0.12);
      else env = 1;
      env *= 1 - (rlz || 0);
      const powering = (env > 0 && env < 1);
      
      cur.snap += ((env >= 1 ? 1 : 0) - cur.snap) * 0.9;
      const S = cur.snap;

      for (let i = 0; i < NODES; i++) {
        const tgt = nodeLit(env, time, flSeed[i]);
        litArr[i] += (tgt - litArr[i]) * 0.6;
        const L = litArr[i];
        ncol[i * 3] = lerp(OFF[0], RED[0], L); 
        ncol[i * 3 + 1] = lerp(OFF[1], RED[1], L); 
        ncol[i * 3 + 2] = lerp(OFF[2], RED[2], L);
      }
      
      for (const idx of hotIdx) {
        const L = litArr[idx];
        const rr = lerp(OFF[0], RED[0], L), rg = lerp(OFF[1], RED[1], L), rb = lerp(OFF[2], RED[2], L);
        ncol[idx * 3] = lerp(rr, GRN[0], cur.hi); 
        ncol[idx * 3 + 1] = lerp(rg, GRN[1], cur.hi); 
        ncol[idx * 3 + 2] = lerp(rb, GRN[2], cur.hi);
      }
      
      nGeo.attributes.color.needsUpdate = true;
      nMat.color.setRGB(1, 1, 1);
      nMat.opacity = 0.35 + 0.40 * S;         // refined node opacity
      nMat.size    = 2.8 + 1.2 * S;           // refined node scale
      eMat.color.setRGB(lerp(EGREY[0], ESOFT[0], S), lerp(EGREY[1], ESOFT[1], S), lerp(EGREY[2], ESOFT[2], S));
      
      const gf = nodeLit(env, time, 0.37);
      eMat.opacity = 0.12 + 0.22 * S + (powering ? 0.05 * gf : 0); // subtle hairline wireframe opacity
      hMat.opacity = cur.hi * S * (0.75 + 0.15 * Math.sin(time * 3));
      
      renderer.render(scene, cam);
    };

    function frame() {
      animationFrameId = requestAnimationFrame(frame);
      const p = progress();
      layoutTitle(smooth(seg(p, 0, INTRO)));
      
      hintEl.style.opacity = p > 0.01 ? '0' : '0.7';
      showText(txt1, trap(p, 0.22, 0.24, 0.33, 0.35));
      showText(txt2, trap(p, 0.42, 0.44, 0.53, 0.55));
      showText(txt3, trap(p, 0.62, 0.64, 0.73, 0.75));
      showText(txt4, trap(p, 0.82, 0.84, 0.90, 0.92));
      
      // Look for the next section (e.g. About) to calculate fade out
      const nextSectionEl = sceneEl.nextElementSibling as HTMLElement;
      let rf = 0;
      if (nextSectionEl) {
        const tlTop = nextSectionEl.getBoundingClientRect().top;
        rf = clamp((window.innerHeight - tlTop) / (window.innerHeight * 0.72), 0, 1);
      }
      
      const rlz = smooth(clamp((rf - 0.12) / 0.72, 0, 1));
      
      if (p < 1) { 
        stage.style.opacity = '1'; 
        stage.style.visibility = 'visible'; 
        stage.style.transform = 'none'; 
      } else {
        stage.style.opacity = (1 - smooth(clamp((rf - 0.05) / 0.80, 0, 1))).toFixed(3);
        stage.style.visibility = rf >= 1 ? 'hidden' : 'visible';
        stage.style.transform = 'translateY(' + (-rf * 26).toFixed(1) + 'px)';
      }
      
      if (renderScene && (p < 1 || rf < 1)) renderScene(p, p < 1 ? 0 : rlz);
    }
    
    frame();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', size);
      flyTitle.removeEventListener('click', handleFlyTitleClick);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('brain-scene-active');
      // Cleanup THREE.js resources if needed
      scene.clear();
      renderer.dispose();
      nGeo.dispose();
      nMat.dispose();
      eGeo.dispose();
      if (eMatLine) eMatLine.dispose();
      hGeo.dispose();
      hMat.dispose();
      if (tex) tex.dispose();
    };
  }, []);

  return { sceneRef, stageRef, canvasRef, flyTitleRef, txt1Ref, txt2Ref, txt3Ref, txt4Ref, hintRef };
}
