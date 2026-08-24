import React, { useState } from 'react';
import { Award, TrendingUp, BookOpen, Target, Edit, Save, CheckCircle2, X, Calculator } from 'lucide-react';

export default function MarksView({ role, user, showToast }) {
  if (role === 'teacher' || role === 'school_admin' || role === 'platform_admin') {
    return <TeacherMarksEntry showToast={showToast} />;
  }

  return <StudentGradebook user={user} />;
}

function TeacherMarksEntry({ showToast }) {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alex Johnson', rollNumber: '1001', midterm: 85, final: 88, assignment: 90, total: 87.7 },
    { id: 2, name: 'Sarah Williams', rollNumber: '1002', midterm: 92, final: 95, assignment: 88, total: 91.7 },
    { id: 3, name: 'Michael Brown', rollNumber: '1003', midterm: 78, final: 82, assignment: 85, total: 81.7 },
    { id: 4, name: 'Emily Davis', rollNumber: '1004', midterm: 88, final: 90, assignment: 92, total: 90.0 },
    { id: 5, name: 'James Wilson', rollNumber: '1005', midterm: 75, final: 80, assignment: 78, total: 77.7 },
  ]);

  const [selectedExam, setSelectedExam] = useState('midterm');
  const [editingStudent, setEditingStudent] = useState(null);

  // Form state for modal editing
  const [editMidterm, setEditMidterm] = useState(85);
  const [editFinal, setEditFinal] = useState(88);
  const [editAssignment, setEditAssignment] = useState(90);

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditMidterm(student.midterm);
    setEditFinal(student.final);
    setEditAssignment(student.assignment);
  };

  const handleScoreChange = (id, field, value) => {
    const numVal = Math.min(100, Math.max(0, parseFloat(value) || 0));
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: numVal };
        const newTotal = parseFloat(((updated.midterm * 0.35) + (updated.final * 0.45) + (updated.assignment * 0.20)).toFixed(1));
        return { ...updated, total: newTotal };
      }
      return s;
    }));
  };

  const handleSaveModalMarks = () => {
    if (!editingStudent) return;
    const newTotal = parseFloat(((editMidterm * 0.35) + (editFinal * 0.45) + (editAssignment * 0.20)).toFixed(1));

    setStudents(prev => prev.map(s => {
      if (s.id === editingStudent.id) {
        return {
          ...s,
          midterm: editMidterm,
          final: editFinal,
          assignment: editAssignment,
          total: newTotal
        };
      }
      return s;
    }));

    setEditingStudent(null);
    if (showToast) {
      showToast(`Marks updated for ${editingStudent.name}!`, 'success');
    }
  };

  const handleSaveAllChanges = () => {
    if (showToast) {
      showToast('All examination scores saved to database!', 'success');
    }
  };

  const calculateGrade = (total) => {
    if (total >= 90) return { grade: 'A', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)' };
    if (total >= 80) return { grade: 'B', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)' };
    if (total >= 70) return { grade: 'C', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' };
    return { grade: 'F', color: '#f87171', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' };
  };

  const classAvg = (students.reduce((acc, s) => acc + s.total, 0) / students.length).toFixed(1);
  const maxScore = Math.max(...students.map(s => s.total));
  const minScore = Math.min(...students.map(s => s.total));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
          Exam Marks Entry & Gradebook
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Enter, calculate, and manage student examination scores
        </p>
      </div>

      {/* Class Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard label="Class Average" value={`${classAvg}%`} color="#38bdf8" />
        <StatCard label="Highest Score" value={`${maxScore}%`} color="#4ade80" />
        <StatCard label="Lowest Score" value={`${minScore}%`} color="#fbbf24" />
        <StatCard label="Total Enrolled" value={students.length} color="#a855f7" />
      </div>

      {/* Exam Selector */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Select Examination:
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="glass-input"
            style={{ width: '200px', padding: '0.6rem 1rem' }}
          >
            <option value="midterm">Midterm Exam (2026)</option>
            <option value="final">Final Term (2026)</option>
            <option value="assignment">Continuous Assessment</option>
          </select>
          <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={handleSaveAllChanges}>
            <Save size={16} /> Save All Changes
          </button>
        </div>

        {/* Marks Entry Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Roll No</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Student Name</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Midterm (35%)</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Final (45%)</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Assignment (20%)</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total %</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Grade</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const gradeObj = calculateGrade(student.total);
                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>{student.rollNumber}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{student.name}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={student.midterm}
                        onChange={(e) => handleScoreChange(student.id, 'midterm', e.target.value)}
                        className="glass-input"
                        style={{ width: '70px', padding: '0.4rem', textAlign: 'center', fontWeight: 700 }}
                        min="0"
                        max="100"
                      />
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={student.final}
                        onChange={(e) => handleScoreChange(student.id, 'final', e.target.value)}
                        className="glass-input"
                        style={{ width: '70px', padding: '0.4rem', textAlign: 'center', fontWeight: 700 }}
                        min="0"
                        max="100"
                      />
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={student.assignment}
                        onChange={(e) => handleScoreChange(student.id, 'assignment', e.target.value)}
                        className="glass-input"
                        style={{ width: '70px', padding: '0.4rem', textAlign: 'center', fontWeight: 700 }}
                        min="0"
                        max="100"
                      />
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                      {student.total}%
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span className="badge" style={{
                        background: gradeObj.bg,
                        color: gradeObj.color,
                        border: `1px solid ${gradeObj.border}`
                      }}>
                        {gradeObj.grade}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => openEditModal(student)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Marks Modal */}
      {editingStudent && (
        <Modal onClose={() => setEditingStudent(null)} title={`Edit Scores: ${editingStudent.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Midterm Score (Out of 100)
              </label>
              <input 
                type="number" 
                className="glass-input" 
                value={editMidterm} 
                onChange={(e) => setEditMidterm(parseFloat(e.target.value) || 0)}
                min="0" 
                max="100" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Final Exam Score (Out of 100)
              </label>
              <input 
                type="number" 
                className="glass-input" 
                value={editFinal} 
                onChange={(e) => setEditFinal(parseFloat(e.target.value) || 0)}
                min="0" 
                max="100" 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Assignment Score (Out of 100)
              </label>
              <input 
                type="number" 
                className="glass-input" 
                value={editAssignment} 
                onChange={(e) => setEditAssignment(parseFloat(e.target.value) || 0)}
                min="0" 
                max="100" 
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditingStudent(null)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleSaveModalMarks}>
                Save Scores
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StudentGradebook({ user }) {
  const subjects = [
    { name: 'Mathematics', midterm: 85, final: 88, assignment: 90, total: 87.7, grade: 'B+' },
    { name: 'Physics', midterm: 82, final: 85, assignment: 88, total: 85.0, grade: 'B+' },
    { name: 'Chemistry', midterm: 78, final: 80, assignment: 85, total: 81.0, grade: 'B' },
    { name: 'English', midterm: 90, final: 92, assignment: 95, total: 92.3, grade: 'A' },
    { name: 'History', midterm: 88, final: 90, assignment: 92, total: 90.0, grade: 'A-' },
  ];

  const overallAverage = (subjects.reduce((acc, s) => acc + s.total, 0) / subjects.length).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
          My Gradebook
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          View your exam scores and academic performance
        </p>
      </div>

      {/* Overall Performance */}
      <div className="glass-panel" style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              {overallAverage}%
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Overall Average
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4ade80', marginBottom: '0.5rem' }}>
              B+
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Overall Grade
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
              #12
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Class Rank
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Grades */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="var(--accent-cyan)" />
          Subject-wise Performance
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {subjects.map((subject, index) => (
            <div key={index} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                    {subject.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total Score: {subject.total}%
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>
                    {subject.grade}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <TrendingUp size={14} color="#4ade80" />
                    <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>
                      Good Progress
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <ScoreBox label="Midterm" score={`${subject.midterm}%`} />
                <ScoreBox label="Final" score={`${subject.final}%`} />
                <ScoreBox label="Assignment" score={`${subject.assignment}%`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: color, marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

function ScoreBox({ label, score }) {
  return (
    <div style={{
      padding: '0.75rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 'var(--radius-sm)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
        {score}
      </div>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
