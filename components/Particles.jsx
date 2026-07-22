'use client';

import { useEffect, useRef } from 'react';

export default function Particles({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let particles = [];
    let frame;
    let pointer = { x: 0, y: 0, active: false };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: width < 700 ? 92 : 160 }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          ox: x,
          oy: y,
          size: 1 + Math.random() * 2.5,
          speed: 0.45 + Math.random() * 0.8,
          phase: Math.random() * 7
        };
      });
    };

    const draw = time => {
      const seconds = time / 1000;
      context.clearRect(0, 0, width, height);
      const target = pointer.active
        ? pointer
        : { x: width * (0.72 + Math.sin(seconds * 0.25) * 0.08), y: height * (0.43 + Math.cos(seconds * 0.38) * 0.1) };
      const radius = Math.min(width, height) * 0.22;

      particles.forEach((particle, index) => {
        const dx = particle.x - target.x;
        const dy = particle.y - target.y;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance < radius) {
          const angle = Math.atan2(dy, dx) + Math.sin(seconds * 1.4 + particle.phase) * 0.17;
          const ring = radius * 0.58 + Math.sin(seconds * 2 + particle.phase) * 15;
          particle.x += (target.x + Math.cos(angle) * ring - particle.x) * 0.035 * particle.speed;
          particle.y += (target.y + Math.sin(angle) * ring - particle.y) * 0.035 * particle.speed;
        } else {
          particle.x += (particle.ox + Math.sin(seconds + particle.phase) * 27 - particle.x) * 0.006 * particle.speed;
          particle.y += (particle.oy + Math.cos(seconds * 0.8 + particle.phase) * 18 - particle.y) * 0.006 * particle.speed;
        }

        const glow = Math.max(0, 1 - Math.abs(distance - radius * 0.58) / (radius * 0.42));
        context.beginPath();
        context.fillStyle = glow > 0.25 ? 'rgba(217,255,75,.94)' : `rgba(26,28,26,${0.2 + (index % 5) * 0.08})`;
        context.arc(particle.x, particle.y, particle.size + glow * 1.8, 0, Math.PI * 2);
        context.fill();
      });

      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const movePointer = event => {
      const box = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top, active: true };
    };
    const leavePointer = () => { pointer.active = false; };

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', movePointer);
    canvas.addEventListener('pointerleave', leavePointer);
    resize();
    draw(0);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', movePointer);
      canvas.removeEventListener('pointerleave', leavePointer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`particles-container ${className}`} />;
}
