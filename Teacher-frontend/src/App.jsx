import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Header from './components/Dashboard/Header';
import Sidebar from './components/Dashboard/Sidebar';
import Overview from './components/Dashboard/Overview';
import BiometricAttendance from './components/Attendance/BiometricAttendance';
import ExamMarks from './components/Marks/ExamMarks';
import AIFeedback from './components/Feedback/AIFeedback';
import TeacherProfile from './components/Profile/TeacherProfile';
import { studentAPI, attendanceAPI, marksAPI, classAPI } from './services/api';

export default function App() {
  // Auth view state: 'login' | 'register' | 'forgot-password'
  const [authView, setAuthView] = useState('login');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('teacher_user');
    return saved ? JSON.parse(saved) : null;
  });

  // App active navigation tab: 'overview' | 'attendance' | 'marks' | 'ai-feedback' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Multi-Class state
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState('Grade 10-A (Mathematics)');

  // Application state data
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [marksData, setMarksData] = useState([]);

  // Load Classes
  const loadClasses = async () => {
    try {
      const classList = await classAPI.getClasses();
      setClasses(classList || []);
      if (classList && classList.length > 0 && !activeClass) {
        setActiveClass(classList[0].name);
      }
    } catch (err) {
      console.error('Error loading classes:', err);
    }
  };

  // Load Students and data for activeClass
  const loadClassData = async (targetClass) => {
    try {
      const clsName = targetClass || activeClass;
      const studentList = await studentAPI.getStudents(clsName);
      setStudents(studentList || []);

      const attRes = await attendanceAPI.getAttendance();
      setAttendanceData(attRes.records || []);

      const marksRes = await marksAPI.getMarks();
      setMarksData(marksRes || []);
    } catch (err) {
      console.error('Error loading class data:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadClasses();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && activeClass) {
      loadClassData(activeClass);
    }
  }, [currentUser, activeClass]);

  const handleSelectClass = (className) => {
    setActiveClass(className);
    setClasses(prev => {
      if (!prev.some(c => c.name === className)) {
        return [...prev, { id: 'c_' + Date.now(), name: className, room: 'Room 101', schedule: 'Mon, Wed (10:00 AM)' }];
      }
      return prev;
    });
  };

  const handleUpdateStudent = (updatedStudent) => {
    setStudents(prev => prev.map(s =>
      (s.id === updatedStudent.id || s.name === updatedStudent.name || s.rollNumber === updatedStudent.rollNumber)
        ? { ...s, ...updatedStudent }
        : s
    ));
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('teacher_user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('teacher_user');
    setAuthView('login');
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('teacher_user', JSON.stringify(updatedUser));
  };

  // If user is not logged in, render Step 1 Auth flows
  if (!currentUser) {
    if (authView === 'register') {
      return <Register onLoginSuccess={handleLoginSuccess} onNavigate={setAuthView} />;
    }
    if (authView === 'forgot-password') {
      return <ForgotPassword onNavigate={setAuthView} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={setAuthView} />;
  }

  // Render Logged-in Teacher Platform Dashboard
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        user={currentUser}
        classes={classes}
        activeClass={activeClass}
        onSelectClass={handleSelectClass}
        onRefreshClasses={loadClasses}
        onNavigateProfile={() => setActiveTab('profile')}
        onLogout={handleLogout}
      />

      <div className="app-main-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{ flex: 1, minWidth: 0, width: '100%' }}>
          {activeTab === 'overview' && (
            <Overview
              students={students}
              attendanceData={attendanceData}
              marksData={marksData}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'attendance' && (
            <BiometricAttendance
              students={students}
              activeClass={activeClass}
              onRefreshStudents={() => loadClassData(activeClass)}
              onUpdateStudent={handleUpdateStudent}
            />
          )}

          {activeTab === 'marks' && (
            <ExamMarks
              students={students}
              activeClass={activeClass}
            />
          )}

          {activeTab === 'ai-feedback' && (
            <AIFeedback
              students={students}
              marksData={marksData}
            />
          )}

          {activeTab === 'profile' && (
            <TeacherProfile
              user={currentUser}
              classes={classes}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}
