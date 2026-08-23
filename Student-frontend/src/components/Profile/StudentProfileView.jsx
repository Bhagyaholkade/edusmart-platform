import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { User, Building2, BookOpen, Mail, Phone, Lock, Edit3, CheckCircle2, Save, X } from 'lucide-react';

export default function StudentProfileView({ student, onUpdateStudentName }) {
  const studentName = student.name || 'Bhagya Kumar';
  const nameParts = studentName.trim().split(' ');
  const initialFirstName = nameParts[0] || 'Bhagya';
  const initialLastName = nameParts.slice(1).join(' ') || 'Kumar';

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [successMsg, setSuccessMsg] = useState('');

  const parentName = student.parentName || (student.rollNumber === '1010' || initialFirstName.toLowerCase() === 'bhagya' ? 'Suresh Kumar' : `${initialFirstName}'s Guardian`);
  const parentPhone = student.parentPhone || '+919019395288';
  const parentEmail = student.parentEmail || (student.rollNumber === '1010' || initialFirstName.toLowerCase() === 'bhagya' ? 'suresh.k@gmail.com' : `${initialFirstName.toLowerCase()}.parent@gmail.com`);
  const emergencyContact = student.emergencyContact || student.parentPhone || '+919019395288';
  const bloodGroup = student.bloodGroup || (student.rollNumber === '1010' ? 'B+' : 'O+');

  const handleSaveName = (e) => {
    if (e) e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    if (!cleanFirst) return;

    const newFullName = cleanLast ? `${cleanFirst} ${cleanLast}` : cleanFirst;
    
    if (onUpdateStudentName) {
      onUpdateStudentName(newFullName);
    }

    setSuccessMsg('✅ Name updated successfully!');
    setIsEditingInline(false);
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowEditModal(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.7rem',
              color: '#fff',
              boxShadow: '0 6px 20px rgba(6, 182, 212, 0.4)',
              flexShrink: 0
            }}>
              {studentName.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {studentName}
                </h2>
                <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                  Roll #{student.rollNumber || '1010'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Enrolled Student • {student.className || 'Grade 10-A (Mathematics)'} • {student.schoolName || 'St. Xavier High School'}
              </p>
            </div>
          </div>

          {/* Quick Edit Name Button (First & Last Name Only) */}
          <button
            onClick={() => {
              setFirstName(initialFirstName);
              setLastName(initialLastName);
              setSuccessMsg('');
              setIsEditingInline(!isEditingInline);
              setShowEditModal(true);
            }}
            className="btn-primary"
            style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
          >
            <Edit3 size={15} /> Edit Name
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          fontSize: '0.88rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {/* Grid of Profile Details Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Personal & Academic Profile */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={18} color="var(--accent-cyan)" /> Personal & Academic Record
            </h4>
            
            <button
              onClick={() => {
                setFirstName(initialFirstName);
                setLastName(initialLastName);
                setIsEditingInline(!isEditingInline);
              }}
              style={{
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                color: 'var(--accent-cyan)',
                borderRadius: '8px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Edit3 size={13} /> {isEditingInline ? 'Cancel Edit' : 'Edit Name Only'}
            </button>
          </div>

          {/* Inline Edit Form for First & Last Name */}
          {isEditingInline ? (
            <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'rgba(6, 182, 212, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                ✏️ Edit Student First Name & Last Name:
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>First Name</label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>Last Name</label>
                  <input
                    type="text"
                    className="glass-input"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem' }}
                >
                  <Save size={14} /> Save Name Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingInline(false)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.8rem', fontSize: '0.82rem' }}
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Student Name:</span>
                <strong style={{ color: '#fff' }}>{studentName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Roll Number (Locked 🔒):</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>#{student.rollNumber || '1010'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Enrolled Institution (Locked 🔒):</span>
                <strong style={{ color: '#fff' }}>{student.schoolName || 'St. Xavier High School'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Grade/Class (Locked 🔒):</span>
                <strong style={{ color: '#fff' }}>{student.className || 'Grade 10-A (Mathematics)'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Student Email:</span>
                <strong style={{ color: '#38bdf8' }}>{student.email || `${initialFirstName.toLowerCase()}@student.edu`}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
                <strong style={{ color: '#fb7185' }}>{bloodGroup}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Parent & Emergency Contacts */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={18} color="#34d399" /> Parent & Emergency Contact Details (Locked 🔒)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Parent / Guardian:</span>
              <strong style={{ color: '#fff' }}>{parentName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Parent Mobile Phone:</span>
              <strong style={{ color: '#34d399' }}>{parentPhone}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Parent Email Address:</span>
              <strong style={{ color: '#38bdf8' }}>{parentEmail}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Emergency Helpline:</span>
              <strong style={{ color: '#fbbf24' }}>{emergencyContact}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Name Modal (First & Last Name Only) */}
      {showEditModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-panel">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              Edit Student Profile Name
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Students can only modify their <strong style={{ color: '#fff' }}>First Name & Last Name</strong>.
            </p>

            {successMsg && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={18} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Security Restricted Locked Info Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.78rem'
              }}>
                <div style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={14} /> Locked Institution Record Fields:
                </div>
                <div style={{ color: 'var(--text-muted)' }}>• Roll Number: #{student.rollNumber || '1010'}</div>
                <div style={{ color: 'var(--text-muted)' }}>• Institution: {student.schoolName || 'St. Xavier High School'}</div>
                <div style={{ color: 'var(--text-muted)' }}>• Parent Phone: {parentPhone}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                  Note: Roll number, institution, and parent contact details are locked and managed exclusively by school administration.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Name
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
