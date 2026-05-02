import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'verified';
  children: React.ReactNode;
  dot?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const colors: Record<string, { bg: string; text: string; dot: string }> = {
  success: { bg: 'var(--pd-green-bg)', text: 'var(--pd-green)', dot: 'var(--pd-green)' },
  warning: { bg: 'var(--pd-yellow-bg)', text: 'var(--pd-yellow)', dot: 'var(--pd-yellow)' },
  danger: { bg: 'var(--pd-red-bg)', text: 'var(--pd-red)', dot: 'var(--pd-red)' },
  info: { bg: 'var(--pd-blue-bg)', text: 'var(--pd-blue)', dot: 'var(--pd-blue)' },
  neutral: { bg: 'var(--pd-bg-tertiary)', text: 'var(--pd-text-secondary)', dot: 'var(--pd-text-tertiary)' },
  verified: { bg: 'var(--pd-green-bg)', text: 'var(--pd-green)', dot: 'var(--pd-green)' },
};

export default function Badge({ variant = 'neutral', children, dot = false, style, className }: BadgeProps) {
  const c = colors[variant];
  return (
    <span 
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '3px 10px', fontSize: 'var(--pd-fs-xs)', fontWeight: 600,
        borderRadius: 'var(--pd-radius-full)',
        backgroundColor: c.bg, color: c.text,
        ...style
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.dot }} />}
      {variant === 'verified' && <span>✓</span>}
      {children}
    </span>
  );
}
