import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowWarning(false);

    // Set a timer to show the cold-start helper message after 3 seconds
    const timer = setTimeout(() => {
      setShowWarning(true);
    }, 3000);

    try {
      const user = await login(username, password);
      clearTimeout(timer);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/staff');
    } catch (err) {
      clearTimeout(timer);
      setLoading(false);
      setShowWarning(false);
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#4f46e5', width: '64px', height: '64px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <LogIn color="white" size={32} />
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to manage your inventory</p>
        </div>
        
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        {showWarning && (
          <div style={{ 
            background: '#fffbeb', 
            color: '#b45309', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.25rem', 
            fontSize: '0.875rem', 
            textAlign: 'left',
            border: '1px solid #fef3c7',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <strong style={{ fontWeight: '600' }}>⚡ Server Waking Up...</strong>
            <span>Our server sleeps after inactivity. This first login request may take 30-60 seconds. Thank you for your patience!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Username</label>
            <input 
              type="text" 
              placeholder="Enter your username" 
              style={{ width: '100%' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={{ width: '100%' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '1rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" style={{ opacity: 0.25 }} />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }} />
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>Admin: admin / admin123</p>
          <p>Staff: staff / staff123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
