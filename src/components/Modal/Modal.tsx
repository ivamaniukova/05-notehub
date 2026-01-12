import css from './Modal.module.css';
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';


export interface ModalProps{
    children: React.ReactNode,
    onClose: () => void,
    titleId: string,
    descriptionId?: string,
}

export default function Modal ({children, onClose, titleId, descriptionId}: ModalProps){
    const modalRoot = document.getElementById('modal-root');
    const handleBackdropClick = (event:
        React.MouseEvent<HTMLDivElement>) => {
            if(event.target === event.currentTarget){
                onClose();
            }
        };
        const modalRef = useRef<HTMLDivElement>(null);
    useEffect(()=> {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === "Escape"){
                onClose();
            }
            if (e.key === 'Tab') {
  const container = modalRef.current;
  if (!container) return;

  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  if (focusable.length === 0) {
    e.preventDefault();
    container.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (e.shiftKey) {
    if (active === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (active === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
        };
        const previousActiveElement = document.activeElement as HTMLElement | null;
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        requestAnimationFrame(() => modalRef.current?.focus());
        return() => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
            previousActiveElement?.focus();
        };

    }, [onClose]);
    return createPortal(
    <div className={css.backdrop} 
    role="dialog" 
    aria-modal="true" 
    onClick ={handleBackdropClick} 
    aria-labelledby={titleId}
    aria-describedby={descriptionId || undefined}>
        <div className={css.modal} ref = {modalRef} tabIndex={-1}> {children} </div>
        </div>, modalRoot!
    );
}