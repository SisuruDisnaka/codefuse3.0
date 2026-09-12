import type { Metadata } from "next";
import { eventConfig } from "@/data/event";
import { RegistrationForm } from "@/components/registration-form";
import { SpiderWebBackground } from "@/components/spider-web-background";

export const metadata: Metadata = {
  title: "Register | CODEFUSE 3.0",
  description: "Register your team for CODEFUSE 3.0.",
};

export default function RegisterPage() {
  const closed = eventConfig.registrationStatus !== "OPEN";

  return (
    <>
      <SpiderWebBackground />
      <section className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
        <p className="text-xs tracking-widest text-ink-400">Team Entry</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-100 sm:text-5xl">
          Register
        </h1>

        {closed ? (
          <div className="glass-panel mt-12 rounded-2xl p-10 text-center">
            <p className="font-display text-2xl text-ink-100">
              Registration {eventConfig.registrationStatus === "CLOSED" ? "Closed" : "Coming Soon"}
            </p>
            <p className="mt-3 text-ink-400">
              &ldquo;The web is currently sealed.&rdquo;
            </p>
          </div>
        ) : (
          <RegistrationForm />
        )}
      </section>
    </>
  );
}
