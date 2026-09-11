import Link from 'next/link';
import type { ReactNode, ComponentProps } from 'react';

// The zs-* primitives from DESIGN.md, as React, in the front page's look since
// 2026-09-10 (Zaal: "update all other pages too to this style of branding as
// the front"): soft shadows and hairlines instead of ink outlines, the fireside
// button, the pine kicker. Tokens come from globals.css (.site); nothing here
// carries a hex. Motion is limited to small lifts, off under
// prefers-reduced-motion via .poster-motion.

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/* ---------- Eyebrow ---------- */

export function Eyebrow({ children, tone = 'muted', className }: { children: ReactNode; tone?: 'muted' | 'denim'; className?: string }) {
  return (
    <p className={cx('font-sans text-eyebrow font-extrabold uppercase tracking-[0.18em] m-0', tone === 'denim' ? 'text-denim-400' : 'text-ink-muted', className)}>
      {children}
    </p>
  );
}

/* ---------- Button ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_BASE =
  'poster-motion inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-[0.08em] whitespace-nowrap rounded-pill transition-[transform,box-shadow,background-color,color] duration-200 ease-poster focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)] disabled:opacity-50 disabled:cursor-not-allowed';

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  // The fireside gradient is a constant: the same in light and dark mode.
  primary: 'bg-linear-to-b from-fireside to-ember text-onfill shadow-hard hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-y-0 disabled:hover:translate-y-0',
  secondary: 'bg-transparent text-red-700 border-[1.5px] border-red-700 hover:bg-red-700/10',
  ghost: 'bg-transparent text-denim-400 hover:text-denim-500 underline underline-offset-4 normal-case tracking-normal font-semibold',
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: 'text-sm px-[18px] py-[9px]',
  md: 'text-sm px-[26px] py-[13px]',
  lg: 'text-base px-[34px] py-[17px]',
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<'button'>, 'className' | 'children'>;

export function Button({ variant = 'primary', size = 'md', href, external, className, children, ...rest }: ButtonProps) {
  const classes = cx(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className);
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

/* ---------- Badge ---------- */

export function Badge({ tone = 'outline', children, className }: { tone?: 'gold' | 'denim' | 'outline'; children: ReactNode; className?: string }) {
  const tones = {
    gold: 'bg-gold-400 text-ink-950 border-transparent',
    denim: 'bg-denim-400 text-paper-200 border-transparent',
    outline: 'bg-transparent text-ink-950 border-ink-950/40',
  } as const;
  return (
    <span className={cx('inline-flex items-center gap-1.5 font-sans text-eyebrow font-extrabold uppercase tracking-[0.14em] px-3 py-1.5 rounded-[3px] border-[1.5px]', tones[tone], className)}>
      {children}
    </span>
  );
}

/* ---------- Card ---------- */

export function Card({ children, className, interactive, href }: { children: ReactNode; className?: string; interactive?: boolean; href?: string }) {
  const classes = cx(
    'block bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] p-6 shadow-hard overflow-hidden',
    interactive && 'poster-motion transition-[transform,box-shadow] duration-200 ease-poster hover:-translate-y-1 hover:shadow-hard-lg focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-hard),var(--shadow-focus)]',
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}

/* ---------- Stat ---------- */

export function Stat({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <span className="font-display text-h2 leading-none text-red-500 tabular">{value}</span>
      <span className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
    </div>
  );
}

/* ---------- SectionHeader ---------- */

export function SectionHeader({ eyebrow, title, lede, as: Tag = 'h2', className }: { eyebrow?: string; title: string; lede?: ReactNode; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-3 max-w-[760px]', className)}>
      {/* Her kicker: a small pine label above the heading. */}
      {eyebrow ? <p className="self-start m-0 font-sans text-eyebrow font-extrabold uppercase tracking-[0.2em] text-paper-200 bg-denim-400 px-3.5 py-1.5 rounded-[3px]">{eyebrow}</p> : null}
      <Tag className={cx('font-display text-ink-950 m-0', Tag === 'h1' ? 'text-[2.5rem] leading-[0.98] sm:text-[3.75rem]' : 'text-[2rem] leading-[1] sm:text-[2.75rem]')}>
        {title}
      </Tag>
      {lede ? <p className="text-lg text-ink-secondary leading-normal m-0 measure">{lede}</p> : null}
    </div>
  );
}

/* ---------- InfoStrip ---------- */

export function InfoStrip({ items, className }: { items: ReadonlyArray<{ label: string; value: string }>; className?: string }) {
  return (
    <dl className={cx('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard overflow-hidden m-0', className)}>
      {items.map((item) => (
        <div key={item.label} className="px-5 py-4 border-t border-gold-500/40 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 sm:border-l sm:odd:border-l-0 lg:border-t-0 lg:border-l lg:first:border-l-0 lg:odd:border-l">
          <dt className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted mb-1.5">{item.label}</dt>
          <dd className="text-sm font-bold text-ink-950 m-0">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- BorderedList ---------- */

export function BorderedList({ rows, className, mono }: { rows: ReadonlyArray<{ term: ReactNode; detail: ReactNode }>; className?: string; mono?: boolean }) {
  return (
    <dl className={cx('bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] overflow-hidden m-0', className)}>
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-[minmax(140px,auto)_1fr] gap-1 sm:gap-6 px-5 py-3 text-sm border-t border-gold-500/40 first:border-t-0">
          <dt className={cx('text-ink-muted font-bold tracking-[0.04em] m-0', mono && 'font-mono tabular')}>{row.term}</dt>
          <dd className="text-ink-950 font-semibold m-0">{row.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Field / Input ---------- */

const INPUT_CLASSES =
  'font-sans text-base text-ink-950 bg-paper-100 border-[1.5px] border-ink-950/35 rounded-[10px] px-3.5 py-3 placeholder:text-ink-muted focus:outline-none focus:[box-shadow:var(--shadow-focus)] disabled:opacity-50 disabled:cursor-not-allowed w-full';

export function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <label htmlFor={htmlFor} className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-sm text-ink-secondary m-0">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-red-700 font-semibold m-0" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input(props: ComponentProps<'input'>) {
  return <input {...props} className={cx(INPUT_CLASSES, props.className)} />;
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return <textarea {...props} className={cx(INPUT_CLASSES, 'min-h-[120px]', props.className)} />;
}

export function Select(props: ComponentProps<'select'>) {
  return <select {...props} className={cx(INPUT_CLASSES, props.className)} />;
}

/* ---------- Alert (status chips per DESIGN.md: fill plus a word, never colour alone) ---------- */

export function Alert({ tone, title, children }: { tone: 'success' | 'warning' | 'error' | 'info'; title: string; children?: ReactNode }) {
  const tones = {
    success: 'bg-olive-300 text-ink-950',
    warning: 'bg-gold-300 text-ink-950',
    error: 'bg-red-700 text-paper-200',
    info: 'bg-denim-400 text-paper-200',
  } as const;
  return (
    <div role="status" className={cx('rounded-[14px] px-5 py-4 shadow-hard', tones[tone])}>
      <p className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] m-0">{title}</p>
      {children ? <div className="text-sm mt-1.5">{children}</div> : null}
    </div>
  );
}

/* ---------- Section / layout ---------- */

export function Section({ children, className, id, first }: { children: ReactNode; className?: string; id?: string; first?: boolean }) {
  return (
    <section id={id} className={cx('py-12 sm:py-20', !first && 'border-t border-gold-500/30', className)}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function TwoUp({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start', className)}>{children}</div>;
}
