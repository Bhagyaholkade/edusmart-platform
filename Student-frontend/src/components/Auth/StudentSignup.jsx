import React, { useState } from 'react';
import { Sparkles, User, Lock, Building2, BookOpen, ArrowRight, AlertCircle, Mail, Hash } from 'lucide-react';
import { studentAuthAPI } from '../../services/api';

export default function StudentSignup({ onSignupSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('St. Xavier High School');
  const [className, setClassName] = useState('Grade 10-A (Mathematics)');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rollNumber || !schoolName) {
      setError('Please fill in all required student details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await studentAuthAPI.signup({
        name,
        rollNumber,
        email,
        schoolName,
        className,
        password
      });

      if (res.student) {
        onSignupSuccess(res.student);
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <Sparkles size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Register Student Profile
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Link your school & roll number for instant attendance tracking
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Student Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
              <input
                type="text"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Roll Number
              </label>
              <div style={{ position: 'relative' }}>
                <Hash size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
                <input
                  type="text"
                  required
                  className="glass-input"
                  style={{ paddingLeft: '2.3rem', fontWeight: 700 }}
                  placeholder="e.g. 1008"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Assigned Class
              </label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
                <input
                  type="text"
                  required
                  className="glass-input"
                  style={{ paddingLeft: '2.3rem' }}
                  placeholder="Grade 10-A"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
              <input
                type="email"
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="alex@student.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Create Password
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
            {loading ? 'Creating Student Account...' : 'Complete Student Registration'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: 700, cursor: 'pointer' }}
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
