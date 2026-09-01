// API Base URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
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
