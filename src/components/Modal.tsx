import { useT } from '../ui';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
const modalStack: symbol[] = [];
export function Modal({
  title,
  eyebrow,
  children,
  footer,
  onClose,
  wide = false,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ui = useT();
  const dialogTitleId = useId();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const token = Symbol('dialog');
    modalStack.push(token);
    const old = document.activeElement as HTMLElement;
    const root = ref.current;
    root?.querySelector<HTMLElement>('input,textarea,select,button')?.focus();
    const key = (e: KeyboardEvent) => {
      if (modalStack.at(-1) !== token) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab') {
        const all = Array.from(
          root?.querySelectorAll<HTMLElement>(
            'button:not(:disabled),input,textarea,select,[tabindex="0"]',
          ) || [],
        ).filter((el) => el.offsetParent !== null);
        const first = all[0],
          last = all.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      const index = modalStack.indexOf(token);
      if (index >= 0) modalStack.splice(index, 1);
      document.removeEventListener('keydown', key);
      old?.focus();
    };
  }, []);
  return (
    <div
      className="modal-shade"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        className={`modal ${wide ? 'modal-wide' : ''}`}
      >
        <header>
          <div>
            {eyebrow && <span className="eyebrow">{ui(eyebrow)}</span>}
            <h2 id={dialogTitleId}>{ui(title)}</h2>
          </div>
          <button aria-label={ui('Kapat')} className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}
