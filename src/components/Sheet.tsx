import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Unteres Panel (Handy) bzw. schwebendes Panel (Desktop) */
export function Sheet({
  title,
  onClose,
  children,
  closeLabel,
  modal = false,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  closeLabel: string;
  modal?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {modal && <div className="sheet-backdrop" onClick={onClose} />}
      <section className="sheet" role="dialog" aria-label={typeof title === 'string' ? title : undefined}>
        <header className="sheet-head">
          <h2 className="sheet-title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={closeLabel}>
            <X size={18} />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </section>
    </>
  );
}
