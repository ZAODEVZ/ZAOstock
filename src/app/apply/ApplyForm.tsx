'use client';

import { formIsLive } from '@/lib/forms-status';
import { FormsUnavailable } from '@/components/FormsUnavailable';

import { useState } from 'react';

interface RoleOption {
  value: string;
  label: string;
  hint: string;
}

interface ShiftOption {
  value: string;
  label: string;
}

export function ApplyForm({ roles, shifts }: { roles: RoleOption[]; shifts: ShiftOption[] }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleInterest, setRoleInterest] = useState('unassigned');
  const [shiftInterest, setShiftInterest] = useState('allday');
  const [message, setMessage] = useState('');
  const [briefOptIn, setBriefOptIn] = useState(true);
  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState<string>('');

  // Guard below the hooks, not above: hook order has to be identical on every
  // render, so an early return above them is a rules-of-hooks error (broke #48).
  if (!formIsLive('volunteer')) {
    return <FormsUnavailable action="volunteer" subject="ZAOstock - volunteer signup"
      include={['Your name', 'How to reach you', 'What you would like to help with', 'Which hours on Oct 3 you are free']} />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrMsg('');
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          role_interest: roleInterest,
          shift_interest: shiftInterest,
          message: message || undefined,
          brief_optin: briefOptIn,
          hp,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setStatus('error');
        setErrMsg(d.error || 'Submission failed');
      } else {
        setStatus('sent');
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
        <p className="text-xs uppercase tracking-wider text-olive-500 font-bold">You are in</p>
        <h2 className="text-xl font-bold text-ink-950">Thanks, {name || 'friend'}.</h2>
        <p className="text-sm text-ink-950">
          Your signup landed in the ZAOstock team dashboard. A team lead will reach out within a few days with shift details and a crew kickoff message.
        </p>
        <p className="text-xs text-ink-muted">
          Questions before then? Email info@thezao.com.
        </p>
      </div>
    );
  }

  const selectedRole = roles.find((r) => r.value === roleInterest);

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
        <label htmlFor="apply-name" className="zs-label">Your name</label>
        <input
          id="apply-name"
          required
          aria-required="true"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First Last or handle"
          maxLength={200}
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-email" className="zs-label">Email</label>
        <input
          id="apply-email"
          required
          aria-required="true"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          maxLength={200}
          aria-describedby={status === 'error' ? 'apply-error' : undefined}
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-phone" className="zs-label">Phone (optional)</label>
        <input
          id="apply-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Day-of only, so we can reach you fast"
          maxLength={50}
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-role" className="zs-label">Where do you want to plug in?</label>
        <select
          id="apply-role"
          value={roleInterest}
          onChange={(e) => setRoleInterest(e.target.value)}
          className="zs-input"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {selectedRole && (
          <p className="text-[11px] text-ink-muted italic">{selectedRole.hint}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-shift" className="zs-label">Shift preference</label>
        <select
          id="apply-shift"
          value={shiftInterest}
          onChange={(e) => setShiftInterest(e.target.value)}
          className="zs-input"
        >
          {shifts.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-message" className="zs-label">Anything else? (optional)</label>
        <textarea
          id="apply-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Skills, availability caveats, who referred you, why you want to help"
          rows={4}
          maxLength={1000}
          className="zs-input"
        />
      </div>

      <label className="zs-check">
        <input
          type="checkbox"
          checked={briefOptIn}
          onChange={(e) => setBriefOptIn(e.target.checked)}
          className="mt-0.5 accent-red-600"
        />
        <span className="text-xs text-ink-950">
          Send me the weekly ZAOstock build log - what moved, what needs hands, one thing you can help with.
          <span className="block text-[10px] text-ink-muted mt-0.5">Uncheck to skip. One email a week, cancel anytime.</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={busy || !name.trim() || !email.trim()}
        className="zs-btn zs-btn--primary w-full"
      >
        {busy ? 'Sending...' : 'Sign me up'}
      </button>

      {status === 'error' && (
        <p id="apply-error" role="alert" className="zs-error">{errMsg || 'Something went wrong. Try again.'}</p>
      )}

      <p className="text-[11px] text-ink-muted text-center">
        We reach out within a few days. No commitment until you say yes to a specific shift.
      </p>
    </form>
  );
}
