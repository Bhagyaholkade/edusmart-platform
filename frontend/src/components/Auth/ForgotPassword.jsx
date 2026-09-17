import { useState } from 'react';
import logoImg from '../../images/logo-img.png';
import { Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ForgotPassword({ onNavigate }) {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('OTP sent to your email!');
      setTimeout(() => {
        setStep('otp');
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('OTP verified!');
      setTimeout(() => {
        setStep('reset');
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: '#0a0e1a'
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <img 
            src={logoImg} 
            alt="EduSmart Logo" 
            style={{
              height: '52px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }} 
          />

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '1rem'
          }}>
            {step === 'email' && 'Reset Your Password'}
            {step === 'otp' && 'Verify Your Identity'}
            {step === 'reset' && 'Create New Password'}
          </h1>

          <p style={{
            fontSize: '1rem',
            color: 'rgba(148, 163, 184, 0.9)',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}>
            {step === 'email' && "Don't worry! Enter your email address and we'll send you a verification code to reset your password."}
            {step === 'otp' && "We've sent a 6-digit verification code to your email. Please enter it below to continue."}
            {step === 'reset' && 'Please enter your new password. Make sure it\'s at least 8 characters long and secure.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <StepIndicator active={step === 'email'} completed={step !== 'email'} label="Enter Email" number="1" />
            <StepIndicator active={step === 'otp'} completed={step === 'reset'} label="Verify OTP" number="2" />
            <StepIndicator active={step === 'reset'} completed={false} label="Reset Password" number="3" />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: '0 0 55%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f172a 0%, #0a0e1a 100%)',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <button
            onClick={() => onNavigate('login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(148, 163, 184, 0.9)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem'
            }}
          >
            <ArrowLeft size={18} /> Back to Login
          </button>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '0.875rem 1rem',
              borderRadius: '10px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
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
              padding: '0.875rem 1rem',
              borderRadius: '10px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOTP}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(100, 116, 139, 0.8)' }} />
                  <input
                    type="email"
                    required
                    className="glass-input"
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="your.email@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.9)', marginBottom: '1rem', textAlign: 'center' }}>
                  Enter 6-Digit Code
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="glass-input"
                      style={{
                        width: '56px',
                        height: '56px',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        padding: 0
                      }}
                    />
                  ))}
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.7)', marginTop: '1rem' }}>
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Resend
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.5rem' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(100, 116, 139, 0.8)' }} />
                    <input
                      type="password"
                      required
                      className="glass-input"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.9)', marginBottom: '0.5rem' }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(100, 116, 139, 0.8)' }} />
                    <input
                      type="password"
                      required
                      className="glass-input"
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ active, completed, label, number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: completed ? 'var(--accent-emerald)' : active ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
        border: active && !completed ? '2px solid var(--accent-primary)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: '#fff',
        fontSize: '0.9rem',
        transition: 'all 0.3s'
      }}>
        {completed ? <CheckCircle2 size={20} /> : number}
      </div>
      <span style={{
        fontSize: '0.95rem',
        fontWeight: 600,
        color: active || completed ? '#fff' : 'rgba(148, 163, 184, 0.6)'
      }}>
        {label}
      </span>
    </div>
  );
}
