import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-gutter">
      <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="font-display-lg text-display-lg text-secondary">
        404
      </motion.p>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-md">This page doesn't exist.</p>
      <Link to="/dashboard" className="text-secondary font-bold hover:underline">Back to Dashboard</Link>
    </div>
  );
}
