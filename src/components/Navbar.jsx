import React, { useState, useEffect } from 'react';
import { Terminal, Command, Github, Linkedin, Menu, X } from 'lucide-react';
import { personalData } from '../data/portfolioData';

export default function Navbar({ onOpenCommandPalette, onToggleTerminal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0d14]/85 backdrop-blur-md border-b border-slate-800/80 py-3.5 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#about" className="flex items-center gap-3 group" aria-label="Qadees Asghar — back to top">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform" aria-hidden="true">
            <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-lg">
              QA
            </div>
          </div>
          <div>
            <span className="font-bold text-slate-100 tracking-tight text-lg group-hover:text-cyan-400 transition-colors">
              Qadees Asghar
            </span>
            <span className="block text-xs text-slate-400 font-mono">UET Lahore SE</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121723]/60 backdrop-blur-lg px-4 py-1.5 rounded-full border border-slate-800/80" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors rounded-full hover:bg-slate-800/50"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Quick Action Tools */}
        <div className="hidden md:flex items-center gap-3">
          {/* Command Palette Button */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-mono transition-all group"
            aria-label="Open command search (Command or Control + K)"
          >
            <Command className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" aria-hidden="true" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Interactive Terminal Button */}
          <button
            type="button"
            onClick={onToggleTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold transition-all hover:scale-105"
            aria-label="Open interactive CLI terminal"
          >
            <Terminal className="w-4 h-4" aria-hidden="true" />
            <span>CLI</span>
          </button>

          {/* Direct Social Links */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <a
              href={personalData.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              aria-label="Qadees Asghar on GitHub (opens in a new tab)"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href={personalData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors"
              aria-label="Qadees Asghar on LinkedIn (opens in a new tab)"
            >
              <Linkedin className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onToggleTerminal}
            aria-label="Open interactive CLI terminal"
            className="p-2 text-cyan-400 bg-cyan-950/40 rounded-lg border border-cyan-500/30"
          >
            <Terminal className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="p-2 text-slate-300 hover:text-white bg-slate-800/60 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="md:hidden bg-[#0a0d14]/95 border-b border-slate-800 px-4 pt-3 pb-6 mt-3 space-y-3 backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/40 rounded-lg font-medium text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              aria-label="Open command search"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-xs font-mono text-slate-300"
            >
              <Command className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span>Search (⌘K)</span>
            </button>

            <div className="flex gap-3">
              <a
                href={personalData.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Qadees Asghar on GitHub (opens in a new tab)"
                className="p-2 text-slate-300 hover:text-white bg-slate-800/50 rounded-lg"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={personalData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Qadees Asghar on LinkedIn (opens in a new tab)"
                className="p-2 text-slate-300 hover:text-cyan-400 bg-slate-800/50 rounded-lg"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
