"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure portal mounts only after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop Click */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 bg-white w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-navy-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon & Badge */}
        <div className="space-y-3 pt-2 sm:pt-0">
          <div className="w-16 h-16 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center text-3xl mx-auto shadow-2xs border border-orange-200/60">
            🐾
          </div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/80">
            Account Required
          </span>
        </div>

        {/* Title & Explanation */}
        <div className="space-y-2">
          <h2
            id="auth-modal-title"
            className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight"
          >
            Please Sign In to Book
          </h2>
          <p
            id="auth-modal-description"
            className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xs mx-auto"
          >
            To keep your pet&apos;s medical history and appointment schedule linked safely to your account, please log in or register before scheduling a visit.
          </p>
        </div>

        {/* Primary Action Controls */}
        <div className="space-y-3 pt-2">
          <Link
            href={`${ROUTES.LOGIN}?redirectTo=${ROUTES.APPOINTMENTS}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all active:scale-98"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Log In to Account</span>
          </Link>

          <Link
            href={`${ROUTES.REGISTER}?redirectTo=${ROUTES.APPOINTMENTS}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs transition-colors"
          >
            <span>Create New Account</span>
          </Link>
        </div>

        {/* Secondary Dismiss Action */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}