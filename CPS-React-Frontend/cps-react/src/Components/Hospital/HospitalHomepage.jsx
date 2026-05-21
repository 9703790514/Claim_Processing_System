


import React, { useState } from 'react';
import './HospitalDashBoard.css'; // Import the CSS file

const HospitalHomepage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const dashboardStats = [
    { title: 'Total Patients', value: '1,247', change: '+12%', color: '#008080' },
    { title: 'Active Claims', value: '89', change: '+5%', color: '#1A3E72' },
    { title: 'Pending Pre-Auth', value: '23', change: '-8%', color: '#FFA500' },
    { title: 'Revenue This Month', value: 'RS 12,00,000', change: '+18%', color: '#708090' }
  ];

  const quickActions = [
    { label: 'Submit New Pre-Auth', icon: '📝' },
    { label: 'Admit New Patient', icon: '🏥' },
    { label: 'Process Insurance Claim', icon: '💰' },
   
  ];

  const recentAlerts = [
    { message: 'Pre-auth PA001 requires attention', type: 'warning' },
    { message: 'Claim CL002 payment received', type: 'success' },
    { message: 'Patient discharge pending', type: 'info' }
  ];

  const systemStatus = [
    { service: 'Insurance Gateway', status: 'Online', uptime: '99.9%' },
    { service: 'Claims Processing', status: 'Online', uptime: '98.7%' },
    { service: 'Patient Database', status: 'Online', uptime: '100%' }
  ];

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            
            <div>
              <h1 className="title">MediCare Hospital</h1>
              <p className="subtitle">Health Insurance Management System</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search patients, claims..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-icon" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
            <button className="emergency-button">Emergency</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Dashboard Overview */}
        <section className="dashboard-overview">
          <h2>Dashboard Overview</h2>
          <p className="dashboard-subtitle">Health Insurance Management System Dashboard</p>
        </section>

        <section className="dashboard-stats">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ borderLeftColor: stat.color }}
            >
              <div className="stat-info">
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
              <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.change}
              </span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default HospitalHomepage;
