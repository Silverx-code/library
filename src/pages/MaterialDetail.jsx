import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Bookmark, BookmarkCheck, Send, History, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function MaterialDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [material, setMaterial] = useState(null);
  const [versions, setVersions] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [matRes, commentsRes, bookmarksRes] = await Promise.all([
      api.get(`/materials/${id}`),
      api.get(`/comments/${id}`),
      api.get('/bookmarks'),
    ]);
    setMaterial(matRes.data.material);
    setVersions(matRes.data.versions);
    setComments(commentsRes.data.comments);
    setBookmarked(bookmarksRes.data.bookmarks.some((b) => b.id === id));
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const toggleBookmark = async () => {
    if (bookmarked) {
      await api.delete(`/bookmarks/${id}`);
    } else {
      await api.post('/bookmarks', { material_id: id });
    }
    setBookmarked(!bookmarked);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/materials/${id}/download`);
      window.open(res.data.url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await api.post(`/comments/${id}`, { comment: newComment });
    setComments((c) => [...c, { ...res.data.comment, user_name: user.name, user_role: user.role }]);
    setNewComment('');
  };

  const deleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    setComments((c) => c.filter((cm) => cm.id !== commentId));
  };

  if (loading) {
    return <div className="flex justify-center py-xl"><Loader2 className="animate-spin text-secondary" size={28} /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-gutter py-lg space-y-lg">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-lg"
      >
        <div className="flex justify-between items-start mb-sm">
          <div>
            <span className="font-caption text-caption text-secondary bg-surface-container px-2 py-1 rounded-full">
              {material.course_code}
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface mt-sm">
              {versions.find((v) => v.version_number === material.current_version)?.title}
            </h1>
            <p className="font-caption text-caption text-outline-variant mt-xs">
              {material.department_name} &middot; Uploaded by {material.uploaded_by_name}
            </p>
          </div>
          <button onClick={toggleBookmark} className="text-secondary hover:opacity-70 transition-opacity">
            <AnimatePresence mode="wait">
              {bookmarked ? (
                <motion.span key="on" initial={{ scale: 0.6 }} animate={{ scale: 1 }}><BookmarkCheck size={26} /></motion.span>
              ) : (
                <motion.span key="off" initial={{ scale: 0.6 }} animate={{ scale: 1 }}><Bookmark size={26} /></motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          {versions.find((v) => v.version_number === material.current_version)?.description || 'No description provided.'}
        </p>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-secondary hover:bg-on-secondary-container text-on-secondary px-gutter py-3 rounded-lg font-title-lg text-title-lg transition-all active:scale-[0.98] shadow-md flex items-center gap-sm"
        >
          {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          Download
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-lg">
        <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-xs mb-md"><History size={18} /> Version History</h2>
        <div className="space-y-sm">
          {versions.map((v) => (
            <div key={v.id} className="flex justify-between items-center text-body-md">
              <span>v{v.version_number} &middot; {v.title}</span>
              <span className={`font-caption text-caption px-2 py-1 rounded-full ${
                v.approval_status === 'approved' ? 'bg-surface-container text-secondary' :
                v.approval_status === 'pending' ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant' :
                'bg-error-container text-error'
              }`}>{v.approval_status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-lg">
        <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-xs mb-md"><MessageSquare size={18} /> Comments</h2>
        <div className="space-y-md mb-md">
          {comments.length === 0 && <p className="font-caption text-caption text-outline-variant">No comments yet.</p>}
          {comments.map((c) => (
            <div key={c.id} className="flex justify-between items-start border-b border-outline-variant/30 pb-sm">
              <div>
                <p className="font-label-md text-label-md text-on-surface">{c.user_name} <span className="text-outline-variant font-normal">&middot; {c.user_role}</span></p>
                <p className="font-body-md text-body-md text-on-surface-variant">{c.comment}</p>
              </div>
              {(c.user_name === user.name || user.role === 'admin') && (
                <button onClick={() => deleteComment(c.id)} className="text-outline hover:text-error">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={submitComment} className="flex gap-sm">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Note a missing page, ask a question, or add helpful context..."
            className="flex-1 px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none"
          />
          <button type="submit" className="bg-secondary text-on-secondary px-4 rounded-lg hover:bg-on-secondary-container transition-colors">
            <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
