import { useState } from 'react';
import { LogIn, KeyRound, Mail, Sparkles, AlertCircle, CheckCircle2, Zap, Brain, BookOpen, Award } from 'lucide-react';

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        user: {
          id: Date.now(),
          email: email,
          name: 'User Name',
          role: email.includes('admin@platform') ? 'platform_admin' :
                email.includes('principal') ? 'school_admin' :
                email.includes('teacher') ? 'teacher' : 'student',
          schoolId: email.includes('platform') ? null : 'school_123',
          status: 'active',
          assignedClasses: email.includes('teacher') ? ['Class-10A', 'Class-10B'] : undefined,
          schoolName: email.includes('platform') ? undefined : 'Demo High School'
        },
        token: 'mock_jwt_token'
      };

      setSuccess('Login successful!');
      setTimeout(() => {
        onLoginSuccess(mockResponse.user);
      }, 600);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    const demoCredentials = {
      platform_admin: { email: 'admin@platform.edusmart.ai', password: 'admin123' },
      school_admin: { email: 'principal@school.edu', password: 'principal123' },
      teacher: { email: 'teacher@school.edu', password: 'teacher123' },
      student: { email: 'student@school.edu', password: 'student123' }
    };
    
    const creds = demoCredentials[demoRole];
    setEmail(creds.email);
    setPassword(creds.password);
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
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)'
          }}>
            <Brain size={32} color="#ffffff" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>
            AI Learning<br />Intelligence Platform
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '1rem',
            color: 'rgba(148, 163, 184, 0.9)',
            lineHeight: 1.6,
            marginBottom: '3rem',
            maxWidth: '480px'
          }}>
            Empowering educators and students with AI-driven insights, personalized learning, and intelligent assessment tools.
          </p>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem'
          }}>
            <FeatureCard 
              icon={Sparkles}
              title="AI-Powered Tutoring"
              description="Personalized learning with voice & text"
            />
            <FeatureCard 
              icon={Zap}
              title="Smart Analytics"
              description="Real-time performance insights"
            />
            <FeatureCard 
              icon={BookOpen}
              title="Curriculum RAG"
              description="Context-aware AI responses"
            />
            <FeatureCard 
              icon={Award}
              title="Auto Assessment"
              description="Intelligent grading & feedback"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: '0 0 55%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f172a 0%, #0a0e1a 100%)',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '1rem' }}>
              Sign in to access your dashboard
            </p>
          </div>

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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
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

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.9)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(100, 116, 139, 0.8)' }} />
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
              style={{ width: '100%', padding: '0.95rem', marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', marginBottom: '0.875rem', textAlign: 'center', fontWeight: 600 }}>
              Quick Demo Access
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('platform_admin')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.7rem', fontWeight: 600 }}
              >
                Platform Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('school_admin')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.7rem', fontWeight: 600 }}
              >
                Principal
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('teacher')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.7rem', fontWeight: 600 }}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.7rem', fontWeight: 600 }}
              >
                Student
              </button>
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(148, 163, 184, 0.8)', marginTop: '1.5rem' }}>
              Need an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}
              >
                Request Access
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <Icon size={20} color="#38bdf8" strokeWidth={2.5} style={{ marginBottom: '0.5rem' }} />
      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.8)', lineHeight: 1.4 }}>
        {description}
      </p>
    </div>
  );
}
