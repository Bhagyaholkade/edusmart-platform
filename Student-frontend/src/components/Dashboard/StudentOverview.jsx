import React from 'react';
import { TrendingUp, CheckCircle2, XCircle, Clock, Award, Bot, Calendar, Sparkles } from 'lucide-react';

export default function StudentOverview({ dashboardData }) {
  const { student, summary, activityLog } = dashboardData;
  const attendanceRate = summary?.attendancePercentage || student?.attendanceRate || 94;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Hero Attendance Rate Card */}
      <div className="glass-panel" style={{
        padding: '1.4rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Live Attendance Rate
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '0.1rem' }}>
            {attendanceRate}% <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 700 }}>Excellent</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
            Calculated from terminal scans
          </p>
        </div>

        {/* Circular Percentage Visual */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.15)',
          border: '3px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
          flexShrink: 0
        }}>
          <TrendingUp size={28} color="var(--accent-cyan)" />
        </div>
      </div>

      {/* 3 Mobile Metric Cards (2x2 Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Days Present</span>
            <CheckCircle2 size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
            {summary?.presentDays || 113}
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.1rem' }}>
            Verified Terminal
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Absences</span>
            <XCircle size={18} color="#fb7185" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb7185' }}>
            {summary?.absentDays || 5}
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.1rem' }}>
            Parent Alert Sent
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Late Entry</span>
            <Clock size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
            {summary?.lateDays || 2}
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.1rem' }}>
            Recorded Late
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Class Rank</span>
            <Award size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            Top 5%
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '0.1rem' }}>
            Grade 10-A
          </p>
        </div>
      </div>

      {/* Recent 7-Day Activity Stream */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <Calendar size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            Recent 7-Day Attendance Activity
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(activityLog || []).slice(0, 5).map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.55rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px solid var(--glass-border)'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem' }}>
                  {item.day} ({item.date})
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  Time: {item.time}
                </div>
              </div>

              <div>
                {item.status === 'Present' && (
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                    <CheckCircle2 size={11} /> Present
                  </span>
                )}
                {item.status === 'Absent' && (
                  <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.18)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.35)' }}>
                    <XCircle size={11} /> Absent
                  </span>
                )}
                {item.status === 'Holiday' && (
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                    Off
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Teacher Remarks */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <Bot size={18} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            AI Teacher Feedback Remarks
          </h3>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          lineHeight: 1.5,
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          fontStyle: 'italic'
        }}>
          "{student?.aiFeedback || 'Outstanding performance in computer science and mathematics. Punctual biometric attendance.'}"
        </div>
      </div>
    </div>
  );
}
