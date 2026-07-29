import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, CheckCircle2, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [portal, setPortal] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('loading');
    try {
      await login(email, password, portal);
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.error || 'Sign in failed. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-stretch overflow-hidden">
      {/* Left Visual Side (Desktop Only) */}
      <section className="hidden lg:flex flex-1 relative bg-primary-container items-center justify-center p-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#465f88,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 max-w-lg text-center"
        >
          <h1 className="font-display-lg text-display-lg text-on-primary-container mb-md leading-tight">
            ScholarLib
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 mb-lg">
            Your college's digital library for lecture notes, past questions, and academic
            resources &mdash; organized by faculty, department, and course.
          </p>
          <div className="grid grid-cols-2 gap-md text-left">
            {[
              { icon: BookOpen, title: 'Digital Archive', body: 'Every approved resource, organized and searchable by course.' },
              { icon: GraduationCap, title: 'Built for Students', body: 'Upload, bookmark, and discuss materials with your classmates.' },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                className="p-md bg-white/5 rounded-xl border border-white/10"
              >
                <Icon className="text-secondary-fixed mb-sm" size={22} />
                <h3 className="font-title-lg text-title-lg text-white mb-xs">{title}</h3>
                <p className="font-caption text-caption text-outline-variant">{body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Right Interaction Side (Form) */}
      <section className="flex-1 flex flex-col academic-pattern relative">
        <div className="lg:hidden p-gutter flex justify-between items-center">
          <h1 className="font-headline-sm text-headline-sm text-secondary font-bold">ScholarLib</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-gutter">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md glass-panel p-lg rounded-xl shadow-sm"
          >
            <div className="mb-lg text-center lg:text-left">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Welcome Back</h2>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Please select your portal to continue.
              </p>
            </div>

            {/* Auth Tabs */}
            <div className="relative flex mb-lg bg-surface-container rounded-full p-xs">
              <motion.div
                className="absolute inset-y-xs w-[calc(50%-4px)] bg-secondary rounded-full shadow-sm"
                animate={{ x: portal === 'student' ? 4 : 'calc(100% + 0px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => setPortal('student')}
                className={`relative z-10 flex-1 py-base px-md rounded-full font-label-md text-label-md transition-colors duration-200 ${
                  portal === 'student' ? 'text-on-secondary' : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                Student Login
              </button>
              <button
                type="button"
                onClick={() => setPortal('admin')}
                className={`relative z-10 flex-1 py-base px-md rounded-full font-label-md text-label-md transition-colors duration-200 ${
                  portal === 'admin' ? 'text-on-secondary' : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                Lecturer/Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john.doe@university.edu"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-body-md text-body-md"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-xs">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="font-label-md text-label-md text-secondary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all font-body-md text-body-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-secondary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-error font-caption text-caption bg-error-container/40 rounded-lg px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-secondary hover:bg-on-secondary-container disabled:opacity-70 text-on-secondary py-3 px-gutter rounded-lg font-title-lg text-title-lg transition-all duration-200 transform active:scale-[0.98] shadow-md flex items-center justify-center gap-sm"
              >
                {status === 'loading' && (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Authenticating...
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle2 size={20} /> Success
                  </>
                )}
                {(status === 'idle' || status === 'error') && (
                  <>
                    Sign In <LogIn size={20} />
                  </>
                )}
              </button>

              <div className="pt-base text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Need institutional access?{' '}
                  <Link to="/register" className="text-secondary font-bold hover:underline">
                    Register your campus
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Footer Watermark */}
        <footer className="p-gutter flex flex-col md:flex-row justify-between items-center gap-sm">
          <div className="flex items-center gap-base">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="font-label-md text-label-md text-on-surface-variant">
              © {new Date().getFullYear()} College Digital Library
            </span>
          </div>
          <div className="font-label-md text-label-md text-outline-variant italic">Built by Silverr</div>
        </footer>
      </section>
    </main>
  );
}
