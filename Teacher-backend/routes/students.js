import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockStudents } from '../store/mockData.js';

const router = express.Router();

// GET /api/students?className=Grade+10-A
router.get('/', async (req, res) => {
  const { className } = req.query;

  try {
    if (isSupabaseConfigured()) {
      let query = supabase.from('students').select('*').order('roll_number');
      if (className) {
        query = query.eq('class', className);
      }
      const { data, error } = await query;
      if (error) throw error;
      return res.json(data);
    } else {
      if (className) {
        const decodedClass = decodeURIComponent(className);
        const filtered = mockStudents.filter(s =>
          s.class === decodedClass ||
          s.className === decodedClass ||
          s.class === className ||
          s.className === className
        );
        return res.json(filtered);
      }
      return res.json(mockStudents);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students
router.post('/', async (req, res) => {
  const { name, rollNumber, className, parentName, parentPhone, parentEmail } = req.body;
  if (!name || !rollNumber) {
    return res.status(400).json({ error: 'Name and Roll Number are required' });
  }

  const targetClass = className || 'Grade 10-A (Mathematics)';

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name,
          roll_number: rollNumber,
          class: targetClass,
          biometric_registered: true,
          parent_name: parentName || 'Parent',
          parent_phone: parentPhone || '+15550199988',
          parent_email: parentEmail || 'parent@school.edu'
        }])
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json(data[0]);
    } else {
      const newStudent = {
        id: 'st_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        rollNumber,
        roll_number: rollNumber,
        name,
        class: targetClass,
        className: targetClass,
        biometricRegistered: true,
        parentName: parentName || 'Parent',
        parent_name: parentName || 'Parent',
        parentPhone: parentPhone || '+15550199988',
        parent_phone: parentPhone || '+15550199988',
        parentEmail: parentEmail || 'parent@school.edu',
        parent_email: parentEmail || 'parent@school.edu'
      };
      mockStudents.push(newStudent);
      return res.status(201).json(newStudent);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/students/:id (Update student and parent details)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, rollNumber, className, parentName, parentPhone, parentEmail } = req.body;

  try {
    if (isSupabaseConfigured()) {
      const updateData = {};
      if (name) updateData.name = name;
      if (rollNumber) updateData.roll_number = rollNumber;
      if (className) updateData.class = className;
      if (parentName) updateData.parent_name = parentName;
      if (parentPhone) updateData.parent_phone = parentPhone;
      if (parentEmail) updateData.parent_email = parentEmail;

      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Student updated successfully', student: data[0] });
    } else {
      const idx = mockStudents.findIndex(s =>
        String(s.id) === String(id) ||
        s.rollNumber === rollNumber ||
        s.roll_number === rollNumber ||
        s.name === name
      );

      if (idx !== -1) {
        if (name) mockStudents[idx].name = name;
        if (rollNumber) {
          mockStudents[idx].rollNumber = rollNumber;
          mockStudents[idx].roll_number = rollNumber;
        }
        if (className) {
          mockStudents[idx].class = className;
          mockStudents[idx].className = className;
        }
        if (parentName) {
          mockStudents[idx].parentName = parentName;
          mockStudents[idx].parent_name = parentName;
        }
        if (parentPhone) {
          mockStudents[idx].parentPhone = parentPhone;
          mockStudents[idx].parent_phone = parentPhone;
        }
        if (parentEmail) {
          mockStudents[idx].parentEmail = parentEmail;
          mockStudents[idx].parent_email = parentEmail;
        }
        return res.json({ message: 'Student details updated successfully', student: mockStudents[idx] });
      }

      // If not found in array, push as new updated record
      const updatedObj = {
        id: id || ('st_' + Date.now()),
        rollNumber: rollNumber || '1001',
        roll_number: rollNumber || '1001',
        name: name || 'Student',
        class: className || 'Grade 10-A',
        className: className || 'Grade 10-A',
        parentName: parentName || 'Parent',
        parent_name: parentName || 'Parent',
        parentPhone: parentPhone || '+15550199988',
        parent_phone: parentPhone || '+15550199988',
        parentEmail: parentEmail || 'parent@gmail.com',
        parent_email: parentEmail || 'parent@gmail.com'
      };
      mockStudents.push(updatedObj);
      return res.json({ message: 'Student updated', student: updatedObj });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
