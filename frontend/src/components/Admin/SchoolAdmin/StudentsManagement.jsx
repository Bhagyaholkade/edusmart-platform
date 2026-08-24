import { useState } from 'react';
import { GraduationCap, Search, UserPlus, Calendar, Award, AlertCircle, CheckCircle, XCircle, Trash2, X } from 'lucide-react';

export default function StudentsManagement({ showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    className: 'Grade 10-A',
    email: '',
    parentPhone: ''
  });

  const [students, setStudents] = useState([
    {
      id: 1001,
      name: 'Alex Johnson',
      rollNo: '1001',
      className: 'Grade 10-A',
      email: 'alex.j@student.springfield.edu',
      attendanceRate: '94.2%',
      overallGrade: 'A',
      status: 'on_track'
    },
    {
      id: 1002,
      name: 'Sarah Williams',
      rollNo: '1002',
      className: 'Grade 10-A',
      email: 'sarah.w@student.springfield.edu',
      attendanceRate: '78.5%',
      overallGrade: 'C',
      status: 'at_risk'
    },
    {
      id: 1003,
      name: 'Michael Brown',
      rollNo: '1003',
      className: 'Grade 10-B',
      email: 'michael.b@student.springfield.edu',
      attendanceRate: '96.0%',
      overallGrade: 'A+',
      status: 'on_track'
    },
    {
      id: 1004,
      name: 'Emily Davis',
      rollNo: '1004',
      className: 'Grade 9-A',
      email: 'emily.d@student.springfield.edu',
      attendanceRate: '88.1%',
      overallGrade: 'B',
      status: 'on_track'
    }
  ]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.rollNo.includes(searchQuery) ||
                         s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || s.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleAddStudent = () => {
    if (!formData.name || !formData.rollNo) return;

    const newStudent = {
      id: Date.now(),
      name: formData.name,
      rollNo: formData.rollNo,
      className: formData.className,
      email: formData.email || `${formData.name.toLowerCase().replace(' ', '.')}@student.springfield.edu`,
      attendanceRate: '100%',
      overallGrade: 'N/A',
      status: 'on_track'
    };

    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    resetForm();
    if (showToast) showToast(`Student "${newStudent.name}" enrolled successfully`, 'success');
  };

  const handleDeleteStudent = (id, name) => {
    setStudents(students.filter(s => s.id !== id));
    if (showToast) showToast(`Student "${name}" removed from school records`, 'warning');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rollNo: '',
      className: 'Grade 10-A',
      email: '',
      parentPhone: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            School Student Directory
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Monitor student enrollment, attendance rates, academic standing, and intervention alerts
          </p>
        </div>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={18} /> Enroll New Student
        </button>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search students by name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="glass-input"
            style={{ width: '180px' }}
          >
            <option value="all">All Classes</option>
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
            <option value="Grade 9-A">Grade 9-A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Student Name</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Roll No</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Class</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Attendance</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Overall Grade</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Risk Status</th>
                <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(6, 182, 212, 0.2)',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)',
                        fontWeight: 800
                      }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                    {s.rollNo}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {s.className}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {s.attendanceRate}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {s.overallGrade}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span className={`badge ${s.status === 'on_track' ? 'badge-present' : 'badge-absent'}`}>
                      {s.status === 'on_track' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {s.status === 'on_track' ? 'On Track' : 'Needs Support'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-red)' }}
                      onClick={() => handleDeleteStudent(s.id, s.name)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Enroll New Student">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Full Student Name *
              </label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Roll Number *
                </label>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%' }}
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="1005"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Assigned Class *
                </label>
                <select
                  className="glass-input"
                  style={{ width: '100%' }}
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 9-A">Grade 9-A</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Student Email
              </label>
              <input
                type="email"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane.doe@student.springfield.edu"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={handleAddStudent}>
                Enroll Student
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
