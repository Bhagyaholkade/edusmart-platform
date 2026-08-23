import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockMarks } from '../store/mockData.js';

const router = express.Router();

// GET /api/marks
router.get('/', async (req, res) => {
  const { examName } = req.query;
  const targetExam = examName || 'Mid-Term 2026';

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('marks')
        .select(`
          *,
          students (id, roll_number, name, class)
        `)
        .eq('exam_name', targetExam);

      if (error) throw error;
      return res.json(data);
    } else {
      return res.json(mockMarks);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/marks (Update or create exam marks)
router.post('/', async (req, res) => {
  const { studentId, examName, maths, science, english, history, computerScience } = req.body;
  const targetExam = examName || 'Mid-Term 2026';

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('marks')
        .upsert(
          [
            {
              student_id: studentId,
              exam_name: targetExam,
              maths: Number(maths) || 0,
              science: Number(science) || 0,
              english: Number(english) || 0,
              history: Number(history) || 0,
              computer_science: Number(computerScience) || 0,
              updated_at: new Date().toISOString()
            }
          ],
          { onConflict: 'student_id, exam_name' }
        )
        .select();

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Exam marks saved successfully', mark: data[0] });
    } else {
      const existingIdx = mockMarks.findIndex(m => m.studentId === studentId && m.examName === targetExam);
      const markObj = {
        studentId,
        examName: targetExam,
        maths: Number(maths) || 0,
        science: Number(science) || 0,
        english: Number(english) || 0,
        history: Number(history) || 0,
        computerScience: Number(computerScience) || 0
      };

      if (existingIdx >= 0) {
        mockMarks[existingIdx] = markObj;
      } else {
        mockMarks.push(markObj);
      }

      return res.json({ message: 'Exam marks saved successfully (Demo Mode)', mark: markObj });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
