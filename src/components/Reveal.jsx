import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight scroll-reveal wrapper.
 *
 * Fades + slides its children in the first time they enter the viewport,
 * using IntersectionObserver (no animation library → minimal bundle cost).
 * Animation is pure CSS transform/opacity (GPU-accelerated, 60 FPS) and is
 * automatically neutralised for users who prefer reduced motion via the
 * `.reveal` rules in index.css.
 *
 * @param {string} as     - element/tag to render (default: 'div')
 * @param {number} delay  - optional stagger delay in ms
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is unavailable, show immediately (no JS gate).
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // reveal once, then stop observing
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
