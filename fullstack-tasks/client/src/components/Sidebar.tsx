import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  User,
  CheckSquare,
  CreditCard,
  CloudSun,
  ShoppingBag,
  HelpCircle,
  ShieldCheck,
  Database
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'offline'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setDbStatus('connected');
        } else {
          setDbStatus('offline');
        }
      })
      .catch(() => setDbStatus('offline'));
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid, exact: true },
    { to: '/portfolio', label: '01. Portfolio', icon: User },
    { to: '/todo', label: '02. To-Do App', icon: CheckSquare },
    { to: '/pricing', label: '03. Pricing Cards', icon: CreditCard },
    { to: '/weather', label: '04. Live Weather', icon: CloudSun },
    { to: '/quiz', label: '05. Quiz & Store', icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
      <div>
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 text-inherit no-underline">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-[#172033]">InternCircle</div>
              <div className="text-[11px] text-[#64748B] -mt-0.5">Fullstack Suite</div>
            </div>
          </NavLink>
        </div>

        {/* Navigation list */}
        <div className="p-3">
          <div className="px-3 pt-3 pb-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                        : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#172033]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="px-3 pt-6 pb-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Architecture
          </div>
          <div className="px-3 py-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-xs text-[#64748B] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Assignments</span>
              <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                5 of 5
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              React 18 • TypeScript • Node.js • SQLite 3
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status */}
      <div className="p-4 border-t border-[#E5E7EB] bg-white space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              dbStatus === 'connected'
                ? 'bg-emerald-500'
                : dbStatus === 'checking'
                ? 'bg-amber-400'
                : 'bg-slate-400'
            }`}
          />
          <span>{dbStatus === 'connected' ? 'SQLite Database Active' : 'Checking Backend'}</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Database className="w-3 h-3 text-slate-400" />
          <span>Express REST APIs Online</span>
        </div>
      </div>
    </aside>
  );
};
