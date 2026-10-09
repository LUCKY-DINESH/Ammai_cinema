import React from 'react';

export default function HeroBanner({ onOpenDonate, onWatchTrailer }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="film-banner-badge">An Anandan Sundararajan Film</span>
        <h1 className="hero-title">AMMAI</h1>
        <h2 className="hero-subtitle">THE MYSTIC KNIGHTESS</h2>
        <p className="hero-tagline">"The Untold Story of Amy Carmichael"</p>
        <div className="hero-actions">
          <button 
            className="btn-hero-donate" 
            onClick={onOpenDonate}>
            Donate
          </button>
          <button 
            className="btn-hero-trailer" 
            onClick={onWatchTrailer}>
            <span>▶ Watch Teaser</span>
          </button>
        </div>
      </div>
    </section>
  );
}
