"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
  closeOnBackdrop?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidthClassName = "max-w-md",
  closeOnBackdrop = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={() => {
        if (closeOnBackdrop) onClose();
      }}
    >
      <div
        className={`w-full rounded-2xl bg-surface p-5 shadow-lg ${maxWidthClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="mb-4">
            {title && <h3 className="text-lg font-semibold text-on-surface">{title}</h3>}
            {description && <p className="text-sm text-on-surface-variant">{description}</p>}
          </div>
        )}

        {children}

        {footer}
      </div>
    </div>
  );
}
