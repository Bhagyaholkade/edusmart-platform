import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStudents, mockAttendance } from '../store/mockData.js';

const router = express.Router();

// GET /api/attendance?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  const dateStr = req.query.date || new Date().toISOString().split('T')[0];

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          date,
          status,
          verification_type,
          scan_timestamp,
          students (id, roll_number, name, class)
        `)
        .eq('date', dateStr);

      if (error) throw error;
      return res.json({ date: dateStr, records: data });
    } else {
      const records = mockAttendance[dateStr] || [];
      return res.json({ date: dateStr, records });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/attendance (Mark or Biometric Scan attendance)
router.post('/', async (req, res) => {
  const { studentId, date, status, verificationType } = req.body;
  const dateStr = date || new Date().toISOString().split('T')[0];
  const type = verificationType || 'Biometric Touch Scan';
  const currentStatus = status || 'Present';

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('attendance')
        .upsert(
          [
            {
              student_id: studentId,
              date: dateStr,
              status: currentStatus,
              verification_type: type,
              scan_timestamp: new Date().toISOString()
            }
          ],
          { onConflict: 'student_id, date' }
        )
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Attendance recorded via Biometric platform', record: data[0] });
    } else {
      if (!mockAttendance[dateStr]) {
        mockAttendance[dateStr] = [];
      }
      
      const existingIdx = mockAttendance[dateStr].findIndex(r => r.studentId === studentId);
      const studentObj = mockStudents.find(s => s.id === studentId) || { name: 'Student', rollNumber: studentId };

      const recordItem = {
        id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        studentId,
        studentName: studentObj.name,
        rollNumber: studentObj.rollNumber,
        date: dateStr,
        status: currentStatus,
        verificationType: type,
        scanTimestamp: new Date().toLocaleTimeString()
      };

      if (existingIdx >= 0) {
        mockAttendance[dateStr][existingIdx] = recordItem;
      } else {
        mockAttendance[dateStr].push(recordItem);
      }

      return res.json({ message: 'Biometric Attendance recorded successfully', record: recordItem });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/attendance/bulk-mark
router.post('/bulk-mark', async (req, res) => {
  const { date, attendanceList } = req.body;
  const dateStr = date || new Date().toISOString().split('T')[0];

  if (!Array.isArray(attendanceList)) {
    return res.status(400).json({ error: 'attendanceList must be an array' });
  }

  try {
    if (isSupabaseConfigured()) {
      const payload = attendanceList.map(item => ({
        student_id: item.studentId,
        date: dateStr,
        status: item.status,
        verification_type: item.verificationType || 'Manual Verification',
        scan_timestamp: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('attendance')
        .upsert(payload, { onConflict: 'student_id, date' })
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Bulk attendance recorded', count: data.length });
    } else {
      mockAttendance[dateStr] = attendanceList.map(item => {
        const studentObj = mockStudents.find(s => s.id === item.studentId) || { name: 'Student', rollNumber: item.studentId };
        return {
          id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          studentId: item.studentId,
          studentName: studentObj.name,
          rollNumber: studentObj.rollNumber,
          date: dateStr,
          status: item.status,
          verificationType: item.verificationType || 'Teacher Verified',
          scanTimestamp: new Date().toLocaleTimeString()
        };
      });

      return res.json({ message: 'Bulk attendance recorded (Demo Mode)', count: attendanceList.length });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
