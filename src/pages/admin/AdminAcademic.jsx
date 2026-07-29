import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Building2, Layers, BookMarked } from 'lucide-react';
import api from '../../api/client';

export default function AdminAcademic() {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [facultyName, setFacultyName] = useState('');
  const [deptFacultyId, setDeptFacultyId] = useState('');
  const [deptName, setDeptName] = useState('');
  const [courseDeptId, setCourseDeptId] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseLevel, setCourseLevel] = useState('100');
  const [courseSemester, setCourseSemester] = useState('1');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState('');

  const loadAll = async () => {
    setLoading(true);
    const [f, d, c] = await Promise.all([
      api.get('/academic/faculties'),
      api.get('/academic/departments'),
      api.get('/academic/courses'),
    ]);
    setFaculties(f.data.faculties);
    setDepartments(d.data.departments);
    setCourses(c.data.courses);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const createFaculty = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting('faculty');
    try {
      const res = await api.post('/academic/faculties', { name: facultyName });
      setFaculties((f) => [...f, res.data.faculty].sort((a, b) => a.name.localeCompare(b.name)));
      setFacultyName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create faculty.');
    } finally {
      setSubmitting('');
    }
  };

  const createDepartment = async (e) => {
    e.preventDefault();
    if (!deptFacultyId) return;
    setError(''); setSubmitting('department');
    try {
      const res = await api.post('/academic/departments', { faculty_id: deptFacultyId, name: deptName });
      const faculty = faculties.find((f) => f.id === deptFacultyId);
      setDepartments((d) => [...d, { ...res.data.department, faculty_name: faculty?.name }]);
      setDeptName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create department.');
    } finally {
      setSubmitting('');
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    if (!courseDeptId) return;
    setError(''); setSubmitting('course');
    try {
      const res = await api.post('/academic/courses', {
        department_id: courseDeptId,
        code: courseCode,
        title: courseTitle,
        level: Number(courseLevel),
        semester: Number(courseSemester),
      });
      const dept = departments.find((d) => d.id === courseDeptId);
      setCourses((c) => [...c, { ...res.data.course, department_name: dept?.name }]);
      setCourseCode(''); setCourseTitle('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create course.');
    } finally {
      setSubmitting('');
    }
  };

  if (loading) return <div className="flex justify-center py-xl"><Loader2 className="animate-spin text-secondary" size={28} /></div>;

  return (
    <div className="space-y-lg">
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="text-error font-caption text-caption bg-error-container/40 rounded-lg px-3 py-2">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Faculties */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-lg">
        <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-xs mb-md"><Building2 size={18} /> Faculties</h2>
        <form onSubmit={createFaculty} className="flex gap-sm mb-md">
          <input required value={facultyName} onChange={(e) => setFacultyName(e.target.value)}
            placeholder="e.g. Faculty of Engineering"
            className="flex-1 px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
          <button disabled={submitting === 'faculty'} className="bg-secondary text-on-secondary px-4 rounded-lg hover:bg-on-secondary-container transition-colors flex items-center gap-xs disabled:opacity-50">
            {submitting === 'faculty' ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add
          </button>
        </form>
        <div className="flex flex-wrap gap-sm">
          {faculties.map((f) => (
            <span key={f.id} className="font-caption text-caption bg-surface-container text-secondary px-3 py-1 rounded-full">{f.name}</span>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-lg">
        <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-xs mb-md"><Layers size={18} /> Departments</h2>
        <form onSubmit={createDepartment} className="grid grid-cols-1 sm:grid-cols-3 gap-sm mb-md">
          <select required value={deptFacultyId} onChange={(e) => setDeptFacultyId(e.target.value)}
            className="px-3 py-2 bg-white border border-outline-variant rounded-lg outline-none">
            <option value="">Select faculty</option>
            {faculties.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <input required value={deptName} onChange={(e) => setDeptName(e.target.value)} placeholder="e.g. Computer Science"
            className="px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
          <button disabled={submitting === 'department'} className="bg-secondary text-on-secondary px-4 py-2 rounded-lg hover:bg-on-secondary-container transition-colors flex items-center justify-center gap-xs disabled:opacity-50">
            {submitting === 'department' ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add
          </button>
        </form>
        <div className="flex flex-wrap gap-sm">
          {departments.map((d) => (
            <span key={d.id} className="font-caption text-caption bg-surface-container text-secondary px-3 py-1 rounded-full">
              {d.name} <span className="text-outline-variant">&middot; {d.faculty_name}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-lg">
        <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-xs mb-md"><BookMarked size={18} /> Courses</h2>
        <form onSubmit={createCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-sm mb-sm">
          <select required value={courseDeptId} onChange={(e) => setCourseDeptId(e.target.value)}
            className="px-3 py-2 bg-white border border-outline-variant rounded-lg outline-none">
            <option value="">Select department</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input required value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="Course code, e.g. CSC201"
            className="px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
          <input required value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Course title"
            className="sm:col-span-2 px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" />
          <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}
            className="px-3 py-2 bg-white border border-outline-variant rounded-lg outline-none">
            {[100, 200, 300, 400, 500].map((l) => <option key={l} value={l}>{l} Level</option>)}
          </select>
          <select value={courseSemester} onChange={(e) => setCourseSemester(e.target.value)}
            className="px-3 py-2 bg-white border border-outline-variant rounded-lg outline-none">
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <button disabled={submitting === 'course'} className="sm:col-span-2 bg-secondary text-on-secondary px-4 py-2 rounded-lg hover:bg-on-secondary-container transition-colors flex items-center justify-center gap-xs disabled:opacity-50">
            {submitting === 'course' ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add Course
          </button>
        </form>
        <div className="flex flex-wrap gap-sm">
          {courses.map((c) => (
            <span key={c.id} className="font-caption text-caption bg-surface-container text-secondary px-3 py-1 rounded-full">
              {c.code} &middot; {c.title}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
