import React from 'react';

const Dashboard = () => {
  return (
    <>
      <div className="grid-4">
        <div className="card">
          <p className="text-muted">Registered Victims</p>
          <h2 className="text-primary" style={{ fontSize: '32px', marginTop: '10px' }}>1,234</h2>
        </div>
        <div className="card">
          <p className="text-muted">Verified Victims</p>
          <h2 className="text-success" style={{ fontSize: '32px', marginTop: '10px' }}>987</h2>
        </div>
        <div className="card">
          <p className="text-muted">Pending Cases</p>
          <h2 className="text-warning" style={{ fontSize: '32px', marginTop: '10px' }}>45</h2>
        </div>
        <div className="card">
          <p className="text-muted">Relief Pool (BDT)</p>
          <h2 style={{ color: '#0f766e', fontSize: '32px', marginTop: '10px' }}>500K</h2>
        </div>
      </div>

      <div className="grid-2-layout">
        <div className="card">
          <h2>Vulnerability Index by Zone</h2>
          <div className="progress-container">
            <div className="progress-label"><span>Zone A</span><span>85% Critical</span></div>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '85%' }}></div></div>
          </div>
          <div className="progress-container" style={{ marginTop: '20px' }}>
            <div className="progress-label"><span>Zone B</span><span>65% Critical</span></div>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '65%' }}></div></div>
          </div>
        </div>

        <div className="card">
          <h2>Recent Activity</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>✅ Rahman, Md. Ali verified</li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>💰 50,000 BDT allocated to Zone A</li>
            <li style={{ padding: '10px 0' }}>⏳ 12 new requests pending</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;