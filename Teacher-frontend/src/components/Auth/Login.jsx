import React, { useState } from 'react';
import { LogIn, KeyRound, Mail, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authAPI } from '../../services/api';

export default function Login({ onLoginSuccess, onNavigate }) {
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
      const data = await authAPI.login({ email, password });
      setSuccess(data.message || 'Login successful!');
      setTimeout(() => {
        onLoginSuccess(data.user || { email, user_metadata: { full_name: 'Teacher' } });
      }, 600);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('teacher@edusmart.edu');
    setPassword('teacher123');
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
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.2)'
      }}>
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--gradient-brand)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            EduSmart Teacher Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Sign in to access Biometric Attendance & Exam Gradebook
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Teacher Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="email"
                required
                className="glass-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="teacher@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
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
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} /> Sign In to Portal
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.825rem', padding: '0.6rem' }}
          >
            <ShieldCheck size={16} color="var(--accent-cyan)" /> Autofill Demo Credentials
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            Don't have a teacher account?{' '}
            <button
              onClick={() => onNavigate('register')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
