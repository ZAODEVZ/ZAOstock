'use client';

import { useRef, useState } from 'react';

type ScheduleResp = 'accepted' | 'change_requested';
type EquipResp = 'accepted' | 'additional_needs';
type Format = '' | 'in_person' | 'virtual' | 'either';
type MerchTable = '' | 'need_table' | 'own_table';

interface UploadedTrack {
  filename: string;
  size: number;
}

const INPUT =
  'w-full bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f5a623]/30';
const LABEL = 'text-xs text-gray-400 uppercase tracking-wider font-bold';

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-white/[0.08] pt-6">
      <h2 className="text-sm font-bold text-white flex items-center gap-2">
        <span className="text-[#f5a623] font-mono text-xs">{String(n).padStart(2, '0')}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function RiderForm() {
  // Artist info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socials, setSocials] = useState('');
  const [streaming, setStreaming] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');

  // Schedule
  const [scheduleResp, setScheduleResp] = useState<ScheduleResp>('accepted');
  const [scheduleNote, setScheduleNote] = useState('');

  // Equipment
  const [equipResp, setEquipResp] = useState<EquipResp>('accepted');
  const [equipNeeds, setEquipNeeds] = useState('');

  // Tracks
  const [trackLinks, setTrackLinks] = useState('');

  // Merch
  const [merchSelling, setMerchSelling] = useState(false);
  const [merchTypes, setMerchTypes] = useState('');
  const [merchTable, setMerchTable] = useState<MerchTable>('');
  const [merchManager, setMerchManager] = useState('');

  // Interview
  const [interview, setInterview] = useState(false);
  const [interviewFormat, setInterviewFormat] = useState<Format>('');
  const [interviewAvail, setInterviewAvail] = useState('');

  // Retreat
  const [retreat, setRetreat] = useState(false);
  const [retreatFormat, setRetreatFormat] = useState<Format>('');
  const [retreatAvail, setRetreatAvail] = useState('');

  // Acknowledgement
  const [acknowledged, setAcknowledged] = useState(false);
  const [signature, setSignature] = useState('');

  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  // Post-submit upload state
  const [slug, setSlug] = useState('');
  const [token, setToken] = useState('');
  const [uploads, setUploads] = useState<UploadedTrack[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus('idle');
    setErrMsg('');
    if (!acknowledged) {
      setStatus('error');
      setErrMsg('Please read and check the acknowledgement to submit.');
      setBusy(false);
      return;
    }
    try {
      const res = await fetch('/api/musicians/rider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact_email: email,
          socials,
          streaming,
          website,
          bio,
          schedule_response: scheduleResp,
          schedule_change_note: scheduleNote,
          equipment_response: equipResp,
          equipment_needs: equipNeeds,
          track_links: trackLinks,
          merch_selling: merchSelling,
          merch_types: merchTypes,
          merch_table: merchTable,
          merch_manager: merchManager,
          interview_interest: interview,
          interview_format: interviewFormat,
          interview_availability: interviewAvail,
          retreat_interest: retreat,
          retreat_format: retreatFormat,
          retreat_availability: retreatAvail,
          acknowledged: true,
          signature,
          hp,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || 'Submission failed');
      setSlug(j.slug || '');
      setToken(j.token || '');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrMsg(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file: File) {
    setUploadErr('');
    setUploading(true);
    try {
      const urlRes = await fetch('/api/musicians/rider/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          token,
          filename: file.name,
          mime_type: file.type || 'application/octet-stream',
          size_bytes: file.size,
        }),
      });
      const urlJson = await urlRes.json();
      if (!urlRes.ok) throw new Error(urlJson.error || 'Could not start upload');

      const putRes = await fetch(urlJson.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      });
      if (!putRes.ok) throw new Error(`Upload failed (${putRes.status})`);

      const commit = await fetch('/api/musicians/rider/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          token,
          filename: file.name,
          storage_path: urlJson.storagePath,
          size_bytes: file.size,
        }),
      });
      const commitJson = await commit.json();
      if (!commit.ok) throw new Error(commitJson.error || 'Could not record upload');

      setUploads((u) => [...u, { filename: file.name, size: file.size }]);
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  if (status === 'sent') {
    return (
      <div className="space-y-5">
        <div className="bg-[#0d1b2a] rounded-xl p-6 border border-[#f5a623]/40 space-y-3">
          <p className="text-lg font-bold text-[#f5a623]">Rider received.</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Thanks. The music team has your responses. If you requested any schedule or equipment
            changes, someone will follow up at the email you gave us.
          </p>
        </div>

        {slug && token ? (
          <div className="bg-[#0d1b2a] rounded-xl p-6 border border-white/[0.08] space-y-4">
            <div>
              <p className="text-sm font-bold text-white">Upload your backing tracks</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Optional but preferred. Add each track in set order, labeled with the artist and song
                name. Up to 500 MB per file. For larger zipped sets, paste a link in the rider above or
                reach out to DCoop.
              </p>
            </div>

            {uploads.length > 0 ? (
              <ul className="space-y-1.5">
                {uploads.map((u, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-xs bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2"
                  >
                    <span className="text-gray-200 truncate">{u.filename}</span>
                    <span className="text-gray-500 ml-3 shrink-0">
                      {(u.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <input
              ref={fileRef}
              type="file"
              accept="audio/*,.zip,.wav,.mp3,.aiff,.m4a"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
              }}
              className="block w-full text-xs text-gray-400 file:mr-3 file:rounded file:border-0 file:bg-[#f5a623] file:px-3 file:py-2 file:text-xs file:font-bold file:text-black hover:file:bg-[#ffd700] disabled:opacity-50"
            />
            {uploading ? <p className="text-xs text-gray-400">Uploading...</p> : null}
            {uploadErr ? <p className="text-xs text-rose-400">{uploadErr}</p> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
      />

      {/* 01 Artist info */}
      <Section n={1} title="Artist information">
        <div className="space-y-1.5">
          <label className={LABEL}>
            Artist / band name <span className="text-[#f5a623]">*</span>
          </label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="What you go by on a stage" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>
            Email <span className="text-[#f5a623]">*</span>
          </label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@somewhere.com" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Social media handles</label>
          <input type="text" value={socials} onChange={(e) => setSocials(e.target.value)} placeholder="Instagram, X, Farcaster, TikTok" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Streaming profiles</label>
          <input type="text" value={streaming} onChange={(e) => setStreaming(e.target.value)} placeholder="Spotify, Apple Music, Audius, SoundCloud" className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Website / other media (labeled)</label>
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="EPK, press kit, YouTube, etc." className={INPUT} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Artist bio</label>
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A few sentences for promo + the lineup announcement." className={`${INPUT} resize-none`} />
        </div>
      </Section>

      {/* 02 Schedule */}
      <Section n={2} title="Performance schedule">
        <p className="text-xs text-gray-500 leading-relaxed">
          Set times are assigned by event management and may shift slightly. All artists are expected
          to arrive by the designated arrival time. Requests for adjustments are considered if
          submitted before the deadline.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['accepted', 'change_requested'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setScheduleResp(v)}
              className={`rounded border px-3 py-2.5 text-sm font-medium transition-colors ${
                scheduleResp === v
                  ? 'border-[#f5a623]/50 bg-[#f5a623]/10 text-[#f5a623]'
                  : 'border-white/[0.08] bg-[#0a1628] text-gray-300 hover:border-white/20'
              }`}
            >
              {v === 'accepted' ? 'ACCEPTED' : 'Request a change'}
            </button>
          ))}
        </div>
        {scheduleResp === 'change_requested' ? (
          <textarea rows={2} value={scheduleNote} onChange={(e) => setScheduleNote(e.target.value)} placeholder="What change are you requesting, and why?" className={`${INPUT} resize-none`} />
        ) : null}
      </Section>

      {/* 03 Equipment */}
      <Section n={3} title="Equipment check">
        <p className="text-xs text-gray-500 leading-relaxed">
          We provide DJ sound management, wireless + headset mics, and stage monitors. Outside of
          essentials, artists provide their own equipment. Flag anything vital or needing conversion
          (vocal modulators, guitars, DI, anything not listed).
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['accepted', 'additional_needs'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setEquipResp(v)}
              className={`rounded border px-3 py-2.5 text-sm font-medium transition-colors ${
                equipResp === v
                  ? 'border-[#f5a623]/50 bg-[#f5a623]/10 text-[#f5a623]'
                  : 'border-white/[0.08] bg-[#0a1628] text-gray-300 hover:border-white/20'
              }`}
            >
              {v === 'accepted' ? 'ACCEPTED' : 'Additional needs'}
            </button>
          ))}
        </div>
        {equipResp === 'additional_needs' ? (
          <textarea rows={2} value={equipNeeds} onChange={(e) => setEquipNeeds(e.target.value)} placeholder="List equipment you need or will bring that needs conversion / support." className={`${INPUT} resize-none`} />
        ) : null}
      </Section>

      {/* 04 Backing tracks */}
      <Section n={4} title="Audio & backing tracks">
        <p className="text-xs text-gray-500 leading-relaxed">
          Paste links to your set tracks (labeled in order with artist + song). You can also upload
          files directly after you submit this rider.
        </p>
        <textarea rows={3} value={trackLinks} onChange={(e) => setTrackLinks(e.target.value)} placeholder="One link per line. Dropbox, Drive, WeTransfer, Audius, etc." className={`${INPUT} resize-none`} />
      </Section>

      {/* 05 Merch */}
      <Section n={5} title="Merchandise">
        <label className="flex items-start gap-2.5 bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 cursor-pointer hover:border-[#f5a623]/30 transition-colors">
          <input type="checkbox" checked={merchSelling} onChange={(e) => setMerchSelling(e.target.checked)} className="mt-1" />
          <span className="text-sm text-gray-200">I plan to sell merchandise</span>
        </label>
        {merchSelling ? (
          <div className="space-y-4 pl-1">
            <div className="space-y-1.5">
              <label className={LABEL}>Merch type(s)</label>
              <input type="text" value={merchTypes} onChange={(e) => setMerchTypes(e.target.value)} placeholder="Apparel, physical music, stickers, posters, other" className={INPUT} />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Table space</label>
              <div className="grid grid-cols-2 gap-2">
                {(['need_table', 'own_table'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setMerchTable(v)}
                    className={`rounded border px-3 py-2.5 text-sm font-medium transition-colors ${
                      merchTable === v
                        ? 'border-[#f5a623]/50 bg-[#f5a623]/10 text-[#f5a623]'
                        : 'border-white/[0.08] bg-[#0a1628] text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {v === 'need_table' ? 'Need table space' : 'Providing my own'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>Who is managing your merch?</label>
              <input type="text" value={merchManager} onChange={(e) => setMerchManager(e.target.value)} placeholder="You, or someone on your team" className={INPUT} />
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Selling merch? Arrive before 2 PM to secure a spot. The host is not responsible for
              lost, stolen, or damaged merchandise.
            </p>
          </div>
        ) : null}
      </Section>

      {/* 06 Interview */}
      <Section n={6} title="Pre-show artist interview">
        <p className="text-xs text-gray-500 leading-relaxed">
          Optional featured interview (facilitated by DCoop) for event promo, artist spotlights, and
          social content.
        </p>
        <label className="flex items-start gap-2.5 bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 cursor-pointer hover:border-[#f5a623]/30 transition-colors">
          <input type="checkbox" checked={interview} onChange={(e) => setInterview(e.target.checked)} className="mt-1" />
          <span className="text-sm text-gray-200">Yes, I&apos;m interested in an interview</span>
        </label>
        {interview ? (
          <div className="space-y-4 pl-1">
            <div className="space-y-1.5">
              <label className={LABEL}>Preferred format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['in_person', 'virtual', 'either'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setInterviewFormat(v)}
                    className={`rounded border px-2 py-2.5 text-xs font-medium transition-colors ${
                      interviewFormat === v
                        ? 'border-[#f5a623]/50 bg-[#f5a623]/10 text-[#f5a623]'
                        : 'border-white/[0.08] bg-[#0a1628] text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {v === 'in_person' ? 'In-person' : v === 'virtual' ? 'Virtual' : 'Either'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>General availability</label>
              <input type="text" value={interviewAvail} onChange={(e) => setInterviewAvail(e.target.value)} placeholder="e.g. Mondays 1-4 PM, Weds 5-10 PM" className={INPUT} />
            </div>
          </div>
        ) : null}
      </Section>

      {/* 07 Retreat */}
      <Section n={7} title="Artist retreat & growth session">
        <p className="text-xs text-gray-500 leading-relaxed">
          Optional collaborative session (facilitated by DCoop) to build relationships, share
          resources, and strengthen the local music community. In-person is preferred.
        </p>
        <label className="flex items-start gap-2.5 bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 cursor-pointer hover:border-[#f5a623]/30 transition-colors">
          <input type="checkbox" checked={retreat} onChange={(e) => setRetreat(e.target.checked)} className="mt-1" />
          <span className="text-sm text-gray-200">Yes, I&apos;m interested in the retreat</span>
        </label>
        {retreat ? (
          <div className="space-y-4 pl-1">
            <div className="space-y-1.5">
              <label className={LABEL}>Preferred format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['in_person', 'virtual', 'either'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRetreatFormat(v)}
                    className={`rounded border px-2 py-2.5 text-xs font-medium transition-colors ${
                      retreatFormat === v
                        ? 'border-[#f5a623]/50 bg-[#f5a623]/10 text-[#f5a623]'
                        : 'border-white/[0.08] bg-[#0a1628] text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {v === 'in_person' ? 'In-person' : v === 'virtual' ? 'Virtual' : 'Either'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={LABEL}>General availability</label>
              <input type="text" value={retreatAvail} onChange={(e) => setRetreatAvail(e.target.value)} placeholder="e.g. Mondays 1-4 PM, Weds 5-10 PM" className={INPUT} />
            </div>
          </div>
        ) : null}
      </Section>

      {/* 08 Acknowledgement */}
      <Section n={8} title="Artist acknowledgement">
        <p className="text-xs text-gray-400 leading-relaxed">
          By checking below and submitting, I acknowledge I have read and understand this rider and
          agree to abide by the event guidelines. I grant approved event staff permission to capture
          and use photography, video, livestream clips, and recap content from the event. I retain
          ownership of my original music and intellectual property. I understand this event is
          designed to foster genuine community and collaboration.
        </p>
        <label className="flex items-start gap-2.5 bg-[#0a1628] border border-white/[0.08] rounded px-3 py-2.5 cursor-pointer hover:border-[#f5a623]/30 transition-colors">
          <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1" />
          <span className="text-sm text-gray-200">I have read and agree to the above.</span>
        </label>
        <div className="space-y-1.5">
          <label className={LABEL}>
            Type your name to sign <span className="text-[#f5a623]">*</span>
          </label>
          <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Your full name" className={INPUT} />
        </div>
      </Section>

      {status === 'error' ? <p className="text-sm text-rose-400">{errMsg || 'Something went wrong. Try again.'}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-[#f5a623] hover:bg-[#ffd700] disabled:bg-[#f5a623]/40 text-black font-bold rounded-lg px-4 py-3 text-sm transition-colors"
      >
        {busy ? 'Submitting...' : 'Submit rider'}
      </button>
    </form>
  );
}
