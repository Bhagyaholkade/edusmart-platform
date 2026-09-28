import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import {
  School, Users, BookOpen, BarChart3, AlertCircle,
  TrendingUp, Activity, User, Award, CheckCircle2, Zap
} from 'lucide-react';

export default function AcademicAnalytics({ role, user, showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (role === 'school_admin') {
          const res = await analyticsAPI.getSchoolAnalytics(user?.school_id || 1);
          setData(res);
        } else if (role === 'teacher') {
          const classId = user?.assignedClasses?.[0]?.id || 1;
          const res = await analyticsAPI.getTeacherClassAnalytics(classId);
          setData(res);
        } else if (role === 'student') {
          const res = await analyticsAPI.getStudentAnalytics(user?.id || 'usr_s1');
          setData(res);
        }
      } catch (err) {
        setError(err.message);
        if (showToast) showToast('Failed to load analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role, user, showToast]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#38bdf8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Activity className="spin" size={32} />
          <span style={{ fontWeight: 600 }}>Loading Academic Analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <h3 style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} /> Error Loading Analytics
        </h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  if (role === 'school_admin') return <SchoolAnalytics data={data} />;
  if (role === 'teacher') return <TeacherAnalytics data={data} />;
  if (role === 'student') return <StudentAnalytics data={data} />;

  return null;
}

function SchoolAnalytics({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>School Academic Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Overall performance metrics for {data.school_name}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <MetricCard icon={Users} label="Total Students" value={data.total_students} color="var(--accent-primary)" />
        <MetricCard icon={CheckCircle2} label="Overall Attendance" value={`${data.overall_attendance_rate_pct}%`} color="var(--accent-emerald)" />
        <MetricCard icon={TrendingUp} label="Average Score" value={`${data.overall_average_score_pct}%`} color="var(--accent-cyan)" />
        <MetricCard icon={AlertCircle} label="Active Risk Signals" value={data.active_risk_signals} color="var(--accent-rose)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Top Performing Subjects</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.top_subjects.map((sub, idx) => (
              <ProgressBar key={idx} label={sub.subject_name} value={sub.average_score_pct} subtext={`${sub.pass_rate_pct}% pass rate`} color="var(--accent-cyan)" />
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Class Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.classes.map((cls, idx) => (
              <ProgressBar key={idx} label={`${cls.grade_level}-${cls.section}`} value={cls.average_score_pct} subtext={`${cls.attendance_rate_pct}% attendance`} color="var(--accent-primary)" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherAnalytics({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Class Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Analytics for {data.grade_level}-{data.section}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <MetricCard icon={Users} label="Enrolled Students" value={data.total_students} color="var(--accent-primary)" />
        <MetricCard icon={CheckCircle2} label="Class Attendance" value={`${data.class_attendance_rate_pct}%`} color="var(--accent-emerald)" />
        <MetricCard icon={TrendingUp} label="Average Score" value={`${data.class_average_score_pct}%`} color="var(--accent-cyan)" />
        <MetricCard icon={AlertCircle} label="At-Risk Students" value={data.at_risk_student_count} color="var(--accent-rose)" />
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Student Performance Summaries</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Health Score</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Attendance</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Avg Score</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Risk Count</th>
              </tr>
            </thead>
            <tbody>
              {data.student_summaries.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{s.full_name}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: s.health_score > 80 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{s.health_score}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{s.attendance_rate_pct}%</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{s.average_score_pct}%</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: s.active_risk_count > 0 ? 'var(--accent-rose)' : 'var(--text-muted)' }}>{s.active_risk_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentAnalytics({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>My Academic Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Performance overview for {data.full_name}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <MetricCard icon={Zap} label="Overall Health Score" value={data.overall_health_score} color="var(--accent-emerald)" />
        <MetricCard icon={CheckCircle2} label="Attendance Rate" value={`${data.attendance.attendance_rate_pct}%`} color="var(--accent-cyan)" />
        <MetricCard icon={Award} label="Average Score" value={`${data.average_score_pct}%`} color="var(--accent-primary)" />
        <MetricCard icon={AlertCircle} label="Active Risks" value={data.risk_summary.total_active_signals} color="var(--accent-rose)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Subject Mastery</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.subject_performance.map((sub, idx) => (
              <ProgressBar key={idx} label={sub.subject_name} value={sub.average_score_pct} subtext={`Across ${sub.total_assessments} assessments`} color="var(--accent-cyan)" />
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Recent Results</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.recent_results.map((res, idx) => (
              <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{res.assessment_title}</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{res.score_pct}%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {res.subject_name} • {res.score}/{res.max_score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{value}</div>
    </div>
  );
}

function ProgressBar({ label, value, subtext, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: color }}>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtext}</div>
    </div>
  );
}
