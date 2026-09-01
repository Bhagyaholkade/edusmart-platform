import { useState, useRef, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { 
  LogIn, 
  KeyRound, 
  Mail, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Brain, 
  BookOpen, 
  Award,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  UserCheck,
  Shield,
  GraduationCap,
  User,
  Check,
  X,
  Send
} from 'lucide-react';

export default function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('teacher@school.edu');
  const [password, setPassword] = useState('teacher123');
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const dropdownRef = useRef(null);

  const demoRoles = [
    { id: 'platform_admin', label: 'Platform Admin', email: 'admin@platform.edusmart.ai', pass: 'admin123', icon: Shield, color: '#a855f7' },
    { id: 'school_admin', label: 'Principal', email: 'principal@school.edu', pass: 'principal123', icon: GraduationCap, color: '#38bdf8' },
    { id: 'teacher', label: 'Teacher', email: 'teacher@school.edu', pass: 'teacher123', icon: BookOpen, color: '#6366f1' },
    { id: 'student', label: 'Student', email: 'student@school.edu', pass: 'student123', icon: User, color: '#e4e4e7' }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (roleObj) => {
    setSelectedRole(roleObj.id);
    setEmail(roleObj.email);
    setPassword(roleObj.pass);
    setError('');
    setIsDropdownOpen(false);
  };

  const handleOpenForgotModal = () => {
    setResetEmail(email || 'teacher@school.edu');
    setResetSuccess('');
    setShowForgotModal(true);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetSuccess('');

    setTimeout(() => {
      setResetLoading(false);
      setResetSuccess(`A secure reset link & AI OTP token have been dispatched to ${resetEmail}`);
    }, 900);
  };

  const currentRoleObj = demoRoles.find(r => r.id === selectedRole) || demoRoles[2];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      const userData = {
        id: response.user_id,
        email: email,
        name: email.split('@')[0],
        role: response.role,
        schoolId: 'school_123',
        status: 'active',
        subjectsTaught: ['Mathematics'],
        assignedClasses: ['Grade 10-A (Mathematics)'],
        schoolName: 'Oakridge AI Academy'
      };

      // In a real app we'd store the token
      localStorage.setItem('token', response.access_token);

      setSuccess('Authentication successful! Directing to portal...');
      setTimeout(() => {
        onLoginSuccess(userData);
      }, 500);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#030712',
      color: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Ambient Radial Lighting Effects */}
      <div className="cyber-grid-bg" />
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '15%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        animation: 'pulseGlow 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        animation: 'pulseGlow 10s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '40%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Bar */}
      <header style={{
        padding: '1.25rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
          }}>
            <Brain size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.3px', color: '#ffffff' }}>
              EduSmart<span style={{ color: '#38bdf8' }}>.AI</span>
            </div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 600 }}>Intelligence Platform v2.4</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.8rem',
            borderRadius: '9999px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            fontSize: '0.775rem',
            color: '#4ade80',
            fontWeight: 600
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            Systems Operational
          </div>

          <button
            onClick={() => onNavigate('register')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            Request Access <ChevronRight size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Hero Wrapper */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 2.5rem',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 480px',
          gap: '4rem',
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Left Hero Content & Interactive Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                fontSize: '0.8rem',
                color: '#c084fc',
                fontWeight: 700,
                letterSpacing: '0.5px',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={14} color="#c084fc" />
                NEXT-GEN EDUCATIONAL AI ENGINE
              </div>

              <h1 style={{
                fontSize: '3.25rem',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-1px',
                marginBottom: '1.25rem'
              }}>
                Empowering Schools with{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Ambient AI
                </span> Intelligence
              </h1>

              <p style={{
                fontSize: '1.075rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                maxWidth: '580px'
              }}>
                Unified platform integrating RAG-grounded curriculum assistance, real-time student analytics, automated grading, and personalized AI tutoring.
              </p>
            </div>

            {/* Feature Cards Showcase */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem'
            }}>
              <CyberFeatureCard 
                icon={Brain}
                color="#6366f1"
                title="AI Tutor & Copilot"
                desc="Voice & text conversational learning powered by RAG"
              />
              <CyberFeatureCard 
                icon={Zap}
                color="#06b6d4"
                title="Real-time Analytics"
                desc="Instant class performance tracking & student insights"
              />
              <CyberFeatureCard 
                icon={BookOpen}
                color="#a855f7"
                title="Curriculum Grounding"
                desc="DokGuru AI mapped directly to official syllabi"
              />
              <CyberFeatureCard 
                icon={Award}
                color="#34d399"
                title="Auto Assessment"
                desc="Intelligent automated grading with actionable feedback"
              />
            </div>

            {/* Live Stats Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>99.4%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>RAG Accuracy</div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>100K+</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Evaluated Assignments</div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>4.9/5</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Educator Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Redesigned Auth Card */}
          <div className="cyber-glowing-card" style={{ padding: '2.5rem 2.25rem' }}>
            {/* Custom Sleek Dark Glass Role Selector Dropdown */}
            <div ref={dropdownRef} style={{ marginBottom: '1.75rem', position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.65rem'
              }}>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quick Demo Role Select
                </span>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <UserCheck size={13} /> 1-Click Auto Fill
                </span>
              </div>

              {/* Custom Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem',
                  borderRadius: '14px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: isDropdownOpen ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: isDropdownOpen ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {currentRoleObj && (
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: `${currentRoleObj.color}20`,
                      border: `1px solid ${currentRoleObj.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <currentRoleObj.icon size={18} color={currentRoleObj.color} />
                    </div>
                  )}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                      {currentRoleObj?.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {currentRoleObj?.email}
                    </div>
                  </div>
                </div>

                <ChevronDown 
                  size={18} 
                  color="#94a3b8" 
                  style={{
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} 
                />
              </button>

              {/* Animated Floating Dark Glass Options Menu */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  background: 'rgba(15, 23, 42, 0.96)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '16px',
                  padding: '0.5rem',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  {demoRoles.map((role) => {
                    const RoleIcon = role.icon;
                    const isSelected = selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                          background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: `${role.color}20`,
                            border: `1px solid ${role.color}35`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <RoleIcon size={16} color={role.color} />
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                              {role.label}
                            </div>
                            <div style={{ fontSize: '0.735rem', color: '#94a3b8' }}>
                              {role.email}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Check size={14} color="#ffffff" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Header Text */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', marginBottom: '0.35rem' }}>
                Sign In
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                Enter credentials or pick a role above to launch portal
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {success && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#4ade80',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    className="glass-input"
                    style={{
                      paddingLeft: '2.8rem',
                      height: '46px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    placeholder="name@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenForgotModal}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="glass-input"
                    style={{
                      paddingLeft: '2.8rem',
                      paddingRight: '2.8rem',
                      height: '46px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s ease',
                  marginTop: '0.5rem'
                }}
              >
                {loading ? 'Authenticating Engine...' : (
                  <>
                    <LogIn size={18} /> Access Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Access Request Footer */}
            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#94a3b8'
            }}>
              Don't have an institution account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Popup Modal Overlay */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="cyber-glowing-card" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '2.25rem',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.25)'
          }}>
            {/* Close X Button */}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={16} />
            </button>

            {/* Header Icon */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
            }}>
              <KeyRound size={26} color="#38bdf8" />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', marginBottom: '0.4rem' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Enter your registered institutional email. We will send an AI security OTP and reset link to your inbox.
            </p>

            {/* Success Banner */}
            {resetSuccess ? (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem'
                }}>
                  <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>{resetSuccess}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                    Institutional Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input
                      type="email"
                      required
                      className="glass-input"
                      style={{
                        paddingLeft: '2.8rem',
                        height: '46px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                      placeholder="name@school.edu"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{
                      flex: 1,
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    style={{
                      flex: 1.5,
                      height: '46px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: resetLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 20px rgba(56, 189, 248, 0.35)'
                    }}
                  >
                    {resetLoading ? 'Dispatching...' : (
                      <>
                        <Send size={16} /> Send Reset Link
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        padding: '1rem 2.5rem',
        textAlign: 'center',
        fontSize: '0.775rem',
        color: '#475569',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        position: 'relative',
        zIndex: 10
      }}>
        © 2026 EduSmart Platform. All rights reserved. Secured with DokGuru AI Encryption & Enterprise Access Controls.
      </footer>
    </div>
  );
}

function CyberFeatureCard({ icon: Icon, color, title, desc }) {
  return (
    <div style={{
      padding: '1.25rem',
      borderRadius: '16px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${color}18`,
        border: `1px solid ${color}35`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '0.775rem', color: '#94a3b8', lineHeight: 1.4 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}
