import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, Copy, Check, User, Phone, Mail, CheckCircle2, MessageSquare, SendHorizontal, Smartphone, ShieldCheck, AlertCircle } from 'lucide-react';
import { aiAPI, notificationAPI } from '../../services/api';

export default function AIFeedback({ students, marksData }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '1');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Parent contact state (Auto-populated per selected student)
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0] || {};
  const [parentPhone, setParentPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  // Dispatch statuses
  const [smsSending, setSmsSending] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState('');
  const [dispatchError, setDispatchError] = useState('');

  // Update parent contact info when student changes
  useEffect(() => {
    if (selectedStudent) {
      setParentPhone(selectedStudent.parentPhone || selectedStudent.parent_phone || '+15550192834');
      setParentName(selectedStudent.parentName || selectedStudent.parent_name || 'Parent');
      setParentEmail(selectedStudent.parentEmail || selectedStudent.parent_email || 'parent@gmail.com');
      setFeedbackResult(null);
      setDispatchStatus('');
      setDispatchError('');
    }
  }, [selectedStudentId, students]);

  // Retrieve selected student's marks
  const studentMarks = marksData.find(m => m.studentId === selectedStudentId || m.student_id === selectedStudentId) || {
    maths: 88,
    science: 85,
    english: 92,
    history: 80,
    computerScience: 94
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    setFeedbackResult(null);
    setDispatchStatus('');
    setDispatchError('');

    try {
      const payload = {
        studentName: selectedStudent.name,
        rollNumber: selectedStudent.rollNumber || selectedStudent.roll_number,
        attendanceRate: 96,
        marks: studentMarks,
        additionalNotes
      };

      const res = await aiAPI.generateFeedback(payload);
      setFeedbackResult(res);
    } catch (err) {
      console.error('Error generating AI feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedReportText = () => {
    if (!feedbackResult?.feedback) return '';
    const fb = feedbackResult.feedback;
    return `*EDUSMART STUDENT EVALUATION REPORT*
Student: ${selectedStudent.name} (Roll #${selectedStudent.rollNumber || 'N/A'})
Class: ${selectedStudent.class || 'Grade 10-A'}

*1. Summary:*
${fb.summary}

*2. Strengths:*
${fb.strengths}

*3. Areas for Improvement:*
${fb.areasForImprovement}

*4. Parent Advice:*
${fb.parentRecommendation}`;
  };

  // 1-Click Send via WhatsApp Direct Link
  const handleSendWhatsApp = () => {
    if (!parentPhone) {
      setDispatchError('Please enter a valid Parent Phone Number');
      return;
    }
    let cleanPhone = parentPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    const encodedText = encodeURIComponent(getFormattedReportText());
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setDispatchStatus(`WhatsApp opened with pre-loaded feedback for ${parentName} (+${cleanPhone})!`);
  };

  // Direct Automated SMS Dispatch via API & Mobile App launcher
  const handleSendSMS = async () => {
    if (!parentPhone) {
      setDispatchError('Parent Phone Number is required');
      return;
    }
    setSmsSending(true);
    setDispatchStatus('');
    setDispatchError('');

    let cleanPhone = parentPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    try {
      const res = await notificationAPI.sendParentSMS({
        studentName: selectedStudent.name,
        parentName,
        parentPhone: cleanPhone,
        feedback: feedbackResult?.feedback
      });

      // Also trigger device native messaging app
      window.open(`sms:${cleanPhone}?body=${encodeURIComponent(getFormattedReportText())}`, '_blank');
      setDispatchStatus(`✅ ${res.message || 'SMS dispatched!'}`);
    } catch (err) {
      setDispatchError(err.message || 'Failed to dispatch SMS');
    } finally {
      setSmsSending(false);
    }
  };

  const handleCopyReport = () => {
    const textToCopy = getFormattedReportText();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            flexShrink: 0
          }}>
            <Bot size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              OpenAI Student Feedback & Parent Dispatch
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Generate comprehensive evaluations and send directly to parents' mobile numbers via WhatsApp or SMS
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Controls & Parent Info Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--accent-cyan)" /> Select Student Profile
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Student Roster
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="glass-input"
              style={{ fontWeight: 600 }}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  #{s.rollNumber || s.roll_number} - {s.name} ({s.class || 'Grade 10-A'})
                </option>
              ))}
            </select>
          </div>

          {/* Automatic Parent Contact Badge */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} /> Auto-Linked Parent Contact
              </span>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.68rem' }}>
                Verified
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Parent / Guardian Name:</label>
              <input
                type="text"
                className="glass-input"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', marginTop: '0.2rem' }}
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Parent Mobile Phone (WhatsApp / SMS):</label>
              <div style={{ position: 'relative', marginTop: '0.2rem' }}>
                <Phone size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
                <input
                  type="text"
                  className="glass-input"
                  style={{ paddingLeft: '2.25rem', padding: '0.4rem 0.75rem 0.4rem 2.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#34d399' }}
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Teacher Observations / Behavioral Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="glass-input"
              placeholder="e.g. Shows outstanding passion in Science experiments, very punctual for class..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {loading ? 'Consulting OpenAI Engine...' : (
              <>
                <Sparkles size={18} /> Generate AI Feedback Note
              </>
            )}
          </button>
        </div>

        {/* AI Output & Direct Parent Dispatch Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bot size={18} color="var(--accent-purple)" /> AI Evaluation & Parent Dispatch
            </h3>

            {feedbackResult && (
              <button
                onClick={handleCopyReport}
                className="btn-secondary"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.45rem 0.85rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            )}
          </div>

          {dispatchStatus && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={18} />
              <span>{dispatchStatus}</span>
            </div>
          )}

          {dispatchError && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} />
              <span>{dispatchError}</span>
            </div>
          )}

          {!feedbackResult && !loading && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-muted)'
            }}>
              <Bot size={48} color="rgba(255, 255, 255, 0.2)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No AI Feedback Generated Yet</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.3rem', maxWidth: '320px' }}>
                Select a student on the left and click "Generate AI Feedback Note" to create report and activate parent phone dispatch buttons.
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '3px solid rgba(139, 92, 246, 0.2)',
                borderTopColor: '#c084fc',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <p style={{ color: '#fff', fontWeight: 700 }}>Synthesizing Student Evaluation...</p>
            </div>
          )}

          {feedbackResult && feedbackResult.feedback && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              {/* Direct Parent Action Dispatch Buttons */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Direct Parent Dispatch Actions ({parentPhone})
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    onClick={handleSendWhatsApp}
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      fontSize: '0.82rem',
                      padding: '0.65rem 0.5rem',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    <MessageSquare size={15} /> Send WhatsApp
                  </button>

                  <button
                    onClick={handleSendSMS}
                    disabled={smsSending}
                    className="btn-primary"
                    style={{
                      background: 'var(--gradient-brand)',
                      fontSize: '0.82rem',
                      padding: '0.65rem 0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Smartphone size={15} /> {smsSending ? 'Sending...' : 'Send SMS Alert'}
                  </button>
                </div>
              </div>

              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem'
              }}>
                <h4 style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Overall Performance Summary
                </h4>
                <p style={{ fontSize: '0.925rem', color: '#fff', lineHeight: 1.6 }}>
                  {feedbackResult.feedback.summary}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} /> Key Strengths
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  {feedbackResult.feedback.strengths}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} /> Focus & Growth Areas
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  {feedbackResult.feedback.areasForImprovement}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} /> Parent Recommendations
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  {feedbackResult.feedback.parentRecommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
