function Logo() {
  return (
    <a
      href="#hero"
      className="group inline-flex items-center gap-3"
      aria-label="Go to homepage section"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur">
        KA
      </span>

      <span className="hidden sm:block">
        <span className="block text-sm font-semibold leading-none text-white">
          Khalifeh Ahmad
        </span>
        <span className="mt-1 block text-xs leading-none text-gray-400 group-hover:text-gray-300">
          Front-End Developer
        </span>
      </span>
    </a>
  );
}

export default Logo;
