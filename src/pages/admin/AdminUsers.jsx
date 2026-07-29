import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, GraduationCap, UserCog, Loader2, Ban, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';

const ROLE_META = {
  admin: { label: 'Admin', icon: ShieldCheck, className: 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant' },
  lecturer: { label: 'Lecturer', icon: UserCog, className: 'bg-surface-container text-secondary' },
  student: { label: 'Student', icon: GraduationCap, className: 'bg-secondary-fixed/40 text-on-secondary-fixed-variant' },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async (q, r) => {
    setLoading(true);
    const res = await api.get('/admin/users', { params: { search: q || undefined, role: r || undefined } });
    setUsers(res.data.users);
    setLoading(false);
  }, []);

  useEffect(() => { load('', ''); }, [load]);
  useEffect(() => {
    const t = setTimeout(() => load(search, role), 350);
    return () => clearTimeout(t);
  }, [search, role, load]);

  const toggleActive = async (u) => {
    setActingId(u.id);
    const res = await api.patch(`/admin/users/${u.id}/active`, { is_active: !u.is_active });
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, is_active: res.data.user.is_active } : x)));
    setActingId(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-md mb-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none"
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)}
          className="px-3 py-3 bg-white border border-outline-variant rounded-lg outline-none">
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="lecturer">Lecturers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-xl"><Loader2 className="animate-spin text-secondary" size={28} /></div>
      ) : users.length === 0 ? (
        <p className="font-caption text-caption text-outline-variant">No users match that search.</p>
      ) : (
        <div className="space-y-sm">
          <AnimatePresence>
            {users.map((u) => {
              const meta = ROLE_META[u.role] || ROLE_META.student;
              const Icon = meta.icon;
              return (
                <motion.div key={u.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md">
                  <div className="flex items-center gap-sm">
                    <span className={`inline-flex items-center gap-xs px-2 py-1 rounded-full font-caption text-caption ${meta.className}`}>
                      <Icon size={14} /> {meta.label}
                    </span>
                    <div>
                      <p className="font-title-lg text-title-lg text-on-surface leading-tight">{u.name}</p>
                      <p className="font-caption text-caption text-outline-variant">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className={`font-caption text-caption px-2 py-1 rounded-full ${u.is_active ? 'bg-surface-container text-secondary' : 'bg-error-container text-error'}`}>
                      {u.is_active ? 'Active' : 'Deactivated'}
                    </span>
                    <button
                      disabled={actingId === u.id}
                      onClick={() => toggleActive(u)}
                      className={`flex items-center gap-xs px-3 py-2 rounded-lg font-label-md text-label-md transition-colors disabled:opacity-50 ${
                        u.is_active ? 'bg-error-container text-error hover:opacity-80' : 'bg-secondary text-on-secondary hover:bg-on-secondary-container'
                      }`}
                    >
                      {u.is_active ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                      {u.is_active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
