import { useState, type ReactElement } from 'react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useSettings } from '../../state/settings';
import { metersPer1000ToDeg, newId, opticsStats, type Eyepiece, type Instrument, type Optics } from '../../lib/observe/optics';
import { fmtNum } from '../../lib/format';
import { ToolHead } from './ObserveView';

/** Beispielziele mit ihrer scheinbaren Größe (Grad) für die Vorschau */
const TARGETS = [
  { id: 'moon', w: 0.52, h: 0.52 },
  { id: 'jupiter', w: 45 / 3600, h: 42 / 3600 },
  { id: 'saturn', w: 42 / 3600, h: 17 / 3600 },
  { id: 'm42', w: 85 / 60, h: 60 / 60 },
  { id: 'm31', w: 3.1, h: 1.0 },
  { id: 'm45', w: 1.8, h: 1.8 },
] as const;
type TargetId = (typeof TARGETS)[number]['id'];

// Die hellsten Plejadensterne relativ zur Mitte (Grad, Ost nach links)
const PLEIADES: [number, number, number][] = [
  [0, 0, 2.9],
  [-0.62, 0.05, 3.6],
  [0.42, 0.28, 3.7],
  [-0.67, -0.12, 3.9],
  [0.55, 0.42, 4.3],
  [0.3, 0.12, 4.2],
  [0.6, 0.55, 5.1],
  [0.18, -0.35, 5.4],
];

function Preview({ fovDeg, target }: { fovDeg: number; target: TargetId }) {
  const S = 120; // Radius des Gesichtsfelds in SVG-Einheiten
  const k = (2 * S) / fovDeg; // Einheiten pro Grad
  const tg = TARGETS.find((x) => x.id === target)!;
  const w = (tg.w * k) / 2;
  const h = (tg.h * k) / 2;
  let body: ReactElement;
  switch (target) {
    case 'moon':
      body = (
        <g>
          <circle r={w} fill="url(#moonGrad)" />
          <circle cx={-w * 0.3} cy={-w * 0.25} r={w * 0.22} fill="rgba(90,90,100,0.35)" />
          <circle cx={w * 0.2} cy={w * 0.1} r={w * 0.18} fill="rgba(90,90,100,0.3)" />
          <circle cx={w * 0.05} cy={w * 0.55} r={w * 0.06} fill="rgba(255,255,255,0.4)" />
        </g>
      );
      break;
    case 'jupiter':
      body = (
        <g>
          <ellipse rx={Math.max(w, 0.8)} ry={Math.max(h, 0.75)} fill="#e8d2b0" />
          {w > 6 && <rect x={-w} y={-h * 0.35} width={2 * w} height={h * 0.18} fill="#b08860" />}
          {w > 6 && <rect x={-w} y={h * 0.15} width={2 * w} height={h * 0.16} fill="#b08860" />}
          {/* Galileische Monde in typischen Abständen */}
          {[-5.9, -9.4, 15, -26.4].map((d, i) => (
            <circle key={i} cx={d * w} cy={0} r={Math.max(0.6, w * 0.06)} fill="#fff" />
          ))}
        </g>
      );
      break;
    case 'saturn':
      body = (
        <g>
          <ellipse rx={Math.max(w, 1.2)} ry={Math.max(h, 0.5)} fill="none" stroke="#d9c48f" strokeWidth={Math.max(0.6, w * 0.12)} />
          <ellipse rx={Math.max(w * 0.42, 0.6)} ry={Math.max(w * 0.38, 0.55)} fill="#e6d3a2" />
          <circle cx={w * 3.4} cy={-h * 0.5} r={Math.max(0.6, w * 0.04)} fill="#fff" />
        </g>
      );
      break;
    case 'm42':
      body = (
        <g>
          <ellipse rx={w} ry={h} fill="url(#nebGrad)" />
          {[
            [-0.05, 0],
            [0.03, 0.02],
            [0, -0.04],
            [0.04, -0.02],
          ].map(([x, y], i) => (
            <circle key={i} cx={x * k} cy={y * k} r={1.2} fill="#fff" />
          ))}
        </g>
      );
      break;
    case 'm31':
      body = (
        <g transform="rotate(-38)">
          <ellipse rx={w} ry={h} fill="url(#galGrad)" />
          <ellipse rx={w * 0.12} ry={h * 0.2} fill="rgba(255,240,220,0.9)" />
        </g>
      );
      break;
    case 'm45':
      body = (
        <g>
          {PLEIADES.map(([x, y, m], i) => (
            <circle key={i} cx={-x * k} cy={-y * k} r={Math.max(0.8, 4.2 - m * 0.6)} fill="#cfe0ff" />
          ))}
        </g>
      );
      break;
  }
  return (
    <svg className="ep-preview" viewBox={`${-S - 4} ${-S - 4} ${2 * S + 8} ${2 * S + 8}`} role="img">
      <defs>
        <radialGradient id="moonGrad">
          <stop offset="0" stopColor="#f2f0e8" />
          <stop offset="1" stopColor="#b9b6ad" />
        </radialGradient>
        <radialGradient id="nebGrad">
          <stop offset="0" stopColor="rgba(160,220,200,0.85)" />
          <stop offset="1" stopColor="rgba(120,160,220,0)" />
        </radialGradient>
        <radialGradient id="galGrad">
          <stop offset="0" stopColor="rgba(255,236,210,0.7)" />
          <stop offset="1" stopColor="rgba(200,200,240,0)" />
        </radialGradient>
        <clipPath id="fovClip">
          <circle r={S} />
        </clipPath>
      </defs>
      <circle r={S} fill="#03040b" />
      <g clipPath="url(#fovClip)">{body}</g>
      <circle r={S} fill="none" stroke="rgba(255,255,255,0.25)" />
    </svg>
  );
}

export function EyepiecePage() {
  const { t, lang } = useI18n();
  const { settings, update } = useSettings();
  const optics = settings.optics;
  const set = (patch: Partial<Optics>) => update({ optics: { ...optics, ...patch } });
  const [target, setTarget] = useState<TargetId>('moon');
  const [adding, setAdding] = useState<null | 'telescope' | 'binoculars' | 'eyepiece'>(null);

  const inst = optics.instruments.find((i) => i.id === optics.active?.instrument) ?? optics.instruments[0] ?? null;
  const ep = inst?.kind === 'telescope' ? (optics.eyepieces.find((e) => e.id === optics.active?.eyepiece) ?? optics.eyepieces[0] ?? null) : null;
  const stats = inst ? opticsStats(inst, ep) : null;
  const choose = (instrument: string, eyepiece: string | null) => set({ active: { instrument, eyepiece } });

  const n = (v: number, d = 1) => fmtNum(v, lang, d);

  return (
    <div className="page observe">
      <ToolHead eyebrow={t('observe.tool.eyepiece')} title={t('ep.title')} lead={t('ep.lead')} />

      <section className="card ep-card">
        <p className="card-kicker">{t('ep.instruments')}</p>
        <div className="ep-choices">
          {optics.instruments.map((i) => (
            <button key={i.id} className={`chip ${inst?.id === i.id ? 'is-on' : ''}`} onClick={() => choose(i.id, ep?.id ?? optics.eyepieces[0]?.id ?? null)}>
              {i.name}
            </button>
          ))}
          <button className="chip" onClick={() => setAdding('telescope')}>
            <Plus size={13} /> {t('ep.addTelescope')}
          </button>
          <button className="chip" onClick={() => setAdding('binoculars')}>
            <Plus size={13} /> {t('ep.addBinoculars')}
          </button>
        </div>

        {inst?.kind === 'telescope' && (
          <>
            <p className="card-kicker ep-sub">{t('ep.eyepieces')}</p>
            <div className="ep-choices">
              {optics.eyepieces.map((e) => (
                <button key={e.id} className={`chip ${ep?.id === e.id ? 'is-on' : ''}`} onClick={() => choose(inst.id, e.id)}>
                  {e.focal} mm · {e.afov}°
                </button>
              ))}
              <button className="chip" onClick={() => setAdding('eyepiece')}>
                <Plus size={13} /> {t('ep.addEyepiece')}
              </button>
            </div>
          </>
        )}

        {adding && (
          <AddForm
            kind={adding}
            onCancel={() => setAdding(null)}
            onAdd={(item) => {
              if ('afov' in item) set({ eyepieces: [...optics.eyepieces, item], active: { instrument: inst?.id ?? '', eyepiece: item.id } });
              else set({ instruments: [...optics.instruments, item], active: { instrument: item.id, eyepiece: ep?.id ?? optics.eyepieces[0]?.id ?? null } });
              setAdding(null);
            }}
          />
        )}

        {inst && (
          <button
            className="link ep-remove"
            onClick={() => {
              const rest = optics.instruments.filter((i) => i.id !== inst.id);
              set({ instruments: rest, active: rest[0] ? { instrument: rest[0].id, eyepiece: optics.eyepieces[0]?.id ?? null } : null });
            }}
          >
            <Trash2 size={14} /> {t('ep.remove', { name: inst.name })}
          </button>
        )}
        {ep && (
          <button className="link ep-remove" onClick={() => set({ eyepieces: optics.eyepieces.filter((e) => e.id !== ep.id) })}>
            <Trash2 size={14} /> {t('ep.remove', { name: `${ep.focal} mm` })}
          </button>
        )}
      </section>

      {stats && inst && (
        <div className="ep-layout">
          <section className="card">
            <p className="card-kicker">{t('ep.results')}</p>
            <div className="ep-big">
              <div>
                <strong>{n(stats.magnification, 0)}×</strong>
                <span className="muted small">{t('ep.magnification')}</span>
              </div>
              <div>
                <strong>{stats.trueFov >= 1 ? `${n(stats.trueFov, 1)}°` : `${n(stats.trueFov * 60, 0)}′`}</strong>
                <span className="muted small">{t('ep.trueFov')}</span>
              </div>
              <div>
                <strong>{n(stats.exitPupil, 1)} mm</strong>
                <span className="muted small">{t('ep.exitPupil')}</span>
              </div>
            </div>
            {stats.magnification > stats.maxUseful && <p className="ep-warn">{t('ep.tooMuch', { max: n(stats.maxUseful, 0) })}</p>}
            {stats.exitPupil > 7.2 && <p className="ep-warn">{t('ep.pupilBig')}</p>}
            <dl className="detail-grid">
              <dt>{t('ep.maxUseful')}</dt>
              <dd>{n(stats.maxUseful, 0)}×</dd>
              <dt>{t('ep.minUseful')}</dt>
              <dd>{n(stats.minUseful, 0)}×</dd>
              <dt>{t('ep.limitingMag')}</dt>
              <dd>{n(stats.limitingMag, 1)} mag</dd>
              <dt>{t('ep.resolution')}</dt>
              <dd>{n(stats.resolution, 1)}″</dd>
              <dt>{t('ep.lightGain')}</dt>
              <dd>{n(stats.lightGain, 0)}×</dd>
              {stats.focalRatio && (
                <>
                  <dt>{t('ep.focalRatio')}</dt>
                  <dd>f/{n(stats.focalRatio, 1)}</dd>
                </>
              )}
            </dl>
            <details className="details">
              <summary>{t('ep.howTitle')}</summary>
              <p>{t('ep.howText')}</p>
            </details>
          </section>

          <section className="card">
            <p className="card-kicker">{t('ep.preview')}</p>
            <div className="segmented ep-targets" role="radiogroup">
              {TARGETS.map((x) => (
                <button key={x.id} role="radio" aria-checked={target === x.id} className={target === x.id ? 'is-on' : ''} onClick={() => setTarget(x.id)}>
                  {t(`ep.target.${x.id}`)}
                </button>
              ))}
            </div>
            <Preview fovDeg={stats.trueFov} target={target} />
            <p className="muted small">{t('ep.previewNote')}</p>
            <label className="toggle">
              <span>{t('ep.showInSky')}</span>
              <input
                type="checkbox"
                checked={optics.showFov}
                onChange={(e) => set({ showFov: e.target.checked, active: { instrument: inst.id, eyepiece: ep?.id ?? null } })}
              />
              <span className="switch" aria-hidden="true" />
            </label>
            <a className="link" href="#/sky">
              {t('ep.toSky')} <ArrowRight size={15} />
            </a>
          </section>
        </div>
      )}

      {inst?.kind === 'telescope' && optics.eyepieces.length > 1 && (
        <section className="card ep-table-card">
          <p className="card-kicker">{t('ep.allEyepieces', { name: inst.name })}</p>
          <table className="ep-table">
            <thead>
              <tr>
                <th>{t('ep.eyepiece')}</th>
                <th>{t('ep.magnification')}</th>
                <th>{t('ep.trueFov')}</th>
                <th>{t('ep.exitPupil')}</th>
              </tr>
            </thead>
            <tbody>
              {[...optics.eyepieces]
                .sort((a, b) => b.focal - a.focal)
                .map((e) => {
                  const s = opticsStats(inst, e)!;
                  return (
                    <tr key={e.id} className={s.magnification > s.maxUseful ? 'is-bad' : ''}>
                      <td>{e.focal} mm</td>
                      <td>{n(s.magnification, 0)}×</td>
                      <td>{s.trueFov >= 1 ? `${n(s.trueFov, 1)}°` : `${n(s.trueFov * 60, 0)}′`}</td>
                      <td>{n(s.exitPupil, 1)} mm</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function AddForm({ kind, onAdd, onCancel }: { kind: 'telescope' | 'binoculars' | 'eyepiece'; onAdd: (x: Instrument | Eyepiece) => void; onCancel: () => void }) {
  const { t } = useI18n();
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const num = (s: string) => Number(s.replace(',', '.'));
  const submit = () => {
    if (kind === 'telescope') {
      const aperture = num(a);
      const focal = num(b);
      if (!(aperture > 0 && focal > 0)) return;
      onAdd({ id: newId('scope'), kind: 'telescope', name: c.trim() || `${aperture}/${focal}`, aperture, focal });
    } else if (kind === 'binoculars') {
      const magnification = num(a);
      const aperture = num(b);
      const raw = num(c);
      if (!(magnification > 0 && aperture > 0)) return;
      // Angabe in Grad oder als „m auf 1000 m“
      const fov = raw > 20 ? metersPer1000ToDeg(raw) : raw > 0 ? raw : 65 / magnification;
      onAdd({ id: newId('bino'), kind: 'binoculars', name: `${magnification}×${aperture}`, magnification, aperture, fov });
    } else {
      const focal = num(a);
      const afov = num(b) || 52;
      if (!(focal > 0)) return;
      onAdd({ id: newId('ep'), focal, afov });
    }
  };
  const labels =
    kind === 'telescope'
      ? [t('ep.aperture'), t('ep.focal'), t('ep.name')]
      : kind === 'binoculars'
        ? [t('ep.magnification'), t('ep.aperture'), t('ep.binoFov')]
        : [t('ep.focal'), t('ep.afov')];
  const vals = [a, b, c];
  const sets = [setA, setB, setC];
  return (
    <form
      className="ep-form"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {labels.map((l, i) => (
        <label key={l} className="field">
          <span>{l}</span>
          <input type={i === 2 && kind === 'telescope' ? 'text' : 'text'} inputMode={i === 2 && kind === 'telescope' ? 'text' : 'decimal'} value={vals[i]} onChange={(e) => sets[i](e.target.value)} />
        </label>
      ))}
      <div className="btn-row">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          {t('ep.add')}
        </button>
      </div>
    </form>
  );
}
