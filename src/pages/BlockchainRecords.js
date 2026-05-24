import React from 'react';

const BlockchainRecords = () => {
  const records = [
    { hash: '0x1a2b...3c4d', status: 'Confirmed', statusClass: 'badge-success', amt: '5,000 BDT', block: '#12,345', time: '2 hours ago' },
    { hash: '0x5e6f...7g8h', status: 'Confirmed', statusClass: 'badge-success', amt: '5,000 BDT', block: '#12,344', time: '3 hours ago' },
    { hash: '0x9i0j...1k2l', status: 'Pending', statusClass: 'badge-warning', amt: '5,000 BDT', block: '#12,343', time: '4 hours ago' }
  ];

  return (
    <div className="card">
      <h2>Smart Contract Ledger</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>Immutable records of relief fund distribution.</p>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {records.map((rec, index) => (
          <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', backgroundColor: rec.status === 'Pending' ? '#fffbeb' : '#f8fafc' }}>
            <div className="flex-between" style={{ marginBottom: '10px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', color: '#334155' }}>{rec.hash}</span>
              <span className={`badge ${rec.statusClass}`}>{rec.status}</span>
            </div>
            <div className="flex-between text-muted">
              <span>Victim ID: V1234{5+index}</span>
              <span>Block {rec.block}</span>
            </div>
            <div className="flex-between" style={{ marginTop: '10px', fontSize: '14px' }}>
              <strong>{rec.amt}</strong>
              <span>{rec.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainRecords;