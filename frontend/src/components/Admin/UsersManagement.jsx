import { useState } from 'react';
import { 
  Users, UserPlus, Search, Shield, BookOpen, GraduationCap, School, 
  Mail, Calendar, MoreVertical, Edit, Trash2, Key, CheckCircle, XCircle, X, AlertCircle 
} from 'lucide-react';

export default function UsersManagement({ showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher',
    school: 'Springfield High School',
    status: 'active'
  });

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@springfield.edu',
      role: 'school_admin',
      school: 'Springfield High School',
      status: 'active',
      joinedDate: '2024-01-15',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael.chen@riverdale.edu',
      role: 'teacher',
      school: 'Riverdale Academy',
      status: 'active',
      joinedDate: '2023-11-20',
      lastLogin: '5 mins ago'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@student.springfield.edu',
      role: 'student',
      school: 'Springfield High School',
      status: 'active',
      joinedDate: '2024-03-10',
      lastLogin: '1 hour ago'
    },
    {
      id: 4,
      name: 'Admin User',
      email: 'admin@platform.edusmart.ai',
      role: 'platform_admin',
      school: 'Platform HQ',
      status: 'active',
      joinedDate: '2023-01-01',
      lastLogin: 'Just now'
    },
    {
      id: 5,
      name: 'James Wilson',
      email: 'james.wilson@central.edu',
      role: 'teacher',
      school: 'Central City High',
      status: 'inactive',
      joinedDate: '2024-02-05',
      lastLogin: '5 days ago'
    },
  ]);

  const schoolsList = [
    'Platform HQ',
    'Springfield High School',
    'Riverdale Academy',
    'Sunnydale School',
    'Central City High'
  ];

  const getRoleInfo = (role) => {
    switch (role) {
      case 'platform_admin':
        return { icon: Shield, label: 'Platform Admin', color: 'var(--accent-purple)' };
      case 'school_admin':
        return { icon: School, label: 'Principal', color: 'var(--accent-amber)' };
      case 'teacher':
        return { icon: BookOpen, label: 'Teacher', color: 'var(--accent-primary)' };
      case 'student':
        return { icon: GraduationCap, label: 'Student', color: 'var(--accent-cyan)' };
      default:
        return { icon: Users, label: 'User', color: 'var(--text-muted)' };
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleCounts = {
    platform_admin: users.filter(u => u.role === 'platform_admin').length,
    school_admin: users.filter(u => u.role === 'school_admin').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    student: users.filter(u => u.role === 'student').length,
  };

  const handleInviteUser = () => {
    if (!formData.name || !formData.email) return;

    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      school: formData.school,
      status: formData.status,
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    setUsers([newUser, ...users]);
    setShowInviteModal(false);
    resetForm();
    if (showToast) showToast(`Invitation sent to ${newUser.email}!`, 'success');
  };

  const handleEditUser = () => {
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, ...formData } : u
    ));
    setShowEditModal(false);
    resetForm();
    if (showToast) showToast(`User "${formData.name}" updated successfully!`, 'success');
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    const userName = selectedUser.name;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
    if (showToast) showToast(`User "${userName}" removed from system!`, 'warning');
  };

  const handleToggleUserStatus = (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
    setActiveMenuId(null);
    if (showToast) showToast(`User ${user.name} is now ${nextStatus}`, 'info');
  };

  const handleResetPassword = (user) => {
    setActiveMenuId(null);
    if (showToast) showToast(`Password reset link dispatched to ${user.email}`, 'info');
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.school,
      status: user.status
    });
    setActiveMenuId(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setActiveMenuId(null);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'teacher',
      school: 'Springfield High School',
      status: 'active'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Users Management
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Manage permissions, credentials, and accounts across all roles
          </p>
        </div>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlus size={18} /> Invite New User
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatCard
          icon={Shield}
          label="Platform Admins"
          value={roleCounts.platform_admin}
          color="var(--accent-purple)"
        />
        <StatCard
          icon={School}
          label="School Admins"
          value={roleCounts.school_admin}
          color="var(--accent-amber)"
        />
        <StatCard
          icon={BookOpen}
          label="Teachers"
          value={roleCounts.teacher}
          color="var(--accent-primary)"
        />
        <StatCard
          icon={GraduationCap}
          label="Students"
          value={roleCounts.student}
          color="var(--accent-cyan)"
        />
      </div>

      {/* Search and Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="glass-input"
            style={{ width: '180px' }}
          >
            <option value="all">All Roles</option>
            <option value="platform_admin">Platform Admin</option>
            <option value="school_admin">Principal</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input"
            style={{ width: '150px' }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'visible' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>User Identity</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Assigned School</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Joined</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Last Active</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No user accounts match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const RoleIcon = roleInfo.icon;
                  const isMenuOpen = activeMenuId === user.id;

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: `${roleInfo.color}22`,
                            border: `1px solid ${roleInfo.color}44`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            color: roleInfo.color
                          }}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                              {user.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Mail size={12} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <RoleIcon size={16} color={roleInfo.color} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: roleInfo.color }}>
                            {roleInfo.label}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {user.school}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span className={`badge ${user.status === 'active' ? 'badge-present' : 'badge-absent'}`}>
                          {user.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {user.joinedDate}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {user.lastLogin}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', position: 'relative' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem 0.6rem' }}
                          onClick={() => setActiveMenuId(isMenuOpen ? null : user.id)}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Action Menu Popover */}
                        {isMenuOpen && (
                          <div style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '2.5rem',
                            zIndex: 100,
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-sm)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                            padding: '0.4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '150px'
                          }}>
                            <button
                              onClick={() => openEditModal(user)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                textAlign: 'left'
                              }}
                            >
                              <Edit size={14} /> Edit Details
                            </button>
                            <button
                              onClick={() => handleResetPassword(user)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-cyan)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                textAlign: 'left'
                              }}
                            >
                              <Key size={14} /> Reset Password
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-amber)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                textAlign: 'left'
                              }}
                            >
                              {user.status === 'active' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-red)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                textAlign: 'left'
                              }}
                            >
                              <Trash2 size={14} /> Delete Account
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <Modal onClose={() => { setShowInviteModal(false); resetForm(); }} title="Invite New User">
          <UserForm formData={formData} setFormData={setFormData} schoolsList={schoolsList} isInvite={true} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={() => { setShowInviteModal(false); resetForm(); }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={handleInviteUser}
              disabled={!formData.name || !formData.email}
            >
              Send Invitation
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <Modal onClose={() => { setShowEditModal(false); resetForm(); setSelectedUser(null); }} title="Edit User Profile">
          <UserForm formData={formData} setFormData={setFormData} schoolsList={schoolsList} isInvite={false} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={() => { setShowEditModal(false); resetForm(); setSelectedUser(null); }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={handleEditUser}
            >
              Save Profile
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <Modal onClose={() => { setShowDeleteModal(false); setSelectedUser(null); }} title="Delete User Account">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <AlertCircle size={32} color="var(--accent-red)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Remove {selectedUser.name}?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                This user account ({selectedUser.email}) will be permanently deleted from {selectedUser.school}.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => { setShowDeleteModal(false); setSelectedUser(null); }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-red)' }}
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function UserForm({ formData, setFormData, schoolsList, isInvite }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Full Name *
        </label>
        <input
          type="text"
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. John Doe"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Email Address *
        </label>
        <input
          type="email"
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="user@school.edu"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            System Role *
          </label>
          <select
            className="glass-input"
            style={{ width: '100%' }}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="platform_admin">Platform Admin</option>
            <option value="school_admin">Principal / School Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Account Status
          </label>
          <select
            className="glass-input"
            style={{ width: '100%' }}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Assigned School / Institution *
        </label>
        <select
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.school}
          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
        >
          {schoolsList.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2rem',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `${color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
        {value}
      </div>
    </div>
  );
}
