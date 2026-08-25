const FADE_MASK = "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)";

export function HeroBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
    >
      <div className="starfield-layer-1 animate-drift-1 absolute inset-0 opacity-80" />
      <div className="starfield-layer-2 animate-drift-2 absolute inset-0 opacity-60" />
      <div className="hero-glow absolute inset-0" />
    </div>
  );
}
