import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, Upload, Bookmark, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Browse', icon: LayoutDashboard },
    { to: '/upload', label: 'Upload', icon: Upload },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];
  if (user?.role === 'admin') links.push({ to: '/admin', label: 'Admin', icon: ShieldCheck });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-outline-variant/40">
      <div className="max-w-container-max mx-auto px-gutter h-16 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="font-headline-sm text-headline-sm text-secondary font-bold">
          ScholarLib
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-lg">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-xs font-label-md text-label-md transition-colors ${
                  location.pathname.startsWith(to) ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-xs font-label-md text-label-md text-error hover:opacity-80 transition-opacity"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}

        {user && (
          <button className="md:hidden text-on-surface" onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-outline-variant/40 bg-surface"
          >
            <div className="flex flex-col p-gutter gap-md">
              {links.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-sm text-on-surface-variant">
                  <Icon size={18} /> {label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-sm text-error text-left">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
