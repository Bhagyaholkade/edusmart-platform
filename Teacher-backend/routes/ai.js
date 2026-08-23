import express from 'express';
import { openai, isOpenAIConfigured } from '../config/openai.js';
import { mockFeedback } from '../store/mockData.js';

const router = express.Router();

// POST /api/ai/generate-feedback
router.post('/generate-feedback', async (req, res) => {
  const { studentName, rollNumber, attendanceRate, marks, additionalNotes } = req.body;

  if (!studentName) {
    return res.status(400).json({ error: 'Student Name is required' });
  }

  const marksSummary = marks
    ? `Maths: ${marks.maths}/100, Science: ${marks.science}/100, English: ${marks.english}/100, History: ${marks.history}/100, Computer Science: ${marks.computerScience}/100`
    : 'No exam marks recorded yet.';

  const prompt = `You are an encouraging and insightful educational advisor for teachers.
Generate a constructive, professional student evaluation report for:
Student Name: ${studentName} (Roll #${rollNumber || 'N/A'})
Attendance Rate: ${attendanceRate || '95'}%
Exam Marks: ${marksSummary}
Teacher's Personal Observations: ${additionalNotes || 'Consistently participates in class discussions.'}

Provide your response in JSON format with exactly 4 keys:
1. "summary": A 2-3 sentence overall performance evaluation.
2. "strengths": A bullet list or summary of key strengths.
3. "areasForImprovement": Focus areas for academic or behavioral growth.
4. "parentRecommendation": Concrete advice for parents to support the student at home.`;

  try {
    if (isOpenAIConfigured()) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI teaching assistant that returns output strictly as JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });

      const parsedJSON = JSON.parse(response.choices[0].message.content);
      return res.json({ studentName, feedback: parsedJSON, source: 'OpenAI GPT-4o-mini' });
    } else {
      // Smart Fallback Generator based on student stats
      const avgScore = marks ? Math.round((marks.maths + marks.science + marks.english + marks.history + marks.computerScience) / 5) : 85;
      
      let summaryText = `${studentName} demonstrates great overall commitment with an attendance rate of ${attendanceRate || '95'}% and an average academic score of ${avgScore}%.`;
      let strengths = `Excellence in problem solving, strong classroom engagement, and active participation during group exercises.`;
      let areasForImprovement = avgScore < 70 ? `Needs focused revision in core quantitative subjects and time management during exams.` : `Can work on deeper critical analysis in essay questions and advanced project presentation skills.`;
      let parentRecommendation = `Encourage 30 minutes of daily quiet reading and review subject exercises together on weekends to sustain learning momentum.`;

      const generatedFeedback = {
        summary: summaryText,
        strengths,
        areasForImprovement,
        parentRecommendation
      };

      if (rollNumber) {
        mockFeedback[rollNumber] = generatedFeedback;
      }

      return res.json({
        studentName,
        feedback: generatedFeedback,
        source: 'AI Analytics Engine (Demo Mode)'
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
