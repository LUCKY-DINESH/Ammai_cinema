import React from 'react';
import CLOUDINARY_MEDIA from '../utils/media';

export default function TrailerModal({ isOpen, onClose, videoSrc }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card dark" style={{ maxWidth: '900px', padding: '20px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Video">✕</button>
        <div style={{ aspectRatio: '16 / 9', width: '100%', borderRadius: '8px', overflow: 'hidden', marginTop: '10px' }}>
          <video 
            src={videoSrc || CLOUDINARY_MEDIA.trailer1} 
            controls 
            autoPlay 
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}>
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
