import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DonationModal from './components/DonationModal';
import TrailerModal from './components/TrailerModal';
import LegalModal from './components/LegalModal';
import ProtectedRoute from './components/ProtectedRoute';
import AiAssistant from './components/AiAssistant';

import Home from './pages/Home';
import WhoIsAmyPage from './pages/WhoIsAmy';
import DohnavurPage from './pages/Dohnavur';
import TeasersPage from './pages/Teasers';
import EndowmentsPage from './pages/Endowments';
import ContactPage from './pages/Contact';
import MoviesPage from './pages/Movies';
import MovieDetailsPage from './pages/MovieDetails';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import AdminDashboard from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [trailerSrc, setTrailerSrc] = useState(null);
  const [legalType, setLegalType] = useState(null);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar onOpenDonate={() => setDonateOpen(true)} />

            <div style={{ flex: 1 }}>
              <Routes>
                {/* Home */}
                <Route
                  path="/"
                  element={
                    <Home
                      onOpenDonate={() => setDonateOpen(true)}
                      onOpenTrailer={(src) => setTrailerSrc(src)}
                    />
                  }
                />

                {/* Who is Amy Carmichael */}
                <Route
                  path="/who-is-amy"
                  element={<WhoIsAmyPage onOpenDonate={() => setDonateOpen(true)} />}
                />
                <Route
                  path="/whoisamy"
                  element={<WhoIsAmyPage onOpenDonate={() => setDonateOpen(true)} />}
                />
                <Route
                  path="/about"
                  element={<WhoIsAmyPage onOpenDonate={() => setDonateOpen(true)} />}
                />

                {/* Dohnavur Fellowship */}
                <Route
                  path="/dohnavur"
                  element={<DohnavurPage onOpenDonate={() => setDonateOpen(true)} />}
                />
                <Route
                  path="/fellowship"
                  element={<DohnavurPage onOpenDonate={() => setDonateOpen(true)} />}
                />

                {/* Teasers & Trailers */}
                <Route
                  path="/teasers"
                  element={<TeasersPage />}
                />
                <Route
                  path="/teaser"
                  element={<TeasersPage />}
                />
                <Route
                  path="/trailers"
                  element={<TeasersPage />}
                />
                <Route
                  path="/trailer"
                  element={<TeasersPage />}
                />

                {/* Endowments & Contributions */}
                <Route
                  path="/endowments"
                  element={<EndowmentsPage onOpenDonate={() => setDonateOpen(true)} />}
                />
                <Route
                  path="/endowment"
                  element={<EndowmentsPage onOpenDonate={() => setDonateOpen(true)} />}
                />
                <Route
                  path="/donate"
                  element={<EndowmentsPage onOpenDonate={() => setDonateOpen(true)} />}
                />

                {/* Contact */}
                <Route path="/contact" element={<ContactPage />} />

                {/* Cinema & Movies Catalog */}
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:slug" element={<MovieDetailsPage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback to Home */}
                <Route
                  path="*"
                  element={
                    <Home
                      onOpenDonate={() => setDonateOpen(true)}
                      onOpenTrailer={(src) => setTrailerSrc(src)}
                    />
                  }
                />
              </Routes>
            </div>

            <Footer
              onOpenDonate={() => setDonateOpen(true)}
              onOpenPrivacy={() => setLegalType('privacy')}
              onOpenTerms={() => setLegalType('terms')}
            />

            {/* Global Modals */}
            <DonationModal
              isOpen={donateOpen}
              onClose={() => setDonateOpen(false)}
            />

            <TrailerModal
              isOpen={!!trailerSrc}
              onClose={() => setTrailerSrc(null)}
              videoSrc={trailerSrc}
            />

            <LegalModal
              isOpen={!!legalType}
              onClose={() => setLegalType(null)}
              type={legalType}
            />

            {/* Groq AI Cinema Historian Widget */}
            <AiAssistant />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
