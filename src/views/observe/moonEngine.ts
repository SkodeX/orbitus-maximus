// 3D-Mond für den Mondatlas: echte LRO-Karte, beleuchtet aus der aktuellen Richtung der Sonne,
// von der Erde aus gesehen (mit Libration). Beschriftungen sind HTML-Elemente über dem Bild.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { selVec, type MoonGeometry } from '../../lib/observe/moonGeometry';
import type { MoonFeature } from '../../lib/observe/moonFeatures';

const MOON_KM = 3474.8;

export interface LabelFilter {
  types: Set<string>;
}

export class MoonEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  private controls: OrbitControls;
  private sun = new THREE.DirectionalLight(0xffffff, 3);
  private moon: THREE.Mesh;
  private resizeObs: ResizeObserver;
  private labels = new Map<string, { el: HTMLButtonElement; f: MoonFeature; p: THREE.Vector3 }>();
  private tmp = new THREE.Vector3();
  private dirty = true;
  selected: string | null = null;
  filter = new Set<string>(['mare', 'crater', 'mons', 'vallis', 'rima', 'landing', 'other']);
  flipped = false;

  constructor(
    private container: HTMLElement,
    labelLayer: HTMLElement,
    features: MoonFeature[],
    nameOf: (f: MoonFeature) => string,
    private onPick: (id: string) => void,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'moon-canvas';
    container.prepend(this.renderer.domElement);

    const tex = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/moon.jpg`, () => this.invalidate());
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    this.moon = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0 }));
    this.scene.add(this.moon);
    // Schwaches Erdlicht auf der Nachtseite
    this.scene.add(new THREE.AmbientLight(0x8ea4ff, 0.08));
    this.scene.add(this.sun);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.15;
    this.controls.maxDistance = 12;
    this.controls.rotateSpeed = 0.5;
    this.controls.addEventListener('change', () => this.invalidate());

    for (const f of features) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `moon-label moon-label--${f.type}`;
      el.textContent = nameOf(f);
      el.addEventListener('click', () => this.onPick(f.id));
      labelLayer.appendChild(el);
      const v = selVec(f.lat, f.lon);
      this.labels.set(f.id, { el, f, p: new THREE.Vector3(v[0], v[1], v[2]).multiplyScalar(1.002) });
    }

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(container);
    this.resize();
    this.renderer.setAnimationLoop(this.loop);
  }

  /** Beleuchtung und Blickrichtung für einen Zeitpunkt; mit `resetView` springt die Kamera zur Erdansicht */
  setGeometry(g: MoonGeometry, resetView: boolean) {
    const s = selVec(g.sun.lat, g.sun.lon);
    this.sun.position.set(s[0], s[1], s[2]).multiplyScalar(10);
    if (resetView) {
      const e = selVec(g.earth.lat, g.earth.lon);
      // Abstand so wählen, dass der ganze Mond mit etwas Rand ins Bild passt (auch im Hochformat)
      const vHalf = (this.camera.fov * Math.PI) / 360;
      const hHalf = Math.atan(Math.tan(vHalf) * this.camera.aspect);
      const dist = 1 / Math.sin(Math.min(vHalf, hHalf) * 0.82);
      this.camera.position.set(e[0], e[1], e[2]).multiplyScalar(dist);
      this.camera.up.set(0, this.flipped ? -1 : 1, 0);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
    }
    this.invalidate();
  }

  setFlipped(on: boolean) {
    this.flipped = on;
    this.camera.up.set(0, on ? -1 : 1, 0);
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
    this.invalidate();
  }

  /** Kamera auf ein Objekt drehen */
  focus(id: string) {
    const l = this.labels.get(id);
    if (!l) return;
    const dist = Math.max(1.6, Math.min(3.6, 1.2 + ((l.f.diameter ?? 100) / MOON_KM) * 6));
    this.camera.position.copy(l.p).normalize().multiplyScalar(dist);
    this.controls.update();
    this.select(id);
  }

  select(id: string | null) {
    this.selected = id;
    this.invalidate();
  }

  invalidate() {
    this.dirty = true;
  }

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.invalidate();
  }

  private updateLabels() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const camDir = this.tmp.copy(this.camera.position).normalize();
    const camDist = this.camera.position.length();
    // Scheinbarer Monddurchmesser in Pixeln (für die Auswahl, welche Namen Platz haben)
    const fovPx = h / (2 * Math.tan((this.camera.fov * Math.PI) / 360));
    const moonPx = (2 * fovPx) / Math.sqrt(camDist * camDist - 1);
    const placed: { x: number; y: number; w: number }[] = [];
    const sorted = [...this.labels.values()].sort((a, b) => (b.f.id === this.selected ? 1 : 0) - (a.f.id === this.selected ? 1 : 0) || (b.f.diameter ?? 0) - (a.f.diameter ?? 0));
    for (const { el, f, p } of sorted) {
      const facing = p.x * camDir.x + p.y * camDir.y + p.z * camDir.z;
      const sizePx = ((f.diameter ?? 30) / MOON_KM) * moonPx;
      const big = f.type === 'mare' || f.type === 'landing' ? sizePx > 14 || moonPx > 900 : sizePx > 30;
      let show = this.filter.has(f.type) && facing > 0.12 && (big || f.id === this.selected);
      let x = 0;
      let y = 0;
      if (show) {
        const v = p.clone().project(this.camera);
        x = ((v.x + 1) / 2) * w;
        y = ((1 - v.y) / 2) * h;
        const lw = el.textContent!.length * 6.5 + 10;
        // Überlappende Beschriftungen weglassen (das ausgewählte Objekt hat Vorrang)
        if (f.id !== this.selected && placed.some((q) => Math.abs(q.x - x) < (q.w + lw) / 2 && Math.abs(q.y - y) < 16)) show = false;
        else placed.push({ x, y, w: lw });
      }
      el.hidden = !show;
      if (show) {
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        el.classList.toggle('is-selected', f.id === this.selected);
      }
    }
  }

  private loop = () => {
    const moving = this.controls.update();
    if (!this.dirty && !moving) return;
    this.dirty = false;
    this.renderer.render(this.scene, this.camera);
    this.updateLabels();
  };

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.resizeObs.disconnect();
    this.controls.dispose();
    this.labels.forEach(({ el }) => el.remove());
    this.moon.geometry.dispose();
    (this.moon.material as THREE.MeshStandardMaterial).map?.dispose();
    (this.moon.material as THREE.Material).dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
