'use client';

import { PUBLIC_FORMS_ENABLED } from '@/lib/forms-status';
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
  if (!PUBLIC_FORMS_ENABLED) {
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
      <div className="bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent rounded-xl p-6 border border-emerald-500/30 space-y-3 text-center">
        <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold">You are in</p>
        <h2 className="text-xl font-bold text-white">Thanks, {name || 'friend'}.</h2>
        <p className="text-sm text-gray-300">
          Your signup landed in the ZAOstock team dashboard. A team lead will reach out within a few days with shift details and a crew kickoff message.
        </p>
        <p className="text-xs text-gray-500">
          Questions before then? DM Zaal on Farcaster.
        </p>
      </div>
    );
  }

  const selectedRole = roles.find((r) => r.value === roleInterest);

  return (
    <form onSubmit={submit} className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-4">
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
        <label htmlFor="apply-name" className="text-xs text-gray-400 uppercase tracking-wider font-bold">Your name</label>
        <input
          id="apply-name"
          required
          aria-required="true"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First Last or handle"
          maxLength={200}
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] focus:border-[#f5a623]/30"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-email" className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email</label>
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
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] focus:border-[#f5a623]/30"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-phone" className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phone (optional)</label>
        <input
          id="apply-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Day-of only, so we can reach you fast"
          maxLength={50}
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-role" className="text-xs text-gray-400 uppercase tracking-wider font-bold">Where do you want to plug in?</label>
        <select
          id="apply-role"
          value={roleInterest}
          onChange={(e) => setRoleInterest(e.target.value)}
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#f5a623]/30"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {selectedRole && (
          <p className="text-[11px] text-gray-500 italic">{selectedRole.hint}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-shift" className="text-xs text-gray-400 uppercase tracking-wider font-bold">Shift preference</label>
        <select
          id="apply-shift"
          value={shiftInterest}
          onChange={(e) => setShiftInterest(e.target.value)}
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#f5a623]/30"
        >
          {shifts.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="apply-message" className="text-xs text-gray-400 uppercase tracking-wider font-bold">Anything else? (optional)</label>
        <textarea
          id="apply-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Skills, availability caveats, who referred you, why you want to help"
          rows={4}
          maxLength={1000}
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30 resize-none"
        />
      </div>

      <label className="flex items-start gap-2.5 bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 cursor-pointer hover:border-[#f5a623]/30 transition-colors">
        <input
          type="checkbox"
          checked={briefOptIn}
          onChange={(e) => setBriefOptIn(e.target.checked)}
          className="mt-0.5 accent-[#f5a623]"
        />
        <span className="text-xs text-gray-300">
          Send me the weekly ZAOstock build log - what moved, what needs hands, one thing you can help with.
          <span className="block text-[10px] text-gray-500 mt-0.5">Uncheck to skip. One email a week, cancel anytime.</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={busy || !name.trim() || !email.trim()}
        className="w-full bg-[#f5a623] hover:bg-[#ffd700] disabled:opacity-50 text-black font-bold rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
      >
        {busy ? 'Sending...' : 'Sign me up'}
      </button>

      {status === 'error' && (
        <p id="apply-error" role="alert" className="text-xs text-red-400 text-center">{errMsg || 'Something went wrong. Try again.'}</p>
      )}

      <p className="text-[11px] text-gray-500 text-center">
        We reach out within a few days. No commitment until you say yes to a specific shift.
      </p>
    </form>
  );
}
