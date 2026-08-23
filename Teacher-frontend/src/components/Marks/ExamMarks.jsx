import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Award, Save, BookOpen, Calculator, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { marksAPI } from '../../services/api';

export default function ExamMarks({ students, activeClass }) {
  const [examName, setExamName] = useState('Mid-Term 2026');
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Form input state
  const [formMaths, setFormMaths] = useState(85);
  const [formScience, setFormScience] = useState(88);
  const [formEnglish, setFormEnglish] = useState(90);
  const [formHistory, setFormHistory] = useState(82);
  const [formCS, setFormCS] = useState(94);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const data = await marksAPI.getMarks(examName);
      setMarksData(data || []);
    } catch (err) {
      console.error('Error fetching marks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [examName]);

  const openEditModal = (student) => {
    setEditingStudent(student);
    const existing = marksData.find(m => m.studentId === student.id || m.student_id === student.id);
    if (existing) {
      setFormMaths(existing.maths || 0);
      setFormScience(existing.science || 0);
      setFormEnglish(existing.english || 0);
      setFormHistory(existing.history || 0);
      setFormCS(existing.computerScience || existing.computer_science || 0);
    } else {
      setFormMaths(80);
      setFormScience(85);
      setFormEnglish(88);
      setFormHistory(82);
      setFormCS(90);
    }
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      await marksAPI.saveMarks({
        studentId: editingStudent.id,
        examName,
        maths: formMaths,
        science: formScience,
        english: formEnglish,
        history: formHistory,
        computerScience: formCS
      });

      setSaveSuccess(`Marks updated for ${editingStudent.name}!`);
      fetchMarks();
      setTimeout(() => {
        setEditingStudent(null);
        setSaveSuccess('');
      }, 1000);
    } catch (err) {
      console.error('Failed to save marks:', err);
    }
  };

  // Grade calculation helper
  const calculateGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', color: '#34d399', bg: 'rgba(16, 185, 129, 0.2)' };
    if (pct >= 80) return { grade: 'A', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.2)' };
    if (pct >= 70) return { grade: 'B', color: '#c084fc', bg: 'rgba(139, 92, 246, 0.2)' };
    if (pct >= 60) return { grade: 'C', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.2)' };
    return { grade: 'F', color: '#fb7185', bg: 'rgba(244, 63, 94, 0.2)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={28} color="var(--accent-emerald)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Exam Marks & Gradebook
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Active Class: <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}><BookOpen size={12} /> {activeClass}</span>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select Exam:</label>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="glass-input"
              style={{ width: '180px', fontWeight: 700 }}
            >
              <option value="Mid-Term 2026">Mid-Term 2026</option>
              <option value="Final Term 2026">Final Term 2026</option>
              <option value="Unit Test 1">Unit Test 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Marks Roster Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Award size={48} color="rgba(255, 255, 255, 0.15)" style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: 700 }}>No student mark records for {activeClass}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Roll #</th>
                <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Maths</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Science</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>English</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>History</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Comp. Sci</th>
                <th style={{ padding: '0.75rem 1rem' }}>Overall %</th>
                <th style={{ padding: '0.75rem 1rem' }}>Grade</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const mark = marksData.find(m => m.studentId === student.id || m.student_id === student.id);
                const maths = mark ? (mark.maths || 0) : 0;
                const science = mark ? (mark.science || 0) : 0;
                const english = mark ? (mark.english || 0) : 0;
                const history = mark ? (mark.history || 0) : 0;
                const cs = mark ? (mark.computerScience || mark.computer_science || 0) : 0;

                const total = maths + science + english + history + cs;
                const pct = mark ? Math.round(total / 5) : 0;
                const gradeObj = calculateGrade(pct);

                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      #{student.rollNumber || student.roll_number}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>
                      {student.name}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: maths >= 80 ? '#34d399' : '#fff' }}>{maths}</td>
                    <td style={{ padding: '1rem 0.5rem', color: science >= 80 ? '#34d399' : '#fff' }}>{science}</td>
                    <td style={{ padding: '1rem 0.5rem', color: english >= 80 ? '#34d399' : '#fff' }}>{english}</td>
                    <td style={{ padding: '1rem 0.5rem', color: history >= 80 ? '#34d399' : '#fff' }}>{history}</td>
                    <td style={{ padding: '1rem 0.5rem', color: cs >= 80 ? '#34d399' : '#fff' }}>{cs}</td>
                    
                    <td style={{ padding: '1rem', fontWeight: 800, color: '#fff' }}>
                      {mark ? `${pct}%` : 'N/A'}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {mark ? (
                        <span className="badge" style={{ background: gradeObj.bg, color: gradeObj.color, border: `1px solid ${gradeObj.color}` }}>
                          {gradeObj.grade}
                        </span>
                      ) : (
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                          Pending
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => openEditModal(student)}
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: 'var(--gradient-emerald)' }}
                      >
                        <Award size={14} /> Enter Marks
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Marks Modal via React Portal */}
      {editingStudent && createPortal(
        <div className="modal-overlay">
          <div className="glass-panel modal-panel">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.3rem' }}>
              Edit Exam Marks - {examName}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Student: <strong style={{ color: '#fff' }}>{editingStudent.name}</strong> (#{editingStudent.rollNumber})
            </p>

            {saveSuccess && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle2 size={16} /> {saveSuccess}
              </div>
            )}

            <form onSubmit={handleSaveMarks} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Mathematics (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="glass-input"
                    value={formMaths}
                    onChange={(e) => setFormMaths(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    Science (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="glass-input"
                    value={formScience}
                    onChange={(e) => setFormScience(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    English (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="glass-input"
                    value={formEnglish}
                    onChange={(e) => setFormEnglish(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    History (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="glass-input"
                    value={formHistory}
                    onChange={(e) => setFormHistory(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  Computer Science (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  className="glass-input"
                  value={formCS}
                  onChange={(e) => setFormCS(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, background: 'var(--gradient-emerald)' }}
                >
                  <Save size={16} /> Save Scores
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
