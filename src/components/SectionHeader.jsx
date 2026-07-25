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
 *
 * The former `accent` prop offered a purple variant; the site now runs a
 * single accent, so it has been removed rather than left as dead surface.
 */
export default function SectionHeader({ icon: Icon, badge, title, description }) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface text-micro font-mono uppercase text-fg-subtle">
        {Icon && <Icon className="w-3 h-3" aria-hidden="true" />}
        <span>{badge}</span>
      </div>

      <h2 className="mt-5 text-h2 font-semibold text-fg">{title}</h2>

      {description && <p className="mt-4 text-lead text-fg-muted">{description}</p>}
    </Reveal>
  );
}
