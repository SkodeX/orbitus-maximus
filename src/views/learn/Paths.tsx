import { ArrowLeft, ArrowRight, Binoculars, Check, Globe, Moon, Sparkles, Telescope, Trees, Smartphone } from 'lucide-react';
import { useI18n } from '../../i18n';
import { PATHS, type LearningPath, type PathStep } from '../../learn/paths';
import { updateProgress, useProgress } from '../../learn/progress';

const ICONS = { moon: Moon, telescope: Telescope, binoculars: Binoculars, globe: Globe, sparkles: Sparkles };

/** Ein Schritt gilt als geschafft, wenn alle Aufgaben erledigt sind oder er von Hand abgeschlossen wurde */
const stepDone = (p: LearningPath, s: PathStep, done: Set<string>) =>
  done.has(`${p.id}:${s.id}:done`) || s.tasks.every((t) => done.has(`${p.id}:${t.id}`));

function toggle(key: string) {
  updateProgress((p) => ({
    ...p,
    pathTasks: p.pathTasks.includes(key) ? p.pathTasks.filter((x) => x !== key) : [...p.pathTasks, key],
    tools: p.tools.includes('paths') ? p.tools : [...p.tools, 'paths'],
  }));
}

export function Paths({ id }: { id: string | null }) {
  const path = PATHS.find((p) => p.id === id);
  return path ? <PathDetail path={path} /> : <PathList />;
}

function PathList() {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const done = new Set(progress.pathTasks);
  return (
    <div className="page learn">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('paths.title')}</h1>
        <p className="lead muted">{t('paths.lead')}</p>
      </header>
      <div className="path-grid">
        {PATHS.map((p) => {
          const Icon = ICONS[p.icon];
          const n = p.steps.filter((s) => stepDone(p, s, done)).length;
          return (
            <a key={p.id} className="card path-card" href={`#/wissen/pfade/${p.id}`}>
              <span className="tool-icon">
                <Icon size={22} />
              </span>
              <span>
                <span className="muted small">
                  {t('paths.level', { n: p.level })} · {t('paths.steps', { n: p.steps.length })}
                </span>
                <strong>{p[lang].title}</strong>
                <span className="muted small">{p[lang].text}</span>
                <span className="list-progress">
                  <span style={{ width: `${(n / p.steps.length) * 100}%` }} />
                </span>
                <span className="muted small">{n === p.steps.length ? t('paths.finished') : t('paths.progress', { n, total: p.steps.length })}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function PathDetail({ path }: { path: LearningPath }) {
  const { t, lang } = useI18n();
  const progress = useProgress();
  const done = new Set(progress.pathTasks);
  const firstOpen = path.steps.findIndex((s) => !stepDone(path, s, done));
  const n = path.steps.filter((s) => stepDone(path, s, done)).length;
  return (
    <div className="page learn path-page">
      <header className="page-head">
        <a className="back-link" href="#/wissen/pfade">
          <ArrowLeft size={16} /> {t('paths.title')}
        </a>
        <h1>{path[lang].title}</h1>
        <p className="lead muted">{path[lang].text}</p>
        <span className="list-progress list-progress--big">
          <span style={{ width: `${(n / path.steps.length) * 100}%` }} />
        </span>
        <p className="muted small">{n === path.steps.length ? t('paths.finished') : t('paths.progress', { n, total: path.steps.length })}</p>
      </header>
      <ol className="path-steps">
        {path.steps.map((s, i) => {
          const complete = stepDone(path, s, done);
          return (
            <li key={s.id} className={`card path-step ${complete ? 'is-done' : ''} ${i === firstOpen ? 'is-current' : ''}`}>
              <div className="path-step-head">
                <span className="path-num">{complete ? <Check size={16} /> : i + 1}</span>
                <h3>{s[lang].title}</h3>
              </div>
              <p className="muted">{s[lang].text}</p>
              <ul className="path-tasks">
                {s.tasks.map((task) => {
                  const key = `${path.id}:${task.id}`;
                  const on = done.has(key);
                  return (
                    <li key={task.id}>
                      <button className={`list-check ${on ? 'is-on' : ''}`} onClick={() => toggle(key)} aria-pressed={on} aria-label={task[lang]}>
                        <Check size={15} />
                      </button>
                      <span className="path-task-text">
                        {task.outdoor ? <Trees size={14} className="inline-icon path-where" /> : <Smartphone size={14} className="inline-icon path-where" />} {task[lang]}
                        {task.link && (
                          <a className="link small" href={task.link}>
                            {t('paths.open')} <ArrowRight size={13} />
                          </a>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {!complete && (
                <button className="btn btn-ghost btn-sm path-finish" onClick={() => toggle(`${path.id}:${s.id}:done`)}>
                  <Check size={15} /> {t('paths.finishStep')}
                </button>
              )}
              {done.has(`${path.id}:${s.id}:done`) && (
                <button className="link small path-finish" onClick={() => toggle(`${path.id}:${s.id}:done`)}>
                  {t('paths.reopen')}
                </button>
              )}
            </li>
          );
        })}
      </ol>
      <p className="note">{t('paths.note')}</p>
    </div>
  );
}
