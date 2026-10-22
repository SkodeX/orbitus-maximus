// Ergänzungen für das 3D-Sonnensystem: Bahnen und Positionen der Raumsonden sowie
// Asteroiden, Jupiter-Trojaner, erdnahe Objekte und der Kuipergürtel als Punktwolken.
// Alle Daten liegen heliozentrisch-ekliptikal (J2000) vor; Szene-Achsen: (x, z_ekl, −y_ekl).
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { loadProbes, probePosition, type Probe } from '../lib/live/probes';
import { julianDateTT, keplerPosition, loadSmallBodies, type SmallBody } from '../lib/catalogs';
import type { ScaleMode } from './engine';


const VERTEX = /* glsl */ `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uPixelRatio;
  uniform float uSize;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio;
    gl_Position = projectionMatrix * mv;
    #include <logdepthbuf_vertex>
  }
`;
const FRAGMENT = /* glsl */ `
  #include <logdepthbuf_pars_fragment>
  varying vec3 vColor;
  uniform float uOpacity;
  void main() {
    #include <logdepthbuf_fragment>
    float d = length(gl_PointCoord - vec2(0.5));
    gl_FragColor = vec4(vColor, uOpacity * smoothstep(0.5, 0.1, d));
  }
`;

// Farben je Bahnklasse
const CLASS_COLOR: Record<string, [number, number, number]> = {
  TJN: [0.55, 0.85, 0.6],
  TNO: [0.6, 0.75, 1],
  APO: [1, 0.6, 0.4],
  ATE: [1, 0.6, 0.4],
  AMO: [1, 0.6, 0.4],
};
const BELT_COLOR: [number, number, number] = [0.78, 0.72, 0.62];

type Scale = (au: THREE.Vector3, mode: ScaleMode, out?: THREE.Vector3) => THREE.Vector3;

interface ProbeNode {
  p: Probe;
  marker: THREE.Mesh;
  label: CSS2DObject;
  past: { overview: THREE.Line; distance: THREE.Line };
  au: THREE.Vector3;
  visible: boolean;
}

const ecl = (x: number, y: number, z: number, out = new THREE.Vector3()) => out.set(x, z, -y);

export class SolarExtras {
  private group = new THREE.Group();
  private probeNodes: ProbeNode[] = [];
  private bodies: SmallBody[] = [];
  private belt: THREE.Points | null = null;
  private beltAu: Float32Array | null = null;
  private lastBeltJd = 0;
  private lastBeltMode: ScaleMode | null = null;
  showProbes = true;
  showBelts = true;

  constructor(
    scene: THREE.Scene,
    private scale: Scale,
    private pixelRatio: number,
    private probeName: (p: Probe) => string,
    private onProbe: (id: string) => void,
  ) {
    scene.add(this.group);
    loadProbes().then((d) => this.buildProbes(d.probes), () => undefined);
    loadSmallBodies().then((b) => this.buildBelt(b), () => undefined);
  }

  private buildProbes(probes: Probe[]) {
    for (const p of probes) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < p.path.jd.length; i++) pts.push(ecl(p.path.xyz[i * 3], p.path.xyz[i * 3 + 1], p.path.xyz[i * 3 + 2]));
      const line = (mode: ScaleMode) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts.map((v) => this.scale(v, mode)));
        const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.45, depthWrite: false }));
        l.frustumCulled = false;
        this.group.add(l);
        return l;
      };
      const marker = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: p.color }));
      this.group.add(marker);
      const el = document.createElement('button');
      el.className = 'solar-label solar-label--probe';
      el.textContent = this.probeName(p);
      el.style.color = p.color;
      el.addEventListener('pointerdown', (e) => e.stopPropagation());
      el.addEventListener('click', () => this.onProbe(p.id));
      const label = new CSS2DObject(el);
      label.center.set(0, 1.2);
      marker.add(label);
      this.probeNodes.push({ p, marker, label, past: { overview: line('overview'), distance: line('distance') }, au: new THREE.Vector3(), visible: false });
    }
  }

  private buildBelt(bodies: SmallBody[]) {
    this.bodies = bodies;
    const n = bodies.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    bodies.forEach((b, i) => col.set(CLASS_COLOR[b.class] ?? BELT_COLOR, i * 3));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: { uPixelRatio: { value: this.pixelRatio }, uSize: { value: 1.8 }, uOpacity: { value: 0.5 } },
    });
    this.belt = new THREE.Points(geo, mat);
    this.belt.frustumCulled = false;
    this.beltAu = new Float32Array(n * 3);
    this.group.add(this.belt);
  }

  setNames(name: (p: Probe) => string) {
    this.probeName = name;
    for (const n of this.probeNodes) (n.label.element as HTMLElement).textContent = name(n.p);
  }

  /** Position einer Sonde in Szene-Koordinaten (für Kameraflüge) */
  probeScenePosition(id: string) {
    const n = this.probeNodes.find((x) => x.p.id === id);
    return n && n.visible ? n.marker.position.clone() : null;
  }

  probe(id: string) {
    return this.probeNodes.find((x) => x.p.id === id)?.p ?? null;
  }

  update(time: number, mode: ScaleMode, prevMode: ScaleMode, mix: number, camera: THREE.Camera) {
    const date = new Date(time);
    const sizeMode = mode === 'size';
    this.group.visible = !sizeMode || mix < 1;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();

    for (const n of this.probeNodes) {
      const v = probePosition(n.p, date);
      n.visible = !!v && this.showProbes && !sizeMode;
      n.marker.visible = n.visible;
      n.label.visible = n.visible;
      for (const m of ['overview', 'distance'] as const) {
        const w = (mode === m ? mix : 0) + (prevMode === m ? 1 - mix : 0);
        n.past[m].visible = this.showProbes && w > 0.01 && !sizeMode;
        (n.past[m].material as THREE.LineBasicMaterial).opacity = 0.45 * w;
      }
      if (!v) continue;
      ecl(v.x, v.y, v.z, n.au);
      const from = prevMode === 'size' ? mode : prevMode;
      const to = mode === 'size' ? prevMode : mode;
      this.scale(n.au, from, a);
      this.scale(n.au, to, b);
      n.marker.position.lerpVectors(a, b, mix);
      // Bildschirmgröße etwa konstant halten
      const d = camera.position.distanceTo(n.marker.position);
      n.marker.scale.setScalar(Math.max(1e-4, d * 0.006));
    }

    if (this.belt && this.beltAu) {
      this.belt.visible = this.showBelts && !sizeMode;
      const jd = julianDateTT(date);
      // Kleinkörper nur nachrechnen, wenn sich Zeit oder Maßstab merklich geändert haben
      if (this.belt.visible && (Math.abs(jd - this.lastBeltJd) > 0.5 || mode !== this.lastBeltMode || mix < 1)) {
        if (Math.abs(jd - this.lastBeltJd) > 0.5) {
          const v = new THREE.Vector3();
          this.bodies.forEach((body, i) => {
            const [x, y, z] = keplerPosition(body, jd);
            ecl(x, y, z, v);
            this.beltAu!.set([v.x, v.y, v.z], i * 3);
          });
          this.lastBeltJd = jd;
        }
        const pos = this.belt.geometry.attributes.position.array as Float32Array;
        const from = prevMode === 'size' ? mode : prevMode;
        const to = mode === 'size' ? prevMode : mode;
        const au = new THREE.Vector3();
        for (let i = 0; i < this.bodies.length; i++) {
          au.set(this.beltAu[i * 3], this.beltAu[i * 3 + 1], this.beltAu[i * 3 + 2]);
          this.scale(au, from, a);
          this.scale(au, to, b);
          a.lerp(b, mix);
          pos[i * 3] = a.x;
          pos[i * 3 + 1] = a.y;
          pos[i * 3 + 2] = a.z;
        }
        this.belt.geometry.attributes.position.needsUpdate = true;
        this.lastBeltMode = mode;
      }
    }
  }

  dispose() {
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      (m.material as THREE.Material | undefined)?.dispose?.();
    });
    for (const n of this.probeNodes) (n.label.element as HTMLElement).remove();
    this.group.removeFromParent();
  }
}

