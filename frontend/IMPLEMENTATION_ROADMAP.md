# AI Learning Platform - Frontend Implementation Roadmap

## Overview
This roadmap aligns with the **AI Learning Intelligence Platform Frontend Requirements V1** document. We're building a unified, role-aware platform for Platform Admin, School Admin, Teachers, and Students.

## ✅ Completed (Current State)

### Core Infrastructure
- [x] Unified authentication flow (no role selection on login)
- [x] Role-based routing and navigation
- [x] Responsive application shell (Header, Sidebar, Main)
- [x] Protected routes with session handling
- [x] Role-aware dashboard shells for all 4 roles
- [x] Glassmorphism design system with Tailwind CSS
- [x] API service layer structure

### Components Built
- [x] Login (backend determines role)
- [x] Register/Accept Invitation placeholder
- [x] Header (role-adaptive with proper icons/labels)
- [x] Sidebar (role-specific navigation)
- [x] Overview Dashboard (all 4 roles with unique content)
- [x] Attendance View (Teacher & Student modes)
- [x] Marks View (Teacher entry & Student gradebook)
- [x] Profile View (all roles)

## 📋 To-Do List (Prioritized by Requirements Document)

### Week 1-2: Foundation & Core Data Pages

#### 1. Complete Authentication Flow
- [ ] Forgot Password page (`/forgot-password`)
- [ ] Reset Password page (`/reset-password`)
- [ ] Accept Invitation page (`/accept-invitation`)
- [ ] Proper JWT token handling
- [ ] Session refresh logic
- [ ] Breadcrumbs component

#### 2. Shared Component Library
**Layout Components:**
- [ ] PageHeader component (reusable)
- [ ] EmptyState component
- [ ] LoadingState component
- [ ] ErrorState component
- [ ] ConfirmDialog component

**Data Components:**
- [ ] DataTable component (sortable, filterable, paginated)
- [ ] SearchBar component
- [ ] FilterPanel component
- [ ] Pagination component
- [ ] SortControl component

**Student/Teacher Cards:**
- [ ] StudentCard component
- [ ] StudentTable component
- [ ] StudentAvatar component
- [ ] TeacherCard component
- [ ] ClassCard component

### Week 2-3: Platform Admin & School Admin Features

#### Platform Admin Routes (`/admin/*`)
- [ ] Dashboard with platform metrics
- [ ] Schools list & management (`/admin/schools`)
- [ ] School detail page (`/admin/schools/:id`)
- [ ] Users management (`/admin/users`)
- [ ] Usage analytics (`/admin/usage`)
- [ ] AI/RAG management (`/admin/ai`, `/admin/rag`)
- [ ] System logs (`/admin/system-logs`)
- [ ] Platform settings (`/admin/settings`)

#### School Admin Routes (`/school/*`)
- [ ] Complete dashboard with school insights
- [ ] Students list (`/school/students`)
- [ ] Student profile page (`/school/students/:id`) with:
  - Academic performance
  - Attendance history
  - Learning gaps
  - AI insights
  - Interventions
- [ ] Teachers list (`/school/teachers`)
- [ ] Teacher profile page (`/school/teachers/:id`)
- [ ] Classes management (`/school/classes`)
- [ ] Class detail page (`/school/classes/:id`) with:
  - Student roster
  - Performance metrics
  - At-risk students
  - AI recommendations
- [ ] Subjects management (`/school/subjects`)
- [ ] Assessments overview (`/school/assessments`)
- [ ] Analytics dashboard (`/school/analytics`) with filters
- [ ] Interventions management (`/school/interventions`)
- [ ] Knowledge Base UI (`/school/knowledge-base`)
- [ ] School settings (`/school/settings`)

### Week 3-4: Teacher Features

#### Teacher Routes (`/teacher/*`)
- [ ] Enhanced dashboard with AI insights
- [ ] My Classes list (`/teacher/classes`)
- [ ] Class detail page (`/teacher/classes/:id`) with tabs:
  - Overview
  - Students
  - Assessments
  - Learning Gaps
  - Attendance
  - Interventions
- [ ] Students list (assigned only) (`/teacher/students`)
- [ ] Student detail page (`/teacher/students/:id`) with:
  - Performance overview
  - Strengths & weaknesses
  - AI recommendations
  - Intervention history
- [ ] Assessments (`/teacher/assessments`)
  - Create assessment flow
  - Marks entry interface
  - Question-level analytics
  - Concept performance
- [ ] Interventions tracker (`/teacher/interventions`)
- [ ] **AI Copilot** (`/teacher/ai-copilot`)
  - Context-aware chat interface
  - Class/subject/assessment context selector
  - Suggested prompts
  - Chat history
- [ ] Materials management (`/teacher/materials`)

### Week 4-5: Student Features & AI Tutor

#### Student Routes (`/student/*`)
- [ ] Learning dashboard with prominent AI Tutor CTA
- [ ] Learn page (`/student/learn`)
  - Subject browser
  - Current/completed chapters
  - Recommended topics
  - Weak areas
- [ ] **AI Tutor** (`/student/ai-tutor`) - **Priority Feature**
  - Text input interface
  - Voice input (STT)
  - Audio playback (TTS)
  - Language selector
  - Subject/chapter context
  - Curriculum-grounded responses (DokGuru)
  - Conversation history
  - Voice recording states
- [ ] Practice page (`/student/practice`)
  - AI-generated exercises
  - Personalized recommendations
  - Results tracking
- [ ] Progress page (`/student/progress`)
  - Simple, student-friendly visuals
  - Strengths display
  - Areas to improve
  - Trend over time
- [ ] Assessments page (`/student/assessments`)
  - Upcoming/completed tests
  - Scores & feedback
  - Concepts mastered
  - Practice recommendations

### Week 5-6: Advanced Components

#### Assessment Components
- [ ] AssessmentCard component
- [ ] AssessmentTable component
- [ ] AssessmentBuilder component
- [ ] QuestionCard component
- [ ] MarksInput component
- [ ] AssessmentResult component

#### Analytics Components
- [ ] MetricCard component
- [ ] PerformanceChart component (Chart.js/Recharts)
- [ ] ProgressChart component
- [ ] SubjectChart component
- [ ] RiskDistribution component
- [ ] ConceptMastery component

#### AI Components
- [ ] AIChat component
- [ ] ChatMessage component
- [ ] ChatInput component
- [ ] VoiceInput component (with recording animation)
- [ ] AudioPlayer component
- [ ] AIInsightCard component
- [ ] AIRecommendation component
- [ ] SuggestedPrompt component

#### Intervention Components
- [ ] InterventionCard component
- [ ] InterventionList component
- [ ] RiskBadge component
- [ ] InterventionStatus component
- [ ] InterventionTimeline component

#### Student-specific Components
- [ ] StudentPerformance component
- [ ] StudentRiskBadge component
- [ ] StudentProgress component
- [ ] LearningHealthBadge component

### Week 6-7: Knowledge Base & DokGuru Integration

#### Knowledge Base Features
- [ ] Document upload interface
- [ ] Processing status display
- [ ] Organization by class/subject
- [ ] Document management (delete, update metadata)
- [ ] Search within knowledge base
- [ ] Document preview

#### DokGuru Integration Points
- [ ] AI Tutor RAG queries
- [ ] Teacher Copilot context
- [ ] Curriculum grounding indicator
- [ ] Source citation display
- [ ] Knowledge base health monitoring

### Week 7-8: Polish & Testing

#### UX Enhancements
- [ ] Loading states for all async operations
- [ ] Error boundaries and graceful error handling
- [ ] Empty states for all lists/tables
- [ ] Confirmation dialogs for destructive actions
- [ ] Toast notifications system
- [ ] Optimistic UI updates where appropriate
- [ ] Keyboard shortcuts
- [ ] Accessibility audit (ARIA labels, focus management)

#### Responsive Design
- [ ] Mobile optimization for all views
- [ ] Tablet layout adjustments
- [ ] Touch-friendly interactions
- [ ] Mobile navigation patterns

#### Performance
- [ ] Code splitting by role/route
- [ ] Lazy loading for heavy components
- [ ] Image optimization
- [ ] API response caching
- [ ] Debounced search/filter inputs

#### Security & Permissions
- [ ] Frontend permission checks (UI hiding)
- [ ] RoleGuard component for route protection
- [ ] Proper 403 error handling
- [ ] XSS prevention
- [ ] CSRF token handling
- [ ] Secure token storage

#### Testing
- [ ] Unit tests for utility functions
- [ ] Component tests for reusable components
- [ ] Integration tests for key flows
- [ ] E2E tests for critical paths
- [ ] Accessibility testing
- [ ] Cross-browser testing

## 🎯 Development Sequence (8-Week Plan)

### Week 1: Project Setup & Auth
- Complete authentication pages
- Build shared component library foundation
- Setup TypeScript interfaces for all roles
- Configure API layer with proper types
- Mock data structure for all entities

### Week 2: Core Data Tables
- Build DataTable, SearchBar, FilterPanel
- Student/Teacher/Class card components
- Basic list views for all roles
- Pagination and sorting

### Week 3: Platform & School Admin
- Platform Admin dashboard and schools management
- School Admin dashboard and student/teacher lists
- Analytics components (charts)
- Basic profile pages

### Week 4: Teacher Dashboard & Assessments
- Teacher class management
- Assessment creation flow
- Marks entry interface
- Student performance views

### Week 5: Student Dashboard & AI Tutor ⭐
- Student learning interface
- **AI Tutor implementation (voice + text)**
- Practice exercises
- Progress tracking

### Week 6: AI Copilot & Advanced Features
- Teacher AI Copilot
- Interventions management
- Knowledge Base UI
- DokGuru integration

### Week 7: Analytics & Insights
- Advanced charts and visualizations
- AI insights display
- Learning gap analysis
- Risk prediction UI

### Week 8: Polish, Testing & Deployment
- Responsive design refinement
- Accessibility improvements
- Performance optimization
- Security hardening
- End-to-end testing
- Deployment preparation

## 📚 Technical Stack

### Core
- **Framework:** React 18 with Vite
- **Language:** JavaScript (TypeScript recommended for production)
- **Styling:** Tailwind CSS + Custom Glassmorphism
- **Icons:** Lucide React
- **Routing:** React Router v6 (to be added)

### Recommended Additions
- **State Management:** Context API + React Query (for server state)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts or Chart.js
- **Tables:** TanStack Table
- **Voice:** Web Speech API / OpenAI Whisper API
- **Audio:** Howler.js or native Audio API
- **Testing:** Vitest + React Testing Library
- **E2E:** Playwright or Cypress

## 🔐 Permission Model

### Granular Permissions (to implement)
- `students.read`, `students.write`
- `teachers.read`, `teachers.write`
- `classes.read`, `classes.write`
- `assessments.read`, `assessments.write`, `assessments.create`
- `analytics.student`, `analytics.class`, `analytics.school`, `analytics.platform`
- `ai.tutor`, `ai.teacher_copilot`, `ai.admin`
- `interventions.read`, `interventions.create`, `interventions.update`
- `knowledge_base.read`, `knowledge_base.write`
- `attendance.read`, `attendance.write`

### Role-Permission Mapping
```javascript
const rolePermissions = {
  platform_admin: ['*'], // All permissions
  school_admin: [
    'students.read', 'students.write',
    'teachers.read', 'teachers.write',
    'classes.read', 'classes.write',
    'analytics.school', 'analytics.class', 'analytics.student',
    'interventions.*', 'knowledge_base.*'
  ],
  teacher: [
    'students.read', // Only assigned
    'classes.read', // Only assigned
    'assessments.*',
    'analytics.class', 'analytics.student',
    'ai.teacher_copilot',
    'interventions.read', 'interventions.create',
    'knowledge_base.read', 'knowledge_base.write'
  ],
  student: [
    'students.read.own',
    'assessments.read.own',
    'analytics.student.own',
    'ai.tutor',
    'progress.read.own'
  ]
};
```

## 🚀 Demo Credentials

```
Platform Admin: admin@platform.edusmart.ai / admin123
School Admin:   principal@school.edu / principal123
Teacher:        teacher@school.edu / teacher123
Student:        student@school.edu / student123
```

## 📝 Notes

- **Backend contract:** All role/permission logic is enforced by backend (403 responses)
- **Frontend hiding:** UI conditionally shows/hides features based on role
- **DokGuru:** Existing RAG engine - frontend calls backend APIs, backend calls DokGuru
- **No ERP features in V1:** Focus on learning intelligence, not school operations
- **Parent portal:** Planned for V2

## ✨ Success Criteria

- [ ] All 4 role dashboards functional
- [ ] Single authentication flow working
- [ ] Role-based navigation correct
- [ ] AI Tutor with voice fully functional
- [ ] Teacher Copilot context-aware
- [ ] Knowledge Base upload/management working
- [ ] Responsive on mobile/tablet/desktop
- [ ] All loading/empty/error states implemented
- [ ] Permission checks in place
- [ ] Ready for single school pilot deployment

---

**Current Status:** Foundation complete. Ready for Week 2-3 implementation phase.
**Next Priority:** Complete shared component library, then Platform/School Admin features.
