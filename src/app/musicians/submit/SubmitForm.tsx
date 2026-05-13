'use client';

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
  const [cypherInterested, setCypherInterested] = useState(false);
  const [needsTravel, setNeedsTravel] = useState(false);
  const [travelFrom, setTravelFrom] = useState('');
  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

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
          cypher_interested: cypherInterested,
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
      setCypherInterested(false);
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
      <div className="bg-[#0d1b2a] rounded-xl p-6 border border-[#f5a623]/40 space-y-3">
        <p className="text-lg font-bold text-[#f5a623]">Submission received.</p>
        <p className="text-sm text-gray-300 leading-relaxed">
          Thanks. The music team reviews every submission. Expect a follow-up at the email you gave us within a few days.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
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
        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">
          Artist name or band <span className="text-[#f5a623]">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What you go by on a stage"
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">
          Email <span className="text-[#f5a623]">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@somewhere.com"
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">City / Where you are based</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Brooklyn, NY"
            className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Genre / Sound</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Indie folk, hip hop, etc."
            className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">
          Track or song ideas for your set
        </label>
        <textarea
          rows={3}
          value={trackIdeas}
          onChange={(e) => setTrackIdeas(e.target.value)}
          placeholder="Working titles, vibes, what you would play in a 25-minute set. Rough is fine."
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">
          MP3 / audio links
        </label>
        <textarea
          rows={3}
          value={mp3Links}
          onChange={(e) => setMp3Links(e.target.value)}
          placeholder="Drop links to Audius, SoundCloud, Spotify, YouTube, Dropbox, whatever. One per line."
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Social links</label>
        <input
          type="text"
          value={socials}
          onChange={(e) => setSocials(e.target.value)}
          placeholder="Instagram, X, Farcaster, Audius, anywhere people find you"
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Short bio</label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A few sentences. What you sound like, who you are, what you want from this."
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Referred by</label>
        <input
          type="text"
          value={referredBy}
          onChange={(e) => setReferredBy(e.target.value)}
          placeholder="If someone on the team or in the ZAO music community sent you, name them"
          className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="flex items-start gap-2.5 bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 cursor-pointer hover:border-[#f5a623]/30 transition-colors">
          <input
            type="checkbox"
            checked={cypherInterested}
            onChange={(e) => setCypherInterested(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-200">
            Interested in joining the ZAOstock Cypher (live multi-artist collaborative track)
          </span>
        </label>
        <label className="flex items-start gap-2.5 bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 cursor-pointer hover:border-[#f5a623]/30 transition-colors">
          <input
            type="checkbox"
            checked={needsTravel}
            onChange={(e) => setNeedsTravel(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-200">
            I would need travel support to perform at ZAOstock
          </span>
        </label>
      </div>

      {needsTravel ? (
        <div className="space-y-1.5">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Traveling from</label>
          <input
            type="text"
            value={travelFrom}
            onChange={(e) => setTravelFrom(e.target.value)}
            placeholder="City you would fly or drive from"
            className="w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30"
          />
        </div>
      ) : null}

      {status === 'error' ? (
        <p className="text-sm text-rose-400">{errMsg || 'Something went wrong. Try again.'}</p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-[#f5a623] hover:bg-[#ffd700] disabled:bg-[#f5a623]/40 text-black font-bold rounded-lg px-4 py-3 text-sm transition-colors"
      >
        {busy ? 'Submitting...' : 'Submit'}
      </button>

      <p className="text-xs text-gray-500 leading-relaxed">
        Initial submissions OK now. Final materials (clean MP3s, artwork, technical rider) are due by <span className="text-[#f5a623]">September 3, 2026</span> - one month before the festival. Anyone past the cutoff gets replaced from the bench.
      </p>
    </form>
  );
}
