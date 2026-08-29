'use client';

import { formIsLive, emailByDesign } from '@/lib/forms-status';
import { FormsUnavailable } from '@/components/FormsUnavailable';

import { useState } from 'react';

export function MusicianSubmitForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [genre, setGenre] = useState('');
  const [socials, setSocials] = useState('');
  const [trackIdeas, setTrackIdeas] = useState('');
  const [mp3Links, setMp3Links] = useState('');
  const [bio, setBio] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [needsTravel, setNeedsTravel] = useState(false);
  const [travelFrom, setTravelFrom] = useState('');
  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  // Guard below the hooks, not above: hook order has to be identical on every
  // render, so an early return above them is a rules-of-hooks error (broke #48).
  if (!formIsLive('musician-submission')) {
    return <FormsUnavailable
        reason={emailByDesign('musician-submission') ? 'by-design' : 'database-down'} action="submit your music" subject="ZAOstock - musician submission"
      include={['Artist or band name', 'City', 'Genre or sound', 'Track or set ideas', 'Links to music, video or socials', 'A short bio', 'Who referred you, if anyone']} />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus('idle');
    setErrMsg('');
    try {
      const res = await fetch('/api/musicians/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact_email: email,
          city,
          genre,
          socials,
          track_ideas: trackIdeas,
          mp3_links: mp3Links,
          bio,
          referred_by: referredBy,
          needs_travel: needsTravel,
          travel_from: travelFrom,
          hp,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Submission failed');
      }
      setStatus('sent');
      setName('');
      setEmail('');
      setCity('');
      setGenre('');
      setSocials('');
      setTrackIdeas('');
      setMp3Links('');
      setBio('');
      setReferredBy('');
      setNeedsTravel(false);
      setTravelFrom('');
    } catch (err) {
      setStatus('error');
      setErrMsg(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setBusy(false);
    }
  }

  if (status === 'sent') {
    return (
      <div className="zs-alert zs-alert--success">
        <p className="text-lg font-bold text-red-600">Submission received.</p>
        <p className="text-sm text-ink-950 leading-relaxed">
          Thanks. The music team reviews every submission. Expect a follow-up at the email you gave us within a few days.
        </p>
        <p className="text-xs text-ink-muted leading-relaxed">
          Final materials (clean MP3s, artwork, technical rider) are not needed yet. We will ask for them once you are confirmed. The hard cutoff for final materials is September 3, 2026 (one month before the festival).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
      />

      <div className="space-y-1.5">
        <label htmlFor="submit-name" className="zs-label">
          Artist name or band <span className="text-red-600">*</span>
        </label>
        <input
          id="submit-name"
          type="text"
          required
          aria-required="true"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What you go by on a stage"
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="submit-email" className="zs-label">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="submit-email"
          type="email"
          required
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@somewhere.com"
          className="zs-input"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="submit-city" className="zs-label">City / Where you are based</label>
          <input
            id="submit-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Brooklyn, NY"
            className="zs-input"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="submit-genre" className="zs-label">Genre / Sound</label>
          <input
            id="submit-genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Indie folk, hip hop, etc."
            className="zs-input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="submit-track-ideas" className="zs-label">
          Track or song ideas for your set
        </label>
        <textarea
          id="submit-track-ideas"
          rows={3}
          value={trackIdeas}
          onChange={(e) => setTrackIdeas(e.target.value)}
          placeholder="Working titles, vibes, what you would play in your set. Rough is fine."
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="submit-mp3" className="zs-label">
          MP3 / audio links
        </label>
        <textarea
          id="submit-mp3"
          rows={3}
          value={mp3Links}
          onChange={(e) => setMp3Links(e.target.value)}
          placeholder="Drop links to Audius, SoundCloud, Spotify, YouTube, Dropbox, whatever. One per line."
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="submit-socials" className="zs-label">Social links</label>
        <input
          id="submit-socials"
          type="text"
          value={socials}
          onChange={(e) => setSocials(e.target.value)}
          placeholder="Instagram, X, Farcaster, Audius, anywhere people find you"
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="submit-bio" className="zs-label">Short bio</label>
        <textarea
          id="submit-bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A few sentences. What you sound like, who you are, what you want from this."
          className="zs-input"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="submit-referred" className="zs-label">Referred by</label>
        <input
          id="submit-referred"
          type="text"
          value={referredBy}
          onChange={(e) => setReferredBy(e.target.value)}
          placeholder="If someone on the team or in the ZAO music community sent you, name them"
          className="zs-input"
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="zs-check">
          <input
            type="checkbox"
            checked={needsTravel}
            onChange={(e) => setNeedsTravel(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-ink-950">
            I would need travel support to perform at ZAOstock
          </span>
        </label>
      </div>

      {needsTravel ? (
        <div className="space-y-1.5">
          <label htmlFor="submit-travel-from" className="zs-label">Traveling from</label>
          <input
            id="submit-travel-from"
            type="text"
            value={travelFrom}
            onChange={(e) => setTravelFrom(e.target.value)}
            placeholder="City you would fly or drive from"
            className="zs-input"
          />
        </div>
      ) : null}

      {status === 'error' ? (
        <p className="zs-error">{errMsg || 'Something went wrong. Try again.'}</p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="zs-btn zs-btn--primary w-full"
      >
        {busy ? 'Submitting...' : 'Submit'}
      </button>

      <p className="text-xs text-ink-muted leading-relaxed">
        Initial submissions OK now. Final materials (clean MP3s, artwork, technical rider) are due by <span className="text-red-600">September 3, 2026</span> - one month before the festival. Anyone past the cutoff gets replaced from the bench.
      </p>
    </form>
  );
}
