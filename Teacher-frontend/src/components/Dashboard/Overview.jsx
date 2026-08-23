import React from 'react';
import { Users, Fingerprint, Award, Bot, TrendingUp, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Overview({ students, attendanceData, marksData, onNavigate }) {
  const totalStudents = students.length || 7;
  
  // Calculate today's attendance stats
  const presentCount = attendanceData.filter(r => r.status === 'Present').length || 6;
  const attendancePercentage = Math.round((presentCount / totalStudents) * 100);

  // Calculate average class marks
  let avgMark = 84;
  if (marksData && marksData.length > 0) {
    const totalSum = marksData.reduce((acc, m) => acc + ((m.maths + m.science + m.english + m.history + m.computerScience) / 5), 0);
    avgMark = Math.round(totalSum / marksData.length);
  }

  const statCards = [
    {
      title: 'Total Enrolled Students',
      value: totalStudents,
      subtitle: 'Grade 10-A Roster',
      icon: Users,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.15)'
    },
    {
      title: "Today's Biometric Attendance",
      value: `${attendancePercentage}%`,
      subtitle: `${presentCount} / ${totalStudents} Verified Present`,
      icon: Fingerprint,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.15)'
    },
    {
      title: 'Class Average Exam Marks',
      value: `${avgMark}%`,
      subtitle: 'Mid-Term 2026 Assessment',
      icon: Award,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)'
    },
    {
      title: 'AI Student Feedbacks',
      value: `${totalStudents} Active`,
      subtitle: 'OpenAI Evaluation Ready',
      icon: Bot,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.15)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.3)', color: '#a5b4fc', marginBottom: '0.75rem' }}>
            <ShieldCheck size={14} /> Official Teacher Workspace
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Welcome back to your Class Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '600px' }}>
            Digital attendance tracking, exam gradebook management, and OpenAI student feedback evaluation system are active.
          </p>
        </div>

        <button
          onClick={() => onNavigate('attendance')}
          className="btn-primary"
          style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
        >
          <Fingerprint size={20} /> Open Biometric Scanner
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {card.title}
                </span>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={card.color} />
                </div>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {card.value}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Access Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Fingerprint size={26} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Biometric Attendance Platform</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Touch scanner simulation and day-wise attendance log with instant verification timestamp.
          </p>
          <button
            onClick={() => onNavigate('attendance')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Launch Attendance Platform</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Award size={26} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Exam Marks & Gradebook</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Enter subject marks (Maths, Science, English, etc.) and auto-calculate student grades.
          </p>
          <button
            onClick={() => onNavigate('marks')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Open Gradebook</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Bot size={26} color="var(--accent-purple)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>OpenAI Student Feedback</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Generate personalized strengths and parent progress notes powered by GPT-4o AI.
          </p>
          <button
            onClick={() => onNavigate('ai-feedback')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Generate AI Feedback</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
