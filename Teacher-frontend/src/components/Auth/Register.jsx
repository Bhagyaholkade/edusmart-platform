import React, { useState } from 'react';
import { UserPlus, Mail, KeyRound, User, Building2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../services/api';

export default function Register({ onLoginSuccess, onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await authAPI.register({ fullName, schoolName, email, password });
      setSuccess('Account created successfully!');
      setTimeout(() => {
        onLoginSuccess(data.user || { email, user_metadata: { full_name: fullName, school_name: schoolName } });
      }, 700);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #090d16 80%)'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.2)'
      }}>
        <button
          type="button"
          onClick={() => onNavigate('login')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            Register Teacher Profile
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
            Create your account to start managing class biometric attendance
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="text"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Dr. Sarah Connor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              School / Institution Name
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="text"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="St. Jude International School"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="email"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="sarah.c@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="password"
                required
                minLength={6}
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={18} /> Complete Registration
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
