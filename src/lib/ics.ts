// Kalenderdateien (.ics, iCalendar) erzeugen und speichern bzw. teilen.

export interface IcsEvent {
  uid: string;
  start: Date;
  end?: Date;
  title: string;
  description?: string;
  url?: string;
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Zeilen über 75 Zeichen umbrechen (Folgezeilen beginnen mit einem Leerzeichen) */
function fold(line: string) {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  parts.push(rest);
  return parts.join('\r\n');
}

export function buildIcs(events: IcsEvent[], calName = 'Orbitus Maximus'): string {
  const now = stamp(new Date());
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Orbitus Maximus//DE', 'CALSCALE:GREGORIAN', `X-WR-CALNAME:${escape(calName)}`];
  for (const e of events) {
    const end = e.end ?? new Date(e.start.getTime() + 60 * 60_000);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}@orbitus-maximus`,
      `DTSTAMP:${now}`,
      `DTSTART:${stamp(e.start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${escape(e.title)}`,
    );
    if (e.description) lines.push(`DESCRIPTION:${escape(e.description)}`);
    if (e.url) lines.push(`URL:${e.url}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

/**
 * Datei speichern: Auf dem iPhone (vor allem in der installierten App) klappt das Teilen-Menü
 * zuverlässiger als ein Download, deshalb wird es bevorzugt, wenn der Browser Dateien teilen kann.
 */
export async function saveFile(content: string | Blob, filename: string, type: string) {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content;
  const file = new File([blob], filename, { type });
  const touch = matchMedia('(pointer: coarse)').matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
