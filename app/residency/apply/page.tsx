"use client";

import { useState } from "react";
import { submitApplication } from "./actions";

const STEPS = [
  "Personal info",
  "Writing background",
  "Residency project",
  "Writing sample",
  "Review & submit",
];

const inputClass = "w-full px-3 py-2 border border-ink/20 rounded-sm bg-paper font-ui text-sm";

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [writingBackground, setWritingBackground] = useState("");
  const [projectProposal, setProjectProposal] = useState("");
  const [sampleFile, setSampleFile] = useState<File | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canContinue =
    (step === 0 && fullName.trim() && email.trim()) ||
    (step === 1 && writingBackground.trim()) ||
    (step === 2 && projectProposal.trim()) ||
    (step === 3 && sampleFile) ||
    step === 4;

  return (
    <section className="px-6 py-16 md:px-16 max-w-xl mx-auto">
      <p className="font-mono text-xs mb-3 text-terracotta">
        COHORT 08 · APPLICATION
      </p>
      <h1 className="font-display text-3xl mb-8">Apply to the residency</h1>

      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center justify-center text-xs w-7 h-7 rounded-full font-mono border ${
                i <= step
                  ? "bg-indigo text-paper border-indigo"
                  : "border-ink/30 text-ink"
              }`}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px ${i < step ? "bg-indigo" : "bg-ink/20"}`}
              />
            )}
          </div>
        ))}
      </div>

      <p className="font-ui text-sm mb-6 opacity-60">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      <form action={submitApplication}>
        {/* All fields stay mounted across steps (just hidden via CSS) so
            nothing is lost when moving back and forth, and the final
            native form submission carries every value at once. */}
        <div className="bg-paper rounded p-8 mb-8">
          <div className={step === 0 ? "space-y-4" : "hidden"}>
            <div>
              <label className="font-ui text-sm block mb-1 opacity-75">Full name</label>
              <input name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="font-ui text-sm block mb-1 opacity-75">Email</label>
              <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="font-ui text-sm block mb-1 opacity-75">Country</label>
              <input name="country" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className={step === 1 ? "space-y-3" : "hidden"}>
            <p className="font-ui text-sm opacity-75">
              Genre, publication history, prior residencies.
            </p>
            <textarea
              name="writingBackground"
              value={writingBackground}
              onChange={(e) => setWritingBackground(e.target.value)}
              rows={5}
              className={inputClass}
            />
          </div>

          <div className={step === 2 ? "space-y-3" : "hidden"}>
            <p className="font-ui text-sm opacity-75">
              What will you work on during the residency?
            </p>
            <textarea
              name="projectProposal"
              value={projectProposal}
              onChange={(e) => setProjectProposal(e.target.value)}
              rows={7}
              className={inputClass}
            />
          </div>

          <div className={step === 3 ? "space-y-3" : "hidden"}>
            <p className="font-ui text-sm opacity-75">
              Upload up to 10 pages of unpublished or published work (.pdf or .docx).
            </p>
            <label className="h-24 border border-dashed border-ink/40 rounded-sm flex items-center justify-center font-mono text-sm opacity-60 cursor-pointer">
              {sampleFile ? sampleFile.name : "choose a file — .pdf / .docx"}
              <input
                type="file"
                name="sample"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setSampleFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          </div>

          <div className={step === 4 ? "space-y-2 font-mono text-sm opacity-75" : "hidden"}>
            <p>NAME — {fullName || "—"}</p>
            <p>EMAIL — {email || "—"}</p>
            <p>COUNTRY — {country || "—"}</p>
            <p>SAMPLE — {sampleFile?.name || "—"}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className={`font-ui text-sm bg-transparent border-none ${
              step === 0 ? "opacity-30" : "opacity-70 cursor-pointer"
            }`}
          >
            ← Back
          </button>
          <div className="flex gap-3 items-center">
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canContinue}
                className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm"
              >
                Submit application
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
