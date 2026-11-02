import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const routeTitles: Record<string, string> = {
    '/': 'Project Overview',
    '/portfolio': '01. Personal Portfolio Landing Page',
    '/todo': '02. Interactive To-Do List',
    '/pricing': '03. Responsive Pricing Cards',
    '/weather': '04. Live Weather Dashboard',
    '/quiz': '05. Interactive Quiz & Mini Store',
    '/shop': '05. Interactive Quiz & Mini Store',
  };

  const currentTitle = routeTitles[location.pathname] || 'Workspace';

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Link to="/" className="hover:text-[#172033] transition-colors">
            Workspace
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033] font-medium">{currentTitle}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick search input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks or components..."
            className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#172033] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
          />
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] font-semibold text-xs flex items-center justify-center">
            AS
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-[#172033] leading-tight">Aryan Singh</div>
            <div className="text-[10px] text-[#64748B]">Fullstack Intern</div>
          </div>
        </div>
      </div>
    </header>
  );
};
