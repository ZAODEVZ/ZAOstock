'use client';

import { useState } from 'react';
import type { PublicArtist } from '@/lib/artists';

const STATUS_COLOR: Record<string, string> = {
  wishlist: 'bg-paper-100 text-ink-muted border-ink-950/60',
  contacted: 'bg-denim-300 text-denim-500 border-ink-950/60',
  interested: 'bg-gold-300 text-gold-600 border-ink-950/60',
  confirmed: 'bg-olive-300 text-olive-500 border-ink-950/60',
  travel_booked: 'bg-olive-300 text-olive-500 border-ink-950/60',
};

const STATUS_LABEL: Record<string, string> = {
  wishlist: 'Wishlist',
  contacted: 'Contacted',
  interested: 'Interested',
  confirmed: 'Confirmed',
  travel_booked: 'Booked',
};

interface Props {
  artist: PublicArtist;
  canEdit: boolean;
  token: string;
}

export function ArtistProfileView({ artist, canEdit, token }: Props) {
  const [bio, setBio] = useState(artist.bio);
  const [photoUrl, setPhotoUrl] = useState(artist.photo_url);
  const [logoUrl, setLogoUrl] = useState(artist.logo_url);
  const [socials, setSocials] = useState(artist.socials);
  const [genre, setGenre] = useState(artist.genre);
  const [city, setCity] = useState(artist.city);
  const [editing, setEditing] = useState(canEdit && !artist.bio);
  const [points, setPoints] = useState(artist.points_earned);
  const [eligible, setEligible] = useState(artist.volunteer_eligible);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [justEarned, setJustEarned] = useState(0);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [photoBroken, setPhotoBroken] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/artist-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: artist.slug,
          token,
          bio,
          photo_url: photoUrl,
          logo_url: logoUrl,
          socials,
          genre,
          city,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setMsg(d.error || 'Save failed');
      } else {
        const d = await res.json();
        if (d.earnedThisCall) {
          setPoints(d.totalPoints);
          setJustEarned(d.earnedThisCall);
          setTimeout(() => setJustEarned(0), 6000);
        }
        if (d.becameEligible) {
          setEligible(true);
          setJustUnlocked(true);
          setTimeout(() => setJustUnlocked(false), 6000);
        }
        setEditing(false);
        setMsg('Saved');
        setTimeout(() => setMsg(null), 2000);
      }
    } catch {
      setMsg('Network error');
    } finally {
      setBusy(false);
    }
  }

  const showPhoto = photoUrl && !photoBroken;
  const showLogo = logoUrl && !logoBroken;
  const initials = artist.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hasBio = bio.trim().length > 0;
  const hasLogo = logoUrl.trim().length > 0;

  return (
    <section className="grain bg-paper-200 rounded-md p-6 border-2 border-ink-950 shadow-hard space-y-4">
      {justEarned > 0 && (
        <div className="bg-gold-400 border border-ink-950 rounded-lg p-3 text-center">
          <p className="text-xs uppercase tracking-wider font-bold text-gold-600">
            You earned {justEarned} ZAOfestivals Point{justEarned === 1 ? '' : 's'}
          </p>
          <p className="text-[11px] text-ink-950 mt-0.5">
            Paid post-event. Keep moving through the contributor path.
          </p>
        </div>
      )}
      {justUnlocked && (
        <div className="bg-olive-300 border border-ink-950/60 rounded-lg p-3 text-center">
          <p className="text-xs uppercase tracking-wider font-bold text-olive-500">
            Volunteer eligible unlocked
          </p>
          <p className="text-[11px] text-ink-950 mt-0.5">
            You are now on the roster for Oct 3. See you at the parklet.
          </p>
        </div>
      )}

      <div className="flex items-start gap-4">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={artist.name}
            onError={() => setPhotoBroken(true)}
            className="w-24 h-24 rounded-full object-cover border-2 border-ink-950 flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-paper-200 border-2 border-ink-950/60 flex-shrink-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-ink-muted">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-ink-950">{artist.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {artist.status !== 'declined' && (
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase ${STATUS_COLOR[artist.status] || STATUS_COLOR.wishlist}`}>
                {STATUS_LABEL[artist.status] || artist.status}
              </span>
            )}
            {points > 0 && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-full border uppercase bg-gold-400 text-gold-600 border-ink-950">
                {points} ZAOfestivals Point{points === 1 ? '' : 's'}
              </span>
            )}
            {eligible && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-full border uppercase bg-olive-300 text-olive-500 border-ink-950/60">
                Volunteer eligible
              </span>
            )}
          </div>
        </div>
      </div>

      {canEdit && (
        <ContributorPath hasBio={hasBio} hasLogo={hasLogo} eligible={eligible} />
      )}

      {!editing && (
        <>
          {bio.trim() ? (
            <div>
              <p className="text-[10px] text-ink-muted uppercase tracking-wider font-bold mb-1">Bio</p>
              <p className="text-sm text-ink-950 leading-relaxed whitespace-pre-wrap">{bio}</p>
            </div>
          ) : (
            <div className="bg-paper-200 border border-ink-950/60 rounded-lg p-4 text-center">
              <p className="text-sm text-ink-muted italic">No bio yet.</p>
              {canEdit && (
                <p className="text-[11px] text-ink-muted mt-2">
                  Add a bio below to earn your first ZAOfestivals Point.
                </p>
              )}
            </div>
          )}

          {showLogo && (
            <div>
              <p className="text-[10px] text-ink-muted uppercase tracking-wider font-bold mb-2">Brand logo</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={`${artist.name} logo`}
                onError={() => setLogoBroken(true)}
                className="max-h-32 max-w-full rounded bg-paper-200 p-2 border border-ink-950/60"
              />
            </div>
          )}

          {(genre || city) && (
            <div className="flex gap-4 text-xs text-ink-muted">
              {genre && <span><strong className="text-ink-950">Genre:</strong> {genre}</span>}
              {city && <span><strong className="text-ink-950">City:</strong> {city}</span>}
            </div>
          )}

          {socials.trim() && (
            <div>
              <p className="text-[10px] text-ink-muted uppercase tracking-wider font-bold mb-1">Links</p>
              <p className="text-xs text-ink-muted break-words">{socials}</p>
            </div>
          )}

          {canEdit && (
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-gold-400 hover:bg-gold-500 text-ink-950 font-bold rounded-lg px-4 py-2.5 text-sm transition-colors"
            >
              {hasBio && hasLogo ? 'Edit my profile' : hasBio ? 'Add my logo (next step)' : 'Start earning points'}
            </button>
          )}
        </>
      )}

      {editing && canEdit && (
        <div className="space-y-3">
          <p className="text-xs text-ink-muted leading-relaxed">
            Editing {artist.name}&apos;s profile. Keep this edit link private; anyone with it can edit this page.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs text-ink-muted uppercase tracking-wider font-bold">Photo URL</label>
            <input
              value={photoUrl}
              onChange={(e) => { setPhotoUrl(e.target.value); setPhotoBroken(false); }}
              placeholder="https://... (your X / Farcaster pfp)"
              maxLength={500}
              className="w-full bg-paper-100 border border-ink-950/60 rounded px-3 py-2.5 text-sm text-ink-950 placeholder-gray-600 focus:outline-none focus:border-ink-950"
            />
            {photoBroken && photoUrl && (
              <p className="text-[10px] text-gold-600">Image did not load. Use a direct https:// URL.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-ink-muted uppercase tracking-wider font-bold flex items-center gap-2">
              Brand logo URL {!hasLogo && <span className="bg-gold-400 text-gold-600 px-1.5 py-0.5 rounded text-[9px] normal-case">+1 point</span>}
            </label>
            <input
              value={logoUrl}
              onChange={(e) => { setLogoUrl(e.target.value); setLogoBroken(false); }}
              placeholder="https://... (your artist brand logo)"
              maxLength={500}
              className="w-full bg-paper-100 border border-ink-950/60 rounded px-3 py-2.5 text-sm text-ink-950 placeholder-gray-600 focus:outline-none focus:border-ink-950"
            />
            {logoBroken && logoUrl && (
              <p className="text-[10px] text-gold-600">Image did not load. Use a direct https:// URL.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-ink-muted uppercase tracking-wider font-bold flex items-center gap-2">
              Bio {!hasBio && <span className="bg-gold-400 text-gold-600 px-1.5 py-0.5 rounded text-[9px] normal-case">+1 point</span>}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Who you are, what you make, what you bring to ZAOstock"
              rows={6}
              maxLength={2000}
              className="w-full bg-paper-100 border border-ink-950/60 rounded px-3 py-2.5 text-sm text-ink-950 placeholder-gray-600 focus:outline-none focus:border-ink-950 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-ink-muted uppercase tracking-wider font-bold">Genre</label>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Hip-hop, indie"
                maxLength={100}
                className="w-full bg-paper-100 border border-ink-950/60 rounded px-3 py-2.5 text-sm text-ink-950 placeholder-gray-600 focus:outline-none focus:border-ink-950"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-ink-muted uppercase tracking-wider font-bold">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Brooklyn, Oakland"
                maxLength={100}
                className="w-full bg-paper-100 border border-ink-950/60 rounded px-3 py-2.5 text-sm text-ink-950 placeholder-gray-600 focus:outline-none focus:border-ink-950"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-ink-muted uppercase tracking-wider font-bold">Links + Socials</label>
            <input
              value={socials}
              onChange={(e) => setSocials(e.target.value)}
              placeholder="x.com/..., farcaster.xyz/..., spotify, soundcloud, website"
              maxLength={500}
              className="w-full bg-paper-100 border border-ink-950/60 rounded px-3 py-2.5 text-sm text-ink-950 placeholder-gray-600 focus:outline-none focus:border-ink-950"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="bg-gold-400 hover:bg-gold-500 disabled:opacity-50 text-ink-950 font-bold rounded-lg px-4 py-2.5 text-sm transition-colors"
            >
              {busy ? 'Saving...' : 'Save profile'}
            </button>
            {hasBio && (
              <button
                onClick={() => setEditing(false)}
                disabled={busy}
                className="text-xs text-ink-muted hover:text-ink-950"
              >
                Cancel
              </button>
            )}
            {msg && <p className="text-[11px] text-olive-500 ml-auto">{msg}</p>}
          </div>
        </div>
      )}

      {!canEdit && (
        <p className="text-[11px] text-ink-muted italic text-center">
          To edit this profile you need the claim link from your artist signup confirmation.
        </p>
      )}
    </section>
  );
}

function ContributorPath({
  hasBio,
  hasLogo,
  eligible,
}: {
  hasBio: boolean;
  hasLogo: boolean;
  eligible: boolean;
}) {
  const steps = [
    { id: 'bio', label: 'Submit your bio', done: hasBio, reward: 1 },
    { id: 'logo', label: 'Share your brand logo', done: hasLogo, reward: 1 },
  ];
  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div className="bg-paper-200 border border-ink-950/60 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-gold-600 uppercase tracking-wider font-bold">Contributor Path</p>
        <p className="text-[10px] text-ink-muted">
          {completedCount} / {steps.length} steps
          {eligible && <span className="text-olive-500 ml-2">eligible</span>}
        </p>
      </div>
      <p className="text-[11px] text-ink-muted leading-relaxed">
        Each step earns 1 ZAOfestivals Point (paid post-event). Complete all steps to be eligible to work the event as a volunteer on Oct 3.
      </p>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              s.done
                ? 'bg-olive-300 text-olive-500 border border-ink-950/60'
                : 'bg-paper-100 text-ink-muted border border-ink-950/60'
            }`}>
              {s.done ? '\u2713' : i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${s.done ? 'text-ink-muted line-through' : 'text-ink-950'}`}>{s.label}</p>
              <p className="text-[10px] text-ink-muted">+{s.reward} ZAOfestivals Point</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
