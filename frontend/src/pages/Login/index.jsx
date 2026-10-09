import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      showToast('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-top-spacing" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '120px 24px 60px' }}>
      <div style={{ maxWidth: '440px', width: '100%', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid #eaeaea' }}>
        <h2 className="section-title" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '8px' }}>
          Welcome Back
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '28px' }}>
          Sign in to access cinema reviews and administrative features
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'var(--color-purple)', color: '#fff', fontWeight: 700, padding: '12px', borderRadius: '9999px', marginTop: '10px', cursor: 'pointer' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#777' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-purple)', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
