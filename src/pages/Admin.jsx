import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, GraduationCap } from 'lucide-react';
import AdminOverview from './admin/AdminOverview';
import AdminUsers from './admin/AdminUsers';
import AdminAcademic from './admin/AdminAcademic';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid, Component: AdminOverview },
  { key: 'users', label: 'Users', icon: Users, Component: AdminUsers },
  { key: 'academic', label: 'Academic Structure', icon: GraduationCap, Component: AdminAcademic },
];

export default function Admin() {
  const [active, setActive] = useState('overview');
  const ActiveComponent = TABS.find((t) => t.key === active).Component;

  return (
    <div className="max-w-container-max mx-auto px-gutter py-lg">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-headline-md text-headline-md text-on-surface mb-lg">
        Administration
      </motion.h1>

      <div className="flex gap-xs mb-lg bg-surface-container rounded-full p-xs w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`relative flex items-center gap-xs px-md py-base rounded-full font-label-md text-label-md transition-colors duration-200 ${
              active === key ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <ActiveComponent />
      </motion.div>
    </div>
  );
}
