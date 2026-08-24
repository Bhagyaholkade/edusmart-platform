import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit, Save } from 'lucide-react';

export default function ProfileView({ role, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 234 567 8900',
    address: '123 School Street, City',
    dateOfBirth: '2005-05-15',
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  if (role === 'teacher') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Teacher Profile
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Manage your professional information
          </p>
        </div>

        {/* Profile Header */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'var(--gradient-brand)',
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
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Mathematics Department • Senior Teacher
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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

        {/* Teaching Statistics */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Teaching Statistics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <StatCard icon={BookOpen} label="Classes Teaching" value="6" color="var(--accent-cyan)" />
            <StatCard icon={User} label="Total Students" value="145" color="var(--accent-primary)" />
            <StatCard icon={Award} label="Years Experience" value="8" color="var(--accent-emerald)" />
            <StatCard icon={Calendar} label="Attendance Rate" value="96%" color="var(--accent-amber)" />
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
