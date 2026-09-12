import Link from "next/link";
import { eventConfig } from "@/data/event";

export function RegistrationCta() {
  const closed = eventConfig.registrationStatus !== "OPEN";

  return (
    <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
      <div className="glass-panel rounded-3xl p-10 sm:p-16">
        <h2 className="font-display text-3xl font-semibold text-ink-100 sm:text-4xl">
          {closed ? "The Web Awaits" : "Enter the Web"}
        </h2>
        <p className="mt-4 text-ink-300">
          {closed
            ? "Registration opens soon — check back for the exact date."
            : "Form your team of up to three and step into CODEFUSE 3.0."}
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block rounded-full bg-purple-primary px-8 py-3 font-medium text-ink-100 transition hover:shadow-[0_0_28px_rgba(230, 25, 255,0.5)]"
        >
          {closed ? "View Registration Page" : "Register Your Team"}
        </Link>
      </div>
    </section>
  );
}
