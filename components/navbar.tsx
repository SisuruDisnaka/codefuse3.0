"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/rules", label: "Rules" },
  { href: "/winners", label: "Winners" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-panel border-b border-purple-primary/20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="CODEFUSE 3.0"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
              priority
            />
            <span className="font-display text-lg font-semibold tracking-tight text-ink-100">
              CODEFUSE <span className="text-purple-bright">3.0</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm text-ink-300 transition-colors hover:text-ink-100",
                      active && "text-ink-100"
                    )}
                  >
                    {link.label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 h-px w-full bg-purple-neon shadow-[0_0_8px_rgba(230, 25, 255,0.8)]"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden rounded-full border border-purple-primary/50 bg-purple-primary/10 px-5 py-2 text-sm font-medium text-ink-100 transition hover:border-purple-neon hover:shadow-[0_0_16px_rgba(230, 25, 255,0.4)] md:inline-block"
            >
              Register Now
            </Link>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="rounded-md border border-purple-primary/30 p-2 text-ink-200 md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel overflow-hidden border-b border-purple-primary/20 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-3 text-ink-200 hover:bg-purple-primary/10 hover:text-ink-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/register"
                  className="mt-2 block rounded-full border border-purple-primary/50 bg-purple-primary/10 px-3 py-3 text-center font-medium text-ink-100"
                >
                  Register Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
