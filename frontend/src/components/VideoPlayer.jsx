import React, { useRef, useState, useEffect } from 'react';
import CLOUDINARY_MEDIA from '../utils/media';

export default function VideoPlayer({ src = CLOUDINARY_MEDIA.trailer1, poster = CLOUDINARY_MEDIA.backdropTeasee }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    videoRef.current.currentTime = seekTime;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
  };

  const toggleFullscreen = () => {
    if (!playerWrapperRef.current) return;
    if (!document.fullscreenElement) {
      playerWrapperRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="video-showcase-section" id="video-player">
      <div className="container">
        <div className="section-header-centered">
          <h2 className="section-title">Official Cinematic Teaser</h2>
          <p className="section-subtitle">First Look Experience</p>
        </div>

        <div 
          ref={playerWrapperRef}
          className={`player-wrapper ${isPlaying ? 'playing' : ''}`}>
          <video
            ref={videoRef}
            className="custom-video-element"
            poster={poster}
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            preload="metadata"
          />

          {!isPlaying && (
            <div className="player-overlay-play" onClick={togglePlay} aria-label="Play Video">
              <div className="big-play-btn">▶</div>
            </div>
          )}

          <div className="player-controls-bar">
            <button className="control-btn" onClick={togglePlay} aria-label="Play or Pause">
              {isPlaying ? '❚❚' : '►'}
            </button>
            <span className="timecode-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div 
              ref={progressRef}
              className="progress-container" 
              onClick={handleSeek}>
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="volume-wrapper">
              <span style={{ fontSize: '0.9rem' }}>🔊</span>
              <input 
                type="range" 
                className="volume-slider" 
                min="0" 
                max="1" 
                step="0.05" 
                value={volume} 
                onChange={handleVolumeChange}
                aria-label="Volume" 
              />
            </div>

            <button className="control-btn" onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
              ⛶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
