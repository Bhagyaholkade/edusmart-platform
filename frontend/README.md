# EduSmart Unified Frontend

## Overview
This is a **unified role-based frontend** for the EduSmart Platform that serves both Teachers and Students from a single codebase. The UI adapts based on the user's role after login.

## Key Features

### ✅ Single Codebase, Multiple Roles
- One application serves both teachers and students
- UI components adapt based on user role
- Role-based navigation and features
- Shared design system and components

### ✅ Role-Based Access Control
- **Teachers**: Access to attendance management, marks entry, AI feedback generation
- **Students**: View attendance records, check grades, track performance

### ✅ Unified Login
- Single login page with role selector (Student/Teacher)
- Different authentication fields based on role
- Session management with role persistence

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx          # Unified login with role selector
│   │   │   └── Register.jsx       # Registration component
│   │   └── Dashboard/
│   │       ├── Header.jsx         # Role-adaptive header
│   │       ├── Sidebar.jsx        # Role-based navigation
│   │       └── Overview.jsx       # Role-specific dashboard
│   ├── services/
│   │   └── api.js                 # Centralized API calls
│   ├── App.jsx                    # Main app with role routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Unified styles
├── index.html
├── package.json
└── vite.config.js
```

## How It Works

### 1. Login Flow
User selects role (Student/Teacher) → Enters credentials → System authenticates → Role is stored in user session

### 2. Dashboard Rendering
```javascript
// App.jsx checks user role and renders appropriate views
const userRole = currentUser.role; // 'teacher' or 'student'

// Components receive role prop
<Sidebar role={userRole} />
<Overview role={userRole} />
```

### 3. Navigation
- Teachers see: Overview, Attendance, Marks Entry, AI Feedback, Profile
- Students see: Overview, Attendance, Grades, Subjects, Profile

### 4. Content Adaptation
Same component files render different content based on role:
```javascript
{role === 'teacher' ? (
  <TeacherAttendanceManagement />
) : (
  <StudentAttendanceView />
)}
```

## Installation

```bash
cd frontend
npm install
npm run dev
```

## Demo Credentials

### Teacher Login
- Email: `teacher@edusmart.edu`
- Password: `teacher123`

### Student Login
- Roll Number: `1001`
- Password: `student123`

## Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Benefits of Unified Approach

1. **Maintainability**: Single codebase reduces duplication
2. **Consistency**: Same UI/UX patterns across roles
3. **Shared Components**: Reusable components for both roles
4. **Easier Updates**: Changes apply to both interfaces
5. **Reduced Bundle Size**: No duplicate dependencies

## Migration from Separate Frontends

If you had separate `Teacher-frontend` and `Student-frontend`:
1. This unified frontend replaces both
2. Backend APIs remain the same
3. User roles are handled by authentication system
4. All features from both frontends are preserved

## Next Steps

To complete the implementation:
1. Add remaining teacher components (Attendance Management, Marks Entry, AI Feedback)
2. Add remaining student components (Subject Performance, Gradebook)
3. Connect to actual backend API endpoints
4. Add role-based route protection
5. Implement profile management for both roles
