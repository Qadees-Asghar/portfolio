import React, { useState, useEffect } from 'react';
import { Search, Command, X, ArrowRight, Github, Linkedin, Mail, ExternalLink, Code, GraduationCap, Cpu } from 'lucide-react';
import { personalData, projectsData } from '../data/portfolioData';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { name: 'View Projects Showcase', href: '#projects', type: 'Section', icon: Code },
    { name: 'Academic Record & UET Details', href: '#education', type: 'Section', icon: GraduationCap },
    { name: 'Technical Skills Matrix', href: '#skills', type: 'Section', icon: Cpu },
    { name: 'Contact Qadees Asghar', href: '#contact', type: 'Section', icon: Mail },
    { name: 'GitHub Profile', href: personalData.socials.github, type: 'External', icon: Github },
    { name: 'LinkedIn Profile', href: personalData.socials.linkedin, type: 'External', icon: Linkedin },
  ];

  const filteredProjects = projectsData.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.tech.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredActions = quickActions.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121723] border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search projects & skills..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-mono"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          
          {/* Quick Nav Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Navigation & Socials
              </div>
              <div className="space-y-1 mt-1">
                {filteredActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={idx}
                      href={action.href}
                      target={action.type === 'External' ? '_blank' : '_self'}
                      rel="noreferrer"
                      onClick={onClose}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-slate-200 hover:text-cyan-400 group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">{action.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {action.type}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredProjects.map((project) => (
                  <a
                    key={project.id}
                    href="#projects"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors text-slate-200 hover:text-cyan-400 group"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400">
                        {project.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {project.badge} • {project.category}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {filteredActions.length === 0 && filteredProjects.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs font-mono">
              No matching commands found for "{query}".
            </div>
          )}

        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#0a0d14] border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Navigate with mouse or keyboard</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
}
