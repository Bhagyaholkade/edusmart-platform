import { useState, useEffect } from 'react';
import { Settings, Globe, Shield, Database, Zap, Bell, Key, Mail, Save, RefreshCw } from 'lucide-react';

const DEFAULT_SETTINGS = {
  platformName: 'EduSmart AI Platform',
  supportEmail: 'support@edusmart.ai',
  timezone: 'UTC',
  enableAiTutor: true,
  enableTeacherCopilot: true,
  enableRagKnowledgeBase: true,
  enableVoiceInput: true,
  storageLimitGb: 50,
  autoCleanupDays: 365,
  requireMfa: true,
  sessionTimeoutMins: 30,
  minPasswordLength: 8,
  ipWhitelistEnabled: false,
  apiRateLimiting: true,
  dataEncryption: true,
  auditLogging: true,
  openaiApiKey: 'sk-proj-••••••••••••••••',
  anthropicApiKey: 'sk-ant-••••••••••••••••',
  dokguruEndpoint: 'https://api.dokguru.ai/v1',
  dokguruApiKey: 'dkg-••••••••••••••••',
  sendgridApiKey: 'SG.••••••••••••••••',
  analyticsId: 'G-XXXXXXXXXX',
  notifyNewSchool: true,
  notifySystemErrors: true,
  notifyUsageAlerts: true,
  sendWeeklyReports: true,
  notifyFeatureUpdates: true
};

export default function PlatformSettings({ showToast }) {
  const [activeTab, setActiveTab] = useState('general'); // general, security, api, notifications

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('edusmart_platform_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('edusmart_platform_settings', JSON.stringify(settings));
    if (showToast) showToast('Platform configuration saved successfully!', 'success');
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('edusmart_platform_settings', JSON.stringify(DEFAULT_SETTINGS));
    if (showToast) showToast('Platform settings reset to default state.', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Platform Settings
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Configure environment parameters, security policies, and third-party integrations
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleResetDefaults}
          >
            <RefreshCw size={18} /> Reset Defaults
          </button>
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleSave}
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        <TabButton
          icon={Globe}
          label="General"
          active={activeTab === 'general'}
          onClick={() => setActiveTab('general')}
        />
        <TabButton
          icon={Shield}
          label="Security"
          active={activeTab === 'security'}
          onClick={() => setActiveTab('security')}
        />
        <TabButton
          icon={Key}
          label="API Keys & Services"
          active={activeTab === 'api'}
          onClick={() => setActiveTab('api')}
        />
        <TabButton
          icon={Bell}
          label="Notifications"
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
        />
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SettingsSection title="Platform Information">
            <SettingRow
              label="Platform Title"
              description="Display name rendered on login and emails"
            >
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="glass-input"
                style={{ width: '300px' }}
              />
            </SettingRow>
            <SettingRow
              label="Support Contact Email"
              description="Primary address for help requests"
            >
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="glass-input"
                style={{ width: '300px' }}
              />
            </SettingRow>
            <SettingRow
              label="Default Timezone"
              description="Standard reference timezone for daily schedules"
            >
              <select 
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="glass-input" 
                style={{ width: '300px' }}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </SettingRow>
          </SettingsSection>

          <SettingsSection title="AI Features & Capabilities">
            <SettingRow
              label="AI Tutor for Students"
              description="Enable interactive study assistance for student accounts"
            >
              <ToggleSwitch 
                checked={settings.enableAiTutor} 
                onChange={(val) => handleChange('enableAiTutor', val)} 
              />
            </SettingRow>
            <SettingRow
              label="Teacher AI Copilot"
              description="Enable automated grading and lesson planning copilot"
            >
              <ToggleSwitch 
                checked={settings.enableTeacherCopilot} 
                onChange={(val) => handleChange('enableTeacherCopilot', val)} 
              />
            </SettingRow>
            <SettingRow
              label="RAG Knowledge Base Grounding"
              description="Enforce answers grounded in uploaded curriculum materials"
            >
              <ToggleSwitch 
                checked={settings.enableRagKnowledgeBase} 
                onChange={(val) => handleChange('enableRagKnowledgeBase', val)} 
              />
            </SettingRow>
            <SettingRow
              label="Voice & Audio Input"
              description="Allow speech-to-text audio input for AI prompt queries"
            >
              <ToggleSwitch 
                checked={settings.enableVoiceInput} 
                onChange={(val) => handleChange('enableVoiceInput', val)} 
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection title="Storage & Retentions">
            <SettingRow
              label="Per-School Disk Quota (GB)"
              description="Maximum document storage allowed per institution"
            >
              <input
                type="number"
                value={settings.storageLimitGb}
                onChange={(e) => handleChange('storageLimitGb', parseInt(e.target.value) || 50)}
                className="glass-input"
                style={{ width: '150px' }}
              />
            </SettingRow>
            <SettingRow
              label="Auto-cleanup Retention (Days)"
              description="Purge archived student records after set days"
            >
              <input
                type="number"
                value={settings.autoCleanupDays}
                onChange={(e) => handleChange('autoCleanupDays', parseInt(e.target.value) || 365)}
                className="glass-input"
                style={{ width: '150px' }}
              />
            </SettingRow>
          </SettingsSection>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SettingsSection title="Authentication Controls">
            <SettingRow
              label="Multi-Factor Authentication (MFA)"
              description="Enforce 2FA/MFA for all administrative accounts"
            >
              <ToggleSwitch 
                checked={settings.requireMfa} 
                onChange={(val) => handleChange('requireMfa', val)} 
              />
            </SettingRow>
            <SettingRow
              label="Session Inactivity Timeout (Mins)"
              description="Automatically invalidate active sessions when idle"
            >
              <input
                type="number"
                value={settings.sessionTimeoutMins}
                onChange={(e) => handleChange('sessionTimeoutMins', parseInt(e.target.value) || 30)}
                className="glass-input"
                style={{ width: '150px' }}
              />
            </SettingRow>
            <SettingRow
              label="Min Password Length"
              description="Minimum character requirement for user credentials"
            >
              <input
                type="number"
                value={settings.minPasswordLength}
                onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value) || 8)}
                className="glass-input"
                style={{ width: '150px' }}
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection title="API Security & Access">
            <SettingRow
              label="IP Address Whitelisting"
              description="Restrict admin logins to registered corporate IP blocks"
            >
              <ToggleSwitch 
                checked={settings.ipWhitelistEnabled} 
                onChange={(val) => handleChange('ipWhitelistEnabled', val)} 
              />
            </SettingRow>
            <SettingRow
              label="API Rate Limiting Engine"
              description="Throttle excessive requests to prevent DDoS and API abuse"
            >
              <ToggleSwitch 
                checked={settings.apiRateLimiting} 
                onChange={(val) => handleChange('apiRateLimiting', val)} 
              />
            </SettingRow>
            <SettingRow
              label="Data Encryption at Rest"
              description="Encrypt database tables with AES-256 keys"
            >
              <ToggleSwitch 
                checked={settings.dataEncryption} 
                onChange={(val) => handleChange('dataEncryption', val)} 
              />
            </SettingRow>
            <SettingRow
              label="Comprehensive Audit Logging"
              description="Log all administrative modifications to System Logs"
            >
              <ToggleSwitch 
                checked={settings.auditLogging} 
                onChange={(val) => handleChange('auditLogging', val)} 
              />
            </SettingRow>
          </SettingsSection>
        </div>
      )}

      {/* API Keys Settings */}
      {activeTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SettingsSection title="LLM Provider Keys">
            <SettingRow
              label="OpenAI API Key"
              description="For GPT-4o models and embeddings"
            >
              <input
                type="password"
                value={settings.openaiApiKey}
                onChange={(e) => handleChange('openaiApiKey', e.target.value)}
                className="glass-input"
                style={{ width: '350px' }}
              />
            </SettingRow>
            <SettingRow
              label="Anthropic API Key"
              description="For Claude 3.5 Sonnet queries"
            >
              <input
                type="password"
                value={settings.anthropicApiKey}
                onChange={(e) => handleChange('anthropicApiKey', e.target.value)}
                className="glass-input"
                style={{ width: '350px' }}
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection title="DokGuru RAG Engine Endpoint">
            <SettingRow
              label="DokGuru Gateway URL"
              description="Host URL for vector search and indexing API"
            >
              <input
                type="text"
                value={settings.dokguruEndpoint}
                onChange={(e) => handleChange('dokguruEndpoint', e.target.value)}
                className="glass-input"
                style={{ width: '350px' }}
              />
            </SettingRow>
            <SettingRow
              label="DokGuru Authorization Token"
              description="Secret bearer key for DokGuru cluster"
            >
              <input
                type="password"
                value={settings.dokguruApiKey}
                onChange={(e) => handleChange('dokguruApiKey', e.target.value)}
                className="glass-input"
                style={{ width: '350px' }}
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection title="Integrations & Messaging">
            <SettingRow
              label="SendGrid Mail Key"
              description="For system notification emails"
            >
              <input
                type="password"
                value={settings.sendgridApiKey}
                onChange={(e) => handleChange('sendgridApiKey', e.target.value)}
                className="glass-input"
                style={{ width: '350px' }}
              />
            </SettingRow>
            <SettingRow
              label="Google Analytics Stream Tag"
              description="Telemetry tracking ID"
            >
              <input
                type="text"
                value={settings.analyticsId}
                onChange={(e) => handleChange('analyticsId', e.target.value)}
                className="glass-input"
                style={{ width: '350px' }}
              />
            </SettingRow>
          </SettingsSection>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SettingsSection title="Platform Admin Notifications">
            <SettingRow
              label="New Institution Registration Alert"
              description="Email when a new school registers"
            >
              <ToggleSwitch 
                checked={settings.notifyNewSchool} 
                onChange={(val) => handleChange('notifyNewSchool', val)} 
              />
            </SettingRow>
            <SettingRow
              label="Critical System Error Broadcast"
              description="Instant alert on API timeouts or database errors"
            >
              <ToggleSwitch 
                checked={settings.notifySystemErrors} 
                onChange={(val) => handleChange('notifySystemErrors', val)} 
              />
            </SettingRow>
            <SettingRow
              label="API Limit Reached Alerts"
              description="Notify when a school hits 85%+ quota"
            >
              <ToggleSwitch 
                checked={settings.notifyUsageAlerts} 
                onChange={(val) => handleChange('notifyUsageAlerts', val)} 
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection title="School Admin Broadcasts">
            <SettingRow
              label="Weekly Analytical Digests"
              description="Send automated weekly summaries to Principals"
            >
              <ToggleSwitch 
                checked={settings.sendWeeklyReports} 
                onChange={(val) => handleChange('sendWeeklyReports', val)} 
              />
            </SettingRow>
            <SettingRow
              label="Product & Feature Release Updates"
              description="Notify users about new features and upgrades"
            >
              <ToggleSwitch 
                checked={settings.notifyFeatureUpdates} 
                onChange={(val) => handleChange('notifyFeatureUpdates', val)} 
              />
            </SettingRow>
          </SettingsSection>
        </div>
      )}

      {/* Footer Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
        <button 
          className="btn-secondary" 
          style={{ padding: '0.75rem 1.5rem' }}
          onClick={handleResetDefaults}
        >
          Reset Defaults
        </button>
        <button 
          className="btn-primary" 
          style={{ padding: '0.75rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={handleSave}
        >
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={active ? 'btn-primary' : 'btn-secondary'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.25rem',
        whiteSpace: 'nowrap'
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '2rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '240px' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {description}
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '14px',
        background: checked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.3s ease',
        padding: 0
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '4px',
        left: checked ? '28px' : '4px',
        transition: 'left 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }} />
    </button>
  );
}
