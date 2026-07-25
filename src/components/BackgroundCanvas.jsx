import React, { useEffect, useRef } from 'react';

/**
 * Animated cyber background: floating particles with proximity links,
 * a soft radial glow that follows the cursor, ambient gradient blobs and a
 * faint grid. Engineered for smooth 60 FPS and low power draw:
 *   - Respects prefers-reduced-motion (renders a single static frame).
 *   - Scales particle count to viewport (fewer on mobile).
 *   - Caps device-pixel-ratio at 2 to avoid over-drawing on retina screens.
 *   - Pauses the render loop when the tab is hidden.
 */
export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    let animationFrameId;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setSize, 150);
    };
    window.addEventListener('resize', handleResize);

    // Smoothed cursor position for the soft radial glow + link interaction.
    const mouse = { x: null, y: null, gx: -1000, gy: -1000, radius: 150 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    // Density scales with area; fewer particles on phones for performance.
    const cap = isMobile ? 26 : 55;
    const divisor = isMobile ? 28000 : 18000;
    const particleCount = Math.min(Math.floor((width * height) / divisor), cap);
    const particles = [];
    // Single-hue field: one cyan, one neutral. No second accent, no neon.
    const colors = ['#22D3EE', '#3A3F48'];
    const linkDist = isMobile ? 100 : 130;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.3 + 0.14,
        // Per-particle twinkle: random phase and rate, so the field breathes
        // without any two points ever pulsing in step.
        phase: Math.random() * Math.PI * 2,
        rate: 0.4 + Math.random() * 0.7,
      });
    }

    const drawScene = () => {
      ctx.clearRect(0, 0, width, height);
      const t = performance.now() * 0.001;

      // Soft radial glow easing toward the cursor (skipped on mobile/no-pointer).
      if (!isMobile && mouse.x !== null && mouse.y !== null) {
        mouse.gx += (mouse.x - mouse.gx) * 0.08;
        mouse.gy += (mouse.y - mouse.gy) * 0.08;
        const glow = ctx.createRadialGradient(
          mouse.gx, mouse.gy, 0,
          mouse.gx, mouse.gy, 220
        );
        glow.addColorStop(0, 'rgba(34, 211, 238, 0.035)');
        glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(mouse.gx - 220, mouse.gy - 220, 440, 440);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(t * p.rate + p.phase));
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#22D3EE';
            ctx.globalAlpha = (1 - dist / linkDist) * 0.1;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = '#22D3EE';
            ctx.globalAlpha = (1 - mdist / mouse.radius) * 0.14;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;
    };

    // Reduced motion: draw one static frame, no loop, no listeners.
    if (prefersReducedMotion) {
      drawScene();
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      };
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      drawScene();
      animationFrameId = requestAnimationFrame(render);
    };

    // Pause the loop while the tab is hidden to save CPU/battery.
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Particle field — faint texture, not decoration. */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-90" />

      {/* Two ambient lights on co-prime drift cycles. Still far below the six
          stacked blur layers this replaced, but enough that the page reads as
          lit rather than flat. */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[560px] rounded-full bg-accent-400/[0.06] blur-[160px] motion-safe:animate-drift pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[620px] h-[520px] rounded-full bg-accent-400/[0.035] blur-[150px] motion-safe:animate-drift-slow pointer-events-none" />

      {/* Structural grid — neutral, not accent-tinted, and masked so it fades
          out down the page rather than competing with content below the fold. */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 65% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 65% at 50% 0%, #000 40%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            opacity: 0.02,
          }}
        />

        {/* One hairline travelling down the grid. A single moving element
            reads as craft; a field of them would read as noise. */}
        <div
          className="absolute inset-x-0 top-0 h-px motion-safe:animate-sweep"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(34,211,238,0.5), transparent)',
          }}
        />
      </div>
    </div>
  );
}
