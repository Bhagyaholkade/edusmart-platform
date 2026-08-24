import { useState } from 'react';
import { TrendingUp, Activity, Zap, Database, BarChart3, Download, Calendar, Filter } from 'lucide-react';

export default function UsageAnalytics({ showToast }) {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('all');

  // Dynamic datasets by time range
  const dataMap = {
    '7d': {
      metrics: {
        totalApiCalls: '1,247,832',
        aiRequests: '45,621',
        activeUsers: '3,894',
        storageUsed: '278 GB',
        avgResponseTime: '124ms',
        uptime: '99.98%'
      },
      dailyActivity: [
        { day: 'Mon', users: 3420, aiRequests: 8932, apiCalls: 187234 },
        { day: 'Tue', users: 3654, aiRequests: 9445, apiCalls: 201456 },
        { day: 'Wed', users: 3789, aiRequests: 10234, apiCalls: 215678 },
        { day: 'Thu', users: 3901, aiRequests: 11023, apiCalls: 223890 },
        { day: 'Fri', users: 3845, aiRequests: 10567, apiCalls: 218765 },
        { day: 'Sat', users: 2341, aiRequests: 6234, apiCalls: 123456 },
        { day: 'Sun', users: 2156, aiRequests: 5789, apiCalls: 115678 }
      ]
    },
    '30d': {
      metrics: {
        totalApiCalls: '5,120,490',
        aiRequests: '184,310',
        activeUsers: '4,210',
        storageUsed: '312 GB',
        avgResponseTime: '118ms',
        uptime: '99.99%'
      },
      dailyActivity: [
        { day: 'W1', users: 3200, aiRequests: 38000, apiCalls: 1100000 },
        { day: 'W2', users: 3650, aiRequests: 42500, apiCalls: 1250000 },
        { day: 'W3', users: 3980, aiRequests: 48900, apiCalls: 1380000 },
        { day: 'W4', users: 4210, aiRequests: 54910, apiCalls: 1390490 }
      ]
    },
    '90d': {
      metrics: {
        totalApiCalls: '15,840,000',
        aiRequests: '520,000',
        activeUsers: '4,850',
        storageUsed: '410 GB',
        avgResponseTime: '130ms',
        uptime: '99.95%'
      },
      dailyActivity: [
        { day: 'Month 1', users: 3100, aiRequests: 140000, apiCalls: 4500000 },
        { day: 'Month 2', users: 3900, aiRequests: 175000, apiCalls: 5200000 },
        { day: 'Month 3', users: 4850, aiRequests: 205000, apiCalls: 6140000 }
      ]
    },
    '1y': {
      metrics: {
        totalApiCalls: '58,200,000',
        aiRequests: '1,890,000',
        activeUsers: '5,400',
        storageUsed: '580 GB',
        avgResponseTime: '125ms',
        uptime: '99.97%'
      },
      dailyActivity: [
        { day: 'Q1', users: 2800, aiRequests: 380000, apiCalls: 12000000 },
        { day: 'Q2', users: 3400, aiRequests: 450000, apiCalls: 14200000 },
        { day: 'Q3', users: 4300, aiRequests: 510000, apiCalls: 15500000 },
        { day: 'Q4', users: 5400, aiRequests: 550000, apiCalls: 16500000 }
      ]
    }
  };

  const currentData = dataMap[timeRange] || dataMap['7d'];

  const apiUsageBySchool = [
    { school: 'Riverdale Academy', calls: 312456, aiCalls: 12340, percentage: 25 },
    { school: 'Springfield High', calls: 245789, aiCalls: 9823, percentage: 20 },
    { school: 'Central City High', calls: 189234, aiCalls: 8234, percentage: 15 },
    { school: 'Sunnydale School', calls: 156890, aiCalls: 6892, percentage: 13 },
    { school: 'Others', calls: 343463, aiCalls: 8332, percentage: 27 }
  ];

  const filteredSchools = apiUsageBySchool.filter(item => 
    selectedSchoolFilter === 'all' || item.school === selectedSchoolFilter
  );

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      timeRange: timeRange,
      metrics: currentData.metrics,
      schoolUsage: apiUsageBySchool,
      dailyActivity: currentData.dailyActivity
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usage_analytics_report_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToast) showToast(`Analytics report exported successfully (${timeRange})`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Usage & Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Real-time telemetry, API throughput, and system resource distribution
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="glass-input"
            style={{ width: '160px' }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleExportReport}
          >
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <MetricCard
          icon={Activity}
          label="Total API Calls"
          value={currentData.metrics.totalApiCalls}
          trend="+12.5% increase"
          color="var(--accent-primary)"
        />
        <MetricCard
          icon={Zap}
          label="AI Requests"
          value={currentData.metrics.aiRequests}
          trend="+18.3% increase"
          color="var(--accent-amber)"
        />
        <MetricCard
          icon={TrendingUp}
          label="Active Users"
          value={currentData.metrics.activeUsers}
          trend="+8.7% growth"
          color="var(--accent-cyan)"
        />
        <MetricCard
          icon={Database}
          label="Storage Allocated"
          value={currentData.metrics.storageUsed}
          trend="+5.2% expansion"
          color="var(--accent-emerald)"
        />
      </div>

      {/* Daily Activity Chart */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Activity Distribution ({timeRange})</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Active user engagement and API call volumes over time
            </p>
          </div>
          <Calendar size={20} color="var(--accent-cyan)" />
        </div>

        {/* Dynamic Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '220px', padding: '1.5rem 0 0.5rem' }}>
          {currentData.dailyActivity.map((item, idx) => {
            const maxUsers = Math.max(...currentData.dailyActivity.map(d => d.users));
            const height = (item.users / maxUsers) * 100;
            const oceanGradients = [
              'linear-gradient(180deg, rgba(56, 189, 248, 0.75) 0%, rgba(37, 99, 235, 0.25) 100%)',
              'linear-gradient(180deg, rgba(56, 189, 248, 0.65) 0%, rgba(37, 99, 235, 0.20) 100%)',
              'linear-gradient(180deg, rgba(56, 189, 248, 0.80) 0%, rgba(37, 99, 235, 0.30) 100%)',
              'linear-gradient(180deg, rgba(56, 189, 248, 0.85) 0%, rgba(37, 99, 235, 0.35) 100%)',
              'linear-gradient(180deg, rgba(56, 189, 248, 0.78) 0%, rgba(37, 99, 235, 0.28) 100%)',
              'linear-gradient(180deg, rgba(56, 189, 248, 0.55) 0%, rgba(37, 99, 235, 0.18) 100%)',
              'linear-gradient(180deg, rgba(56, 189, 248, 0.50) 0%, rgba(37, 99, 235, 0.15) 100%)',
            ];
            const currentGradient = oceanGradients[idx % oceanGradients.length];

            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                <div 
                  title={`Active users: ${item.users.toLocaleString()}`}
                  style={{ 
                    width: '100%', 
                    height: `${Math.max(height, 8)}%`, 
                    background: currentGradient, 
                    borderRadius: '6px 6px 0 0',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    borderTop: '2px solid #38bdf8',
                    borderLeft: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRight: '1px solid rgba(56, 189, 248, 0.2)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), 0 0 10px rgba(56, 189, 248, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, rgba(56, 189, 248, 0.95) 0%, rgba(37, 99, 235, 0.5) 100%)';
                    e.currentTarget.style.borderTop = '2px solid #ffffff';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = currentGradient;
                    e.currentTarget.style.borderTop = '2px solid #38bdf8';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4), 0 0 10px rgba(56, 189, 248, 0.15)';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-1.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.users.toLocaleString()}
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* API Usage by School */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>API & AI Usage Breakdown</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Resource consumption split across onboarded schools
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-subtle)" />
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="glass-input"
              style={{ width: '200px' }}
            >
              <option value="all">All Institutions</option>
              {apiUsageBySchool.map((s, idx) => (
                <option key={idx} value={s.school}>{s.school}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredSchools.map((item, idx) => {
            const progressGradients = [
              'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)',
              'linear-gradient(90deg, #34d399 0%, #059669 100%)',
              'linear-gradient(90deg, #8b5cf6 0%, #4f46e5 100%)',
              'linear-gradient(90deg, #fbbf24 0%, #ea580c 100%)',
              'linear-gradient(90deg, #06b6d4 0%, #2563eb 100%)',
            ];
            const currentProgGradient = progressGradients[idx % progressGradients.length];

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{item.school}</span>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: '#38bdf8' }}>{item.calls.toLocaleString()}</strong> requests
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: '#34d399' }}>{item.aiCalls.toLocaleString()}</strong> AI queries
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', minWidth: '45px', textAlign: 'right' }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${item.percentage}%`, 
                    height: '100%', 
                    background: currentProgGradient,
                    borderRadius: '4px',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            System SLA & Performance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <PerformanceRow label="Avg Response Time" value={currentData.metrics.avgResponseTime} status="excellent" />
            <PerformanceRow label="System Uptime SLA" value={currentData.metrics.uptime} status="excellent" />
            <PerformanceRow label="API Error Rate" value="0.02%" status="good" />
            <PerformanceRow label="P95 Response Latency" value="287ms" status="good" />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            Infrastructure Load
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ResourceBar label="CPU Compute Cluster" percentage={68} color="var(--accent-primary)" />
            <ResourceBar label="Memory Consumption" percentage={72} color="var(--accent-cyan)" />
            <ResourceBar label="Database Disk Usage" percentage={54} color="var(--accent-emerald)" />
            <ResourceBar label="Network Bandwidth" percentage={81} color="var(--accent-amber)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, color }) {
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
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
        {trend}
      </div>
    </div>
  );
}

function PerformanceRow({ label, value, status }) {
  const statusColors = {
    excellent: 'var(--accent-emerald)',
    good: 'var(--accent-cyan)',
    warning: 'var(--accent-amber)',
    critical: 'var(--accent-red)'
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: statusColors[status] }}>
        {value}
      </span>
    </div>
  );
}

function ResourceBar({ label, percentage, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: color }}>{percentage}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}
