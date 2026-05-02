import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--pd-radius-sm)', style }: SkeletonProps) {
  return (
    <div className="animate-shimmer" style={{ width, height, borderRadius, ...style }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{ padding: 'var(--pd-sp-4)', borderRadius: 'var(--pd-radius-lg)', border: '1px solid var(--pd-border)', backgroundColor: 'var(--pd-bg-secondary)' }}>
      <Skeleton height="180px" borderRadius="var(--pd-radius-md)" />
      <div style={{ marginTop: 'var(--pd-sp-3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width="70%" height="16px" />
        <Skeleton width="40%" height="14px" />
        <Skeleton width="30%" height="20px" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton height="40px" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="48px" style={{ opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  );
}
