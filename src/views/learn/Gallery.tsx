import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useI18n, type MsgKey } from '../../i18n';
import { GALLERY, type GalleryImage } from '../../learn/gallery';
import { navigate } from '../../lib/router';

const CATS = ['nebula', 'galaxy', 'cluster', 'star', 'planet', 'deep-field', 'other'] as const;

/** Bilder von Hubble, Webb & Co. – mit Erklärung und Weg zur Sternkarte */
export function Gallery({ id }: { id: string | null }) {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState<GalleryImage['category'] | null>(null);
  const list = GALLERY.filter((g) => !cat || g.category === cat);
  const open = GALLERY.find((g) => g.id === id) ?? null;

  return (
    <div className="page learn gallery">
      <header className="page-head">
        <a className="back-link" href="#/wissen">
          <ArrowLeft size={16} /> {t('learn.eyebrow')}
        </a>
        <h1>{t('gallery.title')}</h1>
        <p className="lead muted">{t('gallery.lead')}</p>
      </header>
      <div className="filter-chips">
        <button className={`chip ${cat === null ? 'is-on' : ''}`} onClick={() => setCat(null)}>
          {t('gallery.all', { n: GALLERY.length })}
        </button>
        {CATS.filter((c) => GALLERY.some((g) => g.category === c)).map((c) => (
          <button key={c} className={`chip ${cat === c ? 'is-on' : ''}`} onClick={() => setCat(cat === c ? null : c)}>
            {t(`gallery.cat.${c}` as MsgKey)}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {list.map((g) => (
          <a key={g.id} className="gallery-item" href={`#/wissen/galerie/${g.id}`}>
            <img src={g.thumb} alt={g[lang].title} loading="lazy" />
            <span>
              <strong>{g[lang].title}</strong>
              <small>
                {t(`gallery.tel.${g.telescope}` as MsgKey)} · {g.year}
              </small>
            </span>
          </a>
        ))}
      </div>
      {open && <Lightbox g={open} />}
      <p className="note">{t('gallery.source')}</p>
    </div>
  );
}

function Lightbox({ g }: { g: GalleryImage }) {
  const { t, lang } = useI18n();
  const i = GALLERY.indexOf(g);
  const prev = GALLERY[(i - 1 + GALLERY.length) % GALLERY.length];
  const next = GALLERY[(i + 1) % GALLERY.length];
  const close = () => navigate('/wissen/galerie');
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(`/wissen/galerie/${prev.id}`);
      if (e.key === 'ArrowRight') navigate(`/wissen/galerie/${next.id}`);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [g.id]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={g[lang].title}>
      <button className="lightbox-bg" onClick={close} aria-label={t('common.close')} />
      <figure className="lightbox-card">
        <div className="lightbox-img">
          <img src={g.medium} alt={g[lang].title} />
          <button className="icon-btn lightbox-close" onClick={close} aria-label={t('common.close')}>
            <X size={18} />
          </button>
          <a className="icon-btn lightbox-prev" href={`#/wissen/galerie/${prev.id}`} aria-label={prev[lang].title}>
            <ChevronLeft size={20} />
          </a>
          <a className="icon-btn lightbox-next" href={`#/wissen/galerie/${next.id}`} aria-label={next[lang].title}>
            <ChevronRight size={20} />
          </a>
        </div>
        <figcaption>
          <p className="card-kicker">
            {t(`gallery.tel.${g.telescope}` as MsgKey)} · {g.year}
          </p>
          <h3>{g[lang].title}</h3>
          <p className="muted">{g[lang].text}</p>
          <p className="note">© {g.credit}</p>
          <div className="btn-row">
            {g.skyFocus && (
              <a className="btn btn-primary btn-sm" href={`#/sky?focus=${g.skyFocus}`}>
                {t('common.showInSky')} <ArrowRight size={15} />
              </a>
            )}
            <a className="btn btn-ghost btn-sm" href={`https://images.nasa.gov/details/${encodeURIComponent(g.nasaId)}`} target="_blank" rel="noreferrer">
              images.nasa.gov <ExternalLink size={14} />
            </a>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
