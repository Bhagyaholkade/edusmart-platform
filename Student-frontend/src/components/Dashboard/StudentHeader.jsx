import React from 'react';
import { Sparkles, Building2, LogOut, TrendingUp, ShieldCheck } from 'lucide-react';

export default function StudentHeader({ student, onLogout }) {
  const studentName = student.name || 'Bhagya Kumar';
  const rollNumber = student.rollNumber || '1010';
  const schoolName = student.schoolName || 'St. Xavier High School';
  const className = student.className || 'Grade 10-A';

  return (
    <header className="mobile-app-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        {/* Student Avatar & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: '#fff',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)'
          }}>
            {studentName.charAt(0)}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {studentName}
              </h2>
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.35)', fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                #{rollNumber}
              </span>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.05rem' }}>
              {schoolName} • {className}
            </p>
          </div>
        </div>

        {/* Live Attendance % Badge & Logout Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.18)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '0.35rem 0.65rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <TrendingUp size={14} color="#34d399" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>
              {student.attendanceRate || 94}%
            </span>
          </div>

          <button
            onClick={onLogout}
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              borderRadius: '10px',
              padding: '0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
