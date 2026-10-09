import React from 'react';

export default function RatingStars({ rating = 0, max = 10, onRate }) {
  const starsCount = 5;
  const normalized = (rating / max) * starsCount;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {[...Array(starsCount)].map((_, i) => {
        const filled = i + 1 <= normalized;
        const half = !filled && i < normalized;
        return (
          <span 
            key={i} 
            onClick={() => onRate?.((i + 1) * 2)}
            style={{ 
              color: filled || half ? 'var(--color-gold)' : '#d0d0d0', 
              fontSize: '1.1rem',
              cursor: onRate ? 'pointer' : 'default' 
            }}>
            ★
          </span>
        );
      })}
      <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: '6px' }}>
        {rating.toFixed(1)}/10
      </span>
    </div>
  );
}
