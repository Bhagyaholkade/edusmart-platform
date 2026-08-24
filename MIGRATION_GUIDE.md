# Migration Guide: Separate Frontends → Unified Frontend

## Overview

This guide explains how we've consolidated the separate `Teacher-frontend` and `Student-frontend` applications into a single unified `frontend` application with role-based access control.

## What Changed?

### Before (Separate Frontends)
```
Teacher-frontend/  (Port 5173)
  ├── src/
  │   ├── components/
  │   ├── services/
  │   └── App.jsx
  └── package.json

Student-frontend/  (Port 5174)
  ├── src/
  │   ├── components/
  │   ├── services/
  │   └── App.jsx
  └── package.json
```

### After (Unified Frontend)
```
frontend/  (Port 5173)
  ├── src/
  │   ├── components/
  │   │   ├── Auth/
  │   │   │   ├── Login.jsx (role selector)
  │   │   │   └── Register.jsx
  │   │   ├── Dashboard/
  │   │   │   ├── Header.jsx (role-adaptive)
  │   │   │   ├── Sidebar.jsx (role-based nav)
  │   │   │   └── Overview.jsx (role-specific)
  │   │   ├── Attendance/
  │   │   │   └── AttendanceView.jsx (both roles)
  │   │   ├── Marks/
  │   │   │   └── MarksView.jsx (both roles)
  │   │   └── Profile/
  │   │       └── ProfileView.jsx (both roles)
  │   ├── services/
  │   │   └── api.js
  │   └── App.jsx (role routing)
  └── package.json
```

## Key Benefits

✅ **Single Codebase** - Easier maintenance and updates  
✅ **Consistent UI/UX** - Same design system for both roles  
✅ **Reduced Duplication** - Shared components and styles  
✅ **Role-Based Access** - Dynamic content based on user role  
✅ **Smaller Bundle Size** - No duplicate dependencies  

## How It Works

### 1. Unified Login
Users select their role (Student/Teacher) before logging in:

```javascript
// Login.jsx
<button onClick={() => setRole('student')}>Student</button>
<button onClick={() => setRole('teacher')}>Teacher</button>
```

### 2. Role Storage
User role is stored in the session:

```javascript
const user = {
  id: 123,
  name: 'John Doe',
  role: 'teacher', // or 'student'
  email: 'john@school.edu'
};
localStorage.setItem('edusmart_user', JSON.stringify(user));
```

### 3. Role-Based Rendering
Components adapt based on user role:

```javascript
// AttendanceView.jsx
export default function AttendanceView({ role, user }) {
  if (role === 'teacher') {
    return <TeacherAttendance />;  // Attendance management
  }
  return <StudentAttendance />;     // Attendance viewing
}
```

### 4. Dynamic Navigation
Sidebar shows different options per role:

```javascript
// Sidebar.jsx
const teacherTabs = ['Overview', 'Attendance', 'Marks Entry', 'AI Feedback', 'Profile'];
const studentTabs = ['Overview', 'Attendance', 'Grades', 'Subjects', 'Profile'];
const tabs = role === 'teacher' ? teacherTabs : studentTabs;
```

## Migration Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Test Both Roles

**Teacher Login:**
- Role: Teacher
- Email: `teacher@edusmart.edu`
- Password: `teacher123`

**Student Login:**
- Role: Student
- Roll Number: `1001`
- Password: `student123`

### Step 4: Verify Features

**Teacher Features:**
- ✅ Biometric attendance management
- ✅ Marks entry for students
- ✅ AI feedback generation
- ✅ Class roster management
- ✅ Teacher profile

**Student Features:**
- ✅ Attendance viewing & calendar
- ✅ Gradebook & scores
- ✅ Subject performance
- ✅ Personal profile
- ✅ Academic statistics

## Component Mapping

### Teacher Components → Unified
| Old Component | New Component | Location |
|--------------|---------------|----------|
| `BiometricAttendance.jsx` | `AttendanceView.jsx` (teacher mode) | `components/Attendance/` |
| `ExamMarks.jsx` | `MarksView.jsx` (teacher mode) | `components/Marks/` |
| `TeacherProfile.jsx` | `ProfileView.jsx` (teacher mode) | `components/Profile/` |
| `Overview.jsx` | `Overview.jsx` (teacher mode) | `components/Dashboard/` |

### Student Components → Unified
| Old Component | New Component | Location |
|--------------|---------------|----------|
| `StudentAttendanceActivity.jsx` | `AttendanceView.jsx` (student mode) | `components/Attendance/` |
| `StudentGradebook.jsx` | `MarksView.jsx` (student mode) | `components/Marks/` |
| `StudentProfileView.jsx` | `ProfileView.jsx` (student mode) | `components/Profile/` |
| `StudentOverview.jsx` | `Overview.jsx` (student mode) | `components/Dashboard/` |

## Backend Compatibility

The unified frontend works with **existing backend APIs** - no changes needed!

### API Endpoints (unchanged)
```
POST   /api/auth/login
GET    /api/students
GET    /api/attendance
POST   /api/attendance
GET    /api/marks
POST   /api/marks
```

The backend should return user role in authentication response:
```json
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@school.edu",
    "role": "teacher"
  },
  "token": "jwt_token_here"
}
```

## Old Frontends

The old `Teacher-frontend` and `Student-frontend` folders are now deprecated but kept for reference. They're added to `.gitignore` so they won't be tracked in version control.

You can safely delete them once you've verified the unified frontend works:
```bash
rm -rf Teacher-frontend Student-frontend
```

## Development Workflow

### Running the Unified Frontend
```bash
cd frontend
npm run dev
# Opens on http://localhost:5173
```

### Building for Production
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

### Preview Production Build
```bash
cd frontend
npm run preview
```

## Troubleshooting

### Issue: Role not persisting after refresh
**Solution:** Check localStorage - ensure `edusmart_user` contains `role` field

### Issue: Wrong content showing for role
**Solution:** Verify `currentUser.role` is either `'teacher'` or `'student'`

### Issue: API calls failing
**Solution:** Check `VITE_API_URL` in `.env` file points to correct backend

### Issue: Styles not loading
**Solution:** Ensure `index.css` is imported in `main.jsx`

## Next Steps

1. ✅ Test both teacher and student flows
2. ✅ Verify all features work correctly
3. ✅ Connect to real backend APIs
4. ✅ Add role-based route protection
5. ✅ Deploy unified frontend
6. ✅ Update documentation
7. ✅ Remove old frontend folders

## Questions?

If you encounter issues during migration, check:
- Browser console for errors
- Network tab for API calls
- localStorage for user session data
- Component props for role passing

## Summary

✨ **One codebase, two interfaces, seamless experience!**

The unified frontend maintains all functionality from both old frontends while providing:
- Consistent design language
- Easier maintenance
- Better code reusability
- Smaller deployment size
- Single authentication flow
