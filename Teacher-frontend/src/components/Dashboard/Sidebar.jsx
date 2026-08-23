import React, { useRef } from 'react';
import { LayoutDashboard, Fingerprint, Award, Bot, User } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const containerRef = useRef(null);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Biometric Attendance', icon: Fingerprint, badge: 'Live' },
    { id: 'marks', label: 'Exam Gradebook', icon: Award },
    { id: 'ai-feedback', label: 'AI Feedback', icon: Bot, badge: 'GPT-4o' },
    { id: 'profile', label: 'Teacher Profile', icon: User }
  ];

  const handleTabClick = (itemId, e) => {
    setActiveTab(itemId);

    // Auto-scroll selected tab into view / 1st position on mobile viewports
    if (e && e.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  };

  return (
    <aside className="app-sidebar-container glass-panel">
      <div className="app-sidebar-nav-horizontal" ref={containerRef}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={(e) => handleTabClick(item.id, e)}
              className={`nav-tab-button ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-subtle)'} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-tab-badge">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
