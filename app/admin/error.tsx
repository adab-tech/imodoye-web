"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-manuscript px-6">
      <div className="w-full max-w-sm bg-paper rounded p-8 text-center">
        <p className="font-mono text-xs mb-2 text-terracotta">SOMETHING WENT WRONG</p>
        <p className="font-ui text-sm mb-6 opacity-80">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="font-ui text-sm px-6 py-3 bg-indigo text-paper rounded-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
