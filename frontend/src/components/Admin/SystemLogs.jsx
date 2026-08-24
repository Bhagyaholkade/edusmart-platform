import { useState } from 'react';
import { 
  FileText, AlertCircle, Info, AlertTriangle, XCircle, CheckCircle, 
  Search, Download, Trash2, Eye, X, Terminal, Filter 
} from 'lucide-react';

export default function SystemLogs({ showToast }) {
  const [logLevel, setLogLevel] = useState('all'); // all, error, warning, info
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('1h'); // 1h, 24h, 7d
  const [selectedLog, setSelectedLog] = useState(null);

  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2026-08-23 16:45:23',
      level: 'error',
      category: 'Authentication',
      message: 'Failed login attempt for principal@school.edu',
      details: 'Invalid password hash provided from IP 192.168.1.45',
      source: 'auth-service',
      stackTrace: 'Error: Unauthorized\n    at LoginHandler (auth.js:42:15)\n    at Layer.handle [as handle_request] (express/lib/router/layer.js:95:5)'
    },
    {
      id: 2,
      timestamp: '2026-08-23 16:44:12',
      level: 'warning',
      category: 'API Gateway',
      message: 'Rate limit threshold approaching for Springfield High',
      details: '85% of assigned API quota used (8,500 / 10,000 req/hr)',
      source: 'api-gateway',
      stackTrace: 'Warn: RateLimitExceededWarning\n    at LimitEnforcer (gateway.js:112:8)'
    },
    {
      id: 3,
      timestamp: '2026-08-23 16:43:45',
      level: 'info',
      category: 'Knowledge Base',
      message: 'RAG Document Chunking Pipeline completed',
      details: '23 PDF documents chunked into 1,450 embeddings in 4.2 seconds',
      source: 'rag-engine',
      stackTrace: 'Info: Success\n    at ChunkPipeline (dokguru.js:88:12)'
    },
    {
      id: 4,
      timestamp: '2026-08-23 16:42:18',
      level: 'success',
      category: 'Database System',
      message: 'Automated DB snapshot backup completed',
      details: 'Backup size: 2.4 GB, Storage Target: s3://edusmart-backups/20260823.tar.gz',
      source: 'backup-service',
      stackTrace: 'Info: Backup Complete'
    },
    {
      id: 5,
      timestamp: '2026-08-23 16:40:55',
      level: 'error',
      category: 'AI Service',
      message: 'OpenAI GPT-4o API timeout on completion route',
      details: 'HTTP POST https://api.openai.com/v1/chat/completions timed out after 30,000ms',
      source: 'ai-service',
      stackTrace: 'TimeoutError: Request timed out\n    at Fetch.doFetch (node-fetch.js:145:11)\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)'
    },
    {
      id: 6,
      timestamp: '2026-08-23 16:38:22',
      level: 'warning',
      category: 'Cloud Storage',
      message: 'School Storage capacity exceeded threshold (78%)',
      details: 'Riverdale Academy has used 39 GB of 50 GB allocated quota',
      source: 'storage-monitor',
      stackTrace: 'Warn: HighDiskUsage'
    },
    {
      id: 7,
      timestamp: '2026-08-23 16:35:10',
      level: 'info',
      category: 'Tenant Service',
      message: 'New institution onboarded successfully',
      details: 'Oakwood Academy initialized under Enterprise Plan',
      source: 'registration-service',
      stackTrace: 'Info: TenantCreated'
    },
    {
      id: 8,
      timestamp: '2026-08-23 16:32:48',
      level: 'info',
      category: 'Cache Invalidation',
      message: 'Redis cluster cache flushed',
      details: '450 MB transient user session data purged',
      source: 'cache-service',
      stackTrace: 'Info: CacheFlush'
    }
  ]);

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return { icon: XCircle, color: 'var(--accent-red)' };
      case 'warning':
        return { icon: AlertTriangle, color: 'var(--accent-amber)' };
      case 'info':
        return { icon: Info, color: 'var(--accent-cyan)' };
      case 'success':
        return { icon: CheckCircle, color: 'var(--accent-emerald)' };
      default:
        return { icon: Info, color: 'var(--text-muted)' };
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    const matchesSearch = searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const logCounts = {
    error: logs.filter(l => l.level === 'error').length,
    warning: logs.filter(l => l.level === 'warning').length,
    info: logs.filter(l => l.level === 'info').length,
    success: logs.filter(l => l.level === 'success').length
  };

  const handleExportLogs = () => {
    const content = filteredLogs.map(l => 
      `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.source}] (${l.category}): ${l.message} - ${l.details}`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system_logs_${new Date().toISOString().split('T')[0]}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToast) showToast(`Exported ${filteredLogs.length} log entries to file`, 'success');
  };

  const handleClearLogs = () => {
    setLogs([]);
    if (showToast) showToast('System log buffer cleared', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            System Logs & Telemetry
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Audit trails, error stack traces, and real-time backend execution logs
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleExportLogs}
          >
            <Download size={18} /> Export Logs
          </button>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)' }}
            onClick={handleClearLogs}
          >
            <Trash2 size={18} /> Clear Buffer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatCard
          icon={XCircle}
          label="Errors"
          value={logCounts.error}
          color="var(--accent-red)"
        />
        <StatCard
          icon={AlertTriangle}
          label="Warnings"
          value={logCounts.warning}
          color="var(--accent-amber)"
        />
        <StatCard
          icon={Info}
          label="Info Events"
          value={logCounts.info}
          color="var(--accent-cyan)"
        />
        <StatCard
          icon={CheckCircle}
          label="Success Audit"
          value={logCounts.success}
          color="var(--accent-emerald)"
        />
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search logs by message, component, or trace details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
            />
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="glass-input"
            style={{ width: '150px' }}
          >
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setLogLevel('all')}
              className={logLevel === 'all' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            >
              All
            </button>
            <button
              onClick={() => setLogLevel('error')}
              className={logLevel === 'error' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            >
              Errors
            </button>
            <button
              onClick={() => setLogLevel('warning')}
              className={logLevel === 'warning' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            >
              Warnings
            </button>
            <button
              onClick={() => setLogLevel('info')}
              className={logLevel === 'info' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            >
              Info
            </button>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="glass-panel" style={{ padding: '0' }}>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No system log entries found matching criteria.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const levelInfo = getLevelIcon(log.level);
              const LevelIcon = levelInfo.icon;
              
              return (
                <div
                  key={log.id}
                  style={{
                    padding: '1.15rem 1.5rem',
                    borderBottom: '1px solid var(--glass-border)',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedLog(log)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {/* Icon */}
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${levelInfo.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <LevelIcon size={20} color={levelInfo.color} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.3rem', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                            {log.message}
                          </h4>
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              padding: '0.15rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid var(--glass-border)'
                            }}>
                              {log.category}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                              {log.source}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {log.timestamp}
                          </span>
                          <Eye size={16} color="var(--text-subtle)" />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                        {log.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detailed Log Inspection Modal */}
      {selectedLog && (
        <Modal onClose={() => setSelectedLog(null)} title="Log Inspector & Stack Trace">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              {(() => {
                const info = getLevelIcon(selectedLog.level);
                const Icon = info.icon;
                return <Icon size={24} color={info.color} />;
              })()}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{selectedLog.message}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedLog.timestamp} • Source: {selectedLog.source}</p>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Event Details:
              </label>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#fff' }}>
                {selectedLog.details}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <Terminal size={14} /> Stack Trace / Execution Log:
              </label>
              <pre style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--glass-border)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.775rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'monospace',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedLog.stackTrace || 'No stack trace recorded for this log entry.'}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn-primary" onClick={() => setSelectedLog(null)}>
                Done
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
        maxWidth: '560px',
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
