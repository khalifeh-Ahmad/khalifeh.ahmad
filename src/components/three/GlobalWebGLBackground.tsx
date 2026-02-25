import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { SectionThemeSignal } from "@/hooks/useSectionThemeSignal";

interface GlobalWebGLBackgroundProps {
  signal?: SectionThemeSignal;
}

function hexToRgb(hex: number) {
  return {
    r: ((hex >> 16) & 255) / 255,
    g: ((hex >> 8) & 255) / 255,
    b: (hex & 255) / 255,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function damp(current: number, target: number, smoothing: number) {
  return current + (target - current) * smoothing;
}

function getAccentColors(accent: SectionThemeSignal["accent"]) {
  switch (accent) {
    case "violet":
      return {
        primary: 0x8b5cf6,
        secondary: 0x22d3ee,
      };
    case "sky":
      return {
        primary: 0x38bdf8,
        secondary: 0x8b5cf6,
      };
    case "cyan":
    default:
      return {
        primary: 0x22d3ee,
        secondary: 0x38bdf8,
      };
  }
}

function getOverlayClasses(accent: SectionThemeSignal["accent"]) {
  // CSS overlays now react too, so section changes become noticeable
  switch (accent) {
    case "violet":
      return {
        glow: "absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(139,92,246,0.08),transparent_36%),radial-gradient(circle_at_82%_24%,rgba(34,211,238,0.06),transparent_42%)]",
        fade: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070b14]/18",
      };
    case "sky":
      return {
        glow: "absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.08),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.05),transparent_42%)]",
        fade: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070b14]/16",
      };
    case "cyan":
    default:
      return {
        glow: "absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.05),transparent_42%)]",
        fade: "absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070b14]/18",
      };
  }
}

function GlobalWebGLBackground({
  signal = { accent: "cyan", intensity: 0.75, speed: 0.9 },
}: GlobalWebGLBackgroundProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const targetSignalRef = useRef<SectionThemeSignal>(signal);
  const currentVisualRef = useRef({
    intensity: signal.intensity,
    speed: signal.speed,
    primaryRGB: hexToRgb(getAccentColors(signal.accent).primary),
    secondaryRGB: hexToRgb(getAccentColors(signal.accent).secondary),
  });
  
  
  const preferredReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    [],
  );

  useEffect(() => {
    targetSignalRef.current = signal;
  }, [signal]);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      setIsSupported(false);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let resizeObserver: ResizeObserver | null = null;

    let particleSystem: THREE.Points | null = null;
    let particleMaterial: THREE.PointsMaterial | null = null;

    let linesGroup: THREE.Group | null = null;
    const lines: THREE.Line[] = [];

    let glowA: THREE.Mesh | null = null;
    let glowB: THREE.Mesh | null = null;

    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.x = e.clientX / window.innerWidth - 0.5;
      mouseTarget.y = e.clientY / window.innerHeight - 0.5;
    };

    const clock = new THREE.Clock();

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      mountEl.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / Math.max(window.innerHeight, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 12);

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));

      // Particle field
      const particleCount = preferredReducedMotion ? 140 : 260;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 22;
        positions[i3 + 1] = (Math.random() - 0.5) * 16;
        positions[i3 + 2] = (Math.random() - 0.5) * 7;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      particleMaterial = new THREE.PointsMaterial({
        color: 0xcffafe,
        size: preferredReducedMotion ? 0.04 : 0.05,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particleSystem);

      // Energy lines
      linesGroup = new THREE.Group();
      scene.add(linesGroup);

      const lineCount = preferredReducedMotion ? 2 : 4;

      for (let li = 0; li < lineCount; li++) {
        const points: THREE.Vector3[] = [];
        const segments = 120;
        const radiusBase = 3.6 + li * 1.15;

        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          points.push(
            new THREE.Vector3(
              Math.cos(t + li * 0.35) * radiusBase,
              Math.sin(t * (1.35 + li * 0.12)) * (0.7 + li * 0.16),
              Math.sin(t + li * 0.8) * (0.7 + li * 0.22),
            ),
          );
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: li % 2 === 0 ? 0x22d3ee : 0x8b5cf6,
          transparent: true,
          opacity: 0.08 + li * 0.02,
        });

        const line = new THREE.Line(geometry, material);
        line.rotation.z = li * 0.45;
        line.rotation.x = li * 0.12;
        linesGroup.add(line);
        lines.push(line);
      }

      // Glow discs
      glowA = new THREE.Mesh(
        new THREE.CircleGeometry(3.0, 48),
        new THREE.MeshBasicMaterial({
          color: 0x22d3ee,
          transparent: true,
          opacity: 0.06,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      glowA.position.set(-4.5, 2.4, -1);
      scene.add(glowA);

      glowB = new THREE.Mesh(
        new THREE.CircleGeometry(2.6, 48),
        new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.05,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      glowB.position.set(4.8, -2.2, -0.6);
      scene.add(glowB);

      const onResize = () => {
        if (!renderer || !camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(mountEl);
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      const animate = () => {
        if (!renderer || !scene || !camera) return;

        const elapsed = clock.getElapsedTime();
        const target = targetSignalRef.current;
        const targetColors = getAccentColors(target.accent);

        const current = currentVisualRef.current;
        const smoothing = preferredReducedMotion ? 0.03 : 0.06;

        current.intensity = damp(
          current.intensity,
          target.intensity,
          smoothing,
        );
        current.speed = damp(current.speed, target.speed, smoothing);

        const targetPrimaryRGB = hexToRgb(targetColors.primary);
        const targetSecondaryRGB = hexToRgb(targetColors.secondary);

        current.primaryRGB.r = damp(
          current.primaryRGB.r,
          targetPrimaryRGB.r,
          smoothing,
        );
        current.primaryRGB.g = damp(
          current.primaryRGB.g,
          targetPrimaryRGB.g,
          smoothing,
        );
        current.primaryRGB.b = damp(
          current.primaryRGB.b,
          targetPrimaryRGB.b,
          smoothing,
        );

        current.secondaryRGB.r = damp(
          current.secondaryRGB.r,
          targetSecondaryRGB.r,
          smoothing,
        );
        current.secondaryRGB.g = damp(
          current.secondaryRGB.g,
          targetSecondaryRGB.g,
          smoothing,
        );
        current.secondaryRGB.b = damp(
          current.secondaryRGB.b,
          targetSecondaryRGB.b,
          smoothing,
        );

        mouseCurrent.x = damp(
          mouseCurrent.x,
          mouseTarget.x,
          preferredReducedMotion ? 0.03 : 0.06,
        );
        mouseCurrent.y = damp(
          mouseCurrent.y,
          mouseTarget.y,
          preferredReducedMotion ? 0.03 : 0.06,
        );

        const speed = preferredReducedMotion ? 0.2 : current.speed;
        const intensity = preferredReducedMotion
          ? current.intensity * 0.45
          : current.intensity;

        camera.position.x = lerp(camera.position.x, mouseCurrent.x * 0.7, 0.04);
        camera.position.y = lerp(
          camera.position.y,
          -mouseCurrent.y * 0.45,
          0.04,
        );
        camera.lookAt(0, 0, 0);

        if (particleSystem && particleMaterial) {
          particleSystem.rotation.y = elapsed * 0.02 * speed;
          particleSystem.rotation.x =
            Math.sin(elapsed * 0.12) * 0.03 * intensity;
          particleSystem.position.x = mouseCurrent.x * 0.25;
          particleSystem.position.y = -mouseCurrent.y * 0.18;

          // Slightly stronger so changes are visible
          particleMaterial.opacity = 0.18 + intensity * 0.22;
          particleMaterial.size =
            (preferredReducedMotion ? 0.04 : 0.05) + intensity * 0.018;

          particleMaterial.color.setRGB(
            current.primaryRGB.r * 0.75 + current.secondaryRGB.r * 0.25,
            current.primaryRGB.g * 0.75 + current.secondaryRGB.g * 0.25,
            current.primaryRGB.b * 0.75 + current.secondaryRGB.b * 0.25,
          );
        }

        if (linesGroup) {
          linesGroup.rotation.y = elapsed * 0.03 * speed;
          linesGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.06 * intensity;
          linesGroup.position.x = mouseCurrent.x * 0.5;
          linesGroup.position.y = -mouseCurrent.y * 0.35;
        }

        lines.forEach((line, idx) => {
          line.rotation.z += 0.0009 * (idx % 2 === 0 ? 1 : -1) * speed;
          line.rotation.x += 0.00035 * (idx % 2 === 0 ? 1 : -1) * speed;

          const mat = line.material as THREE.LineBasicMaterial;
          const rgb = idx % 2 === 0 ? current.primaryRGB : current.secondaryRGB;

          mat.color.setRGB(rgb.r, rgb.g, rgb.b);
          mat.opacity = (0.055 + idx * 0.018) * (0.85 + intensity * 0.9);
        });

        if (glowA) {
          const mat = glowA.material as THREE.MeshBasicMaterial;
          mat.color.setRGB(
            current.primaryRGB.r,
            current.primaryRGB.g,
            current.primaryRGB.b,
          );
          mat.opacity = 0.035 + intensity * 0.065;
          glowA.scale.setScalar(
            1 + Math.sin(elapsed * 0.6) * 0.03 + intensity * 0.1,
          );
          glowA.position.x = -4.5 + mouseCurrent.x * 0.7;
          glowA.position.y = 2.4 - mouseCurrent.y * 0.4;
        }

        if (glowB) {
          const mat = glowB.material as THREE.MeshBasicMaterial;
          mat.color.setRGB(
            current.secondaryRGB.r,
            current.secondaryRGB.g,
            current.secondaryRGB.b,
          );
          mat.opacity = 0.03 + intensity * 0.055;
          glowB.scale.setScalar(
            1 + Math.cos(elapsed * 0.75) * 0.035 + intensity * 0.08,
          );
          glowB.position.x = 4.8 + mouseCurrent.x * 0.55;
          glowB.position.y = -2.2 - mouseCurrent.y * 0.32;
        }

        renderer.render(scene, camera);
        frameRef.current = window.requestAnimationFrame(animate);
      };

      animate();
    } catch (error) {
      console.error("GlobalWebGLBackground init error:", error);
      setIsSupported(false);
    }

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver?.disconnect();

      if (scene) {
        scene.traverse((obj) => {
          const anyObj = obj as THREE.Object3D & {
            geometry?: THREE.BufferGeometry;
            material?: THREE.Material | THREE.Material[];
          };

          anyObj.geometry?.dispose?.();

          if (Array.isArray(anyObj.material)) {
            anyObj.material.forEach((m) => m.dispose?.());
          } else {
            anyObj.material?.dispose?.();
          }
        });
      }

      renderer?.dispose();

      if (renderer?.domElement && mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [preferredReducedMotion]);

  if (!isSupported) return null;

  const overlays = getOverlayClasses(signal.accent);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* WebGL canvas mount */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Section-reactive CSS overlays */}
      <div className={overlays.glow} />
      <div className={overlays.fade} />
    </div>
  );
}

export default GlobalWebGLBackground;
