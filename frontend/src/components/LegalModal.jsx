import React from 'react';

export default function LegalModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Legal">✕</button>
        <h3 className="modal-title">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
        </h3>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#444' }}>
          {type === 'privacy' ? (
            <>
              <p><strong>ammai.in Privacy Policy</strong></p>
              <p style={{ margin: '12px 0' }}>We are committed to preserving your privacy and safeguarding your personal data in connection with the feature film "AMMAI: The Mystic Knightess" and Dohnavur Fellowship initiatives.</p>
              <h4 style={{ marginTop: '16px' }}>1. Information We Collect</h4>
              <p>We collect details you voluntarily provide when inquiring, donating, or contacting our production and fellowship offices (such as name, phone number, and email address).</p>
              <h4 style={{ marginTop: '16px' }}>2. Use of Information</h4>
              <p>Data provided is exclusively utilized to issue endowment acknowledgments, provide project updates, and respond to inquiries.</p>
              <h4 style={{ marginTop: '16px' }}>3. Security & Contact</h4>
              <p>We implement stringent technical security controls. For inquiries regarding your data, contact: <strong>wordint@gmail.com</strong>.</p>
            </>
          ) : (
            <>
              <p><strong>ammai.in Terms & Conditions</strong></p>
              <p style={{ margin: '12px 0' }}>Welcome to the official portal for "AMMAI: The Mystic Knightess". By accessing this website or contributing to the film and fellowship endowments, you agree to these terms.</p>
              <h4 style={{ marginTop: '16px' }}>1. Intellectual Property</h4>
              <p>All creative materials, teasers, photographic archives, and branding are copyrighted by Wordint Films and The Dohnavur Fellowship.</p>
              <h4 style={{ marginTop: '16px' }}>2. Donations & Endowments</h4>
              <p>All donations made directly to the authorized accounts are utilized directly towards film production, historical preservation, and Dohnavur child care welfare initiatives.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
