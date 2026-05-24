import React from 'react';

const SecurityAnalysis = () => {
  return (
    <>
      <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f172a', color: 'white' }}>
        <div>
          <h2 style={{ color: 'white', margin: 0 }}>Overall Security Score</h2>
          <p style={{ color: '#94a3b8' }}>Latest automated smart contract audit</p>
        </div>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>
          85% <span style={{ fontSize: '16px', display: 'block', textAlign: 'right' }}>Secure</span>
        </div>
      </div>

      <div className="grid-2-layout">
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '5px' }}>
            <h3>Reentrancy Protection</h3>
            <span className="badge badge-success">Protected</span>
          </div>
          <p className="text-muted">Checks and effects pattern implemented.</p>
          <p className="text-success" style={{ fontSize: '12px', marginTop: '10px' }}>✓ Audit Passed</p>
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: '5px' }}>
            <h3>Access Control</h3>
            <span className="badge badge-warning">Mitigated</span>
          </div>
          <p className="text-muted">Role-based access control in place.</p>
          <p className="text-warning" style={{ fontSize: '12px', marginTop: '10px' }}>⚠ Partial Coverage</p>
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: '5px' }}>
            <h3>Integer Overflow</h3>
            <span className="badge badge-success">Passed</span>
          </div>
          <p className="text-muted">SafeMath operations used natively.</p>
          <p className="text-success" style={{ fontSize: '12px', marginTop: '10px' }}>✓ No Vulnerabilities</p>
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: '5px' }}>
            <h3>Oracle Risk</h3>
            <span className="badge badge-success">Passed</span>
          </div>
          <p className="text-muted">Chainlink oracle integration verified.</p>
          <p className="text-success" style={{ fontSize: '12px', marginTop: '10px' }}>✓ Secure Oracles</p>
        </div>
      </div>
    </>
  );
};

export default SecurityAnalysis;