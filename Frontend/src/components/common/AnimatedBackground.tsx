export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000,transparent)]" />

      {/* Animated lines */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-primary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
