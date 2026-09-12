"use client";

import { useEffect, useRef } from "react";

interface WebNode {
  x: number;
  y: number;
  depth: number; // 0 = far, 1 = near — controls opacity/blur
}

interface WebStrand {
  a: WebNode;
  b: WebNode;
}

interface Spider {
  strandIndex: number;
  progress: number; // 0-1 along the strand
  direction: 1 | -1;
  speed: number;
  pauseUntil: number;
  size: number;
  depth: number;
}

// Builds an irregular web radiating from a corner anchor, the way a
// real orb-weaver web looks: uneven spoke spacing + spiral crossbars.
function buildCornerWeb(
  anchorX: number,
  anchorY: number,
  reach: number,
  spokeCount: number,
  ringCount: number,
  seedOffset: number
): { nodes: WebNode[]; strands: WebStrand[] } {
  const nodes: WebNode[] = [];
  const strands: WebStrand[] = [];
  const center: WebNode = { x: anchorX, y: anchorY, depth: 0.3 };
  nodes.push(center);

  const spokeAngles: number[] = [];
  for (let i = 0; i < spokeCount; i++) {
    const base = (Math.PI / 2) * (i / (spokeCount - 1));
    const jitter = (Math.sin(seedOffset + i * 12.9898) * 0.5) * 0.12;
    spokeAngles.push(base + jitter);
  }

  const ringsPerSpoke: WebNode[][] = spokeAngles.map(() => []);

  spokeAngles.forEach((angle, sIdx) => {
    let prev = center;
    for (let r = 1; r <= ringCount; r++) {
      const jitterR =
        1 + Math.sin(seedOffset + sIdx * 3.7 + r * 7.13) * 0.08;
      const dist = (reach / ringCount) * r * jitterR;
      const node: WebNode = {
        x: anchorX + Math.cos(angle) * dist,
        y: anchorY + Math.sin(angle) * dist,
        depth: 0.25 + (r / ringCount) * 0.75,
      };
      nodes.push(node);
      strands.push({ a: prev, b: node });
      ringsPerSpoke[sIdx].push(node);
      prev = node;
    }
  });

  // Cross-links between adjacent spokes at each ring depth (the spiral).
  for (let r = 0; r < ringCount; r++) {
    for (let sIdx = 0; sIdx < spokeAngles.length - 1; sIdx++) {
      const a = ringsPerSpoke[sIdx][r];
      const b = ringsPerSpoke[sIdx + 1][r];
      if (a && b) strands.push({ a, b });
    }
  }

  return { nodes, strands };
}

export function SpiderWebBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let webs: { nodes: WebNode[]; strands: WebStrand[] }[] = [];
    let allStrands: WebStrand[] = [];
    let spiders: Spider[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let running = true;
    let visible = true;
    let raf = 0;
    let lastTime = performance.now();

    // Pre-tinted sprite built from the CODEFUSE spider mark. Tinting is
    // done once on an offscreen canvas (source-in composite) rather than
    // per-frame, so the hot draw loop is just a cheap drawImage() call.
    let spiderSprite: HTMLCanvasElement | null = null;
    const markImg = new Image();
    markImg.src = "/spiderman-mark.png";
    markImg.onload = () => {
      const off = document.createElement("canvas");
      off.width = markImg.width;
      off.height = markImg.height;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(markImg, 0, 0);
      octx.globalCompositeOperation = "source-in";
      const grad = octx.createLinearGradient(0, 0, 0, markImg.height);
      grad.addColorStop(0, "#E619FF");
      grad.addColorStop(1, "#7C4DFF");
      octx.fillStyle = grad;
      octx.fillRect(0, 0, markImg.width, markImg.height);
      spiderSprite = off;
    };

    const particles = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.02 + Math.random() * 0.05,
      size: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
    }));

    function resize() {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const reach = Math.min(width, height) * 0.42;
      const isMobile = width < 640;
      const spokes = isMobile ? 5 : 7;
      const rings = isMobile ? 4 : 6;

      const topLeft = buildCornerWeb(0, 0, reach, spokes, rings, 1.1);
      const topRight = buildCornerWeb(0, 0, reach * 0.85, spokes, rings, 4.4);
      const bottomLeft = buildCornerWeb(0, 0, reach * 0.95, spokes, rings, 8.8);
      const bottomRight = buildCornerWeb(0, 0, reach * 0.8, spokes, rings, 13.2);

      // Mirror + translate each web so it radiates inward from its own corner.
      topRight.nodes.forEach((n) => {
        n.x = width - n.x;
        n.y = n.y;
      });
      bottomLeft.nodes.forEach((n) => {
        n.y = height - n.y;
      });
      bottomRight.nodes.forEach((n) => {
        n.x = width - n.x;
        n.y = height - n.y;
      });

      webs = [topLeft, topRight, bottomLeft, bottomRight];
      allStrands = webs.flatMap((w) => w.strands);

      const spiderCount = isMobile ? 2 : 4;
      spiders = Array.from({ length: spiderCount }, (_, i) => ({
        strandIndex: Math.floor(Math.random() * allStrands.length),
        progress: Math.random(),
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: 0.05 + Math.random() * 0.08,
        pauseUntil: 0,
        size: i === 0 ? 16 : i % 2 === 0 ? 8 : 11,
        depth: 0.5 + Math.random() * 0.5,
      }));
    }

    function drawStrand(s: WebStrand, glow: boolean) {
      const depth = (s.a.depth + s.b.depth) / 2;
      const alpha = 0.06 + depth * 0.22;
      ctx!.strokeStyle = `rgba(166, 77, 248, ${alpha})`;
      ctx!.lineWidth = 0.6 + depth * 0.6;
      if (glow) {
        ctx!.shadowColor = "rgba(230, 25, 255, 0.5)";
        ctx!.shadowBlur = 6;
      } else {
        ctx!.shadowBlur = 0;
      }
      ctx!.beginPath();
      ctx!.moveTo(s.a.x, s.a.y);
      ctx!.lineTo(s.b.x, s.b.y);
      ctx!.stroke();
    }

    function drawSpider(x: number, y: number, angle: number, size: number, depth: number) {
      if (!spiderSprite) return; // sprite still loading — skip this frame

      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(angle);
      ctx!.globalAlpha = 0.55 + depth * 0.45;

      // Soft purple glow beneath the mark.
      ctx!.shadowColor = "rgba(124, 77, 255, 0.9)";
      ctx!.shadowBlur = size * 1.4;

      const w = size * 1.7;
      const h = (spiderSprite.height / spiderSprite.width) * w;
      ctx!.drawImage(spiderSprite, -w / 2, -h / 2, w, h);

      ctx!.restore();
    }

    function step(now: number) {
      if (!running || !visible) {
        raf = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx!.clearRect(0, 0, width, height);

      // Strands.
      for (const s of allStrands) drawStrand(s, false);

      // Glowing intersection nodes (sparse, for performance).
      ctx!.shadowBlur = 0;
      webs.forEach((w) => {
        w.nodes.forEach((n, i) => {
          if (i % 3 !== 0) return;
          ctx!.fillStyle = `rgba(196, 181, 253, ${0.15 + n.depth * 0.35})`;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, 1.1 + n.depth * 1.2, 0, Math.PI * 2);
          ctx!.fill();
        });
      });

      // Floating light particles (atmospheric fog motes).
      particles.forEach((p) => {
        p.phase += dt * p.speed;
        const px = p.x * width + Math.sin(p.phase) * 18;
        const py = ((p.y + now * 0.00001 * p.speed) % 1) * height;
        ctx!.fillStyle = "rgba(24, 224, 242, 0.18)";
        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fill();
      });

      // Spiders crawling along strands.
      if (!prefersReducedMotion) {
        spiders.forEach((sp) => {
          if (now < sp.pauseUntil) return;
          const strand = allStrands[sp.strandIndex];
          if (!strand) return;
          sp.progress += sp.direction * sp.speed * dt;

          if (sp.progress >= 1 || sp.progress <= 0) {
            sp.progress = Math.max(0, Math.min(1, sp.progress));
            // Occasionally pause, then jump to a connected-feeling strand.
            sp.pauseUntil = now + 400 + Math.random() * 1400;
            sp.strandIndex = Math.floor(Math.random() * allStrands.length);
            sp.direction = Math.random() > 0.5 ? 1 : -1;
            sp.progress = sp.direction === 1 ? 0 : 1;
          }

          const x = strand.a.x + (strand.b.x - strand.a.x) * sp.progress;
          const y = strand.a.y + (strand.b.y - strand.a.y) * sp.progress;
          const angle = Math.atan2(
            strand.b.y - strand.a.y,
            strand.b.x - strand.a.x
          );
          drawSpider(x, y, angle + Math.PI / 2, sp.size, sp.depth);
        });
      } else {
        // Reduced motion: render spiders static at their strand midpoint.
        spiders.forEach((sp) => {
          const strand = allStrands[sp.strandIndex];
          if (!strand) return;
          const x = (strand.a.x + strand.b.x) / 2;
          const y = (strand.a.y + strand.b.y) / 2;
          drawSpider(x, y, 0, sp.size, sp.depth);
        });
      }

      raf = requestAnimationFrame(step);
    }

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(container);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Fog layer for atmospheric depth. */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(124, 77, 255,0.08), transparent 60%)",
        }}
      />
    </div>
  );
}
