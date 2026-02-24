function Logo() {
  return (
    <a
      href="#hero"
      aria-label="Go to homepage section"
      className="group inline-flex items-center gap-2"
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 text-sm font-semibold text-white backdrop-blur">
        <span className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-violet-400/10 opacity-80" />
        <span className="relative">KhA</span>
      </span>

      <span className="hidden lg:block text-sm font-medium text-gray-200 group-hover:text-white transition">
        khalifeh
        <span className="text-gray-500">.dev</span>
      </span>
    </a>
  );
}

export default Logo;
