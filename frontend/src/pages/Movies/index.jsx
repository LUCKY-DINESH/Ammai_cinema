import React, { useState, useEffect } from 'react';
import MovieCard from '../../components/MovieCard';
import { movieService } from '../../services/api';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (search) params.search = search;
        if (genre) params.genre = genre;
        if (status) params.status = status;
        const res = await movieService.getAll(params);
        setMovies(res.items || res);
      } catch (err) {
        setError(err.message || 'Unable to load cinema catalog.');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchMovies, 300);
    return () => clearTimeout(timer);
  }, [search, genre, status]);

  return (
    <div className="page-top-spacing">
      <div className="catalog-header">
        <div className="container">
          <h1 className="section-title" style={{ color: '#fff', marginBottom: '8px' }}>
            Cinema Catalog
          </h1>
          <p className="section-subtitle" style={{ color: 'var(--color-gold)' }}>
            Feature Films • Archival Documentaries • Upcoming Premieres
          </p>
        </div>
      </div>

      <div className="container">
        {/* Search & Filter Bar */}
        <div className="filter-bar-wrapper">
          <input
            type="text"
            className="search-input-box"
            placeholder="Search movie title or cast..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-controls">
            <select 
              className="filter-select"
              value={genre} 
              onChange={(e) => setGenre(e.target.value)}>
              <option value="">All Genres</option>
              <option value="Biography">Biography</option>
              <option value="Historical">Historical</option>
              <option value="Drama">Drama</option>
              <option value="Documentary">Documentary</option>
              <option value="Action">Action</option>
            </select>

            <select 
              className="filter-select"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Releases</option>
              <option value="now_showing">Now Showing</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading cinema releases...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#e74c3c' }}>
            <p>{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No Movies Found</h3>
            <p style={{ color: '#777' }}>Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="movies-grid-display">
            {movies.map(movie => (
              <MovieCard key={movie.id || movie.slug} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
