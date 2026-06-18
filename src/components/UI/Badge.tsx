import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  color?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  color,
  size = 'md',
  icon,
  className = '',
}) => {
  const customStyle = color
    ? {
        backgroundColor: `${color}20`, // 20% opacity
        color: color,
        border: `1px solid ${color}40`,
      }
    : {};

  return (
    <span
      className={`badge badge-${variant} badge-${size} ${className}`}
      style={customStyle}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};
