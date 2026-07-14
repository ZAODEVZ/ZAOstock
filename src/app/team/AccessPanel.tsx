'use client';

import { useEffect, useState } from 'react';

interface MemberAccess {
  id: string;
  name: string;
  role: string;
  active: boolean;
  last_login_at: string | null;
  access_requested_at: string | null;
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / (24 * 60 * 60_000));
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

// Self-fetching and self-gating: only renders content once it confirms the
// logged-in member is a lead, via the same /api/team/members endpoint the
// server-side role check on PATCH already enforces. Lives in the "team" tab
// rather than its own tab since it's a rare admin action, not daily-use.
export function AccessPanel({ memberId }: { memberId: string }) {
  const [members, setMembers] = useState<MemberAccess[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/team/members')
      .then((res) => res.json())
      .then((data) => setMembers(data.members ?? []))
      .catch(() => setError('Failed to load access status'));
  }, []);

  if (!members) return null;
  const self = members.find((m) => m.id === memberId);
  if (self?.role !== 'lead') return null;

  const paused = members.filter((m) => m.active === false);
  const requested = paused.filter((m) => m.access_requested_at);

  async function setActive(id: string, active: boolean) {
    setBusyId(id);
    setError('');
    try {
      const res = await fetch('/api/team/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active }),
      });
      if (!res.ok) {
        setError('Update failed');
        return;
      }
      setMembers((prev) =>
        prev
          ? prev.map((m) => (m.id === id ? { ...m, active, access_requested_at: active ? null : m.access_requested_at } : m))
          : prev,
      );
    } catch {
      setError('Network error');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="bg-[#0d1b2a] rounded-xl border border-white/[0.08] p-5 space-y-3">
      <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">
        Access (leads only) - auto-locks after 3 days without a login
      </p>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {paused.length === 0 && <p className="text-sm text-gray-500">Everyone&rsquo;s active.</p>}
      {paused.length > 0 && (
        <div className="space-y-2">
          {paused.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#0a1628] px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-white">{m.name}</p>
                <p className="text-[11px] text-gray-500">
                  Last login {timeAgo(m.last_login_at)}
                  {m.access_requested_at && (
                    <span className="text-amber-400"> - requested access {timeAgo(m.access_requested_at)}</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(m.id, true)}
                disabled={busyId === m.id}
                className="flex-shrink-0 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50"
              >
                Reinstate
              </button>
            </div>
          ))}
        </div>
      )}
      {requested.length > 0 && (
        <p className="text-[11px] text-amber-400">{requested.length} explicitly requested access back.</p>
      )}
    </div>
  );
}
