import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Plus,
  Search,
  Filter,
  Check,
  X,
  ListTodo,
  Sparkles
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'interncircle_todo_tasks';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Complete InternCircle Project 01 portfolio page', category: 'Dev', completed: true, createdAt: '2026-11-01' },
  { id: '2', title: 'Implement LocalStorage persistence for Daymark To-Do', category: 'Dev', completed: true, createdAt: '2026-11-02' },
  { id: '3', title: 'Test 20% billing calculation for SaaS pricing cards', category: 'QA', completed: false, createdAt: '2026-11-02' },
  { id: '4', title: 'Configure Open-Meteo REST API fallback proxy', category: 'API', completed: false, createdAt: '2026-11-02' },
  { id: '5', title: 'Submit final repository links to mentor review dashboard', category: 'Review', completed: false, createdAt: '2026-11-02' }
];

export const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [inputTitle, setInputTitle] = useState('');
  const [inputCategory, setInputCategory] = useState('Dev');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Sync to LocalStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: inputTitle.trim(),
      category: inputCategory,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks([newTask, ...tasks]);
    setInputTitle('');
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title: editTitle.trim() } : t)));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const clearCompleted = () => {
    if (window.confirm('Are you sure you want to remove all completed tasks?')) {
      setTasks(tasks.filter((t) => !t.completed));
    }
  };

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter & Search
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'pending') return matchesSearch && !t.completed;
    if (filter === 'completed') return matchesSearch && t.completed;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header card */}
      <div className="scamshield-card p-6 bg-white border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              PROJECT 02
            </span>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
              LocalStorage Active
            </span>
          </div>
          <h1 className="text-xl font-semibold text-[#172033]">Interactive Task Manager</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Full task lifecycle with instant LocalStorage caching. Add, edit, filter, and track completion.
          </p>
        </div>

        <button
          onClick={clearCompleted}
          disabled={completedTasks === 0}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Clear Completed ({completedTasks})
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium">Total Tasks</div>
          <div className="text-2xl font-bold font-mono text-[#172033] mt-1">{totalTasks}</div>
        </div>
        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium">Completed</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">{completedTasks}</div>
        </div>
        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium">Pending Tasks</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{pendingTasks}</div>
        </div>
        <div className="scamshield-card p-4">
          <div className="text-xs text-[#64748B] font-medium">Progress</div>
          <div className="text-2xl font-bold font-mono text-[#2563EB] mt-1">{progressPercent}%</div>
        </div>
      </div>

      {/* Add Task Form */}
      <div className="scamshield-card p-5">
        <form onSubmit={addTask} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            placeholder="Add a new task (e.g. Implement REST API unit tests)..."
            className="flex-1 w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={inputCategory}
              onChange={(e) => setInputCategory(e.target.value)}
              className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="Dev">Dev</option>
              <option value="Design">Design</option>
              <option value="QA">QA</option>
              <option value="Review">Review</option>
              <option value="Personal">Personal</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="scamshield-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or category..."
            className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto border border-[#E5E7EB] rounded-lg p-1 bg-[#F8FAFC]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-[#2563EB] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalTasks})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-white text-[#2563EB] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingTasks})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-white text-[#2563EB] shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedTasks})
          </button>
        </div>
      </div>

      {/* Task Items List */}
      <div className="scamshield-card divide-y divide-[#E5E7EB]">
        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            No tasks found. Use the input box above to create a new task.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex items-center justify-between gap-3 hover:bg-[#F8FAFC]/80 transition-colors ${
                task.completed ? 'bg-slate-50/50' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-blue-500" />
                  )}
                </button>

                {editingId === task.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-white border border-[#2563EB] rounded px-2.5 py-1 text-xs text-[#172033] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <span
                      onClick={() => toggleComplete(task.id)}
                      className={`text-xs cursor-pointer block truncate ${
                        task.completed ? 'line-through text-slate-400 font-normal' : 'text-[#172033] font-medium'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                        {task.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{task.createdAt}</span>
                    </div>
                  </div>
                )}
              </div>

              {editingId !== task.id && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
