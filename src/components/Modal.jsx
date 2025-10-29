import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, actions }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden></div>
      <div ref={dialogRef} className="relative w-full max-w-lg rounded-lg bg-white shadow-lg focus:outline-none" role="document">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h2>
          <button ref={closeButtonRef} onClick={onClose} className="p-2 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {actions && (
          <div className="px-4 pb-4 flex items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
