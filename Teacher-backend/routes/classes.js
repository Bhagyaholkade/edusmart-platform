import express from 'express';
import { mockClasses } from '../store/mockData.js';

const router = express.Router();

// GET /api/classes
router.get('/', (req, res) => {
  res.json(mockClasses);
});

// POST /api/classes
router.post('/', (req, res) => {
  const { name, room, schedule } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Class name is required' });
  }

  const newClass = {
    id: 'c_' + Date.now(),
    name,
    room: room || 'Room 101',
    totalStudents: 0,
    schedule: schedule || 'Mon, Wed (10:00 AM)'
  };

  mockClasses.push(newClass);
  res.status(201).json(newClass);
});

export default router;
