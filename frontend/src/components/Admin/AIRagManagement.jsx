import { useState } from 'react';
import { 
  Brain, Database, Upload, FileText, Zap, TrendingUp, CheckCircle, Clock, 
  AlertCircle, Plus, RefreshCw, Trash2, X, Settings, ShieldCheck 
} from 'lucide-react';

export default function AIRagManagement({ showToast }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, knowledge-bases, models
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    school: 'Springfield High School',
    subject: 'Mathematics',
    files: []
  });

  const [knowledgeBases, setKnowledgeBases] = useState([
    {
      id: 1,
      name: 'Grade 10 Mathematics',
      school: 'Springfield High School',
      documents: 156,
      status: 'active',
      lastUpdated: '2 hours ago',
      queries: 1234,
      accuracy: 96.5
    },
    {
      id: 2,
      name: 'Science Curriculum - Physics',
      school: 'Riverdale Academy',
      documents: 289,
      status: 'processing',
      lastUpdated: '10 mins ago',
      queries: 2341,
      accuracy: 94.2
    },
    {
      id: 3,
      name: 'English Literature',
      school: 'Central City High',
      documents: 423,
      status: 'active',
      lastUpdated: '1 day ago',
      queries: 3456,
      accuracy: 92.8
    },
    {
      id: 4,
      name: 'History - World Wars',
      school: 'Sunnydale School',
      documents: 198,
      status: 'error',
      lastUpdated: '3 days ago',
      queries: 876,
      accuracy: 88.5
    }
  ]);

  const [models, setModels] = useState([
    {
      id: 1,
      name: 'GPT-4o',
      provider: 'OpenAI',
      usage: 'Primary AI Tutor',
      status: 'active',
      requests: 23456,
      avgLatency: '1.2s',
      temperature: 0.7
    },
    {
      id: 2,
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      usage: 'Teacher Copilot',
      status: 'active',
      requests: 12345,
      avgLatency: '0.9s',
      temperature: 0.5
    },
    {
      id: 3,
      name: 'Text Embedding 3 Large',
      provider: 'OpenAI',
      usage: 'Document Processing',
      status: 'active',
      requests: 45678,
      avgLatency: '0.3s',
      temperature: 0.0
    }
  ]);

  const stats = {
    totalKnowledgeBases: knowledgeBases.length,
    totalDocuments: knowledgeBases.reduce((s, k) => s + k.documents, 0),
    totalQueries: knowledgeBases.reduce((s, k) => s + k.queries, 0),
    avgAccuracy: `${(knowledgeBases.reduce((s, k) => s + k.accuracy, 0) / knowledgeBases.length).toFixed(1)}%`
  };

  const handleUploadKnowledgeBase = () => {
    if (!formData.name) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newKb = {
        id: Date.now(),
        name: formData.name,
        school: formData.school,
        documents: Math.floor(Math.random() * 50) + 10,
        status: 'active',
        lastUpdated: 'Just now',
        queries: 0,
        accuracy: 98.0
      };

      setKnowledgeBases([newKb, ...knowledgeBases]);
      setIsProcessing(false);
      setShowUploadModal(false);
      resetForm();
      if (showToast) showToast(`Knowledge base "${newKb.name}" uploaded and indexed successfully!`, 'success');
    }, 1200);
  };

  const handleReindex = (kb) => {
    setKnowledgeBases(knowledgeBases.map(k => 
      k.id === kb.id ? { ...k, status: 'processing' } : k
    ));
    if (showToast) showToast(`Re-indexing triggered for "${kb.name}"`, 'info');

    setTimeout(() => {
      setKnowledgeBases(prev => prev.map(k => 
        k.id === kb.id ? { ...k, status: 'active', lastUpdated: 'Just now', accuracy: Math.min(99.5, k.accuracy + 1.2) } : k
      ));
      if (showToast) showToast(`Re-indexing finished for "${kb.name}"`, 'success');
    }, 2000);
  };

  const handleDeleteKB = (kbId) => {
    const kb = knowledgeBases.find(k => k.id === kbId);
    setKnowledgeBases(knowledgeBases.filter(k => k.id !== kbId));
    if (showToast) showToast(`Knowledge base "${kb?.name}" deleted!`, 'warning');
  };

  const openModelConfig = (model) => {
    setSelectedModel(model);
    setShowModelModal(true);
  };

  const handleSaveModelConfig = () => {
    setModels(models.map(m => m.id === selectedModel.id ? selectedModel : m));
    setShowModelModal(false);
    if (showToast) showToast(`Model configuration updated for ${selectedModel.name}`, 'success');
    setSelectedModel(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      school: 'Springfield High School',
      subject: 'Mathematics',
      files: []
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            AI / RAG Management
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Orchestrate retrieval-augmented generation engines, vector DBs, and LLM routes
          </p>
        </div>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setShowUploadModal(true)}
        >
          <Upload size={18} /> Upload Knowledge Base
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatCard
          icon={Database}
          label="Knowledge Bases"
          value={stats.totalKnowledgeBases}
          color="var(--accent-primary)"
        />
        <StatCard
          icon={FileText}
          label="Indexed Documents"
          value={stats.totalDocuments.toLocaleString()}
          color="var(--accent-cyan)"
        />
        <StatCard
          icon={Zap}
          label="AI Queries Served"
          value={stats.totalQueries.toLocaleString()}
          color="var(--accent-amber)"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg RAG Retrieval Precision"
          value={stats.avgAccuracy}
          color="var(--accent-emerald)"
        />
      </div>

      {/* Tabs */}
      <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1, padding: '0.75rem' }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('knowledge-bases')}
          className={activeTab === 'knowledge-bases' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1, padding: '0.75rem' }}
        >
          Knowledge Bases ({knowledgeBases.length})
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={activeTab === 'models' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1, padding: '0.75rem' }}
        >
          AI Models ({models.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-emerald)" /> DokGuru Vector Engine Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <StatusRow label="DokGuru RAG Gateway" status="operational" detail="All neural routes healthy" />
              <StatusRow label="Chunking & Embedding Worker" status="operational" detail="0 tasks bottlenecked" />
              <StatusRow label="Pinecone Vector Index" status="operational" detail="3.2M vectors indexed" />
              <StatusRow label="Grounding Guardrails" status="operational" detail="Hallucination rate < 0.1%" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                Recent RAG Operations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ActivityItem
                  action="Knowledge base re-indexed"
                  target="Grade 10 Mathematics"
                  time="2 hours ago"
                />
                <ActivityItem
                  action="PDF Syllabus parsed (23 files)"
                  target="Science Curriculum"
                  time="5 hours ago"
                />
                <ActivityItem
                  action="Embedding model upgraded"
                  target="OpenAI text-embedding-3"
                  time="1 day ago"
                />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                Highest Precision Indexing
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {knowledgeBases.slice(0, 3).map((kb) => (
                  <div key={kb.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>{kb.name}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      {kb.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Knowledge Bases Tab */}
      {activeTab === 'knowledge-bases' && (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Index Name</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Target School</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Docs</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Queries</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Precision</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeBases.map((kb) => (
                  <tr key={kb.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                      {kb.name}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {kb.school}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {kb.documents}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {getStatusBadge(kb.status)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {kb.queries.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      {kb.accuracy}%
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.6rem' }}
                          title="Re-index Knowledge Base"
                          onClick={() => handleReindex(kb)}
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-red)' }}
                          title="Delete Knowledge Base"
                          onClick={() => handleDeleteKB(kb.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Models Tab */}
      {activeTab === 'models' && (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Model Name</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Provider</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Role / Purpose</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Requests</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Latency</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Configure</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain size={20} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                          {model.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {model.provider}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {model.usage}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span className="badge badge-present">
                        <CheckCircle size={14} />
                        {model.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {model.requests.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {model.avgLatency}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.4rem 0.6rem' }}
                        onClick={() => openModelConfig(model)}
                      >
                        <Settings size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal onClose={() => { setShowUploadModal(false); resetForm(); }} title="Upload & Index Curriculum Knowledge Base">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Knowledge Base Title *
              </label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Grade 11 Chemistry Curriculum"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Target School
              </label>
              <select
                className="glass-input"
                style={{ width: '100%' }}
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              >
                <option value="Springfield High School">Springfield High School</option>
                <option value="Riverdale Academy">Riverdale Academy</option>
                <option value="Sunnydale School">Sunnydale School</option>
                <option value="Central City High">Central City High</option>
              </select>
            </div>

            {/* Dropzone File Upload Simulator */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Documents & Syllabi (.pdf, .docx, .txt)
              </label>
              <div style={{
                border: '2px dashed var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                cursor: 'pointer'
              }}>
                <Upload size={32} color="var(--accent-primary)" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 600 }}>
                  Drag & drop curriculum files here
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Supports PDF textbook chapters, lesson plans, and exam keys up to 100MB
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => { setShowUploadModal(false); resetForm(); }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.75rem' }}
                disabled={!formData.name || isProcessing}
                onClick={handleUploadKnowledgeBase}
              >
                {isProcessing ? 'Parsing & Embedding...' : 'Start Indexing'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Model Config Modal */}
      {showModelModal && selectedModel && (
        <Modal onClose={() => { setShowModelModal(false); setSelectedModel(null); }} title={`Configure ${selectedModel.name}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Temperature (Creativity): {selectedModel.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedModel.temperature}
                onChange={(e) => setSelectedModel({ ...selectedModel, temperature: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Assigned Purpose / Route
              </label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={selectedModel.usage}
                onChange={(e) => setSelectedModel({ ...selectedModel, usage: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => { setShowModelModal(false); setSelectedModel(null); }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={handleSaveModelConfig}
              >
                Save Settings
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `${color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
        {value}
      </div>
    </div>
  );
}

function StatusRow({ label, status, detail }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{detail}</span>
        <CheckCircle size={16} color="var(--accent-emerald)" />
      </div>
    </div>
  );
}

function ActivityItem({ action, target, time }) {
  return (
    <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)' }}>
      <div style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.25rem' }}>{action}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {target} • {time}
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  const badges = {
    active: { className: 'badge-present', icon: CheckCircle, text: 'Active' },
    processing: { className: 'badge badge-late', icon: Clock, text: 'Indexing' },
    error: { className: 'badge-absent', icon: AlertCircle, text: 'Failed' }
  };
  
  const badge = badges[status] || badges.active;
  const Icon = badge.icon;
  
  return (
    <span className={badge.className}>
      <Icon size={14} />
      {badge.text}
    </span>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.6rem' }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
