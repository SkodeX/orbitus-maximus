import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { loadNeighbors, type Neighbor } from '../../lib/catalogs';
import { fmtNum } from '../../lib/format';
import { Sheet } from '../../components/Sheet';

const DEG = Math.PI / 180;
const LY_PC = 3.2616;

/** Rektaszension/Deklination und Entfernung → Szene (y zum Himmelsnordpol) */
function toScene(ra: number, dec: number, d: number) {
  const c = Math.cos(dec * DEG);
  return new THREE.Vector3(d * c * Math.cos(ra * DEG), d * Math.sin(dec * DEG), -d * c * Math.sin(ra * DEG));
}

const absMag = (s: Neighbor) => (s.vmag == null ? null : s.vmag - 5 * Math.log10(s.distLy / LY_PC / 10));
function bvColor(bv: number | null) {
  const t = Math.max(0, Math.min(1, ((bv ?? 0.6) + 0.3) / 2.2));
  return new THREE.Color().setRGB(0.7 + 0.3 * t, 0.78 + 0.12 * (1 - Math.abs(t - 0.35)), 1 - 0.55 * t);
}

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uPixelRatio;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * clamp(60.0 / -mv.z, 0.5, 3.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.05, d));
  }
`;

/** Unsere Nachbarschaft: alle Sterne bis 50 Lichtjahre in 3D */
export default function NeighborsView() {
  const { t, lang } = useI18n();
  const host = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Neighbor[] | null>(null);
  const [pick, setPick] = useState<Neighbor | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadNeighbors().then(setStars, () => setError(true));
  }, []);

  useEffect(() => {
    if (!stars || !host.current) return;
    const el = host.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = 'nb-canvas';
    el.appendChild(renderer.domElement);
    const labels = new CSS2DRenderer();
    labels.domElement.className = 'nb-labels';
    el.appendChild(labels.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 38, 70);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 180;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.addEventListener('start', () => (controls.autoRotate = false));

    // Entfernungsringe in der Ebene des Himmelsäquators
    for (const r of [10, 25, 50]) {
      const pts = Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a));
      });
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x8aa4ff, transparent: true, opacity: 0.18 })));
      const div = document.createElement('span');
      div.className = 'nb-ring';
      div.textContent = `${r} ${t('nb.ly')}`;
      const lbl = new CSS2DObject(div);
      lbl.position.set(r, 0, 0);
      scene.add(lbl);
    }

    // Sonne
    const sunDiv = document.createElement('span');
    sunDiv.className = 'nb-label nb-label--sun';
    sunDiv.textContent = t('nb.sun');
    const sun = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd36b }));
    const sunLbl = new CSS2DObject(sunDiv);
    sunLbl.center.set(0, 1.4);
    sun.add(sunLbl);
    scene.add(sun);

    // Sterne
    const pos: number[] = [];
    const col: number[] = [];
    const size: number[] = [];
    const drops: THREE.Vector3[] = [];
    stars.forEach((s) => {
      const v = toScene(s.ra, s.dec, s.distLy);
      pos.push(v.x, v.y, v.z);
      const c = bvColor(s.bv);
      col.push(c.r, c.g, c.b);
      const M = absMag(s) ?? 10;
      size.push(Math.max(2.2, Math.min(14, 9 - M * 0.55)));
      const named = !/^(HIP|GJ|Gliese) /.test(s.name);
      // Beschriftung für helle oder sehr nahe Sterne
      if (named && (s.distLy < 13 || M < 2.5 || (s.vmag ?? 9) < 2.2)) {
        const div = document.createElement('button');
        div.className = 'nb-label';
        div.textContent = s.name;
        div.addEventListener('pointerdown', (e) => e.stopPropagation());
        div.addEventListener('click', () => setPick(s));
        const lbl = new CSS2DObject(div);
        lbl.position.copy(v);
        lbl.center.set(-0.1, 0.5);
        scene.add(lbl);
        drops.push(v, new THREE.Vector3(v.x, 0, v.z));
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1));
    const points = new THREE.Points(
      geo,
      new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, depthWrite: false, uniforms: { uPixelRatio: { value: renderer.getPixelRatio() } } }),
    );
    scene.add(points);
    // Lote zur Äquatorebene: so sieht man, wie weit „über“ oder „unter“ uns ein Stern liegt
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(drops), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })));

    // Antippen eines Sterns
    const ray = new THREE.Raycaster();
    let down: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
      const r = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      ray.params.Points = { threshold: camera.position.length() * 0.015 };
      const hit = ray.intersectObject(points)[0];
      if (hit?.index != null) setPick(stars[hit.index]);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      labels.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const obs = new ResizeObserver(resize);
    obs.observe(el);
    resize();
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
      labels.render(scene, camera);
    });
    return () => {
      renderer.setAnimationLoop(null);
      obs.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        (m.material as THREE.Material | undefined)?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
      labels.domElement.remove();
    };
  }, [stars, t]);

  const M = pick ? absMag(pick) : null;
  const lum = M != null ? Math.pow(10, -0.4 * (M - 4.83)) : null;

  return (
    <div className="solar nb">
      <div ref={host} className="solar-stage" />
      <div className="sky-top solar-top">
        <a className="sky-chip" href="#/system">
          <ArrowLeft size={15} /> <span>{t('nav.solar')}</span>
        </a>
      </div>
      <div className="nb-intro">
        <h1>{t('nb.title')}</h1>
        <p className="muted small">{stars ? t('nb.lead', { n: stars.length }) : error ? t('live.error') : t('live.loading')}</p>
      </div>
      {pick && (
        <Sheet title={pick.name} onClose={() => setPick(null)} closeLabel={t('common.close')}>
          <div className="info">
            <p className="info-type">
              {pick.sp ? `${t('nb.type')} ${pick.sp}` : t('type.star')}
            </p>
            <dl className="detail-grid">
              <dt>{t('nb.distance')}</dt>
              <dd>
                {fmtNum(pick.distLy, lang, 1)} {t('nb.ly')}
              </dd>
              <dt>{t('nb.lightTravel')}</dt>
              <dd>{t('nb.years', { n: fmtNum(pick.distLy, lang, 1) })}</dd>
              {pick.vmag != null && (
                <>
                  <dt>{t('nb.apparent')}</dt>
                  <dd>{fmtNum(pick.vmag, lang, 1)} mag</dd>
                </>
              )}
              {lum != null && (
                <>
                  <dt>{t('nb.luminosity')}</dt>
                  <dd>{lum >= 10 ? fmtNum(lum, lang, 0) : lum >= 0.1 ? fmtNum(lum, lang, 2) : fmtNum(lum, lang, 4)} × ☉</dd>
                </>
              )}
            </dl>
            <p className="muted small">{pick.vmag != null && pick.vmag < 6 ? t('nb.nakedEye') : t('nb.tooFaint')}</p>
            <a className="link" href={`#/sky?focus=coord:${pick.ra},${pick.dec},${encodeURIComponent(pick.name)}`}>
              {t('common.showInSky')} <ArrowRight size={15} />
            </a>
          </div>
        </Sheet>
      )}
    </div>
  );
}
