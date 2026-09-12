"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { skills } from "@/data/skills";

// Sizing for the pill-shaped skill tags. Width scales gently with label
// length so "JavaScript" isn't the same width as "Go".
const MIN_TAG_WIDTH = 96;
const MAX_TAG_WIDTH = 216;
const TAG_HEIGHT = 46;

// Web-line connections are drawn between any two tags closer than this,
// fading out with distance — the "Web of Skills" backdrop.
const LINK_DISTANCE = 160;

function tagWidthFor(label: string) {
  const estimated = 44 + label.length * 8.6;
  return Math.min(MAX_TAG_WIDTH, Math.max(MIN_TAG_WIDTH, estimated));
}

// A physics-driven playground of draggable skill tags. Tags spawn above
// the section and fall under gravity until they settle on an invisible
// floor at the bottom of this section (which sits directly above the
// Footer), bounded on all sides so nothing can be thrown out of the area
// or behind the Footer. Every tag stays draggable/throwable even after
// settling. Physics runs via matter-js, loaded only on the client and
// only once this section is likely to be used; positions are written
// straight to the DOM each frame (no React state updates) to keep this
// smooth without extra re-renders, and the simulation pauses whenever the
// section scrolls out of view.
export function SkillsWeb() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [engineFailed, setEngineFailed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let destroyed = false;
    let rafId = 0;
    let visible = true;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let ctx: CanvasRenderingContext2D | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let MatterModule: any = null;
    let engine: any = null;
    let bodies: any[] = [];
    let boundaries: any[] = [];

    (async () => {
      let Matter: any;
      try {
        const imported: any = await import("matter-js");
        Matter = imported?.default ?? imported;
        MatterModule = Matter;
      } catch {
        if (!destroyed) setEngineFailed(true);
        return;
      }
      if (destroyed) return;

      const { Engine, Composite, Bodies, Mouse, MouseConstraint } = Matter;

      engine = Engine.create();
      engine.gravity.y = 0.55;

      const wallThickness = 80;
      // Invisible headroom above the visible container: tags spawn and
      // fall through this hidden zone before coming into view, so the
      // "falling in from above" effect reads naturally instead of tags
      // just appearing at the top edge.
      const spawnBuffer = 600;

      function makeBoundaries(w: number, h: number) {
        const topY = -spawnBuffer;
        const bottomY = h;
        const verticalSpan = bottomY - topY;
        const centerY = (topY + bottomY) / 2;
        return [
          // Floor: an invisible ledge sitting at the bottom edge of this
          // section, i.e. immediately above the Footer.
          Bodies.rectangle(w / 2, bottomY + wallThickness / 2, w + wallThickness * 2, wallThickness, {
            isStatic: true,
            friction: 0.6,
          }),
          // Ceiling, well above the visible area so it never interferes
          // with tags falling in — it only stops a hard upward throw.
          Bodies.rectangle(w / 2, topY - wallThickness / 2, w + wallThickness * 2, wallThickness, {
            isStatic: true,
          }),
          Bodies.rectangle(-wallThickness / 2, centerY, wallThickness, verticalSpan + wallThickness * 4, {
            isStatic: true,
          }),
          Bodies.rectangle(w + wallThickness / 2, centerY, wallThickness, verticalSpan + wallThickness * 4, {
            isStatic: true,
          }),
        ];
      }

      boundaries = makeBoundaries(width, height);
      Composite.add(engine.world, boundaries);

      bodies = skills.map((label, i) => {
        const w = tagWidthFor(label);
        const h = TAG_HEIGHT;
        const x = Math.min(width - w, Math.max(w, (0.15 + Math.random() * 0.7) * width));
        // Stagger the starting heights within the hidden spawn buffer so
        // tags cascade in one after another rather than all landing at
        // once, while staying safely clear of the ceiling above.
        const y = -40 - i * 45;
        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: h / 2 },
          restitution: 0.35,
          friction: 0.25,
          frictionAir: 0.02,
          density: 0.0018,
          angle: (Math.random() - 0.5) * 0.5,
        });
        body.plugin = { w, h };
        return body;
      });
      Composite.add(engine.world, bodies);

      const mouse = Mouse.create(container);
      // Matter.js binds its own 'wheel' handler (which calls
      // preventDefault) to support pointer-wheel zoom features we don't
      // use — remove it so scrolling the page with a mouse wheel while
      // hovering the physics area still works normally. Touch dragging
      // is unaffected: Matter's touch handlers already call
      // preventDefault() only while a touch is moving inside this
      // element, which is exactly what stops accidental page scrolling
      // while someone is dragging a tag.
      mouse.element.removeEventListener("wheel", mouse.mousewheel as EventListener);

      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.18, damping: 0.15, render: { visible: false } },
      });
      Composite.add(engine.world, mouseConstraint);

      ctx = canvas.getContext("2d");

      function resize() {
        if (!container || !canvas || !engine) return;
        width = container.clientWidth;
        height = container.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

        Composite.remove(engine.world, boundaries);
        boundaries = makeBoundaries(width, height);
        Composite.add(engine.world, boundaries);
      }
      resize();

      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(container);

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);

      let lastTime = performance.now();
      function loop(time: number) {
        if (destroyed) return;
        rafId = requestAnimationFrame(loop);
        if (!visible || !engine) {
          lastTime = time;
          return;
        }
        const delta = Math.min(time - lastTime, 1000 / 30);
        lastTime = time;
        Engine.update(engine, delta);

        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i];
          const el = tagRefs.current[i];
          if (!el) continue;
          const { w, h } = body.plugin as { w: number; h: number };
          const x = body.position.x - w / 2;
          const y = body.position.y - h / 2;
          el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
        }

        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          ctx.lineWidth = 1;
          for (let a = 0; a < bodies.length; a++) {
            for (let b = a + 1; b < bodies.length; b++) {
              const dx = bodies[a].position.x - bodies[b].position.x;
              const dy = bodies[a].position.y - bodies[b].position.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < LINK_DISTANCE) {
                const alpha = 0.32 * (1 - dist / LINK_DISTANCE);
                ctx.strokeStyle = `rgba(166, 77, 248, ${alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(bodies[a].position.x, bodies[a].position.y);
                ctx.lineTo(bodies[b].position.x, bodies[b].position.y);
                ctx.stroke();
              }
            }
          }
        }
      }
      rafId = requestAnimationFrame(loop);
    })();

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (MatterModule && engine) {
        MatterModule.Composite.clear(engine.world, false);
        MatterModule.Engine.clear(engine);
      }
    };
  }, [prefersReducedMotion]);

  const showStatic = prefersReducedMotion || engineFailed;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <p className="text-xs tracking-widest text-ink-400">Drag. Throw. Explore.</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink-100">
        The Web of Skills
      </h2>
      <p className="mt-2 max-w-xl text-sm text-ink-300">
        Every thread CODEFUSE is spun from — grab a skill and give it a throw.
      </p>

      {showStatic ? (
        <div className="mt-10 flex flex-wrap gap-3 py-4">
          {skills.map((label) => (
            <span
              key={label}
              className="glass-panel rounded-full px-4 py-2 text-sm font-medium text-ink-100 shadow-[0_0_20px_rgba(124,77,255,0.2)]"
            >
              {label}
            </span>
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative mt-10 h-[20vh] min-h-[160px] w-full overflow-hidden"
        >
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
          {skills.map((label, i) => (
            <div
              key={label}
              ref={(el) => {
                tagRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 cursor-grab select-none whitespace-nowrap rounded-full glass-panel px-4 py-2.5 text-center text-sm font-medium text-ink-100 shadow-[0_0_20px_rgba(124,77,255,0.28)] will-change-transform active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
