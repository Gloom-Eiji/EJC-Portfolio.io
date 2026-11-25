"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/**
 * Centered dialog shell shared by the minigames and the letter composer:
 * focus moves in on open and back on close, Tab is trapped, Esc closes,
 * and page scrolling (Lenis + native) pauses while it is open.
 */
export default function Modal({
  open,
  onClose,
  title,
  label,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  label?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Keep the latest onClose without re-running the open/close effect on every
  // parent render (that would steal focus while someone is typing).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      (first ?? closeRef.current)?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Portal to <body> so no transformed ancestor (e.g. a scroll-reveal) can
  // turn `position: fixed` into position-relative-to-that-ancestor.
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/80 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`engraved relative max-h-[94dvh] w-full overflow-y-auto bg-crypt ${wide ? "max-w-4xl" : "max-w-2xl"}`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--rule)] bg-crypt/95 px-5 py-3.5 backdrop-blur">
              <div>
                {label && <p className="label text-ash-dim">{label}</p>}
                <h2 id="modal-title" className="font-serif text-2xl leading-tight text-parchment">
                  {title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 text-ash transition-colors hover:text-bone"
              >
                <X size={20} strokeWidth={1.2} />
              </button>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
