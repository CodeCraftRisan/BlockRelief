import React from 'react';

const FuzzyScoring = () => {
  return (
    <div className="grid-2-layout">
      <div className="card">
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h2>Factor Analysis</h2>
          <span className="badge badge-primary">Rahman, Md. Ali - Zone A</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Raw Input</th>
              <th>Fuzzy Value</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Water Depth</td>
              <td>0.3</td>
              <td className="text-primary" style={{ fontWeight: 'bold' }}>0.82</td>
              <td>0.24</td>
            </tr>
            <tr>
              <td>Flood Duration</td>
              <td>0.2</td>
              <td className="text-primary" style={{ fontWeight: 'bold' }}>0.75</td>
              <td>0.15</td>
            </tr>
            <tr>
              <td>Poverty Index</td>
              <td>0.25</td>
              <td className="text-primary" style={{ fontWeight: 'bold' }}>0.42</td>
              <td>0.10</td>
            </tr>
            <tr>
              <td>Shelter Distance</td>
              <td>0.15</td>
              <td className="text-primary" style={{ fontWeight: 'bold' }}>0.60</td>
              <td>0.09</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div className="card" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 className="text-muted">Final Priority Score</h2>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', margin: '10px 0' }}>
            0.82
          </div>
          <span className="badge badge-success">HIGH Priority</span>
        </div>
        <div className="card">
          <h3>Victim Ranking</h3>
          <div className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span className="text-muted">Current Victim</span>
            <strong>#12 / 234</strong>
          </div>
          <div className="flex-between" style={{ padding: '10px 0' }}>
            <span className="text-muted">Score Range</span>
            <strong className="text-success">Top 15%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuzzyScoring;