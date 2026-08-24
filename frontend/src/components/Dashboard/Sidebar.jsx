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
    <aside className="app-sidebar-container glass-panel">
      <nav className="app-sidebar-nav-horizontal">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
