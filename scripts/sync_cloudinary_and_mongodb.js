const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const CLOUD_NAME = 'dzcss22tm';
const API_KEY = '861726572422394';
const API_SECRET = 'cer9RzDFXFIw_OT0JWHxkTOTpNc';
const MONGODB_URI = 'mongodb+srv://reddymca16082003_db_user:g9tabKeMqhlXAvJX@cluster0.tug0d5t.mongodb.net/Ammai_website?retryWrites=true&w=majority';
const DB_NAME = 'Ammai_website';

function generateSignature(params) {
  const sortedKeys = Object.keys(params).sort();
  const strToSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + API_SECRET;
  return crypto.createHash('sha1').update(strToSign).digest('hex');
}

async function uploadToCloudinary(filePath, resourceType = 'image', folder = 'ammai_cinema') {
  if (!fs.existsSync(filePath)) {
    console.warn(`File does not exist: ${filePath}`);
    return null;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    folder: folder,
    timestamp: timestamp
  };
  const signature = generateSignature(params);

  const fileData = fs.readFileSync(filePath);
  const blob = new Blob([fileData]);

  const formData = new FormData();
  formData.append('file', blob, path.basename(filePath));
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) {
      console.log(`✓ Uploaded ${path.basename(filePath)} -> ${data.secure_url}`);
      return {
        url: data.secure_url,
        public_id: data.public_id,
        format: data.format,
        bytes: data.bytes,
        resource_type: data.resource_type,
        width: data.width,
        height: data.height,
        duration: data.duration
      };
    } else {
      console.error(`✗ Error uploading ${filePath}:`, data);
      return null;
    }
  } catch (err) {
    console.error(`✗ Exception uploading ${filePath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('--- Connecting to MongoDB Atlas ---');
  const mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db(DB_NAME);
  console.log(`Connected to MongoDB Atlas: ${DB_NAME}`);

  // Load existing manifest if available
  const manifestPath = path.resolve(__dirname, 'cloudinary_manifest.json');
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      console.warn('Could not read existing manifest:', e.message);
    }
  }

  const publicDir = path.resolve(__dirname, '../frontend/public');

  // List of all media files to ensure are in Cloudinary & MongoDB
  const mediaItems = [
    { key: '300ppi/1.png', file: '300ppi/1.png', type: 'image', folder: 'ammai_cinema', category: 'poster', title: 'AMMAI Theatrical Poster' },
    { key: '300ppi/2.png', file: '300ppi/2.png', type: 'image', folder: 'ammai_cinema', category: 'poster', title: 'Sanctuary at Dohnavur Poster' },
    { key: '300ppi/3.png', file: '300ppi/3.png', type: 'image', folder: 'ammai_cinema', category: 'poster', title: 'Defying Conventions Poster' },
    { key: '300ppi/Teasee.png', file: '300ppi/Teasee.png', type: 'image', folder: 'ammai_cinema', category: 'backdrop', title: 'Main Teaser Backdrop' },
    { key: 'videos/teaser1.mp4', file: 'videos/teaser1.mp4', type: 'video', folder: 'ammai_cinema_trailers', category: 'teaser', title: 'Official Teaser Trailer 1' },
    { key: 'videos/teaser2.mp4', file: 'videos/teaser2.mp4', type: 'video', folder: 'ammai_cinema_trailers', category: 'teaser', title: 'Official Teaser Trailer 2' },
    { key: 'Dhonavur/MG_8691.jpg', file: 'Dhonavur/MG_8691.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Dohnavur Architecture MG_8691' },
    { key: 'Dhonavur/kids-enjoying-their-yo-yos.jpg', file: 'Dhonavur/kids-enjoying-their-yo-yos.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Children at Dohnavur Fellowship' },
    { key: 'Dhonavur/Dental1-1024x636.jpg', file: 'Dhonavur/Dental1-1024x636.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Dohnavur Hospital & Dental Care' },
    { key: 'Dhonavur/Team-Leaders.jpg', file: 'Dhonavur/Team-Leaders.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Dohnavur Leadership Team' },
    { key: 'Dhonavur/causes2_1_1.jpg', file: 'Dhonavur/causes2_1_1.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Preservation & Heritage' },
    { key: 'Dhonavur/sc1.jpg', file: 'Dhonavur/sc1.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Amy Carmichael Historical Photo' },
    { key: 'Dhonavur/ag-cover-e1520491259627.jpg', file: 'Dhonavur/ag-cover-e1520491259627.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Sanctuary Grounds Cover' },
    { key: 'Dhonavur/IMG_20171122_172720-1024x599.jpg', file: 'Dhonavur/IMG_20171122_172720-1024x599.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Dohnavur Fellowship Nature' },
    { key: 'Dhonavur/IMG_20171122_082251_02-1024x580.jpg', file: 'Dhonavur/IMG_20171122_082251_02-1024x580.jpg', type: 'image', folder: 'ammai_cinema/dohnavur', category: 'gallery', title: 'Dohnavur Morning Grounds' },
    { key: 'Dhonavur/300ppi/Ifilms.png', file: 'Dhonavur/300ppi/Ifilms.png', type: 'image', folder: 'ammai_cinema/brand', category: 'brand', title: 'I Films Logo' },
    { key: 'antony.png', file: 'antony.png', type: 'image', folder: 'ammai_cinema/team', category: 'team', title: 'Antony - Creative Production' },
    { key: 'karthik.png', file: 'karthik.png', type: 'image', folder: 'ammai_cinema/team', category: 'team', title: 'Karthik - Cinematography & Visuals' },
    { key: 'ravi.webp', file: 'ravi.webp', type: 'image', folder: 'ammai_cinema/team', category: 'team', title: 'Ravi - Art & Historical Research' },
    { key: 'venkat.png', file: 'venkat.png', type: 'image', folder: 'ammai_cinema/team', category: 'team', title: 'Venkat - Production Logistics' }
  ];

  console.log('\n--- Syncing Media Assets with Cloudinary & MongoDB Atlas ---');
  const mediaCollection = db.collection('media_assets');
  await mediaCollection.createIndex({ key: 1 }, { unique: true });
  await mediaCollection.createIndex({ category: 1 });

  for (const item of mediaItems) {
    let cloudUrl = manifest[item.key];
    let uploadDetails = null;

    if (!cloudUrl) {
      const fullPath = path.join(publicDir, item.file);
      console.log(`Uploading ${item.key} to Cloudinary...`);
      uploadDetails = await uploadToCloudinary(fullPath, item.type, item.folder);
      if (uploadDetails) {
        cloudUrl = uploadDetails.url;
        manifest[item.key] = cloudUrl;
      }
    }

    if (cloudUrl) {
      const doc = {
        key: item.key,
        title: item.title,
        category: item.category,
        resource_type: item.type,
        cloudinary_url: cloudUrl,
        public_id: uploadDetails?.public_id || (cloudUrl.split('/upload/')[1] ? cloudUrl.split('/upload/')[1].replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '') : null),
        format: uploadDetails?.format || path.extname(item.file).replace('.', ''),
        bytes: uploadDetails?.bytes || null,
        duration: uploadDetails?.duration || null,
        updated_at: new Date()
      };

      await mediaCollection.updateOne(
        { key: item.key },
        { $set: doc, $setOnInsert: { created_at: new Date() } },
        { upsert: true }
      );
      console.log(`✓ Media record saved in MongoDB Atlas: [${item.key}] -> ${cloudUrl}`);
    }
  }

  // Write updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Updated manifest saved to: ${manifestPath}`);

  // Seed Movies Collection in MongoDB Atlas
  console.log('\n--- Seeding Movies Collection in MongoDB Atlas ---');
  const moviesCollection = db.collection('movies');
  await moviesCollection.createIndex({ slug: 1 }, { unique: true });
  await moviesCollection.createIndex({ status: 1 });

  const movies = [
    {
      slug: "ammai-the-mystic-knightess",
      title: "AMMAI: The Mystic Knightess",
      tagline: "The Untold Story of Amy Carmichael",
      description: "An extraordinary cinematic portrait chronicling the courageous life of Amy Carmichael—a fierce mystic who defied colonial norms, battled temple servitude, and founded the enduring sanctuary of The Dohnavur Fellowship.",
      genre: ["Biography", "Historical", "Drama"],
      language: "Tamil / English",
      duration: 142,
      release_date: "2026-11-20",
      status: "coming_soon",
      rating: 9.4,
      rating_count: 84,
      poster_url: manifest["300ppi/1.png"],
      backdrop_url: manifest["300ppi/Teasee.png"],
      trailer_url: manifest["videos/teaser1.mp4"],
      director: "Anandan Sundararajan",
      cast: ["Amy Carmichael Ensemble", "Dohnavur Children Choir", "Historical Cast"],
      featured: true,
      created_at: new Date("2026-09-01T00:00:00Z"),
      updated_at: new Date()
    },
    {
      slug: "the-sanctuary-dohnavur",
      title: "The Sanctuary at Dohnavur",
      tagline: "A Century of Compassion and Healing",
      description: "An evocative documentary exploring the sacred grounds at the foothills of the Western Ghats where thousands of endangered lives were given education, love, and healthcare.",
      genre: ["Documentary", "History"],
      language: "Tamil",
      duration: 88,
      release_date: "2026-08-15",
      status: "now_showing",
      rating: 9.1,
      rating_count: 42,
      poster_url: manifest["300ppi/2.png"],
      backdrop_url: manifest["Dhonavur/MG_8691.jpg"],
      trailer_url: manifest["videos/teaser2.mp4"],
      director: "Anandan Sundararajan",
      cast: ["Fellowship Leaders", "Community Elders"],
      featured: true,
      created_at: new Date("2026-09-01T00:00:00Z"),
      updated_at: new Date()
    },
    {
      slug: "defying-conventions",
      title: "Defying Conventions",
      tagline: "The Rescue Mission",
      description: "A dramatic visual study into Amy's journey to break down social taboos and confront the oppressive practices of temple enslavement in 1900s South India.",
      genre: ["Drama", "Action", "Biography"],
      language: "English / Tamil",
      duration: 110,
      release_date: "2026-12-25",
      status: "coming_soon",
      rating: 8.8,
      rating_count: 29,
      poster_url: manifest["300ppi/3.png"],
      backdrop_url: manifest["Dhonavur/ag-cover-e1520491259627.jpg"],
      trailer_url: manifest["videos/teaser1.mp4"],
      director: "Anandan Sundararajan",
      cast: ["Wordint Players"],
      featured: true,
      created_at: new Date("2026-09-01T00:00:00Z"),
      updated_at: new Date()
    }
  ];

  for (const movie of movies) {
    await moviesCollection.updateOne(
      { slug: movie.slug },
      { $set: movie },
      { upsert: true }
    );
    console.log(`✓ Movie saved to MongoDB Atlas: ${movie.title}`);
  }

  // Seed Admin & Users in MongoDB Atlas
  console.log('\n--- Seeding Users Collection in MongoDB Atlas ---');
  const usersCollection = db.collection('users');
  await usersCollection.updateOne(
    { email: "admin@ammai.in" },
    {
      $set: {
        email: "admin@ammai.in",
        full_name: "Ammai Administrator",
        role: "admin",
        password: "Admin@1234",
        updated_at: new Date()
      },
      $setOnInsert: { created_at: new Date() }
    },
    { upsert: true }
  );
  console.log('✓ Admin user verified in MongoDB Atlas: admin@ammai.in');

  await usersCollection.updateOne(
    { email: "audience@ammai.in" },
    {
      $set: {
        email: "audience@ammai.in",
        full_name: "Cinema Audience Member",
        role: "user",
        password: "User@1234",
        updated_at: new Date()
      },
      $setOnInsert: { created_at: new Date() }
    },
    { upsert: true }
  );
  console.log('✓ User verified in MongoDB Atlas: audience@ammai.in');

  // Seed Reviews Collection in MongoDB Atlas
  console.log('\n--- Seeding Reviews Collection in MongoDB Atlas ---');
  const reviewsCollection = db.collection('reviews');
  const sampleReviews = [
    {
      movie_id: "ammai-the-mystic-knightess",
      user_name: "Dr. Samuel K.",
      rating: 10,
      comment: "A magnificent, emotionally overwhelming cinematic tribute to Amy Carmichael and her enduring legacy at Dohnavur.",
      created_at: new Date("2026-09-20T10:00:00Z")
    },
    {
      movie_id: "ammai-the-mystic-knightess",
      user_name: "Priya Sundaram",
      rating: 9,
      comment: "The archival preservation and film cinematography are breathtaking. A must-watch masterpiece.",
      created_at: new Date("2026-09-22T14:30:00Z")
    }
  ];
  for (const rev of sampleReviews) {
    await reviewsCollection.updateOne(
      { movie_id: rev.movie_id, user_name: rev.user_name },
      { $set: rev },
      { upsert: true }
    );
  }
  console.log('✓ Reviews verified in MongoDB Atlas');

  console.log('\n=== ALL ASSETS & DATA PERSISTED IN CLOUDINARY & MONGODB ATLAS ===');
  await mongoClient.close();
}

run().catch(err => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
