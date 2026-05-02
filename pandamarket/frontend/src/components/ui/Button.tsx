'use client';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--pd-green)', color: '#fff', border: 'none' },
  secondary: { background: 'var(--pd-bg-tertiary)', color: 'var(--pd-text-primary)', border: '1px solid var(--pd-border)' },
  ghost: { background: 'transparent', color: 'var(--pd-text-primary)', border: 'none' },
  danger: { background: 'var(--pd-red)', color: '#fff', border: 'none' },
  outline: { background: 'transparent', color: 'var(--pd-green)', border: '2px solid var(--pd-green)' },
};

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: 'var(--pd-fs-sm)', borderRadius: 'var(--pd-radius-sm)' },
  md: { padding: '10px 20px', fontSize: 'var(--pd-fs-base)', borderRadius: 'var(--pd-radius-md)' },
  lg: { padding: '14px 28px', fontSize: 'var(--pd-fs-lg)', borderRadius: 'var(--pd-radius-md)' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all var(--pd-transition)',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    ...styles[variant],
    ...sizes[size],
    ...style,
  };

  return (
    <button
      style={baseStyle}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
          if (variant === 'primary') (e.currentTarget as HTMLElement).style.boxShadow = 'var(--pd-shadow-green)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
      }}
      {...props}
    >
      {loading ? (
        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
      ) : icon}
      {children}
    </button>
  );
}
