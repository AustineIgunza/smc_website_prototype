"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "@/components/icons";

interface PhotoLightboxProps {
  images: string[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
}

export default function PhotoLightbox({
  images,
  currentIndex,
  open,
  onClose,
  onNavigate,
  title,
}: PhotoLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    },
    [open, currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown, open]);

  if (!open || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-teal/95 dark:bg-black/95 backdrop-blur-md p-4 sm:p-8"
        onClick={onClose}
      >
        {/* Top bar with count & close */}
        <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between z-20 pointer-events-none">
          <div className="pointer-events-auto bg-navy/70 border border-cream/10 text-cream px-3 py-1.5 rounded-full text-xs font-body tracking-wider">
            {title ? `${title} · ` : ""}
            <span className="text-amber font-semibold">{currentIndex + 1}</span> of{" "}
            <span>{images.length}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="pointer-events-auto p-2.5 rounded-full bg-navy/70 hover:bg-amber hover:text-teal text-cream border border-cream/15 transition-all cursor-pointer shadow-lg"
            aria-label="Close photo preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-navy/70 hover:bg-amber hover:text-teal text-cream border border-cream/15 transition-all cursor-pointer shadow-xl backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-navy/70 hover:bg-amber hover:text-teal text-cream border border-cream/15 transition-all cursor-pointer shadow-xl backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Center Image Display */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl max-h-[80vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]}
            alt={`Past Event photo ${currentIndex + 1}`}
            className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl border border-cream/10"
          />
        </motion.div>

        {/* Thumbnails rail on bottom */}
        <div
          className="absolute bottom-4 left-4 right-4 sm:bottom-6 flex items-center justify-center gap-2 overflow-x-auto py-2 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                idx === currentIndex
                  ? "border-amber scale-110 shadow-lg ring-2 ring-amber/30"
                  : "border-cream/20 opacity-50 hover:opacity-100"
              }`}
            >
              <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
