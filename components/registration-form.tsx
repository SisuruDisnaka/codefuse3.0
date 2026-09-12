"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Copy } from "lucide-react";
import { registrationSchema } from "@/lib/validations/registration";
import type { TeamMemberInput, RegistrationResponse } from "@/types/registration";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5;

const LOADING_MESSAGES = [
  "Connecting to the web...",
  "Verifying team...",
  "Entering CODEFUSE...",
];

const emptyMember = (memberNumber: 1 | 2 | 3): TeamMemberInput => ({
  memberNumber,
  fullName: "",
  registrationNumber: "",
  email: "",
  whatsappNumber: "",
});

interface FormState {
  teamName: string;
  teamSize: 1 | 2 | 3;
  teamEmail: string;
  teamWhatsapp: string;
  hackerrankTeamName: string;
  githubUrl: string;
  additionalInformation: string;
  members: TeamMemberInput[];
}

const initialState: FormState = {
  teamName: "",
  teamSize: 1,
  teamEmail: "",
  teamWhatsapp: "",
  hackerrankTeamName: "",
  githubUrl: "",
  additionalInformation: "",
  members: [emptyMember(1)],
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-ink-300">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-purple-primary/30 bg-void-900/60 px-4 py-2.5 text-ink-100 outline-none transition focus:border-purple-neon focus:shadow-[0_0_0_3px_rgba(230, 25, 255,0.15)]";

export function RegistrationForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [result, setResult] = useState<RegistrationResponse | null>(null);

  function updateMemberCount(size: 1 | 2 | 3) {
    setForm((f) => {
      const members: TeamMemberInput[] = Array.from({ length: size }, (_, i) => {
        const num = (i + 1) as 1 | 2 | 3;
        return f.members[i] ?? emptyMember(num);
      });
      return { ...f, teamSize: size, members };
    });
  }

  function updateMember(index: number, patch: Partial<TeamMemberInput>) {
    setForm((f) => ({
      ...f,
      members: f.members.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  }

  function goNext() {
    setErrors({});
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }
  function goBack() {
    setErrors({});
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  async function handleSubmit() {
    const parsed = registrationSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setLoadingMsgIndex(0);
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 900);

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data: RegistrationResponse = await res.json();
      setResult(data);
      if (data.success) {
        setStep(5);
      } else if (data.fieldErrors) {
        setErrors(data.fieldErrors);
      }
    } catch {
      setResult({
        success: false,
        message: "Something went wrong while entering the web. Please try again.",
      });
    } finally {
      clearInterval(interval);
      setSubmitting(false);
    }
  }

  const stepLabels = ["Team", "Members", "Contact", "Confirm"];

  return (
    <div className="mt-10">
      {step < 5 && (
        <div className="mb-8 flex items-center gap-2">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs",
                    active && "border-purple-neon text-ink-100 shadow-[0_0_10px_rgba(230, 25, 255,0.5)]",
                    done && "border-purple-primary bg-purple-primary/30 text-ink-100",
                    !active && !done && "border-purple-primary/30 text-ink-400"
                  )}
                >
                  {n}
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1",
                      done ? "bg-purple-primary" : "bg-purple-primary/20"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-5"
          >
            <Field label="Group Name" error={errors["teamName"]}>
              <input
                className={inputClass}
                value={form.teamName}
                onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                placeholder="e.g. Xterminators"
              />
            </Field>

            <Field label="Group Size">
              <div className="flex gap-3">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateMemberCount(n as 1 | 2 | 3)}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2.5 text-sm",
                      form.teamSize === n
                        ? "border-purple-neon bg-purple-primary/20 text-ink-100"
                        : "border-purple-primary/30 text-ink-300"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-purple-primary px-6 py-2.5 text-ink-100"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-8"
          >
            {form.members.map((member, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-5">
                <p className="mb-4 font-display text-ink-100">
                  Member {idx + 1}
                  {idx === 0 && <span className="ml-2 text-xs text-purple-bright">Team Leader</span>}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" error={errors[`members.${idx}.fullName`]}>
                    <input
                      className={inputClass}
                      value={member.fullName}
                      onChange={(e) => updateMember(idx, { fullName: e.target.value })}
                    />
                  </Field>
                  <Field
                    label="Registration Number"
                    error={errors[`members.${idx}.registrationNumber`]}
                  >
                    <input
                      className={inputClass}
                      value={member.registrationNumber}
                      onChange={(e) =>
                        updateMember(idx, { registrationNumber: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="WhatsApp Number" error={errors[`members.${idx}.whatsappNumber`]}>
                    <input
                      className={inputClass}
                      value={member.whatsappNumber}
                      onChange={(e) => updateMember(idx, { whatsappNumber: e.target.value })}
                      placeholder="+94 7XXXXXXXX"
                    />
                  </Field>
                  <Field label="Email" error={errors[`members.${idx}.email`]}>
                    <input
                      type="email"
                      className={inputClass}
                      value={member.email}
                      onChange={(e) => updateMember(idx, { email: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <button type="button" onClick={goBack} className="text-ink-300 hover:text-ink-100">
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-purple-primary px-6 py-2.5 text-ink-100"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-5"
          >
            <Field label="Team Email" error={errors["teamEmail"]}>
              <input
                type="email"
                className={inputClass}
                value={form.teamEmail}
                onChange={(e) => setForm({ ...form, teamEmail: e.target.value })}
              />
            </Field>
            <Field label="Team WhatsApp Number" error={errors["teamWhatsapp"]}>
              <input
                className={inputClass}
                value={form.teamWhatsapp}
                onChange={(e) => setForm({ ...form, teamWhatsapp: e.target.value })}
                placeholder="+94 7XXXXXXXX"
              />
            </Field>
            <Field label="HackerRank Team Name" error={errors["hackerrankTeamName"]}>
              <input
                className={inputClass}
                value={form.hackerrankTeamName}
                onChange={(e) => setForm({ ...form, hackerrankTeamName: e.target.value })}
              />
            </Field>
            <Field label="GitHub URL (optional)" error={errors["githubUrl"]}>
              <input
                className={inputClass}
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                placeholder="https://github.com/your-team"
              />
            </Field>
            <Field label="Additional Information (optional)">
              <textarea
                className={cn(inputClass, "min-h-24 resize-y")}
                value={form.additionalInformation}
                onChange={(e) =>
                  setForm({ ...form, additionalInformation: e.target.value })
                }
              />
            </Field>

            <div className="flex justify-between pt-2">
              <button type="button" onClick={goBack} className="text-ink-300 hover:text-ink-100">
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-purple-primary px-6 py-2.5 text-ink-100"
              >
                Review
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="s4"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-2xl p-6 text-sm">
              <p className="font-display text-lg text-ink-100">{form.teamName}</p>
              <p className="mt-1 text-ink-400">
                {form.teamSize} member{form.teamSize > 1 ? "s" : ""}
              </p>
              <div className="mt-4 space-y-1 text-ink-300">
                <p>Team Email: {form.teamEmail}</p>
                <p>Team WhatsApp: {form.teamWhatsapp}</p>
                <p>HackerRank Team: {form.hackerrankTeamName}</p>
              </div>
              <div className="mt-4 space-y-2 border-t border-purple-primary/20 pt-4">
                {form.members.map((m, i) => (
                  <p key={i} className="text-ink-300">
                    Member {i + 1}: {m.fullName} ({m.registrationNumber})
                  </p>
                ))}
              </div>
            </div>

            {result && !result.success && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                {result.message}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button type="button" onClick={goBack} className="text-ink-300 hover:text-ink-100">
                Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-full bg-purple-primary px-6 py-2.5 text-ink-100 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {LOADING_MESSAGES[loadingMsgIndex]}
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && result?.success && (
          <motion.div
            key="s5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-3xl p-10 text-center"
          >
            <CheckCircle2 className="mx-auto text-purple-neon" size={40} />
            <p className="mt-4 font-display text-2xl text-ink-100">
              Registration Complete
            </p>
            <p className="mt-1 text-ink-300">You have entered the web.</p>

            <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 rounded-lg border border-purple-primary/40 bg-void-900/60 px-4 py-3">
              <span className="font-mono text-lg text-purple-bright">
                {result.registrationCode}
              </span>
              <button
                type="button"
                aria-label="Copy registration code"
                onClick={() => navigator.clipboard.writeText(result.registrationCode)}
                className="text-ink-400 hover:text-ink-100"
              >
                <Copy size={16} />
              </button>
            </div>

            <div className="mx-auto mt-6 max-w-xs space-y-1 text-left text-sm text-ink-300">
              <p>Team: {form.teamName}</p>
              <p>Size: {form.teamSize}</p>
              <p>Email: {form.teamEmail}</p>
              <p>HackerRank Team: {form.hackerrankTeamName}</p>
            </div>

            <a
              href="/"
              className="mt-8 inline-block rounded-full bg-purple-primary px-8 py-3 font-medium text-ink-100"
            >
              Back to Home
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
