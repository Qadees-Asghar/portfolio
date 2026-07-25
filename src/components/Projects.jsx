import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { projectsData } from '../data/portfolioData';
import { Github, Cpu, Globe, Monitor, Terminal, Layout, X, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const EASE = [0.16, 1, 0.3, 1];

const PROJECT_ICONS = {
  Globe,
  Cpu,
  Monitor,
  Terminal,
};

function ProjectIcon({ name, className }) {
  const Icon = PROJECT_ICONS[name] || Layout;
  return <Icon className={className} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

/**
 * Project details dialog.
 *
 * Rendered through a portal so it escapes <main>'s stacking context, and
 * implements the three things the previous version promised via
 * `aria-modal` but did not actually do: a focus trap, focus restoration
 * to the element that opened it, and a background scroll lock.
 */
function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusables = () =>
      [...dialog.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )].filter((el) => el.offsetParent !== null);

    (focusables()[0] || dialog).focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-950/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      onClick={onClose}
    >
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.32, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-2xl max-h-[88vh] rounded-panel surface-raised shadow-2xl shadow-black/60 focus:outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-9 h-9 rounded-field text-fg-subtle hover:text-fg hover:bg-ink-700 transition-colors duration-200"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 pr-10">
            <div className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-card bg-ink-900 border border-ink-700">
              <ProjectIcon name={project.icon} className="w-5 h-5 text-accent-400" />
            </div>
            <div className="min-w-0">
              <p className="text-micro font-mono uppercase text-fg-subtle">
                {project.category}
              </p>
              <h3 id="project-modal-title" className="mt-1 text-h3 font-semibold text-fg">
                {project.title}
              </h3>
            </div>
          </div>

          <p className="mt-6 text-body text-fg-muted">{project.description}</p>

          {/* Highlights */}
          <div className="mt-6 rounded-card bg-ink-900 border border-ink-700 p-5">
            <h4 className="text-micro font-mono uppercase text-fg-subtle">
              Technical highlights
            </h4>
            <ul className="mt-4 space-y-2.5">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-body text-fg-muted">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent-400" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div className="mt-6">
            <h4 className="text-micro font-mono uppercase text-fg-subtle">
              Technologies used
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="px-2.5 py-1 rounded-field bg-ink-900 border border-ink-700 text-label font-mono text-fg-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-ink-700 flex items-center justify-between gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} repository on GitHub (opens in a new tab)`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-card bg-accent-400 hover:bg-accent-300 text-ink-950 font-medium text-body transition-colors duration-300"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              View repository
            </a>
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-card text-body font-medium text-fg-muted hover:text-fg transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </m.div>
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

/**
 * The card is an <article>, not a button. The title carries the only
 * card-level control, and its ::after overlay extends the hit area across
 * the whole card — so the entire surface stays clickable while exposing a
 * single, correctly-labelled control to assistive tech. The repository
 * link sits above that overlay as a genuine second link, rather than the
 * previous decorative icon that looked clickable but wasn't.
 */
function ProjectCard({ project, index, onOpen }) {
  return (
    <Reveal
      as="article"
      delay={(index % 3) * 80}
      className="group relative flex flex-col rounded-panel surface surface-interactive p-6
                 focus-within:ring-2 focus-within:ring-accent-400 focus-within:ring-offset-2 focus-within:ring-offset-ink-950"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-card bg-ink-900 border border-ink-700">
          <ProjectIcon name={project.icon} className="w-5 h-5 text-accent-400" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span className="px-2 py-0.5 rounded-field bg-ink-900 border border-ink-700 text-micro font-mono text-fg-subtle">
            {project.badge}
          </span>
          <span className="px-2 py-0.5 rounded-field bg-ink-900 border border-ink-700 text-micro font-mono text-accent-300">
            {project.status}
          </span>
        </div>
      </div>

      <h3 className="mt-5 text-h3 font-semibold text-fg">
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="text-left transition-colors duration-300 group-hover:text-accent-300
                     after:absolute after:inset-0 after:rounded-panel after:content-['']
                     focus-visible:outline-none"
        >
          {project.title}
        </button>
      </h3>

      <p className="mt-3 text-body text-fg-muted line-clamp-3">{project.summary}</p>

      {/* Stack preview */}
      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((tech) => (
          <li
            key={tech}
            className="px-2 py-0.5 rounded-field bg-ink-900 border border-ink-700 text-micro font-mono text-fg-subtle"
          >
            {tech}
          </li>
        ))}
        {project.tech.length > 4 && (
          <li className="px-2 py-0.5 text-micro font-mono text-fg-subtle">
            +{project.tech.length - 4}
          </li>
        )}
      </ul>

      {/* Footer — pushed to the bottom so cards align regardless of copy length */}
      <div className="mt-auto pt-6 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-label font-medium text-accent-300" aria-hidden="true">
          View details
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} repository on GitHub (opens in a new tab)`}
          className="relative z-10 inline-flex items-center justify-center w-8 h-8 rounded-field text-fg-subtle hover:text-fg hover:bg-ink-700 transition-colors duration-300"
        >
          <Github className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const CATEGORIES = ['All', 'Full-Stack / Web', 'AI & Algorithms', 'Desktop & Systems', 'Python Systems'];

export default function Projects({ selectedProject, setSelectedProject }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const returnFocusTo = useRef(null);

  const filteredProjects =
    activeCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  const openModal = useCallback(
    (project) => {
      // Remember the card that opened the dialog so focus can return to it.
      returnFocusTo.current = document.activeElement;
      setSelectedProject(project);
    },
    [setSelectedProject]
  );

  const closeModal = useCallback(() => setSelectedProject(null), [setSelectedProject]);

  /**
   * Background scroll lock and focus restoration.
   *
   * Deliberately keyed to `selectedProject` here rather than to the dialog's
   * unmount: the dialog outlives dismissal by the length of its exit
   * animation, and a paused animation (e.g. the user switches tabs mid-close)
   * would otherwise leave the page scroll-locked indefinitely. Tying these to
   * the state change releases them the instant the dialog is dismissed.
   */
  useEffect(() => {
    if (!selectedProject) return;

    // Compensate for the scrollbar so the page behind cannot shift sideways.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadRight;
      returnFocusTo.current?.focus?.();
    };
  }, [selectedProject]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section id="projects" className="relative py-24 md:py-30" aria-labelledby="projects-heading">
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
          <SectionHeader
            icon={Sparkles}
            badge="Selected work"
            title={<span id="projects-heading">Projects</span>}
            description="System architecture, algorithms, and full-stack web applications — built end to end."
          />

          {/* Filters */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
            role="group"
            aria-label="Filter projects by category"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isActive}
                  className={`h-9 px-4 rounded-full text-label font-medium transition-colors duration-300 ${
                    isActive
                      ? 'bg-accent-400 text-ink-950'
                      : 'surface text-fg-muted hover:text-fg hover:bg-ink-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onOpen={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The portal wraps AnimatePresence, not the other way round:
          AnimatePresence has to see the motion element as its own direct
          child to track mount/unmount, and a portal element hides it. */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              key={selectedProject.id}
              project={selectedProject}
              onClose={closeModal}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </LazyMotion>
  );
}
