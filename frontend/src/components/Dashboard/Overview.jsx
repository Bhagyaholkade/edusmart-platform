import React from 'react';
import { TrendingUp, Users, Calendar, Award, BookOpen, Target, School, AlertCircle, Database, Activity } from 'lucide-react';

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
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Teacher Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Welcome back, {user?.name}! Here's your classroom overview
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.25rem' 
        }}>
          <StatCard
            icon={BookOpen}
            title="My Classes"
            value="4"
            trend="6 sections total"
            color="var(--accent-primary)"
          />
          <StatCard
            icon={Users}
            title="Total Students"
            value="145"
            trend="Across all classes"
            color="var(--accent-cyan)"
          />
          <StatCard
            icon={Calendar}
            title="Avg Attendance"
            value="92.5%"
            trend="+2.3% from last week"
            color="var(--accent-emerald)"
          />
          <StatCard
            icon={Award}
            title="Avg Class Score"
            value="78.4"
            trend="+4.2 points"
            color="var(--accent-amber)"
          />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={() => setActiveTab && setActiveTab('attendance')}>
              Mark Attendance & Notify Parents
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab && setActiveTab('marks')}>
              Create Assessment / Gradebook
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab && setActiveTab('ai-copilot')}>
              Ask AI Copilot
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab && setActiveTab('students')}>
              View Class Roster
            </button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} color="var(--accent-amber)" />
            Students Needing Attention
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <StudentItem name="Alex Johnson" reason="Missing 3 assignments" class="Grade 10-A" />
            <StudentItem name="Sarah Williams" reason="Math score below 60%" class="Grade 10-B" />
            <StudentItem name="Michael Brown" reason="Attendance concern" class="Grade 9-A" />
          </div>
        </div>
      </div>
    );
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
