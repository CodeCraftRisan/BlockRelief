import React from 'react';

const ReportsAnalytics = () => {
  return (
    <div className="grid-2-layout">
      <div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2>Fairness Comparison</h2>
          <div className="progress-container">
            <div className="progress-label"><span>Equal Distribution</span><span>75%</span></div>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '75%', backgroundColor: '#94a3b8' }}></div></div>
          </div>
          <div className="progress-container">
            <div className="progress-label"><span>Fuzzy Allocation</span><span className="text-primary">92%</span></div>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '92%' }}></div></div>
          </div>
        </div>

        <div className="card">
          <h2>Performance Metrics</h2>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span>Verification Time</span>
            <strong>2.3s avg</strong>
          </div>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span>Transaction Latency</span>
            <strong className="text-warning">15s avg</strong>
          </div>
          <div className="flex-between" style={{ padding: '10px 0' }}>
            <span>SMS Delivery Time</span>
            <strong className="text-success">5s avg</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Cost Analysis</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li className="flex-between" style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span>⛽ Gas Usage</span>
            <strong>0.012 ETH</strong>
          </li>
          <li className="flex-between" style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span>💬 SMS Cost</span>
            <strong>450 BDT</strong>
          </li>
          <li className="flex-between" style={{ padding: '15px 0', fontSize: '18px', fontWeight: 'bold' }}>
            <span>Total Processing</span>
            <span className="text-primary">12,500 BDT</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsAnalytics;