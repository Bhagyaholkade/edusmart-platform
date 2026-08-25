# Backend Feature Implementation Tracker

Based on the V1 MVP Requirements for the EduSmart AI Learning Intelligence Platform.

- [x] **Phase 0: Environment & Architecture setup**
  - [x] Consolidate repo into `/frontend` and `/backend`
  - [x] Initialize FastAPI & Granian setup
  - [x] Database configuration & ORM Models

- [x] **Feature 1: Authentication & Authorization**
  - [x] Implement user registration endpoint
  - [x] Complete JWT login logic with database validation
  - [x] Implement RBAC middleware/dependency for protecting routes

- [ ] **Feature 2: School & Academic Hierarchy**
  - [ ] Implement CRUD for Schools
  - [ ] Implement CRUD for Classes & Sections
  - [ ] Implement Subjects assignment

- [ ] **Feature 3: User Management**
  - [ ] Implement Teacher creation and assignment to classes
  - [ ] Implement Student enrollment and profile management
  - [ ] Implement Parent profiles linking to students

- [ ] **Feature 4: Attendance Engine**
  - [ ] Implement daily attendance tracking endpoint
  - [ ] Implement bulk attendance submission
  - [ ] (Optional) Integrate biometric data simulation

- [ ] **Feature 5: Assessment & Marks Pipeline**
  - [ ] Implement Assessment creation (Quizzes, Exams)
  - [ ] Implement marks ingestion and validation
  - [ ] Build aggregation logic (class averages, highest/lowest)

- [ ] **Feature 6: Student Intelligence & Risk Signals**
  - [ ] Implement Concept Mastery calculations
  - [ ] Implement Risk Signal generation (attendance drops, grade drops)
  - [ ] Build the Student Learning Profile endpoint

- [ ] **Feature 7: AI Integration (DokGuru)**
  - [ ] Complete AI Tutor endpoint with PII sanitization
  - [ ] Complete Teacher Copilot endpoint for generating lesson plans/feedback
  - [ ] Setup Knowledge Base / Document Store logic

- [ ] **Feature 8: Analytics & Dashboards**
  - [ ] Implement School Admin analytics (overall performance, attendance)
  - [ ] Implement Teacher analytics (class-wide insights)
  - [ ] Implement Student/Parent analytics (personal progress)
