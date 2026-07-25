import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Point Tailwind at this project's config explicitly. Without it, Tailwind
// looks for tailwind.config.js in process.cwd(), which silently falls back to
// an empty config (and therefore zero generated utilities) whenever the dev
// server is started from a directory other than the project root.
const root = dirname(fileURLToPath(import.meta.url));

export default {
  plugins: {
    tailwindcss: { config: join(root, 'tailwind.config.js') },
    autoprefixer: {},
  },
}
