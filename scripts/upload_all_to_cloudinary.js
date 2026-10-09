const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLOUD_NAME = 'dzcss22tm';
const API_KEY = '861726572422394';
const API_SECRET = 'cer9RzDFXFIw_OT0JWHxkTOTpNc';

function generateSignature(params) {
  const sortedKeys = Object.keys(params).sort();
  const strToSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + API_SECRET;
  return crypto.createHash('sha1').update(strToSign).digest('hex');
}

async function uploadFile(filePath, resourceType = 'image', folder = 'ammai_cinema', customPublicId = null) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    folder: folder,
    timestamp: timestamp
  };
  if (customPublicId) {
    params.public_id = customPublicId;
  }

  const signature = generateSignature(params);

  const fileData = fs.readFileSync(filePath);
  const blob = new Blob([fileData]);

  const formData = new FormData();
  formData.append('file', blob, path.basename(filePath));
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  if (customPublicId) formData.append('public_id', customPublicId);
  formData.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) {
      console.log(`✓ Uploaded [${resourceType}] ${path.basename(filePath)} -> ${data.secure_url}`);
      return data.secure_url;
    } else {
      console.error(`✗ Error uploading ${filePath}:`, data);
      return null;
    }
  } catch (err) {
    console.error(`✗ Exception uploading ${filePath}:`, err.message);
    return null;
  }
}

async function uploadRawJson(publicId, jsonData) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    public_id: publicId,
    timestamp: timestamp
  };
  const signature = generateSignature(params);

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const formData = new FormData();
  formData.append('file', blob, `${path.basename(publicId)}.json`);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) {
      console.log(`✓ Stored Database JSON [${publicId}] -> ${data.secure_url}`);
      return data.secure_url;
    } else {
      console.error(`✗ Error storing JSON ${publicId}:`, data);
      return null;
    }
  } catch (err) {
    console.error(`✗ Exception storing JSON ${publicId}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('=== Starting Full Cloudinary Asset & Database Migration ===');

  const publicDir = path.resolve(__dirname, '../frontend/public');
  const uploadedUrls = {};

  // 1. Upload Theatrical Posters & Teasee
  console.log('\n--- Uploading Key Theatrical Visuals ---');
  const posters = ['1.png', '2.png', '3.png', 'Teasee.png'];
  for (const p of posters) {
    const pPath = path.join(publicDir, '300ppi', p);
    const url = await uploadFile(pPath, 'image', 'ammai_cinema');
    if (url) uploadedUrls[`300ppi/${p}`] = url;
  }

  // 2. Upload Video Teasers
  console.log('\n--- Uploading Cinema Videos ---');
  const videos = ['teaser1.mp4', 'teaser2.mp4'];
  for (const v of videos) {
    const vPath = path.join(publicDir, 'videos', v);
    const url = await uploadFile(vPath, 'video', 'ammai_cinema_trailers');
    if (url) uploadedUrls[`videos/${v}`] = url;
  }

  // 3. Upload Dohnavur Historic Images
  console.log('\n--- Uploading Dohnavur Archive Images ---');
  const dhonavurImgs = [
    'MG_8691.jpg',
    'kids-enjoying-their-yo-yos.jpg',
    'Dental1-1024x636.jpg',
    'Team-Leaders.jpg',
    'causes2_1_1.jpg',
    'sc1.jpg',
    'ag-cover-e1520491259627.jpg'
  ];
  for (const d of dhonavurImgs) {
    const dPath = path.join(publicDir, 'Dhonavur', d);
    const url = await uploadFile(dPath, 'image', 'ammai_cinema/dohnavur');
    if (url) uploadedUrls[`Dhonavur/${d}`] = url;
  }

  // 4. Upload Team Portraits
  console.log('\n--- Uploading Creative Team Portraits ---');
  const team = ['antony.png', 'karthik.png', 'ravi.webp', 'venkat.png'];
  for (const t of team) {
    const tPath = path.join(publicDir, t);
    const url = await uploadFile(tPath, 'image', 'ammai_cinema/team');
    if (url) uploadedUrls[t] = url;
  }

  // Save the mapping to a local json manifest
  const manifestPath = path.resolve(__dirname, 'cloudinary_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`\nManifest written to: ${manifestPath}`);

  // 5. Seed Cloudinary Database
  console.log('\n--- Creating Cloudinary Database JSON Collections ---');

  const moviesDb = [
    {
      id: "ammai-the-mystic-knightess",
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
      poster_url: uploadedUrls['300ppi/1.png'] || "/300ppi/1.png",
      backdrop_url: uploadedUrls['300ppi/Teasee.png'] || "/300ppi/Teasee.png",
      trailer_url: uploadedUrls['videos/teaser1.mp4'] || "/videos/teaser1.mp4",
      director: "Anandan Sundararajan",
      cast: ["Amy Carmichael Ensemble", "Dohnavur Children Choir", "Historical Cast"],
      featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: "the-sanctuary-dohnavur",
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
      poster_url: uploadedUrls['300ppi/2.png'] || "/300ppi/2.png",
      backdrop_url: uploadedUrls['Dhonavur/MG_8691.jpg'] || "/Dhonavur/MG_8691.jpg",
      trailer_url: uploadedUrls['videos/teaser2.mp4'] || "/videos/teaser2.mp4",
      director: "Anandan Sundararajan",
      cast: ["Fellowship Leaders", "Community Elders"],
      featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: "defying-conventions",
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
      poster_url: uploadedUrls['300ppi/3.png'] || "/300ppi/3.png",
      backdrop_url: uploadedUrls['Dhonavur/ag-cover-e1520491259627.jpg'] || "/Dhonavur/ag-cover-e1520491259627.jpg",
      trailer_url: uploadedUrls['videos/teaser1.mp4'] || "/videos/teaser1.mp4",
      director: "Anandan Sundararajan",
      cast: ["Wordint Players"],
      featured: true,
      created_at: new Date().toISOString()
    }
  ];

  const usersDb = [
    {
      id: "admin-1",
      email: "admin@ammai.in",
      password: "Admin@1234",
      full_name: "Ammai Administrator",
      role: "admin",
      created_at: "2026-09-01T00:00:00.000Z"
    },
    {
      id: "user-1",
      email: "audience@ammai.in",
      password: "User@1234",
      full_name: "Cinema Audience Member",
      role: "user",
      created_at: "2026-09-15T00:00:00.000Z"
    }
  ];

  const reviewsDb = [
    {
      id: "rev-1",
      movieId: "ammai-the-mystic-knightess",
      user_name: "Dr. Samuel K.",
      rating: 10,
      comment: "A magnificent, emotionally overwhelming cinematic tribute to Amy Carmichael and her enduring legacy at Dohnavur.",
      created_at: "2026-09-20"
    },
    {
      id: "rev-2",
      movieId: "ammai-the-mystic-knightess",
      user_name: "Priya Sundaram",
      rating: 9,
      comment: "The archival preservation and film cinematography are breathtaking. A must-watch masterpiece.",
      created_at: "2026-09-22"
    }
  ];

  const contactsDb = [
    {
      id: 1,
      name: "Grace Murugan",
      email: "grace@example.com",
      message: "Inquiring about school screening permissions for Dohnavur documentary.",
      created_at: "2026-09-28"
    },
    {
      id: 2,
      name: "Pastor David",
      email: "david@church.in",
      message: "Would love to contribute to the child care endowment and host the film teaser.",
      created_at: "2026-09-29"
    }
  ];

  const moviesUrl = await uploadRawJson('ammai_cinema_data/movies_db', moviesDb);
  const usersUrl = await uploadRawJson('ammai_cinema_data/users_db', usersDb);
  const reviewsUrl = await uploadRawJson('ammai_cinema_data/reviews_db', reviewsDb);
  const contactsUrl = await uploadRawJson('ammai_cinema_data/contacts_db', contactsDb);

  console.log('\n=== MIGRATION COMPLETE! ===');
  console.log('Movies DB URL:   ', moviesUrl);
  console.log('Users DB URL:    ', usersUrl);
  console.log('Reviews DB URL:  ', reviewsUrl);
  console.log('Contacts DB URL: ', contactsUrl);
}

main().catch(console.error);
