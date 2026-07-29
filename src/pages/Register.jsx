import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [departmentId, setDepartmentId] = useState('');
  const [level, setLevel] = useState('100');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/academic/departments').then((res) => setDepartments(res.data.departments)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name, email, password, role,
        department_id: departmentId || null,
        level: role === 'student' ? Number(level) : null,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen academic-pattern flex items-center justify-center p-gutter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-lg rounded-xl shadow-sm"
      >
        <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Register your campus</h2>
        <p className="font-label-md text-label-md text-on-surface-variant mb-lg">
          Create an account to start uploading and downloading resources.
        </p>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs">I am a</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none">
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>
            {role === 'student' && (
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs">Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none">
                  {[100, 200, 300, 400, 500].map((l) => <option key={l} value={l}>{l} Level</option>)}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Department</label>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none">
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {error && <p className="text-error font-caption text-caption bg-error-container/40 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-secondary hover:bg-on-secondary-container disabled:opacity-70 text-on-secondary py-3 rounded-lg font-title-lg text-title-lg transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-sm">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center font-body-md text-body-md text-on-surface-variant">
            Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </main>
  );
}
