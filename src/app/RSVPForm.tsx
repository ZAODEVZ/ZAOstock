'use client';

import { useState } from 'react';
import { formIsLive } from '@/lib/forms-status';
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
  if (!formIsLive('rsvp')) {
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
        <p className="text-red-600 font-bold">You&apos;re on the list!</p>
        <p className="text-sm text-ink-muted mt-1">We&apos;ll notify you when there&apos;s news.</p>
      </div>
    );
  }

  if (status === 'duplicate') {
    return (
      <div className="text-center py-2">
        <p className="text-red-600 font-medium">You&apos;ve already RSVPed!</p>
        <p className="text-sm text-ink-muted mt-1">We have your info &mdash; stay tuned.</p>
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
          className="zs-input"
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
          className="zs-input"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="zs-btn zs-btn--primary w-full"
      >
        {status === 'loading' ? 'Submitting...' : 'RSVP'}
      </button>
      {status === 'error' && (
        <p id="rsvp-error" role="alert" className="text-red-700 text-xs text-center">{errorMsg}</p>
      )}
    </form>
  );
}
