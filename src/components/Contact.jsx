import React, { useState } from 'react';
import { personalData } from '../data/portfolioData';
import { Mail, Linkedin, Github, Copy, Check, Send, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalData.emails.primary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's Build <span className="gradient-text">Together</span>
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base">
            Open for technical roles, machine learning research, software engineering internships, and open-source collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info & Copy Buttons */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Contact Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Contact Channels</span>
              </h3>

              {/* Copy Email Bar */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800 flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Primary Email</span>
                  <span className="text-xs sm:text-sm font-mono text-cyan-300 font-semibold truncate block">
                    {personalData.emails.primary}
                  </span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Secondary Email */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">Secondary Email</span>
                <a
                  href={`mailto:${personalData.emails.secondary}`}
                  className="text-xs sm:text-sm font-mono text-purple-300 font-semibold hover:underline block mt-0.5"
                >
                  {personalData.emails.secondary}
                </a>
              </div>

              {/* Social Channels List */}
              <div className="space-y-3 pt-2">
                <a
                  href={personalData.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0d14]/80 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-400 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 text-cyan-400">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-bold">LinkedIn</span>
                      <span className="block text-[10px] font-mono text-slate-500">Connect Professionally</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                </a>

                <a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0d14]/80 border border-slate-800 hover:border-purple-500/40 text-slate-200 hover:text-purple-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 text-purple-400">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-bold">GitHub Repositories</span>
                      <span className="block text-[10px] font-mono text-slate-500">Explore Open Source</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-purple-300 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80">
            <h3 className="text-xl font-bold text-white mb-6">
              Send a Direct Message
            </h3>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Thank you for reaching out! Qadees will get back to you at your email as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Smith"
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hello Qadees, I'd like to discuss a project..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Global Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-800/80 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span>© {new Date().getFullYear()} Qadees Asghar</span>
            <span>•</span>
            <span>UET Lahore BS Software Engineering</span>
            <span>•</span>
            <span className="text-cyan-400">Ready for Vercel Deployment</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Crafted with React, Vite, Tailwind CSS & Framer Motion dynamics.
          </p>
        </footer>

      </div>
    </section>
  );
}
