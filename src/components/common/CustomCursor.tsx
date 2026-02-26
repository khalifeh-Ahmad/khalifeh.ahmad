import { useEffect, useRef } from "react";

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const enabledRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isTouchDevice || reduceMotion) return;

    const show = () => {
      if (!enabledRef.current) return;
      if (visibleRef.current) return;
      visibleRef.current = true;
      cursorRef.current?.classList.add("opacity-100");
      followerRef.current?.classList.add("opacity-100");
    };

    const hide = () => {
      if (!enabledRef.current) return;
      if (!visibleRef.current) return;
      visibleRef.current = false;
      cursorRef.current?.classList.remove("opacity-100");
      followerRef.current?.classList.remove("opacity-100");
    };

    const enable = () => {
      if (enabledRef.current) return;
      enabledRef.current = true;

      // Hide native cursor only after we know our custom cursor is active.
      document.documentElement.classList.add("cursor-enabled");

      // Ensure base classes exist
      cursorRef.current?.classList.add("bg-violet-500");
      followerRef.current?.classList.add(
        "w-10",
        "h-10",
        "border-violet-500/50",
      );

      show();
    };

    const onMouseMove = (e: MouseEvent) => {
      enable();
      show();

      mousePos.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }
    };

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      followerPos.current.x = lerp(
        followerPos.current.x,
        mousePos.current.x,
        0.12,
      );
      followerPos.current.y = lerp(
        followerPos.current.y,
        mousePos.current.y,
        0.12,
      );

      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPos.current.x - 20}px, ${followerPos.current.y - 20}px)`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      return Boolean(
        el.closest(
          "a, button, [role='button'], input, textarea, select, summary, .interactive, [data-cursor='interactive']",
        ),
      );
    };

    const onPointerOver = (e: PointerEvent) => {
      if (!enabledRef.current) return;
      if (!isInteractiveTarget(e.target)) return;

      // Dot: cyan + scale 0.5
      cursorRef.current?.classList.add("scale-50", "bg-cyan-400");
      cursorRef.current?.classList.remove("bg-violet-500");

      // Ring: 60x60 + cyan border + cyan bg tint
      followerRef.current?.classList.add(
        "w-[60px]",
        "h-[60px]",
        "border-cyan-400/60",
        "bg-cyan-400/5",
      );
      followerRef.current?.classList.remove(
        "w-10",
        "h-10",
        "border-violet-500/50",
        "bg-transparent",
      );
    };

    const onPointerOut = (e: PointerEvent) => {
      if (!enabledRef.current) return;
      if (!isInteractiveTarget(e.target)) return;

      cursorRef.current?.classList.remove("scale-50", "bg-cyan-400");
      cursorRef.current?.classList.add("bg-violet-500");

      followerRef.current?.classList.remove(
        "w-[60px]",
        "h-[60px]",
        "border-cyan-400/60",
        "bg-cyan-400/5",
      );
      followerRef.current?.classList.add(
        "w-10",
        "h-10",
        "border-violet-500/50",
        "bg-transparent",
      );
    };

    // ✅ Robust visibility control:
    // Hide only when tab/window actually becomes inactive.
    const onBlur = () => hide();
    const onFocus = () => show();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") hide();
      else show();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("cursor-enabled");

      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);

      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={[
          "pointer-events-none fixed left-0 top-0 z-[120] h-3 w-3 rounded-full",
          "bg-violet-500 opacity-0 mix-blend-difference will-change-transform",
          "transition-[opacity,transform] duration-300 ease-out",
        ].join(" ")}
      />

      {/* Ring follower */}
      <div
        ref={followerRef}
        aria-hidden="true"
        className={[
          "pointer-events-none fixed left-0 top-0 z-[120] h-10 w-10 rounded-full",
          "border-[1.5px] border-violet-500/50 bg-transparent opacity-0 will-change-transform",
          "transition-[opacity,width,height,border-color,background-color] duration-300 ease-out",
        ].join(" ")}
      />
    </>
  );
}

export default CustomCursor;
