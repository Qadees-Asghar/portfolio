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
    const colors = ['#00c6ff', '#ae81ff', '#00e5ff', '#6a3093'];
    const linkDist = isMobile ? 100 : 130;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    const drawScene = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft radial glow easing toward the cursor (skipped on mobile/no-pointer).
      if (!isMobile && mouse.x !== null && mouse.y !== null) {
        mouse.gx += (mouse.x - mouse.gx) * 0.08;
        mouse.gy += (mouse.y - mouse.gy) * 0.08;
        const glow = ctx.createRadialGradient(
          mouse.gx, mouse.gy, 0,
          mouse.gx, mouse.gy, 220
        );
        glow.addColorStop(0, 'rgba(0, 198, 255, 0.10)');
        glow.addColorStop(1, 'rgba(0, 198, 255, 0)');
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
        ctx.globalAlpha = p.alpha;
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
            ctx.strokeStyle = '#00c6ff';
            ctx.globalAlpha = (1 - dist / linkDist) * 0.18;
            ctx.lineWidth = 0.8;
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
            ctx.strokeStyle = '#ae81ff';
            ctx.globalAlpha = (1 - mdist / mouse.radius) * 0.35;
            ctx.lineWidth = 1;
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
      {/* HTML5 Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />

      {/* Floating Animated Gradient Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/10 blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-purple-600/20 via-cyan-500/15 to-transparent blur-[160px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-cyan-400/10 blur-[130px] animate-float pointer-events-none" />

      {/* Cyber Grid Lines Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #00c6ff 1px, transparent 1px), linear-gradient(to bottom, #00c6ff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
