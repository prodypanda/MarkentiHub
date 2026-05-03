'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  padding?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, hover = false, padding = 'var(--pd-sp-6)', style, className, onClick }: CardProps) {
  const baseStyle: React.CSSProperties = {
    backgroundColor: 'var(--pd-bg-secondary)',
    border: '1px solid var(--pd-border)',
    borderRadius: 'var(--pd-radius-lg)',
    padding,
    boxShadow: 'var(--pd-shadow)',
    transition: 'all var(--pd-transition)',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      style={baseStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--pd-shadow-lg)';
          e.currentTarget.style.borderColor = 'var(--pd-green-border)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--pd-shadow)';
          e.currentTarget.style.borderColor = 'var(--pd-border)';
        }
      }}
    >
      {children}
    </div>
  );
}
