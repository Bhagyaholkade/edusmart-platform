import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export default function StudentAttendanceActivity({ student, summary, monthCalendar, absentDatesList }) {
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const attendanceRate = summary?.attendancePercentage || student?.attendanceRate || 94;

  const calendarDays = monthCalendar || [
    { date: '2026-08-23', dayNumber: 23, dayName: 'Sun', status: 'Holiday', time: '--', remark: 'Weekend' },
    { date: '2026-08-22', dayNumber: 22, dayName: 'Sat', status: 'Holiday', time: '--', remark: 'Weekend' },
    { date: '2026-08-21', dayNumber: 21, dayName: 'Fri', status: 'Present', time: '08:45 AM', remark: 'Verified on Terminal' },
    { date: '2026-08-20', dayNumber: 20, dayName: 'Thu', status: 'Late', time: '09:15 AM', remark: 'Late Entry Recorded' },
    { date: '2026-08-19', dayNumber: 19, dayName: 'Wed', status: 'Present', time: '08:42 AM', remark: 'Verified on Terminal' },
    { date: '2026-08-18', dayNumber: 18, dayName: 'Tue', status: 'Absent', time: '--', remark: 'Absent - Alert Sent to Parent' },
    { date: '2026-08-17', dayNumber: 17, dayName: 'Mon', status: 'Present', time: '08:40 AM', remark: 'Verified on Terminal' }
  ];

  const absentDaysLog = calendarDays.filter(d => d.status === 'Absent');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Attendance Header & Circular Percentage Display */}
      <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '2px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.75rem auto'
        }}>
          <Fingerprint size={36} color="var(--accent-cyan)" />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
          Biometric Attendance & Absence Calendar Audit
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Real-time biometric log for <strong style={{ color: '#fff' }}>{student.name}</strong> ({student.schoolName})
        </p>

        {/* Large Percentage Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(16, 185, 129, 0.18)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '0.6rem 1.4rem',
          borderRadius: '9999px',
          fontWeight: 800,
          fontSize: '1.3rem',
          marginTop: '1.25rem'
        }}>
          <TrendingUp size={24} /> {attendanceRate}% Overall Attendance Rate
        </div>
      </div>

      {/* 3 Quick Stat Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <CheckCircle2 size={30} color="#34d399" style={{ marginBottom: '0.4rem' }} />
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
            {summary?.presentDays || 113} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Present</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <XCircle size={30} color="#fb7185" style={{ marginBottom: '0.4rem' }} />
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb7185' }}>
            {summary?.absentDays || 5} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recorded Absent</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Clock size={30} color="#fbbf24" style={{ marginBottom: '0.4rem' }} />
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
            {summary?.lateDays || 2} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Late Entry Recorded</div>
        </div>
      </div>

      {/* Interactive Monthly Attendance Calendar Grid */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Monthly Attendance Calendar & Heatmap (August 2026)
            </h3>
          </div>

          {/* Color Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ color: '#34d399' }}>🟢 Present</span>
            <span style={{ color: '#fb7185' }}>🔴 ABSENT</span>
            <span style={{ color: '#fbbf24' }}>🟡 Late</span>
            <span style={{ color: 'var(--text-muted)' }}>⚪ Weekend</span>
          </div>
        </div>

        {/* Calendar Day Grid Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
          gap: '0.6rem'
        }}>
          {calendarDays.map((dayObj) => {
            const isAbsent = dayObj.status === 'Absent';
            const isPresent = dayObj.status === 'Present';
            const isLate = dayObj.status === 'Late';
            const isHoliday = dayObj.status === 'Holiday';

            return (
              <div
                key={dayObj.date}
                onClick={() => setSelectedDayDetail(dayObj)}
                style={{
                  background: isAbsent
                    ? 'rgba(244, 63, 94, 0.22)'
                    : isPresent
                    ? 'rgba(16, 185, 129, 0.15)'
                    : isLate
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isAbsent
                    ? '1.5px solid #f43f5e'
                    : isPresent
                    ? '1px solid rgba(16, 185, 129, 0.35)'
                    : isLate
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.4rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isAbsent ? '0 0 12px rgba(244, 63, 94, 0.3)' : 'none'
                }}
                title={`Click to inspect details for ${dayObj.date}`}
              >
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {dayObj.dayName}
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: isAbsent ? '#fb7185' : isPresent ? '#34d399' : isLate ? '#fbbf24' : 'var(--text-muted)',
                  marginTop: '0.1rem'
                }}>
                  {dayObj.dayNumber}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '0.15rem', color: isAbsent ? '#fb7185' : isPresent ? '#34d399' : 'var(--text-subtle)' }}>
                  {isAbsent ? 'ABSENT' : isPresent ? 'Present' : isLate ? 'Late' : 'Off'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day Detail Inspector Box */}
        {selectedDayDetail && (
          <div style={{
            marginTop: '1.25rem',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--glass-border)',
            borderRadius: '10px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                Date: {selectedDayDetail.date} ({selectedDayDetail.dayName})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                Remark: {selectedDayDetail.remark} • Scan Time: {selectedDayDetail.time}
              </div>
            </div>

            <span className="badge" style={{
              background: selectedDayDetail.status === 'Absent' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.25)',
              color: selectedDayDetail.status === 'Absent' ? '#fb7185' : '#34d399'
            }}>
              {selectedDayDetail.status}
            </span>
          </div>
        )}
      </div>

      {/* List of Specific Absence Dates */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <AlertTriangle size={20} color="#fb7185" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            Exact Absence Dates Breakdown ({absentDaysLog.length} Recorded Absences)
          </h3>
        </div>

        {absentDaysLog.length === 0 ? (
          <p style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 700 }}>
            🎉 Clean Record! Zero absences recorded for this student.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {absentDaysLog.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <XCircle size={18} color="#fb7185" />
                  <div>
                    <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.92rem' }}>
                      {item.date} ({item.dayName})
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#fb7185', marginLeft: '0.5rem' }}>
                      Class: {student.className}
                    </span>
                  </div>
                </div>

                <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.25)', color: '#fb7185' }}>
                  🔴 Absent Alert Sent to Parent
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
