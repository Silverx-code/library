import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileCheck2, Loader2, CheckCircle2, Copy } from 'lucide-react';
import api from '../api/client';

const TYPE_OPTIONS = [
  ['lecture_note', 'Lecture Note'],
  ['past_question', 'Past Question'],
  ['lab_manual', 'Lab Manual'],
  ['slide', 'Slide'],
  ['textbook', 'Textbook'],
  ['other', 'Other'],
];

export default function UploadPage() {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialType, setMaterialType] = useState('lecture_note');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    api.get('/academic/faculties').then((res) => setFaculties(res.data.faculties));
  }, []);

  useEffect(() => {
    if (!facultyId) return setDepartments([]);
    api.get('/academic/departments', { params: { faculty_id: facultyId } }).then((res) => setDepartments(res.data.departments));
  }, [facultyId]);

  useEffect(() => {
    if (!departmentId) return setCourses([]);
    api.get('/academic/courses', { params: { department_id: departmentId } }).then((res) => setCourses(res.data.courses));
  }, [departmentId]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !courseId || !title) return;
    setStatus('loading');
    setMessage('');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('course_id', courseId);
      form.append('title', title);
      form.append('description', description);
      form.append('material_type', materialType);

      const res = await api.post('/materials/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsDuplicate(res.data.duplicate);
      setMessage(res.data.message);
      setStatus('success');
      setTitle(''); setDescription(''); setFile(null);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Upload failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-gutter py-lg">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Upload a Resource</h1>
        <p className="font-label-md text-label-md text-on-surface-variant mb-lg">
          Files are checked for duplicates automatically and reviewed by an administrator before publishing.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-md bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-lg">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-lg text-center transition-colors cursor-pointer ${
            dragActive ? 'border-secondary bg-surface-container' : 'border-outline-variant'
          }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-xs">
                <FileCheck2 className="text-secondary" size={32} />
                <p className="font-title-lg text-title-lg text-on-surface">{file.name}</p>
                <p className="font-caption text-caption text-outline-variant">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-xs">
                <UploadCloud className="text-outline" size={32} />
                <p className="font-body-md text-body-md text-on-surface-variant">Drag & drop, or click to select a file</p>
                <p className="font-caption text-caption text-outline-variant">PDF, Word, PowerPoint, or image — up to 50MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-xs">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
        </div>

        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-xs">Description (optional)</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Faculty</label>
            <select value={facultyId} onChange={(e) => { setFacultyId(e.target.value); setDepartmentId(''); setCourseId(''); }}
              className="w-full px-3 py-3 bg-white border border-outline-variant rounded-lg outline-none">
              <option value="">Select faculty</option>
              {faculties.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Department</label>
            <select value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setCourseId(''); }} disabled={!facultyId}
              className="w-full px-3 py-3 bg-white border border-outline-variant rounded-lg outline-none disabled:opacity-50">
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Course</label>
            <select required value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={!departmentId}
              className="w-full px-3 py-3 bg-white border border-outline-variant rounded-lg outline-none disabled:opacity-50">
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">Material Type</label>
            <select value={materialType} onChange={(e) => setMaterialType(e.target.value)}
              className="w-full px-3 py-3 bg-white border border-outline-variant rounded-lg outline-none">
              {TYPE_OPTIONS.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
            </select>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-lg px-3 py-2 flex items-center gap-sm font-caption text-caption ${
                status === 'error' ? 'bg-error-container/40 text-error' : 'bg-surface-container text-secondary'
              }`}
            >
              {status === 'error' ? null : isDuplicate ? <Copy size={16} /> : <CheckCircle2 size={16} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={status === 'loading' || !file}
          className="w-full bg-secondary hover:bg-on-secondary-container disabled:opacity-50 text-on-secondary py-3 rounded-lg font-title-lg text-title-lg transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-sm">
          {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
          {status === 'loading' ? 'Uploading...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}
