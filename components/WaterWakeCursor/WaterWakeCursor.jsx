'use client';

import { useEffect, useRef } from 'react';
import './WaterWakeCursor.css';

const TRAIL_LIFETIME = 920;
const SAMPLE_DISTANCE = 10;
const SAMPLE_INTERVAL = 34;

function themeColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawCursor(context, state, palette) {
  if (!state.hasPointer) {
    return;
  }

  context.save();
  context.translate(state.x, state.y);
  context.rotate(state.heading + Math.PI / 2);
  context.scale(state.cursorScale, state.cursorScale);
  context.globalAlpha = 1;
  context.fillStyle = palette.ink;
  context.strokeStyle = palette.paper;
  context.lineWidth = 2;
  context.shadowColor = palette.ink;
  context.shadowBlur = 6;
  context.shadowOffsetY = 2;

  context.beginPath();
  context.moveTo(0, -13);
  context.lineTo(10, 12);
  context.lineTo(1.8, 8.2);
  context.lineTo(-5.5, 13);
  context.lineTo(-8.8, 10);
  context.lineTo(-1.5, 5.2);
  context.lineTo(-10, 12);
  context.closePath();
  context.fill();
  context.stroke();

  context.restore();
}

function drawWake(context, state, palette, now) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const points = state.trail;
  if (points.length < 2) {
    drawCursor(context, state, palette);
    return;
  }

  context.lineCap = 'round';
  context.lineJoin = 'round';

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const age = now - current.time;
    const previousAge = now - previous.time;
    const fade = Math.max(0, 1 - age / TRAIL_LIFETIME);
    const previousFade = Math.max(0, 1 - previousAge / TRAIL_LIFETIME);

    if (!fade || !previousFade) {
      continue;
    }

    const normalX = -Math.sin(current.heading);
    const normalY = Math.cos(current.heading);
    const previousNormalX = -Math.sin(previous.heading);
    const previousNormalY = Math.cos(previous.heading);
    const spread = 3 + (age / TRAIL_LIFETIME) * 24;
    const previousSpread = 3 + (previousAge / TRAIL_LIFETIME) * 24;
    const pulse = Math.sin((now - current.time) / 78) * 0.75;
    const previousPulse = Math.sin((now - previous.time) / 78) * 0.75;
    const opacity = Math.min(fade, previousFade) * 0.46;

    context.strokeStyle = palette.blue;
    context.globalAlpha = opacity;
    context.lineWidth = 0.7 + fade * 0.55;

    context.beginPath();
    context.moveTo(
      previous.x + previousNormalX * (previousSpread + previousPulse),
      previous.y + previousNormalY * (previousSpread + previousPulse)
    );
    context.lineTo(
      current.x + normalX * (spread + pulse),
      current.y + normalY * (spread + pulse)
    );
    context.stroke();

    context.beginPath();
    context.moveTo(
      previous.x - previousNormalX * (previousSpread - previousPulse),
      previous.y - previousNormalY * (previousSpread - previousPulse)
    );
    context.lineTo(
      current.x - normalX * (spread - pulse),
      current.y - normalY * (spread - pulse)
    );
    context.stroke();

    if (index % 4 === 0 && age > 120) {
      context.save();
      context.translate(current.x - Math.cos(current.heading) * 2, current.y - Math.sin(current.heading) * 2);
      context.rotate(current.heading);
      context.globalAlpha = fade * 0.14;
      context.lineWidth = 0.75;
      context.beginPath();
      context.ellipse(
        0,
        0,
        3 + (age / TRAIL_LIFETIME) * 10,
        1.4 + (age / TRAIL_LIFETIME) * 3.6,
        0,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.restore();
    }
  }

  context.globalAlpha = 1;
  drawCursor(context, state, palette);
}

export default function WaterWakeCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const supportsFinePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!canvas || !supportsFinePointer.matches || prefersReducedMotion.matches) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    const state = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      heading: 0,
      cursorScale: 1,
      hasPointer: false,
      trail: [],
      lastSampleX: 0,
      lastSampleY: 0,
      lastSampleTime: 0,
      lastMoveTime: 0,
      frame: 0,
      previousFrameTime: 0,
      isRunning: false
    };
    const palette = {
      blue: themeColor('--blue'),
      paper: themeColor('--paper'),
      ink: themeColor('--ink')
    };

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function addWakePoint(time) {
      const speed = Math.hypot(state.velocityX, state.velocityY);
      const distance = Math.hypot(state.x - state.lastSampleX, state.y - state.lastSampleY);
      const elapsed = time - state.lastSampleTime;

      if (speed < 12 || (state.trail.length && distance < SAMPLE_DISTANCE && elapsed < SAMPLE_INTERVAL)) {
        return;
      }

      state.trail.push({
        x: state.x,
        y: state.y,
        heading: state.heading,
        time
      });
      state.lastSampleX = state.x;
      state.lastSampleY = state.y;
      state.lastSampleTime = time;
    }

    function stopWhenSettled() {
      return !state.trail.length
        && Math.hypot(state.velocityX, state.velocityY) < 0.2
        && Math.hypot(state.targetX - state.x, state.targetY - state.y) < 0.2;
    }

    function animate(time) {
      if (!state.previousFrameTime) {
        state.previousFrameTime = time;
      }

      const delta = Math.min((time - state.previousFrameTime) / 1000, 0.032);
      state.previousFrameTime = time;

      const pullX = state.targetX - state.x;
      const pullY = state.targetY - state.y;
      state.velocityX += pullX * 400 * delta;
      state.velocityY += pullY * 400 * delta;

      const damping = Math.exp(-45 * delta);
      state.velocityX *= damping;
      state.velocityY *= damping;
      state.x += state.velocityX * delta;
      state.y += state.velocityY * delta;

      const speed = Math.hypot(state.velocityX, state.velocityY);
      if (speed > 4) {
        const targetHeading = Math.atan2(state.velocityY, state.velocityX);
        const turn = Math.atan2(
          Math.sin(targetHeading - state.heading),
          Math.cos(targetHeading - state.heading)
        );
        state.heading += turn * (1 - Math.exp(-20 * delta));
      }
      const targetScale = speed > 80 ? 0.95 : 1;
      state.cursorScale += (targetScale - state.cursorScale) * (1 - Math.exp(-26 * delta));

      if (state.hasPointer) {
        addWakePoint(time);
      }

      state.trail = state.trail.filter((point) => time - point.time < TRAIL_LIFETIME);
      drawWake(context, state, palette, time);

      if (stopWhenSettled()) {
        state.isRunning = false;
        state.previousFrameTime = 0;
        return;
      }

      state.frame = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (state.isRunning) {
        return;
      }

      state.isRunning = true;
      state.frame = window.requestAnimationFrame(animate);
    }

    function movePointer(event) {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
        return;
      }

      const now = performance.now();
      if (!state.hasPointer) {
        state.x = event.clientX;
        state.y = event.clientY;
        state.lastSampleX = event.clientX;
        state.lastSampleY = event.clientY;
        state.lastSampleTime = now;
        state.hasPointer = true;
      }

      state.targetX = event.clientX;
      state.targetY = event.clientY;
      state.lastMoveTime = now;
      startAnimation();
    }

    function clearWake() {
      state.hasPointer = false;
      state.trail = [];
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function updateAccessibilityPreference() {
      if (supportsFinePointer.matches && !prefersReducedMotion.matches) {
        return;
      }

      clearWake();
      window.cancelAnimationFrame(state.frame);
      state.isRunning = false;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', movePointer, { passive: true });
    window.addEventListener('blur', clearWake);
    supportsFinePointer.addEventListener('change', updateAccessibilityPreference);
    prefersReducedMotion.addEventListener('change', updateAccessibilityPreference);

    return () => {
      window.cancelAnimationFrame(state.frame);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', movePointer);
      window.removeEventListener('blur', clearWake);
      supportsFinePointer.removeEventListener('change', updateAccessibilityPreference);
      prefersReducedMotion.removeEventListener('change', updateAccessibilityPreference);
    };
  }, []);

  return (
    <div className="water-wake-cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="water-wake-cursor__canvas" />
    </div>
  );
}
