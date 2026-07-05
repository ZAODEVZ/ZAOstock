export function AnimatedGradient() {
  return (
    <>
      <div
        aria-hidden
        data-zaostock-bg
        className="pointer-events-none fixed inset-0 z-[0] opacity-[0.18] motion-reduce:opacity-[0.05]"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(245,166,35,0.45), transparent 50%), radial-gradient(circle at 80% 30%, rgba(244,63,94,0.35), transparent 55%), radial-gradient(circle at 50% 80%, rgba(34,197,94,0.3), transparent 55%)',
          animation: 'zaostock-bg 22s ease-in-out infinite alternate',
        }}
      />
      <style>{`
        @keyframes zaostock-bg {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(-3%, 2%, 0) scale(1.06); }
          100% { transform: translate3d(2%, -2%, 0) scale(1.03); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-zaostock-bg] { animation: none !important; }
        }
      `}</style>
    </>
  );
}
