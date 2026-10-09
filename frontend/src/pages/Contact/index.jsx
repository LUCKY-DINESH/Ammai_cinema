import React, { useState } from 'react';
import { enquiryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const faqs = [
    {
      q: "When is the theatrical release of 'AMMAI: The Mystic Knightess'?",
      a: "The film is scheduled for theatrical premiere in late 2026 across Tamil Nadu and international festival circuits in both Tamil and English versions."
    },
    {
      q: "How can schools or institutions arrange private educational screenings?",
      a: "Special educational previews and discussion panels can be organized by submitting the contact inquiry form with screening details, expected audience size, and venue city."
    },
    {
      q: "Can I visit The Dohnavur Fellowship sanctuary in Tamil Nadu?",
      a: "Yes, visitors and patrons are welcome by prior appointment. Contact the fellowship administrative office or send an inquiry to arrange a guided visit."
    },
    {
      q: "How do I receive a tax receipt or certificate for endowment contributions?",
      a: "After completing your NEFT/IMPS transfer to the Union Bank of India account, email your transfer reference number and postal address to wordint@gmail.com."
    },
    {
      q: "Who produced and directed the film?",
      a: "The film is directed by Anandan Sundararajan and produced by Wordint Films in creative partnership with The Dohnavur Fellowship, LevelUp, and I Films."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await enquiryService.submit(formData);
      showToast('Thank you! Your instant message inquiry has been recorded.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      showToast(err.message || 'Thank you! Your inquiry has been received.');
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-top-spacing">
      {/* Header */}
      <div className="catalog-header" style={{ padding: '90px 0 60px' }}>
        <div className="container">
          <span className="film-banner-badge" style={{ marginBottom: '14px' }}>Connect with Us</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '8px' }}>
            Contact & Frequently Asked Questions
          </h1>
          <p className="section-subtitle" style={{ color: 'var(--color-gold)' }}>
            Chennai Production Headquarters • Film Inquiries • Fellowship Support
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '70px 24px' }}>
        {/* Contact Grid: Details + Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '50px', marginBottom: '90px' }}>
          {/* Details */}
          <div>
            <h2 className="section-title" style={{ fontSize: '1.8rem', textAlign: 'left', marginBottom: '20px' }}>
              Office & Correspondence
            </h2>
            <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '30px' }}>
              For film distribution rights, festival invitations, press inquiries, or fellowship donations, reach out directly to our production headquarters.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <span style={{ fontSize: '1.5rem', background: '#f5f0fa', padding: '12px', borderRadius: '12px', color: 'var(--color-purple)' }}>📍</span>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#111' }}>Production Headquarters</strong>
                  <p style={{ color: '#666', marginTop: '4px', lineHeight: '1.5' }}>
                    80/113, Sterling Road, Nungambakkam,<br />
                    Chennai - 600028, Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <span style={{ fontSize: '1.5rem', background: '#f5f0fa', padding: '12px', borderRadius: '12px', color: 'var(--color-purple)' }}>📞</span>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#111' }}>Direct Telephone</strong>
                  <p style={{ color: '#666', marginTop: '4px' }}>
                    +91 9876543210 / +91 (044) 2827-0000
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <span style={{ fontSize: '1.5rem', background: '#f5f0fa', padding: '12px', borderRadius: '12px', color: 'var(--color-purple)' }}>✉️</span>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#111' }}>Official Inquiries</strong>
                  <p style={{ color: '#666', marginTop: '4px' }}>
                    wordint@gmail.com / ammai.film@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid #eaeaea' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#111', marginBottom: '8px' }}>
              Send an Instant Message
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '24px' }}>
              We typically respond within 24 to 48 business hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Message or Inquiry</label>
                <textarea 
                  rows="4" 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit', resize: 'vertical' }}>
                </textarea>
              </div>

              <button 
                type="submit" 
                disabled={sending}
                style={{ background: 'var(--color-purple)', color: '#fff', fontWeight: 700, padding: '12px', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' }}>
                {sending ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="section-header-centered">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Answers Regarding the Film, Premiere, and Contributions</p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#111', marginBottom: '8px' }}>
                  {faq.q}
                </h4>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
