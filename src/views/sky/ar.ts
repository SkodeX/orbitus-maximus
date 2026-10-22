// AR-Modus der Sternkarte: Rückkamera als Hintergrund und ein dazu passender Bildwinkel.

const KEY = 'orbitus.arFov';
/** Bildwinkel der Hauptkamera entlang der langen Bildseite (iPhone-Weitwinkel ≈ 67°) */
const DEFAULT_LONG_FOV = 67;

export function readArFov() {
  try {
    const v = Number(localStorage.getItem(KEY));
    return v >= 45 && v <= 85 ? v : DEFAULT_LONG_FOV;
  } catch {
    return DEFAULT_LONG_FOV;
  }
}

export function writeArFov(v: number) {
  try {
    localStorage.setItem(KEY, String(v));
  } catch {
    // egal – gilt dann nur für diese Sitzung
  }
}

/** Startet die Rückkamera im Video-Element und liefert eine Stopp-Funktion */
export async function startCamera(video: HTMLVideoElement): Promise<() => void> {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Keine Kamera');
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
    audio: false,
  });
  video.srcObject = stream;
  video.hidden = false;
  await video.play().catch(() => undefined);
  return () => {
    stream.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  };
}

/**
 * Bildwinkel (Grad) entlang der kürzeren Bildschirmseite – so misst ihn die Sternkarte.
 * Das Video füllt den Bildschirm wie mit `object-fit: cover`, wird also an einer Seite beschnitten.
 */
export function cameraFov(video: HTMLVideoElement, W: number, H: number, longFovDeg: number): number | null {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh || !W || !H) return null;
  const tLong = Math.tan((longFovDeg * Math.PI) / 360);
  // Halbe Bildwinkel (als Tangens) entlang Breite und Höhe des Videos
  const tW = vw >= vh ? tLong : (tLong * vw) / vh;
  const tH = vh >= vw ? tLong : (tLong * vh) / vw;
  const scale = Math.max(W / vw, H / vh);
  const visW = tW * (W / (vw * scale));
  const visH = tH * (H / (vh * scale));
  const t = W <= H ? visW : visH;
  return (2 * Math.atan(t) * 180) / Math.PI;
}
