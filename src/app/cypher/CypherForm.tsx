'use client';

import { PUBLIC_FORMS_ENABLED } from '@/lib/forms-status';
import { FormsUnavailable } from '@/components/FormsUnavailable';

import { useState } from 'react';

const ROLE_OPTIONS = [
  { value: 'Vocalist / Rapper', label: 'Vocalist / Rapper' },
  { value: 'Producer', label: 'Producer (laptop + beats)' },
  { value: 'Instrumentalist - guitar', label: 'Guitar' },
  { value: 'Instrumentalist - bass', label: 'Bass' },
  { value: 'Instrumentalist - keys', label: 'Keys / Piano' },
  { value: 'Instrumentalist - horns', label: 'Horns' },
  { value: 'Instrumentalist - drums', label: 'Drums / Percussion' },
  { value: 'DJ', label: 'DJ' },
  { value: 'Spoken word / poet', label: 'Spoken word / poet' },
  { value: 'Other', label: 'Other (tell us below)' },
];

export function CypherForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socials, setSocials] = useState('');
  const [roleSelect, setRoleSelect] = useState(ROLE_OPTIONS[0].value);
  const [roleCustom, setRoleCustom] = useState('');
  const [notes, setNotes] = useState('');
  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Guard below the hooks, not above: hook order has to be identical on every
  // render, so an early return above them is a rules-of-hooks error (broke #48).
  if (!PUBLIC_FORMS_ENABLED) {
    return <FormsUnavailable action="join the cypher" subject="ZAOstock - cypher signup" />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrMsg('');
    const cypherRole = roleSelect === 'Other' ? roleCustom.trim() : roleSelect;
    try {
      const res = await fetch('/api/cypher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email || undefined,
          socials: socials || undefined,
          cypher_role: cypherRole,
          notes: notes || undefined,
          hp,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setStatus('error');
        setErrMsg(d.error || 'Submission failed');
      } else {
        const d = await res.json();
        if (d.editUrl) setEditUrl(d.editUrl);
        if (d.publicUrl) setPublicUrl(d.publicUrl);
        setStatus('sent');
      }
    } catch {
      setStatus('error');
      setErrMsg('Network error');
    } finally {
      setBusy(false);
    }
  }

  function copyEdit() {
    const abs = typeof window !== 'undefined' ? `${window.location.origin}${editUrl}` : editUrl;
    navigator.clipboard.writeText(abs).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (status === 'sent') {
    return (
      <div className="zs-alert zs-alert--success">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-olive-500 font-bold">You are in</p>
          <h2 className="text-xl font-bold text-ink-950 mt-1">Thanks, {name || 'friend'}.</h2>
          <p className="text-sm text-ink-950 mt-2">
            Your cypher signup landed in the ZAOstock music team dashboard. DCoop or someone from the music crew will reach out with logistics.
          </p>
        </div>

        {editUrl && (
          <div className="bg-paper-200 border-2 border-ink-950 rounded-sm p-4 space-y-3">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-red-600 font-bold">Next step: earn your first ZAOfestivals Point</p>
              <p className="text-xs text-ink-950 mt-1">
                Claim your artist profile, add a bio, earn 1 point. Complete the contributor path to be eligible to work the event on Oct 3.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={editUrl}
                className="zs-btn zs-btn--primary w-full"
              >
                Claim + edit my profile -&gt;
              </a>
              <button
                onClick={copyEdit}
                className="zs-btn zs-btn--secondary w-full"
              >
                {copied ? 'Copied!' : 'Copy the private edit link'}
              </button>
            </div>
            <p className="text-[10px] text-ink-muted text-center">
              Save this link. Anyone with it can edit your page. Your public page is{' '}
              {publicUrl && <a href={publicUrl} className="text-red-600 hover:text-denim-500">{publicUrl}</a>}
            </p>
          </div>
        )}

        <p className="text-[11px] text-ink-muted text-center">
          Questions? Email info@thezao.com.
        </p>
      </div>
    );
  }

  const needsCustomRole = roleSelect === 'Other';

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

      <div className="space-y-1.5">
        <label className="zs-label">Name or artist handle</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="How the cypher track will credit you"
          maxLength={200}
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="zs-label">Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="We follow up here"
          maxLength={200}
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="zs-label">Socials or music links</label>
        <input
          value={socials}
          onChange={(e) => setSocials(e.target.value)}
          placeholder="X, Farcaster, Spotify, SoundCloud, website"
          maxLength={500}
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="zs-label">What do you bring to the cypher?</label>
        <select
          value={roleSelect}
          onChange={(e) => setRoleSelect(e.target.value)}
          className="zs-input"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {needsCustomRole && (
          <input
            value={roleCustom}
            onChange={(e) => setRoleCustom(e.target.value)}
            placeholder="Tell us exactly what you bring"
            maxLength={200}
            className="zs-input"
            required
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label className="zs-label">Anything else? (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Genre, references, other artists you want to work with, equipment you bring, anything else"
          rows={4}
          maxLength={1000}
          className="zs-input"
        />
      </div>

      <button
        type="submit"
        disabled={busy || !name.trim() || (needsCustomRole && !roleCustom.trim())}
        className="zs-btn zs-btn--primary w-full"
      >
        {busy ? 'Sending...' : 'I want in on the cypher'}
      </button>

      {status === 'error' && (
        <p className="zs-error">{errMsg || 'Something went wrong. Try again.'}</p>
      )}

      <p className="text-[11px] text-ink-muted text-center">
        The music team reaches out within a few days with the pre-event coordination thread.
      </p>
    </form>
  );
}
