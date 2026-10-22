// Tagebuch-Erweiterungen: Statistik, Export als CSV, Druckansicht (PDF) und Teilen als Bild.
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useI18n, type I18n } from '../i18n';
import { useSettings } from '../state/settings';
import { cloud } from '../lib/cloud/client';
import { photoUrl, useDiary, type Observation } from '../lib/cloud/diary';
import { saveFile } from '../lib/ics';
import { fmtDateTime, fmtInt, localDayKey } from '../lib/format';

// ------------------------------------------------------------------ Statistik

export function DiaryStats({ entries, tz }: { entries: Observation[]; tz: string }) {
  const { t, lang } = useI18n();
  const [hover, setHover] = useState<number | null>(null);

  const stats = useMemo(() => {
    const months: { key: string; label: string; n: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
      months.push({
        key: localDayKey(d, tz).slice(0, 7),
        label: new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'short', timeZone: tz }).format(d),
        n: 0,
      });
    }
    const objects = new Map<string, { name: string; n: number }>();
    const nights = new Set<string>();
    const equipment = new Map<string, number>();
    let photos = 0;
    for (const e of entries) {
      const d = new Date(e.observedAt);
      // Eine Beobachtungsnacht zählt bis zum Mittag des Folgetags
      nights.add(localDayKey(new Date(d.getTime() - 12 * 3_600_000), tz));
      const m = months.find((x) => x.key === localDayKey(d, tz).slice(0, 7));
      if (m) m.n++;
      for (const o of e.objects) {
        const k = o.trim().toLowerCase();
        objects.set(k, { name: objects.get(k)?.name ?? o.trim(), n: (objects.get(k)?.n ?? 0) + 1 });
      }
      for (const q of e.equipment ? e.equipment.split(', ') : []) equipment.set(q, (equipment.get(q) ?? 0) + 1);
      photos += e.photos.length;
    }
    return {
      months,
      top: [...objects.values()].sort((a, b) => b.n - a.n).slice(0, 6),
      nights: nights.size,
      equipment: [...equipment.entries()].sort((a, b) => b[1] - a[1]),
      photos,
      objects: objects.size,
      great: entries.filter((e) => (e.seeing ?? 0) >= 4).length,
    };
  }, [entries, tz, lang]);

  const max = Math.max(1, ...stats.months.map((m) => m.n));
  const peak = stats.months.reduce((b, m, i) => (m.n > stats.months[b].n ? i : b), 0);
  const shown = hover ?? peak;

  return (
    <section className="card diary-stats-card">
      <p className="card-kicker">{t('diary.stats')}</p>
      <div className="diary-tiles">
        <div>
          <strong>{fmtInt(entries.length, lang)}</strong>
          <span className="muted small">{t('diary.statEntries')}</span>
        </div>
        <div>
          <strong>{fmtInt(stats.nights, lang)}</strong>
          <span className="muted small">{t('diary.statNights')}</span>
        </div>
        <div>
          <strong>{fmtInt(stats.objects, lang)}</strong>
          <span className="muted small">{t('diary.statObjects')}</span>
        </div>
        <div>
          <strong>{fmtInt(stats.photos, lang)}</strong>
          <span className="muted small">{t('diary.statPhotos')}</span>
        </div>
      </div>

      <div className="diary-chart">
        <p className="muted small">
          {t('diary.statMonths')} · <span className="diary-chart-value">{t('diary.statMonthValue', { month: stats.months[shown].label, n: stats.months[shown].n })}</span>
        </p>
        <div className="diary-bars" role="img" aria-label={stats.months.map((m) => `${m.label}: ${m.n}`).join(', ')}>
          {stats.months.map((m, i) => (
            <button
              key={m.key}
              className={`diary-bar ${i === shown ? 'is-on' : ''}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onClick={() => setHover(i)}
              aria-label={`${m.label}: ${m.n}`}
            >
              <span style={{ height: `${(m.n / max) * 100}%` }} />
            </button>
          ))}
        </div>
        <div className="diary-bar-labels" aria-hidden="true">
          {stats.months.map((m, i) => (
            <span key={m.key}>{i % 2 === 0 ? m.label.slice(0, 3) : ''}</span>
          ))}
        </div>
      </div>

      {stats.top.length > 0 && (
        <div className="diary-top">
          <p className="muted small">{t('diary.statTop')}</p>
          <ol>
            {stats.top.map((o) => (
              <li key={o.name}>
                <span>{o.name}</span>
                <span className="muted">{o.n}×</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {stats.equipment.length > 0 && (
        <p className="muted small">
          {t('diary.statEquipment')}: {stats.equipment.map(([q, n]) => `${q} ${n}×`).join(' · ')} · {t('diary.statGreat', { n: stats.great })}
        </p>
      )}
    </section>
  );
}

// ------------------------------------------------------------------ Export

export function exportCsv(entries: Observation[], tz: string, i18n: I18n) {
  const { t, lang } = i18n;
  const q = (v: string | number | null | undefined) => {
    const s = v == null ? '' : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = ['date', 'place', 'lat', 'lon', 'objects', 'title', 'conditions', 'equipment', 'notes', 'photos'].map((k) => t(`diary.csv.${k}` as 'diary.csv.date'));
  const rows = entries.map((e) =>
    [
      fmtDateTime(new Date(e.observedAt), tz, lang),
      e.placeName,
      e.lat?.toFixed(4),
      e.lon?.toFixed(4),
      e.objects.join(' / '),
      e.title,
      e.seeing ?? '',
      e.equipment,
      e.notes,
      e.photos.length,
    ]
      .map(q)
      .join(';'),
  );
  // BOM, damit Excel Umlaute richtig erkennt
  return saveFile('﻿' + [head.join(';'), ...rows].join('\r\n'), 'orbitus-tagebuch.csv', 'text/csv');
}

// ------------------------------------------------------------------ Druckansicht (als PDF speichern)

function PrintPhoto({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const c = cloud();
    if (c) photoUrl(c, path).then(setUrl, () => undefined);
  }, [path]);
  return url ? <img src={url} alt="" /> : null;
}

export function DiaryPrint() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const tz = settings.place?.tz ?? 'UTC';
  const entries = useDiary();
  return (
    <div className="page diary diary-print">
      <header className="page-head no-print">
        <a className="back-link" href="#/tagebuch">
          <ArrowLeft size={16} /> {t('diary.title')}
        </a>
        <h1>{t('diary.printTitle')}</h1>
        <p className="lead muted">{t('diary.printLead')}</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={18} /> {t('diary.printNow')}
          </button>
        </div>
      </header>
      <h1 className="print-only">{t('diary.title')} – Orbitus Maximus</h1>
      {entries.map((e) => (
        <article key={e.id} className="print-entry">
          <p className="print-date">
            {fmtDateTime(new Date(e.observedAt), tz, lang)}
            {e.placeName && ` · ${e.placeName}`}
          </p>
          <h2>{e.title || e.objects.join(', ') || t('diary.untitled')}</h2>
          {e.title && e.objects.length > 0 && <p>{e.objects.join(' · ')}</p>}
          <p className="print-meta">
            {e.seeing ? `${t('diary.conditions')}: ${'★'.repeat(e.seeing)}${'☆'.repeat(5 - e.seeing)}` : ''}
            {e.equipment && ` · ${e.equipment}`}
          </p>
          {e.notes && <p className="print-notes">{e.notes}</p>}
          {e.photos.length > 0 && (
            <div className="print-photos">
              {e.photos.map((p) => (
                <PrintPhoto key={p} path={p} />
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ Teilen als Bild

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Zeilenumbruch für Canvas-Text */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else line = test;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, ' …');
  return lines;
}

/** Erzeugt eine Bildkarte (1080 × 1350) der Beobachtung und öffnet das Teilen-Menü */
export async function shareEntryImage(e: Observation, tz: string, i18n: I18n) {
  const { t, lang } = i18n;
  const W = 1080;
  const H = 1350;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  await document.fonts?.ready;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0b1030');
  bg.addColorStop(1, '#05060f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // Ein paar Sterne
  for (let i = 0; i < 220; i++) {
    const x = (Math.sin(i * 91.7) * 0.5 + 0.5) * W;
    const y = (Math.sin(i * 47.3 + 1) * 0.5 + 0.5) * H;
    ctx.fillStyle = `rgba(255,255,255,${0.15 + ((i * 37) % 60) / 100})`;
    ctx.fillRect(x, y, i % 9 === 0 ? 3 : 2, i % 9 === 0 ? 3 : 2);
  }

  let y = 90;
  const photo = e.photos[0];
  const client = cloud();
  if (photo && client) {
    try {
      const img = await loadImage(await photoUrl(client, photo));
      const ph = 620;
      const scale = Math.max(W / img.width, ph / img.height);
      const sw = W / scale;
      const sh = ph / scale;
      ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, W, ph);
      const fade = ctx.createLinearGradient(0, ph - 200, 0, ph);
      fade.addColorStop(0, 'rgba(5,6,15,0)');
      fade.addColorStop(1, 'rgba(5,6,15,1)');
      ctx.fillStyle = fade;
      ctx.fillRect(0, ph - 200, W, 200);
      y = ph + 40;
    } catch {
      // ohne Foto weiter
    }
  }

  const font = (w: number, size: number, family = 'Space Grotesk Variable, sans-serif') => `${w} ${size}px ${family}`;
  ctx.fillStyle = '#8aa4ff';
  ctx.font = font(600, 30, 'Inter Variable, sans-serif');
  ctx.fillText(fmtDateTime(new Date(e.observedAt), tz, lang).toUpperCase(), 80, y);
  y += 80;
  ctx.fillStyle = '#ffffff';
  ctx.font = font(700, 72);
  for (const l of wrap(ctx, e.title || e.objects.join(', ') || t('diary.untitled'), W - 160, 2)) {
    ctx.fillText(l, 80, y);
    y += 84;
  }
  ctx.font = font(500, 34, 'Inter Variable, sans-serif');
  ctx.fillStyle = '#c8d0ee';
  if (e.title && e.objects.length) {
    ctx.fillText(e.objects.join(' · ').slice(0, 60), 80, y);
    y += 56;
  }
  const meta = [e.placeName, e.seeing ? '★'.repeat(e.seeing) : '', e.equipment].filter(Boolean).join('   ·   ');
  if (meta) {
    ctx.fillStyle = '#9aa2c0';
    ctx.fillText(meta.slice(0, 70), 80, y);
    y += 70;
  }
  if (e.notes) {
    ctx.fillStyle = '#e8ecff';
    ctx.font = font(400, 34, 'Inter Variable, sans-serif');
    for (const l of wrap(ctx, e.notes, W - 160, Math.max(2, Math.floor((H - 160 - y) / 48)))) {
      ctx.fillText(l, 80, y);
      y += 48;
    }
  }
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = font(700, 30);
  ctx.fillText('ORBITUS MAXIMUS', 80, H - 80);

  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/png'));
  if (blob) await saveFile(blob, `beobachtung-${e.observedAt.slice(0, 10)}.png`, 'image/png');
}
