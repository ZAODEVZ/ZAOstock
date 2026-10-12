'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center rounded-full border border-ink-950/40 px-5 py-2.5 font-bold text-sm uppercase tracking-[0.08em] text-ink-950 hover:bg-ink-950/5"
    >
      Print the sheet
    </button>
  );
}
