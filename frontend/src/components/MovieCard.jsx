import React from 'react';
import { Link } from 'react-router-dom';
import CLOUDINARY_MEDIA from '../utils/media';

export default function MovieCard({ movie }) {
  const statusLabel = movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon';

  return (
    <article className="movie-card-item">
      <Link to={`/movies/${movie.slug || movie.id}`} className="movie-card-poster-wrap">
        <img 
          src={movie.poster_url || CLOUDINARY_MEDIA.posterAmmai} 
          alt={movie.title} 
          loading="lazy" 
        />
        <span className={`movie-status-badge ${movie.status}`}>
          {statusLabel}
        </span>
      </Link>

      <div className="movie-card-info">
        <Link to={`/movies/${movie.slug || movie.id}`}>
          <h3 className="movie-card-title">{movie.title}</h3>
        </Link>
        <div className="movie-card-meta">
          <span>{movie.genre?.join(', ') || 'Feature Film'}</span>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="movie-card-rating">
            ★ {movie.rating ? movie.rating.toFixed(1) : '9.0'}
          </span>
          <Link 
            to={`/movies/${movie.slug || movie.id}`}
            style={{ fontSize: '0.85rem', color: 'var(--color-purple)', fontWeight: 700 }}>
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
