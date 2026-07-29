import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks').then((res) => setBookmarks(res.data.bookmarks)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-xl"><Loader2 className="animate-spin text-secondary" size={28} /></div>;

  return (
    <div className="max-w-container-max mx-auto px-gutter py-lg">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
        <Bookmark className="text-secondary" /> Your Bookmarks
      </motion.h1>

      {bookmarks.length === 0 ? (
        <p className="font-body-lg text-body-lg text-on-surface-variant">You haven't bookmarked anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          <AnimatePresence>
            {bookmarks.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/materials/${b.id}`} className="block bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-md hover:shadow-md hover:border-secondary/40 transition-all">
                  <span className="font-caption text-caption text-secondary bg-surface-container px-2 py-1 rounded-full">{b.course_code}</span>
                  <h3 className="font-title-lg text-title-lg text-on-surface mt-sm">{b.title}</h3>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
