const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-Memory Database for Students, Attendance & Subject Analytics
const DB = {
  schools: [
    'St. Xavier High School',
    'St. Xavier Academy',
    'Greenwood High International',
    'Delhi Public School'
  ],
  students: [
    {
      id: '1',
      rollNumber: '1001',
      name: 'Alex Johnson',
      email: 'alex.johnson@student.edu',
      password: 'password123',
      schoolName: 'St. Xavier High School',
      className: 'Grade 10-A (Mathematics)',
      parentName: 'Robert Johnson',
      parentPhone: '+919019395288',
      parentEmail: 'robert.j@gmail.com',
      bloodGroup: 'O+',
      emergencyContact: '+919876543210',
      attendanceRate: 96,
      totalClasses: 120,
      presentDays: 115,
      absentDays: 4,
      lateDays: 1,
      subjectBreakdown: [
        {
          subject: 'Mathematics',
          teacher: 'Dr. Smith',
          attendancePct: 96,
          marks: 95,
          grade: 'A+',
          totalClasses: 30,
          present: 29,
          absent: 1,
          absentDates: [
            { date: '2026-08-18', dayName: 'Tue', time: '09:00 AM', topic: 'Differential Calculus & Algebra', status: 'Absent - Parent Alerted' }
          ]
        },
        {
          subject: 'Physics',
          teacher: 'Prof. Davis',
          attendancePct: 93,
          marks: 90,
          grade: 'A',
          totalClasses: 30,
          present: 28,
          absent: 2,
          absentDates: [
            { date: '2026-08-12', dayName: 'Wed', time: '10:30 AM', topic: 'Electromagnetism Lab', status: 'Absent - Parent Alerted' },
            { date: '2026-08-05', dayName: 'Wed', time: '10:30 AM', topic: 'Optics & Wave Motion', status: 'Absent - Parent Alerted' }
          ]
        },
        {
          subject: 'Computer Science',
          teacher: 'Er. Wilson',
          attendancePct: 98,
          marks: 99,
          grade: 'A+',
          totalClasses: 30,
          present: 29,
          absent: 1,
          absentDates: [
            { date: '2026-08-01', dayName: 'Sat', time: '02:00 PM', topic: 'Data Structures & Algorithms', status: 'Absent - Parent Alerted' }
          ]
        },
        {
          subject: 'English Literature',
          teacher: 'Mrs. Taylor',
          attendancePct: 90,
          marks: 88,
          grade: 'A',
          totalClasses: 30,
          present: 27,
          absent: 3,
          absentDates: [
            { date: '2026-08-15', dayName: 'Sat', time: '11:15 AM', topic: 'Shakespearean Drama Analysis', status: 'Absent - Parent Alerted' },
            { date: '2026-08-08', dayName: 'Sat', time: '11:15 AM', topic: 'Modern Poetry & Prose', status: 'Absent - Parent Alerted' },
            { date: '2026-08-02', dayName: 'Sun', time: '11:15 AM', topic: 'Grammar & Essay Composition', status: 'Absent' }
          ]
        },
        {
          subject: 'History & Civics',
          teacher: 'Mr. Brown',
          attendancePct: 94,
          marks: 91,
          grade: 'A+',
          totalClasses: 30,
          present: 28,
          absent: 2,
          absentDates: [
            { date: '2026-08-14', dayName: 'Fri', time: '01:00 PM', topic: 'World War II History', status: 'Absent - Parent Alerted' },
            { date: '2026-08-04', dayName: 'Tue', time: '01:00 PM', topic: 'Indian Constitution & Civics', status: 'Absent - Parent Alerted' }
          ]
        }
      ],
      aiFeedback: 'Alex displays exceptional mathematical reasoning and logic skills. Continued excellence observed in biometric attendance consistency.'
    }
  ]
};

// Root route - redirect browser directly to Student Frontend UI
app.get('/', (req, res) => {
  res.redirect('http://localhost:5174');
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EduSmart Student Portal API', time: new Date().toISOString() });
});

// Student Login Route
app.post('/api/auth/student-login', (req, res) => {
  const { schoolName, rollNumberOrEmail, password } = req.body;

  if (!schoolName || !rollNumberOrEmail) {
    return res.status(400).json({ error: 'School name and Roll Number or Email are required.' });
  }

  let student = DB.students.find(s =>
    s.schoolName.toLowerCase().trim() === schoolName.toLowerCase().trim() &&
    (s.rollNumber.toLowerCase() === rollNumberOrEmail.toLowerCase() || s.email.toLowerCase() === rollNumberOrEmail.toLowerCase())
  );

  if (!student) {
    const schoolValid = DB.schools.some(s => s.toLowerCase().trim() === schoolName.toLowerCase().trim());
    if (schoolValid) {
      const rollNum = rollNumberOrEmail.match(/^\d+$/) ? rollNumberOrEmail : '1010';
      student = {
        id: 'std_' + rollNum,
        rollNumber: rollNum,
        name: rollNum === '1010' ? 'Bhagya Kumar' : `Student #${rollNum}`,
        email: `${rollNum}@student.edu`,
        schoolName,
        className: 'Grade 10-A (Mathematics)',
        parentName: 'Suresh Kumar',
        parentPhone: '+919019395288',
        parentEmail: 'suresh.k@gmail.com',
        bloodGroup: 'B+',
        emergencyContact: '+919019395288',
        attendanceRate: 94,
        totalClasses: 120,
        presentDays: 113,
        absentDays: 5,
        lateDays: 2,
        subjectBreakdown: [
          {
            subject: 'Mathematics',
            teacher: 'Dr. Smith',
            attendancePct: 96,
            marks: 95,
            grade: 'A+',
            totalClasses: 30,
            present: 29,
            absent: 1,
            absentDates: [
              { date: '2026-08-18', dayName: 'Tue', time: '09:00 AM', topic: 'Differential Calculus & Algebra', status: 'Absent - Parent Alerted' }
            ]
          },
          {
            subject: 'Physics',
            teacher: 'Prof. Davis',
            attendancePct: 93,
            marks: 90,
            grade: 'A',
            totalClasses: 30,
            present: 28,
            absent: 2,
            absentDates: [
              { date: '2026-08-12', dayName: 'Wed', time: '10:30 AM', topic: 'Electromagnetism Lab', status: 'Absent - Parent Alerted' },
              { date: '2026-08-05', dayName: 'Wed', time: '10:30 AM', topic: 'Optics & Wave Motion', status: 'Absent - Parent Alerted' }
            ]
          },
          {
            subject: 'Computer Science',
            teacher: 'Er. Wilson',
            attendancePct: 98,
            marks: 99,
            grade: 'A+',
            totalClasses: 30,
            present: 29,
            absent: 1,
            absentDates: [
              { date: '2026-08-01', dayName: 'Sat', time: '02:00 PM', topic: 'Data Structures & Algorithms', status: 'Absent - Parent Alerted' }
            ]
          },
          {
            subject: 'English Literature',
            teacher: 'Mrs. Taylor',
            attendancePct: 90,
            marks: 88,
            grade: 'A',
            totalClasses: 30,
            present: 27,
            absent: 3,
            absentDates: [
              { date: '2026-08-15', dayName: 'Sat', time: '11:15 AM', topic: 'Shakespearean Drama Analysis', status: 'Absent - Parent Alerted' },
              { date: '2026-08-08', dayName: 'Sat', time: '11:15 AM', topic: 'Modern Poetry & Prose', status: 'Absent - Parent Alerted' },
              { date: '2026-08-02', dayName: 'Sun', time: '11:15 AM', topic: 'Grammar & Essay Composition', status: 'Absent' }
            ]
          },
          {
            subject: 'History & Civics',
            teacher: 'Mr. Brown',
            attendancePct: 94,
            marks: 91,
            grade: 'A+',
            totalClasses: 30,
            present: 28,
            absent: 2,
            absentDates: [
              { date: '2026-08-14', dayName: 'Fri', time: '01:00 PM', topic: 'World War II History', status: 'Absent - Parent Alerted' },
              { date: '2026-08-04', dayName: 'Tue', time: '01:00 PM', topic: 'Indian Constitution & Civics', status: 'Absent - Parent Alerted' }
            ]
          }
        ],
        aiFeedback: 'Punctual biometric verification and consistent academic performance.'
      };
      DB.students.push(student);
    } else {
      return res.status(404).json({
        error: `No valid student record found for school "${schoolName}". Please check school name and roll number.`
      });
    }
  }

  res.json({ message: 'Login successful', student });
});

// Student Signup Route
app.post('/api/auth/student-signup', (req, res) => {
  const { name, rollNumber, email, schoolName, password, className } = req.body;

  if (!name || !rollNumber || !schoolName) {
    return res.status(400).json({ error: 'Name, Roll Number, and School Name are required.' });
  }

  const newStudent = {
    id: 'std_' + rollNumber,
    rollNumber,
    name,
    email: email || `${rollNumber}@student.edu`,
    password: password || 'password123',
    schoolName,
    className: className || 'Grade 10-A (Mathematics)',
    parentName: 'Parent / Guardian',
    parentPhone: '+919019395288',
    parentEmail: 'parent@gmail.com',
    bloodGroup: 'O+',
    emergencyContact: '+919019395288',
    attendanceRate: 95,
    totalClasses: 120,
    presentDays: 114,
    absentDays: 4,
    lateDays: 2,
    subjectBreakdown: [
      {
        subject: 'Mathematics',
        teacher: 'Dr. Smith',
        attendancePct: 96,
        marks: 94,
        grade: 'A+',
        totalClasses: 30,
        present: 29,
        absent: 1,
        absentDates: [{ date: '2026-08-18', dayName: 'Tue', time: '09:00 AM', topic: 'Calculus', status: 'Absent - Parent Alerted' }]
      },
      {
        subject: 'Physics',
        teacher: 'Prof. Davis',
        attendancePct: 93,
        marks: 92,
        grade: 'A+',
        totalClasses: 30,
        present: 28,
        absent: 2,
        absentDates: [{ date: '2026-08-12', dayName: 'Wed', time: '10:30 AM', topic: 'Physics Lab', status: 'Absent - Parent Alerted' }]
      },
      {
        subject: 'Computer Science',
        teacher: 'Er. Wilson',
        attendancePct: 98,
        marks: 96,
        grade: 'A+',
        totalClasses: 30,
        present: 29,
        absent: 1,
        absentDates: [{ date: '2026-08-01', dayName: 'Sat', time: '02:00 PM', topic: 'Algorithms', status: 'Absent - Parent Alerted' }]
      }
    ],
    aiFeedback: 'Welcome to EduSmart Student Portal! Maintain your attendance rate to stay at the top of your class.'
  };

  DB.students.push(newStudent);
  res.status(201).json({ message: 'Registration successful', student: newStudent });
});

// Fetch Student Dashboard, Monthly Attendance Calendar, and Subject Analytics
app.get('/api/student/dashboard/:id', (req, res) => {
  const targetParam = req.params.id;

  let student = DB.students.find(s =>
    s.id === targetParam ||
    s.rollNumber === targetParam ||
    s.email === targetParam ||
    s.id === 'std_' + targetParam
  );

  if (!student) {
    const extractedRoll = targetParam.replace(/[^0-9]/g, '') || '1010';
    student = {
      id: 'std_' + extractedRoll,
      rollNumber: extractedRoll,
      name: extractedRoll === '1010' ? 'Bhagya Kumar' : `Student #${extractedRoll}`,
      email: `${extractedRoll}@student.edu`,
      schoolName: 'St. Xavier High School',
      className: 'Grade 10-A (Mathematics)',
      parentName: 'Suresh Kumar',
      parentPhone: '+919019395288',
      parentEmail: 'suresh.k@gmail.com',
      bloodGroup: 'B+',
      emergencyContact: '+919019395288',
      attendanceRate: 94,
      totalClasses: 120,
      presentDays: 113,
      absentDays: 5,
      lateDays: 2,
      subjectBreakdown: [
        {
          subject: 'Mathematics',
          teacher: 'Dr. Smith',
          attendancePct: 96,
          marks: 95,
          grade: 'A+',
          totalClasses: 30,
          present: 29,
          absent: 1,
          absentDates: [
            { date: '2026-08-18', dayName: 'Tue', time: '09:00 AM', topic: 'Differential Calculus & Algebra', status: 'Absent - Parent Alerted' }
          ]
        },
        {
          subject: 'Physics',
          teacher: 'Prof. Davis',
          attendancePct: 93,
          marks: 90,
          grade: 'A',
          totalClasses: 30,
          present: 28,
          absent: 2,
          absentDates: [
            { date: '2026-08-12', dayName: 'Wed', time: '10:30 AM', topic: 'Electromagnetism Lab', status: 'Absent - Parent Alerted' },
            { date: '2026-08-05', dayName: 'Wed', time: '10:30 AM', topic: 'Optics & Wave Motion', status: 'Absent - Parent Alerted' }
          ]
        },
        {
          subject: 'Computer Science',
          teacher: 'Er. Wilson',
          attendancePct: 98,
          marks: 99,
          grade: 'A+',
          totalClasses: 30,
          present: 29,
          absent: 1,
          absentDates: [
            { date: '2026-08-01', dayName: 'Sat', time: '02:00 PM', topic: 'Data Structures & Algorithms', status: 'Absent - Parent Alerted' }
          ]
        },
        {
          subject: 'English Literature',
          teacher: 'Mrs. Taylor',
          attendancePct: 90,
          marks: 88,
          grade: 'A',
          totalClasses: 30,
          present: 27,
          absent: 3,
          absentDates: [
            { date: '2026-08-15', dayName: 'Sat', time: '11:15 AM', topic: 'Shakespearean Drama Analysis', status: 'Absent - Parent Alerted' },
            { date: '2026-08-08', dayName: 'Sat', time: '11:15 AM', topic: 'Modern Poetry & Prose', status: 'Absent - Parent Alerted' },
            { date: '2026-08-02', dayName: 'Sun', time: '11:15 AM', topic: 'Grammar & Essay Composition', status: 'Absent' }
          ]
        },
        {
          subject: 'History & Civics',
          teacher: 'Mr. Brown',
          attendancePct: 94,
          marks: 91,
          grade: 'A+',
          totalClasses: 30,
          present: 28,
          absent: 2,
          absentDates: [
            { date: '2026-08-14', dayName: 'Fri', time: '01:00 PM', topic: 'World War II History', status: 'Absent - Parent Alerted' },
            { date: '2026-08-04', dayName: 'Tue', time: '01:00 PM', topic: 'Indian Constitution & Civics', status: 'Absent - Parent Alerted' }
          ]
        }
      ],
      aiFeedback: 'Punctual biometric verification and consistent academic performance.'
    };
    DB.students.push(student);
  }

  // Generate 30-Day Calendar History with exact Absence Dates
  const today = new Date();
  const monthCalendar = [];
  const absentDatesSet = new Set(['2026-08-18', '2026-08-12', '2026-08-05', '2026-08-01']);
  const lateDatesSet = new Set(['2026-08-20', '2026-08-14']);

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    let status = 'Present';
    let time = '08:45 AM';
    let remark = 'Verified on Terminal';

    if (isWeekend) {
      status = 'Holiday';
      time = '--';
      remark = 'Weekend';
    } else if (absentDatesSet.has(dateStr)) {
      status = 'Absent';
      time = '--';
      remark = 'Absent - Alert Sent to Parent';
    } else if (lateDatesSet.has(dateStr)) {
      status = 'Late';
      time = '09:18 AM';
      remark = 'Late Entry Recorded';
    }

    monthCalendar.push({
      date: dateStr,
      dayNumber: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      status,
      time,
      remark
    });
  }

  res.json({
    student,
    monthCalendar,
    absentDatesList: Array.from(absentDatesSet),
    summary: {
      attendancePercentage: student.attendanceRate || 94,
      presentDays: student.presentDays || 113,
      absentDays: student.absentDays || 5,
      lateDays: student.lateDays || 2,
      totalClasses: student.totalClasses || 120
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EduSmart Student Backend server running on http://localhost:${PORT}`);
});
