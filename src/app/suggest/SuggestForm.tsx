'use client';

import { PUBLIC_FORMS_ENABLED } from '@/lib/forms-status';
import { FormsUnavailable } from '@/components/FormsUnavailable';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SuggestForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  // Guard below the hooks, not above: hook order has to be identical on every
  // render, so an early return above them is a rules-of-hooks error (broke #48).
  if (!PUBLIC_FORMS_ENABLED) {
    return <FormsUnavailable action="send a suggestion" subject="ZAOstock - suggestion" />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setBusy(true);
    setErrMsg('');
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || undefined,
          contact: contact || undefined,
          suggestion,
          hp,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setStatus('error');
        setErrMsg(d.error || 'Submission failed');
      } else {
        setStatus('sent');
        setSuggestion('');
        setName('');
        setContact('');
        setTimeout(() => {
          router.refresh();
          setStatus('idle');
        }, 1500);
      }
    } catch {
      setStatus('error');
      setErrMsg('Network error');
    } finally {
      setBusy(false);
    }
  }

  if (status === 'sent') {
    return (
      <div className="zs-alert zs-alert--success">
        <p className="text-xs uppercase tracking-wider text-olive-500 font-bold">Thanks</p>
        <p className="text-sm text-ink-950 mt-2">
          Suggestion submitted. The team sees it in the dashboard. Refreshing the list now.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="zs-form">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid grid-cols-2 gap-2">
        <label htmlFor="suggest-name" className="sr-only">Your name (optional)</label>
        <input
          id="suggest-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={200}
          className="zs-input"
        />
        <label htmlFor="suggest-contact" className="sr-only">Contact (optional)</label>
        <input
          id="suggest-contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Contact (optional)"
          maxLength={200}
          className="zs-input"
        />
      </div>
      <label htmlFor="suggest-text" className="sr-only">Your suggestion</label>
      <textarea
        id="suggest-text"
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        placeholder="Your suggestion..."
        required
        aria-required="true"
        aria-describedby={status === 'error' ? 'suggest-error' : undefined}
        rows={4}
        maxLength={2000}
        className="zs-input"
      />
      <button
        type="submit"
        disabled={busy || !suggestion.trim()}
        className="zs-btn zs-btn--primary w-full"
      >
        {busy ? 'Sending...' : 'Drop suggestion'}
      </button>
      {status === 'error' && <p id="suggest-error" role="alert" className="zs-error">{errMsg}</p>}
    </form>
  );
}
