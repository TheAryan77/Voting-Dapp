import React, { useEffect, useRef, useState } from 'react';

export function AnimatedNumber({ value, duration = 450 }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (fromRef.current === value) return;
    const from = fromRef.current;
    const to = value;
    cancelAnimationFrame(animRef.current);
    startRef.current = null;

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min(1, (ts - startRef.current) / duration);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress; // easeInOutQuad
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      if (progress < 1) animRef.current = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [value, duration]);

  return <span className="anim-number" aria-label={value}>{display}</span>;
}
