import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-gutter py-xl text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-md">About ScholarLib</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
          ScholarLib is a college digital library that lets students and lecturers upload, organize,
          search, and download academic resources — lecture notes, past questions, lab manuals, and
          more — all approved by administrators and organized by faculty, department, and course.
        </p>
        <div className="border-t border-outline-variant/40 pt-md">
          <p className="font-label-md text-label-md text-on-surface-variant">Designed and Developed by</p>
          <p className="font-headline-sm text-headline-sm text-secondary mt-xs">Silverr</p>
        </div>
      </motion.div>
    </div>
  );
}
