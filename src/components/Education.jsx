import React from 'react';
import { educationData } from '../data/portfolioData';
import { GraduationCap, BookOpen, Award, CheckCircle2, MapPin, Calendar, Building2 } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-xs font-mono text-purple-300">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Background</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & <span className="gradient-text">Academic Record</span>
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base">
            Gaining rigorous computer science foundations and software engineering principles at Pakistan's premier engineering university.
          </p>
        </div>

        {/* Education Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main University Card */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-xl">
                    <div className="w-full h-full bg-[#0a0d14] rounded-[14px] flex items-center justify-center text-cyan-400">
                      <Building2 className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      {educationData.university}
                    </h3>
                    <p className="text-xs sm:text-sm text-cyan-400 font-mono mt-1">
                      {educationData.department}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="inline-block px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-sm font-semibold">
                  {educationData.degree}
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>{educationData.years}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>{educationData.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-2">
                Focusing on theoretical software engineering, machine learning architectures, high-performance C#/.NET development, and big data processing models.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Status: Active Enrolled</span>
              <span className="text-cyan-400 font-semibold">Department of Computer Science</span>
            </div>
          </div>

          {/* Relevant Coursework Matrix */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-800 pb-4">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Core Coursework & Concepts</span>
            </div>

            <div className="space-y-3 pt-2">
              {educationData.courses.map((course, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0d14]/70 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200 font-medium">{course}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
