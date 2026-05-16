"use client";
import React, { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, style, id, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || `input-${defaultId}`;
    const errorId = `error-${inputId}`;
    const hintId = `hint-${inputId}`;
    const hasError = Boolean(error);

    const describedBy =
      [error ? errorId : null, hint && !error ? hintId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const containerStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      width: "100%",
    };

    const labelStyle: React.CSSProperties = {
      fontSize: "var(--pd-fs-sm)",
      fontWeight: 500,
      color: "var(--pd-text-primary)",
    };

    const wrapperStyle: React.CSSProperties = {
      position: "relative",
      display: "flex",
      alignItems: "center",
    };

    const inputStyle: React.CSSProperties = {
      width: "100%",
      padding: icon ? "10px 14px 10px 40px" : "10px 14px",
      fontSize: "var(--pd-fs-base)",
      color: "var(--pd-text-primary)",
      backgroundColor: "var(--pd-bg-secondary)",
      border: `1px solid ${hasError ? "var(--pd-red)" : "var(--pd-border)"}`,
      borderRadius: "var(--pd-radius-sm)",
      outline: "none",
      transition: "all var(--pd-transition)",
      ...style,
    };

    const iconStyle: React.CSSProperties = {
      position: "absolute",
      left: "12px",
      color: "var(--pd-text-tertiary)",
      display: "flex",
      alignItems: "center",
      pointerEvents: "none",
    };

    return (
      <div style={containerStyle}>
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}
        <div style={wrapperStyle}>
          {icon && <span style={iconStyle}>{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            style={inputStyle}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={describedBy}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? "var(--pd-red)"
                : "var(--pd-green)";
              e.currentTarget.style.boxShadow = hasError
                ? "0 0 0 3px var(--pd-red-bg)"
                : "0 0 0 3px var(--pd-green-bg)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? "var(--pd-red)"
                : "var(--pd-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
            {...props}
          />
        </div>
        {error && (
          <span
            id={errorId}
            style={{ fontSize: "var(--pd-fs-xs)", color: "var(--pd-red)" }}
          >
            {error}
          </span>
        )}
        {hint && !error && (
          <span
            id={hintId}
            style={{
              fontSize: "var(--pd-fs-xs)",
              color: "var(--pd-text-tertiary)",
            }}
          >
            {hint}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
