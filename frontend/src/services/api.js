import CLOUDINARY_MEDIA from '../utils/media';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api');

// Helper for authorized requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Token expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.detail || data?.message || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API call to ${endpoint} failed or offline:`, err.message);
    throw err;
  }
}

// Default seed movies referencing live Cloudinary media and MongoDB Atlas
export const DEFAULT_MOVIES = [
  {
    id: "ammai-the-mystic-knightess",
    slug: "ammai-the-mystic-knightess",
    title: "AMMAI: The Mystic Knightess",
    tagline: "The Untold Story of Amy Carmichael",
    description: "An extraordinary cinematic portrait chronicling the courageous life of Amy Carmichael—a fierce mystic who defied colonial norms, battled temple servitude, and founded the enduring sanctuary of The Dohnavur Fellowship.",
    genre: ["Biography", "Historical", "Drama"],
    language: "Tamil / English",
    release_date: "2026-11-20",
    status: "coming_soon",
    rating: 9.4,
    rating_count: 84,
    poster_url: CLOUDINARY_MEDIA.posterAmmai,
    backdrop_url: CLOUDINARY_MEDIA.backdropTeasee,
    trailer_url: CLOUDINARY_MEDIA.trailer1,
    director: "Anandan Sundararajan",
    cast: ["Amy Carmichael Ensemble", "Dohnavur Children Choir", "Historical Cast"],
    featured: true,
  },
  {
    id: "the-sanctuary-dohnavur",
    slug: "the-sanctuary-dohnavur",
    title: "The Sanctuary at Dohnavur",
    tagline: "A Century of Compassion and Healing",
    description: "An evocative documentary exploring the sacred grounds at the foothills of the Western Ghats where thousands of endangered lives were given education, love, and healthcare.",
    genre: ["Documentary", "History"],
    language: "Tamil",
    release_date: "2026-08-15",
    status: "now_showing",
    rating: 9.1,
    rating_count: 42,
    poster_url: CLOUDINARY_MEDIA.posterSanctuary,
    backdrop_url: CLOUDINARY_MEDIA.dohnavurArch,
    trailer_url: CLOUDINARY_MEDIA.trailer2,
    director: "Anandan Sundararajan",
    cast: ["Fellowship Leaders", "Community Elders"],
    featured: true,
  },
  {
    id: "defying-conventions",
    slug: "defying-conventions",
    title: "Defying Conventions",
    tagline: "The Rescue Mission",
    description: "A dramatic visual study into Amy's journey to break down social taboos and confront the oppressive practices of temple enslavement in 1900s South India.",
    genre: ["Drama", "Action", "Biography"],
    language: "English / Tamil",
    release_date: "2026-12-25",
    status: "coming_soon",
    rating: 8.8,
    rating_count: 29,
    poster_url: CLOUDINARY_MEDIA.posterDefying,
    backdrop_url: CLOUDINARY_MEDIA.backdropSanctuaryGrounds,
    trailer_url: CLOUDINARY_MEDIA.trailer1,
    director: "Anandan Sundararajan",
    cast: ["Wordint Players"],
    featured: true,
  }
];

export const authService = {
  login: async (credentials) => {
    const payload = {
      email: (credentials.email || '').toLowerCase().trim(),
      password: credentials.password || ''
    };
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data?.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    throw new Error('Authentication failed: No access token received.');
  },

  register: async (userData) => {
    const payload = {
      email: (userData.email || '').toLowerCase().trim(),
      password: userData.password,
      full_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Member'),
      role: userData.role || ((userData.email || '').toLowerCase().includes('admin') ? 'admin' : 'user')
    };

    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Account successfully registered in MongoDB Atlas! You can now sign in.',
      user: res.user || res,
      access_token: res.access_token
    };
  },

  getCurrentUser: async () => {
    try {
      const user = await request('/auth/me');
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
    } catch {
      // Retain cached active session if token is valid
    }
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },

  getAllUsers: async () => {
    try {
      const data = await request('/users');
      if (Array.isArray(data)) return data;
      if (data?.items && Array.isArray(data.items)) return data.items;
      return [];
    } catch (err) {
      console.warn('Could not fetch user directory from MongoDB Atlas:', err.message);
      return [];
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const movieService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    try {
      const data = await request(`/movies${query ? `?${query}` : ''}`);
      if (data && (Array.isArray(data) || Array.isArray(data.items))) {
        const list = data.items || data;
        return { items: list, total: data.total || list.length, page: data.page || 1, limit: data.limit || 50 };
      }
    } catch (err) {
      console.warn("MongoDB API movies fetch error, using Cloudinary defaults:", err.message);
    }

    let list = [...DEFAULT_MOVIES];
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(m => 
        m.title?.toLowerCase().includes(s) || 
        (Array.isArray(m.genre) ? m.genre.some(g => g.toLowerCase().includes(s)) : m.genre?.toLowerCase().includes(s))
      );
    }
    if (params.status) {
      list = list.filter(m => m.status === params.status);
    }
    if (params.genre) {
      list = list.filter(m => 
        Array.isArray(m.genre) ? m.genre.includes(params.genre) : m.genre?.includes(params.genre)
      );
    }

    return { items: list, total: list.length, page: 1, limit: 50 };
  },

  getBySlug: async (slug) => {
    try {
      const data = await request(`/movies/${slug}`);
      if (data && data.title) return data;
    } catch (err) {
      console.warn(`Movie fetch for ${slug}:`, err.message);
    }
    const found = DEFAULT_MOVIES.find(m => m.slug === slug || m.id === slug);
    if (!found) throw new Error('Movie not found');
    return found;
  },

  create: async (movieData) => {
    return await request('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  },

  update: async (id, movieData) => {
    return await request(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    });
  },

  delete: async (id) => {
    return await request(`/movies/${id}`, {
      method: 'DELETE',
    });
  }
};

export const reviewService = {
  getByMovie: async (movieId) => {
    try {
      const data = await request(`/movies/${movieId}/reviews`);
      if (Array.isArray(data)) return data;
      if (data?.items && Array.isArray(data.items)) return data.items;
      return [];
    } catch {
      try {
        const alt = await request(`/reviews?movie_id=${movieId}`);
        if (Array.isArray(alt)) return alt;
      } catch {}
      return [];
    }
  },

  getAll: async () => {
    try {
      const data = await request('/reviews');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      return [];
    }
  },

  create: async (movieId, reviewData) => {
    const payload = {
      ...reviewData,
      movie_id: movieId,
      movie_slug: movieId,
    };
    try {
      return await request(`/movies/${movieId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return await request('/reviews', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }
  },

  delete: async (id) => {
    return request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }
};

// Instant Message Inquiry Service -> stores in MongoDB 'enquiry' collection
// Form: "Send an Instant Message" / "Submit Inquiry"
export const enquiryService = {
  submit: async (data) => {
    return request('/enquiry', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    try {
      const data = await request('/enquiry');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
};

// Connect With Us Service -> stores in MongoDB 'contact' collection
// Form: "Connect with Us" / "Send Message"
export const contactService = {
  send: async (data) => {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    try {
      const data = await request('/contact');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
};

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/uploads/image`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Image upload to Cloudinary failed');
    }
    return await res.json();
  },

  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/uploads/video`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Video upload to Cloudinary failed');
    }
    return await res.json();
  },

  deleteImage: async (publicId) => {
    return await request(`/uploads/image/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
    });
  }
};

export const mediaService = {
  getAll: async () => {
    try {
      return await request('/media');
    } catch {
      return [];
    }
  }
};


export const aiService = {
  chat: async (messages) => {
    try {
      const data = await request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages })
      });
      return data.reply;
    } catch {
      // Direct Groq API fallback
      const groqKey = "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";
      const systemPrompt = "You are the official AI Film Historian & Cinema Guide for 'AMMAI: The Mystic Knightess' (The Untold Story of Amy Carmichael) and The Dohnavur Fellowship. Provide eloquent, historically accurate, and inspiring information about the film, Amy Carmichael, Dohnavur Fellowship, the director Anandan Sundararajan, production team, and endowments.";
      const payload = {
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 800
      };
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("AI service response error");
      const json = await res.json();
      return json.choices[0].message.content;
    }
  },

  getSuggestions: async () => {
    try {
      const data = await request('/ai/suggestions');
      return data.suggestions;
    } catch {
      return [
        "Who was Amy Carmichael and why is she called 'Ammai'?",
        "What is the story behind 'AMMAI: The Mystic Knightess'?",
        "How does The Dohnavur Fellowship support children today?",
        "Who is on the production team and who directed the film?",
        "How can I contribute to the film and preservation endowments?"
      ];
    }
  }
};

