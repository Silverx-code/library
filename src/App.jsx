import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';
import MaterialDetail from './pages/MaterialDetail';
import Admin from './pages/Admin';
import Bookmarks from './pages/Bookmarks';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />

            <Route path="/dashboard" element={
              <ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute><PageTransition><UploadPage /></PageTransition></ProtectedRoute>
            } />
            <Route path="/materials/:id" element={
              <ProtectedRoute><PageTransition><MaterialDetail /></PageTransition></ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute><PageTransition><Bookmarks /></PageTransition></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireRole="admin"><PageTransition><Admin /></PageTransition></ProtectedRoute>
            } />

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
      {location.pathname !== '/' && location.pathname !== '/login' && <Footer />}
    </div>
  );
}
