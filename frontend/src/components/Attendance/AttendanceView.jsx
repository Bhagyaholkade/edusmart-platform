import React, { useState } from 'react';
import { 
  Fingerprint, Calendar, CheckCircle2, XCircle, Clock, Search, UserPlus, 
  Sparkles, RefreshCw, Smartphone, Edit3, MessageSquare, BellRing, Phone, 
  Mail, Eye, TrendingUp, BookOpen, AlertCircle, SendHorizontal, X, User 
} from 'lucide-react';

export default function AttendanceView({ role, user }) {
  const [activeClass, setActiveClass] = useState('Grade 10-A (Mathematics)');

  if (role === 'teacher' || role === 'school_admin' || role === 'platform_admin') {
    return <TeacherAttendance activeClass={activeClass} setActiveClass={setActiveClass} user={user} />;
  }

  return <StudentAttendance user={user} />;
}

function TeacherAttendance({ activeClass, setActiveClass, user }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Notification Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Notify Absent Parents Modal state
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [dispatchResultsMap, setDispatchResultsMap] = useState({});
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  // Student Profile Drawer/Modal state
  const [viewingStudentProfile, setViewingStudentProfile] = useState(null);

  // Biometric Modal state
  const [activeScanningStudent, setActiveScanningStudent] = useState(null);
  const [scanMethod, setScanMethod] = useState('fingerprint'); // 'fingerprint' or 'facial'
  const [isScanning, setIsScanning] = useState(false);

  // Add student form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newRollNumber, setNewRollNumber] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');

  // Edit student modal state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRollNumber, setEditRollNumber] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editParentEmail, setEditParentEmail] = useState('');

  // Initial rich student roster with parent contact details
  const [students, setStudents] = useState([
    { 
      id: 1001, 
      name: 'Alex Johnson', 
      rollNumber: '1001', 
      status: 'Present', 
      time: '09:05 AM',
      parentName: 'Sarah Johnson',
      parentPhone: '+1 (555) 234-5678',
      parentEmail: 'sarah.j@gmail.com',
      attendanceRate: 96
    },
    { 
      id: 1002, 
      name: 'Sarah Williams', 
      rollNumber: '1002', 
      status: 'Absent', 
      time: '-',
      parentName: 'David Williams',
      parentPhone: '+1 (555) 876-5432',
      parentEmail: 'david.w@gmail.com',
      attendanceRate: 78
    },
    { 
      id: 1003, 
      name: 'Michael Brown', 
      rollNumber: '1003', 
      status: 'Present', 
      time: '09:02 AM',
      parentName: 'Linda Brown',
      parentPhone: '+1 (555) 345-6789',
      parentEmail: 'linda.b@gmail.com',
      attendanceRate: 94
    },
    { 
      id: 1004, 
      name: 'Emily Davis', 
      rollNumber: '1004', 
      status: 'Late', 
      time: '09:20 AM',
      parentName: 'Robert Davis',
      parentPhone: '+1 (555) 456-7890',
      parentEmail: 'robert.d@gmail.com',
      attendanceRate: 88
    },
    { 
      id: 1005, 
      name: 'James Wilson', 
      rollNumber: '1005', 
      status: 'Present', 
      time: '09:07 AM',
      parentName: 'Karen Wilson',
      parentPhone: '+1 (555) 567-8901',
      parentEmail: 'karen.w@gmail.com',
      attendanceRate: 91
    },
  ]);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const handleMarkAttendance = (studentId, status) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        const nowTime = status === 'Absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return { ...s, status, time: nowTime };
      }
      return s;
    });
    setStudents(updated);

    const studentObj = students.find(s => s.id === studentId);
    if (status === 'Absent' && studentObj) {
      showToast(`Student marked ABSENT. Parent notification ready for ${studentObj.parentName} (${studentObj.parentPhone})`, 'info');
    } else if (status === 'Present') {
      showToast(`Attendance marked PRESENT for ${studentObj?.name}`, 'success');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const absentStudentsList = filteredStudents.filter(s => s.status === 'Absent');

  // Single Parent WhatsApp Alert
  const handleSingleParentWhatsApp = (student) => {
    const parentPhone = (student.parentPhone || '').replace(/[^0-9]/g, '');
    const parentName = student.parentName || 'Parent';
    const text = encodeURIComponent(`EduSmart Attendance Alert: Dear ${parentName}, your child ${student.name} (Roll #${student.rollNumber}) was marked ABSENT today (${selectedDate}) for ${activeClass}. Please contact school administration if you have any questions.`);
    
    window.open(`https://wa.me/${parentPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    
    setDispatchResultsMap(prev => ({
      ...prev,
      [student.id]: {
        status: 'WhatsApp Sent',
        time: new Date().toLocaleTimeString(),
        phone: student.parentPhone
      }
    }));

    showToast(`💬 WhatsApp opened for ${parentName} (${student.parentPhone})!`, 'info');
  };

  // Single Parent SMS Alert
  const handleSingleParentSMS = (student) => {
    const parentPhone = (student.parentPhone || '').replace(/[^0-9]/g, '');
    const parentName = student.parentName || 'Parent';
    const msgText = `EduSmart Alert: Dear ${parentName}, your child ${student.name} was marked ABSENT today (${selectedDate}) in ${activeClass}.`;

    window.open(`sms:${parentPhone}?body=${encodeURIComponent(msgText)}`, '_blank');

    setDispatchResultsMap(prev => ({
      ...prev,
      [student.id]: {
        status: 'SMS Dispatched',
        time: new Date().toLocaleTimeString(),
        phone: student.parentPhone
      }
    }));

    showToast(`📱 SMS alert dispatched to ${parentName} (${student.parentPhone})!`, 'success');
  };

  // Dispatch BOTH WhatsApp & SMS
  const handleSingleParentBoth = (student) => {
    handleSingleParentWhatsApp(student);
    setTimeout(() => {
      handleSingleParentSMS(student);
    }, 400);

    setDispatchResultsMap(prev => ({
      ...prev,
      [student.id]: {
        status: 'WhatsApp & SMS Sent',
        time: new Date().toLocaleTimeString(),
        phone: student.parentPhone
      }
    }));
  };

  // Batch Notify ALL Absent Students' Parents
  const handleNotifyAllAbsentBoth = () => {
    if (absentStudentsList.length === 0) {
      showToast('No absent students found in current roster.', 'info');
      return;
    }

    setNotifyLoading(true);
    setModalSuccessMsg('');

    setTimeout(() => {
      const newMap = { ...dispatchResultsMap };
      absentStudentsList.forEach((student, idx) => {
        newMap[student.id] = {
          status: 'WhatsApp & SMS Sent',
          time: new Date().toLocaleTimeString(),
          phone: student.parentPhone
        };

        const parentPhone = (student.parentPhone || '').replace(/[^0-9]/g, '');
        const parentName = student.parentName || 'Parent';
        const msgText = encodeURIComponent(`EduSmart Attendance Alert: Dear ${parentName}, your child ${student.name} (Roll #${student.rollNumber}) was marked ABSENT today (${selectedDate}) in ${activeClass}.`);

        setTimeout(() => {
          window.open(`https://wa.me/${parentPhone}?text=${msgText}`, '_blank', 'noopener,noreferrer');
        }, idx * 500);
      });

      setDispatchResultsMap(newMap);
      setNotifyLoading(false);
      setModalSuccessMsg(`✅ Both WhatsApp & SMS notifications dispatched to all ${absentStudentsList.length} parents!`);
      showToast(`💬📱 Parent alerts sent to all ${absentStudentsList.length} parents!`, 'success');
    }, 1000);
  };

  // Start Biometric Scan Simulation
  const startBiometricScan = (student) => {
    setActiveScanningStudent(student);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      handleMarkAttendance(student.id, 'Present');
      setTimeout(() => {
        setActiveScanningStudent(null);
      }, 1000);
    }, 1800);
  };

  // Open Edit Modal for a student
  const openEditStudentModal = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditRollNumber(student.rollNumber);
    setEditParentName(student.parentName || 'Parent');
    setEditParentPhone(student.parentPhone || '+1 (555) 000-0000');
    setEditParentEmail(student.parentEmail || 'parent@gmail.com');
  };

  const handleSaveEditStudent = () => {
    if (!editingStudent) return;
    setStudents(students.map(s => 
      s.id === editingStudent.id 
        ? { 
            ...s, 
            name: editName, 
            rollNumber: editRollNumber, 
            parentName: editParentName, 
            parentPhone: editParentPhone, 
            parentEmail: editParentEmail 
          } 
        : s
    ));
    setEditingStudent(null);
    showToast(`Student record & parent contact updated for ${editName}!`, 'success');
  };

  // Add New Student
  const handleAddStudentSubmit = () => {
    if (!newStudentName || !newRollNumber) return;

    const newStudent = {
      id: Date.now(),
      name: newStudentName,
      rollNumber: newRollNumber,
      status: 'Present',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parentName: newParentName || 'Parent',
      parentPhone: newParentPhone || '+1 (555) 999-8888',
      parentEmail: newParentEmail || 'parent@gmail.com',
      attendanceRate: 100
    };

    setStudents([newStudent, ...students]);
    setNewStudentName('');
    setNewRollNumber('');
    setNewParentName('');
    setNewParentPhone('');
    setNewParentEmail('');
    setShowAddModal(false);
    showToast(`Student ${newStudentName} registered successfully into ${activeClass}!`, 'success');
  };

  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;
  const lateCount = students.filter(s => s.status === 'Late').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Floating Notification Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: toastType === 'error' ? 'rgba(244, 63, 94, 0.95)' : toastType === 'info' ? 'rgba(6, 182, 212, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '0.9rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          fontWeight: 700,
          fontSize: '0.9rem',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backdropFilter: 'blur(10px)'
        }}>
          <BellRing size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Fingerprint size={28} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                Biometric Attendance & Parent Notification System
              </h2>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Active Teaching Class:</span>
              <select
                value={activeClass}
                onChange={(e) => setActiveClass(e.target.value)}
                className="glass-input"
                style={{ width: '220px', padding: '0.3rem 0.75rem', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="Grade 10-A (Mathematics)">Grade 10-A (Mathematics)</option>
                <option value="Grade 10-B (Mathematics)">Grade 10-B (Mathematics)</option>
                <option value="Grade 9-A (Physics)">Grade 9-A (Physics)</option>
                <option value="Grade 11-A (Advanced Placement)">Grade 11-A (Advanced)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Batch Notify Absent Parents Button */}
            <button
              onClick={() => {
                setModalSuccessMsg('');
                setShowNotifyModal(true);
              }}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                fontSize: '0.85rem',
                padding: '0.75rem 1.25rem',
                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.35)'
              }}
            >
              <Smartphone size={18} />
              <span>Notify Parents ({absentCount} Absent)</span>
            </button>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Calendar size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--accent-cyan)', pointerEvents: 'none' }} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: '2.5rem', width: '160px', fontWeight: 600 }}
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.75rem 1.25rem' }}
            >
              <UserPlus size={18} /> Register Student
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: '1.25rem', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input
            type="text"
            className="glass-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder={`Search students or roll numbers in ${activeClass}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard icon={CheckCircle2} label="Present Today" value={presentCount} color="var(--accent-emerald)" />
        <StatCard icon={XCircle} label="Absent Today" value={absentCount} color="var(--accent-rose)" />
        <StatCard icon={Clock} label="Late Arrival" value={lateCount} color="var(--accent-amber)" />
        <StatCard icon={User} label="Total Enrolled" value={students.length} color="var(--accent-cyan)" />
      </div>

      {/* Student Roster Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Class Attendance Roster: <span style={{ color: 'var(--accent-cyan)' }}>{activeClass}</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Date: {selectedDate} • Instant Biometric Verification & Parent Alerts
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#fb7185', fontWeight: 700 }}>
              🔴 {absentCount} Absent
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Total: {filteredStudents.length} Students
            </span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Roll #</th>
              <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Parent Name & Contact</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Attendance Rate</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Parent Alert Triggers</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const isAbsent = student.status === 'Absent';
              const dispatchStatus = dispatchResultsMap[student.id];

              return (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#94a3b8' }}>
                    #{student.rollNumber}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => setViewingStudentProfile(student)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.9rem'
                        }}
                      >
                        {student.name}
                      </button>
                      <button
                        onClick={() => openEditStudentModal(student)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-subtle)',
                          cursor: 'pointer',
                          padding: '0.2rem'
                        }}
                        title="Edit Student / Parent Contact Details"
                      >
                        <Edit3 size={13} color="#64748b" />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{student.parentName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                      <Phone size={12} color="#64748b" /> {student.parentPhone}
                    </div>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span className="badge" style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#cbd5e1',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontWeight: 600
                    }}>
                      {student.attendanceRate}%
                    </span>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {student.status === 'Present' && (
                      <span className="badge badge-present">
                        <CheckCircle2 size={13} /> Present
                      </span>
                    )}
                    {student.status === 'Absent' && (
                      <span className="badge badge-absent">
                        <XCircle size={13} /> Absent
                      </span>
                    )}
                    {student.status === 'Late' && (
                      <span className="badge badge-late">
                        <Clock size={13} /> Late
                      </span>
                    )}
                  </td>
                  
                  {/* Direct Parent Alert Column */}
                  <td style={{ padding: '1rem' }}>
                    {isAbsent ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <button
                          onClick={() => handleSingleParentBoth(student)}
                          style={{
                            background: 'rgba(34, 197, 94, 0.12)',
                            border: '1px solid rgba(34, 197, 94, 0.25)',
                            color: '#4ade80',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            width: 'fit-content'
                          }}
                          title="Send WhatsApp & SMS to Parent"
                        >
                          <MessageSquare size={13} color="#4ade80" />
                          <span>Notify Parent</span>
                        </button>

                        {dispatchStatus && (
                          <span style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 600 }}>
                            ✓ {dispatchStatus.status}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>--</span>
                    )}
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        onClick={() => startBiometricScan(student)}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: '#f8fafc' }}
                      >
                        <Fingerprint size={14} color="#38bdf8" /> Biometric
                      </button>

                      <button
                        onClick={() => handleMarkAttendance(student.id, 'Absent')}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem', color: '#f87171', borderColor: isAbsent ? '#ef4444' : 'var(--glass-border)' }}
                      >
                        Absent
                      </button>

                      <button
                        onClick={() => handleMarkAttendance(student.id, 'Late')}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem', color: '#fbbf24' }}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Batch Parent Notification Modal */}
      {showNotifyModal && (
        <Modal onClose={() => setShowNotifyModal(false)} title="Parent Absence Dispatch Center">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fb7185', marginBottom: '0.25rem' }}>
                Batch Alert Summary ({selectedDate})
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {absentStudentsList.length} students are marked ABSENT in {activeClass}. Click below to send automated WhatsApp and SMS alerts directly to all absent parents.
              </p>
            </div>

            {modalSuccessMsg && (
              <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 700 }}>
                {modalSuccessMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {absentStudentsList.map((student) => (
                <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{student.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Parent: {student.parentName} ({student.parentPhone})</span>
                  </div>
                  <button
                    onClick={() => handleSingleParentBoth(student)}
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    Send Alert
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setShowNotifyModal(false)}>
                Close
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }} 
                onClick={handleNotifyAllAbsentBoth}
                disabled={notifyLoading}
              >
                {notifyLoading ? 'Dispatching Alerts...' : `Send WhatsApp & SMS to All (${absentStudentsList.length})`}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Student / Parent Contact Modal */}
      {editingStudent && (
        <Modal onClose={() => setEditingStudent(null)} title={`Edit Parent Contact for ${editingStudent.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Student Name</label>
              <input type="text" className="glass-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Roll Number</label>
              <input type="text" className="glass-input" value={editRollNumber} onChange={(e) => setEditRollNumber(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Parent Name *</label>
              <input type="text" className="glass-input" value={editParentName} onChange={(e) => setEditParentName(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Parent Mobile Phone *</label>
              <input type="tel" className="glass-input" value={editParentPhone} onChange={(e) => setEditParentPhone(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Parent Email</label>
              <input type="email" className="glass-input" value={editParentEmail} onChange={(e) => setEditParentEmail(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setEditingStudent(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={handleSaveEditStudent}>Save Contact Details</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Register Student into Class">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Student Full Name *</label>
              <input type="text" className="glass-input" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Roll Number *</label>
              <input type="text" className="glass-input" value={newRollNumber} onChange={(e) => setNewRollNumber(e.target.value)} placeholder="1006" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Parent Full Name</label>
              <input type="text" className="glass-input" value={newParentName} onChange={(e) => setNewParentName(e.target.value)} placeholder="Robert Doe" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Parent Phone Number *</label>
              <input type="tel" className="glass-input" value={newParentPhone} onChange={(e) => setNewParentPhone(e.target.value)} placeholder="+1 (555) 999-8888" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={handleAddStudentSubmit}>Register Student</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Student Profile Card Drawer */}
      {viewingStudentProfile && (
        <Modal onClose={() => setViewingStudentProfile(null)} title="Student Profile & Attendance History">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                {viewingStudentProfile.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{viewingStudentProfile.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Roll #{viewingStudentProfile.rollNumber} • {activeClass}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <DetailBox label="Attendance Rate" value={`${viewingStudentProfile.attendanceRate}%`} icon={TrendingUp} />
              <DetailBox label="Today Status" value={viewingStudentProfile.status} icon={CheckCircle2} />
              <DetailBox label="Parent Name" value={viewingStudentProfile.parentName} icon={User} />
              <DetailBox label="Parent Contact" value={viewingStudentProfile.parentPhone} icon={Phone} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn-primary" onClick={() => setViewingStudentProfile(null)}>Done</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Interactive Biometric Fingerprint Scanner Modal */}
      {activeScanningStudent && (
        <Modal onClose={() => setActiveScanningStudent(null)} title={`Biometric Scan: ${activeScanningStudent.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              border: isScanning ? '3px solid #34d399' : '3px solid #38bdf8',
              background: isScanning ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: isScanning ? '0 0 25px rgba(52, 211, 153, 0.3)' : '0 0 15px rgba(56, 189, 248, 0.2)'
            }}>
              <Fingerprint size={60} color={isScanning ? '#34d399' : '#38bdf8'} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                {isScanning ? 'Scanning Biometric Fingerprint...' : '✅ Attendance Verified & Recorded!'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Student: <strong style={{ color: '#fff' }}>{activeScanningStudent.name}</strong> (Roll #{activeScanningStudent.rollNumber})
              </p>
            </div>

            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={() => setActiveScanningStudent(null)}
            >
              Close Scanner
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StudentAttendance({ user }) {
  const attendanceRate = 94.2;
  const monthData = [
    { date: '2024-01-15', status: 'present' },
    { date: '2024-01-16', status: 'present' },
    { date: '2024-01-17', status: 'absent' },
    { date: '2024-01-18', status: 'present' },
    { date: '2024-01-19', status: 'present' },
    { date: '2024-01-22', status: 'present' },
    { date: '2024-01-23', status: 'late' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>My Attendance Activity</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Track your daily attendance and biometric records</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>{attendanceRate}%</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>Overall Attendance Rate</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Present 17 out of 18 days this month</div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
      <Icon size={28} color={color} style={{ marginBottom: '0.5rem' }} />
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function DetailBox({ label, value, icon: Icon }) {
  return (
    <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
        <Icon size={13} color="var(--accent-cyan)" /> {label}
      </div>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{value}</div>
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
