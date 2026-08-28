'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string | null;
  eventName: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const now = new Date().getTime();
  const diff = target.getTime() - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, eventName }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intentional SSR-hydration guard, not a candidate for a lazy
    // initializer: "now" legitimately differs between server and client
    // clocks, so this can't be computed the same way on both without
    // risking a hydration mismatch. mounted must flip only after the
    // client has actually rendered once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!targetDate) return;

    const target = new Date(targetDate);
    setTimeLeft(getTimeLeft(target));

    const interval = setInterval(() => {
      const tl = getTimeLeft(target);
      setTimeLeft(tl);
      if (!tl) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl sm:text-3xl font-bold text-gold-600">
          Date Announcement Coming Soon
        </p>
        <p className="text-ink-muted mt-2 text-sm">{eventName} date will be revealed shortly</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="text-center py-8">
        <p className="text-ink-muted text-sm">Loading countdown...</p>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl sm:text-3xl font-bold text-gold-600">{eventName} is here!</p>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="text-center py-6">
      <div className="flex justify-center gap-3 sm:gap-6">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <span className="text-3xl sm:text-5xl font-bold text-gold-600 tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm text-ink-muted mt-1 uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
