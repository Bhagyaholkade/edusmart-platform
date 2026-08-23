import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import attendanceRoutes from './routes/attendance.js';
import markRoutes from './routes/marks.js';
import aiRoutes from './routes/ai.js';
import classRoutes from './routes/classes.js';
import notificationRoutes from './routes/notifications.js';

import { isSupabaseConfigured } from './config/supabase.js';
import { isOpenAIConfigured } from './config/openai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Health & Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Teacher Platform API',
    supabaseConnected: isSupabaseConfigured(),
    openaiConnected: isOpenAIConfigured(),
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/notifications', notificationRoutes);

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Teacher Platform Backend running on http://localhost:${PORT}`);
  console.log(`⚡ Supabase Integration: ${isSupabaseConfigured() ? 'ACTIVE' : 'DEMO/MOCK FALLBACK'}`);
  console.log(`🤖 OpenAI Integration: ${isOpenAIConfigured() ? 'ACTIVE' : 'DEMO/MOCK FALLBACK'}`);
});
