import React, { useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer';
import TrailerModal from '../../components/TrailerModal';
import CLOUDINARY_MEDIA from '../../utils/media';

export default function TeasersPage() {
  const [modalVideo, setModalVideo] = useState(null);

  const teasersList = [
    {
      id: 1,
      title: "The Sanctuary at Dohnavur",
      subtitle: "Archival Teaser 01 • The Sacred Foothills",
      duration: "1:45",
      poster: CLOUDINARY_MEDIA.posterSanctuary,
      video: CLOUDINARY_MEDIA.trailer1,
      desc: "A poetic visual tour across the lush green sanctuaries, historic prayer cottages, and the towering mountain peaks where Amy Carmichael found her solace."
    },
    {
      id: 2,
      title: "The Mystic Heart",
      subtitle: "Character Featurette • Faith & Activism",
      duration: "2:10",
      poster: CLOUDINARY_MEDIA.posterDefying,
      video: CLOUDINARY_MEDIA.trailer2,
      desc: "Delving into Amy's internal spiritual discipline, her intimate connection with nature, and how unshakeable faith fueled her battle against temple exploitation."
    },
    {
      id: 3,
      title: "Defying Conventions",
      subtitle: "Official Theatrical Promo • The Rescue Mission",
      duration: "2:40",
      poster: CLOUDINARY_MEDIA.posterAmmai,
      video: CLOUDINARY_MEDIA.trailer1,
      desc: "The dramatic, high-stakes chronicle of the night rescues, legal confrontations, and the unwavering dedication that laid the foundation for Dohnavur."
    }
  ];

  return (
    <div className="page-top-spacing">
      {/* Header */}
      <div className="catalog-header">
        <div className="container">
          <span className="film-banner-badge" style={{ marginBottom: '14px' }}>Video & Media Hub</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', marginBottom: '8px' }}>
            Trailers & Archival Featurettes
          </h1>
          <p className="section-subtitle" style={{ color: 'var(--color-gold)' }}>
            Cinematic Teasers • Archival Footage • Behind the Scenes
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        {/* Featured Video Player */}
        <div style={{ marginBottom: '70px' }}>
          <VideoPlayer src={CLOUDINARY_MEDIA.trailer1} poster={CLOUDINARY_MEDIA.backdropTeasee} />
        </div>

        {/* Video Clips Grid */}
        <div className="section-header-centered" style={{ marginBottom: '40px' }}>
          <h2 className="section-title">Explore All Teasers</h2>
          <p className="section-subtitle">Click any clip to watch in high definition</p>
        </div>

        <div className="trailers-grid" style={{ marginBottom: '70px' }}>
          {teasersList.map(t => (
            <div 
              key={t.id} 
              className="trailer-card"
              onClick={() => setModalVideo(t.video)}>
              <img src={t.poster} alt={t.title} className="trailer-card-img" />
              <div className="trailer-card-overlay">
                <div className="card-play-icon">▶</div>
                <h3 className="trailer-title">{t.title}</h3>
                <p className="trailer-desc">{t.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Director Note */}
        <div style={{ background: '#f8f8f6', borderLeft: '4px solid var(--color-purple)', padding: '36px', borderRadius: '12px', maxWidth: '850px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#111', marginBottom: '10px' }}>
            Director's Note on Archival Visuals
          </h3>
          <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: '#444', lineHeight: '1.7', marginBottom: '14px' }}>
            "Bringing Amy Carmichael's life to the screen requires honoring both the harsh reality of late-nineteenth century temple exploitation and the transcendent spiritual beauty of Dohnavur. Every frame has been crafted in authentic collaboration with the fellowship archives."
          </p>
          <strong style={{ color: 'var(--color-purple)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            — Anandan Sundararajan, Director
          </strong>
        </div>
      </div>

      <TrailerModal 
        isOpen={!!modalVideo} 
        onClose={() => setModalVideo(null)} 
        videoSrc={modalVideo} 
      />
    </div>
  );
}
