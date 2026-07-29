export default function Footer() {
  return (
    <footer className="p-gutter flex flex-col md:flex-row justify-between items-center gap-sm border-t border-outline-variant/40 mt-auto">
      <div className="flex items-center gap-base">
        <div className="w-2 h-2 rounded-full bg-secondary" />
        <span className="font-label-md text-label-md text-on-surface-variant">
          © {new Date().getFullYear()} College Digital Library
        </span>
      </div>
      <div className="font-label-md text-label-md text-outline-variant italic">Built by Silverr</div>
    </footer>
  );
}
