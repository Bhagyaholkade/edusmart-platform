import React, { useState } from 'react';
import { Mail, Send, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { authAPI } from '../../services/api';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await authAPI.forgotPassword({ email });
      setMessage(data.message || 'Password reset link sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to request password reset');
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
        maxWidth: '440px',
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
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--gradient-cyan)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <KeyRound size={28} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            Reset Password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            Enter your teacher email address to receive a password reset link
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

        {message && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem'
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontWeight: 700 }}>Request Sent</p>
              <p style={{ marginTop: '0.2rem', opacity: 0.9 }}>{message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Your Email Address
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Sending Request...' : (
              <>
                <Send size={18} /> Send Reset Link
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
