import { useState } from 'react';
import { 
  School, Plus, Search, Users, TrendingUp, CheckCircle, XCircle, 
  Edit, Trash2, X, AlertCircle, Eye, Mail, Phone, Calendar, Award 
} from 'lucide-react';

export default function SchoolsManagement({ showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    plan: 'Basic',
    contactEmail: '',
    contactPhone: '',
    principalName: '',
    maxStudents: '1000'
  });

  const [schools, setSchools] = useState([
    {
      id: 1,
      name: 'Springfield High School',
      location: 'Springfield, IL',
      status: 'active',
      students: 842,
      teachers: 48,
      plan: 'Premium',
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
      usage: 92,
      contactEmail: 'admin@springfield.edu',
      contactPhone: '+1 (555) 234-5678',
      principalName: 'Dr. Sarah Johnson',
      maxStudents: 1000
    },
    {
      id: 2,
      name: 'Riverdale Academy',
      location: 'Riverdale, NY',
      status: 'active',
      students: 1205,
      teachers: 72,
      plan: 'Enterprise',
      joinedDate: '2023-11-20',
      lastActive: '5 mins ago',
      usage: 98,
      contactEmail: 'contact@riverdale.edu',
      contactPhone: '+1 (555) 876-5432',
      principalName: 'Prof. Michael Chen',
      maxStudents: 2000
    },
    {
      id: 3,
      name: 'Sunnydale School',
      location: 'Sunnydale, CA',
      status: 'inactive',
      students: 456,
      teachers: 28,
      plan: 'Basic',
      joinedDate: '2024-03-10',
      lastActive: '2 days ago',
      usage: 45,
      contactEmail: 'info@sunnydale.edu',
      contactPhone: '+1 (555) 345-6789',
      principalName: 'Emily Davis',
      maxStudents: 500
    },
    {
      id: 4,
      name: 'Central City High',
      location: 'Central City, TX',
      status: 'active',
      students: 978,
      teachers: 56,
      plan: 'Premium',
      joinedDate: '2024-02-05',
      lastActive: '1 hour ago',
      usage: 87,
      contactEmail: 'admin@centralcity.edu',
      contactPhone: '+1 (555) 456-7890',
      principalName: 'James Wilson',
      maxStudents: 1500
    },
  ]);

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (school.principalName && school.principalName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || school.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalStudents = schools.reduce((sum, school) => sum + school.students, 0);
  const totalTeachers = schools.reduce((sum, school) => sum + school.teachers, 0);
  const activeSchools = schools.filter(s => s.status === 'active').length;

  const handleAddSchool = () => {
    if (!formData.name || !formData.location || !formData.contactEmail) return;
    
    const newSchool = {
      id: Math.max(...schools.map(s => s.id), 0) + 1,
      name: formData.name,
      location: formData.location,
      status: 'active',
      students: 0,
      teachers: 0,
      plan: formData.plan,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      usage: 0,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone || '+1 (555) 000-0000',
      principalName: formData.principalName || 'Not Assigned',
      maxStudents: parseInt(formData.maxStudents) || 1000
    };
    
    setSchools([newSchool, ...schools]);
    setShowAddModal(false);
    resetForm();
    if (showToast) showToast(`School "${newSchool.name}" added successfully!`, 'success');
  };

  const handleEditSchool = () => {
    setSchools(schools.map(school => 
      school.id === selectedSchool.id 
        ? { ...school, ...formData, maxStudents: parseInt(formData.maxStudents) || school.maxStudents }
        : school
    ));
    setShowEditModal(false);
    resetForm();
    if (showToast) showToast(`School "${formData.name}" updated successfully!`, 'success');
    setSelectedSchool(null);
  };

  const handleDeleteSchool = () => {
    const schoolName = selectedSchool.name;
    setSchools(schools.filter(school => school.id !== selectedSchool.id));
    setShowDeleteModal(false);
    setSelectedSchool(null);
    if (showToast) showToast(`School "${schoolName}" deleted successfully!`, 'warning');
  };

  const handleToggleStatus = (school) => {
    const nextStatus = school.status === 'active' ? 'inactive' : 'active';
    setSchools(schools.map(s =>
      s.id === school.id
        ? { ...s, status: nextStatus }
        : s
    ));
    if (showToast) showToast(`School "${school.name}" status changed to ${nextStatus}`, 'info');
  };

  const openEditModal = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      location: school.location,
      plan: school.plan,
      contactEmail: school.contactEmail || '',
      contactPhone: school.contactPhone || '',
      principalName: school.principalName || '',
      maxStudents: school.maxStudents || 1000
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (school) => {
    setSelectedSchool(school);
    setShowDeleteModal(true);
  };

  const openDetailsModal = (school) => {
    setSelectedSchool(school);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      plan: 'Basic',
      contactEmail: '',
      contactPhone: '',
      principalName: '',
      maxStudents: '1000'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Schools Management
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Configure and oversee all registered schools across the platform
          </p>
        </div>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} /> Add New School
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatCard
          icon={School}
          label="Total Schools"
          value={schools.length}
          trend={`${activeSchools} active on platform`}
          color="var(--accent-primary)"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={totalStudents.toLocaleString()}
          trend="Across registered schools"
          color="var(--accent-cyan)"
        />
        <StatCard
          icon={Users}
          label="Total Teachers"
          value={totalTeachers}
          trend="Active faculty members"
          color="var(--accent-emerald)"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Resource Usage"
          value="85%"
          trend="+5% optimization"
          color="var(--accent-amber)"
        />
      </div>

      {/* Search and Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search schools, locations, or principals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
            />
          </div>
          
          {/* Plan filter */}
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="glass-input"
            style={{ width: '160px' }}
          >
            <option value="all">All Plans</option>
            <option value="Basic">Basic Plan</option>
            <option value="Premium">Premium Plan</option>
            <option value="Enterprise">Enterprise Plan</option>
          </select>

          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              onClick={() => setFilterStatus('all')}
              className={filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={filterStatus === 'active' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={filterStatus === 'inactive' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Schools Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>School Details</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Students</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Teachers</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Subscription</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Usage</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Last Active</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No schools match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school, idx) => {
                  const avatarStyles = [
                    { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(56, 189, 248, 0.5)', color: '#38bdf8', shadow: 'rgba(56, 189, 248, 0.25)' },
                    { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(52, 211, 153, 0.5)', color: '#34d399', shadow: 'rgba(52, 211, 153, 0.25)' },
                    { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(251, 191, 36, 0.5)', color: '#fbbf24', shadow: 'rgba(251, 191, 36, 0.25)' },
                    { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(168, 85, 247, 0.5)', color: '#c084fc', shadow: 'rgba(168, 85, 247, 0.25)' },
                    { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(244, 63, 94, 0.5)', color: '#fb7185', shadow: 'rgba(244, 63, 94, 0.25)' },
                  ];
                  const currentAvatar = avatarStyles[idx % avatarStyles.length];

                  return (
                    <tr key={school.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: currentAvatar.bg,
                            border: currentAvatar.border,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            color: currentAvatar.color,
                            boxShadow: `0 4px 12px ${currentAvatar.shadow}`
                          }}>
                            {school.name.charAt(0)}
                          </div>
                          <div>
                          <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#fff' }}>
                            {school.name}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                            {school.location} • Principal: {school.principalName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${school.status === 'active' ? 'badge-present' : 'badge-absent'}`}>
                        {school.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {school.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                      {school.students.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                      {school.teachers}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: school.plan === 'Enterprise' ? 'rgba(139, 92, 246, 0.2)' :
                                   school.plan === 'Premium' ? 'rgba(99, 102, 241, 0.2)' :
                                   'rgba(107, 114, 128, 0.2)',
                        color: school.plan === 'Enterprise' ? 'var(--accent-purple)' :
                              school.plan === 'Premium' ? 'var(--accent-primary)' :
                              'var(--text-muted)'
                      }}>
                        {school.plan}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {school.usage}%
                        </span>
                        <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${school.usage}%`, height: '100%', background: 'var(--accent-cyan)' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {school.lastActive}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem 0.55rem' }}
                          onClick={() => openDetailsModal(school)}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem 0.55rem' }}
                          onClick={() => openEditModal(school)}
                          title="Edit School"
                        >
                          <Edit size={15} />
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem 0.55rem' }}
                          onClick={() => handleToggleStatus(school)}
                          title={school.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {school.status === 'active' ? <XCircle size={15} /> : <CheckCircle size={15} />}
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem 0.55rem', color: 'var(--accent-red)' }}
                          onClick={() => openDeleteModal(school)}
                          title="Delete School"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <Modal onClose={() => { setShowAddModal(false); resetForm(); }} title="Add New School">
          <SchoolForm formData={formData} setFormData={setFormData} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={() => { setShowAddModal(false); resetForm(); }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={handleAddSchool}
              disabled={!formData.name || !formData.location || !formData.contactEmail}
            >
              Add School
            </button>
          </div>
        </Modal>
      )}

      {/* Edit School Modal */}
      {showEditModal && selectedSchool && (
        <Modal onClose={() => { setShowEditModal(false); resetForm(); setSelectedSchool(null); }} title="Edit School">
          <SchoolForm formData={formData} setFormData={setFormData} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={() => { setShowEditModal(false); resetForm(); setSelectedSchool(null); }}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 1, padding: '0.75rem' }}
              onClick={handleEditSchool}
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* Details School Modal */}
      {showDetailsModal && selectedSchool && (
        <Modal onClose={() => { setShowDetailsModal(false); setSelectedSchool(null); }} title="School Overview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#fff'
              }}>
                {selectedSchool.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{selectedSchool.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedSchool.location}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <DetailBox label="Principal" value={selectedSchool.principalName} icon={Users} />
              <DetailBox label="Subscription Plan" value={selectedSchool.plan} icon={Award} />
              <DetailBox label="Contact Email" value={selectedSchool.contactEmail} icon={Mail} />
              <DetailBox label="Phone Number" value={selectedSchool.contactPhone} icon={Phone} />
              <DetailBox label="Students Enrolled" value={`${selectedSchool.students} / ${selectedSchool.maxStudents}`} icon={Users} />
              <DetailBox label="Faculty Count" value={`${selectedSchool.teachers} Teachers`} icon={School} />
              <DetailBox label="Onboarded Date" value={selectedSchool.joinedDate} icon={Calendar} />
              <DetailBox label="Quota Usage" value={`${selectedSchool.usage}%`} icon={TrendingUp} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                className="btn-primary" 
                style={{ padding: '0.65rem 1.5rem' }}
                onClick={() => { setShowDetailsModal(false); setSelectedSchool(null); }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSchool && (
        <Modal onClose={() => { setShowDeleteModal(false); setSelectedSchool(null); }} title="Delete School">
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
                Delete {selectedSchool.name}?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                This action cannot be undone. All data associated with this school including {selectedSchool.students} students and {selectedSchool.teachers} teachers will be permanently removed.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => { setShowDeleteModal(false); setSelectedSchool(null); }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-red)' }}
                onClick={handleDeleteSchool}
              >
                Delete School
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DetailBox({ label, value, icon: Icon }) {
  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--glass-border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
        <Icon size={13} color="var(--accent-cyan)" />
        {label}
      </div>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
        {value}
      </div>
    </div>
  );
}

function SchoolForm({ formData, setFormData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          School Name *
        </label>
        <input
          type="text"
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter school name"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Location *
        </label>
        <input
          type="text"
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="City, State"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Plan Type *
          </label>
          <select
            className="glass-input"
            style={{ width: '100%' }}
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
          >
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Max Student Capacity
          </label>
          <input
            type="number"
            className="glass-input"
            style={{ width: '100%' }}
            value={formData.maxStudents}
            onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
            placeholder="1000"
          />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Principal Name
        </label>
        <input
          type="text"
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.principalName}
          onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
          placeholder="Principal's full name"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Contact Email *
        </label>
        <input
          type="email"
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          placeholder="school@example.com"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Contact Phone
        </label>
        <input
          type="tel"
          className="glass-input"
          style={{ width: '100%' }}
          value={formData.contactPhone}
          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
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
        maxWidth: '520px',
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

function StatCard({ icon: Icon, label, value, trend, color }) {
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
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {trend}
      </div>
    </div>
  );
}
