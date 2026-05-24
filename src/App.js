// src/App.js
import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';
import Allocation from './pages/Allocation';
import FuzzyScoring from './pages/FuzzyScoring';
import BlockchainRecords from './pages/BlockchainRecords';
import BankingSystem from './pages/BankingSystem';
import SMSConfirmation from './pages/SMSConfirmation';
import ReportsAnalytics from './pages/ReportsAnalytics';
import SecurityAnalysis from './pages/SecurityAnalysis';
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'verification': return <Verification />;
      case 'allocation': return <Allocation />;
      case 'fuzzy': return <FuzzyScoring />;
      case 'blockchain': return <BlockchainRecords />;
      case 'banking': return <BankingSystem />;
      case 'sms': return <SMSConfirmation />;
      case 'reports': return <ReportsAnalytics />;
      case 'security': return <SecurityAnalysis />;
      default: return <Dashboard />;
    }
  };

  if (currentPage === 'login') {
    return <Login navigate={setCurrentPage} />;
  }

  return (
    <div className="desktop-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          🌊 Block-Relief
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setCurrentPage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${currentPage === 'verification' ? 'active' : ''}`} 
            onClick={() => setCurrentPage('verification')}
          >
            📝 Verify Victim
          </button>
          <button 
            className={`nav-btn ${currentPage === 'allocation' ? 'active' : ''}`} 
            onClick={() => setCurrentPage('allocation')}
          >
            💰 Fund Allocation
          </button>
          <button className={`nav-btn ${currentPage === 'fuzzy' ? 'active' : ''}`} onClick={() => setCurrentPage('fuzzy')}>
  🧮 Fuzzy Scoring
</button>
<button className={`nav-btn ${currentPage === 'blockchain' ? 'active' : ''}`} onClick={() => setCurrentPage('blockchain')}>
  ⛓️ Blockchain Logs
</button>
<button className={`nav-btn ${currentPage === 'banking' ? 'active' : ''}`} onClick={() => setCurrentPage('banking')}>
  🏦 Banking System
</button>
<button className={`nav-btn ${currentPage === 'sms' ? 'active' : ''}`} onClick={() => setCurrentPage('sms')}>
  📱 SMS Status
</button>
<button className={`nav-btn ${currentPage === 'reports' ? 'active' : ''}`} onClick={() => setCurrentPage('reports')}>
  📈 Reports & Analytics
</button>
<button className={`nav-btn ${currentPage === 'security' ? 'active' : ''}`} onClick={() => setCurrentPage('security')}>
  🛡️ Security Analysis
</button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-btn text-danger" onClick={() => setCurrentPage('login')}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <h2 style={{ margin: 0, fontSize: '20px' }}>
            {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          </h2>
          <div className="user-profile">
            <span>Admin User</span>
            <div className="avatar">A</div>
          </div>
        </header>
        <div className="page-wrapper">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;