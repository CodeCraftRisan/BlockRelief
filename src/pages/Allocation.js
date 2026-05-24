import React from 'react';

const Allocation = () => {
  return (
    <div className="grid-2-layout">
      <div>
        <div className="card" style={{ backgroundColor: '#10b981', color: 'white', marginBottom: '20px' }}>
          <p style={{ opacity: 0.9 }}>Total Available Relief Pool</p>
          <h1 style={{ fontSize: '40px', margin: '10px 0 0' }}>500,000 BDT</h1>
        </div>

        <div className="card">
          <h2>Allocation Formula Details</h2>
          <p className="text-muted" style={{ marginBottom: '15px' }}>
            Funds are distributed dynamically based on fuzzy logic scoring of water depth, duration, and poverty index.
          </p>
          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', border: '1px solid #e2e8f0' }}>
            Allocation = Base Score × (1 - Poverty Index) × Distance Factor
            <br/><br/>
            Current Execution: 0.82 × (1 - 0.42) × 0.8
          </div>
          
          <button className="btn btn-success" style={{ marginTop: '20px', width: '100%' }} onClick={() => alert('Triggering Smart Contract Allocation...')}>
            Execute Smart Contract Distribution
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Proposed Distribution</h2>
        
        <div style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>Zone A (45 victims)</strong>
            <span className="text-success" style={{ fontWeight: 'bold' }}>125,000 BDT</span>
          </div>
          <span className="text-muted">25% of pool</span>
        </div>

        <div style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>Zone B (67 victims)</strong>
            <span className="text-primary" style={{ fontWeight: 'bold' }}>175,000 BDT</span>
          </div>
          <span className="text-muted">35% of pool</span>
        </div>

        <div style={{ padding: '15px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <strong>Zone C (122 victims)</strong>
            <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>200,000 BDT</span>
          </div>
          <span className="text-muted">40% of pool</span>
        </div>
      </div>
    </div>
  );
};

export default Allocation;