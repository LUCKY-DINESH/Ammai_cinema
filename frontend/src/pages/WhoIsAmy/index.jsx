import React from 'react';
import { Link } from 'react-router-dom';
import CLOUDINARY_MEDIA from '../../utils/media';

export default function WhoIsAmyPage({ onOpenDonate }) {
  return (
    <div className="page-top-spacing">
      {/* Header Banner */}
      <section className="catalog-header" style={{ backgroundImage: `linear-gradient(to bottom, rgba(18,18,22,0.85), #0d0d0f), url('${CLOUDINARY_MEDIA.backdropTeasee}')`, backgroundSize: 'cover', backgroundPosition: 'center 30%', padding: '90px 0 60px' }}>
        <div className="container">
          <span className="film-banner-badge" style={{ marginBottom: '14px' }}>Historical Portrait</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '12px' }}>
            Who is Amy Carmichael?
          </h1>
          <p className="hero-tagline" style={{ margin: '0 auto', maxWidth: '750px', fontSize: '1.25rem' }}>
            "You can give without loving, but you cannot love without giving."
          </p>
        </div>
      </section>

      {/* Main Biography Content */}
      <div className="container" style={{ padding: '70px 24px' }}>
        {/* Intro Section */}
        <div className="synopsis-grid" style={{ marginBottom: '80px' }}>
          <div className="poster-card" style={{ maxWidth: '440px', margin: '0 auto' }}>
            <img src={CLOUDINARY_MEDIA.posterAmmai} alt="Amy Carmichael Portrait" />
          </div>

          <div className="synopsis-content">
            <span className="story-header-pill">The Mystic Knightess</span>
            <h2 className="section-title" style={{ fontSize: '2.2rem', textAlign: 'left', marginBottom: '10px' }}>
              A Mystic's Heart & A Rebel's Courage
            </h2>
            <p className="synopsis-lead" style={{ fontSize: '1.25rem' }}>
              Known affectionately across Southern India as "Ammai" (Mother), Amy Carmichael lived an extraordinary life of fierce compassion, defying colonial society and institutional injustice.
            </p>
            <p className="synopsis-body">
              Born in 1867 in Millisle, Northern Ireland, Amy felt a profound inner calling to serve the destitute. In 1895, she arrived in the scorching plains of Tamil Nadu, India. Unlike typical colonial visitors, she learned fluent Tamil, adopted native Indian cotton saris, dyed her skin with coffee to blend in, and lived as one with the local people.
            </p>
            <p className="synopsis-body">
              When she discovered the heartbreaking reality of temple child servitude—where young girls were sold and dedicated into ritualistic exploitation—Amy chose not to look away. Risking arrest, violent retaliation, and societal ostracism, she organized daring rescue missions to save vulnerable children.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '14px' }}>
              <button onClick={onOpenDonate} className="btn-read-more" style={{ background: 'var(--color-purple)' }}>
                Support Her Legacy
              </button>
              <Link to="/movies" className="btn-read-more" style={{ background: '#333' }}>
                Explore Film Details
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Pillars Section */}
        <div style={{ marginBottom: '80px' }}>
          <div className="section-header-centered">
            <h2 className="section-title">Character Traits & Legacy</h2>
            <p className="section-subtitle">The Triad of Amy Carmichael's Extraordinary Spirit</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            <div className="trait-card activist" style={{ padding: '36px 28px' }}>
              <h3 className="trait-title" style={{ fontSize: '1.35rem', marginBottom: '14px' }}>
                ⚔️ Relentless Activist
              </h3>
              <p className="trait-body">
                Amy Carmichael confronted centuries of entrenched taboos. She challenged corrupt intermediaries and colonial courts to rescue young children from temple bondage. Through sheer courage, she created legal precedents and safe houses that protected endangered youth.
              </p>
            </div>

            <div className="trait-card leader" style={{ padding: '36px 28px' }}>
              <h3 className="trait-title" style={{ fontSize: '1.35rem', marginBottom: '14px' }}>
                🏛️ Empowered Leader
              </h3>
              <p className="trait-body">
                In 1901, Amy founded The Dohnavur Fellowship in Tirunelveli. Operating on a steadfast principle of never soliciting public funds or running advertisements, she built hospitals, nurseries, schools, and craft centers that raised generations of educated, confident women.
              </p>
            </div>

            <div className="trait-card poet" style={{ padding: '36px 28px' }}>
              <h3 className="trait-title" style={{ fontSize: '1.35rem', marginBottom: '14px' }}>
                ✍️ Eloquent Poet & Author
              </h3>
              <p className="trait-body">
                Confined to bed for the final two decades of her life after a severe fall, Amy continued her mission through literature. She authored 35 internationally acclaimed books and collections of mystical poetry that continue to inspire millions across the globe.
              </p>
            </div>
          </div>
        </div>

        {/* Archival Gallery */}
        <div>
          <div className="section-header-centered">
            <h2 className="section-title">Historical Photographic Archive</h2>
            <p className="section-subtitle">Preserved Documents & Life at Dohnavur</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="fellowship-card">
              <img src={CLOUDINARY_MEDIA.dohnavurArch} alt="Dohnavur Sanctuary" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <strong style={{ fontSize: '1rem', color: '#111' }}>The Sanctuary Grounds</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Historic prayer house and residential cottages at the foothills of the Western Ghats.</p>
              </div>
            </div>

            <div className="fellowship-card">
              <img src={CLOUDINARY_MEDIA.amyHistorical} alt="Amy Carmichael with Children" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <strong style={{ fontSize: '1rem', color: '#111' }}>Archival Fellowship Life</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Children nurtured under the care of Ammai, receiving English, Tamil, and vocational schooling.</p>
              </div>
            </div>

            <div className="fellowship-card">
              <img src={CLOUDINARY_MEDIA.backdropSanctuaryGrounds} alt="Dohnavur Architecture" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <strong style={{ fontSize: '1rem', color: '#111' }}>Nature & Contemplation</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Surrounded by lush flora where Amy composed her mystical spiritual poems and letters.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
