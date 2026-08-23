import React from 'react';
import { Award, BookOpen, CheckCircle2 } from 'lucide-react';

export default function StudentGradebook({ student }) {
  const marks = student?.marks || { Math: 92, Science: 88, English: 95, History: 85, ComputerScience: 98 };

  const totalScored = Object.values(marks).reduce((acc, curr) => acc + curr, 0);
  const maxPossible = Object.keys(marks).length * 100;
  const overallPercentage = Math.round((totalScored / maxPossible) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={24} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                Official Academic Gradebook & Report Card
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Term Marks for <strong style={{ color: '#fff' }}>{student.name}</strong> ({student.className})
            </p>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            padding: '0.6rem 1.25rem',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Overall Score Percentage
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {overallPercentage}% (Grade A+)
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Subject Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Marks Scored</th>
              <th style={{ padding: '0.75rem 1rem' }}>Max Marks</th>
              <th style={{ padding: '0.75rem 1rem' }}>Percentage</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Grade Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(marks).map(([subject, score]) => {
              const pct = score;
              const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : 'C';

              return (
                <tr key={subject} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={16} color="var(--accent-cyan)" />
                      <span>{subject}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {score}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    100
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#34d399' }}>
                    {pct}%
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                      <CheckCircle2 size={12} /> {grade} Passed
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
