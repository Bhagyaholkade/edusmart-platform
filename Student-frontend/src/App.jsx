import React, { useState, useEffect } from 'react';
import StudentLogin from './components/Auth/StudentLogin';
import StudentSignup from './components/Auth/StudentSignup';
import StudentHeader from './components/Dashboard/StudentHeader';
import StudentOverview from './components/Dashboard/StudentOverview';
import StudentAttendanceActivity from './components/Attendance/StudentAttendanceActivity';
import StudentSubjectPerformance from './components/Subjects/StudentSubjectPerformance';
import StudentProfileView from './components/Profile/StudentProfileView';
import StudentGradebook from './components/Marks/StudentGradebook';
import { studentAuthAPI } from './services/api';
import { LayoutDashboard, Calendar, Award, BookOpen, User } from 'lucide-react';

export default function App() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Restore session from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('edusmart_student_session_v1');
    if (saved) {
      try {
        const student = JSON.parse(saved);
        setCurrentStudent(student);
      } catch (err) {}
    }
  }, []);

  // Fetch dashboard data when logged in
  useEffect(() => {
    if (currentStudent) {
      const searchKey = currentStudent.rollNumber || currentStudent.id;
      setLoading(true);
      studentAuthAPI.getDashboard(searchKey)
        .then(data => {
          setDashboardData(data);
          if (data.student) {
            setCurrentStudent(prev => ({
              ...prev,
              ...data.student,
              name: prev?.name || data.student.name
            }));
          }
        })
        .catch(err => {
          console.error('Failed to load dashboard:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [currentStudent?.id, currentStudent?.rollNumber]);

  const handleLoginSuccess = (studentObj) => {
    setCurrentStudent(studentObj);
    localStorage.setItem('edusmart_student_session_v1', JSON.stringify(studentObj));
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setDashboardData(null);
    localStorage.removeItem('edusmart_student_session_v1');
  };

  const handleUpdateStudentName = (newFullName) => {
    const updatedStudent = {
      ...currentStudent,
      name: newFullName
    };
    setCurrentStudent(updatedStudent);
    localStorage.setItem('edusmart_student_session_v1', JSON.stringify(updatedStudent));

    if (dashboardData && dashboardData.student) {
      setDashboardData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          name: newFullName
        }
      }));
    }
  };

  if (!currentStudent) {
    return authView === 'login' ? (
      <StudentLogin
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setAuthView('signup')}
      />
    ) : (
      <StudentSignup
        onSignupSuccess={handleLoginSuccess}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  const activeStudent = {
    ...(dashboardData?.student || {}),
    ...currentStudent
  };

  return (
    <div className="student-app-layout">
      {/* Student App Header Bar */}
      <StudentHeader student={activeStudent} onLogout={handleLogout} />

      {/* Responsive Navigation Bar (Mobile: Fixed Bottom | Desktop: Placed ABOVE Content) */}
      <nav className="student-nav-bar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`mobile-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon">
            <LayoutDashboard size={20} />
          </div>
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`mobile-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon">
            <Calendar size={20} />
          </div>
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`mobile-nav-item ${activeTab === 'subjects' ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon">
            <BookOpen size={20} />
          </div>
          <span>Subjects</span>
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`mobile-nav-item ${activeTab === 'marks' ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon">
            <Award size={20} />
          </div>
          <span>Grades</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon">
            <User size={20} />
          </div>
          <span>Profile</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 180px)' }}>
        {activeTab === 'overview' && (
          <StudentOverview dashboardData={dashboardData || { student: activeStudent }} />
        )}

        {activeTab === 'attendance' && (
          <StudentAttendanceActivity
            student={activeStudent}
            summary={dashboardData?.summary}
            monthCalendar={dashboardData?.monthCalendar}
            absentDatesList={dashboardData?.absentDatesList}
          />
        )}

        {activeTab === 'subjects' && (
          <StudentSubjectPerformance student={activeStudent} />
        )}

        {activeTab === 'marks' && (
          <StudentGradebook student={activeStudent} />
        )}

        {activeTab === 'profile' && (
          <StudentProfileView
            student={activeStudent}
            onUpdateStudentName={handleUpdateStudentName}
          />
        )}
      </main>
    </div>
  );
}
