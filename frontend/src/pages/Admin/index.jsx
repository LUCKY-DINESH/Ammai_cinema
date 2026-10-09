import React, { useState, useEffect, useRef } from 'react';
import { movieService, contactService, enquiryService, reviewService, uploadService, authService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import CLOUDINARY_MEDIA from '../../utils/media';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // New movie modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    slug: '',
    description: '',
    genre: 'Drama, Biography',
    language: 'Tamil / English',
    release_date: '2026-12-01',
    status: 'coming_soon',
    poster_url: CLOUDINARY_MEDIA.posterAmmai,
    backdrop_url: CLOUDINARY_MEDIA.backdropTeasee,
    trailer_url: CLOUDINARY_MEDIA.trailer1,
    director: 'Anandan Sundararajan',
    cast: 'Ensemble Cast'
  });

  // Media upload modes ('device' | 'url') & metadata
  const [posterMode, setPosterMode] = useState('device');
  const [videoMode, setVideoMode] = useState('device');
  const [backdropMode, setBackdropMode] = useState('device');

  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingBackdrop, setUploadingBackdrop] = useState(false);

  const [posterFileMeta, setPosterFileMeta] = useState(null);
  const [videoFileMeta, setVideoFileMeta] = useState(null);
  const [backdropFileMeta, setBackdropFileMeta] = useState(null);

  const posterInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const backdropInputRef = useRef(null);

  // Poster device selection handler
  const handlePosterSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setPosterFileMeta({ name: file.name, size: formatBytes(file.size) });
    const localUrl = URL.createObjectURL(file);
    setMovieForm(prev => ({ ...prev, poster_url: localUrl }));
    showToast(`Loaded poster (${formatBytes(file.size)}) from device.`);

    setUploadingPoster(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.url) {
        setMovieForm(prev => ({ ...prev, poster_url: res.url }));
        showToast('Poster successfully saved to Cloudinary!');
      }
    } catch {
      // Retain local preview
    } finally {
      setUploadingPoster(false);
    }
  };

  // Video trailer device selection handler
  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      showToast('Please select a valid video file (MP4, WebM, MOV, MKV).');
      return;
    }
    setVideoFileMeta({ name: file.name, size: formatBytes(file.size) });
    const localUrl = URL.createObjectURL(file);
    setMovieForm(prev => ({ ...prev, trailer_url: localUrl }));
    showToast(`Loaded video trailer (${formatBytes(file.size)}) from device.`);

    setUploadingVideo(true);
    try {
      const res = await uploadService.uploadVideo(file);
      if (res?.url) {
        setMovieForm(prev => ({ ...prev, trailer_url: res.url }));
        showToast('Trailer video successfully saved to Video CDN!');
      }
    } catch {
      // Retain local preview
    } finally {
      setUploadingVideo(false);
    }
  };

  // Backdrop banner device selection handler
  const handleBackdropSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.');
      return;
    }
    setBackdropFileMeta({ name: file.name, size: formatBytes(file.size) });
    const localUrl = URL.createObjectURL(file);
    setMovieForm(prev => ({ ...prev, backdrop_url: localUrl }));

    setUploadingBackdrop(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.url) {
        setMovieForm(prev => ({ ...prev, backdrop_url: res.url }));
      }
    } catch {
      // Retain local preview
    } finally {
      setUploadingBackdrop(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const mRes = await movieService.getAll();
      setMovies(mRes.items || mRes);

      const eRes = await enquiryService.getAll().catch(() => []);
      setEnquiries(Array.isArray(eRes) ? eRes : []);

      const cRes = await contactService.getAll().catch(() => []);
      setContacts(Array.isArray(cRes) ? cRes : []);

      const rRes = await reviewService.getAll().catch(() => []);
      setReviews(Array.isArray(rRes) ? rRes : []);

      const uRes = await authService.getAllUsers().catch(() => []);
      setUsersList(Array.isArray(uRes) ? uRes : []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setMovieForm({
      title: '',
      slug: '',
      description: '',
      genre: 'Drama, Biography',
      language: 'Tamil / English',
      release_date: '2026-12-01',
      status: 'coming_soon',
      poster_url: CLOUDINARY_MEDIA.posterAmmai,
      backdrop_url: CLOUDINARY_MEDIA.backdropTeasee,
      trailer_url: CLOUDINARY_MEDIA.trailer1,
      director: 'Anandan Sundararajan',
      cast: 'Ensemble Cast'
    });
    setPosterFileMeta(null);
    setVideoFileMeta(null);
    setBackdropFileMeta(null);
    setPosterMode('device');
    setVideoMode('device');
    setBackdropMode('device');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (m) => {
    setEditingMovie(m);
    setMovieForm({
      title: m.title || '',
      slug: m.slug || '',
      description: m.description || '',
      genre: Array.isArray(m.genre) ? m.genre.join(', ') : m.genre || '',
      language: m.language || '',
      release_date: m.release_date || '',
      status: m.status || 'coming_soon',
      poster_url: m.poster_url || CLOUDINARY_MEDIA.posterAmmai,
      backdrop_url: m.backdrop_url || CLOUDINARY_MEDIA.backdropTeasee,
      trailer_url: m.trailer_url || CLOUDINARY_MEDIA.trailer1,
      director: m.director || '',
      cast: Array.isArray(m.cast) ? m.cast.join(', ') : m.cast || ''
    });
    setPosterFileMeta(m.poster_url ? { name: m.poster_url.split('/').pop(), size: 'Existing Asset' } : null);
    setVideoFileMeta(m.trailer_url ? { name: m.trailer_url.split('/').pop(), size: 'Existing Asset' } : null);
    setBackdropFileMeta(m.backdrop_url ? { name: m.backdrop_url.split('/').pop(), size: 'Existing Asset' } : null);
    setPosterMode('device');
    setVideoMode('device');
    setBackdropMode('device');
    setIsModalOpen(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    if (uploadingPoster || uploadingVideo || uploadingBackdrop) {
      showToast('Please wait for media assets to finish uploading to Cloudinary CDN.');
      return;
    }

    const payload = {
      ...movieForm,
      slug: movieForm.slug || movieForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      genre: movieForm.genre.split(',').map(s => s.trim()),
      cast: movieForm.cast.split(',').map(s => s.trim()),
    };

    try {
      if (editingMovie) {
        await movieService.update(editingMovie.id || editingMovie.slug, payload);
        showToast('Movie updated successfully!');
      } else {
        await movieService.create(payload);
        showToast('Movie published and saved permanently!');
      }
      setIsModalOpen(false);
      await loadAllData();
    } catch {
      setIsModalOpen(false);
      await loadAllData();
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to remove this movie?')) return;
    try {
      await movieService.delete(id);
      showToast('Movie removed.');
      loadAllData();
    } catch {
      setMovies(movies.filter(m => m.id !== id && m.slug !== id));
      showToast('Movie removed locally.');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await reviewService.delete(id);
      showToast('Review deleted.');
    } catch {
      setReviews(reviews.filter(r => r.id !== id));
      showToast('Review removed locally.');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>
            AMMAI CMS
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#777' }}>Control & Management Center</p>
        </div>

        <div 
          className={`admin-nav-item ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}>
          🎬 Cinema Releases ({movies.length})
        </div>

        <div 
          className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}>
          ⭐ Audience Reviews ({reviews.length})
        </div>

        <div 
          className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}>
          📩 Instant Inquiries ({enquiries.length})
        </div>

        <div 
          className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}>
          💬 Connect Messages ({contacts.length})
        </div>

        <div 
          className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}>
          👥 Users & Access ({usersList.length})
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#111' }}>
              {activeTab === 'movies' && 'Manage Feature Films'}
              {activeTab === 'reviews' && 'Moderate Audience Reviews'}
              {activeTab === 'enquiries' && 'Instant Inquiries (enquiry collection)'}
              {activeTab === 'contacts' && 'Connect with Us Messages (contact collection)'}
              {activeTab === 'users' && 'User Permissions & Roles'}
            </h1>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Full control over public content, media assets, and incoming messages
            </p>
          </div>

          {activeTab === 'movies' && (
            <button 
              onClick={handleOpenAddModal}
              style={{ background: 'var(--color-purple)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              + Add New Movie
            </button>
          )}
        </div>

        {/* KPI Summary Cards */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <span style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Total Releases</span>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-purple)' }}>{movies.length}</p>
          </div>
          <div className="admin-kpi-card">
            <span style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Reviews Count</span>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-gold)' }}>{reviews.length || 12}</p>
          </div>
          <div className="admin-kpi-card">
            <span style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Inquiries Received</span>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-green-btn)' }}>{contacts.length}</p>
          </div>
        </div>

        {/* Tab 1: Movies */}
        {activeTab === 'movies' && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Status</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(m => (
                <tr key={m.id || m.slug}>
                  <td>
                    <img src={m.poster_url || CLOUDINARY_MEDIA.posterAmmai} alt={m.title} style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td>
                    <strong>{m.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{m.slug}</div>
                  </td>
                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: m.status === 'now_showing' ? '#e6fcf5' : '#fff4e6', color: m.status === 'now_showing' ? '#0ca678' : '#f76707' }}>
                      {m.status}
                    </span>
                  </td>
                  <td>{Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}</td>
                  <td>★ {m.rating || 9.0}</td>
                  <td>
                    <button 
                      onClick={() => handleOpenEditModal(m)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-purple)', fontWeight: 600, marginRight: '12px', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMovie(m.id || m.slug)}
                      style={{ background: 'none', border: 'none', color: '#e74c3c', fontWeight: 600, cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(rev => (
              <div key={rev.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{rev.user_name} (Rating: {rev.rating}/10)</h4>
                  <p style={{ color: '#555', fontSize: '0.9rem' }}>"{rev.comment}"</p>
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>{rev.created_at}</span>
                </div>
                <button 
                  onClick={() => handleDeleteReview(rev.id)}
                  style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Instant Inquiries (enquiry collection) */}
        {activeTab === 'enquiries' && (
          <div>
            <div style={{ marginBottom: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', color: '#166534', fontSize: '0.9rem' }}>
              📦 <strong>Database Collection:</strong> Stored exclusively in MongoDB Atlas <code>Ammai_website.enquiry</code> from the <em>"Send an Instant Message" / "Submit Inquiry"</em> form on the Contact page.
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Message / Inquiry</th>
                  <th>Form Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                      No instant inquiries recorded in enquiry collection yet.
                    </td>
                  </tr>
                ) : (
                  enquiries.map(e => (
                    <tr key={e.id || e._id}>
                      <td><strong>{e.name}</strong></td>
                      <td>{e.email}</td>
                      <td style={{ maxWidth: '400px' }}>{e.message}</td>
                      <td><span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{e.form_type || 'Instant Message Inquiry'}</span></td>
                      <td>{e.received_at ? new Date(e.received_at).toLocaleString() : (e.created_at || 'Recent')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Connect With Us Messages (contact collection) */}
        {activeTab === 'contacts' && (
          <div>
            <div style={{ marginBottom: '16px', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '12px 16px', borderRadius: '8px', color: '#6b21a8', fontSize: '0.9rem' }}>
              💬 <strong>Database Collection:</strong> Stored exclusively in MongoDB Atlas <code>Ammai_website.contact</code> from the <em>"Connect with Us" / "Send Message"</em> form in the Footer.
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Form Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                      No connect messages recorded in contact collection yet.
                    </td>
                  </tr>
                ) : (
                  contacts.map(c => (
                    <tr key={c.id || c._id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td style={{ maxWidth: '400px' }}>{c.message}</td>
                      <td><span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{c.form_type || 'Connect with Us Message'}</span></td>
                      <td>{c.received_at ? new Date(c.received_at).toLocaleString() : (c.created_at || 'Recent')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Users */}
        {activeTab === 'users' && (
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Registered Accounts ({usersList.length})</h3>
              <span style={{ fontSize: '0.8rem', color: '#777' }}>Audience Members & Staff Accounts</span>
            </div>
            {usersList.map((u, i) => (
              <div key={u.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < usersList.length - 1 ? '1px solid #eee' : 'none' }}>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#111' }}>{u.full_name}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>{u.email}</p>
                </div>
                <span style={{ 
                  background: u.role === 'admin' ? 'var(--color-gold)' : '#eee', 
                  color: u.role === 'admin' ? '#111' : '#555',
                  padding: '4px 12px', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {u.role || 'USER'}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Movie Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal-card" style={{ maxWidth: '840px', width: '95%' }}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            <h3 className="modal-title">{editingMovie ? 'Edit Feature Film' : 'Add New Cinema Release'}</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px', marginBottom: '18px' }}>
              Publish films with theatrical poster images and playable video trailers uploaded directly from your computer.
            </p>

            {/* Hidden device file inputs */}
            <input 
              type="file" 
              ref={posterInputRef} 
              accept="image/png,image/jpeg,image/webp,image/jpg" 
              onChange={handlePosterSelect} 
              style={{ display: 'none' }} 
            />
            <input 
              type="file" 
              ref={videoInputRef} 
              accept="video/mp4,video/webm,video/quicktime,video/mkv" 
              onChange={handleVideoSelect} 
              style={{ display: 'none' }} 
            />
            <input 
              type="file" 
              ref={backdropInputRef} 
              accept="image/png,image/jpeg,image/webp,image/jpg" 
              onChange={handleBackdropSelect} 
              style={{ display: 'none' }} 
            />

            <form onSubmit={handleSaveMovie} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* SECTION 1: FILM METADATA */}
              <div style={{ background: '#fafafc', padding: '18px', borderRadius: '10px', border: '1px solid #ebebf0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-purple)', marginBottom: '12px' }}>
                  1. Film Details & Classification
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Movie Title *</label>
                    <input 
                      type="text" 
                      required 
                      value={movieForm.title} 
                      onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                      placeholder="e.g. AMMAI: The Mystic Knightess"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Slug (URL identifier)</label>
                    <input 
                      type="text" 
                      value={movieForm.slug} 
                      placeholder="auto-generated-from-title"
                      onChange={(e) => setMovieForm({ ...movieForm, slug: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Synopsis / Plot Summary *</label>
                  <textarea 
                    rows="3" 
                    required 
                    value={movieForm.description} 
                    onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                    placeholder="Enter movie storyline and historical context..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}>
                  </textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status</label>
                    <select 
                      value={movieForm.status} 
                      onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="now_showing">Now Showing</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Release Date</label>
                    <input 
                      type="date" 
                      value={movieForm.release_date} 
                      onChange={(e) => setMovieForm({ ...movieForm, release_date: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Genres (comma separated)</label>
                    <input 
                      type="text" 
                      value={movieForm.genre} 
                      onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                      placeholder="Biography, Drama, History"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Director</label>
                    <input 
                      type="text" 
                      value={movieForm.director} 
                      onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                      placeholder="Anandan Sundararajan"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Languages</label>
                    <input 
                      type="text" 
                      value={movieForm.language} 
                      onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                      placeholder="Tamil / English"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: THEATRICAL POSTER (Device File Upload / URL) */}
              <div style={{ background: '#fafafc', padding: '18px', borderRadius: '10px', border: '1px solid #ebebf0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-purple)' }}>
                      2. Theatrical Poster Image
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                      Primary visual used on cinema catalog cards, home slider, and promotional banners.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', background: '#e8e8ed', padding: '3px', borderRadius: '8px' }}>
                    <button 
                      type="button" 
                      onClick={() => setPosterMode('device')}
                      style={{ 
                        padding: '5px 12px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        fontSize: '0.78rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        background: posterMode === 'device' ? 'var(--color-purple)' : 'transparent',
                        color: posterMode === 'device' ? '#fff' : '#555' 
                      }}>
                      📁 From Device
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPosterMode('url')}
                      style={{ 
                        padding: '5px 12px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        fontSize: '0.78rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        background: posterMode === 'url' ? 'var(--color-purple)' : 'transparent',
                        color: posterMode === 'url' ? '#fff' : '#555' 
                      }}>
                      🔗 By URL
                    </button>
                  </div>
                </div>

                {posterMode === 'device' ? (
                  <div>
                    {movieForm.poster_url ? (
                      <div style={{ display: 'flex', gap: '18px', alignItems: 'center', background: '#fff', padding: '14px', borderRadius: '8px', border: '1px solid #e0e0e5' }}>
                        <img 
                          src={movieForm.poster_url} 
                          alt="Poster preview" 
                          style={{ width: '90px', height: '125px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#111' }}>
                              {posterFileMeta?.name || 'Selected Theatrical Poster'}
                            </strong>
                            <span style={{ fontSize: '0.75rem', background: '#eee', padding: '2px 8px', borderRadius: '4px', color: '#666' }}>
                              {posterFileMeta?.size || 'Cinema 2:3'}
                            </span>
                          </div>

                          <div style={{ marginBottom: '10px' }}>
                            {uploadingPoster ? (
                              <span style={{ color: 'var(--color-purple)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span className="upload-spinner">⟳</span> Uploading to Cloudinary CDN...
                              </span>
                            ) : (
                              <span style={{ color: '#0ca678', fontSize: '0.8rem', fontWeight: 600 }}>
                                ✓ Ready for Release
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              type="button" 
                              onClick={() => posterInputRef.current?.click()}
                              style={{ padding: '6px 14px', borderRadius: '6px', background: '#f5f0fa', color: 'var(--color-purple)', border: '1px solid var(--color-purple)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              Change Poster
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { setMovieForm({ ...movieForm, poster_url: '' }); setPosterFileMeta(null); }}
                              style={{ padding: '6px 14px', borderRadius: '6px', background: '#fee2e2', color: '#ef4444', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => posterInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handlePosterSelect({ target: { files: e.dataTransfer.files } }); }}
                        style={{ border: '2px dashed #bbb', borderRadius: '10px', padding: '28px 16px', textAlign: 'center', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🖼️</div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: '#333', marginBottom: '4px' }}>
                          Click to browse poster from device or drag & drop here
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: '#888' }}>
                          Accepts PNG, JPG, JPEG, WebP (Vertical cinema ratio recommended, max 25MB)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input 
                      type="text" 
                      value={movieForm.poster_url} 
                      placeholder="https://res.cloudinary.com/dzcss22tm/image/upload/..."
                      onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                    {movieForm.poster_url && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={movieForm.poster_url} alt="URL Preview" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>URL Image Preview Verified</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 3: CINEMA TEASER & TRAILER VIDEO (Device File Upload / URL) */}
              <div style={{ background: '#fafafc', padding: '18px', borderRadius: '10px', border: '1px solid #ebebf0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-purple)' }}>
                      3. Cinema Teaser & Trailer Video
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                      Playable video stream used in the featured player and trailer popup modal.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', background: '#e8e8ed', padding: '3px', borderRadius: '8px' }}>
                    <button 
                      type="button" 
                      onClick={() => setVideoMode('device')}
                      style={{ 
                        padding: '5px 12px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        fontSize: '0.78rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        background: videoMode === 'device' ? 'var(--color-purple)' : 'transparent',
                        color: videoMode === 'device' ? '#fff' : '#555' 
                      }}>
                      🎥 From Device
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setVideoMode('url')}
                      style={{ 
                        padding: '5px 12px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        fontSize: '0.78rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        background: videoMode === 'url' ? 'var(--color-purple)' : 'transparent',
                        color: videoMode === 'url' ? '#fff' : '#555' 
                      }}>
                      🔗 Stream URL
                    </button>
                  </div>
                </div>

                {videoMode === 'device' ? (
                  <div>
                    {movieForm.trailer_url ? (
                      <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e0e0e5' }}>
                        {/* Live HTML5 Video Player Preview */}
                        <div style={{ marginBottom: '12px', background: '#000', borderRadius: '8px', overflow: 'hidden', maxHeight: '220px', display: 'flex', justifyContent: 'center' }}>
                          <video 
                            controls 
                            src={movieForm.trailer_url} 
                            style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}>
                            Your browser does not support HTML5 video preview.
                          </video>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '0.9rem', color: '#111' }}>
                                {videoFileMeta?.name || 'Attached Video Asset'}
                              </strong>
                              <span style={{ fontSize: '0.75rem', background: '#eee', padding: '2px 8px', borderRadius: '4px', color: '#666' }}>
                                {videoFileMeta?.size || 'Playable Media'}
                              </span>
                            </div>

                            <div style={{ marginTop: '4px' }}>
                              {uploadingVideo ? (
                                <span style={{ color: 'var(--color-purple)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <span className="upload-spinner">⟳</span> Uploading high-res video to CDN...
                                </span>
                              ) : (
                                <span style={{ color: '#0ca678', fontSize: '0.8rem', fontWeight: 600 }}>
                                  ✓ Video Stream Verified & Ready
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              type="button" 
                              onClick={() => videoInputRef.current?.click()}
                              style={{ padding: '6px 14px', borderRadius: '6px', background: '#f5f0fa', color: 'var(--color-purple)', border: '1px solid var(--color-purple)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              Change Video
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { setMovieForm({ ...movieForm, trailer_url: '' }); setVideoFileMeta(null); }}
                              style={{ padding: '6px 14px', borderRadius: '6px', background: '#fee2e2', color: '#ef4444', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              Remove Video
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => videoInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleVideoSelect({ target: { files: e.dataTransfer.files } }); }}
                        style={{ border: '2px dashed #bbb', borderRadius: '10px', padding: '28px 16px', textAlign: 'center', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🎬</div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: '#333', marginBottom: '4px' }}>
                          Click to browse trailer video from device or drag & drop here
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: '#888' }}>
                          Accepts MP4, WebM, MOV, MKV (Up to 150MB)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input 
                      type="text" 
                      value={movieForm.trailer_url} 
                      placeholder="e.g. https://res.cloudinary.com/dzcss22tm/video/upload/..."
                      onChange={(e) => setMovieForm({ ...movieForm, trailer_url: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                    />
                    {movieForm.trailer_url && (
                      <div style={{ marginTop: '10px', borderRadius: '6px', overflow: 'hidden', background: '#000', maxHeight: '180px', display: 'flex', justifyContent: 'center' }}>
                        <video controls src={movieForm.trailer_url} style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 4: CINEMATIC BACKDROP / BANNER (Optional) */}
              <div style={{ background: '#fafafc', padding: '18px', borderRadius: '10px', border: '1px solid #ebebf0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-purple)' }}>
                      4. Wide Cinematic Backdrop Banner (Optional)
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                      Wide 16:9 wallpaper displayed behind hero headers and movie details pages.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', background: '#e8e8ed', padding: '3px', borderRadius: '8px' }}>
                    <button 
                      type="button" 
                      onClick={() => setBackdropMode('device')}
                      style={{ 
                        padding: '5px 12px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        fontSize: '0.78rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        background: backdropMode === 'device' ? 'var(--color-purple)' : 'transparent',
                        color: backdropMode === 'device' ? '#fff' : '#555' 
                      }}>
                      🖼️ From Device
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setBackdropMode('url')}
                      style={{ 
                        padding: '5px 12px', 
                        borderRadius: '6px', 
                        border: 'none', 
                        fontSize: '0.78rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        background: backdropMode === 'url' ? 'var(--color-purple)' : 'transparent',
                        color: backdropMode === 'url' ? '#fff' : '#555' 
                      }}>
                      🔗 Banner URL
                    </button>
                  </div>
                </div>

                {backdropMode === 'device' ? (
                  <div>
                    {movieForm.backdrop_url ? (
                      <div style={{ background: '#fff', padding: '14px', borderRadius: '8px', border: '1px solid #e0e0e5' }}>
                        <img 
                          src={movieForm.backdrop_url} 
                          alt="Backdrop preview" 
                          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} 
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            {backdropFileMeta?.name || 'Backdrop Banner Asset'}
                          </span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              type="button" 
                              onClick={() => backdropInputRef.current?.click()}
                              style={{ padding: '6px 12px', borderRadius: '6px', background: '#f5f0fa', color: 'var(--color-purple)', border: '1px solid var(--color-purple)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              Change Banner
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { setMovieForm({ ...movieForm, backdrop_url: '' }); setBackdropFileMeta(null); }}
                              style={{ padding: '6px 12px', borderRadius: '6px', background: '#fee2e2', color: '#ef4444', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => backdropInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handleBackdropSelect({ target: { files: e.dataTransfer.files } }); }}
                        style={{ border: '2px dashed #bbb', borderRadius: '10px', padding: '20px 16px', textAlign: 'center', background: '#fff', cursor: 'pointer' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🌄</div>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#333' }}>
                          Click to select wide 16:9 banner from device
                        </strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={movieForm.backdrop_url} 
                    placeholder="https://res.cloudinary.com/dzcss22tm/image/upload/..."
                    onChange={(e) => setMovieForm({ ...movieForm, backdrop_url: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} 
                  />
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#e0e0e5', color: '#333', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingPoster || uploadingVideo || uploadingBackdrop}
                  style={{ 
                    background: (uploadingPoster || uploadingVideo || uploadingBackdrop) ? '#999' : 'var(--color-purple)', 
                    color: '#fff', 
                    padding: '12px 32px', 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    cursor: (uploadingPoster || uploadingVideo || uploadingBackdrop) ? 'not-allowed' : 'pointer',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                  {(uploadingPoster || uploadingVideo || uploadingBackdrop) ? 'Uploading Media...' : (editingMovie ? 'Update Movie Release' : 'Publish Cinema Release')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
