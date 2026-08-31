"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "@/components/icons";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  description?: string;
  isDeleting?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Event",
  itemName,
  description = "Are you sure you want to permanently delete this? This action cannot be undone. All associated data and attendee records will be permanently removed.",
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => panelRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    },
    [onClose, isDeleting]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={isDeleting ? undefined : onClose}
            aria-hidden
          />

          {/* Dialog Card */}
          <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-navy border border-red-500/20 p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(239,68,68,0.1)] outline-none text-cream"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-1.5 rounded-full text-cream/40 hover:text-cream hover:bg-cream/10 transition-colors cursor-pointer disabled:opacity-30"
              aria-label="Cancel deletion"
            >
              <X size={18} />
            </button>

            {/* Icon Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 id="delete-dialog-title" className="font-display text-lg font-bold text-cream">
                  {title}
                </h3>
                <p className="font-body text-xs text-red-400/90 font-medium">
                  Irreversible action
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-3 mb-6">
              {itemName && (
                <div className="px-3.5 py-2.5 rounded-lg bg-cream/5 border border-cream/10 text-cream/90 font-display font-semibold text-sm break-words">
                  &ldquo;{itemName}&rdquo;
                </div>
              )}
              <p id="delete-dialog-description" className="font-body text-xs leading-relaxed text-cream/65">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-lg border border-cream/15 text-cream/75 font-body text-xs font-semibold hover:bg-cream/10 hover:text-cream transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-body text-xs font-bold hover:bg-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.4)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                <span>{isDeleting ? "Deleting..." : "Yes, Delete Permanently"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
