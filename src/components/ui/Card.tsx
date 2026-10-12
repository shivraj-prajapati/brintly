import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-surface-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
