import React from 'react';
import Reveal from './Reveal';

/**
 * Reusable section header: eyebrow badge + heading + description.
 * Consolidates the near-identical markup previously duplicated across
 * the Projects, Education, Skills and Contact sections.
 *
 * @param {React.ElementType} icon  - lucide-react icon component for the badge
 * @param {string} badge            - small eyebrow label text
 * @param {React.ReactNode} title   - the h2 content (may include a .gradient-text span)
 * @param {string} description      - supporting paragraph
 * @param {'cyan'|'purple'} accent  - badge colour theme (default 'cyan')
 */
export default function SectionHeader({ icon: Icon, badge, title, description, accent = 'cyan' }) {
  const accentClasses =
    accent === 'purple'
      ? 'bg-purple-950/50 border-purple-500/30 text-purple-300'
      : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400';

  return (
    <Reveal className="text-center max-w-3xl mx-auto space-y-3 mb-14">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono ${accentClasses}`}
      >
        {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
        <span>{badge}</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h2>

      {description && <p className="text-slate-400 text-sm sm:text-base">{description}</p>}
    </Reveal>
  );
}
