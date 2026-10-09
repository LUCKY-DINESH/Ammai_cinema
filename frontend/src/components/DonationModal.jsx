import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function DonationModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  if (!isOpen) return null;

  const copyText = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2000);
    }
    showToast(`Copied ${type === 'acc' ? 'Account Number' : 'IFSC Code'} to clipboard!`);
  };

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card dark">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">✕</button>
        <h3 className="modal-title">Official Endowment Details</h3>
        <p style={{ color: '#bbb', fontSize: '0.95rem' }}>
          Direct contributions support the film production and archival preservation of Amy Carmichael's history in collaboration with The Dohnavur Fellowship.
        </p>

        <div className="bank-detail-card">
          <div className="bank-row">
            <span className="bank-label">Beneficiary Name</span>
            <span className="bank-value">Anandan Sundararajan</span>
          </div>
          <div className="bank-row">
            <span className="bank-label">Bank Name</span>
            <span className="bank-value">Union Bank of India</span>
          </div>
          <div className="bank-row">
            <span className="bank-label">Account Number</span>
            <span className="bank-value">
              <span>057822010001349</span>
              <button 
                className="btn-copy" 
                onClick={() => copyText('057822010001349', 'acc')}>
                {copiedAcc ? 'Copied!' : 'Copy'}
              </button>
            </span>
          </div>
          <div className="bank-row">
            <span className="bank-label">IFSC Code</span>
            <span className="bank-value">
              <span>UBIN0905780</span>
              <button 
                className="btn-copy" 
                onClick={() => copyText('UBIN0905780', 'ifsc')}>
                {copiedIfsc ? 'Copied!' : 'Copy'}
              </button>
            </span>
          </div>
          <div className="bank-row">
            <span className="bank-label">Branch</span>
            <span className="bank-value">Chennai Branch</span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
          Please note "AMMAI Film Endowment" in the transfer remarks. For tax receipts and donor acknowledgments, kindly email transfer details to <strong>wordint@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}
