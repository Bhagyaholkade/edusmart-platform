import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit, Save } from 'lucide-react';

export default function ProfileView({ role, user, setActiveTab }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Prof. Alex Rivera',
    email: user?.email || 'teacher@school.edu',
    phone: '+1 (555) 234-5678',
    address: 'Oakridge Campus, Faculty Block B',
    dateOfBirth: '1988-08-14',
    department: 'Mathematics & Science Department'
  });

  // Managed Teacher Classes state
  const initialClasses = user?.assignedClasses?.map(name => ({
    id: Date.now() + Math.random(),
    name: name,
    studentsCount: Math.floor(Math.random() * 10) + 28,
    attendanceRate: (88 + Math.random() * 8).toFixed(1) + '%',
    room: 'Room 302',
    schedule: 'Mon / Wed / Fri 10:00 AM'
  })) || [
    { id: 1, name: 'Grade 10-A (Mathematics)', studentsCount: 35, attendanceRate: '94.2%', room: 'Room 302', schedule: 'Mon / Wed 10:00 AM' },
    { id: 2, name: 'Grade 10-B (Mathematics)', studentsCount: 28, attendanceRate: '88.5%', room: 'Lab B', schedule: 'Tue / Thu 11:30 AM' }
  ];

  const [classesList, setClassesList] = useState(initialClasses);
  const [activeClassName, setActiveClassName] = useState(initialClasses[0]?.name || 'Grade 10-A (Mathematics)');
  const [toastMsg, setToastMsg] = useState('');

  // Add Class Modal state
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newGrade, setNewGrade] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newRoom, setNewRoom] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSave = () => {
    setIsEditing(false);
    triggerToast('✅ Teacher profile information updated successfully!');
  };

  const handleAddClassSubmit = (e) => {
    e.preventDefault();
    if (!newGrade.trim() || !newSubject.trim()) return;

    const formattedName = `${newGrade.trim()} (${newSubject.trim()})`;
    const newClassObj = {
      id: Date.now(),
      name: formattedName,
      studentsCount: 30,
      attendanceRate: '100%',
      room: newRoom.trim() || 'Room 101',
      schedule: 'Mon / Wed 09:00 AM'
    };

    setClassesList([...classesList, newClassObj]);
    setActiveClassName(formattedName);
    setShowAddClassModal(false);
    setNewGrade('');
    setNewSubject('');
    setNewRoom('');
    triggerToast(`✅ Registered new class: "${formattedName}" to ${formData.name}!`);
  };

  const handleDeleteClass = (id, className) => {
    const updated = classesList.filter(c => c.id !== id);
    setClassesList(updated);
    if (activeClassName === className && updated.length > 0) {
      setActiveClassName(updated[0].name);
    }
    triggerToast(`🗑️ Class "${className}" removed from teacher profile.`);
  };

  const handleSetActiveClass = (className) => {
    setActiveClassName(className);
    triggerToast(`🟢 Active Teaching Class switched to: "${className}"`);
  };

  if (role === 'teacher' || role === 'school_admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Toast Alert */}
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
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
          }}>
            {toastMsg}
          </div>
        )}

        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            Teacher Profile & Class Management Hub
          </h2>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Manage teacher credentials, add new classes, remove old classes, and select your active teaching class
          </p>
        </div>

        {/* Profile Header */}
        <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}>
              {formData.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px' }}>
                  {formData.name}
                </h3>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>
                  Registered Educator
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
                {formData.department} • Username: <strong style={{ color: '#fff' }}>{formData.email}</strong>
              </p>

              {/* Subjects Taught Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
                <span style={{ fontSize: '0.775rem', color: '#cbd5e1', fontWeight: 700 }}>Subjects Taught:</span>
                {(user?.subjectsTaught || ['Mathematics', 'Physics', 'Computer Science']).map(sub => (
                  <span key={sub} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f4f4f5', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                    📚 {sub}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '12px',
                    background: isEditing ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    border: isEditing ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: isEditing ? '#f87171' : '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Edit size={16} /> {isEditing ? 'Cancel Editing' : 'Edit Personal Info'}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 🏫 Registered Classes Management Hub */}
        <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={24} color="#38bdf8" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  Registered Classes & Roster Management
                </h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Add new classes you take, remove old classes, or change your active class selection
              </p>
            </div>

            <button
              onClick={() => setShowAddClassModal(true)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              + Add New Class
            </button>
          </div>

          {/* Classes Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {classesList.map((cls) => {
              const isActive = activeClassName === cls.name;
              return (
                <div
                  key={cls.id}
                  style={{
                    padding: '1.35rem',
                    borderRadius: '16px',
                    background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(18, 20, 28, 0.85) 100%)' : 'rgba(18, 20, 28, 0.6)',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: isActive ? '0 4px 20px rgba(56, 189, 248, 0.15)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {cls.name}
                      </div>
                      {isActive && (
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                          🟢 ACTIVE CLASS
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      📍 {cls.room} • 👥 {cls.studentsCount} Enrolled Students • 📊 {cls.attendanceRate} Avg Attendance
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => handleSetActiveClass(cls.name)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Set Active Class
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTab && setActiveTab('attendance')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '10px',
                          background: '#38bdf8',
                          color: '#000000',
                          border: 'none',
                          fontSize: '0.775rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Open Attendance Register
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#f87171',
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Remove old class from profile"
                    >
                      Delete Class
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Class Modal Popup */}
        {showAddClassModal && (
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
              maxWidth: '480px',
              padding: '2.25rem',
              position: 'relative'
            }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                Add New Teaching Class Section
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                Register a new class to your teacher profile and manage student attendance
              </p>

              <form onSubmit={handleAddClassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Class Section Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    placeholder="e.g. Grade 12-A, Grade 9-B"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    style={{ height: '44px', borderRadius: '10px', background: 'rgba(18, 20, 28, 0.9)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    placeholder="e.g. Physics, Advanced Calculus, Chemistry"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    style={{ height: '44px', borderRadius: '10px', background: 'rgba(18, 20, 28, 0.9)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Room Number / Lab
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g. Lab 402, Room 204"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    style={{ height: '44px', borderRadius: '10px', background: 'rgba(18, 20, 28, 0.9)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Save & Register Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Personal Information */}
        <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#ffffff' }}>
            Personal Credentials & Contact
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <ProfileField
              icon={Mail}
              label="Email Username"
              value={formData.email}
              isEditing={isEditing}
              onChange={(value) => setFormData({...formData, email: value})}
            />
            <ProfileField
              icon={Phone}
              label="Phone Number"
              value={formData.phone}
              isEditing={isEditing}
              onChange={(value) => setFormData({...formData, phone: value})}
            />
            <ProfileField
              icon={MapPin}
              label="Campus Address"
              value={formData.address}
              isEditing={isEditing}
              onChange={(value) => setFormData({...formData, address: value})}
            />
            <ProfileField
              icon={Calendar}
              label="Date of Birth"
              value={formData.dateOfBirth}
              type="date"
              isEditing={isEditing}
              onChange={(value) => setFormData({...formData, dateOfBirth: value})}
            />
          </div>
        </div>

        {/* Teaching Statistics */}
        <div className="cyber-glowing-card" style={{ padding: '2rem 2.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#ffffff' }}>
            Teaching & Class Performance Metrics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <StatCard icon={BookOpen} label="Classes Managed" value={classesList.length.toString()} color="#cbd5e1" />
            <StatCard icon={User} label="Total Students" value="145" color="#38bdf8" />
            <StatCard icon={Award} label="Years Experience" value="8" color="#34d399" />
            <StatCard icon={Calendar} label="Attendance Rate" value="94.2%" color="#fbbf24" />
          </div>
        </div>
      </div>
    );
  }

  // Student Profile
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
          Student Profile
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          View and update your personal information
        </p>
      </div>

      {/* Profile Header */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'var(--gradient-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#fff'
          }}>
            {formData.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              {formData.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Roll Number: {user?.rollNumber || '1001'} • Grade 10-A
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary"
                style={{ padding: '0.6rem 1.25rem' }}
              >
                <Edit size={16} /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.25rem' }}
                >
                  <Save size={16} /> Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Personal Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <ProfileField
            icon={Mail}
            label="Email Address"
            value={formData.email}
            isEditing={isEditing}
            onChange={(value) => setFormData({...formData, email: value})}
          />
          <ProfileField
            icon={Phone}
            label="Phone Number"
            value={formData.phone}
            isEditing={isEditing}
            onChange={(value) => setFormData({...formData, phone: value})}
          />
          <ProfileField
            icon={MapPin}
            label="Address"
            value={formData.address}
            isEditing={isEditing}
            onChange={(value) => setFormData({...formData, address: value})}
          />
          <ProfileField
            icon={Calendar}
            label="Date of Birth"
            value={formData.dateOfBirth}
            type="date"
            isEditing={isEditing}
            onChange={(value) => setFormData({...formData, dateOfBirth: value})}
          />
        </div>
      </div>

      {/* Academic Information */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Academic Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <InfoCard label="Class" value="Grade 10-A" />
          <InfoCard label="Section" value="Mathematics" />
          <InfoCard label="Roll Number" value={user?.rollNumber || '1001'} />
          <InfoCard label="Admission Year" value="2021" />
        </div>
      </div>

      {/* Performance Summary */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Performance Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <StatCard icon={Award} label="Overall Grade" value="B+" color="var(--accent-emerald)" />
          <StatCard icon={BookOpen} label="Subjects" value="8" color="var(--accent-cyan)" />
          <StatCard icon={Calendar} label="Attendance" value="94.2%" color="var(--accent-amber)" />
          <StatCard icon={User} label="Class Rank" value="#12" color="var(--accent-purple)" />
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, type = 'text', isEditing, onChange }) {
  return (
    <div>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        marginBottom: '0.5rem'
      }}>
        <Icon size={16} color="var(--accent-cyan)" />
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="glass-input"
          style={{ padding: '0.75rem 1rem' }}
        />
      ) : (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.95rem',
          color: '#fff',
          fontWeight: 600
        }}>
          {value}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
      <Icon size={28} color={color} style={{ marginBottom: '0.75rem' }} />
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
        {value}
      </div>
    </div>
  );
}
