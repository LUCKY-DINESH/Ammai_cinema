import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="page-top-spacing" style={{ display: 'flex', justifyContent: 'center', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: '560px', width: '100%', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid #eaeaea' }}>
        <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
          My Account
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--color-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700 }}>
            {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{user.full_name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
            <span style={{ display: 'inline-block', marginTop: '6px', background: isAdmin ? 'var(--color-gold)' : '#e0e0e0', color: '#111', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Role: {user.role || 'User'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isAdmin && (
            <Link 
              to="/admin" 
              style={{ background: 'var(--color-purple)', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', fontWeight: 700 }}>
              Go to Admin Dashboard →
            </Link>
          )}

          <Link 
            to="/movies" 
            style={{ background: '#f5f5f5', color: '#111', textAlign: 'center', padding: '12px', borderRadius: '8px', fontWeight: 600 }}>
            Browse Cinema Catalog
          </Link>

          <button
            onClick={logout}
            style={{ background: '#fff', border: '1px solid #e74c3c', color: '#e74c3c', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
