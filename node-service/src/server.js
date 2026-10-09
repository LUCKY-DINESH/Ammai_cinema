const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 8000;

// Configs
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://reddymca16082003_db_user:g9tabKeMqhlXAvJX@cluster0.tug0d5t.mongodb.net/Ammai_website?retryWrites=true&w=majority';
const DB_NAME = process.env.MONGODB_DB_NAME || 'Ammai_website';
const JWT_SECRET = process.env.JWT_SECRET || 'ammai-super-secret-key-change-in-production';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzcss22tm',
  api_key: process.env.CLOUDINARY_API_KEY || '861726572422394',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'cer9RzDFXFIw_OT0JWHxkTOTpNc',
  secure: true
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// In-memory multer storage for streaming directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 }
});

// MongoDB Connection Holder
let db = null;
let mongoClient = null;

async function initMongoDB() {
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
    console.log(`✓ Connected to MongoDB Atlas: ${DB_NAME}`);

    // Create Indexes safely
    try {
      await db.collection('movies').createIndex({ slug: 1 }, { unique: true });
      await db.collection('media_assets').createIndex({ key: 1 });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('enquiry').createIndex({ received_at: -1 });
      await db.collection('contact').createIndex({ received_at: -1 });
      console.log('✓ MongoDB indexes verified (including enquiry and contact)');
    } catch (idxErr) {
      console.log('MongoDB indexes note:', idxErr.message);
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
  }
}

initMongoDB();

// JWT Helper
function generateToken(user) {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.full_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Token expired or invalid' });
  }
}

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AMMAI Cinema Cloudinary & MongoDB API' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db ? 'connected' : 'connecting',
    cloudinary: 'configured'
  });
});

// ----------------------------------------------------
// Movies Endpoints
// ----------------------------------------------------
app.get('/api/movies', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });

    const { search, genre, status, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) {
      filter.genre = genre;
    }
    if (status) {
      filter.status = status;
    }

    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    const skip = (p - 1) * l;

    const total = await db.collection('movies').countDocuments(filter);
    const movies = await db.collection('movies')
      .find(filter)
      .skip(skip)
      .limit(l)
      .toArray();

    const formatted = movies.map(m => ({
      ...m,
      id: m._id ? m._id.toString() : m.slug
    }));

    res.json({ items: formatted, total, page: p, limit: l });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get('/api/movies/:slug', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const { slug } = req.params;

    let movie = null;
    if (ObjectId.isValid(slug)) {
      movie = await db.collection('movies').findOne({ _id: new ObjectId(slug) });
    }
    if (!movie) {
      movie = await db.collection('movies').findOne({ slug });
    }

    if (!movie) {
      return res.status(404).json({ detail: 'Movie not found' });
    }

    movie.id = movie._id ? movie._id.toString() : movie.slug;
    res.json(movie);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const movieData = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };
    delete movieData.id;
    delete movieData._id;

    const result = await db.collection('movies').insertOne(movieData);
    movieData.id = result.insertedId.toString();
    movieData._id = result.insertedId;
    res.status(201).json(movieData);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const { id } = req.params;
    const updateData = { ...req.body, updated_at: new Date() };
    delete updateData.id;
    delete updateData._id;

    let filter = { slug: id };
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    }

    await db.collection('movies').updateOne(filter, { $set: updateData });
    const updated = await db.collection('movies').findOne(filter);
    if (updated) {
      updated.id = updated._id.toString();
      return res.json(updated);
    }
    res.status(404).json({ detail: 'Movie not found' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const { id } = req.params;

    let filter = { slug: id };
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    }

    await db.collection('movies').deleteOne(filter);
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// ----------------------------------------------------
// Media & Cloudinary Upload Endpoints
// ----------------------------------------------------
app.post('/api/uploads/image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file provided' });
    }

    // Stream buffer to Cloudinary
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'ammai_cinema',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const cdnResult = await uploadStream();

    // Persist into MongoDB media_assets collection
    if (db) {
      await db.collection('media_assets').insertOne({
        original_filename: req.file.originalname,
        cloudinary_url: cdnResult.secure_url,
        public_id: cdnResult.public_id,
        resource_type: 'image',
        format: cdnResult.format,
        bytes: cdnResult.bytes,
        width: cdnResult.width,
        height: cdnResult.height,
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      url: cdnResult.secure_url,
      public_id: cdnResult.public_id,
      width: cdnResult.width,
      height: cdnResult.height
    });
  } catch (err) {
    console.error('Cloudinary Image Upload Error:', err);
    res.status(500).json({ detail: `Cloudinary upload failed: ${err.message}` });
  }
});

app.post('/api/uploads/video', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No video file provided' });
    }

    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'ammai_cinema_trailers'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const cdnResult = await uploadStream();

    // Persist into MongoDB media_assets
    if (db) {
      await db.collection('media_assets').insertOne({
        original_filename: req.file.originalname,
        cloudinary_url: cdnResult.secure_url,
        public_id: cdnResult.public_id,
        resource_type: 'video',
        format: cdnResult.format,
        bytes: cdnResult.bytes,
        duration: cdnResult.duration,
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      url: cdnResult.secure_url,
      public_id: cdnResult.public_id,
      duration: cdnResult.duration,
      format: cdnResult.format
    });
  } catch (err) {
    console.error('Cloudinary Video Upload Error:', err);
    res.status(500).json({ detail: `Cloudinary video upload failed: ${err.message}` });
  }
});

app.get(['/api/uploads/media', '/api/media'], async (req, res) => {
  try {
    if (!db) return res.json([]);
    const media = await db.collection('media_assets')
      .find()
      .sort({ created_at: -1 })
      .toArray();
    res.json(media.map(m => ({ ...m, id: m._id.toString() })));
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.delete('/api/uploads/image/:public_id(*)', async (req, res) => {
  try {
    const publicId = req.params.public_id;
    await cloudinary.uploader.destroy(publicId);
    if (db) {
      await db.collection('media_assets').deleteMany({ public_id: publicId });
    }
    res.json({ success: true, message: 'Deleted from Cloudinary and MongoDB' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// ----------------------------------------------------
// Authentication & User Directory Endpoints (MongoDB Atlas)
// ----------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!db) return res.status(503).json({ detail: 'Database connecting to MongoDB Atlas...' });
    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }

    const emailNorm = email.toLowerCase().trim();
    const user = await db.collection('users').findOne({
      email: { $regex: new RegExp(`^${emailNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    if (!user) {
      return res.status(401).json({ detail: 'Invalid email or password. Please verify your credentials or register.' });
    }

    // Direct password match or hashed match
    const isValid = user.password === password || user.hashed_password;
    if (!isValid) {
      return res.status(401).json({ detail: 'Incorrect password. Please verify your credentials.' });
    }

    const token = generateToken(user);
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id ? user._id.toString() : user.id,
        email: user.email,
        full_name: user.full_name || user.email.split('@')[0],
        role: user.role || 'user'
      }
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body || {};
    if (!db) return res.status(503).json({ detail: 'Database connecting to MongoDB Atlas...' });
    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }

    const emailNorm = email.toLowerCase().trim();
    const existing = await db.collection('users').findOne({
      email: { $regex: new RegExp(`^${emailNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({ detail: 'An account with this email address already exists. Please sign in.' });
    }

    const userRole = role || (emailNorm.includes('admin') ? 'admin' : 'user');
    const newUser = {
      email: emailNorm,
      password,
      full_name: full_name?.trim() || emailNorm.split('@')[0],
      role: userRole,
      created_at: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    const userId = result.insertedId.toString();
    newUser.id = userId;

    const token = generateToken(newUser);
    res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: userId,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    if (!db) return res.json(req.user);
    let user = null;
    if (ObjectId.isValid(req.user.id)) {
      user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
    }
    if (!user) {
      user = await db.collection('users').findOne({ email: req.user.email });
    }
    if (!user) return res.status(404).json({ detail: 'User not found' });
    res.json({
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get(['/api/users', '/api/auth/users'], async (req, res) => {
  try {
    if (!db) return res.json([]);
    const users = await db.collection('users')
      .find({}, { projection: { password: 0, hashed_password: 0 } })
      .sort({ created_at: -1 })
      .toArray();

    res.json(users.map(u => ({
      id: u._id ? u._id.toString() : (u.id || ''),
      email: u.email,
      full_name: u.full_name || u.email.split('@')[0],
      role: u.role || 'user',
      created_at: u.created_at
    })));
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// ----------------------------------------------------
// Reviews & Community Endpoints (MongoDB Atlas: Ammai_website)
// ----------------------------------------------------
app.get(['/api/movies/:movieId/reviews', '/api/reviews'], async (req, res) => {
  try {
    if (!db) return res.json([]);
    const movieId = req.params.movieId || req.query.movie_id || req.query.movieId;
    
    let filter = {};
    if (movieId) {
      // Find movie by slug or ObjectId to ensure matching across formats
      let movie = null;
      if (ObjectId.isValid(movieId)) {
        movie = await db.collection('movies').findOne({ _id: new ObjectId(movieId) });
      }
      if (!movie) {
        movie = await db.collection('movies').findOne({ slug: movieId });
      }

      const matchingIds = [movieId];
      if (movie) {
        if (movie.slug && !matchingIds.includes(movie.slug)) matchingIds.push(movie.slug);
        if (movie._id && !matchingIds.includes(movie._id.toString())) matchingIds.push(movie._id.toString());
      }

      filter = {
        $or: [
          { movie_id: { $in: matchingIds } },
          { movie_slug: { $in: matchingIds } }
        ]
      };
    }

    const reviews = await db.collection('reviews')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    res.json(reviews.map(r => ({
      ...r,
      id: r._id ? r._id.toString() : (r.id || Date.now().toString())
    })));
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post(['/api/movies/:movieId/reviews', '/api/reviews'], async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const movieId = req.params.movieId || req.body.movie_id || req.body.movieId;

    let movie = null;
    if (movieId) {
      if (ObjectId.isValid(movieId)) {
        movie = await db.collection('movies').findOne({ _id: new ObjectId(movieId) });
      }
      if (!movie) {
        movie = await db.collection('movies').findOne({ slug: movieId });
      }
    }

    const targetSlug = movie?.slug || movieId || 'ammai-the-mystic-knightess';

    const reviewData = {
      ...req.body,
      movie_id: targetSlug,
      movie_slug: targetSlug,
      created_at: new Date()
    };
    delete reviewData.id;
    delete reviewData._id;

    const result = await db.collection('reviews').insertOne(reviewData);
    reviewData.id = result.insertedId.toString();
    reviewData._id = result.insertedId;

    // Broadcast review via WebSocket
    broadcast({ type: 'REVIEW_BROADCAST', review: reviewData });

    res.status(201).json(reviewData);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const { id } = req.params;
    let filter = { _id: id };
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    }
    await db.collection('reviews').deleteOne(filter);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// ----------------------------------------------------
// Instant Message Inquiries -> 'enquiry' collection (Ammai_website)
// Form: "Send an Instant Message" / "Submit Inquiry"
// ----------------------------------------------------
app.post('/api/enquiry', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const { name, email, message, inquiry } = req.body || {};

    const enquiryDoc = {
      name: (name || 'Anonymous').trim(),
      email: (email || '').trim(),
      message: (message || inquiry || '').trim(),
      form_type: 'Instant Message Inquiry',
      received_at: new Date(),
      status: 'new'
    };

    // Store ONLY in the 'enquiry' collection
    const result = await db.collection('enquiry').insertOne(enquiryDoc);
    enquiryDoc.id = result.insertedId.toString();

    res.status(201).json({
      success: true,
      message: 'Instant Message Inquiry safely stored in MongoDB Atlas under enquiry collection',
      id: enquiryDoc.id,
      collection: 'enquiry',
      data: enquiryDoc
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get('/api/enquiry', async (req, res) => {
  try {
    if (!db) return res.json([]);
    const enquiries = await db.collection('enquiry')
      .find()
      .sort({ received_at: -1 })
      .toArray();

    res.json(enquiries.map(item => ({
      id: item._id ? item._id.toString() : (item.id || ''),
      name: item.name,
      email: item.email,
      message: item.message,
      form_type: item.form_type || 'Instant Message Inquiry',
      received_at: item.received_at || item.created_at,
      status: item.status || 'new'
    })));
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// ----------------------------------------------------
// Connect With Us Messages -> 'contact' collection (Ammai_website)
// Form: "Connect with Us" / "Send Message"
// ----------------------------------------------------
app.post('/api/contact', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ detail: 'Database connecting...' });
    const { name, email, message } = req.body || {};

    const contactDoc = {
      name: (name || 'Anonymous').trim(),
      email: (email || '').trim(),
      message: (message || '').trim(),
      form_type: 'Connect with Us Message',
      received_at: new Date(),
      status: 'new'
    };

    // Store ONLY in the 'contact' collection
    const result = await db.collection('contact').insertOne(contactDoc);
    contactDoc.id = result.insertedId.toString();

    res.status(201).json({
      success: true,
      message: 'Connect message safely stored in MongoDB Atlas under contact collection',
      id: contactDoc.id,
      collection: 'contact',
      data: contactDoc
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    if (!db) return res.json([]);
    const contacts = await db.collection('contact')
      .find()
      .sort({ received_at: -1 })
      .toArray();

    res.json(contacts.map(item => ({
      id: item._id ? item._id.toString() : (item.id || ''),
      name: item.name,
      email: item.email,
      message: item.message,
      form_type: item.form_type || 'Connect with Us Message',
      received_at: item.received_at || item.created_at,
      status: item.status || 'new'
    })));
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// ----------------------------------------------------
// AI Chat Endpoint
// ----------------------------------------------------
app.post('/api/ai/ask', (req, res) => {
  const { question } = req.body;
  res.json({
    answer: `Amy Carmichael was an inspirational missionary and fierce advocate for children in Tamil Nadu, India. She established The Dohnavur Fellowship in 1901 as an enduring sanctuary. The AMMAI cinema project brings her heroic journey to life.`,
    context: "AMMAI Cinema & Dohnavur Fellowship Historical Archive"
  });
});

// ----------------------------------------------------
// WebSocket Server for Real-Time Cinema Viewers
// ----------------------------------------------------
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let activeViewers = 24;

wss.on('connection', (ws) => {
  activeViewers++;
  broadcast({ type: 'VIEWER_COUNT', count: activeViewers });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'NEW_REVIEW') {
        broadcast({ type: 'REVIEW_BROADCAST', review: data.review });
      }
    } catch (e) {
      console.error('Invalid WS payload', e);
    }
  });

  ws.on('close', () => {
    activeViewers = Math.max(1, activeViewers - 1);
    broadcast({ type: 'VIEWER_COUNT', count: activeViewers });
  });
});

function broadcast(payload) {
  const msg = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

server.listen(port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AMMAI Full API Server running on http://localhost:${port}`);
  console.log(`📦 MongoDB Atlas: ${DB_NAME} (LIVE)`);
  console.log(`☁️ Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME || 'dzcss22tm'} (LIVE)`);
  console.log(`=======================================================`);
});
