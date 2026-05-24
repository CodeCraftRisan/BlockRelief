import React from 'react';

const BankingSystem = () => {
  return (
    <>
      <div className="grid-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="card text-center">
          <p className="text-muted">Total Deposits (Fiat)</p>
          <h2 style={{ fontSize: '28px', margin: '10px 0' }}>450K BDT</h2>
        </div>
        <div className="card text-center">
          <p className="text-muted">Successful Payouts</p>
          <h2 className="text-success" style={{ fontSize: '28px', margin: '10px 0' }}>892</h2>
        </div>
        <div className="card text-center">
          <p className="text-muted">Pending Payouts</p>
          <h2 className="text-warning" style={{ fontSize: '28px', margin: '10px 0' }}>23</h2>
        </div>
      </div>

      <div className="card">
        <div className="flex-between">
          <h2>Transaction Status</h2>
          <button className="btn btn-primary">Generate Receipt</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Victim ID</th>
              <th>Bank Account</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>V12345</td>
              <td>1234-5678-9012</td>
              <td>5,000 BDT</td>
              <td><span className="badge badge-success">Completed</span></td>
            </tr>
            <tr>
              <td>V12346</td>
              <td>1234-5678-9013</td>
              <td>5,000 BDT</td>
              <td><span className="badge badge-warning">Processing</span></td>
            </tr>
            <tr>
              <td>V12347</td>
              <td>1234-5678-9014</td>
              <td>5,000 BDT</td>
              <td><span className="badge badge-success">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BankingSystem;