import React, { useState } from 'react';
import { BookOpen, User, TrendingUp, Award, AlertTriangle, Calendar, ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentSubjectPerformance({ student }) {
  const [expandedSubject, setExpandedSubject] = useState(null);

  const subjects = student?.subjectBreakdown || [
    {
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      attendancePct: 96,
      marks: 95,
      grade: 'A+',
      totalClasses: 30,
      present: 29,
      absent: 1,
      themeColor: '#06b6d4',
      absentDates: [
        { date: '2026-08-18', dayName: 'Tue', time: '09:00 AM', topic: 'Differential Calculus & Algebra', status: 'Absent - Parent Alerted' }
      ]
    },
    {
      subject: 'Physics',
      teacher: 'Prof. Davis',
      attendancePct: 93,
      marks: 90,
      grade: 'A',
      totalClasses: 30,
      present: 28,
      absent: 2,
      themeColor: '#8b5cf6',
      absentDates: [
        { date: '2026-08-12', dayName: 'Wed', time: '10:30 AM', topic: 'Electromagnetism Lab', status: 'Absent - Parent Alerted' },
        { date: '2026-08-05', dayName: 'Wed', time: '10:30 AM', topic: 'Optics & Wave Motion', status: 'Absent - Parent Alerted' }
      ]
    },
    {
      subject: 'Computer Science',
      teacher: 'Er. Wilson',
      attendancePct: 98,
      marks: 99,
      grade: 'A+',
      totalClasses: 30,
      present: 29,
      absent: 1,
      themeColor: '#10b981',
      absentDates: [
        { date: '2026-08-01', dayName: 'Sat', time: '02:00 PM', topic: 'Data Structures & Algorithms', status: 'Absent - Parent Alerted' }
      ]
    },
    {
      subject: 'English Literature',
      teacher: 'Mrs. Taylor',
      attendancePct: 90,
      marks: 88,
      grade: 'A',
      totalClasses: 30,
      present: 27,
      absent: 3,
      themeColor: '#f43f5e',
      absentDates: [
        { date: '2026-08-15', dayName: 'Sat', time: '11:15 AM', topic: 'Shakespearean Drama Analysis', status: 'Absent - Parent Alerted' },
        { date: '2026-08-08', dayName: 'Sat', time: '11:15 AM', topic: 'Modern Poetry & Prose', status: 'Absent - Parent Alerted' },
        { date: '2026-08-02', dayName: 'Sun', time: '11:15 AM', topic: 'Grammar & Essay Composition', status: 'Absent' }
      ]
    },
    {
      subject: 'History & Civics',
      teacher: 'Mr. Brown',
      attendancePct: 94,
      marks: 91,
      grade: 'A+',
      totalClasses: 30,
      present: 28,
      absent: 2,
      themeColor: '#f59e0b',
      absentDates: [
        { date: '2026-08-14', dayName: 'Fri', time: '01:00 PM', topic: 'World War II History', status: 'Absent - Parent Alerted' },
        { date: '2026-08-04', dayName: 'Tue', time: '01:00 PM', topic: 'Indian Constitution & Civics', status: 'Absent - Parent Alerted' }
      ]
    }
  ];

  const toggleExpand = (subjName) => {
    if (expandedSubject === subjName) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(subjName);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Card */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BookOpen size={24} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              Subject-Wise Attendance & Absence Dates
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Inspect subject attendance rates & exact missed dates for <strong style={{ color: '#fff' }}>{student.name}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* List of Attractive Subject Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {subjects.map((item) => {
          const color = item.themeColor || '#06b6d4';
          const isExpanded = expandedSubject === item.subject;
          const absentList = item.absentDates || [];
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (item.attendancePct / 100) * circumference;

          return (
            <div
              key={item.subject}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                border: isExpanded ? `1.5px solid ${color}` : '1px solid var(--glass-border)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Card Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                {/* Left Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {/* SVG Circular Ring Chart */}
                  <div style={{ position: 'relative', width: '68px', height: '68px', flexShrink: 0 }}>
                    <svg width="68" height="68" viewBox="0 0 68 68">
                      <circle
                        cx="34"
                        cy="34"
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <circle
                        cx="34"
                        cy="34"
                        r={radius}
                        stroke={color}
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                        transform="rotate(-90 34 34)"
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: color
                    }}>
                      {item.attendancePct}%
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                      {item.subject}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                      <User size={12} color={color} /> {item.teacher}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)', fontSize: '0.7rem' }}>
                        Grade {item.grade} ({item.marks}/100)
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                        {item.present}/{item.totalClasses} Days Attended
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Absence Toggle Button */}
                <div>
                  <button
                    onClick={() => toggleExpand(item.subject)}
                    style={{
                      background: absentList.length > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: absentList.length > 0 ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid var(--glass-border)',
                      color: absentList.length > 0 ? '#fb7185' : 'var(--text-muted)',
                      borderRadius: '10px',
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Calendar size={14} />
                    <span>{absentList.length} Absent Dates</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Subject Absence Dates Timeline (Collapsible Inspector) */}
              {isExpanded && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--glass-border)',
                  animation: 'modalAppear 0.2s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fb7185', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <AlertTriangle size={15} /> Exact Absence Dates for {item.subject}
                    </h5>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      Total {absentList.length} Missed Class Sessions
                    </span>
                  </div>

                  {absentList.length === 0 ? (
                    <p style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 700, padding: '0.5rem 0' }}>
                      🎉 100% Attendance for {item.subject}! No absences recorded.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {absentList.map((abs, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            borderRadius: '10px',
                            padding: '0.75rem 0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <XCircle size={16} color="#fb7185" />
                              <strong style={{ color: '#fff', fontSize: '0.88rem' }}>
                                {abs.date} ({abs.dayName})
                              </strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Time: {abs.time}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem', paddingLeft: '1.5rem' }}>
                              Topic Missed: <span style={{ color: '#fff' }}>{abs.topic}</span>
                            </div>
                          </div>

                          <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.25)', color: '#fb7185', fontSize: '0.7rem' }}>
                            🔴 {abs.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
