// 3D-Sonnensystem mit three.js.
// Positionen kommen aus astronomy-engine (heliozentrisch, J2000) und werden in die Ekliptik gedreht:
// Szene-Y zeigt zum Ekliptik-Nordpol. Drei Maßstäbe: Übersicht (gestauchte Abstände, vergrößerte Körper),
// echte Abstände und Größenvergleich nebeneinander.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import * as A from 'astronomy-engine';
import { BODIES, BODY, EARTH_RADIUS_KM, PLANET_ORDER, type BodyDef, type SolarId } from './bodies';
import { cloudTexture, glowTexture, proceduralTexture, ringTexture } from './textures';
import type { SkyData } from '../sky/engine';
import { SolarExtras } from './extras';
import type { Probe } from '../lib/live/probes';

export type ScaleMode = 'overview' | 'distance' | 'size';

const AU_KM = 149_597_870.7;
const OBLIQ = (23.4392911 * Math.PI) / 180;
const K = 22; // Szene-Einheiten pro AE (bzw. √AE in der Übersicht)
const DAY_MS = 86_400_000;
const J2000 = Date.UTC(2000, 0, 1, 12);

const PLANET_BODY: Partial<Record<SolarId, A.Body>> = {
  mercury: A.Body.Mercury,
  venus: A.Body.Venus,
  earth: A.Body.Earth,
  mars: A.Body.Mars,
  jupiter: A.Body.Jupiter,
  saturn: A.Body.Saturn,
  uranus: A.Body.Uranus,
  neptune: A.Body.Neptune,
  pluto: A.Body.Pluto,
};

/** J2000-Äquator → Ekliptik → Szene (x, z_ekl, −y_ekl) */
function toScene(x: number, y: number, z: number, out = new THREE.Vector3()) {
  const ye = y * Math.cos(OBLIQ) + z * Math.sin(OBLIQ);
  const ze = -y * Math.sin(OBLIQ) + z * Math.cos(OBLIQ);
  return out.set(x, ze, -ye);
}

function raDecToScene(raDeg: number, decDeg: number) {
  const ra = (raDeg * Math.PI) / 180;
  const dec = (decDeg * Math.PI) / 180;
  return toScene(Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)).normalize();
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const ATMO_VERTEX = /* glsl */ `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
    #include <logdepthbuf_vertex>
  }
`;
const ATMO_FRAGMENT = /* glsl */ `
  #include <logdepthbuf_pars_fragment>
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    #include <logdepthbuf_fragment>
    float rim = 1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0);
    float a = pow(rim, 2.6) * uStrength;
    gl_FragColor = vec4(uColor, a);
  }
`;

const POINTS_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute vec4 aColor;
  varying vec4 vColor;
  uniform float uPixelRatio;
  void main() {
    vColor = aColor;
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const POINTS_FRAGMENT = /* glsl */ `
  varying vec4 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor.rgb, vColor.a * a);
  }
`;

interface Node {
  def: BodyDef;
  root: THREE.Group;
  axis: THREE.Group;
  mesh: THREE.Mesh;
  clouds?: THREE.Mesh;
  label: CSS2DObject;
  marker: THREE.Sprite;
  hit: THREE.Mesh;
  pole: THREE.Vector3;
  /** Heliozentrische Position in AE (Szene-Orientierung) bzw. bei Monden relativ zum Mutterkörper */
  au: THREE.Vector3;
  orbits: { overview?: THREE.Line; distance?: THREE.Line };
  moonRing?: THREE.Line;
}

export interface SolarCallbacks {
  onSelect?: (id: SolarId | null) => void;
  onTick?: (date: Date) => void;
  /** Eine Raumsonde wurde angetippt */
  onProbe?: (id: string) => void;
}

export interface SolarLabels {
  name: (id: SolarId) => string;
  probe: (p: Probe) => string;
}

export class SolarEngine {
  private renderer: THREE.WebGLRenderer;
  private labels: CSS2DRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private nodes = new Map<SolarId, Node>();
  private stars: THREE.Group;
  private resizeObs: ResizeObserver;
  private timer = new THREE.Timer();
  private loader = new THREE.TextureLoader();

  /** Simulationszeit (ms) und Tempo (Tage pro Sekunde) */
  time = Date.now();
  speed = 1;

  mode: ScaleMode = 'overview';
  private prevMode: ScaleMode = 'overview';
  private modeMix = 1;

  selected: SolarId | null = null;
  private follow: SolarId | null = null;
  private lastFollow = new THREE.Vector3();
  private flight: { fromPos: THREE.Vector3; fromTarget: THREE.Vector3; t: number; dur: number; to: () => { pos: THREE.Vector3; target: THREE.Vector3 } } | null =
    null;
  private lastTick = 0;
  private down: { x: number; y: number; t: number } | null = null;
  private raycaster = new THREE.Raycaster();
  private sunGlow: { sprite: THREE.Sprite; scale: number }[] = [];
  private extras: SolarExtras;

  constructor(
    private container: HTMLElement,
    private sky: SkyData,
    private names: SolarLabels,
    private cb: SolarCallbacks = {},
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = 'solar-canvas';
    container.appendChild(this.renderer.domElement);

    this.labels = new CSS2DRenderer();
    this.labels.domElement.className = 'solar-labels';
    container.appendChild(this.labels.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.0005, 60_000);
    this.camera.position.set(0, 95, 150);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.6;
    this.controls.zoomSpeed = 0.9;
    this.controls.minDistance = 0.002;
    this.controls.maxDistance = 6_000;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.05));
    const sunLight = new THREE.PointLight(0xffffff, 2.6, 0, 0);
    this.scene.add(sunLight);

    this.stars = this.buildStars();
    this.scene.add(this.stars);
    for (const def of BODIES) this.buildBody(def);
    this.buildOrbits();
    this.extras = new SolarExtras(
      this.scene,
      (au, mode, out) => this.scalePos(au, mode, out),
      this.renderer.getPixelRatio(),
      (p) => this.names.probe(p),
      (id) => this.cb.onProbe?.(id),
    );
    this.update(0);

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onDown);
    el.addEventListener('pointerup', this.onUp);
    this.controls.addEventListener('start', this.onControlStart);

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(container);
    this.resize();
    const start = this.homeView('overview');
    this.camera.position.copy(start.pos);
    this.controls.target.copy(start.target);
    this.timer.connect(document);
    this.renderer.setAnimationLoop(this.loop);
  }

  destroy() {
    this.extras.dispose();
    this.renderer.setAnimationLoop(null);
    this.timer.dispose();
    this.resizeObs.disconnect();
    this.controls.dispose();
    this.renderer.domElement.removeEventListener('pointerdown', this.onDown);
    this.renderer.domElement.removeEventListener('pointerup', this.onUp);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
        for (const v of Object.values(x)) if (v instanceof THREE.Texture) v.dispose();
        x.dispose();
      });
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.labels.domElement.remove();
  }

  // ---------------------------------------------------------------- Aufbau

  private texture(canvas: HTMLCanvasElement) {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  private buildBody(def: BodyDef) {
    const root = new THREE.Group();
    const axis = new THREE.Group();
    const pole = raDecToScene(def.poleRa, def.poleDec);
    axis.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pole);
    root.add(axis);

    const geo = new THREE.SphereGeometry(1, def.type === 'moon' ? 48 : 96, def.type === 'moon' ? 32 : 64);
    let material: THREE.Material;
    if (def.id === 'sun') {
      material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    } else {
      material = new THREE.MeshStandardMaterial({ color: def.color, roughness: 1, metalness: 0 });
    }
    const mesh = new THREE.Mesh(geo, material);
    axis.add(mesh);

    // Textur: NASA-Karte laden oder im Browser erzeugen (verzögert, damit der Start flüssig bleibt)
    const applyMap = (map: THREE.Texture) => {
      const m = mesh.material as THREE.MeshStandardMaterial;
      m.map = map;
      m.color.set(0xffffff);
      m.needsUpdate = true;
    };
    if (def.texture.kind === 'image') {
      this.loader.load(`./textures/${def.texture.file}`, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        applyMap(tex);
      });
    } else {
      const style = def.texture.style;
      window.setTimeout(() => applyMap(this.texture(proceduralTexture(style))), 60 + PLANET_ORDER.indexOf(def.id) * 40 + (def.type === 'moon' ? 600 : 0));
    }

    let clouds: THREE.Mesh | undefined;
    if (def.clouds) {
      const cloudMat = new THREE.MeshStandardMaterial({ transparent: true, roughness: 1, metalness: 0, depthWrite: false, opacity: def.clouds === 'venus' ? 0.9 : 1 });
      clouds = new THREE.Mesh(new THREE.SphereGeometry(def.clouds === 'venus' ? 1.015 : 1.012, 96, 64), cloudMat);
      axis.add(clouds);
      window.setTimeout(() => {
        cloudMat.map = this.texture(cloudTexture(def.clouds!));
        cloudMat.needsUpdate = true;
      }, 400);
    }

    if (def.atmosphere) {
      const atmo = new THREE.Mesh(
        new THREE.SphereGeometry(1.06, 64, 48),
        new THREE.ShaderMaterial({
          vertexShader: ATMO_VERTEX,
          fragmentShader: ATMO_FRAGMENT,
          uniforms: { uColor: { value: new THREE.Color(def.atmosphere) }, uStrength: { value: def.id === 'venus' ? 1.1 : 0.9 } },
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      root.add(atmo);
    }

    if (def.rings) {
      const inner = 1.24;
      const outer = 2.27;
      const ringGeo = new THREE.RingGeometry(inner, outer, 160, 1);
      const pos = ringGeo.attributes.position as THREE.BufferAttribute;
      const uv = ringGeo.attributes.uv as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const r = Math.hypot(pos.getX(i), pos.getY(i));
        uv.setXY(i, (r - inner) / (outer - inner), 0.5);
      }
      ringGeo.rotateX(-Math.PI / 2);
      const ringMap = this.texture(ringTexture());
      const ring = new THREE.Mesh(
        ringGeo,
        // Die Ringe stehen derzeit fast seitlich zur Sonne und wären kaum beleuchtet – ein leichtes Eigenleuchten hält sie sichtbar
        new THREE.MeshStandardMaterial({ map: ringMap, emissiveMap: ringMap, emissive: 0xffffff, emissiveIntensity: 0.35, transparent: true, side: THREE.DoubleSide, roughness: 1, metalness: 0, alphaTest: 0.02 }),
      );
      axis.add(ring);
    }

    if (def.id === 'sun') {
      const glow = this.texture(glowTexture([[0, 'rgba(255,230,170,0.9)'], [0.25, 'rgba(255,170,70,0.35)'], [1, 'rgba(255,120,40,0)']]));
      for (const [scale, opacity] of [
        [3.2, 0.9],
        [9, 0.35],
      ]) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
        s.scale.setScalar(scale);
        root.add(s);
        this.sunGlow.push({ sprite: s, scale });
      }
    }

    // Unsichtbare Trefferkugel (größer als der Körper) für das Antippen
    const hit = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.userData.id = def.id;
    root.add(hit);

    // Markierung, die in jeder Entfernung sichtbar bleibt (für den Maßstab „echte Abstände“)
    const marker = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.texture(glowTexture([[0, def.color], [0.35, def.color], [0.5, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']])),
        sizeAttenuation: false,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    marker.scale.setScalar(def.type === 'moon' ? 0.008 : 0.014);
    this.scene.add(marker);

    const el = document.createElement('button');
    el.className = `solar-label solar-label--${def.type}`;
    el.textContent = this.names.name(def.id);
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    el.addEventListener('click', () => this.select(def.id, true));
    const label = new CSS2DObject(el);
    label.position.set(0, 1.35, 0);
    label.center.set(0.5, 1);
    root.add(label);

    this.scene.add(root);
    this.nodes.set(def.id, { def, root, axis, mesh, clouds, label, marker, hit, pole, au: new THREE.Vector3(), orbits: {} });
  }

  /** Bahnen: eine volle Umlaufzeit abtasten (heliozentrisch), je eine Linie pro Maßstab */
  private buildOrbits() {
    const start = new Date();
    for (const [id, body] of Object.entries(PLANET_BODY) as [SolarId, A.Body][]) {
      const def = BODY[id];
      const period = def.facts!.yearD!;
      const pts: THREE.Vector3[] = [];
      const steps = 360;
      for (let i = 0; i <= steps; i++) {
        const v = A.HelioVector(body, new Date(start.getTime() + (i / steps) * period * DAY_MS));
        pts.push(toScene(v.x, v.y, v.z));
      }
      const node = this.nodes.get(id)!;
      for (const mode of ['overview', 'distance'] as const) {
        const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p) => this.scalePos(p, mode)));
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0, depthWrite: false }));
        this.scene.add(line);
        node.orbits[mode] = line;
      }
    }
    // Mondbahnen als Kreise in der Äquatorebene des Mutterplaneten (der Erdmond: Ekliptik)
    for (const def of BODIES.filter((b) => b.type === 'moon')) {
      const parent = this.nodes.get(def.parent!)!;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
      }
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: '#8aa4ff', transparent: true, opacity: 0, depthWrite: false }),
      );
      (def.id === 'moon' ? parent.root : parent.axis).add(ring);
      this.nodes.get(def.id)!.moonRing = ring;
    }
  }

  private buildStars() {
    const group = new THREE.Group();
    const R = 20_000;
    const make = (positions: number[], sizes: number[], colors: number[]) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
      geo.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 4));
      const mat = new THREE.ShaderMaterial({
        vertexShader: POINTS_VERTEX,
        fragmentShader: POINTS_FRAGMENT,
        uniforms: { uPixelRatio: { value: this.renderer.getPixelRatio() } },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      pts.renderOrder = -1;
      return pts;
    };
    // Milchstraße als weiche, schwache Punkte
    {
      const p: number[] = [];
      const s: number[] = [];
      const c: number[] = [];
      for (const [ra, dec, level] of this.sky.milkyWay) {
        const v = raDecToScene(ra, dec).multiplyScalar(R);
        p.push(v.x, v.y, v.z);
        s.push(26);
        c.push(0.75, 0.8, 1, 0.035 * level);
      }
      group.add(make(p, s, c));
    }
    {
      const p: number[] = [];
      const s: number[] = [];
      const c: number[] = [];
      for (const [ra, dec, mag, bv] of this.sky.stars) {
        const v = raDecToScene(ra, dec).multiplyScalar(R);
        p.push(v.x, v.y, v.z);
        s.push(Math.max(1.2, Math.min(5.5, 4.2 - 0.62 * mag)));
        const t = Math.max(0, Math.min(1, (bv + 0.3) / 1.9));
        c.push(0.75 + 0.25 * t, 0.82 + 0.1 * (1 - Math.abs(t - 0.4)), 1 - 0.35 * t, Math.max(0.25, Math.min(1, 1.15 - mag * 0.14)));
      }
      group.add(make(p, s, c));
    }
    return group;
  }

  // ---------------------------------------------------------------- Maßstäbe

  private scalePos(au: THREE.Vector3, mode: ScaleMode, out = new THREE.Vector3()) {
    const r = au.length();
    if (r === 0) return out.set(0, 0, 0);
    if (mode === 'overview') return out.copy(au).multiplyScalar((K * Math.sqrt(r)) / r);
    return out.copy(au).multiplyScalar(K);
  }

  private radiusFor(def: BodyDef, mode: ScaleMode): number {
    if (mode === 'distance') return (def.radiusKm / AU_KM) * K;
    if (mode === 'size') return def.radiusKm / EARTH_RADIUS_KM;
    if (def.id === 'sun') return 5;
    if (def.type === 'moon') {
      const parent = BODY[def.parent!];
      const pr = this.radiusFor(parent, 'overview');
      return pr * Math.max(0.17, Math.pow(def.radiusKm / parent.radiusKm, 0.6));
    }
    return 0.9 * Math.pow(def.radiusKm / EARTH_RADIUS_KM, 0.42);
  }

  /** Abstand eines Mondes zu seinem Planeten in Einheiten des Planetenradius */
  private moonDistance(def: BodyDef, mode: ScaleMode) {
    const parent = BODY[def.parent!];
    const ratio = def.orbitKm! / parent.radiusKm;
    return mode === 'overview' ? 1.6 + 0.35 * Math.sqrt(ratio) : ratio;
  }

  private sizeLayout = (() => {
    const xs = new Map<SolarId, number>();
    let cursor = BODY.sun.radiusKm / EARTH_RADIUS_KM;
    xs.set('sun', 0);
    for (const id of PLANET_ORDER.slice(1)) {
      const def = BODY[id];
      const r = (def.radiusKm / EARTH_RADIUS_KM) * (def.rings ? 2.3 : 1);
      const gap = Math.max(2.5, r * 0.25);
      xs.set(id, cursor + gap + r);
      cursor += gap + 2 * r;
    }
    return { xs, end: cursor };
  })();

  private positionFor(n: Node, mode: ScaleMode, out = new THREE.Vector3()): THREE.Vector3 {
    const def = n.def;
    if (mode === 'size') {
      if (def.type === 'moon') return this.positionFor(this.nodes.get(def.parent!)!, 'size', out);
      return out.set(this.sizeLayout.xs.get(def.id) ?? 0, 0, 0);
    }
    if (def.type !== 'moon') return this.scalePos(n.au, mode, out);
    const parent = this.nodes.get(def.parent!)!;
    this.positionFor(parent, mode, out);
    const dist = this.moonDistance(def, mode) * this.radiusFor(BODY[def.parent!], mode);
    const dir = n.au.clone().normalize();
    return out.addScaledVector(dir, dist);
  }

  setMode(mode: ScaleMode) {
    if (mode === this.mode) return;
    this.prevMode = this.mode;
    this.mode = mode;
    this.modeMix = 0;
    const sel = this.selected;
    // Nach dem Umschalten neu ausrichten
    window.setTimeout(() => (sel ? this.select(sel, true) : this.home()), 50);
  }

  // ---------------------------------------------------------------- Zeit & Positionen

  private computeAu(date: Date) {
    for (const [id, body] of Object.entries(PLANET_BODY) as [SolarId, A.Body][]) {
      const v = A.HelioVector(body, date);
      toScene(v.x, v.y, v.z, this.nodes.get(id)!.au);
    }
    const moon = A.GeoMoon(date);
    toScene(moon.x, moon.y, moon.z, this.nodes.get('moon')!.au);
    const jm = A.JupiterMoons(date);
    for (const id of ['io', 'europa', 'ganymede', 'callisto'] as const) {
      const s = jm[id];
      toScene(s.x, s.y, s.z, this.nodes.get(id)!.au);
    }
    // Titan und Charon: Kreisbahnen in der Äquatorebene des Planeten
    for (const id of ['titan', 'charon'] as const) {
      const n = this.nodes.get(id)!;
      const def = n.def;
      const parentPole = this.nodes.get(def.parent!)!.pole;
      const e1 = new THREE.Vector3(0, 1, 0).cross(parentPole).normalize();
      if (e1.lengthSq() < 1e-6) e1.set(1, 0, 0);
      const e2 = parentPole.clone().cross(e1).normalize();
      const ang = (((date.getTime() - J2000) / DAY_MS) / def.periodD!) * Math.PI * 2;
      n.au.copy(e1).multiplyScalar(Math.cos(ang)).addScaledVector(e2, Math.sin(ang)).multiplyScalar(def.orbitKm! / AU_KM);
    }
  }

  private update(dt: number) {
    const date = new Date(this.time);
    this.computeAu(date);
    if (this.modeMix < 1) this.modeMix = Math.min(1, this.modeMix + dt / 1.4);
    const m = ease(this.modeMix);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const hours = (this.time - J2000) / 3_600_000;
    const hoursPerSec = this.speed * 24;
    const camPos = this.camera.position;

    for (const n of this.nodes.values()) {
      const def = n.def;
      this.positionFor(n, this.prevMode, a);
      this.positionFor(n, this.mode, b);
      n.root.position.lerpVectors(a, b, m);
      const hidden = (mode: ScaleMode) => mode === 'size' && def.type === 'moon';
      const r0 = hidden(this.prevMode) ? 1e-6 : this.radiusFor(def, this.prevMode);
      const r1 = hidden(this.mode) ? 1e-6 : this.radiusFor(def, this.mode);
      const r = r0 + (r1 - r0) * m;
      n.root.scale.setScalar(r);

      // Eigendrehung; bei hohem Tempo gedrosselt, damit nichts flimmert
      const omega = (2 * Math.PI) / def.rotationH; // rad pro Stunde
      if (Math.abs(omega * hoursPerSec) < 4) n.mesh.rotation.y = (omega * hours) % (2 * Math.PI);
      else n.mesh.rotation.y += Math.sign(omega) * 0.6 * dt;
      if (n.clouds) n.clouds.rotation.y = n.mesh.rotation.y * 1.04;

      // Markierung: sichtbar, wenn der Körper auf dem Bildschirm winzig ist
      n.marker.position.copy(n.root.position);
      const dist = camPos.distanceTo(n.root.position);
      const pixelSize = (r / Math.max(dist, 1e-6)) * (this.renderer.domElement.clientHeight / (2 * Math.tan((this.camera.fov * Math.PI) / 360)));
      const moonShown = def.type !== 'moon' || this.selected === def.parent || this.selected === def.id;
      const markerOn = this.mode !== 'size' && pixelSize < 3 && moonShown && !(def.type === 'moon' && this.mode === 'overview');
      const mm = n.marker.material as THREE.SpriteMaterial;
      mm.opacity += ((markerOn ? (def.type === 'moon' ? 0.7 : 1) : 0) - mm.opacity) * Math.min(1, dt * 6);

      // Monde und ihre Beschriftungen nur zeigen, wenn ihr Planet gewählt oder nah ist
      if (def.type === 'moon') {
        const parentSel = this.selected === def.parent || this.selected === def.id;
        const near = camPos.distanceTo(this.nodes.get(def.parent!)!.root.position) < this.radiusFor(BODY[def.parent!], this.mode) * 60;
        n.label.visible = (parentSel || near) && this.mode !== 'size';
        n.root.visible = this.mode !== 'size' || m < 1;
        if (n.moonRing) {
          const ringMat = n.moonRing.material as THREE.LineBasicMaterial;
          const target = (parentSel || near) && this.mode !== 'size' ? 0.35 : 0;
          ringMat.opacity += (target - ringMat.opacity) * Math.min(1, dt * 4);
          n.moonRing.visible = ringMat.opacity > 0.01;
          n.moonRing.scale.setScalar(this.moonDistance(def, this.mode === 'size' ? 'overview' : this.mode));
        }
      } else {
        n.label.visible = true;
        const below = this.mode === 'size' && PLANET_ORDER.indexOf(def.id) % 2 === 0 && def.id !== 'sun';
        n.label.position.y = below ? -1.35 : 1.35;
        n.label.center.set(0.5, below ? 0 : 1);
      }
      n.label.element.classList.toggle('is-selected', this.selected === def.id);

      // Bahnlinien je Maßstab überblenden
      for (const mode of ['overview', 'distance'] as const) {
        const line = n.orbits[mode];
        if (!line) continue;
        const w = (this.mode === mode ? m : 0) + (this.prevMode === mode ? 1 - m : 0);
        const base = this.selected === def.id ? 0.75 : 0.28;
        (line.material as THREE.LineBasicMaterial).opacity = base * w;
        line.visible = w > 0.01;
      }
    }

    // Im Größenvergleich ist die Sonne riesig – ihr Leuchthof bleibt dort klein
    const glowFactor = (mode: ScaleMode) => (mode === 'size' ? 0.36 : 1);
    const gf = glowFactor(this.prevMode) + (glowFactor(this.mode) - glowFactor(this.prevMode)) * m;
    for (const g of this.sunGlow) g.sprite.scale.setScalar(Math.max(1.05, g.scale * gf));

    // Kamera: Flug oder Mitführen des gewählten Körpers
    if (this.flight) {
      const f = this.flight;
      f.t = Math.min(1, f.t + dt / f.dur);
      const k = ease(f.t);
      const to = f.to();
      this.camera.position.lerpVectors(f.fromPos, to.pos, k);
      this.controls.target.lerpVectors(f.fromTarget, to.target, k);
      if (f.t >= 1) {
        this.flight = null;
        this.controls.enabled = true;
        if (this.follow) this.lastFollow.copy(this.nodes.get(this.follow)!.root.position);
      }
    } else if (this.follow) {
      const p = this.nodes.get(this.follow)!.root.position;
      const delta = p.clone().sub(this.lastFollow);
      this.camera.position.add(delta);
      this.controls.target.add(delta);
      this.lastFollow.copy(p);
    }

    this.extras.update(this.time, this.mode, this.prevMode, m, this.camera);
    this.stars.position.copy(this.camera.position);
  }

  private loop = () => {
    this.timer.update();
    const dt = Math.min(0.1, this.timer.getDelta());
    this.time += dt * this.speed * DAY_MS;
    this.time = Math.max(Date.UTC(1900, 0, 1), Math.min(Date.UTC(2200, 0, 1), this.time));
    this.update(dt);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labels.render(this.scene, this.camera);
    const now = performance.now();
    if (now - this.lastTick > 250) {
      this.lastTick = now;
      this.cb.onTick?.(new Date(this.time));
    }
  };

  private resize() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    this.labels.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // ---------------------------------------------------------------- Bedienung

  setTime(ms: number) {
    this.time = ms;
  }

  setNames(names: SolarLabels) {
    this.names = names;
    for (const n of this.nodes.values()) n.label.element.textContent = names.name(n.def.id);
    this.extras.setNames(names.probe);
  }

  /** Raumsonden und Kleinkörper ein- oder ausblenden */
  setExtras(opts: { probes?: boolean; belts?: boolean }) {
    if (opts.probes != null) this.extras.showProbes = opts.probes;
    if (opts.belts != null) this.extras.showBelts = opts.belts;
  }

  probe(id: string) {
    return this.extras.probe(id);
  }

  /** Kamerafahrt zu einer Raumsonde; liefert false, solange ihre Daten noch fehlen */
  flyToProbe(id: string) {
    const p = this.extras.probeScenePosition(id);
    if (!p) return false;
    if (this.mode === 'size') this.setMode('overview');
    this.selected = null;
    this.follow = null;
    this.cb.onSelect?.(null);
    this.controls.enabled = false;
    const r = Math.max(p.length(), 2);
    this.flight = {
      fromPos: this.camera.position.clone(),
      fromTarget: this.controls.target.clone(),
      t: 0,
      dur: 1.8,
      // Von schräg außen und oben, damit Sonde und Sonne im Bild sind
      to: () => ({ pos: p.clone().multiplyScalar(1.35).add(new THREE.Vector3(0, r * 0.45, 0)), target: p.clone().multiplyScalar(0.6) }),
    };
    return true;
  }

  /** Kamerafahrt zu einem Körper; danach wird er mitgeführt */
  select(id: SolarId | null, fly = true) {
    this.selected = id;
    this.cb.onSelect?.(id);
    if (!id) {
      this.follow = null;
      return;
    }
    if (!fly) return;
    const n = this.nodes.get(id)!;
    this.follow = id;
    this.controls.enabled = false;
    this.flight = {
      fromPos: this.camera.position.clone(),
      fromTarget: this.controls.target.clone(),
      t: 0,
      dur: 1.6,
      to: () => {
        const p = n.root.position.clone();
        const r = this.radiusFor(n.def, this.mode);
        const dist = r * (id === 'sun' ? 5 : this.mode === 'size' ? 4 : 5.5);
        // Leicht von der Sonnenseite und von oben, damit der Körper angestrahlt ist
        const fromSun = p.lengthSq() > 1e-9 ? p.clone().normalize() : new THREE.Vector3(0, 0, 1);
        const up = new THREE.Vector3(0, 1, 0);
        const side = up.clone().cross(fromSun).normalize();
        const dir =
          this.mode === 'size' ? new THREE.Vector3(0.25, 0.25, 1).normalize() : fromSun.multiplyScalar(-0.55).addScaledVector(up, 0.35).addScaledVector(side, 0.75).normalize();
        return { pos: p.clone().addScaledVector(dir, dist), target: p };
      },
    };
  }

  /** Gesamtansicht eines Maßstabs; im Hochformat (Handy) weiter weg, damit alle Bahnen ins Bild passen */
  private homeView(mode: ScaleMode) {
    const far = this.camera.aspect < 1 ? Math.min(2.8, 1 / Math.pow(this.camera.aspect, 1.15)) : 1;
    const end = this.sizeLayout.end;
    switch (mode) {
      case 'overview':
        return { pos: new THREE.Vector3(0, 95 * far, 150 * far), target: new THREE.Vector3(0, 0, 0) };
      case 'distance':
        return { pos: new THREE.Vector3(0, 820 * far, 1250 * far), target: new THREE.Vector3(0, 0, 0) };
      case 'size':
        return { pos: new THREE.Vector3(end * 0.62, 30, end * 0.55 * far), target: new THREE.Vector3(end * 0.6, 0, 0) };
    }
  }

  /** Zurück zur Gesamtansicht des aktuellen Maßstabs */
  home() {
    this.selected = null;
    this.follow = null;
    this.cb.onSelect?.(null);
    const v = this.homeView(this.mode);
    this.controls.enabled = false;
    this.flight = { fromPos: this.camera.position.clone(), fromTarget: this.controls.target.clone(), t: 0, dur: 1.6, to: () => v };
  }

  private onControlStart = () => {
    // Nutzer greift ein: laufenden Flug abbrechen, Mitführen bleibt aktiv
    this.flight = null;
    this.controls.enabled = true;
  };

  private onDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  private onUp = (e: PointerEvent) => {
    const d = this.down;
    this.down = null;
    if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6 || performance.now() - d.t > 500) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(
      [...this.nodes.values()].filter((n) => n.root.visible && (n.def.type !== 'moon' || n.label.visible)).map((n) => n.hit),
      false,
    );
    if (hits.length) this.select(hits[0].object.userData.id as SolarId, true);
  };

  /** Aktuelle Kennwerte für die Infotafel */
  info(id: SolarId) {
    const n = this.nodes.get(id)!;
    const body = PLANET_BODY[id];
    const e = this.nodes.get('earth')!.au;
    if (id === 'sun') return { sunAu: null, earthAu: e.length() };
    if (!body) return { sunAu: null, earthAu: null };
    return { sunAu: n.au.length(), earthAu: id === 'earth' ? null : n.au.distanceTo(e) };
  }
}
