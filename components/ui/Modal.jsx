"use client";

import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  panelClassName = "",
  size = "default",
  /** When set, children are wrapped so the modal can use flex + overflow (e.g. sticky footer inside child). */
  bodyClassName = "",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const isLarge = size === "lg";
  const padding = isLarge ? "p-8 sm:p-10 lg:p-12" : "p-6 sm:p-8";
  const titleClass = isLarge
    ? "text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]"
    : "text-xl font-bold tracking-tight text-slate-900";
  const descriptionClass = isLarge
    ? "text-base font-medium leading-relaxed text-slate-600"
    : "text-sm font-medium text-slate-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm transition-opacity"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-desc" : undefined}
        className={`relative z-10 w-full rounded-2xl border border-slate-100/90 bg-white shadow-[0_24px_80px_-12px_rgb(15,23,42,0.25)] ring-1 ring-slate-200/80 ${padding} ${panelClassName || "max-w-lg"}`}
      >
        <div
          className={`flex shrink-0 items-start justify-between gap-4 ${bodyClassName ? (isLarge ? "mb-4 sm:mb-5" : "mb-4") : isLarge ? "mb-8" : "mb-6"}`}
        >
          <div className={`space-y-1 ${isLarge ? "space-y-1.5" : ""}`}>
            <h2 id="modal-title" className={titleClass}>
              {title}
            </h2>
            {description ? (
              <p id="modal-desc" className={descriptionClass}>
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 ${isLarge ? "p-2.5" : "p-2"}`}
            aria-label="Close"
          >
            <svg className={isLarge ? "h-6 w-6" : "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {bodyClassName ? <div className={bodyClassName}>{children}</div> : children}
      </div>
    </div>
  );
}
