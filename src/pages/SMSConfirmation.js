import React from 'react';

const SMSConfirmation = () => {
  return (
    <div className="grid-2-layout">
      <div className="card">
        <h2>SMS Delivery Status</h2>
        <table className="data-table">
          <tbody>
            <tr>
              <td>
                <strong>V12345</strong><br/>
                <span className="text-muted">017xx xxxxxx</span>
              </td>
              <td><span className="text-muted">2 min ago</span></td>
              <td><span className="badge badge-success">Delivered</span></td>
            </tr>
            <tr>
              <td>
                <strong>V12346</strong><br/>
                <span className="text-muted">018xx xxxxxx</span>
              </td>
              <td><span className="text-muted">5 min ago</span></td>
              <td><span className="badge badge-warning">Sending</span></td>
            </tr>
            <tr>
              <td>
                <strong>V12347</strong><br/>
                <span className="text-muted">019xx xxxxxx</span>
              </td>
              <td><span className="text-muted">10 min ago</span></td>
              <td><span className="badge badge-success">Delivered</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
        <h3>Message Preview</h3>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ background: '#2563eb', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🌊</div>
            <strong>ReliefFlow</strong>
          </div>
          <p style={{ lineHeight: '1.5', color: '#334155' }}>
            Your relief payment of 5,000 BDT has been processed successfully.<br/><br/>
            Transaction ID:<br/>
            TX123456
          </p>
          <p className="text-muted" style={{ fontSize: '12px', marginTop: '10px', textAlign: 'right' }}>2 min ago</p>
        </div>
      </div>
    </div>
  );
};

export default SMSConfirmation;