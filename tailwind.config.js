import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Resolve content globs against this file rather than process.cwd(), so the
// build works no matter which directory the dev server is launched from.
const root = dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(root, 'index.html'),
    join(root, 'src/**/*.{js,ts,jsx,tsx}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ------------------------------------------------------------------
         COLOR SYSTEM — single accent (cyan), neutral surface ramp.
         Neutral (not blue-black) near-black is what separates a premium
         dark UI from a "cyber" one; it also lets a single cyan read as
         precise rather than neon.
      ------------------------------------------------------------------ */
      colors: {
        // Surfaces, darkest -> lightest. `ink-950` is the page background.
        ink: {
          950: '#0A0B0D',
          900: '#0E1013',
          850: '#131519',
          800: '#181A1F',
          700: '#1F2228',
          600: '#2A2E35',
          500: '#3A3F48',
        },
        // The one accent. 400 is the interactive default; 300 for text on dark.
        accent: {
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#0FB6D4',
          600: '#0C90A8',
        },
        // Foreground ramp. Never pure #fff — softer reads more refined.
        // Every step clears WCAG AA (4.5:1) against ink-950; `subtle` is the
        // floor and was lifted from #6B7178 (3.99:1) to meet it.
        fg: {
          DEFAULT: '#F4F5F6',  // 17.6:1
          muted: '#A2A8B0',    //  8.2:1
          subtle: '#848B94',   //  5.3:1
        },
      },

      /* ------------------------------------------------------------------
         TYPE SCALE — fluid, tightly tracked. Presence comes from size and
         tracking, not weight (nothing here exceeds 600).
      ------------------------------------------------------------------ */
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 6.5vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.038em' }],
        h2: ['clamp(1.75rem, 3.6vw, 2.75rem)', { lineHeight: '1.12', letterSpacing: '-0.028em' }],
        h3: ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        lead: ['1.0625rem', { lineHeight: '1.65' }],   // 17px — body copy
        body: ['0.9375rem', { lineHeight: '1.6' }],    // 15px — dense copy
        label: ['0.8125rem', { lineHeight: '1.4' }],   // 13px — UI labels
        micro: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.08em' }], // 11px — eyebrows only
      },

      /* 8px rhythm additions (Tailwind's default scale is already 4px-based) */
      spacing: {
        18: '4.5rem',   // 72
        22: '5.5rem',   // 88
        30: '7.5rem',   // 120
      },

      /* Three radii — the whole system. Named additively so that redefining
         them cannot silently reshape sections not yet migrated. */
      borderRadius: {
        field: '8px',   // inputs, chips, small controls
        card: '12px',   // cards, buttons, panels
        panel: '16px',  // large surfaces only
      },

      transitionTimingFunction: {
        // Expo-out. The single easing curve used site-wide.
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        // Two ambient drifts on deliberately co-prime durations, so the
        // lights never visibly sync into a repeating pulse.
        'drift': 'drift 24s ease-in-out infinite',
        'drift-slow': 'driftSlow 37s ease-in-out infinite',
        'sweep': 'sweep 14s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Replaces `float`/`pulse-slow`: a barely-perceptible ambient drift.
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -18px, 0)' },
        },
        driftSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(-26px, 16px, 0)' },
        },
        // A single hairline travelling down the grid — the only element on
        // the page that reads as "alive" rather than merely ambient.
        // Distances are in vh, not %: the line is 1px tall, so a percentage
        // translate would resolve against that 1px and barely move it.
        sweep: {
          '0%':   { transform: 'translateY(0)', opacity: '0' },
          '10%':  { opacity: '1' },
          '85%':  { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
