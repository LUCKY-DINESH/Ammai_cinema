import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../components/HeroBanner';
import VideoPlayer from '../../components/VideoPlayer';
import CLOUDINARY_MEDIA from '../../utils/media';

export default function Home({ onOpenDonate, onOpenTrailer }) {
  return (
    <main>
      {/* Hero Section */}
      <HeroBanner 
        onOpenDonate={onOpenDonate}
        onWatchTrailer={() => onOpenTrailer(CLOUDINARY_MEDIA.trailer1)}
      />

      {/* Synopsis Section */}
      <section className="synopsis-section" id="synopsis">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title">THE MYSTIC KNIGHTESS</h2>
            <p className="section-subtitle">A Beacon of Compassion & Spiritual Courage</p>
          </div>

          <div className="synopsis-grid">
            <div className="poster-card">
              <img src={CLOUDINARY_MEDIA.posterAmmai} alt="Ammai: The Mystic Knightess Theatrical Poster" loading="lazy" />
            </div>

            <div className="synopsis-content">
              <p className="synopsis-lead">
                An extraordinary cinematic portrait chronicling the courageous life of Amy Carmichael—a fierce mystic who defied colonial norms and transformed the social fabric of Southern India.
              </p>
              <p className="synopsis-body">
                Arriving in Tamil Nadu in the late 19th century, Amy donned traditional Indian attire, learned the native language, and dedicated her existence to saving hundreds of children from exploitation and temple servitude.
              </p>
              <p className="synopsis-body">
                Her profound journey gave birth to the enduring sanctuary of <strong>The Dohnavur Fellowship</strong>, a haven of hope, healthcare, and education that continues to flourish more than a century later.
              </p>
              
              <div className="synopsis-quote-card">
                <p className="synopsis-quote-text">
                  "You can give without loving, but you cannot love without giving."
                </p>
                <p className="synopsis-quote-author">— Amy Carmichael (Ammai)</p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}>
                <Link to="/who-is-amy" className="btn-read-more">
                  Who is Amy? (Full Biography)
                </Link>
                <Link to="/movies" className="btn-read-more" style={{ background: '#2c2c34' }}>
                  Explore Film Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Custom Video Player */}
      <VideoPlayer src={CLOUDINARY_MEDIA.trailer1} poster={CLOUDINARY_MEDIA.backdropTeasee} />

      {/* Trailers & Teasers Gallery */}
      <section className="trailers-section" id="trailers">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title">Trailers & Featurettes</h2>
            <p className="section-subtitle">Explore the Archive & Cinematic Journey</p>
          </div>

          <div className="trailers-grid">
            <div className="trailer-card" onClick={() => onOpenTrailer(CLOUDINARY_MEDIA.trailer1)}>
              <img src={CLOUDINARY_MEDIA.posterSanctuary} alt="The Sanctuary at Dohnavur" className="trailer-card-img" loading="lazy" />
              <div className="trailer-card-overlay">
                <div className="card-play-icon">▶</div>
                <h3 className="trailer-title">The Sanctuary at Dohnavur</h3>
                <p className="trailer-desc">Archival Teaser 01 • The sanctuary grounds</p>
              </div>
            </div>

            <div className="trailer-card" onClick={() => onOpenTrailer(CLOUDINARY_MEDIA.trailer2)}>
              <img src={CLOUDINARY_MEDIA.posterDefying} alt="The Mystic Heart" className="trailer-card-img" loading="lazy" />
              <div className="trailer-card-overlay">
                <div className="card-play-icon">▶</div>
                <h3 className="trailer-title">The Mystic Heart</h3>
                <p className="trailer-desc">Character Featurette • Faith & Activism</p>
              </div>
            </div>

            <div className="trailer-card" onClick={() => onOpenTrailer(CLOUDINARY_MEDIA.trailer1)}>
              <img src={CLOUDINARY_MEDIA.posterAmmai} alt="Defying Conventions" className="trailer-card-img" loading="lazy" />
              <div className="trailer-card-overlay">
                <div className="card-play-icon">▶</div>
                <h3 className="trailer-title">Defying Conventions</h3>
                <p className="trailer-desc">Official Theatrical Promo • The Rescue Mission</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/teasers" className="btn-hero-trailer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All Video Teasers & Trailers →
            </Link>
          </div>
        </div>
      </section>

      {/* Story & Biography Preview */}
      <section className="story-section" id="story">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <span className="story-eyebrow">A CENTURY OF IMPACT</span>
              <h2 className="story-heading">Fierce Mystic, Fearless Protector</h2>
              <p className="story-lead">
                Amy Carmichael refused to be a passive bystander. At a time when societal injustices were shielded behind traditional masks, she stepped into the fray with radical love and an unshakable moral compass.
              </p>

              <div className="trait-card warrior">
                <h3 className="trait-title">The Mystic Warrior</h3>
                <p className="trait-body">
                  Known as "Ammai" (Mother) across Tamil Nadu, she established covert rescue routes to liberate girls and young boys from lifelong ritual servitude. Her home at Dohnavur became a sovereign territory of safety where caste, status, and background dissolved.
                </p>
              </div>

              <div className="trait-card poet">
                <h3 className="trait-title">Eloquent Poet & Mystic</h3>
                <p className="trait-body">
                  Words were her solace. Confined to bed during her later years due to severe injuries, Amy authored 35 seminal books and volumes of mystical poetry celebrating nature's divine harmony, human compassion, and unwavering faith.
                </p>
              </div>
            </div>

            <div className="story-image-mosaic">
              <img src={CLOUDINARY_MEDIA.dohnavurArch} alt="Dohnavur Architecture" className="mosaic-img" loading="lazy" />
              <img src={CLOUDINARY_MEDIA.amyHistorical} alt="Historical Archival Photography" className="mosaic-img" loading="lazy" />
              <img src={CLOUDINARY_MEDIA.backdropSanctuaryGrounds} alt="Amy Carmichael Sanctuary Grounds" className="mosaic-img" loading="lazy" />
              <img src={CLOUDINARY_MEDIA.fellowshipNature} alt="Dohnavur Fellowship Nature" className="mosaic-img" loading="lazy" />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to="/who-is-amy" className="btn-read-more" style={{ display: 'inline-block', padding: '12px 30px' }}>
              Read Amy Carmichael's Comprehensive Biography & Legacy →
            </Link>
          </div>
        </div>
      </section>

      {/* Dohnavur Fellowship */}
      <section className="dohnavur-section" id="dohnavur">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title">The Dohnavur Fellowship</h2>
            <p className="section-subtitle">A Century of Unbroken Service & Sanctuary</p>
          </div>

          <div className="fellowship-grid">
            <div className="fellowship-card">
              <img src={CLOUDINARY_MEDIA.childrenYoYos} alt="Children at Dohnavur" className="fellowship-card-img" loading="lazy" />
              <div className="fellowship-card-body">
                <h3 className="fellowship-title">Generations of Compassion</h3>
                <p className="synopsis-body">
                  Located at the foothills of the Western Ghats in Tirunelveli district, Dohnavur Fellowship has provided tender protection, world-class medical treatment, and holistic education to thousands of children for over 120 years.
                </p>
              </div>
            </div>

            <div className="fellowship-card">
              <img src={CLOUDINARY_MEDIA.teamLeaders} alt="Dohnavur Leadership and Healthcare" className="fellowship-card-img" loading="lazy" />
              <div className="fellowship-card-body">
                <h3 className="fellowship-title">Healthcare & Community</h3>
                <p className="synopsis-body">
                  Through the Dohnavur Hospital and outreach clinics, the fellowship delivers free and subsidized medical care, surgical treatment, and maternal health services to dozens of surrounding villages.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/dohnavur" className="btn-read-more" style={{ display: 'inline-block', padding: '12px 30px', background: 'var(--color-purple)' }}>
              Explore The Dohnavur Fellowship Sanctuary →
            </Link>
          </div>
        </div>
      </section>

      {/* Endowments Section */}
      <section className="endowments-section" id="endowments">
        <div className="container">
          <div className="endowments-bar-divider">
            <h2 className="endowments-bar-title">ENDOWMENTS</h2>
          </div>

          <div className="endowments-cards-grid">
            <div className="endowment-block">
              <div className="endowment-upper-card">
                <span className="endowment-badge">Film & Heritage</span>
                <img src={CLOUDINARY_MEDIA.preservationCauses} alt="Preservation & Heritage" loading="lazy" />
              </div>
              <div className="endowment-lower-bar">
                <h3 className="endowment-lower-title">Production Endowment</h3>
                <button className="endowment-cta-btn" onClick={onOpenDonate}>Contribute</button>
              </div>
            </div>

            <div className="endowment-block">
              <div className="endowment-upper-card">
                <span className="endowment-badge">Children & Education</span>
                <img src={CLOUDINARY_MEDIA.childrenYoYos} alt="Fellowship Children Welfare" loading="lazy" />
              </div>
              <div className="endowment-lower-bar">
                <h3 className="endowment-lower-title">Fellowship Endowment</h3>
                <button className="endowment-cta-btn" onClick={onOpenDonate}>Contribute</button>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/endowments" className="btn-read-more" style={{ display: 'inline-block', padding: '12px 30px', background: 'var(--color-gold)', color: '#111' }}>
              View Complete Endowments, Transparency & Bank Details →
            </Link>
          </div>
        </div>
      </section>

      {/* Production Team */}
      <section className="team-section" id="team">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title">Production & Creative Team</h2>
            <p className="section-subtitle">Wordint Films in Collaboration with LevelUp & I Films</p>
          </div>

          <div className="team-grid">
            <div className="team-card">
              <img src={CLOUDINARY_MEDIA.teamAntony} alt="Antony" className="team-avatar" loading="lazy" />
              <h3 className="team-name">Antony</h3>
              <p className="team-role">Creative Production</p>
            </div>

            <div className="team-card">
              <img src={CLOUDINARY_MEDIA.teamKarthik} alt="Karthik" className="team-avatar" loading="lazy" />
              <h3 className="team-name">Karthik</h3>
              <p className="team-role">Cinematography & Visuals</p>
            </div>

            <div className="team-card">
              <img src={CLOUDINARY_MEDIA.teamRavi} alt="Ravi" className="team-avatar" loading="lazy" />
              <h3 className="team-name">Ravi</h3>
              <p className="team-role">Art & Historical Research</p>
            </div>

            <div className="team-card">
              <img src={CLOUDINARY_MEDIA.teamVenkat} alt="Venkat" className="team-avatar" loading="lazy" />
              <h3 className="team-name">Venkat</h3>
              <p className="team-role">Production Logistics</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
