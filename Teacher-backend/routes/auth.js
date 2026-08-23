import express from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, fullName, schoolName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, school_name: schoolName }
        }
      });

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Registration successful', user: data.user, session: data.session });
    } else {
      // Mock Auth Fallback
      const mockUser = {
        id: 'user_' + Date.now(),
        email,
        user_metadata: { full_name: fullName || 'Teacher User', school_name: schoolName || 'Springfield High' }
      };
      const mockSession = { access_token: 'mock_token_' + Date.now(), user: mockUser };
      return res.json({ message: 'Registration successful (Demo Mode)', user: mockUser, session: mockSession });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Login successful', user: data.user, session: data.session });
    } else {
      // Mock Auth Fallback
      if (password.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters long' });
      }
      const mockUser = {
        id: 'user_teacher_01',
        email,
        user_metadata: { full_name: email.split('@')[0] || 'Teacher', school_name: 'St. Xavier High School' }
      };
      const mockSession = { access_token: 'mock_jwt_token_active', user: mockUser };
      return res.json({ message: 'Login successful (Demo Mode)', user: mockUser, session: mockSession });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${req.headers.origin || 'http://localhost:5173'}/reset-password`
      });

      if (error) return res.status(400).json({ error: error.message });
      return res.json({ message: 'Password reset link sent to your email address.' });
    } else {
      // Mock Auth Fallback
      return res.json({ message: `Password reset link sent to ${email} (Demo Mode). Check your inbox.` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
