"use client";

import { useMemo } from "react";

const SNIPPETS = [
  "const team = createTeam();",
  "function solve(problem) {}",
  "while (alive) { code(); }",
  'import { HackerRank } from "competition";',
  "class CodeFuse {}",
  "if (problemSolved) { victory(); }",
  'git commit -m "CODEFUSE 3.0"',
  "SELECT * FROM winners;",
  "python solve.py",
  "public static void main(String[] args) {}",
  "#include <bits/stdc++.h>",
  "def crawl(node: Node) -> None:",
  "type Team = { name: string; size: 1 | 2 | 3 };",
  ".web-node { filter: drop-shadow(0 0 6px); }",
  "<div className=\"web\">",
];

interface Line {
  text: string;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function CodeWall() {
  // Deterministic pseudo-random layout so server/client output match.
  const lines = useMemo<Line[]>(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: 18 }, (_, i) => ({
      text: SNIPPETS[i % SNIPPETS.length],
      top: (i / 18) * 100 + rand() * 2,
      duration: 40 + rand() * 30,
      delay: -rand() * 40,
      opacity: 0.04 + rand() * 0.05,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden font-mono text-sm select-none"
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap will-change-transform motion-reduce:hidden"
          style={{
            top: `${line.top}%`,
            opacity: line.opacity,
            color: "#A78BFA",
            animation: `codewall-scroll ${line.duration}s linear ${line.delay}s infinite`,
          }}
        >
          {line.text}
          <span className="mx-12">{line.text}</span>
          <span className="mx-12">{line.text}</span>
        </div>
      ))}
      <style>{`
        @keyframes codewall-scroll {
          from { transform: translateX(0%); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
