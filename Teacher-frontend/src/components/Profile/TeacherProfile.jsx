import React, { useState } from 'react';
import { User, Mail, Building2, BookOpen, ShieldCheck, KeyRound, Save, CheckCircle2, Phone, BadgeCheck, Sparkles, Award } from 'lucide-react';

export default function TeacherProfile({ user, classes, onUpdateUser }) {
  const teacherMeta = user?.user_metadata || {};

  const [fullName, setFullName] = useState(teacherMeta.full_name || 'Dr. Sarah Connor');
  const [email] = useState(user?.email || 'teacher@edusmart.edu');
  const [schoolName, setSchoolName] = useState(teacherMeta.school_name || 'St. Xavier High School');
  const [employeeId, setEmployeeId] = useState(teacherMeta.employee_id || 'TCH-2026-88');
  const [phone, setPhone] = useState(teacherMeta.phone || '+1 (555) 234-5678');
  const [department, setDepartment] = useState(teacherMeta.department || 'Science & Advanced Mathematics');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [saveMessage, setSaveMessage] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdError, setPwdError] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      user_metadata: {
        ...teacherMeta,
        full_name: fullName,
        school_name: schoolName,
        employee_id: employeeId,
        phone,
        department
      }
    };

    if (onUpdateUser) onUpdateUser(updatedUser);
    setSaveMessage('Profile information saved successfully!');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdMessage('');

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match');
      return;
    }

    setPwdMessage('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdMessage(''), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Profile Header Banner */}
      <div className="glass-panel" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
          }}>
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{fullName}</h1>
              <BadgeCheck size={22} color="var(--accent-cyan)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {department} • ID: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{employeeId}</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
              {schoolName}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--glass-border)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{classes.length}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Classes</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--glass-border)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>12</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Students</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Personal & Professional Details Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--accent-cyan)" /> Personal & Academic Information
          </h3>

          {saveMessage && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle2 size={16} /> {saveMessage}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                className="glass-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Teacher Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                className="glass-input"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                value={email}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Employee ID
                </label>
                <input
                  type="text"
                  className="glass-input"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  className="glass-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                School / Institution Name
              </label>
              <input
                type="text"
                className="glass-input"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Academic Department / Subject Focus
              </label>
              <input
                type="text"
                className="glass-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <Save size={16} /> Update Profile Info
            </button>
          </form>
        </div>

        {/* Right Column: Assigned Classes List & Password Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Assigned Classes List */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="var(--accent-cyan)" /> Assigned Classes Roster
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {classes.map((cls) => (
                <div key={cls.id} style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{cls.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cls.room} • {cls.schedule}</p>
                  </div>
                  <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
                    Active Class
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password Form */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={20} color="var(--accent-purple)" /> Security & Password
            </h3>

            {pwdMessage && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle2 size={16} /> {pwdMessage}
              </div>
            )}

            {pwdError && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#fb7185',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                {pwdError}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  className="glass-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  className="glass-input"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  className="glass-input"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-secondary"
                style={{ width: '100%', marginTop: '0.4rem', justifyContent: 'center' }}
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
