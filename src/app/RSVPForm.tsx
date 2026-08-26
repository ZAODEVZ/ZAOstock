'use client';

import { useState } from 'react';
import { PUBLIC_FORMS_ENABLED } from '@/lib/forms-status';
import { FormsUnavailable } from '@/components/FormsUnavailable';

interface RSVPFormProps {
  eventSlug: string;
}

export function RSVPForm({ eventSlug }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Guard below the hooks, not above: hook order has to be identical on every
  // render, so an early return above them is a rules-of-hooks error (broke #48).
  //
  // #48 took the four /apply, /cypher, /musicians/submit and /suggest forms off
  // and missed this one, which is the most visible form on the site - it sits on
  // the homepage. It kept accepting names and email addresses and discarding
  // every one of them, exactly the failure FormsUnavailable exists to prevent.
  if (!PUBLIC_FORMS_ENABLED) {
    return <FormsUnavailable action="get on the list for Oct 3" subject="ZAOstock - RSVP" include={['Your name', 'The email to reach you on']} />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, eventSlug }),
      });

      if (res.status === 409) {
        setStatus('duplicate');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMsg('Network error — please try again');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-2">
        <p className="text-[#f5a623] font-bold">You&apos;re on the list!</p>
        <p className="text-sm text-gray-400 mt-1">We&apos;ll notify you when there&apos;s news.</p>
      </div>
    );
  }

  if (status === 'duplicate') {
    return (
      <div className="text-center py-2">
        <p className="text-[#f5a623] font-medium">You&apos;ve already RSVPed!</p>
        <p className="text-sm text-gray-400 mt-1">We have your info &mdash; stay tuned.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="rsvp-name" className="sr-only">Your name</label>
        <input
          id="rsvp-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
          className="flex-1 bg-[#0a1628] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] focus:border-[#f5a623]/50"
        />
        <label htmlFor="rsvp-email" className="sr-only">Email address</label>
        <input
          id="rsvp-email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          aria-describedby={status === 'error' ? 'rsvp-error' : undefined}
          className="flex-1 bg-[#0a1628] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] focus:border-[#f5a623]/50"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
      >
        {status === 'loading' ? 'Submitting...' : 'RSVP'}
      </button>
      {status === 'error' && (
        <p id="rsvp-error" role="alert" className="text-red-400 text-xs text-center">{errorMsg}</p>
      )}
    </form>
  );
}
