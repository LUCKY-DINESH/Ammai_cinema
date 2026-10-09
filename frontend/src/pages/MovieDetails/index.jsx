import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService, reviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import RatingStars from '../../components/RatingStars';
import TrailerModal from '../../components/TrailerModal';
import DonationModal from '../../components/DonationModal';
import CLOUDINARY_MEDIA from '../../utils/media';

export default function MovieDetailsPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  // Review form state
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const m = await movieService.getBySlug(slug);
        setMovie(m);
        const targetId = m?.slug || m?.id || slug;
        const revs = await reviewService.getByMovie(targetId);
        setReviews(Array.isArray(revs) ? revs : []);
      } catch (err) {
        showToast(err.message || 'Movie not found');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingReview(true);
    try {
      const targetId = movie?.slug || movie?.id || slug;
      const newRev = await reviewService.create(targetId, {
        rating,
        comment,
        user_name: user?.full_name || 'Verified Audience',
      });
      if (newRev) {
        setReviews(prev => [newRev, ...prev.filter(r => r.id !== newRev.id)]);
      }
      setComment('');
      showToast('Review submitted successfully!');
    } catch (err) {
      showToast(err.message || 'Could not submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="page-top-spacing" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p>Loading cinema feature...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page-top-spacing" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Movie Not Found</h2>
        <Link to="/movies" style={{ color: 'var(--color-purple)', marginTop: '16px', display: 'inline-block' }}>
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Backdrop Banner */}
      <section 
        className="movie-details-hero"
        style={{ backgroundImage: `url(${movie.backdrop_url || CLOUDINARY_MEDIA.backdropTeasee})` }}>
        <div className="movie-details-hero-overlay"></div>
        <div className="container">
          <div className="movie-details-layout">
            <div className="movie-details-poster">
              <img src={movie.poster_url || CLOUDINARY_MEDIA.posterAmmai} alt={movie.title} />
            </div>

            <div>
              <span className="film-banner-badge" style={{ marginBottom: '14px' }}>
                {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
              </span>
              <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', textAlign: 'left', textShadow: 'none' }}>
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="hero-tagline" style={{ textAlign: 'left', marginBottom: '20px' }}>
                  "{movie.tagline}"
                </p>
              )}

              <div style={{ marginBottom: '24px' }}>
                {movie.genre?.map(g => (
                  <span key={g} className="movie-meta-pill">{g}</span>
                ))}
                <span className="movie-meta-pill">{movie.language || 'Tamil'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <RatingStars rating={movie.rating || 9.0} />
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  ({movie.rating_count || reviews.length} audience reviews)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button 
                  className="btn-hero-trailer" 
                  onClick={() => setTrailerOpen(true)}>
                  ▶ Play Trailer
                </button>
                <button 
                  className="btn-hero-donate" 
                  onClick={() => setDonateOpen(true)}
                  style={{ padding: '12px 32px' }}>
                  Support / Endowment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Reviews */}
      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '840px', marginBottom: '50px' }}>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
            Synopsis & History
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}>
            {movie.description}
          </p>

          <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', background: '#f8f8f6', padding: '20px', borderRadius: '12px' }}>
            <div>
              <strong style={{ color: '#777', fontSize: '0.85rem', textTransform: 'uppercase' }}>Director</strong>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '4px' }}>{movie.director || 'Anandan Sundararajan'}</p>
            </div>
            <div>
              <strong style={{ color: '#777', fontSize: '0.85rem', textTransform: 'uppercase' }}>Cast & Ensemble</strong>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '4px' }}>
                {Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="reviews-container">
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>
            Audience Reviews & Critical Acclaim
          </h2>

          {/* Add Review Form */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="review-form-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Write a Review</h3>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.9rem', color: '#666', marginRight: '10px' }}>Your Rating:</span>
                <RatingStars rating={rating} onRate={(newR) => setRating(newR)} />
              </div>
              <textarea
                placeholder="Share your thoughts on the film, historical fidelity, and cinematography..."
                rows="3"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit', resize: 'vertical', marginBottom: '12px' }}
              />
              <button 
                type="submit" 
                disabled={submittingReview}
                style={{ background: 'var(--color-purple)', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: '9999px', cursor: 'pointer' }}>
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div style={{ background: '#f8f8f6', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
              <p>
                Want to leave a review? <Link to="/login" style={{ color: 'var(--color-purple)', fontWeight: 700 }}>Log in</Link> with your account.
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(rev => (
              <div key={rev.id} className="review-item-card">
                <div className="review-author">
                  <span>{rev.user_name || 'Audience Member'}</span>
                  <RatingStars rating={rev.rating || 10} />
                </div>
                <p style={{ color: '#555', fontSize: '0.95rem' }}>{rev.comment}</p>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>{rev.created_at || 'Recent'}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <TrailerModal 
        isOpen={trailerOpen} 
        onClose={() => setTrailerOpen(false)} 
        videoSrc={movie.trailer_url || CLOUDINARY_MEDIA.trailer1} 
      />

      <DonationModal 
        isOpen={donateOpen} 
        onClose={() => setDonateOpen(false)} 
      />
    </div>
  );
}
