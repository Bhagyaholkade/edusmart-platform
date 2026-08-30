import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Award, 
  BookOpen, 
  Target, 
  School, 
  AlertCircle, 
  Database, 
  Activity,
  Sparkles,
  Wand2,
  CheckCircle2,
  Clock,
  Play,
  Send,
  Copy,
  FileText,
  ChevronRight,
  UserX,
  MessageSquare,
  Brain,
  Check,
  X,
  ShieldAlert,
  PieChart,
  Zap,
  BarChart3
} from 'lucide-react';

export default function Overview({ role, user, setActiveTab }) {
  // Platform Admin Dashboard
  if (role === 'platform_admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Platform Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Overview of all schools and platform metrics
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.25rem' 
        }}>
          <StatCard
            icon={School}
            title="Total Schools"
            value="24"
            trend="+3 this month"
            color="var(--accent-primary)"
          />
          <StatCard
            icon={Users}
            title="Active Students"
            value="3,847"
            trend="+12% growth"
            color="var(--accent-cyan)"
          />
          <StatCard
            icon={BookOpen}
            title="Active Teachers"
            value="286"
            trend="+8 this week"
            color="var(--accent-emerald)"
          />
          <StatCard
            icon={Activity}
            title="AI API Usage"
            value="98.2%"
            trend="System healthy"
            color="var(--accent-amber)"
          />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Recent Platform Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ActivityItem text="New school onboarded: Springfield Academy" time="2 hours ago" />
            <ActivityItem text="AI usage spike detected - all systems nominal" time="4 hours ago" />
            <ActivityItem text="System update deployed successfully" time="1 day ago" />
          </div>
        </div>
      </div>
    );
  }

  // School Admin Dashboard
  if (role === 'school_admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            School Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Welcome back! Here's your school overview
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.25rem' 
        }}>
          <StatCard
            icon={Users}
            title="Total Students"
            value="842"
            trend="+18 this term"
            color="var(--accent-cyan)"
          />
          <StatCard
            icon={BookOpen}
            title="Teachers"
            value="48"
            trend="12 departments"
            color="var(--accent-primary)"
          />
          <StatCard
            icon={Calendar}
            title="Avg Attendance"
            value="94.8%"
            trend="+1.2% from last week"
            color="var(--accent-emerald)"
          />
          <StatCard
            icon={AlertCircle}
            title="Students At Risk"
            value="23"
            trend="Need attention"
            color="var(--accent-rose)"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="var(--accent-amber)" />
              Students Needing Attention
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <StudentItem name="Sarah Johnson" reason="Attendance below 80%" class="Grade 10-A" />
              <StudentItem name="Mike Chen" reason="Math performance declining" class="Grade 9-B" />
              <StudentItem name="Emma Davis" reason="Multiple absences" class="Grade 10-C" />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--accent-emerald)" />
              AI Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <InsightItem text="Grade 10 Math showing strong improvement trends" />
              <InsightItem text="Science department attendance excellent this week" />
              <InsightItem text="3 students ready for advanced placement" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Dashboard
  if (role === 'teacher') {
    return <TeacherDashboard user={user} setActiveTab={setActiveTab} />;
  }

  // Student Dashboard
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
          My Learning Dashboard
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Hello {user?.name}! Track your academic progress
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.25rem' 
      }}>
        <StatCard
          icon={Calendar}
          title="Attendance Rate"
          value="94.2%"
          trend="Present 17/18 days"
          color="var(--accent-cyan)"
        />
        <StatCard
          icon={Award}
          title="Overall Grade"
          value="B+"
          trend="82.5 average"
          color="var(--accent-emerald)"
        />
        <StatCard
          icon={Target}
          title="Class Rank"
          value="#12"
          trend="Out of 45 students"
          color="var(--accent-purple)"
        />
        <StatCard
          icon={BookOpen}
          title="Active Subjects"
          value="8"
          trend="All on track"
          color="var(--accent-amber)"
        />
      </div>

      {/* Prominent AI Tutor CTA */}
      <div className="glass-panel" style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        border: '2px solid var(--accent-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              Need Help with Your Studies?
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0rem' }}>
              Ask your AI Tutor anything - get personalized explanations with voice support
            </p>
          </div>
          <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
            Open AI Tutor
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Today's Learning
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <LearningItem subject="Mathematics" topic="Quadratic Equations" progress="75%" />
            <LearningItem subject="Physics" topic="Newton's Laws" progress="60%" />
            <LearningItem subject="English" topic="Shakespeare" progress="90%" />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Recommended Practice
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <PracticeItem subject="Math" topic="Algebra basics" reason="Weak area" />
            <PracticeItem subject="Chemistry" topic="Chemical bonds" reason="Upcoming test" />
            <PracticeItem subject="History" topic="World War II" reason="Recent topic" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, trend, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `${color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} color={color} />
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {title}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <TrendingUp size={14} color="var(--accent-emerald)" />
        {trend}
      </div>
    </div>
  );
}

function ActivityItem({ text, time }) {
  return (
    <div style={{
      padding: '0.75rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{text}</span>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{time}</span>
    </div>
  );
}

function StudentItem({ name, reason, class: className }) {
  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid rgba(244, 63, 94, 0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{name}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{className}</span>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)' }}>{reason}</div>
    </div>
  );
}

function InsightItem({ text }) {
  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: 'rgba(16, 185, 129, 0.1)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      fontSize: '0.9rem',
      color: '#fff'
    }}>
      {text}
    </div>
  );
}

function LearningItem({ subject, topic, progress }) {
  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 'var(--radius-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{subject}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{progress}</span>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{topic}</div>
    </div>
  );
}

function PracticeItem({ subject, topic, reason }) {
  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: 'rgba(6, 182, 212, 0.1)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid rgba(6, 182, 212, 0.2)'
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
        {subject}: {topic}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{reason}</div>
    </div>
  );
}

/* ==========================================================================
   100% Attendance-Focused Teacher Dashboard Component
   ========================================================================== */
function TeacherDashboard({ user, setActiveTab }) {
  // Attendance Notification Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeCopied, setNoticeCopied] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const attendanceDefaulters = [
    { id: 1, name: 'Sarah Williams', class: 'Grade 10-B', rate: '76%', absentDays: '4 Days Absent', status: 'Critical Defaulter', parentName: 'David Williams', email: 'david.williams@email.com', phone: '+1 (555) 876-5432' },
    { id: 2, name: 'Alex Johnson', class: 'Grade 10-A', rate: '78%', absentDays: '3 Days Unexcused', status: 'Warning Level', parentName: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '+1 (555) 234-5678' },
    { id: 3, name: 'Michael Brown', class: 'Grade 9-A', rate: '82%', absentDays: '2 Late Arrivals + 1 Absent', status: 'Needs Follow-up', parentName: 'Linda Brown', email: 'linda.brown@email.com', phone: '+1 (555) 345-6789' }
  ];

  const handleOpenNoticeModal = (student) => {
    setSelectedStudent(student);
    setNoticeCopied(false);
    setNoticeSent(false);
    setIsNoticeModalOpen(true);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 100,
          background: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
          color: '#ffffff',
          padding: '0.9rem 1.4rem',
          borderRadius: '14px',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <CheckCircle2 size={20} color="#34d399" /> {toastMsg}
        </div>
      )}

      {/* Cyber Hero Banner */}
      <div className="cyber-glowing-card" style={{
        padding: '2.25rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30, 34, 46, 0.95) 0%, rgba(18, 20, 28, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.775rem',
              color: '#e4e4e7',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Zap size={14} color="#cbd5e1" />
              SMART ATTENDANCE ENGINE ACTIVE — 3 CLASSES TODAY
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
              Welcome back, {user?.name || 'Prof. Alex Rivera'}! 👋
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.975rem', maxWidth: '620px', lineHeight: 1.5 }}>
              Today's overall campus attendance is <strong style={{ color: '#ffffff' }}>92.5%</strong>. 134 out of 145 students are present across your classes. 3 students require attendance warning notices.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => setActiveTab && setActiveTab('attendance')}
              style={{
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0 1.25rem',
                fontSize: '0.875rem',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={18} color="#34d399" /> Mark Today's Attendance
            </button>
            <button
              onClick={() => triggerToast('📲 Parent SMS Alert Broadcast dispatched to all 8 absent student guardians!')}
              style={{
                height: '46px',
                borderRadius: '12px',
                padding: '0 1.25rem',
                fontSize: '0.875rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Send size={18} /> Notify Absent Parents
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Metric Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        <CyberStatCard
          icon={Calendar}
          title="Today's Attendance Rate"
          value="92.5%"
          subtext="+2.3% from last week"
          color="#cbd5e1"
        />
        <CyberStatCard
          icon={Users}
          title="Present Students"
          value="134 / 145"
          subtext="Across all 4 class sections"
          color="#38bdf8"
        />
        <CyberStatCard
          icon={UserX}
          title="Absentees Today"
          value="8 Students"
          subtext="3 unexcused absences"
          color="#f87171"
        />
        <CyberStatCard
          icon={Clock}
          title="Late Arrivals"
          value="3 Students"
          subtext="Logged before 09:20 AM"
          color="#fbbf24"
        />
      </div>

      {/* ⚡ Smart Attendance Action & Dispatch Hub */}
      <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={20} color="#cbd5e1" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Attendance Operations & Quick Actions Hub
              </h2>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Perform instant roll calls, launch biometric scanners, or dispatch parent attendance notices
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.15rem'
        }}>
          <AttendanceActionCard
            icon={CheckCircle2}
            title="Mark Attendance Roster"
            desc="Open digital register for Grade 10-A & 10-B"
            btnText="Open Class Register"
            color="#34d399"
            onClick={() => setActiveTab && setActiveTab('attendance')}
          />
          <AttendanceActionCard
            icon={Send}
            title="Broadcast Absence SMS"
            desc="Send instant SMS alert to all absent parents"
            btnText="Broadcast SMS Alerts"
            color="#38bdf8"
            onClick={() => triggerToast('📲 SMS Broadcast dispatched to 8 parent mobile numbers!')}
          />
          <AttendanceActionCard
            icon={Activity}
            title="Biometric & Facial Scanner"
            desc="Launch kiosk scanner for automated check-in"
            btnText="Launch Kiosk Scanner"
            color="#a855f7"
            onClick={() => setActiveTab && setActiveTab('attendance')}
          />
          <AttendanceActionCard
            icon={FileText}
            title="Export Attendance Report"
            desc="Download monthly attendance log CSV / PDF"
            btnText="Export Monthly CSV"
            color="#cbd5e1"
            onClick={() => triggerToast('📄 Monthly Attendance Report downloaded (Grade10_Attendance_Aug2026.csv)')}
          />
        </div>
      </div>

      {/* Grid Row: Schedule Roll Call & Class Gauges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* 📅 Today's Live Attendance Schedule */}
        <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={20} color="#38bdf8" />
              Daily Roll Call Schedule
            </h2>
            <span style={{ fontSize: '0.775rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.12)', padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>
              3 Class Rolls
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Live Roll Call */}
            <div style={{
              padding: '1.15rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.18) 0%, rgba(18, 18, 22, 0.9) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.45)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b00', boxShadow: '0 0 10px #ff6b00' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ff8c00', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LIVE ROLL CALL</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>10:00 AM - 10:45 AM (Room 302)</span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                Grade 10-A — Mathematics
              </div>
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '1rem' }}>
                32 Present • 2 Absent (Sarah W., Alex J.) • 1 Late (Emily D.)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setActiveTab && setActiveTab('attendance')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 3px 12px rgba(255, 107, 0, 0.35)'
                  }}
                >
                  Mark Roster
                </button>
              </div>
            </div>

            {/* Upcoming Roll Call */}
            <div style={{
              padding: '1rem 1.15rem',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>UPCOMING ROLL (11:30 AM)</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Lab B</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                Grade 10-B — Physics
              </div>
              <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                28 Enrolled Students • Automated Biometric Scanner Standby
              </div>
            </div>

            {/* Completed Roll Call */}
            <div style={{
              padding: '1rem 1.15rem',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              opacity: 0.85
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>✅ ROLL CALL COMPLETED (09:00 AM)</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Room 204</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                Grade 9-A — Algebra
              </div>
              <div style={{ fontSize: '0.775rem', color: '#34d399' }}>
                29/30 Present (96.6% Attendance Rate)
              </div>
            </div>
          </div>
        </div>

        {/* 📊 Class Attendance Gauges */}
        <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BarChart3 size={20} color="#34d399" />
              Class Attendance Gauges
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <AttendanceGaugeRow
              className="Grade 10-A (Mathematics)"
              rate="94.2%"
              presentCount="33 / 35 Present"
              status="Excellent Attendance"
              statusColor="#34d399"
            />
            <AttendanceGaugeRow
              className="Grade 10-B (Physics)"
              rate="88.5%"
              presentCount="25 / 28 Present"
              status="Requires Monitoring"
              statusColor="#fbbf24"
            />
            <AttendanceGaugeRow
              className="Grade 9-A (Algebra)"
              rate="96.1%"
              presentCount="29 / 30 Present"
              status="Top Performing Class"
              statusColor="#34d399"
            />
          </div>
        </div>
      </div>

      {/* 🚨 Attendance Defaulter Radar */}
      <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={22} color="#f87171" />
              Attendance Defaulters Radar (&lt; 85% Attendance)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Students below mandatory attendance threshold requiring formal parent notices
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 700, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.35rem 0.8rem', borderRadius: '9999px' }}>
            3 Defaulters Flagged
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.15rem' }}>
          {attendanceDefaulters.map((student) => (
            <div
              key={student.id}
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                    {student.name}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    {student.rate} Attendance
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                  Class: <strong style={{ color: '#fff' }}>{student.class}</strong> • Guardian: {student.parentName}
                </div>
                <p style={{ fontSize: '0.825rem', color: '#f87171', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                  ⚠️ {student.absentDays} ({student.status})
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenNoticeModal(student)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 3px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                <Send size={15} /> Send Attendance Warning Notice
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📩 Attendance Warning Notice Modal Popup */}
      {isNoticeModalOpen && selectedStudent && (
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
            maxWidth: '540px',
            padding: '2.25rem',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setIsNoticeModalOpen(false)}
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
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={24} color="#f87171" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  Official Attendance Notice Dispatch
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Student: <strong style={{ color: '#fff' }}>{selectedStudent.name}</strong> ({selectedStudent.class})
                </div>
              </div>
            </div>

            {noticeSent ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                  Attendance Warning Dispatched!
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                  An official notice has been sent to <strong>{selectedStudent.parentName}</strong> via SMS ({selectedStudent.phone}) and Email ({selectedStudent.email}).
                </p>
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  padding: '1.15rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.85rem',
                  color: '#cbd5e1',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ marginBottom: '0.6rem' }}>Dear <strong>{selectedStudent.parentName}</strong>,</p>
                  <p style={{ marginBottom: '0.6rem' }}>
                    This is an official notice regarding <strong>{selectedStudent.name}</strong> ({selectedStudent.class}). Their current attendance rate has dropped to <strong style={{ color: '#f87171' }}>{selectedStudent.rate}</strong> ({selectedStudent.absentDays}), which is below the mandatory 85% attendance requirement.
                  </p>
                  <p>
                    Please contact the school office or respond to this notice to submit an official excuse certificate.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNoticeCopied(true);
                      setTimeout(() => setNoticeCopied(false), 2000);
                    }}
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Copy size={16} /> {noticeCopied ? 'Copied!' : 'Copy Notice'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoticeSent(true)}
                    style={{
                      flex: 1.5,
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <Send size={16} /> Dispatch SMS & Email Notice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CyberStatCard({ icon: Icon, title, value, subtext, color }) {
  return (
    <div className="cyber-glowing-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: `${color}18`,
          border: `1px solid ${color}35`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={22} color={color} />
        </div>
        <div>
          <div style={{ fontSize: '0.825rem', color: '#94a3b8', fontWeight: 600 }}>
            {title}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.775rem', color: color, fontWeight: 600 }}>
        {subtext}
      </div>
    </div>
  );
}

function AttendanceActionCard({ icon: Icon, title, desc, btnText, color, onClick }) {
  return (
    <div style={{
      padding: '1.25rem',
      borderRadius: '16px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: `${color}20`,
          border: `1px solid ${color}35`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={18} color={color} />
        </div>
        <div>
          <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
            {title}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#94a3b8', lineHeight: 1.4 }}>
            {desc}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        style={{
          width: '100%',
          padding: '0.55rem',
          borderRadius: '10px',
          background: `${color}18`,
          border: `1px solid ${color}40`,
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {btnText}
      </button>
    </div>
  );
}

function AttendanceGaugeRow({ className, rate, presentCount, status, statusColor }) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '12px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#ffffff' }}>
          {className}
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: statusColor }}>
          {rate}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1, height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ width: rate, height: '100%', borderRadius: '9999px', background: `linear-gradient(90deg, ${statusColor}, #10b981)` }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{presentCount}</span>
      </div>

      <div style={{ fontSize: '0.775rem', color: statusColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }} />
        {status}
      </div>
    </div>
  );
}
