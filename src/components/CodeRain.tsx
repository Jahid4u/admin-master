import { useEffect, useRef } from "react";

type Props = { theme: "dark" | "light" };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  displayR: number;
};

export function CodeRain({ theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let particles: Particle[] = [];
    let raf = 0;
    let last = 0;
    let running = true;

    const mouse = { x: -9999, y: -9999, active: false };

    const LINK_DIST = 130;
    const MOUSE_RADIUS = 160;
    const ATTRACT_FORCE = 0.04;
    const VEL_DAMP = 0.995;
    const MAX_VEL = 2.2;
    const NEAR_DOT_SCALE = 1.5;
    const NEAR_LINE_BOOST = 2;

    const CLUSTER_RADIUS = 90;
    const CLUSTER_THRESHOLD = 3;
    const CLUSTER_SCALE = 1.6;
    const DISPLAY_LERP = 0.05;
    const LINE_WIDTH_MIN = 0.5;
    const LINE_WIDTH_MAX = 1.0;

    const dotRGB = theme === "dark" ? "147, 197, 253" : "37, 99, 235";
    const lineRGB = theme === "dark" ? "96, 165, 250" : "59, 130, 246";
    const dotAlpha = theme === "dark" ? 0.7 : 0.6;
    const lineAlphaMax = theme === "dark" ? 0.24 : 0.2;

    const density = () => {
      const target = Math.round((w * h) / 14000);
      return Math.max(30, Math.min(110, target));
    };

    const makeParticle = (): Particle => {
      const pow = Math.pow(Math.random(), 1.8);
      const baseR = 0.6 + pow * 2.4;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        r: baseR,
        displayR: baseR,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = density();
      particles = new Array(n).fill(0).map(makeParticle);
    };
    resize();

    const draw = (t: number) => {
      if (!running) return;
      const dt = last === 0 ? 16 : Math.min(48, t - last);
      last = t;
      const step = dt / 16;

      ctx.clearRect(0, 0, w, h);

      // update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < MOUSE_RADIUS * MOUSE_RADIUS && md2 > 0.01) {
            const md = Math.sqrt(md2);
            const f = (1 - md / MOUSE_RADIUS) * ATTRACT_FORCE;
            p.vx += (mdx / md) * f * step;
            p.vy += (mdy / md) * f * step;
          }
        }

        p.vx *= VEL_DAMP;
        p.vy *= VEL_DAMP;
        if (p.vx > MAX_VEL) p.vx = MAX_VEL;
        else if (p.vx < -MAX_VEL) p.vx = -MAX_VEL;
        if (p.vy > MAX_VEL) p.vy = MAX_VEL;
        else if (p.vy < -MAX_VEL) p.vy = -MAX_VEL;

        p.vx += (Math.random() - 0.5) * 0.06;
        p.vy += (Math.random() - 0.5) * 0.06;

        p.x += p.vx * step;
        p.y += p.vy * step;

        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }

      // neighbor count + lines (single O(n²) pass)
      const neighborCount = new Int32Array(particles.length);
      const CR2 = CLUSTER_RADIUS * CLUSTER_RADIUS;
      const LD2 = LINK_DIST * LINK_DIST;
      const MR2 = MOUSE_RADIUS * MOUSE_RADIUS;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;

          if (d2 < CR2) {
            neighborCount[i]++;
            neighborCount[j]++;
          }

          if (d2 < LD2) {
            const d = Math.sqrt(d2);
            const t01 = 1 - d / LINK_DIST;
            let alpha = t01 * lineAlphaMax;
            const lineW = LINE_WIDTH_MIN + t01 * (LINE_WIDTH_MAX - LINE_WIDTH_MIN);

            // cluster boost
            if (d2 < CR2) alpha *= 1.2;

            if (mouse.active) {
              const mx = (a.x + b.x) * 0.5;
              const my = (a.y + b.y) * 0.5;
              const mdx = mouse.x - mx;
              const mdy = mouse.y - my;
              const md2 = mdx * mdx + mdy * mdy;
              if (md2 < MR2) {
                const md = Math.sqrt(md2);
                const boost = 1 + (1 - md / MOUSE_RADIUS) * (NEAR_LINE_BOOST - 1);
                alpha *= boost;
              }
            }

            ctx.strokeStyle = `rgba(${lineRGB}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = lineW;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // cursor halo
      if (mouse.active) {
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          MOUSE_RADIUS
        );
        grad.addColorStop(0, `rgba(${dotRGB}, 0.04)`);
        grad.addColorStop(1, `rgba(${dotRGB}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // cluster-driven target radius
        const inCluster = neighborCount[i] >= CLUSTER_THRESHOLD;
        const targetR = inCluster ? p.r * CLUSTER_SCALE : p.r;
        p.displayR += (targetR - p.displayR) * DISPLAY_LERP * step;

        let r = p.displayR;
        // size-proportional alpha (bigger = slightly more opaque)
        let a = Math.min(1, dotAlpha + (p.r - 1.5) * 0.05);

        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < MR2) {
            const md = Math.sqrt(md2);
            const k = 1 - md / MOUSE_RADIUS;
            r = r * (1 + (NEAR_DOT_SCALE - 1) * k);
            a = Math.min(1, a * (1 + k));
          }
        }

        const useGlow = p.r > 2.0;
        if (useGlow) {
          ctx.shadowColor = `rgba(${dotRGB}, 0.6)`;
          ctx.shadowBlur = 6;
        }

        ctx.fillStyle = `rgba(${dotRGB}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (useGlow) {
          ctx.shadowBlur = 0;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    if (finePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
    }

    if (!reduceMotion) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.fillStyle = `rgba(${dotRGB}, ${dotAlpha})`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      if (finePointer) {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseout", onLeave);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
}
