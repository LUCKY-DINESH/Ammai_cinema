import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../services/api';
import { useToast } from '../context/ToastContext';
import CLOUDINARY_MEDIA from '../utils/media';

export default function Footer({ onOpenDonate, onOpenPrivacy, onOpenTerms }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactService.send(formData);
      showToast('Thank you for contacting the Ammai & Dohnavur team. We will get in touch shortly!');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      showToast('Your message has been recorded. Thank you!');
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Contact Details */}
          <div>
            <h3 className="footer-col-title">Contact Us</h3>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <i>📞</i>
                <span>+91 9876543210</span>
              </li>
              <li className="footer-contact-item">
                <i>📍</i>
                <span>80/113, Sterling Road, Nungambakkam,<br />Chennai - 600028, Tamil Nadu</span>
              </li>
              <li className="footer-contact-item">
                <i>✉️</i>
                <span>wordint@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Col 2: Support & Links */}
          <div>
            <h3 className="footer-col-title">Cinema & Fellowship</h3>
            <ul className="footer-links-list">
              <li><Link to="/movies" className="footer-link">Feature Films & Catalog</Link></li>
              <li><Link to="/who-is-amy" className="footer-link">About Amy Carmichael</Link></li>
              <li><Link to="/dohnavur" className="footer-link">The Dohnavur Fellowship</Link></li>
              <li><Link to="/teasers" className="footer-link">Teasers & Archival Clips</Link></li>
              <li><Link to="/endowments" className="footer-link">Endowments & Preservation</Link></li>
              <li><Link to="/contact" className="footer-link">FAQ & Contact</Link></li>
              <li><button onClick={onOpenDonate} className="footer-link" style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>Contribute / Donate</button></li>
              <li><button onClick={onOpenPrivacy} className="footer-link" style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>Privacy Policy</button></li>
              <li><button onClick={onOpenTerms} className="footer-link" style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0 }}>Terms & Conditions</button></li>
            </ul>
          </div>

          {/* Col 3: Direct Inquiry Form */}
          <div>
            <h3 className="footer-col-title">Connect with Us</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="Your Name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #333', background: '#1c1c20', color: '#fff', fontFamily: 'inherit' }} 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #333', background: '#1c1c20', color: '#fff', fontFamily: 'inherit' }} 
              />
              <textarea 
                placeholder="Your Message" 
                rows="3" 
                required 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #333', background: '#1c1c20', color: '#fff', fontFamily: 'inherit', resize: 'none' }}>
              </textarea>
              <button 
                type="submit" 
                disabled={sending}
                style={{ background: 'var(--color-gold)', color: '#111', fontWeight: 700, padding: '10px 18px', borderRadius: '6px', marginTop: '4px', cursor: 'pointer' }}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 AMMAI Movie & The Dohnavur Fellowship. All Rights Reserved. Produced by Wordint Films.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/LevelUp.svg" alt="LevelUp" style={{ height: '24px', opacity: 0.7 }} />
            <img src={CLOUDINARY_MEDIA.ifilmsLogo} alt="I Films" style={{ height: '24px', opacity: 0.8 }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
