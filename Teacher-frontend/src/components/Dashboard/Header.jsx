import React, { useState } from 'react';
import { LogOut, User, Sparkles, Shield, ChevronDown } from 'lucide-react';
import ClassSelector from './ClassSelector';

export default function Header({ user, classes, activeClass, onSelectClass, onRefreshClasses, onNavigateProfile, onLogout }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const teacherName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Teacher';
  const teacherEmail = user?.email || 'teacher@school.edu';
  const schoolName = user?.user_metadata?.school_name || 'St. Xavier High School';

  return (
    <header className="app-header glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.85rem' }}>
        
        {/* Brand Title & School */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            flexShrink: 0
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              EduSmart Platform
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Shield size={10} color="var(--accent-cyan)" /> {schoolName}
            </p>
          </div>
        </div>

        {/* Right Controls: Class Selector + Teacher Profile Button (Single Instance!) */}
        <div className="header-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {/* Class Selector Dropdown */}
          <ClassSelector
            classes={classes}
            activeClass={activeClass}
            onSelectClass={onSelectClass}
            onRefreshClasses={onRefreshClasses}
          />

          {/* Teacher Profile Button (Far Right) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: '#fff',
                transition: 'all 0.2s ease'
              }}
              title="Open Teacher Menu"
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--gradient-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {teacherName.charAt(0).toUpperCase()}
              </div>
              <span className="header-teacher-name" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {teacherName}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" style={{ transform: profileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '240px',
                padding: '0.6rem',
                zIndex: 300,
                background: '#0f172a',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 20px rgba(99, 102, 241, 0.2)'
              }}>
                <div style={{ padding: '0.5rem 0.6rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.4rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {teacherName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {teacherEmail}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onNavigateProfile) onNavigateProfile();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.55rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <User size={15} color="var(--accent-cyan)" />
                  <span>My Teacher Profile</span>
                </button>

                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.55rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'rgba(244, 63, 94, 0.15)',
                      color: '#fb7185',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
