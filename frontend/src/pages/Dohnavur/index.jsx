import React from 'react';
import { Link } from 'react-router-dom';
import CLOUDINARY_MEDIA from '../../utils/media';

export default function DohnavurPage({ onOpenDonate }) {
  return (
    <div className="page-top-spacing">
      {/* Header Banner */}
      <section className="catalog-header" style={{ backgroundImage: `linear-gradient(to bottom, rgba(18,18,22,0.85), #0d0d0f), url('${CLOUDINARY_MEDIA.dohnavurArch}')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '90px 0 60px' }}>
        <div className="container">
          <span className="film-banner-badge" style={{ marginBottom: '14px' }}>Established 1901</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '12px' }}>
            The Dohnavur Fellowship
          </h1>
          <p className="hero-tagline" style={{ margin: '0 auto', maxWidth: '750px', fontSize: '1.25rem' }}>
            A Living Sanctuary of Compassion, Education & Healing at the Foothills of the Western Ghats
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ padding: '70px 24px' }}>
        {/* Foundation & History */}
        <div className="synopsis-grid" style={{ marginBottom: '80px' }}>
          <div>
            <span className="story-header-pill">120+ Years of Unbroken Service</span>
            <h2 className="section-title" style={{ fontSize: '2.2rem', textAlign: 'left', marginBottom: '16px' }}>
              The Sanctuary That Transformed Generations
            </h2>
            <p className="synopsis-lead" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
              In 1901, in the quiet rural village of Dohnavur, Tirunelveli, Tamil Nadu, Amy Carmichael established a haven for children who had no other refuge.
            </p>
            <p className="synopsis-body">
              What began with saving a small runaway girl named Preena blossomed into a vibrant village community. Over more than a century, thousands of children have been welcomed, loved, educated, and sent out into the world as doctors, teachers, nurses, and leaders.
            </p>
            <p className="synopsis-body">
              The Fellowship operates on a principle of faith and selfless service. The children live in family-style cottages with caring housemothers ("Sisters"), receiving holistic schooling, spiritual grounding, and practical vocational skills.
            </p>

            <button onClick={onOpenDonate} className="btn-read-more" style={{ marginTop: '20px', background: 'var(--color-purple)' }}>
              Contribute to the Children's Endowment
            </button>
          </div>

          <div className="poster-card">
            <img src={CLOUDINARY_MEDIA.childrenYoYos} alt="Children at Dohnavur Fellowship" />
          </div>
        </div>

        {/* 2-Column: Hospital & Medical Care */}
        <div className="fellowship-grid" style={{ marginBottom: '80px' }}>
          <div className="fellowship-card">
            <img src={CLOUDINARY_MEDIA.dentalHospital} alt="Dohnavur Hospital & Dental Care" className="fellowship-card-img" />
            <div className="fellowship-card-body">
              <h3 className="fellowship-title">Dohnavur Hospital & Medical Outreach</h3>
              <p className="synopsis-body">
                The Dohnavur Hospital provides comprehensive medical, surgical, and dental care to thousands of rural villagers across Southern Tamil Nadu. Fully subsidized and charitable clinics ensure nobody is turned away due to poverty.
              </p>
            </div>
          </div>

          <div className="fellowship-card">
            <img src={CLOUDINARY_MEDIA.teamLeaders} alt="Dohnavur Fellowship Leadership" className="fellowship-card-img" />
            <div className="fellowship-card-body">
              <h3 className="fellowship-title">Dedicated Community Leadership</h3>
              <p className="synopsis-body">
                Carrying forward the vision of Ammai, the fellowship leaders, doctors, and educators maintain the self-sustaining agricultural farms, solar power facilities, and schools that keep the sanctuary independent and thriving.
              </p>
            </div>
          </div>
        </div>

        {/* Film Partnership Callout */}
        <div style={{ background: '#f5f0fa', border: '1px solid #ebd9f8', borderRadius: '16px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <span className="film-banner-badge" style={{ background: 'rgba(75,0,110,0.1)', color: 'var(--color-purple)', border: 'none' }}>
            Official Authorization
          </span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-purple)', margin: '14px 0' }}>
            The Official Cinematic Tribute
          </h3>
          <p style={{ color: '#444', maxWidth: '650px', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
            "AMMAI: The Mystic Knightess" is produced in direct cooperation with The Dohnavur Fellowship. Archival research, on-location cinematography, and historical consultation ensure the story honors the true spiritual spirit of Amy Carmichael.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/teasers" className="btn-hero-trailer" style={{ background: 'var(--color-purple)', color: '#fff', borderColor: 'transparent' }}>
              ▶ Watch Film Teasers
            </Link>
            <Link to="/endowments" className="btn-hero-donate" style={{ background: 'var(--color-gold)', color: '#111' }}>
              View Endowments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
