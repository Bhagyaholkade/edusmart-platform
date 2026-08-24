import { useState } from 'react';
import { UserCog, Plus, Search, Mail, BookOpen, Award, CheckCircle, XCircle, Trash2, Edit, X } from 'lucide-react';

export default function TeachersManagement({ showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Mathematics',
    assignedClasses: 'Grade 10-A, Grade 10-B',
    status: 'active'
  });

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Dr. Robert Vance',
      email: 'robert.vance@springfield.edu',
      subject: 'Mathematics',
      assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 12-AP'],
      studentsCount: 94,
      status: 'active',
      avgRating: 4.8
    },
    {
      id: 2,
      name: 'Elena Rostova',
      email: 'elena.rostova@springfield.edu',
      subject: 'Physics',
      assignedClasses: ['Grade 11-A', 'Grade 11-B'],
      studentsCount: 62,
      status: 'active',
      avgRating: 4.9
    },
    {
      id: 3,
      name: 'Marcus Brody',
      email: 'marcus.brody@springfield.edu',
      subject: 'History',
      assignedClasses: ['Grade 9-A', 'Grade 9-B', 'Grade 9-C'],
      studentsCount: 110,
      status: 'active',
      avgRating: 4.6
    },
    {
      id: 4,
      name: 'Sarah Connor',
      email: 'sarah.connor@springfield.edu',
      subject: 'English',
      assignedClasses: ['Grade 10-C'],
      studentsCount: 28,
      status: 'inactive',
      avgRating: 4.4
    }
  ]);

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || t.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const handleAddTeacher = () => {
    if (!formData.name || !formData.email) return;

    const newTeacher = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      assignedClasses: formData.assignedClasses.split(',').map(c => c.trim()),
      studentsCount: Math.floor(Math.random() * 50) + 30,
      status: formData.status,
      avgRating: 5.0
    };

    setTeachers([newTeacher, ...teachers]);
    setShowAddModal(false);
    resetForm();
    if (showToast) showToast(`Teacher "${newTeacher.name}" added to school roster`, 'success');
  };

  const handleDeleteTeacher = (id, name) => {
    setTeachers(teachers.filter(t => t.id !== id));
    if (showToast) showToast(`Teacher "${name}" removed from roster`, 'warning');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'Mathematics',
      assignedClasses: 'Grade 10-A, Grade 10-B',
      status: 'active'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Faculty & Teachers Directory
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Manage teaching staff, subjects, and class workload assignments
          </p>
        </div>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} /> Add New Teacher
        </button>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search teachers by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="glass-input"
            style={{ width: '180px' }}
          >
            <option value="all">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="History">History</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* Grid of Teacher Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {filteredTeachers.map((t) => (
          <div key={t.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    fontWeight: 800
                  }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{t.name}</h3>
                    <p style={{ fontSize: '0.775rem', color: 'var(--accent-cyan)' }}>{t.subject} Department</p>
                  </div>
                </div>
                <span className={`badge ${t.status === 'active' ? 'badge-present' : 'badge-absent'}`}>
                  {t.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} /> {t.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={14} /> Classes: {t.assignedClasses.join(', ')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={14} /> {t.studentsCount} Students • ★ {t.avgRating} Feedback Score
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-red)' }}
                onClick={() => handleDeleteTeacher(t.id, t.name)}
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add New Teacher">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Teacher Name *
              </label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@school.edu"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Subject / Department *
              </label>
              <select
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
                <option value="History">History</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Assigned Classes (Comma separated)
              </label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.assignedClasses}
                onChange={(e) => setFormData({ ...formData, assignedClasses: e.target.value })}
                placeholder="Grade 10-A, Grade 10-B"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={handleAddTeacher}>
                Add Teacher
              </button>
            </div>
          </div>
        </Modal>
      )}
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
