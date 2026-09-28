// API Base URL Configuration (FastAPI Backend v1)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Helper to get JWT token from localStorage
function getAuthToken() {
  return localStorage.getItem('edusmart_token') || null;
}

// Maps raw backend error text to a user-friendly message
function friendlyAuthError(rawDetail, status) {
  if (!rawDetail) {
    if (status === 401 || status === 400) return 'Invalid email or password.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 422) return 'Please check the information you entered.';
    if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (status >= 500) return 'Server error. Please try again shortly.';
    return 'Something went wrong. Please try again.';
  }

  const detail = typeof rawDetail === 'string' ? rawDetail : JSON.stringify(rawDetail);

  if (/invalid.*(login|credentials|password|email)/i.test(detail)) return 'Invalid email or password.';
  if (/email.*not.*confirmed/i.test(detail)) return 'Please confirm your email address before signing in.';
  if (/user.*already.*exists|already.*registered/i.test(detail)) return 'An account with this email already exists.';
  if (/password.*too.*short|weak.*password/i.test(detail)) return 'Password is too short. Use at least 6 characters.';
  if (/invalid.*email/i.test(detail)) return 'Please enter a valid email address.';
  if (/rate.*limit|too.*many.*requests/i.test(detail)) return 'Too many attempts. Please wait a moment and try again.';

  return detail.replace(/[{}"\\]/g, '').replace(/detail:/i, '').trim();
}

// Base HTTP request wrapper with JWT header injection & network fallback handling
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (_networkErr) {
    console.warn(`[EduSmart API] Cannot reach backend at ${url}. Operating in local fallback mode.`);
    throw new Error('NETWORK_OFFLINE');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const rawDetail = body.detail ?? body.message ?? null;
    throw new Error(friendlyAuthError(rawDetail, response.status));
  }

  return response.json();
}

// --- Authentication API ---
export const authAPI = {
  login: async (credentials) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.email || credentials.username);
      formData.append('password', credentials.password);
      
      const data = await apiCall('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (data.access_token) {
        localStorage.setItem('edusmart_token', data.access_token);
      }

      return data;
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        // Mock fallback for offline dev mode
        const mockUser = {
          id: 'usr_mock_123',
          email: credentials.email || 'user@edusmart.ai',
          name: credentials.email ? credentials.email.split('@')[0] : 'Demo User',
          role: credentials.role || 'teacher',
          schoolName: 'Greenwood High School'
        };
        const mockToken = 'mock_jwt_token_12345';
        localStorage.setItem('edusmart_token', mockToken);
        return { access_token: mockToken, token_type: 'bearer', role: mockUser.role, user: mockUser };
      }
      throw err;
    }
  },

  register: async (userData) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', userData.email);
      formData.append('password', userData.password);

      const data = await apiCall('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (data.access_token) {
        localStorage.setItem('edusmart_token', data.access_token);
      }

      return data;
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        const mockUser = {
          id: 'usr_mock_reg_' + Date.now(),
          email: userData.email,
          name: userData.fullName || userData.email.split('@')[0],
          role: userData.role || 'teacher',
          schoolName: userData.schoolName || 'EduSmart Partner School'
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('edusmart_token', mockToken);
        return { access_token: mockToken, token_type: 'bearer', role: mockUser.role, user: mockUser };
      }
      throw err;
    }
  },

  getMe: async () => {
    try {
      return await apiCall('/auth/me');
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return null;
      }
      throw err;
    }
  },

  logout: async () => {
    localStorage.removeItem('edusmart_token');
    return { success: true };
  },
};

// --- Academic Hierarchy API (Schools, Classes, Subjects) ---
export const academicAPI = {
  getSchools: async (skip = 0, limit = 100) => {
    try {
      return await apiCall(`/academic/schools?skip=${skip}&limit=${limit}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { id: 1, name: 'Greenwood High School', code: 'GHS-01', address: '123 Education Lane', active: true },
          { id: 2, name: 'St. Xavier Academy', code: 'SXA-02', address: '456 Campus Road', active: true },
        ];
      }
      throw err;
    }
  },

  getSchool: async (schoolId) => {
    return apiCall(`/academic/schools/${schoolId}`);
  },

  createSchool: async (schoolData) => {
    return apiCall('/academic/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  },

  updateSchool: async (schoolId, schoolData) => {
    return apiCall(`/academic/schools/${schoolId}`, {
      method: 'PUT',
      body: JSON.stringify(schoolData),
    });
  },

  deleteSchool: async (schoolId) => {
    return apiCall(`/academic/schools/${schoolId}`, {
      method: 'DELETE',
    });
  },

  getClasses: async (schoolId, skip = 0, limit = 100) => {
    try {
      return await apiCall(`/academic/schools/${schoolId}/classes?skip=${skip}&limit=${limit}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { id: 101, grade_level: 'Grade 10', section: 'A', room_number: 'Room 201' },
          { id: 102, grade_level: 'Grade 10', section: 'B', room_number: 'Room 202' },
          { id: 103, grade_level: 'Grade 9', section: 'A', room_number: 'Room 101' },
        ];
      }
      throw err;
    }
  },

  createClass: async (schoolId, classData) => {
    return apiCall(`/academic/schools/${schoolId}/classes`, {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  getSubjects: async (skip = 0, limit = 100) => {
    try {
      return await apiCall(`/academic/subjects?skip=${skip}&limit=${limit}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { id: 1, name: 'Mathematics', code: 'MATH-10' },
          { id: 2, name: 'Physics', code: 'PHY-10' },
          { id: 3, name: 'Chemistry', code: 'CHEM-10' },
          { id: 4, name: 'English Literature', code: 'ENG-10' },
        ];
      }
      throw err;
    }
  },

  createSubject: async (subjectData) => {
    return apiCall('/academic/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  },

  assignSubjectToClass: async (classId, subjectId) => {
    return apiCall(`/academic/classes/${classId}/subjects/${subjectId}`, {
      method: 'POST',
    });
  },
};

// --- User Management API ---
export const usersAPI = {
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.school_id) params.append('school_id', filters.school_id);
      if (filters.is_approved !== undefined) params.append('is_approved', filters.is_approved);
      if (filters.skip) params.append('skip', filters.skip);
      if (filters.limit) params.append('limit', filters.limit);
      return await apiCall(`/users/?${params.toString()}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { id: 'usr_t1', name: 'Dr. Sarah Jenkins', email: 'sarah.j@edusmart.ai', role: 'teacher', is_approved: true },
          { id: 'usr_s1', name: 'Alex Johnson', email: 'alex.j@edusmart.ai', role: 'student', is_approved: true },
          { id: 'usr_s2', name: 'Emily Davis', email: 'emily.d@edusmart.ai', role: 'student', is_approved: true },
        ];
      }
      throw err;
    }
  },

  getUser: async (userId) => {
    return apiCall(`/users/${userId}`);
  },

  approveUser: async (userId, approvalData) => {
    return apiCall(`/users/${userId}/approve`, {
      method: 'PUT',
      body: JSON.stringify(approvalData),
    });
  },

  enrollStudent: async (studentId, classId) => {
    return apiCall(`/users/students/${studentId}/enroll?class_id=${classId}`, {
      method: 'POST',
    });
  },

  assignTeacher: async (teacherId, assignment) => {
    return apiCall(`/users/teachers/${teacherId}/assignments`, {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  },

  linkParentStudent: async (linkData) => {
    return apiCall('/users/parents/link', {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  },
};

// --- Attendance Engine API ---
export const attendanceAPI = {
  markBulkAttendance: async (payload) => {
    try {
      return await apiCall('/attendance/bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return payload.records.map((r, idx) => ({
          id: Date.now() + idx,
          student_id: r.student_id,
          class_id: payload.class_id,
          attendance_date: payload.attendance_date,
          status: r.status,
          notes: r.notes || null,
        }));
      }
      throw err;
    }
  },

  updateAttendance: async (recordId, payload) => {
    return apiCall(`/attendance/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  getClassAttendance: async (classId, attendanceDate) => {
    try {
      return await apiCall(`/attendance/class/${classId}?attendance_date=${attendanceDate}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { id: 1, student_id: 'std_101', student_name: 'Alex Johnson', roll_number: '101', status: 'present' },
          { id: 2, student_id: 'std_102', student_name: 'Emily Davis', roll_number: '102', status: 'present' },
          { id: 3, student_id: 'std_103', student_name: 'Michael Brown', roll_number: '103', status: 'absent' },
          { id: 4, student_id: 'std_104', student_name: 'Sophia Wilson', roll_number: '104', status: 'late' },
        ];
      }
      throw err;
    }
  },

  getStudentAttendance: async (studentId, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.class_id) params.append('class_id', options.class_id);
      if (options.from_date) params.append('from_date', options.from_date);
      if (options.to_date) params.append('to_date', options.to_date);
      return await apiCall(`/attendance/student/${studentId}?${params.toString()}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { attendance_date: '2026-09-08', status: 'present' },
          { attendance_date: '2026-09-09', status: 'present' },
          { attendance_date: '2026-09-10', status: 'present' },
        ];
      }
      throw err;
    }
  },
};

// --- Assessment & Marks Pipeline API ---
export const assessmentAPI = {
  getAssessments: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.class_id) params.append('class_id', options.class_id);
      if (options.subject_id) params.append('subject_id', options.subject_id);
      if (options.skip) params.append('skip', options.skip);
      if (options.limit) params.append('limit', options.limit);
      return await apiCall(`/assessments/?${params.toString()}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { id: 1, title: 'Mathematics Midterm Exam', max_marks: 100, assessment_date: '2026-09-01', type: 'EXAM' },
          { id: 2, title: 'Physics Quiz 3: Electromagnetism', max_marks: 20, assessment_date: '2026-09-07', type: 'QUIZ' },
          { id: 3, title: 'Organic Chemistry Test 1', max_marks: 50, assessment_date: '2026-09-15', type: 'TEST' },
        ];
      }
      throw err;
    }
  },

  getAssessment: async (assessmentId) => {
    return apiCall(`/assessments/${assessmentId}`);
  },

  createAssessment: async (assessmentData) => {
    return apiCall('/assessments/', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  },

  updateAssessment: async (assessmentId, assessmentData) => {
    return apiCall(`/assessments/${assessmentId}`, {
      method: 'PUT',
      body: JSON.stringify(assessmentData),
    });
  },

  deleteAssessment: async (assessmentId) => {
    return apiCall(`/assessments/${assessmentId}`, {
      method: 'DELETE',
    });
  },

  submitMarks: async (assessmentId, payload) => {
    try {
      return await apiCall(`/assessments/${assessmentId}/marks`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return payload.marks.map((r, idx) => ({
          id: Date.now() + idx,
          assessment_id: assessmentId,
          student_id: r.student_id,
          score: r.score,
          remarks: r.remarks || null,
        }));
      }
      throw err;
    }
  },

  getAssessmentResults: async (assessmentId) => {
    return apiCall(`/assessments/${assessmentId}/results`);
  },

  getStudentResults: async (studentId, classId) => {
    try {
      const params = new URLSearchParams();
      if (classId) params.append('class_id', classId);
      return await apiCall(`/assessments/student/${studentId}/results?${params.toString()}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { assessment_title: 'Mathematics Midterm Exam', marks_obtained: 94, max_marks: 100, grade: 'A+' },
          { assessment_title: 'Physics Quiz 3', marks_obtained: 18, max_marks: 20, grade: 'A' },
          { assessment_title: 'Chemistry Test 1', marks_obtained: 44, max_marks: 50, grade: 'A-' },
        ];
      }
      throw err;
    }
  },

  getAssessmentAggregation: async (assessmentId) => {
    try {
      return await apiCall(`/assessments/${assessmentId}/aggregation`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return {
          assessment_id: assessmentId,
          total_students: 32,
          submitted_count: 32,
          average_score: 87.4,
          highest_score: 100,
          lowest_score: 62,
        };
      }
      throw err;
    }
  },
};

// --- Student Intelligence API ---
export const intelligenceAPI = {
  getStudentProfile: async (studentId) => {
    try {
      return await apiCall(`/intelligence/students/${studentId}/profile`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return {
          id: 1,
          student_id: studentId,
          overall_health_score: 92.5,
          strengths: ['Mathematics', 'Physics', 'Calculus Differentiation', 'Optics Wave Theory'],
          weaknesses: ['Chemistry', 'History'],
          updated_at: new Date().toISOString()
        };
      }
      throw err;
    }
  },

  refreshStudentProfile: async (studentId) => {
    return apiCall(`/intelligence/students/${studentId}/profile/refresh`, {
      method: 'POST',
    });
  },

  getRiskSignals: async (studentId, includeResolved = false) => {
    try {
      return await apiCall(`/intelligence/students/${studentId}/risks?include_resolved=${includeResolved}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return [
          { id: 1, student_id: studentId, signal_type: 'GRADE_DROP', severity: 'MEDIUM', description: 'Score dropped by 8% in Chemistry Unit 2 Test', is_resolved: false },
        ];
      }
      throw err;
    }
  },

  resolveRiskSignal: async (signalId, resolveData) => {
    return apiCall(`/intelligence/risks/${signalId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify(resolveData),
    });
  },

  getStudentDashboard: async (studentId) => {
    try {
      return await apiCall(`/intelligence/students/${studentId}/dashboard`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return {
          profile: {
            id: 1,
            student_id: studentId,
            overall_health_score: 92.5,
            strengths: ['Mathematics', 'Physics'],
            weaknesses: ['History'],
            updated_at: new Date().toISOString()
          },
          active_risk_signals: [],
          attendance_rate: 98.2,
          average_score: 91.0
        };
      }
      throw err;
    }
  },
};

// --- Analytics API ---
export const analyticsAPI = {
  getSchoolAnalytics: async (schoolId) => {
    try {
      return await apiCall(`/analytics/school/${schoolId}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return {
          school_id: schoolId,
          school_name: 'Mock School',
          total_students: 1200,
          total_teachers: 85,
          total_classes: 30,
          overall_attendance_rate_pct: 95.5,
          overall_average_score_pct: 82.3,
          active_risk_signals: 15,
          classes: [
            { class_id: 1, grade_level: 'Grade 10', section: 'A', total_students: 35, average_health_score: 88, attendance_rate_pct: 94, average_score_pct: 85 },
            { class_id: 2, grade_level: 'Grade 10', section: 'B', total_students: 30, average_health_score: 85, attendance_rate_pct: 92, average_score_pct: 80 },
          ],
          top_subjects: [
            { subject_id: 1, subject_name: 'Mathematics', average_score_pct: 88, pass_rate_pct: 95, total_assessments: 10 },
            { subject_id: 2, subject_name: 'Physics', average_score_pct: 85, pass_rate_pct: 92, total_assessments: 8 },
          ],
          performance_trend: [
            { label: 'Jan 2026', score_pct: 78.4 },
            { label: 'Feb 2026', score_pct: 80.1 },
            { label: 'Mar 2026', score_pct: 79.5 },
            { label: 'Apr 2026', score_pct: 81.2 },
            { label: 'May 2026', score_pct: 83.5 },
            { label: 'Jun 2026', score_pct: 82.3 },
          ]
        };
      }
      throw err;
    }
  },

  getTeacherClassAnalytics: async (classId) => {
    try {
      return await apiCall(`/analytics/teacher/class/${classId}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return {
          teacher_id: 't_mock',
          class_id: classId,
          grade_level: 'Grade 10',
          section: 'A',
          total_students: 35,
          class_attendance_rate_pct: 94.2,
          class_average_score_pct: 85.5,
          pass_rate_pct: 92.0,
          at_risk_student_count: 3,
          subject_performance: [
            { subject_id: 1, subject_name: 'Mathematics', average_score_pct: 88, pass_rate_pct: 95, total_assessments: 10 },
            { subject_id: 2, subject_name: 'Physics', average_score_pct: 85, pass_rate_pct: 92, total_assessments: 8 },
          ],
          student_summaries: [
            { student_id: 's_mock1', full_name: 'Alex Johnson', health_score: 92.5, attendance_rate_pct: 98, average_score_pct: 91, active_risk_count: 0 },
            { student_id: 's_mock2', full_name: 'Sarah Williams', health_score: 75.0, attendance_rate_pct: 82, average_score_pct: 70, active_risk_count: 1 },
          ],
          performance_trend: [
            { label: 'Jan 2026', score_pct: 81.0 },
            { label: 'Feb 2026', score_pct: 82.5 },
            { label: 'Mar 2026', score_pct: 82.0 },
            { label: 'Apr 2026', score_pct: 84.5 },
            { label: 'May 2026', score_pct: 86.0 },
            { label: 'Jun 2026', score_pct: 85.5 },
          ]
        };
      }
      throw err;
    }
  },

  getStudentAnalytics: async (studentId) => {
    try {
      return await apiCall(`/analytics/student/${studentId}`);
    } catch (err) {
      if (err.message === 'NETWORK_OFFLINE') {
        return {
          student_id: studentId,
          full_name: 'Alex Johnson',
          grade_level: 'Grade 10',
          section: 'A',
          overall_health_score: 92.5,
          attendance: { total_records: 30, present_count: 28, attendance_rate_pct: 93.3 },
          average_score_pct: 91.0,
          risk_summary: { total_active_signals: 0, high_severity: 0, medium_severity: 0, low_severity: 0 },
          subject_performance: [
            { subject_id: 1, subject_name: 'Mathematics', average_score_pct: 94, pass_rate_pct: 100, total_assessments: 5 },
            { subject_id: 2, subject_name: 'Physics', average_score_pct: 88, pass_rate_pct: 100, total_assessments: 4 },
          ],
          recent_results: [
            { assessment_id: 1, assessment_title: 'Math Midterm', assessment_type: 'EXAM', subject_name: 'Mathematics', score: 94, max_score: 100, score_pct: 94, scheduled_date: '2026-09-01' },
          ],
          performance_trend: [
            { label: 'Jan 2026', score_pct: 88.0 },
            { label: 'Feb 2026', score_pct: 89.5 },
            { label: 'Mar 2026', score_pct: 90.0 },
            { label: 'Apr 2026', score_pct: 89.0 },
            { label: 'May 2026', score_pct: 91.5 },
            { label: 'Jun 2026', score_pct: 91.0 },
          ]
        };
      }
      throw err;
    }
  }
};

export default {
  authAPI,
  academicAPI,
  usersAPI,
  attendanceAPI,
  assessmentAPI,
  intelligenceAPI,
  analyticsAPI,
};
