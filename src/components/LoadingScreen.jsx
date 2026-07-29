import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center academic-pattern gap-md">
      <motion.div
        className="w-14 h-14 rounded-full border-4 border-surface-container-highest border-t-secondary"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <p className="font-headline-sm text-headline-sm text-secondary">ScholarLib</p>
        <p className="font-caption text-caption text-outline-variant italic mt-xs">
          College Digital Library &middot; Built by Silverr
        </p>
      </motion.div>
    </div>
  );
}
