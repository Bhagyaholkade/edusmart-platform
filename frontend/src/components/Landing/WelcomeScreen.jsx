import React, { useState } from 'react';
import logoImg from '../../images/logo-img.png';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Star, 
  Target, 
  Lightbulb, 
  MessageSquare, 
  BarChart3, 
  Globe, 
  Activity, 
  Cpu, 
  Database, 
  Check, 
  Layers, 
  GraduationCap, 
  Mic,
  Bot,
  Lock
} from 'lucide-react';

export default function WelcomeScreen({ onGetStarted }) {
  const [activeRoleTab, setActiveRoleTab] = useState('student');

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080a0f',
      color: '#ffffff',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Cyber Grid Overlay */}
      <div className="cyber-grid-bg" style={{ position: 'fixed' }} />

      {/* Ambient Glowing Orbs */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        left: '15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, transparent 70%)',
        filter: 'blur(110px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        top: '45%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        filter: 'blur(120px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Sticky Glass Navbar */}
        <header style={{
          position: 'sticky',
          top: '1rem',
          zIndex: 50,
          background: 'rgba(12, 16, 26, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.18)',
          borderRadius: '20px',
          padding: '0.85rem 1.5rem',
          margin: '1rem 0 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src={logoImg} 
              alt="EduSmart Logo" 
              style={{
                height: '44px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '10px'
              }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                  EduSmart <span className="text-gradient-cyan">AI</span>
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  v2.4 RAG
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.925rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Features</button>
            <button onClick={() => scrollToSection('preview')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.925rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Live Preview</button>
            <button onClick={() => scrollToSection('solutions')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.925rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Solutions</button>
            <button onClick={() => scrollToSection('metrics')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.925rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Stats</button>
          </nav>

          {/* Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={onGetStarted}
              style={{
                padding: '0.65rem 1.5rem',
                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(2, 132, 199, 0.45)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(2, 132, 199, 0.65)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(2, 132, 199, 0.45)';
              }}
            >
              Sign In <ArrowRight size={16} />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '2rem 0 3.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Glowing Badge Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '50px',
            marginBottom: '1.75rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
          }}>
            <Sparkles size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.2px' }}>
              Next Generation AI Learning & Teaching Intelligence
            </span>
          </div>

          {/* Clean Impactful Main Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '1.5rem',
            color: '#ffffff',
            fontFamily: "'Outfit', 'Inter', sans-serif"
          }}>
            Transform Education with{' '}
            <span className="text-gradient-hero">
              Intelligent AI
            </span>
          </h1>

          {/* Clean Subtitle Paragraph */}
          <p style={{
            fontSize: '1.18rem',
            color: '#94a3b8',
            lineHeight: 1.7,
            maxWidth: '800px',
            margin: '0 auto 2.5rem',
            fontWeight: 400
          }}>
            Empower teachers and students with real-time learning insights, DokGuru RAG-grounded AI tutoring, automated lesson copilot, and predictive performance analytics.
          </p>

          {/* Call-To-Action Group */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button
              onClick={onGetStarted}
              style={{
                padding: '1.1rem 3rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 35px rgba(2, 132, 199, 0.45)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 45px rgba(2, 132, 199, 0.65)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 35px rgba(2, 132, 199, 0.45)';
              }}
            >
              Get Started Free <ArrowRight size={20} />
            </button>
          </div>

          {/* Key Metric Quick Bar */}
          <div id="metrics" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '1.5rem 2rem',
            background: 'rgba(14, 20, 32, 0.65)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            border: '1px solid rgba(56, 189, 248, 0.15)'
          }}>
            <MetricQuickItem number="500+" label="Schools Enrolled" icon={Globe} color="#38bdf8" />
            <MetricQuickItem number="99.4%" label="Quiz Grading Accuracy" icon={CheckCircle} color="#10b981" />
            <MetricQuickItem number="24/7" label="Voice & Text AI Tutor" icon={Bot} color="#34d399" />
            <MetricQuickItem number="12K+" label="Active Daily Students" icon={Users} color="#fbbf24" />
          </div>
        </section>

        {/* Live Interactive Platform Preview Section */}
        <section id="preview" style={{ padding: '3rem 0 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Experience EduSmart AI in Action
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
              Switch between role environments to preview context-aware AI tools tailored for every user.
            </p>
          </div>

          {/* Glass Preview Window Wrapper */}
          <div className="cyber-glowing-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
            
            {/* Top Toolbar / Role Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Window Controls & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.3px' }}>
                  EduSmart Engine Preview
                </span>
                <span style={{
                  fontSize: '0.725rem',
                  padding: '0.15rem 0.6rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 600
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> RAG Active
                </span>
              </div>

              {/* Role Switcher Pill Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.3rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  className={`role-pill-btn ${activeRoleTab === 'student' ? 'active' : ''}`}
                  onClick={() => setActiveRoleTab('student')}
                  style={activeRoleTab === 'student' ? { background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)', borderColor: '#0284c7', color: '#fff' } : {}}
                >
                  <GraduationCap size={16} /> Student Workspace
                </button>
                <button
                  className={`role-pill-btn ${activeRoleTab === 'teacher' ? 'active' : ''}`}
                  onClick={() => setActiveRoleTab('teacher')}
                  style={activeRoleTab === 'teacher' ? { background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)', borderColor: '#0284c7', color: '#fff' } : {}}
                >
                  <Cpu size={16} /> Teacher Copilot
                </button>
                <button
                  className={`role-pill-btn ${activeRoleTab === 'admin' ? 'active' : ''}`}
                  onClick={() => setActiveRoleTab('admin')}
                  style={activeRoleTab === 'admin' ? { background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)', borderColor: '#0284c7', color: '#fff' } : {}}
                >
                  <Activity size={16} /> School Admin
                </button>
              </div>
            </div>

            {/* Dynamic View Content Area */}
            {activeRoleTab === 'student' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
                {/* AI Chat Interaction Simulation */}
                <div style={{
                  background: 'rgba(12, 16, 26, 0.95)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Bot size={20} color="#38bdf8" />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>24/7 AI Tutor Assistant</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Mic size={12} /> Voice Input Ready
                    </span>
                  </div>

                  {/* Chat Bubbles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ alignSelf: 'flex-end', background: 'rgba(2, 132, 199, 0.25)', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '0.75rem 1rem', borderRadius: '16px 16px 2px 16px', maxWidth: '85%', fontSize: '0.875rem' }}>
                      Can you explain how photosynthesis works in C4 plants vs C3 plants?
                    </div>

                    <div style={{ alignSelf: 'flex-start', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '0.85rem 1.1rem', borderRadius: '16px 16px 16px 2px', maxWidth: '90%', fontSize: '0.875rem', color: '#e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem' }}>
                        <Sparkles size={14} /> DokGuru RAG Answer (Grade 10 Biology Grounded)
                      </div>
                      C4 plants minimize photorespiration by separating carbon fixation from the Calvin cycle spatially across two cell types: <strong>Mesophyll cells</strong> and <strong>Bundle Sheath cells</strong>.
                      <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.825rem' }}>
                        <li>C4 uses PEP carboxylase (high affinity for CO2)</li>
                        <li>Prevents water loss in high temperature environments</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '0.6rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Ask a question or record voice snippet...</span>
                    <button style={{ background: '#0284c7', border: 'none', borderRadius: '8px', padding: '0.35rem 0.75rem', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Ask AI</button>
                  </div>
                </div>

                {/* Right Analytics Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(12, 16, 26, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TrendingUp size={16} color="#10b981" /> Subject Mastery Breakdown
                    </h4>
                    <ProgressBar label="Mathematics (Calculus)" percent={94} color="#10b981" />
                    <ProgressBar label="Physics (Electromagnetism)" percent={88} color="#38bdf8" />
                    <ProgressBar label="Chemistry (Organic)" percent={91} color="#34d399" />
                  </div>

                  <div style={{ background: 'rgba(2, 132, 199, 0.12)', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1.1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      <Target size={16} /> Personal AI Recommendation
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      You scored 96% on your last Optics quiz! Recommended next step: Practice 5 advanced problems on Wave Interference.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'teacher' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(12, 16, 26, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={18} color="#38bdf8" /> Automated Lesson Copilot
                    </span>
                    <span style={{ fontSize: '0.725rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 600 }}>Grade 10 Physics</span>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.3rem' }}>Topic: Electromagnetic Induction & Faraday's Law</div>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      Generated 45-min lesson outline + 5 formative quiz questions aligned with state curriculum standard PHY-10.4.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Export Plan</button>
                      <button style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Generate Quiz</button>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(12, 16, 26, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Award size={18} color="#fbbf24" /> Instant Auto-Grading & Interventions
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.85rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Physics Midterm Submissions</span>
                      <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700 }}>32/32 Graded (3.4s)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.6rem 0.85rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#f87171' }}>Students Flagged for Tutoring</span>
                      <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 700 }}>2 Students (Calculus Gap)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'admin' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                <div style={{ background: 'rgba(12, 16, 26, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.3rem' }}>DokGuru Knowledge Base</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>1,240 Docs</div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Vector Index Synced & Grounded</div>
                </div>
                <div style={{ background: 'rgba(12, 16, 26, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.3rem' }}>Active Institutions</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>42 Schools</div>
                  <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>+12% vs last month</div>
                </div>
                <div style={{ background: 'rgba(12, 16, 26, 0.95)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.3rem' }}>Daily AI Queries</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>18.4k Request</div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Average latency: 240ms</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Core Platform Capabilities */}
        <section id="features" style={{ padding: '3rem 0 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Built for Modern Learning
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginTop: '0.5rem' }}>
              Everything You Need to Excel in Education
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <FeatureCard
              icon={Sparkles}
              title="24/7 AI Tutor & Voice Mode"
              description="Personalized step-by-step assistance grounded strictly in your school curriculum via DokGuru RAG."
              color="#38bdf8"
              badge="STT / TTS Enabled"
            />
            <FeatureCard
              icon={BarChart3}
              title="Predictive Learning Analytics"
              description="Identify learning gaps before exams occur with real-time class progress and risk scoring."
              color="#f43f5e"
              badge="Real-Time Data"
            />
            <FeatureCard
              icon={Cpu}
              title="Teacher AI Copilot"
              description="Instantly generate lesson plans, quizzes, and auto-grade assignments with actionable feedback."
              color="#0284c7"
              badge="Automated Workflows"
            />
            <FeatureCard
              icon={Database}
              title="DokGuru RAG Knowledge Base"
              description="Upload textbooks, syllabus guides, and past exams to create fully grounded school-specific AI models."
              color="#10b981"
              badge="Enterprise Security"
            />
          </div>
        </section>

        {/* Role Solutions Section */}
        <section id="solutions" style={{ padding: '3rem 0 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Tailored Solutions for Every Role
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
              Whether you are a student, educator, or school leader, EduSmart AI provides dedicated workflows.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <SolutionCard
              role="For Students"
              icon={GraduationCap}
              color="#38bdf8"
              points={[
                "24/7 Voice & Text AI tutoring assistance",
                "Instant explanation of complex STEM & Humanities concepts",
                "Personalized practice quizzes with instant step guidance",
                "Track individual subject mastery & strengths"
              ]}
            />
            <SolutionCard
              role="For Teachers"
              icon={Cpu}
              color="#0284c7"
              points={[
                "AI Lesson Copilot generates 45-min plans in seconds",
                "Auto-grading for quizzes and written assignments",
                "Automated student risk intervention triggers",
                "Class performance trends & attendance tracking"
              ]}
            />
            <SolutionCard
              role="For School Admins"
              icon={Shield}
              color="#10b981"
              points={[
                "Multi-school performance & usage analytics",
                "DokGuru RAG Document Management & curriculum indexing",
                "Role-based access control & enterprise security",
                "Comprehensive system activity & audit logs"
              ]}
            />
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section style={{
          padding: '4rem 0 5rem',
          margin: '2rem 0',
          position: 'relative'
        }}>
          {/* Ambient Glow Orbs inside CTA Banner */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }} />

          {/* 2-Column Responsive Split */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Content Column */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '50px',
                marginBottom: '1.25rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#38bdf8'
              }}>
                <Sparkles size={14} /> Elevate Your Educational Institution
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
                letterSpacing: '-0.5px'
              }}>
                Ready to Transform Your School with AI?
              </h2>

              <p style={{
                color: '#94a3b8',
                fontSize: '1.05rem',
                lineHeight: 1.65,
                marginBottom: '2rem'
              }}>
                Empower your educators with automated lesson copilot tools and provide students with 24/7 personalized AI tutoring grounded in your curriculum.
              </p>

              {/* Bullet Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.925rem', fontWeight: 500 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    <Check size={13} color="#34d399" strokeWidth={3} />
                  </div>
                  <span>Instant onboarding – zero complex setup required</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.925rem', fontWeight: 500 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    <Check size={13} color="#38bdf8" strokeWidth={3} />
                  </div>
                  <span>Grounded strictly on your school's textbooks & syllabus</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.925rem', fontWeight: 500 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(251, 191, 36, 0.4)' }}>
                    <Check size={13} color="#fbbf24" strokeWidth={3} />
                  </div>
                  <span>Role-based access control & enterprise security</span>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={onGetStarted}
                  style={{
                    padding: '1.1rem 2.75rem',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 35px rgba(2, 132, 199, 0.5)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 16px 45px rgba(2, 132, 199, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 35px rgba(2, 132, 199, 0.5)';
                  }}
                >
                  Launch EduSmart Platform <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Right Interactive Highlights Visual Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="float-slow" style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(15, 22, 36, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Zap size={24} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                    10x Faster Lesson Planning
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    AI Copilot generates 45-min plans & quizzes aligned with standards in seconds.
                  </p>
                </div>
              </div>

              <div className="float-slow-delay" style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(15, 22, 36, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={24} color="#34d399" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                    99.4% Auto-Grading Accuracy
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Instant scoring for written assignments with detailed rubric feedback.
                  </p>
                </div>
              </div>

              <div className="float-slow" style={{
                padding: '1.25rem 1.5rem',
                background: 'rgba(15, 22, 36, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Shield size={24} color="#fbbf24" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                    Enterprise RAG Security
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    DokGuru vector-indexed grounding ensures zero hallucination and complete data privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Sleek Footer */}
        <footer style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#64748b',
          fontSize: '0.875rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>© {new Date().getFullYear()} EduSmart AI Platform. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer', color: '#94a3b8' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer', color: '#94a3b8' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer', color: '#94a3b8' }}>DokGuru API Grounding</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Subcomponents

function MetricQuickItem({ number, label, icon: Icon, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: `rgba(${color === '#38bdf8' ? '56, 189, 248' : color === '#10b981' ? '16, 185, 129' : color === '#34d399' ? '52, 211, 153' : '251, 191, 36'}, 0.15)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${color}40`
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{number}</div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ label, percent, color }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem', color: '#cbd5e1', fontWeight: 600 }}>
        <span>{label}</span>
        <span style={{ color }}>{percent}%</span>
      </div>
      <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: '3px' }} />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, badge }) {
  return (
    <div className="cyber-glowing-card" style={{
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: `rgba(${color === '#38bdf8' ? '56, 189, 248' : color === '#f43f5e' ? '244, 63, 94' : color === '#0284c7' ? '2, 132, 199' : '16, 185, 129'}, 0.15)`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={26} color={color} />
          </div>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: color,
            background: `rgba(${color === '#38bdf8' ? '56, 189, 248' : color === '#f43f5e' ? '244, 63, 94' : color === '#0284c7' ? '2, 132, 199' : '16, 185, 129'}, 0.1)`,
            border: `1px solid ${color}30`,
            padding: '0.2rem 0.6rem',
            borderRadius: '10px'
          }}>
            {badge}
          </span>
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.65rem' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function SolutionCard({ role, icon: Icon, color, points }) {
  return (
    <div className="cyber-glowing-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: `rgba(${color === '#38bdf8' ? '56, 189, 248' : color === '#0284c7' ? '2, 132, 199' : '16, 185, 129'}, 0.15)`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} color={color} />
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{role}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {points.map((pt, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <CheckCircle size={18} color={color} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.5 }}>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
