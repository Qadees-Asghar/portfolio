import { useEffect, useState } from 'react';

/**
 * Returns `true` when the user has requested reduced motion
 * (OS-level "Reduce Motion" accessibility setting).
 * Used to disable non-essential animations for a11y compliance.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
