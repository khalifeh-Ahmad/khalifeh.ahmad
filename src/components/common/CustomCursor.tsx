import { useEffect, useRef } from "react";

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const enabledRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isTouchDevice || reduceMotion) return;

    const enableCursor = () => {
      if (enabledRef.current) return;
      enabledRef.current = true;

      // Hide native cursor only after we KNOW our cursor is running
      document.documentElement.classList.add("cursor-enabled");

      cursorRef.current?.classList.add("opacity-100");
      followerRef.current?.classList.add("opacity-100");
    };

    const onMouseMove = (e: MouseEvent) => {
      enableCursor();

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

    const hide = () => {
      cursorRef.current?.classList.remove("opacity-100");
      followerRef.current?.classList.remove("opacity-100");
    };

    const show = () => {
      // Only show if cursor enabled
      if (!enabledRef.current) return;
      cursorRef.current?.classList.add("opacity-100");
      followerRef.current?.classList.add("opacity-100");
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

      // dot: cyan + scale 0.5
      cursorRef.current?.classList.add("scale-50", "bg-cyan-400");
      cursorRef.current?.classList.remove("bg-violet-500");

      // follower: 60x60 + cyan border + cyan bg tint
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

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("mouseenter", show);
    window.addEventListener("mouseleave", hide);

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("cursor-enabled");

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("blur", hide);
      window.removeEventListener("mouseenter", show);
      window.removeEventListener("mouseleave", hide);

      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);

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
