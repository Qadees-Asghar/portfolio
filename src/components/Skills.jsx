import React from 'react';
import { skillsMatrix } from '../data/portfolioData';
import { Cpu, Code2, Layers, Wrench, Sparkles, CheckCircle } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

export default function Skills() {
  const getCategoryIcon = (idx) => {
    switch (idx) {
      case 0: return <Code2 className="w-5 h-5 text-cyan-400" aria-hidden="true" />;
      case 1: return <Cpu className="w-5 h-5 text-purple-400" aria-hidden="true" />;
      case 2: return <Layers className="w-5 h-5 text-blue-400" aria-hidden="true" />;
      default: return <Wrench className="w-5 h-5 text-emerald-400" aria-hidden="true" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative z-10 bg-[#0a0d14]/70" aria-labelledby="skills-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeader
          icon={Sparkles}
          badge="Technical Capabilities"
          accent="cyan"
          title={
            <span id="skills-heading">
              Skills &amp; <span className="gradient-text">Tech Stack</span>
            </span>
          }
          description="Comprehensive overview of programming languages, AI/ML tools, full-stack frameworks, and development environments."
        />

        {/* Skills Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillsMatrix.map((cat, idx) => (
            <Reveal
              key={idx}
              delay={(idx % 2) * 100}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
            >
              {/* Category Title */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(idx)}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {cat.category}
                </h3>
              </div>

              {/* Skills Grid Pills */}
              <div className="grid grid-cols-2 gap-3">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-2xl bg-[#0a0d14]/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between group/skill"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 group-hover/skill:scale-110 transition-transform" aria-hidden="true" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-200">
                        {skill.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
