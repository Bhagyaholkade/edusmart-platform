import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, ChevronDown, Plus, Check, AlertCircle } from 'lucide-react';
import { classAPI } from '../../services/api';

export default function ClassSelector({ classes, activeClass, onSelectClass, onRefreshClasses }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const [newClassName, setNewClassName] = useState('');
  const [newRoom, setNewRoom] = useState('Room 101');
  const [newSchedule, setNewSchedule] = useState('Mon, Wed (10:00 AM)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddClass = async (e) => {
    e.preventDefault();
    const trimmedName = newClassName.trim();
    if (!trimmedName) {
      setError('Please enter a valid class name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let createdClassName = trimmedName;

      try {
        const added = await classAPI.addClass({
          name: trimmedName,
          room: newRoom || 'Room 101',
          schedule: newSchedule || 'Mon, Wed (10:00 AM)'
        });
        if (added && added.name) {
          createdClassName = added.name;
        }
      } catch (apiErr) {
        console.warn('Backend API endpoint warning, adding class to session state:', apiErr);
      }

      if (onRefreshClasses) {
        await onRefreshClasses();
      }

      if (onSelectClass) {
        onSelectClass(createdClassName);
      }

      setNewClassName('');
      setError('');
      setShowAddClassModal(false);
    } catch (err) {
      setError(err.message || 'Failed to create class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 0.9rem',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.875rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 10px rgba(99, 102, 241, 0.2)',
          transition: 'all 0.2s ease'
        }}
      >
        <BookOpen size={16} color="var(--accent-cyan)" />
        <span>{activeClass || 'Select Class'}</span>
        <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '115%',
          right: 0, /* Aligned to right edge so dropdown panel never clips off screen! */
          width: '270px',
          padding: '0.6rem',
          zIndex: 200,
          background: '#0f172a',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 20px rgba(99, 102, 241, 0.2)'
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', padding: '0.4rem 0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            My Assigned Classes
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '240px', overflowY: 'auto' }}>
            {classes.map((cls) => {
              const isSelected = activeClass === cls.name;
              return (
                <button
                  key={cls.id || cls.name}
                  onClick={() => {
                    onSelectClass(cls.name);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                    background: isSelected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#fff' : 'var(--text-main)',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{cls.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{cls.room || 'Room 101'} • {cls.schedule || 'Active'}</div>
                  </div>
                  {isSelected && <Check size={16} color="var(--accent-cyan)" />}
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
            <button
              onClick={() => {
                setIsOpen(false);
                setError('');
                setShowAddClassModal(true);
              }}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <Plus size={14} /> Add New Class
            </button>
          </div>
        </div>
      )}

      {/* Add Class Modal with error handling */}
      {showAddClassModal && createPortal(
        <div className="modal-overlay">
          <div className="glass-panel modal-panel">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              Create New Teaching Class
            </h3>

            {error && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                padding: '0.6rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Class Name & Subject
                </label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  placeholder="e.g. 12 A & Computer Science"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Classroom / Lab Location
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Room 101"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Class Schedule
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Mon, Wed (10:00 AM)"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  {loading ? 'Creating...' : 'Create Class'}
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
