import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  CheckSquare,
  CreditCard,
  CloudSun,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cpu,
  Layers
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const projects = [
    {
      num: 'PROJECT 01',
      title: 'Personal Portfolio Landing Page',
      path: '/portfolio',
      icon: User,
      desc: 'Complete developer portfolio with hero, about, technical skills showcase, projects gallery, education timeline, and functional backend contact form.',
      tags: ['React', 'TypeScript', 'Express API', 'Validation'],
      status: 'Ready'
    },
    {
      num: 'PROJECT 02',
      title: 'Interactive To-Do List with LocalStorage',
      path: '/todo',
      icon: CheckSquare,
      desc: 'Task management tool with instant LocalStorage persistence. Add, inline-edit, delete, search, and toggle tasks across active and completed filters.',
      tags: ['LocalStorage', 'State Hooks', 'Search & Filter', 'CRUD'],
      status: 'Ready'
    },
    {
      num: 'PROJECT 03',
      title: 'Responsive Product Pricing Cards',
      path: '/pricing',
      icon: CreditCard,
      desc: 'SaaS pricing comparison page featuring Basic, Pro, and Premium plans. Interactive monthly and yearly billing toggle with 20% annual discount and checkout modal.',
      tags: ['Responsive Grid', 'Billing Toggle', 'Feature Matrix', 'Modal'],
      status: 'Ready'
    },
    {
      num: 'PROJECT 04',
      title: 'Live Weather Dashboard with Fetch API',
      path: '/weather',
      icon: CloudSun,
      desc: 'Real-time meteorological reporting with global city search. Displays live temperature, humidity, wind speed, pressure, and 5-day daily forecast.',
      tags: ['Fetch API', 'Open-Meteo', '5-Day Forecast', 'Error Handling'],
      status: 'Ready'
    },
    {
      num: 'PROJECT 05',
      title: 'Interactive Quiz & Mini E-Commerce App',
      path: '/quiz',
      icon: ShoppingBag,
      desc: 'Dual-mode application featuring an interactive 10-question web development quiz alongside a full e-commerce store with cart management and SQLite backend order storage.',
      tags: ['Quiz Engine', 'Shopping Cart', 'SQLite Orders', 'REST API'],
      status: 'Ready'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="scamshield-card p-6 bg-white border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
              <ShieldCheck className="w-3.5 h-3.5" /> INTERNCIRCLE FULLSTACK
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              5 of 5 Complete
            </span>
          </div>
          <h1 className="text-xl font-semibold text-[#172033] tracking-tight">
            Fullstack Web Development Suite
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Clean, minimal, ScamShield-inspired white SaaS interface. All five project assignments are built with React, TypeScript, Tailwind CSS, Express, and SQLite with zero placeholder buttons.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Total Projects</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#172033] mt-1">5</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> All Modules Verified
          </div>
        </div>

        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Frontend Stack</span>
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#172033] mt-1">React 18</div>
          <div className="text-[11px] text-slate-500 mt-1">TypeScript + Tailwind CSS</div>
        </div>

        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Backend Runtime</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#172033] mt-1">Node.js</div>
          <div className="text-[11px] text-slate-500 mt-1">Express REST API Routing</div>
        </div>

        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium flex items-center justify-between">
            <span>Database Storage</span>
            <Database className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#172033] mt-1">SQLite 3</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Messages & Orders DB</div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xs font-semibold text-[#172033] uppercase tracking-wider">
          The Five Assignments
        </h2>
        <span className="text-xs text-[#64748B]">Click any card to open the project</span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const Icon = proj.icon;
          return (
            <div
              key={proj.num}
              className="scamshield-card scamshield-card-hover p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {proj.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-[#172033]">{proj.title}</h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{proj.desc}</p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium text-slate-600 bg-[#F8FAFC] border border-[#E5E7EB] px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Fully Functional
                </span>
                <Link
                  to={proj.path}
                  className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <span>Open Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
