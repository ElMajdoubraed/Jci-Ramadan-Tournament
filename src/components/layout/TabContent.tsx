import { ReactNode } from 'react';

interface TabContentProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function TabContent({ children, title, subtitle }: TabContentProps) {
  return (
    <div className="text-center p-4">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-emerald-700 mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}