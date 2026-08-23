import React, { useState } from 'react';
import { Sparkles, Shield, User, Lock, Building2, ArrowRight, AlertCircle } from 'lucide-react';
import { studentAuthAPI } from '../../services/api';

export default function StudentLogin({ onLoginSuccess, onSwitchToSignup }) {
  const [schoolName, setSchoolName] = useState('St. Xavier High School');
  const [rollNumber, setRollNumber] = useState('1001');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schoolName || !rollNumber) {
      setError('Please provide school name and roll number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await studentAuthAPI.login(schoolName, rollNumber, password);
      if (res.student) {
        onLoginSuccess(res.student);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify school name and roll number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.25rem' }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)'
          }}>
            <Sparkles size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            Student Portal Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Check your daily biometric attendance rate & grades
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              School / Institution Name
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
              <input
                type="text"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem', fontWeight: 600 }}
                placeholder="e.g. St. Xavier High School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Student Roll Number or Email
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
              <input
                type="text"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}
                placeholder="e.g. 1001 or alex.johnson@student.edu"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Account Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
              <input
                type="password"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Validating School Enrollment...' : 'Login to Student Portal'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            New student at this school?{' '}
            <button
              onClick={onSwitchToSignup}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 700, cursor: 'pointer' }}
            >
              Register Student Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
