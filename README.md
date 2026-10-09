# AMMAI: The Mystic Knightess — Cinema Platform

A production-ready full-stack cinema promotional platform and content management system for the feature film **"AMMAI: The Mystic Knightess"** (The Untold Story of Amy Carmichael) and **The Dohnavur Fellowship**.

All visual media (theatrical posters, backdrops, historical photographic archives, portraits) and teaser videos are stored and delivered via **Cloudinary CDN** and cataloged directly in **MongoDB Atlas**. No local storage is used for media or data persistence.

---

## 1. Project Architecture & Cloud Storage

```
.
├── frontend/                     # React.js SPA (Vite + React Router)
│   ├── src/
│   │   ├── utils/media.js        # Centralized Cloudinary CDN media mapping
│   │   ├── components/           # Navbar, Footer, HeroBanner, VideoPlayer, Modals, Cards
│   │   ├── pages/                # Home, WhoIsAmy, Dohnavur, Teasers, Endowments, Cinema, Admin
│   │   ├── services/api.js       # API client connecting to MongoDB Atlas endpoints & Cloudinary
│   │   ├── context/              # AuthContext, ToastContext
│   │   └── index.css             # Cinematic theme with Cloudinary backdrops
│   ├── package.json
│   └── vite.config.js
│
├── node-service/                 # Full REST API & WebSocket Server (Node.js + Express)
│   ├── src/server.js             # Connects directly to MongoDB Atlas and Cloudinary
│   ├── .env                      # Cloudinary & MongoDB Atlas credentials
│   └── package.json
│
├── backend/                      # FastAPI Backend (Python)
│   ├── app/
│   │   ├── core/cloudinary.py    # Cloudinary integration for FastAPI
│   │   ├── database/mongodb.py   # Motor MongoDB async client
│   │   └── routes/               # Movies, uploads (Cloudinary -> MongoDB media_assets)
│   ├── seed_data.py              # Seeds MongoDB Atlas with Cloudinary URLs
│   ├── requirements.txt
│   └── .env
│
├── scripts/
│   ├── sync_cloudinary_and_mongodb.js   # Automated synchronization script
│   └── cloudinary_manifest.json          # Dictionary of live Cloudinary CDN URLs
├── package.json                  # Root proxy scripts (npm run dev, api, sync)
└── README.md
```

---

## 2. Cloudinary & MongoDB Atlas Integration

### Cloudinary Storage:
- **Cloud Name**: `dzcss22tm`
- **Folders**:
  - `ammai_cinema` — Theatrical posters, archive photography, and team portraits.
  - `ammai_cinema_trailers` — Cinematic teaser trailers (MP4 streaming).
  - `ammai_cinema/brand` — Official film and fellowship brand logos.

### MongoDB Atlas Collections (`Ammai_website` database):
- `movies` — Cinema releases with Cloudinary `poster_url`, `backdrop_url`, and `trailer_url`.
- `media_assets` — Complete index of uploaded images/videos with Cloudinary metadata (`secure_url`, `public_id`, `format`, `bytes`, `duration`, etc.).
- `users` — Administrator (`admin@ammai.in`) and audience accounts.
- `reviews` — Audience ratings and comments.
- `enquiry` — Instant message inquiries from Contact page ("Send an Instant Message" / "Submit Inquiry").
- `contact` — Inquiries from the footer contact form ("Connect with Us" / "Send Message").

---

## 3. How to Run the Website

### Step 1: Start the API Server (MongoDB Atlas + Cloudinary)
```powershell
npm.cmd run api
```
Starts the full-stack REST API and WebSocket server on **`http://localhost:8000`** connected directly to MongoDB Atlas and Cloudinary.

### Step 2: Start the Frontend
```powershell
npm.cmd run dev
```
Starts the React development server on **`http://localhost:5173`** (or `http://localhost:5174`).

### Synchronize / Re-seed Cloudinary & MongoDB Atlas
```powershell
npm.cmd run sync
```
Uploads any missing local media assets to Cloudinary and ensures all movie and media records are synced into MongoDB Atlas.

---

## 4. Initial Credentials

- **Admin Login**: `admin@ammai.in` / Password: `Admin@1234`
- **Audience Login**: `audience@ammai.in` / Password: `User@1234`
- **Admin CMS Dashboard**: Accessible at `/admin` after logging in as admin.
