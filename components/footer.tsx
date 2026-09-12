import Link from "next/link";
import Image from "next/image";
import { eventConfig } from "@/data/event";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/rules", label: "Rules" },
  { href: "/winners", label: "Winners" },
  { href: "/#organizers", label: "Organizers" },
  { href: "/register", label: "Register" },
];

export function Footer() {
  const { socialLinks } = eventConfig;
  const hasSocial = Object.values(socialLinks).some(Boolean);

  return (
    <footer className="relative z-10 border-t border-purple-primary/20 bg-void-950/80">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="CODEFUSE 3.0"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <p className="font-display text-xl font-semibold text-ink-100">
                CODEFUSE 3.0
              </p>
            </div>
            <p className="mt-1 text-sm text-ink-400">The Web of Code</p>
            <p className="mt-4 max-w-xs text-sm text-ink-400">
              {eventConfig.faculty}
              <br />
              {eventConfig.university}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-300 hover:text-ink-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {hasSocial && (
            <div className="flex gap-4 text-sm text-ink-300">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} className="hover:text-ink-100">
                  Facebook
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} className="hover:text-ink-100">
                  Instagram
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} className="hover:text-ink-100">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>

        <p className="mt-10 border-t border-purple-primary/10 pt-6 text-xs text-ink-400">
          © {new Date().getFullYear()} ACS Faculty of Computing, University of Sri Jayewardenepura.
        </p>
      </div>
    </footer>
  );
}
