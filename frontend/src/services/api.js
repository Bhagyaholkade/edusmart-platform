// API Base URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Maps raw backend/Supabase error text to a clean user-facing message
function friendlyAuthError(rawDetail, status) {
  if (!rawDetail) {
    if (status === 401 || status === 400) return 'Invalid email or password.';
    if (status === 422) return 'Please check the information you entered.';
    if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (status >= 500) return 'Server error. Please try again shortly.';
    return 'Something went wrong. Please try again.';
  }

  const detail = typeof rawDetail === 'string' ? rawDetail : JSON.stringify(rawDetail);

  if (/invalid.*(login|credentials|password|email)/i.test(detail)) return 'Invalid email or password.';
  if (/email.*not.*confirmed/i.test(detail)) return 'Please confirm your email address before signing in.';
  if (/user.*already.*exists|already.*registered/i.test(detail)) return 'An account with this email already exists. Try logging in instead.';
  if (/password.*too.*short|weak.*password/i.test(detail)) return 'Password is too short. Use at least 6 characters.';
  if (/invalid.*email/i.test(detail)) return 'Please enter a valid email address.';
  if (/rate.*limit|too.*many.*requests/i.test(detail)) return 'Too many attempts. Please wait a moment and try again.';

  // Strip JSON noise from the detail string before showing
  return detail.replace(/[{}"\\]/g, '').replace(/detail:/i, '').trim();
}

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (_networkErr) {
    throw new Error('Cannot reach the server. Check your connection and make sure the backend is running.');
  }

  if (!response.ok) {
    // FastAPI returns errors as { detail: "..." } or { detail: [{...}] }
    const body = await response.json().catch(() => ({}));
    const rawDetail = body.detail ?? body.message ?? null;
    throw new Error(friendlyAuthError(rawDetail, response.status));
  }

  return response.json();
}


// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email || credentials.username);
    formData.append('password', credentials.password);
    
    return apiCall('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  },

  register: async (userData) => {
    const formData = new URLSearchParams();
    formData.append('username', userData.email);
    formData.append('password', userData.password);
    // Include other details if backend starts supporting them
    
    return apiCall('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },
};

// Student API
export const studentAPI = {
  getStudents: async (className) => {
    return apiCall(`/students?class=${encodeURIComponent(className)}`);
  },

  getStudent: async (id) => {
    return apiCall(`/students/${id}`);
  },

  updateStudent: async (id, data) => {
    return apiCall(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Attendance API
export const attendanceAPI = {
  getAttendance: async (date, className) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (className) params.append('class', className);
    return apiCall(`/attendance?${params.toString()}`);
  },

  markAttendance: async (data) => {
    return apiCall('/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Marks API
export const marksAPI = {
  getMarks: async (className, studentId) => {
    const params = new URLSearchParams();
    if (className) params.append('class', className);
    if (studentId) params.append('studentId', studentId);
    return apiCall(`/marks?${params.toString()}`);
  },

  submitMarks: async (data) => {
    return apiCall('/marks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Class API
export const classAPI = {
  getClasses: async () => {
    return apiCall('/classes');
  },

  getClass: async (id) => {
    return apiCall(`/classes/${id}`);
  },
};

export default {
  authAPI,
  studentAPI,
  attendanceAPI,
  marksAPI,
  classAPI,
};
