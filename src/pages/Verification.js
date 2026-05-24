import React from 'react';

const Verification = () => {
  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2>Submit Volunteer Data</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>Enter the affected person's details for smart-contract verification.</p>
      
      <div className="form-group">
        <label>National ID (NID)</label>
        <input type="text" className="form-control" placeholder="Enter 10 or 17 digit NID" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label>Water Depth (cm)</label>
          <input type="number" className="form-control" placeholder="0" />
        </div>
        <div className="form-group">
          <label>Flood Duration (hrs)</label>
          <input type="number" className="form-control" placeholder="0" />
        </div>
      </div>

      <div className="form-group">
        <label>Emergency Field Notes</label>
        <textarea className="form-control" rows="4" placeholder="Any specific medical or shelter needs..."></textarea>
      </div>

      <button className="btn btn-primary" onClick={() => alert('Data queued for blockchain verification.')}>
        Submit for Verification
      </button>
    </div>
  );
};

export default Verification;