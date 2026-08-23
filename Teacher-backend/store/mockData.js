// Classes managed by teacher
export const mockClasses = [
  { id: 'c1', name: 'Grade 10-A (Mathematics)', room: 'Room 204', totalStudents: 4, schedule: 'Mon, Wed, Fri (09:00 AM)' },
  { id: 'c2', name: 'Grade 10-B (Physics)', room: 'Lab 3', totalStudents: 3, schedule: 'Tue, Thu (11:00 AM)' },
  { id: 'c3', name: 'Grade 11-A (Computer Science)', room: 'Lab 1', totalStudents: 3, schedule: 'Mon, Fri (02:00 PM)' },
  { id: 'c4', name: 'Grade 9-C (Algebra)', room: 'Room 102', totalStudents: 2, schedule: 'Wed, Thu (10:00 AM)' }
];

export const mockStudents = [
  // Grade 10-A Students
  {
    id: '1',
    rollNumber: '1001',
    name: 'Alex Johnson',
    class: 'Grade 10-A (Mathematics)',
    biometricRegistered: true,
    parentName: 'Robert Johnson',
    parentPhone: '+15550192834',
    parentEmail: 'robert.johnson@gmail.com'
  },
  {
    id: '2',
    rollNumber: '1002',
    name: 'Sophia Martinez',
    class: 'Grade 10-A (Mathematics)',
    biometricRegistered: true,
    parentName: 'Elena Martinez',
    parentPhone: '+15550197721',
    parentEmail: 'elena.martinez@yahoo.com'
  },
  {
    id: '3',
    rollNumber: '1003',
    name: 'Ethan Carter',
    class: 'Grade 10-A (Mathematics)',
    biometricRegistered: true,
    parentName: 'David Carter',
    parentPhone: '+15550183344',
    parentEmail: 'david.carter@outlook.com'
  },
  {
    id: '4',
    rollNumber: '1004',
    name: 'Emma Watson',
    class: 'Grade 10-A (Mathematics)',
    biometricRegistered: true,
    parentName: 'Grace Watson',
    parentPhone: '+15550169988',
    parentEmail: 'grace.watson@gmail.com'
  },

  // Grade 10-B Students
  {
    id: '5',
    rollNumber: '1005',
    name: 'Liam Davis',
    class: 'Grade 10-B (Physics)',
    biometricRegistered: true,
    parentName: 'Mark Davis',
    parentPhone: '+15550142211',
    parentEmail: 'mark.davis@gmail.com'
  },
  {
    id: '6',
    rollNumber: '1006',
    name: 'Olivia Smith',
    class: 'Grade 10-B (Physics)',
    biometricRegistered: true,
    parentName: 'Sarah Smith',
    parentPhone: '+15550125544',
    parentEmail: 'sarah.smith@hotmail.com'
  },
  {
    id: '7',
    rollNumber: '1007',
    name: 'Noah Williams',
    class: 'Grade 10-B (Physics)',
    biometricRegistered: true,
    parentName: 'James Williams',
    parentPhone: '+15550137788',
    parentEmail: 'james.w@gmail.com'
  },

  // Grade 11-A Students
  {
    id: '8',
    rollNumber: '1101',
    name: 'Benjamin Clark',
    class: 'Grade 11-A (Computer Science)',
    biometricRegistered: true,
    parentName: 'Michael Clark',
    parentPhone: '+15550119900',
    parentEmail: 'mclark@gmail.com'
  },
  {
    id: '9',
    rollNumber: '1102',
    name: 'Ava Robinson',
    class: 'Grade 11-A (Computer Science)',
    biometricRegistered: true,
    parentName: 'Laura Robinson',
    parentPhone: '+15550174433',
    parentEmail: 'lrobinson@yahoo.com'
  },
  {
    id: '10',
    rollNumber: '1103',
    name: 'Mason Hall',
    class: 'Grade 11-A (Computer Science)',
    biometricRegistered: true,
    parentName: 'Daniel Hall',
    parentPhone: '+15550156622',
    parentEmail: 'dhall@outlook.com'
  },

  // Grade 9-C Students
  {
    id: '11',
    rollNumber: '901',
    name: 'Isabella Lewis',
    class: 'Grade 9-C (Algebra)',
    biometricRegistered: true,
    parentName: 'Karen Lewis',
    parentPhone: '+15550181199',
    parentEmail: 'klewis@gmail.com'
  },
  {
    id: '12',
    rollNumber: '902',
    name: 'Lucas Walker',
    class: 'Grade 9-C (Algebra)',
    biometricRegistered: true,
    parentName: 'Thomas Walker',
    parentPhone: '+15550193377',
    parentEmail: 'twalker@gmail.com'
  }
];

export const mockAttendance = {};

export const mockMarks = [
  { studentId: '1', examName: 'Mid-Term 2026', maths: 92, science: 88, english: 85, history: 90, computerScience: 95 },
  { studentId: '2', examName: 'Mid-Term 2026', maths: 78, science: 82, english: 94, history: 89, computerScience: 91 },
  { studentId: '3', examName: 'Mid-Term 2026', maths: 65, science: 70, english: 72, history: 68, computerScience: 75 },
  { studentId: '4', examName: 'Mid-Term 2026', maths: 98, science: 96, english: 95, history: 94, computerScience: 99 },
  { studentId: '5', examName: 'Mid-Term 2026', maths: 84, science: 80, english: 78, history: 82, computerScience: 86 },
  { studentId: '6', examName: 'Mid-Term 2026', maths: 89, science: 91, english: 90, history: 88, computerScience: 94 },
  { studentId: '7', examName: 'Mid-Term 2026', maths: 55, science: 62, english: 68, history: 60, computerScience: 70 },
  { studentId: '8', examName: 'Mid-Term 2026', maths: 95, science: 98, english: 92, history: 88, computerScience: 100 },
  { studentId: '9', examName: 'Mid-Term 2026', maths: 88, science: 90, english: 86, history: 84, computerScience: 92 },
  { studentId: '10', examName: 'Mid-Term 2026', maths: 72, science: 76, english: 80, history: 74, computerScience: 85 },
  { studentId: '11', examName: 'Mid-Term 2026', maths: 90, science: 85, english: 89, history: 91, computerScience: 87 },
  { studentId: '12', examName: 'Mid-Term 2026', maths: 82, science: 80, english: 84, history: 78, computerScience: 83 }
];

export const mockFeedback = {};
