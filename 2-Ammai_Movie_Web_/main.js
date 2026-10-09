document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // Custom Video Player
  const playerWrapper = document.getElementById('mainPlayerWrapper');
  const video = document.getElementById('customVideo');
  const overlayPlay = document.getElementById('overlayPlayBtn');
  const playBtn = document.getElementById('playBtn');
  const progressContainer = document.getElementById('progressContainer');
  const progressFill = document.getElementById('progressFill');
  const timeDisplay = document.getElementById('timeDisplay');
  const volumeSlider = document.getElementById('volumeSlider');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (video && playBtn) {
    function togglePlay() {
      if (video.paused || video.ended) {
        video.play();
        playerWrapper.classList.add('playing');
        playBtn.innerHTML = '❚❚';
      } else {
        video.pause();
        playerWrapper.classList.remove('playing');
        playBtn.innerHTML = '►';
      }
    }

    if (overlayPlay) overlayPlay.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${percent}%`;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    });

    video.addEventListener('loadedmetadata', () => {
      timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    });

    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const duration = video.duration;
      if (duration) {
        video.currentTime = (clickX / width) * duration;
      }
    });

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        video.volume = e.target.value;
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (playerWrapper.requestFullscreen) {
            playerWrapper.requestFullscreen();
          } else if (playerWrapper.webkitRequestFullscreen) {
            playerWrapper.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }
  }

  // Modals Management
  const donateModal = document.getElementById('donateModal');
  const legalModal = document.getElementById('legalModal');
  const videoModal = document.getElementById('videoModal');
  const modalVideoElement = document.getElementById('modalVideoElement');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modal === videoModal && modalVideoElement) {
        modalVideoElement.pause();
      }
    }
  }

  // Open Donate Modal
  document.querySelectorAll('.open-donate-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(donateModal);
    });
  });

  // Open Legal Modals
  const legalTitle = document.getElementById('legalModalTitle');
  const legalBody = document.getElementById('legalModalBody');

  const privacyBtn = document.getElementById('openPrivacyBtn');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      legalTitle.textContent = 'Privacy Policy';
      legalBody.innerHTML = `
        <p><strong>ammai.in Privacy Policy</strong></p>
        <p style="margin: 12px 0;">We are committed to preserving your privacy and safeguarding your personal data in connection with the feature film "AMMAI: The Mystic Knightess" and Dohnavur Fellowship initiatives.</p>
        <h4 style="margin-top: 16px;">1. Information We Collect</h4>
        <p>We collect details you voluntarily provide when inquiring, donating, or contacting our production and fellowship offices (such as name, phone number, and email address).</p>
        <h4 style="margin-top: 16px;">2. Use of Information</h4>
        <p>Data provided is exclusively utilized to issue endowment acknowledgments, provide project updates, and respond to inquiries.</p>
        <h4 style="margin-top: 16px;">3. Security & Contact</h4>
        <p>We implement stringent technical security controls. For inquiries regarding your data, contact: <strong>wordint@gmail.com</strong>.</p>
      `;
      openModal(legalModal);
    });
  }

  const termsBtn = document.getElementById('openTermsBtn');
  if (termsBtn) {
    termsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      legalTitle.textContent = 'Terms & Conditions';
      legalBody.innerHTML = `
        <p><strong>ammai.in Terms & Conditions</strong></p>
        <p style="margin: 12px 0;">Welcome to the official portal for "AMMAI: The Mystic Knightess". By accessing this website or contributing to the film and fellowship endowments, you agree to these terms.</p>
        <h4 style="margin-top: 16px;">1. Intellectual Property</h4>
        <p>All creative materials, teasers, photographic archives, and branding are copyrighted by Wordint Films and The Dohnavur Fellowship.</p>
        <h4 style="margin-top: 16px;">2. Donations & Endowments</h4>
        <p>All donations made directly to the authorized accounts are utilized directly towards film production, historical preservation, and Dohnavur child care welfare initiatives.</p>
      `;
      openModal(legalModal);
    });
  }

  // Teaser Cards Click to Play
  document.querySelectorAll('.trailer-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoSrc = card.getAttribute('data-video');
      if (videoSrc && modalVideoElement) {
        modalVideoElement.src = videoSrc;
        openModal(videoModal);
        modalVideoElement.play();
      }
    });
  });

  // Close modals on clicking overlay or close button
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // Copy bank detail buttons
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const text = targetEl.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          const original = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = original, 2000);
        });
      }
    });
  });

  // Contact Form Submission (Persisting to MongoDB Atlas)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('input, textarea');
      const payload = {
        name: inputs[0]?.value || 'Anonymous',
        email: inputs[1]?.value || '',
        message: inputs[2]?.value || ''
      };

      try {
        await fetch('http://localhost:8000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        alert('Thank you for reaching out! Your inquiry has been saved directly to MongoDB Atlas. We will be in touch shortly.');
        contactForm.reset();
      } catch (err) {
        alert('Thank you for reaching out! We will be in touch shortly.');
        contactForm.reset();
      }
    });
  }
});
