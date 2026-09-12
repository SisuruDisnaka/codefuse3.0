"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Copy, Check, X } from "lucide-react";
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

// Which step each field lives on, so a validation error (whether caught
// client-side or returned by the server) can send the user back to the
// step where they'll actually see it highlighted.
function stepForField(field: string): Step {
  if (field === "teamName" || field === "teamSize") return 1;
  if (field === "members" || field.startsWith("members.")) return 2;
  return 3;
}

function earliestErrorStep(fieldErrors: Record<string, string>): Step | null {
  const steps = Object.keys(fieldErrors).map(stepForField);
  if (steps.length === 0) return null;
  return steps.reduce((min, s) => (s < min ? s : min), steps[0]);
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

  // Live "is this group name already taken" check against the server,
  // debounced so we're not firing a request on every keystroke.
  const [teamNameStatus, setTeamNameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const teamNameCheckId = useRef(0);

  useEffect(() => {
    const name = form.teamName.trim();
    if (name.length < 3) {
      setTeamNameStatus("idle");
      return;
    }

    setTeamNameStatus("checking");
    const requestId = ++teamNameCheckId.current;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/registration/check-team-name?name=${encodeURIComponent(name)}`
        );
        const data: { available: boolean | null } = await res.json();
        if (teamNameCheckId.current !== requestId) return; // stale response
        if (data.available === null) {
          setTeamNameStatus("idle");
        } else {
          setTeamNameStatus(data.available ? "available" : "taken");
          setErrors((e) => {
            if (data.available) {
              const { teamName: _teamName, ...rest } = e;
              return rest;
            }
            return { ...e, teamName: "This group name is already taken." };
          });
        }
      } catch {
        if (teamNameCheckId.current === requestId) setTeamNameStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.teamName]);

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

  function collectFieldErrors(): Record<string, string> {
    const parsed = registrationSchema.safeParse(form);
    const fieldErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
    }
    return fieldErrors;
  }

  function goNext() {
    // The Continue button on step 1 is already disabled while this is
    // pending/blocked, but guard here too in case of a stray Enter-key
    // submit or a race with the debounce.
    if (step === 1 && (teamNameStatus === "taken" || teamNameStatus === "checking")) {
      return;
    }

    // Validate the whole form, but only block advancing (and only show
    // errors) for fields that live on the step the person is currently
    // on — fields on later steps haven't been filled in yet and
    // shouldn't stop them from getting there.
    const fieldErrors = collectFieldErrors();
    const stepErrors = Object.fromEntries(
      Object.entries(fieldErrors).filter(([key]) => stepForField(key) === step)
    );

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }
  function goBack() {
    setErrors({});
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  async function handleSubmit() {
    if (teamNameStatus === "taken") {
      setErrors((e) => ({ ...e, teamName: "This group name is already taken." }));
      setStep(1);
      return;
    }

    const parsed = registrationSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      const jumpTo = earliestErrorStep(fieldErrors);
      if (jumpTo) setStep(jumpTo);
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
        const jumpTo = earliestErrorStep(data.fieldErrors);
        if (jumpTo) setStep(jumpTo);
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
              <div className="relative">
                <input
                  className={cn(inputClass, "pr-10")}
                  value={form.teamName}
                  onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                  placeholder="e.g. Xterminators"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  {teamNameStatus === "checking" && (
                    <Loader2 size={16} className="animate-spin text-ink-400" />
                  )}
                  {teamNameStatus === "available" && (
                    <Check size={16} className="text-emerald-400" />
                  )}
                  {teamNameStatus === "taken" && (
                    <X size={16} className="text-red-400" />
                  )}
                </span>
              </div>
              {teamNameStatus === "available" && !errors["teamName"] && (
                <p className="mt-1 text-xs text-emerald-400">This group name is available.</p>
              )}
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
                disabled={teamNameStatus === "taken" || teamNameStatus === "checking"}
                onClick={goNext}
                className="rounded-full bg-purple-primary px-6 py-2.5 text-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
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

            {errors["members"] && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                {errors["members"]}
              </div>
            )}

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
            <Field label="Group Leaders WhatsApp Number" error={errors["teamWhatsapp"]}>
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
                <p>Group Leaders WhatsApp: {form.teamWhatsapp}</p>
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
