import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Presentation, BookOpenCheck, FlaskConical, File, Loader2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const TYPE_ICONS = {
  lecture_note: FileText,
  past_question: BookOpenCheck,
  lab_manual: FlaskConical,
  slide: Presentation,
  textbook: File,
  other: File,
};

const TYPE_LABELS = {
  lecture_note: 'Lecture Note',
  past_question: 'Past Question',
  lab_manual: 'Lab Manual',
  slide: 'Slide',
  textbook: 'Textbook',
  other: 'Other',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const runSearch = useCallback(async (q, type) => {
    setLoading(true);
    try {
      const res = await api.get('/materials/search', {
        params: { q: q || undefined, material_type: type || undefined },
      });
      setResults(res.data.materials);
    } catch (_err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch('', '');
  }, [runSearch]);

  useEffect(() => {
    const t = setTimeout(() => runSearch(query, materialType), 350);
    return () => clearTimeout(t);
  }, [query, materialType, runSearch]);

  return (
    <div className="max-w-container-max mx-auto px-gutter py-lg">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="font-label-md text-label-md text-on-surface-variant mb-lg">
          Search approved resources by course, department, or type.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-md mb-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, course code, or department..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
          />
        </div>
        <select
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
          className="px-3 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none"
        >
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-xl">
          <Loader2 className="animate-spin text-secondary" size={28} />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-xl">
          <p className="font-body-lg text-body-lg text-on-surface-variant">No resources found. Try a different search.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          <AnimatePresence>
            {results.map((m, i) => {
              const Icon = TYPE_ICONS[m.material_type] || File;
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <Link
                    to={`/materials/${m.id}`}
                    className="block bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md hover:shadow-md hover:border-secondary/40 transition-all duration-200 h-full"
                  >
                    <div className="flex items-center justify-between mb-sm">
                      <span className="inline-flex items-center gap-xs px-2 py-1 rounded-full bg-surface-container text-secondary font-caption text-caption">
                        <Icon size={14} /> {TYPE_LABELS[m.material_type] || 'Other'}
                      </span>
                      <span className="font-caption text-caption text-outline-variant">{m.course_code}</span>
                    </div>
                    <h3 className="font-title-lg text-title-lg text-on-surface mb-xs line-clamp-2">{m.title}</h3>
                    <p className="font-caption text-caption text-on-surface-variant mb-sm line-clamp-2">
                      {m.description || m.course_title}
                    </p>
                    <div className="flex justify-between items-center font-caption text-caption text-outline-variant">
                      <span>{m.department_name}</span>
                      <span>{(m.file_size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
