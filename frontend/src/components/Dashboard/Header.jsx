import React from 'react';
import { LogOut, Sparkles, GraduationCap, BookOpen, Shield, School, Activity, Brain } from 'lucide-react';

export default function Header({ user, role, onLogout }) {
  const getRoleDisplay = () => {
    switch (role) {
      case 'platform_admin':
        return { icon: Shield, label: 'Platform Admin', color: '#a855f7' };
      case 'school_admin':
        return { icon: School, label: 'Principal', color: '#fbbf24' };
      case 'teacher':
        return { icon: BookOpen, label: 'Teacher', color: '#38bdf8' };
      case 'student':
        return { icon: GraduationCap, label: 'Student', color: '#34d399' };
      default:
        return { icon: GraduationCap, label: 'User', color: '#38bdf8' };
    }
  };

  const roleInfo = getRoleDisplay();
  const RoleIcon = roleInfo.icon;

  return (
    <header className="cyber-glowing-card" style={{
      borderRadius: '0 0 20px 20px',
      padding: '1.1rem 2.25rem',
      marginBottom: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      gap: '1rem',
      background: 'rgba(18, 20, 28, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
        }}>
          <Brain size={24} color="#f4f4f5" />
        </div>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.3px', color: '#ffffff' }}>
            EduSmart<span style={{ color: '#38bdf8' }}>.AI</span>
          </div>
          {user?.schoolName && role !== 'platform_admin' && (
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
              {user.schoolName}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* System Active Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          fontSize: '0.775rem',
          color: '#e4e4e7',
          fontWeight: 700
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
          Biometric Portal Active
        </div>

        {/* User Role Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          padding: '0.45rem 1rem',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: `${roleInfo.color}20`,
            border: `1px solid ${roleInfo.color}35`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RoleIcon size={16} color={roleInfo.color} />
          </div>
          <div>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              {roleInfo.label}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffffff' }}>
              {user?.name || 'Prof. Alex Rivera'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            padding: '0.55rem 1.1rem',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
