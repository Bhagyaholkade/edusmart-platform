import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--accent-emerald)" />;
      case 'error':
        return <AlertCircle size={18} color="var(--accent-red)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--accent-amber)" />;
      case 'info':
      default:
        return <Info size={18} color="var(--accent-cyan)" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      case 'info':
      default:
        return 'rgba(6, 182, 212, 0.4)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${getBorderColor(toast.type)}`,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.2)',
        color: '#fff',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {getIcon(toast.type)}
      <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
