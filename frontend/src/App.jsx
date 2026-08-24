import React, { useState } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Dashboard/Header';
import Sidebar from './components/Dashboard/Sidebar';
import Overview from './components/Dashboard/Overview';
import AttendanceView from './components/Attendance/AttendanceView';
import MarksView from './components/Marks/MarksView';
import ProfileView from './components/Profile/ProfileView';
import Toast from './components/Common/Toast';

// Platform Admin Views
import SchoolsManagement from './components/Admin/SchoolsManagement';
import UsersManagement from './components/Admin/UsersManagement';
import UsageAnalytics from './components/Admin/UsageAnalytics';
import AIRagManagement from './components/Admin/AIRagManagement';
import SystemLogs from './components/Admin/SystemLogs';
import PlatformSettings from './components/Admin/PlatformSettings';

// School Admin Views
import TeachersManagement from './components/Admin/SchoolAdmin/TeachersManagement';
import StudentsManagement from './components/Admin/SchoolAdmin/StudentsManagement';

export default function App() {
  const [authView, setAuthView] = useState('login');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('edusmart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('edusmart_user', JSON.stringify(userObj));
    showToast(`Welcome back, ${userObj.name}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edusmart_user');
    setAuthView('login');
    setActiveTab('overview');
  };

  // If user is not logged in, show authentication
  if (!currentUser) {
    if (authView === 'register') {
      return <Register onLoginSuccess={handleLoginSuccess} onNavigate={setAuthView} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={setAuthView} />;
  }

  // User is logged in - show role-based dashboard
  const userRole = currentUser.role || 'student'; // 'platform_admin', 'school_admin', 'teacher', 'student'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        user={currentUser}
        role={userRole}
        onLogout={handleLogout}
      />

      <div className="app-main-layout">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          role={userRole}
        />

        <main style={{ flex: 1, minWidth: 0, width: '100%' }}>
          {activeTab === 'overview' && (
            <Overview role={userRole} user={currentUser} setActiveTab={setActiveTab} />
          )}

          {/* Teacher or School Admin Students view */}
          {userRole === 'teacher' && activeTab === 'students' && (
            <AttendanceView role={userRole} user={currentUser} />
          )}
          
          {activeTab === 'attendance' && (
            <AttendanceView role={userRole} user={currentUser} />
          )}

          {activeTab === 'marks' && (
            <MarksView role={userRole} user={currentUser} />
          )}

          {activeTab === 'profile' && (
            <ProfileView role={userRole} user={currentUser} />
          )}

          {/* Platform Admin & School Admin Shared / Specific Views */}
          {userRole === 'platform_admin' && activeTab === 'schools' && (
            <SchoolsManagement showToast={showToast} />
          )}

          {userRole === 'platform_admin' && activeTab === 'users' && (
            <UsersManagement showToast={showToast} />
          )}

          {(userRole === 'platform_admin' || userRole === 'school_admin') && activeTab === 'usage' && (
            <UsageAnalytics showToast={showToast} />
          )}

          {(userRole === 'platform_admin' || userRole === 'school_admin') && activeTab === 'analytics' && (
            <UsageAnalytics showToast={showToast} />
          )}

          {(userRole === 'platform_admin' || userRole === 'school_admin') && activeTab === 'ai-rag' && (
            <AIRagManagement showToast={showToast} />
          )}

          {(userRole === 'platform_admin' || userRole === 'school_admin') && activeTab === 'knowledge-base' && (
            <AIRagManagement showToast={showToast} />
          )}

          {userRole === 'platform_admin' && activeTab === 'system-logs' && (
            <SystemLogs showToast={showToast} />
          )}

          {(userRole === 'platform_admin' || userRole === 'school_admin') && activeTab === 'settings' && (
            <PlatformSettings showToast={showToast} />
          )}

          {/* School Admin specific */}
          {userRole === 'school_admin' && activeTab === 'teachers' && (
            <TeachersManagement showToast={showToast} />
          )}

          {userRole === 'school_admin' && activeTab === 'students' && (
            <StudentsManagement showToast={showToast} />
          )}

          {(userRole === 'school_admin' || userRole === 'teacher') && activeTab === 'classes' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                {userRole === 'school_admin' ? 'All School Classes & Roster' : 'My Teaching Classes'}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Active classes: Grade 10-A (32 students), Grade 10-B (28 students), Grade 9-A (30 students), Grade 11-A (25 students)
              </p>
            </div>
          )}

          {(userRole === 'school_admin' || userRole === 'teacher') && activeTab === 'assessments' && (
            <MarksView role={userRole} user={currentUser} />
          )}

          {(userRole === 'school_admin' || userRole === 'teacher') && activeTab === 'interventions' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Student Academic Interventions</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                3 students flagged for low attendance & math tutoring support (Sarah Williams, Mike Chen, Alex Johnson)
              </p>
            </div>
          )}

          {/* Student specific */}
          {userRole === 'student' && activeTab === 'subjects' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Subject Performance</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Track your performance across Mathematics, Physics, Chemistry, and English
              </p>
            </div>
          )}

          {userRole === 'student' && activeTab === 'ai-tutor' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>AI Tutor</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Your personal AI learning assistant with voice support and DokGuru RAG grounding
              </p>
            </div>
          )}

          {userRole === 'teacher' && activeTab === 'ai-copilot' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Teacher AI Copilot</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Context-aware AI assistant for automated lesson planning, quiz generation, and grading support
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
