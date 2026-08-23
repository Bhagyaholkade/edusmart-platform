-- Schema setup script for Supabase Database
-- Run this in your Supabase SQL Editor

-- 1. Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(50) DEFAULT 'Grade 10-A (Mathematics)',
    biometric_registered BOOLEAN DEFAULT true,
    parent_name VARCHAR(255),
    parent_phone VARCHAR(50),
    parent_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    verification_type VARCHAR(50) DEFAULT 'Biometric Touch Scan',
    scan_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- 3. Create Exam Marks Table
CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    exam_name VARCHAR(100) DEFAULT 'Mid-Term 2026',
    maths INT CHECK (maths >= 0 AND maths <= 100),
    science INT CHECK (science >= 0 AND science <= 100),
    english INT CHECK (english >= 0 AND english <= 100),
    history INT CHECK (history >= 0 AND history <= 100),
    computer_science INT CHECK (computer_science >= 0 AND computer_science <= 100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, exam_name)
);

-- 4. Create AI Feedback Table
CREATE TABLE IF NOT EXISTS public.student_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    strengths TEXT,
    areas_for_improvement TEXT,
    parent_recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Demo Students Data with Parent Contact Phone Numbers
INSERT INTO public.students (roll_number, name, class, parent_name, parent_phone, parent_email) VALUES
('1001', 'Alex Johnson', 'Grade 10-A (Mathematics)', 'Robert Johnson', '+15550192834', 'robert.johnson@gmail.com'),
('1002', 'Sophia Martinez', 'Grade 10-A (Mathematics)', 'Elena Martinez', '+15550197721', 'elena.martinez@yahoo.com'),
('1003', 'Ethan Carter', 'Grade 10-A (Mathematics)', 'David Carter', '+15550183344', 'david.carter@outlook.com'),
('1004', 'Emma Watson', 'Grade 10-A (Mathematics)', 'Grace Watson', '+15550169988', 'grace.watson@gmail.com')
ON CONFLICT (roll_number) DO NOTHING;
