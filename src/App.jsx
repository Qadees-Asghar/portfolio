import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BackgroundCanvas from './components/BackgroundCanvas';

// Code-splitting: below-the-fold sections and overlays are loaded on demand,
// shrinking the initial JS bundle and improving first-load performance.
const Projects = lazy(() => import('./components/Projects'));
const Education = lazy(() => import('./components/Education'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const TerminalDrawer = lazy(() => import('./components/TerminalDrawer'));

// Minimal, unobtrusive fallback while a lazy chunk loads.
function SectionFallback() {
  return (
    <div className="py-24 flex items-center justify-center" aria-hidden="true">
      <div className="w-5 h-5 rounded-full border-2 border-ink-700 border-t-accent-400 animate-spin" />
    </div>
  );
}

export default function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Global ⌘K / Ctrl+K shortcut to toggle the command palette.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-ink-950 text-fg selection:bg-accent-400 selection:text-ink-950 font-sans relative overflow-x-hidden">
      {/* Dynamic Animated Particle & Grid Background */}
      <BackgroundCanvas />

      {/* Subtle film-grain overlay for premium depth */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Header Navigation */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        hidden={!!selectedProject}
      />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10">
        <Hero onToggleTerminal={() => setIsTerminalOpen(true)} />

        {/* One boundary per section: each chunk streams in as soon as it
            resolves, instead of all four blocking on the slowest. */}
        <Suspense fallback={<SectionFallback />}>
          <Projects selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Education />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>

      {/* Interactive Floating Tools (lazy — only when opened) */}
      <Suspense fallback={null}>
        {isCommandPaletteOpen && (
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
          />
        )}

        {isTerminalOpen && (
          <TerminalDrawer isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        )}
      </Suspense>

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
