import React, { useState } from 'react';
import { 
  UserPlus, 
  Sparkles, 
  ArrowLeft, 
  Building2, 
  Mail, 
  User, 
  ShieldCheck, 
  Brain, 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  Lock,
  ChevronRight,
  School
} from 'lucide-react';
import { authAPI } from '../../services/api';

export default function Register({ onLoginSuccess, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [role, setRole] = useState('School Administrator');
  const [studentCount, setStudentCount] = useState('500 - 2,000');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.register({
        email,
        password,
        name,
        school,
        role
      });
      
      localStorage.setItem('token', response.access_token);
      
      const userData = {
        id: response.user_id,
        email: email,
        name: name,
        role: response.role || role,
        schoolName: school,
      };

      setSubmitted(true);
      setTimeout(() => {
        onLoginSuccess(userData);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed');
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
      {/* Unique Ambient Lighting & Grid */}
      <div className="cyber-grid-bg" />
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        animation: 'pulseGlow 9s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '10%',
        width: '480px',
        height: '480px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
        filter: 'blur(75px)',
        pointerEvents: 'none',
        animation: 'pulseGlow 11s ease-in-out infinite reverse'
      }} />

      {/* Top Header */}
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
            background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Brain size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.3px', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EduSmart<span style={{ color: '#34d399' }}>.AI</span>
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>Institutional Portal Registration</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.775rem',
            color: '#94a3b8',
            fontWeight: 600
          }}>
            <Lock size={13} color="#34d399" /> 256-Bit Encrypted Onboarding
          </div>

          <button
            onClick={() => onNavigate('login')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Sign In Instead
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 520px',
          gap: '4rem',
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Left Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.8rem',
                color: '#34d399',
                fontWeight: 700,
                letterSpacing: '0.5px',
                marginBottom: '1.25rem'
              }}>
                <GraduationCap size={15} color="#34d399" />
                ENTERPRISE ACADEMIC PROVISIONING
              </div>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-1px',
                marginBottom: '1.25rem'
              }}>
                Deploy AI Intelligence Across Your{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #38bdf8 50%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Entire Campus
                </span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                maxWidth: '560px'
              }}>
                Equip your faculty and students with grounded AI tutors, automated performance assessment, and instant RAG knowledge access tailored to your institution.
              </p>
            </div>

            {/* Steps Visualizer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.07)'
            }}>
              <StepBadge step="1" title="Request Access" active={!submitted} />
              <div style={{ flex: 1, height: '2px', background: 'rgba(255, 255, 255, 0.08)' }} />
              <StepBadge step="2" title="Domain Verification" active={submitted} />
              <div style={{ flex: 1, height: '2px', background: 'rgba(255, 255, 255, 0.08)' }} />
              <StepBadge step="3" title="Campus Portal Active" active={false} />
            </div>

            {/* Institutional Benefits List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <BenefitRow title="Dedicated School RAG Grounding" desc="Upload textbooks and syllabi for zero-hallucination AI responses" />
              <BenefitRow title="Multi-Tiered Access Controls" desc="Separate administrative controls for Principals, Teachers, and Students" />
              <BenefitRow title="LMS & Gradebook Integration" desc="Sync marks, attendance, and student performance automatically" />
            </div>
          </div>

          {/* Right Form Card */}
          <div className="cyber-glowing-card" style={{ padding: '2.5rem 2.25rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
                }}>
                  <ShieldCheck size={38} />
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem' }}>
                  Institutional Application Received!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Thank you, <strong style={{ color: '#fff' }}>{name || 'Educator'}</strong>. Our EdTech Deployment team is verifying <strong style={{ color: '#38bdf8' }}>{school || 'your institution'}</strong> and will send your master admin key to <strong style={{ color: '#4ade80' }}>{email}</strong> within 24 hours.
                </p>

                <button
                  onClick={() => onNavigate('login')}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Return to Sign In Portal
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', marginBottom: '0.35rem' }}>
                    Request Platform Access
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    Join 400+ leading institutions using EduSmart AI
                  </p>
                </div>
                {error && (
                  <div style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.12)', padding: '0.85rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      Official Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="text"
                        required
                        className="glass-input"
                        style={{ paddingLeft: '2.8rem', height: '46px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        placeholder="Dr. Eleanor Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      Institutional Email (.edu / .ac)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="email"
                        required
                        className="glass-input"
                        style={{ paddingLeft: '2.8rem', height: '46px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        placeholder="e.vance@oakridge.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      School / Institution Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <School size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="text"
                        required
                        className="glass-input"
                        style={{ paddingLeft: '2.8rem', height: '46px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        placeholder="Oakridge International School"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      Set Account Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input
                        type="password"
                        required
                        className="glass-input"
                        style={{ paddingLeft: '2.8rem', height: '46px', borderRadius: '12px', background: 'rgba(18, 20, 28, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        placeholder="Create secure password (e.g. teacher123)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      Your Role at Institution
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="glass-input"
                      style={{
                        height: '46px',
                        borderRadius: '12px',
                        background: 'rgba(18, 20, 28, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Senior Educator" style={{ background: '#12141c' }}>Senior Educator / Teacher</option>
                      <option value="School Administrator" style={{ background: '#12141c' }}>School Administrator / Principal</option>
                      <option value="Department Head" style={{ background: '#12141c' }}>Academic Department Head</option>
                      <option value="IT Director" style={{ background: '#12141c' }}>IT / EdTech Director</option>
                    </select>
                  </div>

                  {/* Assigned Class Selection for Teachers */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      Assigned Class & Subject *
                    </label>
                    <input
                      type="text"
                      required
                      className="glass-input"
                      style={{ height: '46px', borderRadius: '12px', background: 'rgba(18, 20, 28, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                      placeholder="e.g. Grade 10-A (Mathematics), Grade 12-B (Physics)"
                    />
                  </div>

                  {/* Student Capacity Pills */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      Student Body Size
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      {['< 500', '500 - 2,000', '2,000+'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setStudentCount(size)}
                          style={{
                            padding: '0.5rem',
                            borderRadius: '10px',
                            fontSize: '0.775rem',
                            fontWeight: 600,
                            border: studentCount === size ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                            background: studentCount === size ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            color: studentCount === size ? '#34d399' : '#94a3b8',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                      marginTop: '0.5rem'
                    }}
                  >
                    {loading ? 'Processing Application...' : (
                      <>
                        <UserPlus size={18} /> Submit Campus Application
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

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

function StepBadge({ step, title, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: active ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
        color: active ? '#fff' : '#64748b',
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {step}
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: active ? '#f8fafc' : '#64748b' }}>
        {title}
      </span>
    </div>
  );
}

function BenefitRow({ title, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
      <CheckCircle2 size={18} color="#34d399" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>{title}</div>
        <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{desc}</div>
      </div>
    </div>
  );
}
