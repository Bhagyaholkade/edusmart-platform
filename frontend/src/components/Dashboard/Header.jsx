import React from 'react';
import { LogOut, Sparkles, GraduationCap, BookOpen, Shield, School } from 'lucide-react';

export default function Header({ user, role, onLogout }) {
  const getRoleDisplay = () => {
    switch (role) {
      case 'platform_admin':
        return { icon: Shield, label: 'Platform Admin', color: 'var(--accent-purple)' };
      case 'school_admin':
        return { icon: School, label: 'Principal', color: 'var(--accent-amber)' };
      case 'teacher':
        return { icon: BookOpen, label: 'Teacher', color: 'var(--accent-primary)' };
      case 'student':
        return { icon: GraduationCap, label: 'Student', color: 'var(--accent-cyan)' };
      default:
        return { icon: GraduationCap, label: 'User', color: 'var(--accent-cyan)' };
    }
  };

  const roleInfo = getRoleDisplay();
  const RoleIcon = roleInfo.icon;

  return (
    <header className="glass-panel app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            AI Learning Platform
          </h1>
          {user?.schoolName && role !== 'platform_admin' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user.schoolName}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--glass-border)'
        }}>
          <RoleIcon size={18} color={roleInfo.color} />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {roleInfo.label}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
              {user?.name || 'User'}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn-secondary"
          style={{ padding: '0.6rem 1rem' }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
