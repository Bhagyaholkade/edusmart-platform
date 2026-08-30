import React from 'react';
import { 
  LayoutDashboard, Calendar, Award, BookOpen, User, Sparkles, 
  Users, School, Settings, BarChart3, AlertCircle, Database,
  GraduationCap, UserCog, MessageSquare, FileText, TrendingUp
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, role }) {
  // Platform Admin navigation
  const platformAdminTabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schools', label: 'Schools', icon: School },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'usage', label: 'Usage & Analytics', icon: TrendingUp },
    { id: 'ai-rag', label: 'AI / RAG', icon: Sparkles },
    { id: 'system-logs', label: 'System Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // School Admin / Principal navigation
  const schoolAdminTabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: UserCog },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'assessments', label: 'Assessments', icon: Award },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'interventions', label: 'Interventions', icon: AlertCircle },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Teacher navigation
  const teacherTabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'My Classes', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assessments', label: 'Assessments', icon: Award },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'interventions', label: 'Interventions', icon: AlertCircle },
    { id: 'ai-copilot', label: 'AI Copilot', icon: Sparkles },
    { id: 'knowledge-base', label: 'Materials', icon: Database },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Student navigation
  const studentTabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'ai-tutor', label: 'AI Tutor', icon: MessageSquare },
    { id: 'practice', label: 'Practice', icon: Award },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Select tabs based on role
  const getTabsByRole = () => {
    switch (role) {
      case 'platform_admin':
        return platformAdminTabs;
      case 'school_admin':
        return schoolAdminTabs;
      case 'teacher':
        return teacherTabs;
      case 'student':
        return studentTabs;
      default:
        return studentTabs;
    }
  };

  const tabs = getTabsByRole();

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      background: 'rgba(18, 20, 28, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '1.25rem 0.85rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)'
    }}>
      <div style={{
        fontSize: '0.725rem',
        fontWeight: 800,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        padding: '0 0.85rem 0.6rem 0.85rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '0.4rem'
      }}>
        Navigation Menu
      </div>

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.7rem 0.95rem',
              borderRadius: '12px',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)' 
                : 'transparent',
              color: isActive ? '#ffffff' : '#94a3b8',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 18px rgba(0, 0, 0, 0.4)' : 'none',
              textAlign: 'left'
            }}
          >
            <Icon size={18} color={isActive ? '#f4f4f5' : '#64748b'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
