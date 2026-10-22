// 3D-Erde mit allen aktiven Satelliten. Koordinaten: erdfest (ECEF) in Erdradien,
// Szene-Achsen (x, z_ecef, −y_ecef), also y zum Nordpol und Längengrad 0 bei +x.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as A from 'astronomy-engine';
import * as sgp from '../../lib/live/sgp4';
import { SAT_GROUPS, type Sat, type SatGroup } from '../../lib/live/satellites';

const R_KM = 6371;
const DEG = Math.PI / 180;

export const GROUP_COLORS: Record<SatGroup, string> = {
  starlink: '#9fc2ff',
  oneweb: '#c58bff',
  kuiper: '#ffb36b',
  china: '#ff7a8a',
  gnss: '#ffd56b',
  geo: '#6be3a4',
  stations: '#ffffff',
  other: '#8a90a8',
};

const VERTEX = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uSize;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * clamp(4.0 / -mv.z, 0.6, 2.2);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.15, d));
  }
`;

/** Breite/Länge (Grad) → Szene-Vektor auf der Kugel mit Radius r */
export function geoToScene(lat: number, lon: number, r = 1, out = new THREE.Vector3()) {
  const c = Math.cos(lat * DEG);
  return out.set(r * c * Math.cos(lon * DEG), r * Math.sin(lat * DEG), -r * c * Math.sin(lon * DEG));
}

export interface SatPick {
  sat: Sat;
  altKm: number;
  speedKms: number;
  lat: number;
  lon: number;
}

export class SatEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.01, 200);
  private controls: OrbitControls;
  private earth: THREE.Mesh;
  private sun = new THREE.DirectionalLight(0xffffff, 2.4);
  private groups = new Map<SatGroup, { points: THREE.Points; sats: Sat[]; pos: Float32Array }>();
  private cursor = 0;
  private all: { g: SatGroup; i: number }[] = [];
  private resizeObs: ResizeObserver;
  private raycaster = new THREE.Raycaster();
  private marker: THREE.Mesh;
  private halo: THREE.Mesh;
  private down: { x: number; y: number } | null = null;
  private lastSun = 0;
  selected: { group: SatGroup; index: number } | null = null;

  constructor(
    private container: HTMLElement,
    sats: Sat[],
    home: { lat: number; lon: number },
    private onPick: (p: SatPick | null) => void,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'sat-canvas';
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.25;
    this.controls.maxDistance = 30;
    this.controls.rotateSpeed = 0.5;

    // Erde mit Tag-Nacht-Beleuchtung
    const tex = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/earth.jpg`);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    this.earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 }));
    this.scene.add(this.earth);
    this.scene.add(new THREE.AmbientLight(0x8899cc, 0.35));
    this.scene.add(this.sun);
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.025, 64, 48),
      new THREE.MeshBasicMaterial({ color: 0x6f9bff, transparent: true, opacity: 0.12, side: THREE.BackSide, depthWrite: false }),
    );
    this.scene.add(atmo);

    // Eigener Standort
    this.marker = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd59a }));
    geoToScene(home.lat, home.lon, 1.002, this.marker.position);
    this.scene.add(this.marker);
    // Ring um den ausgewählten Satelliten
    this.halo = new THREE.Mesh(new THREE.RingGeometry(0.022, 0.03, 32), new THREE.MeshBasicMaterial({ color: 0xffd59a, side: THREE.DoubleSide, transparent: true, depthTest: false }));
    this.halo.visible = false;
    this.scene.add(this.halo);

    // Je Gruppe eine Punktwolke, damit Gruppen einzeln ein- und ausgeblendet werden können
    for (const g of SAT_GROUPS) {
      const list = sats.filter((s) => s.group === g);
      const pos = new Float32Array(list.length * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color(GROUP_COLORS[g]) },
          uPixelRatio: { value: this.renderer.getPixelRatio() },
          uSize: { value: g === 'stations' ? 9 : g === 'other' ? 3 : 3.5 },
        },
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      this.scene.add(points);
      this.groups.set(g, { points, sats: list, pos });
      list.forEach((_, i) => this.all.push({ g, i }));
    }
    // Einmal alle Positionen berechnen, danach laufend in Häppchen
    this.propagate(Infinity);

    const start = geoToScene(home.lat, home.lon, 4.2);
    this.camera.position.copy(start);
    this.controls.target.set(0, 0, 0);

    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', this.onDown);
    el.addEventListener('pointerup', this.onUp);
    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(container);
    this.resize();
    this.renderer.setAnimationLoop(this.loop);
  }

  setVisible(g: SatGroup, on: boolean) {
    const grp = this.groups.get(g);
    if (grp) grp.points.visible = on;
    if (!on && this.selected?.group === g) this.select(null);
  }

  /** Berechnet Positionen, bis das Zeitbudget (ms) verbraucht ist */
  private propagate(budgetMs: number) {
    const now = new Date();
    const gmst = sgp.gstime(now);
    const t0 = performance.now();
    const total = this.all.length;
    let done = 0;
    const touched = new Set<SatGroup>();
    while (done < total && performance.now() - t0 < budgetMs) {
      const { g, i } = this.all[this.cursor];
      this.cursor = (this.cursor + 1) % total;
      done++;
      const grp = this.groups.get(g)!;
      const pv = sgp.propagate(grp.sats[i].rec, now);
      const p = pv?.position;
      if (!p || typeof p === 'boolean') continue;
      const e = sgp.eciToEcf(p, gmst);
      grp.pos[i * 3] = e.x / R_KM;
      grp.pos[i * 3 + 1] = e.z / R_KM;
      grp.pos[i * 3 + 2] = -e.y / R_KM;
      touched.add(g);
    }
    for (const g of touched) this.groups.get(g)!.points.geometry.attributes.position.needsUpdate = true;
  }

  private updateSun() {
    // Bildpunkt der Sonne: Rektaszension minus Sternzeit von Greenwich
    const now = new Date();
    const eq = A.Equator(A.Body.Sun, now, new A.Observer(0, 0, 0), true, false);
    const lon = ((((eq.ra - A.SiderealTime(now)) * 15 + 540) % 360) - 180);
    geoToScene(eq.dec, lon, 10, this.sun.position);
  }

  private info(group: SatGroup, index: number): SatPick | null {
    const s = this.groups.get(group)!.sats[index];
    const now = new Date();
    const pv = sgp.propagate(s.rec, now);
    if (!pv?.position || typeof pv.position === 'boolean' || !pv.velocity || typeof pv.velocity === 'boolean') return null;
    const geo = sgp.eciToGeodetic(pv.position, sgp.gstime(now));
    const v = pv.velocity;
    return {
      sat: s,
      altKm: geo.height,
      speedKms: Math.hypot(v.x, v.y, v.z),
      lat: sgp.degreesLat(geo.latitude),
      lon: sgp.degreesLong(geo.longitude),
    };
  }

  select(sel: { group: SatGroup; index: number } | null) {
    this.selected = sel;
    this.onPick(sel ? this.info(sel.group, sel.index) : null);
  }

  private onDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY };
  };

  private onUp = (e: PointerEvent) => {
    if (!this.down || Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 6) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    // Fangradius wächst mit dem Abstand der Kamera
    this.raycaster.params.Points = { threshold: 0.012 * this.camera.position.length() };
    const visible = [...this.groups.values()].filter((g) => g.points.visible).map((g) => g.points);
    const earthHit = this.raycaster.intersectObject(this.earth)[0]?.distance ?? Infinity;
    const hit = this.raycaster.intersectObjects(visible).find((h) => h.distance < earthHit);
    if (!hit || hit.index == null) return this.select(null);
    const group = [...this.groups.entries()].find(([, g]) => g.points === hit.object)![0];
    this.select({ group, index: hit.index });
  };

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    // Rund 6 ms pro Bild für die Bahnrechnung; alle Satelliten sind so etwa jede halbe Sekunde dran
    this.propagate(6);
    const now = performance.now();
    if (now - this.lastSun > 10_000) {
      this.updateSun();
      this.lastSun = now;
      if (this.selected) this.onPick(this.info(this.selected.group, this.selected.index));
    }
    this.controls.update();
    const p = this.selectedPosition();
    this.halo.visible = !!p;
    if (p) {
      this.halo.position.copy(p);
      this.halo.quaternion.copy(this.camera.quaternion);
      this.halo.scale.setScalar(Math.max(0.6, this.camera.position.distanceTo(p) / 3));
    }
    this.renderer.render(this.scene, this.camera);
  };

  /** Ausgewählten Satelliten hervorheben (Position aus der Punktwolke) */
  selectedPosition(out = new THREE.Vector3()) {
    if (!this.selected) return null;
    const g = this.groups.get(this.selected.group)!;
    const i = this.selected.index;
    return out.set(g.pos[i * 3], g.pos[i * 3 + 1], g.pos[i * 3 + 2]);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.resizeObs.disconnect();
    this.controls.dispose();
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onDown);
    el.removeEventListener('pointerup', this.onUp);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.renderer.dispose();
    el.remove();
  }
}
