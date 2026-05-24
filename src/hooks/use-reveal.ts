import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll hook. Returns a ref + boolean.
 * - One-shot (unobserves after first intersection)
 * - Respects prefers-reduced-motion (returns visible immediately)
 * - GPU-friendly: pair with `.reveal-up` utility in styles.css
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "-40px" }
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      options
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visible } as const;
}
