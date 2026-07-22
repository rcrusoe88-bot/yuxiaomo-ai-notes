'use client';

import { useEffect, useState } from 'react';

const words = ['思考', '试验', '共创'];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex(current => (current + 1) % words.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  return <b className="rotating-word" aria-live="polite" key={words[index]}>{words[index]}</b>;
}
