import React from 'react';

const Login = ({ navigate }) => {
  return (
    <div className="login-page">
      <div className="card login-card">
        <div style={{ background: '#2563eb', color: 'white', width: '70px', height: '70px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' }}>
          🛡️
        </div>
        <h2 style={{ fontSize: '28px' }}>Block-Relief Admin</h2>
        <p className="text-muted" style={{ marginBottom: '30px' }}>Connect your Web3 wallet to access the dashboard.</p>
        
        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }} onClick={() => navigate('dashboard')}>
          Connect MetaMask
        </button>
        <button className="btn" style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#334155' }} onClick={() => navigate('dashboard')}>
          Login as View-Only
        </button>
      </div>
    </div>
  );
};

export default Login;