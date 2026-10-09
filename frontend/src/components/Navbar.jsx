import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CLOUDINARY_MEDIA from '../utils/media';

export default function Navbar({ onOpenDonate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar" aria-label="Main Navigation">
        {/* Left: Brand Identity */}
        <Link to="/" className="brand-wrapper">
          <img src={CLOUDINARY_MEDIA.ifilmsLogo} alt="I Films & Wordint" className="brand-logo-img" />
          <div className="brand-text">
            <span className="logo-title">AMMAI</span>
            <span className="logo-subtitle">A Film by Anandan S.</span>
          </div>
        </Link>

        {/* Center: Main Page Navigation Links */}
        <ul className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
          <li>
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/who-is-amy" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Who is Amy?
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dohnavur" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dohnavur Fellowship
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/teasers" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Teasers
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/endowments" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Endowments
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/movies" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Cinema
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
          </li>

          {/* Mobile-only action items */}
          <li className="mobile-only-action">
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px', width: '100%' }}>
                {isAdmin && (
                  <Link to="/admin" className="nav-admin-badge" style={{ textAlign: 'center' }}>
                    ⚙️ Admin CMS
                  </Link>
                )}
                <Link to="/profile" className="nav-link" style={{ textAlign: 'center' }}>
                  👤 {user.full_name || 'My Profile'}
                </Link>
                <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#e74c3c' }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-link nav-auth-btn" style={{ textAlign: 'center', marginTop: '12px' }}>
                Sign In
              </Link>
            )}
          </li>
          <li className="mobile-only-action" style={{ marginTop: '10px', width: '100%' }}>
            <button 
              onClick={() => { setMobileOpen(false); onOpenDonate?.(); }}
              className="nav-donate-btn"
              style={{ width: '100%', textAlign: 'center' }}>
              Donate Now
            </button>
          </li>
        </ul>

        {/* Right: Actions Zone (User Status & Donate CTA) */}
        <div className="nav-actions-zone">
          {user ? (
            <div className="nav-user-cluster">
              {isAdmin && (
                <Link to="/admin" className="nav-admin-badge">
                  Admin CMS
                </Link>
              )}
              <Link to="/profile" className="nav-profile-pill" title="View Profile">
                👤 <span className="nav-user-name">{user.full_name?.split(' ')[0] || 'User'}</span>
              </Link>
              <button 
                onClick={logout} 
                className="nav-logout-btn" 
                title="Log Out">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-auth-btn">
              Login
            </Link>
          )}

          <button 
            onClick={onOpenDonate}
            className="nav-donate-btn">
            Donate
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  );
}
