import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Users, FileStack, Clock, HardDrive, Loader2 } from 'lucide-react';
import api from '../../api/client';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const [statsRes, pendingRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/pending'),
    ]);
    setStats(statsRes.data);
    setPending(pendingRes.data.pending);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (versionId) => {
    setActingId(versionId);
    await api.post(`/admin/versions/${versionId}/approve`);
    setPending((p) => p.filter((v) => v.version_id !== versionId));
    setStats((s) => ({ ...s, pending_approvals: s.pending_approvals - 1, total_materials: s.total_materials }));
    setActingId(null);
  };

  const reject = async (versionId) => {
    setActingId(versionId);
    await api.post(`/admin/versions/${versionId}/reject`, { reason: 'Did not meet library guidelines.' });
    setPending((p) => p.filter((v) => v.version_id !== versionId));
    setStats((s) => ({ ...s, pending_approvals: s.pending_approvals - 1 }));
    setActingId(null);
  };

  if (loading || !stats) return <div className="flex justify-center py-xl"><Loader2 className="animate-spin text-secondary" size={28} /></div>;

  const cards = [
    { label: 'Total Resources', value: stats.total_materials, icon: FileStack },
    { label: 'Pending Approval', value: stats.pending_approvals, icon: Clock },
    { label: 'Registered Users', value: stats.total_users, icon: Users },
    { label: 'Storage Used', value: `${(stats.storage_bytes / 1024 / 1024).toFixed(1)} MB`, icon: HardDrive },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
        {cards.map(({ label, value, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md">
            <Icon className="text-secondary mb-sm" size={20} />
            <p className="font-headline-sm text-headline-sm text-on-surface">{value}</p>
            <p className="font-caption text-caption text-on-surface-variant">{label}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="font-title-lg text-title-lg text-on-surface mb-md">Pending Approvals</h2>
      {pending.length === 0 ? (
        <p className="font-caption text-caption text-outline-variant">Nothing waiting for review.</p>
      ) : (
        <div className="space-y-sm">
          <AnimatePresence>
            {pending.map((v) => (
              <motion.div
                key={v.version_id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md"
              >
                <div>
                  <p className="font-title-lg text-title-lg text-on-surface">{v.title}</p>
                  <p className="font-caption text-caption text-outline-variant">
                    {v.course_code} &middot; v{v.version_number} &middot; {v.uploaded_by_name} &middot; {(v.file_size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <div className="flex gap-sm">
                  <button disabled={actingId === v.version_id} onClick={() => approve(v.version_id)}
                    className="flex items-center gap-xs bg-secondary text-on-secondary px-3 py-2 rounded-lg hover:bg-on-secondary-container transition-colors disabled:opacity-50">
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button disabled={actingId === v.version_id} onClick={() => reject(v.version_id)}
                    className="flex items-center gap-xs bg-error-container text-error px-3 py-2 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
