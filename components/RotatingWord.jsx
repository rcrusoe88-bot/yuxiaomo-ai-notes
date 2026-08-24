'use client';

import { useEffect, useState } from 'react';

const words = ['工艺', '内容', '系统', '创作'];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => {
      setIndex(current => (current + 1) % words.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  return <b className="rotating-word" key={words[index]}>{words[index]}</b>;
}
