import React, { useState, useEffect, useRef } from 'react';
/**
 * Framer Motion is used only where CSS genuinely can't do the job well:
 * the enter/exit crossfade of the rotating tagline, and the magnetic CTA.
 *
 * The entrance stagger is deliberately NOT here — it lives in CSS
 * (`.hero-in` in index.css). The hero holds the LCP element, and gating it
 * behind hydration + a motion library would leave it invisible until JS
 * runs. `m` + LazyMotion loads only the DOM animation feature set
 * (~15 kB gz vs ~34 kB for the full `motion` bundle); `strict` makes the
 * cheaper import mandatory so the saving can't silently regress.
 */
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Terminal, Github, Linkedin, Mail, MapPin, GraduationCap } from 'lucide-react';
import { personalData } from '../data/portfolioData';

/* Site-wide motion language: one easing curve, short distances, no bounce. */
const EASE = [0.16, 1, 0.3, 1];

/** Stagger step for the CSS entrance, in ms. */
const step = (n) => ({ '--d': `${n * 70}ms` });

/**
 * Primary call-to-action with a restrained magnetic pull.
 * Capped at 4px of travel — enough to feel responsive under the cursor,
 * not enough to read as a gimmick. Disabled entirely for reduced motion
 * and on coarse (touch) pointers, where it has no meaning.
 */
function MagneticLink({ href, children, className = '' }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMove = (e) => {
    if (prefersReduced || !ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setOffset({ x: relX * 4, y: relY * 4 });
  };

  return (
    <m.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.4 }}
      className={className}
    >
      {children}
    </m.a>
  );
}

/** Rotating tagline with a true crossfade (the old version hard-cut). */
function Tagline() {
  const [index, setIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % personalData.taglines.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    // Fixed height reserves the line box, so rotation can never shift layout.
    <div className="mt-5 h-7 flex items-center justify-center lg:justify-start">
      <AnimatePresence mode="wait" initial={false}>
        <m.p
          key={index}
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="font-mono text-body text-accent-300"
          /* Hidden from assistive tech: the previous implementation used
             aria-live, which announced a new tagline every few seconds,
             indefinitely. The static list below is exposed instead. */
          aria-hidden="true"
        >
          {personalData.taglines[index]}
        </m.p>
      </AnimatePresence>
      <span className="sr-only">{personalData.taglines.join('. ')}</span>
    </div>
  );
}

export default function Hero({ onToggleTerminal }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <section id="about" className="relative pt-32 pb-24 md:pt-40 md:pb-30">
        <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">

            {/* ---------------- Left: identity, copy, actions ---------------- */}
            <div className="lg:col-span-7 text-center lg:text-left">

              {/* Availability — solid surface, single small accent dot. */}
              <div className="hero-in" style={step(0)}>
                <div className="inline-flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-full surface text-label text-fg-muted">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
                  </span>
                  Available for Software Engineering roles
                </div>
              </div>

              {/* Name — the anchor of the page. Size and tracking, not weight. */}
              <h1 className="hero-in mt-7 text-display font-semibold text-fg" style={step(1)}>
                <span className="block text-fg-subtle font-normal text-lead tracking-normal mb-3">
                  Hi, I'm
                </span>
                Qadees Asghar
              </h1>

              <div className="hero-in" style={step(2)}>
                <Tagline />
              </div>

              {/* Bio — 17px, constrained measure. Emphasis via weight on the
                  foreground ramp only; no coloured keyword confetti. */}
              <p
                className="hero-in mt-7 text-lead text-fg-muted max-w-[58ch] mx-auto lg:mx-0"
                style={step(3)}
              >
                Software Engineering Student at <strong className="font-medium text-fg">UET Lahore</strong>{' '}
                building full-stack applications with <strong className="font-medium text-fg">ASP.NET Core MVC</strong>,{' '}
                <strong className="font-medium text-fg">C#</strong>, <strong className="font-medium text-fg">.NET</strong>,{' '}
                <strong className="font-medium text-fg">ADO.NET</strong>, and{' '}
                <strong className="font-medium text-fg">SQL Server</strong>.
              </p>

              {/* Metadata */}
              <div
                className="hero-in mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-label text-fg-subtle"
                style={step(4)}
              >
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" aria-hidden="true" />
                  UET Lahore · BS SE '29
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  Lahore, Pakistan
                </span>
              </div>

              {/* Actions — one primary, one secondary, one tertiary. */}
              <div
                className="hero-in mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3"
                style={step(5)}
              >
                <MagneticLink
                  href="#projects"
                  className="group inline-flex items-center gap-2 h-11 px-5 rounded-card bg-accent-400 hover:bg-accent-300 text-ink-950 font-medium text-body transition-colors duration-300"
                >
                  View projects
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 ease-premium group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </MagneticLink>

                <button
                  type="button"
                  onClick={onToggleTerminal}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-card surface surface-interactive text-fg text-body font-medium"
                >
                  <Terminal className="w-4 h-4 text-accent-400" aria-hidden="true" />
                  Run interactive CLI
                </button>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 h-11 px-4 rounded-card text-fg-muted hover:text-fg text-body font-medium transition-colors duration-300"
                >
                  Get in touch
                </a>
              </div>

              {/* Socials */}
              <div
                className="hero-in mt-9 flex items-center justify-center lg:justify-start gap-2"
                style={step(6)}
              >
                {[
                  { href: personalData.socials.github, Icon: Github, label: 'Qadees Asghar on GitHub (opens in a new tab)', external: true },
                  { href: personalData.socials.linkedin, Icon: Linkedin, label: 'Qadees Asghar on LinkedIn (opens in a new tab)', external: true },
                  { href: personalData.socials.emailPrimary, Icon: Mail, label: 'Email Qadees Asghar', external: false },
                ].map(({ href, Icon, label, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    aria-label={label}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-field text-fg-subtle hover:text-fg hover:bg-ink-800 transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* ---------------- Right: portrait ---------------- */}
            <div className="hero-in lg:col-span-5" style={step(2)}>
              <div className="relative mx-auto max-w-[420px]">
                {/* One soft, static ambient source — no pulse, no colour cycling. */}
                <div
                  className="absolute -inset-8 rounded-panel bg-accent-400/[0.07] blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative rounded-panel overflow-hidden surface p-1.5">
                  <img
                    src="/profile.jpg"
                    alt="Portrait of Qadees Asghar, Software Engineering student at UET Lahore and Full Stack Developer"
                    width="420"
                    height="460"
                    fetchpriority="high"
                    decoding="async"
                    className="w-full h-[320px] sm:h-[400px] lg:h-[460px] object-cover object-[50%_22%] rounded-card"
                  />

                  {/* Caption plate. Solid, hairline border — legibility over effect. */}
                  <div className="absolute inset-x-1.5 bottom-1.5 p-4 rounded-card bg-ink-950/85 backdrop-blur-sm border-t border-ink-700">
                    <p className="text-body font-medium text-fg">Qadees Asghar</p>
                    <p className="mt-0.5 font-mono text-label text-fg-subtle">
                      Software Engineering @ UET Lahore
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- Stats ----------------
              One bordered band divided by hairlines, rather than four floating
              cards — fewer edges on screen reads calmer and more deliberate. */}
          <dl className="hero-in mt-20 md:mt-24 grid grid-cols-2 lg:grid-cols-4 rounded-panel surface overflow-hidden" style={step(7)}>
            {personalData.stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`px-6 py-7 text-center lg:text-left border-ink-700
                  ${idx % 2 === 0 ? 'border-r' : ''} lg:border-r lg:last:border-r-0
                  ${idx < 2 ? 'border-b lg:border-b-0' : ''}`}
              >
                <dt className="text-micro font-mono uppercase text-fg-subtle">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-fg tabular tracking-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </LazyMotion>
  );
}
