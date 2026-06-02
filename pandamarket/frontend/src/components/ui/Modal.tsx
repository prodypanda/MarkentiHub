"use client";
import React, { useEffect, useCallback, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "520px",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Focus modal when opened for accessibility
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--pd-z-modal-backdrop)" as unknown as number,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--pd-sp-4)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className="animate-scale-in"
        style={{
          position: "relative",
          zIndex: "var(--pd-z-modal)" as unknown as number,
          backgroundColor: "var(--pd-bg-secondary)",
          borderRadius: "var(--pd-radius-xl)",
          boxShadow: "var(--pd-shadow-lg)",
          maxWidth,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          outline: "none", // remove outline on focus
        }}
      >
        {title && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "var(--pd-sp-6)",
              borderBottom: "1px solid var(--pd-border)",
            }}
          >
            <h3
              id="modal-title"
              style={{
                fontSize: "var(--pd-fs-lg)",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--pd-radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--pd-text-secondary)",
                fontSize: "18px",
                transition: "all var(--pd-transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--pd-bg-tertiary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ padding: "var(--pd-sp-6)" }}>{children}</div>
      </div>
    </div>
  );
}
