const API_BASE = '/api';

export const studentAuthAPI = {
  login: async (schoolName, rollNumberOrEmail, password) => {
    const res = await fetch(`${API_BASE}/auth/student-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolName, rollNumberOrEmail, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Student login failed');
    return data;
  },

  signup: async (studentData) => {
    const res = await fetch(`${API_BASE}/auth/student-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Student signup failed');
    return data;
  },

  getDashboard: async (studentId) => {
    const res = await fetch(`${API_BASE}/student/dashboard/${studentId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load student dashboard');
    return data;
  }
};
