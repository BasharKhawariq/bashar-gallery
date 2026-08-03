'use client';

import { useEffect, useRef, useState } from 'react';

export default function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setRect({ width: r.width, height: r.height });
    });

    ro.observe(el);
    // initialize
    const r = el.getBoundingClientRect();
    setRect({ width: r.width, height: r.height });

    return () => ro.disconnect();
    // ref.current is intentionally omitted — refs are mutable and shouldn't be dependencies
  }, []);

  return { ref, rect } as const;
}
