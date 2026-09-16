'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MissingItem } from '@/content/artist-ops';
import { Field, Input, Textarea } from '@/components/poster';

// Replaces the embedded Google Form on this page (Zaal, 2026-09-16: "not
// great at all for the artists... honestly we need a different form for
// each artist and just a line or something, or just ask them for the 4
// things"). Native fields, one PATCH, gated by the code in the URL - which
// this component already has, because the artist is looking at it in their
// own address bar. On success, router.refresh() re-runs the page's own
// server-side fetch, so the item disappears from `missing` the normal way
// rather than this component tracking its own copy of server truth.
export function BackstageAsks({ code, missing }: { code: string; missing: MissingItem[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [yesno, setYesno] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setText(key: string, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    const body: Record<string, unknown> = {};
    for (const item of missing) {
      if (item.kind === 'yesno') {
        if (item.key in yesno) body[item.key] = yesno[item.key];
      } else {
        const v = values[item.key];
        if (v !== undefined && v.trim() !== '') body[item.key] = v.trim();
      }
    }
    if (Object.keys(body).length === 0) {
      setError('Answer at least one before sending.');
      setBusy(false);
      return;
    }
    try {
      const res = await fetch(`/api/backstage/${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'Save failed');
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError('Network error. Try again.');
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {missing.map((item) => (
        <Field key={item.key} label={item.label} htmlFor={`ask-${item.key}`} hint={item.detail}>
          {item.kind === 'yesno' ? (
            <div className="flex gap-2">
              {(['Yes', 'No'] as const).map((opt) => {
                const val = opt === 'Yes';
                const selected = yesno[item.key] === val;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setYesno((prev) => ({ ...prev, [item.key]: val }))}
                    className={`flex-1 rounded-[10px] border-[1.5px] px-4 py-3 font-sans text-base font-bold transition-colors ${
                      selected
                        ? 'border-ink-950 bg-gold-400 text-ink-950'
                        : 'border-ink-950/35 bg-paper-100 text-ink-950'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : item.kind === 'textarea' ? (
            <Textarea
              id={`ask-${item.key}`}
              value={values[item.key] ?? ''}
              onChange={(e) => setText(item.key, e.target.value)}
              maxLength={2000}
            />
          ) : (
            <Input
              id={`ask-${item.key}`}
              type={item.kind === 'url' ? 'url' : 'text'}
              value={values[item.key] ?? ''}
              onChange={(e) => setText(item.key, e.target.value)}
              placeholder={item.kind === 'url' ? 'https://...' : undefined}
              maxLength={500}
            />
          )}
        </Field>
      ))}
      {error && (
        <p className="text-sm text-red-700 font-semibold m-0" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-50 text-ink-950 font-bold rounded-lg px-4 py-3 text-base transition-colors"
      >
        {busy ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
