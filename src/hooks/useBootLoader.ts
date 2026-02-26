import { useEffect, useRef, useState } from "react";

type BootOptions = {
  minDurationMs?: number; // total minimum display time
  waitForFonts?: boolean;
  tickMs?: number; // progress update interval
};

export default function useBootLoader(options: BootOptions = {}) {
  const { minDurationMs = 1800, waitForFonts = true, tickMs = 30 } = options;

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const startRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    startRef.current = performance.now();

    // Smooth "fake but believable" progress:
    // - quickly ramps early
    // - slows near 90%
    // - jumps to 100% only when boot tasks finished + min time reached
    const interval = window.setInterval(() => {
      setProgress((p) => {
        if (doneRef.current) return p; // completion handled separately

        // ease the progress: fast at first, slower later
        const cap = p < 60 ? 0.9 : p < 85 ? 0.45 : 0.18; // per tick step max
        const step = Math.max(0.08, Math.random() * cap);
        const next = Math.min(92, p + step);
        return next;
      });
    }, tickMs);

    const boot = async () => {
      // 1) wait a frame
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      // 2) fonts
      if (waitForFonts && "fonts" in document) {
        try {
          // @ts-expect-error - TS lib variations
          await (document as any).fonts.ready;
        } catch {
          // ignore
        }
      }

      // 3) enforce minimum duration
      const elapsed = performance.now() - startRef.current;
      const remaining = Math.max(0, minDurationMs - elapsed);
      if (remaining) await new Promise((r) => setTimeout(r, remaining));

      doneRef.current = true;

      // 4) finish progress to 100% smoothly then exit
      const finish = () => {
        setProgress((p) => {
          const next = Math.min(100, p + 2.8);
          if (next >= 100 && mounted) {
            window.clearInterval(interval);
            setTimeout(() => {
              if (mounted) setLoading(false);
            }, 180); // tiny pause at 100%
          }
          return next;
        });
      };

      const finishInterval = window.setInterval(finish, 24);

      // cleanup finish interval when unmounting
      return () => window.clearInterval(finishInterval);
    };

    let finishCleanup: (() => void) | undefined;

    boot().then((cleanup) => {
      finishCleanup = cleanup;
    });

    return () => {
      mounted = false;
      window.clearInterval(interval);
      finishCleanup?.();
    };
  }, [minDurationMs, tickMs, waitForFonts]);

  return { loading, progress };
}
