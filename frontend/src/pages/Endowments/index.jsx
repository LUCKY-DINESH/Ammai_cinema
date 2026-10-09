import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import CLOUDINARY_MEDIA from '../../utils/media';

export default function EndowmentsPage({ onOpenDonate }) {
  const { showToast } = useToast();
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

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
    <div className="page-top-spacing">
      {/* Header */}
      <div className="catalog-header" style={{ backgroundImage: "linear-gradient(to bottom, rgba(75,0,110,0.9), #121216)", padding: '90px 0 60px' }}>
        <div className="container">
          <span className="film-banner-badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--color-gold)', borderColor: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>
            Contributions & Transparency
          </span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '8px' }}>
            Film & Fellowship Endowments
          </h1>
          <p className="hero-tagline" style={{ margin: '0 auto', maxWidth: '750px', fontSize: '1.2rem', color: '#eaeaea' }}>
            Empowering cinematic storytelling and supporting direct child welfare at Dohnavur
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '70px 24px' }}>
        {/* Intro */}
        <div style={{ maxWidth: '850px', margin: '0 auto 60px', textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '14px' }}>
            Why Your Contribution Matters
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8' }}>
            Amy Carmichael established Dohnavur with an unwavering principle: never solicit commercial loans or compromise integrity. In that same enduring spirit, this independent film and its related endowments rely on passionate patrons, benefactors, and supporters across the globe.
          </p>
        </div>

        {/* 2 Big Endowment Cards */}
        <div className="endowments-cards-grid" style={{ marginBottom: '80px' }}>
          {/* Card 1 */}
          <div className="endowment-block">
            <div className="endowment-upper-card" style={{ height: '300px' }}>
              <span className="endowment-badge">Film & Heritage</span>
              <img src={CLOUDINARY_MEDIA.preservationCauses} alt="Preservation & Heritage" />
            </div>
            <div style={{ padding: '28px', background: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#111', marginBottom: '10px' }}>
                Production & Archival Endowment
              </h3>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
                Directly funds the historical set recreations, 35mm archival document digitizations, period costume designs, and high-fidelity sound engineering for the feature film.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', fontSize: '0.9rem', color: '#444' }}>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>✓ Archival document restoration</li>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>✓ International festival submissions</li>
                <li style={{ padding: '6px 0' }}>✓ Screenings for schools and youth clubs</li>
              </ul>
            </div>
            <div className="endowment-lower-bar">
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Production Fund</span>
              <button className="endowment-cta-btn" onClick={onOpenDonate}>Contribute Now</button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="endowment-block">
            <div className="endowment-upper-card" style={{ height: '300px' }}>
              <span className="endowment-badge">Children & Healthcare</span>
              <img src={CLOUDINARY_MEDIA.childrenYoYos} alt="Fellowship Children Welfare" />
            </div>
            <div style={{ padding: '28px', background: '#fff' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#111', marginBottom: '10px' }}>
                Dohnavur Fellowship Children Care
              </h3>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '20px' }}>
                Directly benefits the boys and girls living at the sanctuary, funding their higher education, books, nutritional care, medical treatments, and vocational workshops.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', fontSize: '0.9rem', color: '#444' }}>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>✓ Free healthcare & dental care</li>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>✓ Holistic primary and secondary schooling</li>
                <li style={{ padding: '6px 0' }}>✓ Clean solar energy and clean water supply</li>
              </ul>
            </div>
            <div className="endowment-lower-bar">
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Fellowship Fund</span>
              <button className="endowment-cta-btn" onClick={onOpenDonate}>Contribute Now</button>
            </div>
          </div>
        </div>

        {/* Banking Information Box */}
        <div style={{ background: '#1c1c20', color: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '800px', margin: '0 auto', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(229,185,92,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Official Bank Details
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', marginTop: '6px' }}>
              Direct Wire & NEFT Transfer
            </h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Official designated account under director Anandan Sundararajan for film fundraising and fellowship allocations
            </p>
          </div>

          <div className="bank-detail-card" style={{ background: '#25252b', borderColor: '#3a3a42' }}>
            <div className="bank-row" style={{ borderBottomColor: '#3a3a42' }}>
              <span className="bank-label" style={{ color: '#aaa' }}>Account Holder</span>
              <span className="bank-value" style={{ color: '#fff' }}>Anandan Sundararajan</span>
            </div>
            <div className="bank-row" style={{ borderBottomColor: '#3a3a42' }}>
              <span className="bank-label" style={{ color: '#aaa' }}>Bank Name</span>
              <span className="bank-value" style={{ color: '#fff' }}>Union Bank of India</span>
            </div>
            <div className="bank-row" style={{ borderBottomColor: '#3a3a42' }}>
              <span className="bank-label" style={{ color: '#aaa' }}>Account Number</span>
              <span className="bank-value" style={{ color: '#fff' }}>
                <span>057822010001349</span>
                <button className="btn-copy" onClick={() => copyText('057822010001349', 'acc')}>
                  {copiedAcc ? 'Copied!' : 'Copy'}
                </button>
              </span>
            </div>
            <div className="bank-row" style={{ borderBottomColor: '#3a3a42' }}>
              <span className="bank-label" style={{ color: '#aaa' }}>IFSC Code</span>
              <span className="bank-value" style={{ color: '#fff' }}>
                <span>UBIN0905780</span>
                <button className="btn-copy" onClick={() => copyText('UBIN0905780', 'ifsc')}>
                  {copiedIfsc ? 'Copied!' : 'Copy'}
                </button>
              </span>
            </div>
            <div className="bank-row">
              <span className="bank-label" style={{ color: '#aaa' }}>Branch</span>
              <span className="bank-value" style={{ color: '#fff' }}>Chennai Branch, Tamil Nadu</span>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#999', marginTop: '16px' }}>
            After making your contribution, kindly email transfer confirmation to <strong>wordint@gmail.com</strong> for your donor certificate and receipt.
          </p>
        </div>
      </div>
    </div>
  );
}
