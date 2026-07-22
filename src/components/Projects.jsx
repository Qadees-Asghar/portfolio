import React, { useState, useEffect } from 'react';
import { projectsData } from '../data/portfolioData';
import { Github, Cpu, Globe, Monitor, Terminal, Layout, X, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Full-Stack / Web', 'AI & Algorithms', 'Desktop & Systems', 'Python Systems'];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  // Close the details modal with the Escape key (accessibility).
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject]);

  const getProjectIcon = (iconName) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-cyan-400" aria-hidden="true" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-400" aria-hidden="true" />;
      case 'Monitor': return <Monitor className="w-5 h-5 text-blue-400" aria-hidden="true" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" aria-hidden="true" />;
      default: return <Layout className="w-5 h-5 text-cyan-400" aria-hidden="true" />;
    }
  };

  return (
    <section id="projects" className="py-24 relative z-10 bg-[#0a0d14]/60" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeader
          icon={Sparkles}
          badge="Featured Software Projects & Repositories"
          accent="cyan"
          title={
            <span id="projects-heading">
              Portfolio <span className="gradient-text">Projects</span>
            </span>
          }
          description="Exploring system architecture, algorithms, database normalization, and enterprise web solutions."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12" role="group" aria-label="Filter projects by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold shadow-lg shadow-cyan-500/20 scale-105'
                  : 'bg-[#121723] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <Reveal
              key={project.id}
              delay={(idx % 3) * 90}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${project.title}`}
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Subtle top border hover highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {getProjectIcon(project.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-purple-950/70 border border-purple-500/30 text-purple-300">
                      {project.badge}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.summary}
                </p>
              </div>

              {/* Tech Tags & CTA */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/90 text-slate-300 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-medium">
                  <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-mono">
                    View Details &amp; Architecture <span aria-hidden="true">→</span>
                  </span>
                  <div className="p-1.5 text-slate-400 group-hover:text-white rounded-lg bg-slate-900">
                    <Github className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Detailed Modal Drawer */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-[#121723] border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  {getProjectIcon(selectedProject.icon)}
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    {selectedProject.category}
                  </span>
                  <h3 id="project-modal-title" className="text-2xl font-extrabold text-white">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 my-6">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Key Highlights */}
                <div className="bg-[#0a0d14] rounded-2xl p-5 border border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-purple-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" aria-hidden="true" />
                    <span>Technical Highlights &amp; Features</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Complete Tech Stack */}
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Technologies & Frameworks Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${selectedProject.title} repository on GitHub (opens in a new tab)`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs sm:text-sm transition-all"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>View Repository on GitHub</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Close Window
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
