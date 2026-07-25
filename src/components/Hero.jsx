import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, Terminal, Sparkles, Github, Linkedin, Mail, MapPin, GraduationCap } from 'lucide-react';
import { personalData } from '../data/portfolioData';

export default function Hero({ onToggleTerminal }) {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % personalData.taglines.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Dynamic Ambient Background Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Profile Info */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121723] border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
              <span>Available for Software Engineering Roles</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            </div>

            {/* Main Name & Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I'm{' '}
                <span className="gradient-text font-serif">
                  Qadees Asghar
                </span>
              </h1>

              {/* Dynamic Animated Tagline */}
              <div className="h-10 mt-2 flex items-center justify-center lg:justify-start">
                <p className="text-lg sm:text-xl font-mono text-cyan-400 font-medium transition-all duration-500" aria-live="polite">
                  {personalData.taglines[currentTaglineIndex]}
                </p>
              </div>
            </div>

            {/* Personal Bio */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Software Engineering Student at <strong className="text-white">UET Lahore</strong> specializing in{' '}
              <span className="text-cyan-300 font-medium">ASP.NET Core MVC</span>,{' '}
              <span className="text-purple-300 font-medium">C# &amp; .NET</span>, and{' '}
              <span className="text-cyan-300 font-medium">React Full-Stack Systems</span>. Dedicated to engineering robust, well-architected software from normalized database schemas to responsive user interfaces.
            </p>

            {/* Quick Metadata Info */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-400 font-mono pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <GraduationCap className="w-4 h-4 text-purple-400" aria-hidden="true" />
                <span>UET Lahore (BS SE '29)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <MapPin className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>

            {/* Action Call To Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onToggleTerminal}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#121723] hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 font-mono text-sm transition-all hover:scale-105"
              >
                <Terminal className="w-4 h-4" aria-hidden="true" />
                <span>Run Interactive CLI</span>
              </button>

              <a
                href="#contact"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm transition-all hover:scale-105"
              >
                <Mail className="w-4 h-4 text-purple-400" aria-hidden="true" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Icons Bar */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Connect:</span>
              <a
                href={personalData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                aria-label="Qadees Asghar on GitHub (opens in a new tab)"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={personalData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                aria-label="Qadees Asghar on LinkedIn (opens in a new tab)"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={personalData.socials.emailPrimary}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-purple-400 hover:border-purple-500/50 hover:bg-slate-800 transition-all"
                aria-label="Email Qadees Asghar"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Qadees's Profile Image Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              
              {/* Outer Pulsing Glow Aura */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-400 opacity-60 blur-xl group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow" aria-hidden="true" />

              {/* Image Frame Card */}
              <div className="relative rounded-3xl bg-[#0a0d14] p-3 border border-slate-700/80 shadow-2xl overflow-hidden">
                <img
                  src="/profile.jpg"
                  alt="Portrait of Qadees Asghar, Software Engineering student at UET Lahore and Full Stack Developer"
                  width="448"
                  height="420"
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-[300px] sm:h-[360px] md:h-[420px] object-cover object-[50%_25%] rounded-2xl filter brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Glassmorphic Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-panel border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-base">Qadees Asghar</p>
                      <p className="text-xs text-cyan-300 font-mono">Software Engineering @ UET</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-black font-bold">
                      <Code className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Highlight Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {personalData.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl text-center border border-slate-800/80 hover:border-cyan-500/40 transition-all group"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
