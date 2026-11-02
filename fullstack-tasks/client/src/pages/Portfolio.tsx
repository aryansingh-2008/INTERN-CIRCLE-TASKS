import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  Code2,
  Layers,
  Trophy,
  Users,
  BarChart3,
  Star,
  ExternalLink,
  Briefcase,
  BookOpen,
  MapPin,
  Send,
  User as UserIcon,
  Tag,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Download,
  Zap,
  Target,
  ChevronLeft,
  LayoutGrid,
  Check,
  Copy,
  Terminal,
  Sparkles,
  Server,
  Database,
  Globe,
  Cpu
} from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('aryansingh7052606404@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent and stored in the database.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong while sending the message.'
      });
    } finally {
      setLoading(false);
    }
  };

  const skillCategories = [
    {
      category: 'Languages',
      skills: [
        { name: 'TypeScript', tag: 'Primary', level: '90%', color: '#3178C6' },
        { name: 'JavaScript (ES6+)', tag: 'Advanced', level: '95%', color: '#F7DF1E' },
        { name: 'Python', tag: 'Proficient', level: '88%', color: '#3776AB' },
        { name: 'C++', tag: 'System & OOP', level: '85%', color: '#00599C' },
        { name: 'Java', tag: 'OOP Core', level: '80%', color: '#E76F00' },
        { name: 'SQL', tag: 'Relational DB', level: '85%', color: '#336791' }
      ]
    },
    {
      category: 'Frontend Development',
      skills: [
        { name: 'React.js', tag: 'Primary Library', level: '92%', color: '#61DAFB' },
        { name: 'Tailwind CSS', tag: 'Utility First', level: '95%', color: '#38B2AC' },
        { name: 'HTML5 & CSS3', tag: 'Semantic UI', level: '95%', color: '#E34F26' },
        { name: 'Vite', tag: 'Modern Build', level: '90%', color: '#646CFF' },
        { name: 'State Management', tag: 'Hooks / Context', level: '88%', color: '#8B5CF6' }
      ]
    },
    {
      category: 'Backend & Database',
      skills: [
        { name: 'Node.js', tag: 'Runtime', level: '88%', color: '#339933' },
        { name: 'Express.js', tag: 'REST APIs', level: '90%', color: '#000000' },
        { name: 'SQLite 3', tag: 'Embedded DB', level: '85%', color: '#003B57' },
        { name: 'FastAPI', tag: 'Python APIs', level: '80%', color: '#009688' },
        { name: 'RESTful Architecture', tag: 'Design', level: '90%', color: '#2563EB' }
      ]
    },
    {
      category: 'Tools & Practices',
      skills: [
        { name: 'Git & GitHub', tag: 'Version Control', level: '92%', color: '#F05032' },
        { name: 'VS Code', tag: 'IDE Workflow', level: '95%', color: '#007ACC' },
        { name: 'Postman', tag: 'API Testing', level: '88%', color: '#FF6C37' },
        { name: 'Data Structures & Algorithms', tag: 'Core Concepts', level: '80%', color: '#10B981' }
      ]
    }
  ];

  const projects = [
    {
      title: 'InternCircle DevSuite (Fullstack 5-Pack)',
      description:
        'A comprehensive full-stack developer suite featuring an interactive task manager with LocalStorage, SaaS dynamic pricing calculator, live weather dashboard with Open-Meteo REST API, and an interactive quiz & mini e-commerce store backed by SQLite database persistence.',
      tags: ['React', 'TypeScript', 'Node.js', 'Express', 'SQLite', 'Tailwind'],
      status: 'Live & Operational',
      featured: true,
      internalLink: '/',
      linkText: 'Open Fullstack DevSuite'
    },
    {
      title: 'ScamShield Bharat',
      description:
        'An AI-powered security application engineered to detect, classify, and prevent financial cyber scams with real-time risk scoring, suspicious SMS/email pattern analysis, and preventative safety guidance.',
      tags: ['React', 'Node.js', 'FastAPI', 'Python', 'AI/ML Security'],
      status: 'Featured Project',
      featured: true,
      githubLink: 'https://github.com/aryansingh-2008/scamshield-bharat',
      linkText: 'View on GitHub'
    },
    {
      title: 'ResumeCraft',
      description:
        'A professional ATS-friendly resume builder with live Markdown and form-driven previews, customizable typography, section reordering, and direct PDF generation.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Export Engine'],
      status: 'Active Build',
      featured: false,
      githubLink: 'https://github.com/aryansingh-2008',
      linkText: 'View on GitHub'
    },
    {
      title: 'VibeCheck AI',
      description:
        'Multi-factor code and content analysis platform designed to detect automated code generation patterns, assisting mentors and reviewers in verifying code authenticity.',
      tags: ['Python', 'FastAPI', 'AST Analysis', 'Tailwind'],
      status: 'Research Project',
      featured: false,
      githubLink: 'https://github.com/aryansingh-2008',
      linkText: 'View on GitHub'
    }
  ];

  return (
    <div className="bg-white min-h-screen text-[#0F172A] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* =========================================================================
           TOP NAVIGATION BAR (Clean, Genuine, ScamShield White SaaS Standard)
           ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              AS
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#0F172A] block leading-tight">
                Aryan Singh
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">
                Software Engineer
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              title="Switch to InternCircle DevSuite Workspace"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span>DevSuite Hub</span>
            </Link>

            <a
              href="/resume.pdf"
              download="Aryan_Singh_Resume.pdf"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Resume</span>
            </a>

            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-20">

        {/* =========================================================================
             1. HERO SECTION (Genuine, Code-Driven, Professional Presentation)
             ========================================================================= */}
        <section id="home" className="pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Personal Intro */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#EFF6FF] border border-blue-200/80 text-[#2563EB]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Software Engineering Internships</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                  Aryan Singh
                </h1>
                <div className="text-lg sm:text-xl font-medium text-slate-600">
                  Full-Stack Developer & CS Engineering Student
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                I build clean, high-performance web applications and robust full-stack software with modern technologies. Currently pursuing my B.Tech in Computer Science & Engineering at <strong>GL Bajaj Institute of Technology & Management</strong>, Greater Noida.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer hover:shadow"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="/resume.pdf"
                  download="Aryan_Singh_Resume.pdf"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl border border-slate-200 transition-all shadow-xs"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download Resume</span>
                </a>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center gap-2 bg-[#EFF6FF] hover:bg-blue-100 text-[#2563EB] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Social Channels & Contact Links */}
              <div className="flex items-center gap-2.5 pt-3">
                <a
                  href="https://github.com/aryansingh-2008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center rounded-lg text-slate-700 transition-colors shadow-xs"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center rounded-lg text-slate-700 transition-colors shadow-xs"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center rounded-lg text-slate-700 transition-colors shadow-xs"
                  title="Twitter / X Profile"
                >
                  <span className="font-bold text-xs">𝕏</span>
                </a>

                <div className="relative">
                  <button
                    onClick={handleCopyEmail}
                    className="h-9 px-3 border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-xs cursor-pointer"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>aryansingh7052606404@gmail.com</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Genuine Interactive Developer Terminal Window */}
            <div className="lg:col-span-6">
              <div className="relative">
                
                {/* Subtle decorative glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur-xs opacity-70" />

                {/* macOS / IDE Terminal Window */}
                <div className="relative bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
                  
                  {/* Window Titlebar */}
                  <div className="bg-[#F8FAFC] border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                      <Terminal className="w-3.5 h-3.5 text-slate-400" />
                      <span>aryan_singh.config.ts</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Ready</span>
                    </div>
                  </div>

                  {/* Code Area with Syntax Highlighting */}
                  <div className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-800 bg-[#FAFAFA] overflow-x-auto">
                    <div className="text-slate-400">// Engineer profile configuration</div>
                    <div>
                      <span className="text-blue-600 font-semibold">interface</span>{' '}
                      <span className="text-emerald-700 font-semibold">SoftwareEngineer</span> {'{'}
                    </div>
                    <div className="pl-4 text-slate-600">
                      name: <span className="text-amber-700">string</span>;
                    </div>
                    <div className="pl-4 text-slate-600">
                      role: <span className="text-amber-700">string</span>;
                    </div>
                    <div className="pl-4 text-slate-600">
                      institution: <span className="text-amber-700">string</span>;
                    </div>
                    <div className="pl-4 text-slate-600">
                      coreStack: <span className="text-amber-700">string[]</span>;
                    </div>
                    <div className="pl-4 text-slate-600">
                      openToInternships: <span className="text-purple-600">boolean</span>;
                    </div>
                    <div>{'}'}</div>

                    <div className="mt-3">
                      <span className="text-blue-600 font-semibold">export const</span>{' '}
                      <span className="text-slate-900 font-bold">engineer</span>:{' '}
                      <span className="text-emerald-700">SoftwareEngineer</span> = {'{'}
                    </div>
                    <div className="pl-4">
                      name: <span className="text-emerald-600">"Aryan Singh"</span>,
                    </div>
                    <div className="pl-4">
                      role: <span className="text-emerald-600">"Full-Stack Developer"</span>,
                    </div>
                    <div className="pl-4">
                      institution: <span className="text-emerald-600">"GL Bajaj Inst. of Tech (CSE)"</span>,
                    </div>
                    <div className="pl-4">
                      coreStack: [
                      <span className="text-emerald-600">"React"</span>,{' '}
                      <span className="text-emerald-600">"TypeScript"</span>,{' '}
                      <span className="text-emerald-600">"Node.js"</span>,{' '}
                      <span className="text-emerald-600">"Python"</span>,{' '}
                      <span className="text-emerald-600">"SQLite"</span>],
                    </div>
                    <div className="pl-4">
                      openToInternships: <span className="text-purple-600 font-bold">true</span>
                    </div>
                    <div>{'};'}</div>

                    <div className="mt-3 text-slate-400">
                      // Status: Ready to build and collaborate
                    </div>
                    <div className="text-blue-700 font-medium">
                      console.<span className="text-amber-700">log</span>(
                      <span className="text-emerald-600">"Building clean, impactful products 🚀"</span>
                      );
                    </div>
                  </div>

                  {/* Terminal Footer Verification Badges */}
                  <div className="bg-white border-t border-slate-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>All 5 DevSuite Tests Passed</span>
                      </span>
                      <span className="hidden sm:flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-600" />
                        <span>SQLite DB Connected</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">TS 5.x • Node 22</span>
                  </div>

                </div>

                {/* Floating Metric Pill 1 */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white border border-slate-200/90 shadow-md rounded-xl p-3 items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">B.Tech CSE (2025–2029)</div>
                    <div className="text-[11px] text-slate-500">GL Bajaj Institute of Tech</div>
                  </div>
                </div>

                {/* Floating Metric Pill 2 */}
                <div className="hidden sm:flex absolute -top-4 -right-4 bg-white border border-slate-200/90 shadow-md rounded-xl p-3 items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">Full-Stack Web & AI</div>
                    <div className="text-[11px] text-slate-500">React, Node.js & Python</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
             2. STATISTICS STRIP (Row of 5 Authentic Developer Metrics)
             ========================================================================= */}
        <section className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0F172A]">5+</div>
                <div className="text-xs text-slate-500 font-medium">Projects Built</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 pl-0 sm:pl-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0F172A]">2+</div>
                <div className="text-xs text-slate-500 font-medium">Hackathons</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 pl-0 sm:pl-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0F172A]">1+</div>
                <div className="text-xs text-slate-500 font-medium">Internship</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 pl-0 sm:pl-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0F172A]">10+</div>
                <div className="text-xs text-slate-500 font-medium">Repositories</div>
              </div>
            </div>

            {/* Stat 5 */}
            <div className="flex items-center gap-3.5 pt-2 sm:pt-0 pl-0 sm:pl-4 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0F172A]">9.0+</div>
                <div className="text-xs text-slate-500 font-medium">Target CGPA</div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
             3. ABOUT ME & CORE ENGINEERING PILLARS
             ========================================================================= */}
        <section id="about" className="space-y-8">
          
          <div className="space-y-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
              About Me
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
              Engineering with Curiosity & Problem-Solving Discipline
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Bio Details */}
            <div className="lg:col-span-6 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                I am a Computer Science Engineering undergraduate at <strong>GL Bajaj Institute of Technology & Management</strong>, Greater Noida. My technical journey began with competitive programming and data structures, and has grown into building complete, production-ready web applications from frontend interfaces to normalized relational databases.
              </p>
              <p>
                I enjoy understanding how software works under the hood: handling client state transitions, architecting clean REST APIs, ensuring type-safety with TypeScript, and optimizing database queries.
              </p>
              <p>
                I am actively seeking software engineering internship opportunities where I can contribute to real-world codebases, learn from experienced mentors, and deliver measurable business value.
              </p>

              {/* Quick Info Grid */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] border border-slate-200/80 rounded-xl">
                  <div className="text-slate-400 font-medium">Degree</div>
                  <div className="font-bold text-slate-800 mt-0.5">B.Tech Computer Science</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-slate-200/80 rounded-xl">
                  <div className="text-slate-400 font-medium">Location</div>
                  <div className="font-bold text-slate-800 mt-0.5">Greater Noida, UP, India</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-slate-200/80 rounded-xl">
                  <div className="text-slate-400 font-medium">Focus</div>
                  <div className="font-bold text-slate-800 mt-0.5">Full-Stack & Systems</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-slate-200/80 rounded-xl">
                  <div className="text-slate-400 font-medium">Open For</div>
                  <div className="font-bold text-emerald-600 mt-0.5">Internship (Summer / Fall)</div>
                </div>
              </div>
            </div>

            {/* 4 Pillars of Competence */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2 hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Modern Frontend</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  React 18, TypeScript, and Tailwind CSS for responsive, accessible, component-driven user interfaces.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2 hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Backend & APIs</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Node.js, Express, and REST architectures with secure request validation and error handling.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2 hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Database & Systems</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Relational schemas, SQL queries, state management, and reliable backend application architecture.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2 hover:border-blue-300 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Collaboration & Git</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Version control workflow, pull request discussions, issue tracking, and clean documentation.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
             4. TECHNICAL SKILLS SECTION (Categorized, Clean, Comprehensive)
             ========================================================================= */}
        <section id="skills" className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                Technical Stack
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Languages, Frameworks & Tooling
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              Verified on active projects and production builds
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((group) => (
              <div
                key={group.category}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {group.category}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {group.skills.length} Technologies
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 bg-[#F8FAFC] border border-slate-200/70 rounded-xl flex items-center justify-between hover:bg-white hover:border-slate-300 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{skill.name}</div>
                        <div className="text-[10px] text-slate-500">{skill.tag}</div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =========================================================================
             5. FEATURED PROJECTS SECTION (Substantive, Real SaaS & Apps)
             ========================================================================= */}
        <section id="projects" className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                Portfolio Showcase
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Featured Projects & Applications
              </h2>
            </div>
            <a
              href="https://github.com/aryansingh-2008"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>View GitHub Repositories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.title}
                className={`p-6 bg-white border rounded-2xl shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                  proj.featured ? 'border-blue-200/90 ring-1 ring-blue-50' : 'border-slate-200/90'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      {proj.status}
                    </span>
                    {proj.internalLink ? (
                      <Link to={proj.internalLink} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    ) : (
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer action link */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  {proj.internalLink ? (
                    <Link
                      to={proj.internalLink}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
                    >
                      <span>{proj.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
                    >
                      <span>{proj.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <span className="text-[11px] text-slate-400 font-mono">React / Node</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =========================================================================
             6. EXPERIENCE & EDUCATION TIMELINE
             ========================================================================= */}
        <section id="experience" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Work Experience */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
              Experience
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Internship & Industry Exposure
            </h2>

            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Web Development Intern</h3>
                    <div className="text-xs text-slate-500">CodeCrux (Team Project Initiative)</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Jul 2026 – Aug 2026
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc leading-relaxed">
                <li>
                  Engineered responsive, accessible user interfaces using <strong>React.js</strong> and modern CSS utility standards.
                </li>
                <li>
                  Connected frontend components with backend REST APIs and handled asynchronous state updates cleanly.
                </li>
                <li>
                  Collaborated with peer engineers using Git feature branches, pull requests, and peer reviews to maintain code quality.
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">React</span>
                <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">REST APIs</span>
                <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Git Collaboration</span>
              </div>
            </div>
          </div>

          {/* Education Timeline */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
              Education
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Academic Background
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-100">
              
              {/* College */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-3 h-3" />
                </div>
                <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#0F172A]">
                        B.Tech in Computer Science & Engineering
                      </h3>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        GL Bajaj Institute of Technology & Management, Greater Noida
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Coursework: Data Structures, OOPs, Computer Networks, Database Systems
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      2025 – 2029
                    </span>
                  </div>
                </div>
              </div>

              {/* Class XII */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
                  <BookOpen className="w-3 h-3" />
                </div>
                <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#0F172A]">
                        Senior Secondary (Class XII - UP Board)
                      </h3>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Physics, Chemistry, Mathematics (PCM) • <strong>85.0%</strong>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      2024
                    </span>
                  </div>
                </div>
              </div>

              {/* Class X */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-400 text-white flex items-center justify-center shadow-xs">
                  <BookOpen className="w-3 h-3" />
                </div>
                <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#0F172A]">
                        Secondary School (Class X - UP Board)
                      </h3>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        General Sciences & Mathematics • <strong>88.5%</strong>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      2022
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* =========================================================================
             7. CONTACT FORM & GET IN TOUCH (Functional SQLite backend integration)
             ========================================================================= */}
        <section id="contact" className="space-y-6">
          
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Let's Discuss Opportunities & Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Information Cards */}
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you have an internship opening, a project collaboration idea, or want to discuss software engineering, my inbox is always open.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Direct Email</div>
                    <a href="mailto:aryansingh7052606404@gmail.com" className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                      aryansingh7052606404@gmail.com
                    </a>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Location</div>
                    <div className="text-xs font-semibold text-slate-800">
                      Greater Noida, Uttar Pradesh, India
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Work Availability</div>
                    <div className="text-xs font-semibold text-slate-800">
                      Available for Internships & Projects
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume download prompt */}
              <div className="p-4 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-xs space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Looking for a complete PDF resume?</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Download my verified technical resume complete with education, projects, skills, and coursework.
                </p>
                <a
                  href="/resume.pdf"
                  download="Aryan_Singh_Resume.pdf"
                  className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline pt-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>
            </div>

            {/* Direct Contact Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Send a Message
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Submissions are validated and stored directly in the SQLite database.
              </p>

              {status && (
                <div
                  className={`p-3.5 mb-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Your Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Your Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        required
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Subject</label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Internship Inquiry / Project Collaboration"
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Message *</label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      required
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all resize-y"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </section>

      </main>

      {/* =========================================================================
           8. FOOTER (ScamShield White SaaS Standards)
           ========================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AS
            </div>
            <div>
              <div className="font-bold text-xs text-[#0F172A]">Aryan Singh</div>
              <div className="text-[11px] text-slate-400">Software Engineer • GL Bajaj Institute of Technology</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 text-slate-500">
            <a href="https://github.com/aryansingh-2008" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 p-1">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] p-1">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 p-1 font-bold text-xs">
              𝕏
            </a>
            <a href="mailto:aryansingh7052606404@gmail.com" className="hover:text-slate-900 p-1">
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>

        <div className="text-center text-[11px] text-slate-400 pt-6 mt-6 border-t border-slate-100">
          © 2026 Aryan Singh. All rights reserved. • Built with React, TypeScript & Tailwind CSS
        </div>
      </footer>

      {/* Floating DevSuite Switcher */}
      <div className="fixed bottom-5 right-5 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5 border border-slate-700/50 group"
          title="Return to InternCircle DevSuite Workspace"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>DevSuite Workspace</span>
        </Link>
      </div>

    </div>
  );
};
export default Portfolio;
