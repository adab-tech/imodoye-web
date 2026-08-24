"use client";

import { useState } from "react";

const STEPS = [
  "Personal info",
  "Writing background",
  "Residency project",
  "Writing sample",
  "Review & submit",
];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // TODO: replace with real form state + Supabase insert into `applications`
  // once the project exists. Each step below should write to that state
  // object instead of rendering empty inputs.

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

      <div className="bg-paper rounded p-8 mb-8">
        {step === 0 && (
          <div className="space-y-4">
            {["Full name", "Email", "Country"].map((f) => (
              <div key={f}>
                <label className="font-ui text-sm block mb-1 opacity-75">
                  {f}
                </label>
                <div className="h-10 border border-ink/20 rounded-sm bg-manuscript" />
              </div>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <p className="font-ui text-sm opacity-75">
              Genre, publication history, prior residencies.
            </p>
            <div className="h-24 border border-ink/20 rounded-sm bg-manuscript" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="font-ui text-sm opacity-75">
              What will you work on during the residency?
            </p>
            <div className="h-36 border border-ink/20 rounded-sm bg-manuscript" />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="font-ui text-sm opacity-75">
              Upload up to 10 pages of unpublished or published work.
            </p>
            <div className="h-24 border border-dashed border-ink/40 rounded-sm flex items-center justify-center font-mono text-sm opacity-60">
              drop file — .pdf / .docx
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-2 font-mono text-sm opacity-75">
            <p>NAME — [pending input]</p>
            <p>COUNTRY — [pending input]</p>
            <p>PROJECT — [pending input]</p>
            <p>SAMPLE — [pending upload]</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={back}
          disabled={step === 0}
          className={`font-ui text-sm bg-transparent border-none ${
            step === 0 ? "opacity-30" : "opacity-70 cursor-pointer"
          }`}
        >
          ← Back
        </button>
        <div className="flex gap-3 items-center">
          {saved && (
            <span className="font-mono text-xs text-palm">Draft saved</span>
          )}
          <button
            onClick={() => setSaved(true)}
            className="font-ui text-sm text-indigo bg-transparent border-none cursor-pointer"
          >
            Save &amp; exit
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm"
            >
              Continue
            </button>
          ) : (
            <button className="font-ui text-sm px-6 py-3 bg-terracotta text-paper rounded-sm">
              Submit application
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
