import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import type { SectionThemeSignal } from "@/hooks/useSectionThemeSignal";
import type { BackgroundVariant } from "@/components/background/BackgroundProvider";

interface GlobalWebGLBackgroundProps {
  signal?: SectionThemeSignal;
  variant?: BackgroundVariant; // "nebula" | "aurora"
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
      return { primary: 0x8b5cf6, secondary: 0x22d3ee };
    case "sky":
      return { primary: 0x38bdf8, secondary: 0x8b5cf6 };
    case "cyan":
    default:
      return { primary: 0x22d3ee, secondary: 0x38bdf8 };
  }
}

function getOverlayClasses(accent: SectionThemeSignal["accent"]) {
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

type NebulaHandles = {
  particleSystem: THREE.Points;
  particleMaterial: THREE.PointsMaterial;
  linesGroup: THREE.Group;
  lines: THREE.Line[];
  glowA: THREE.Mesh;
  glowB: THREE.Mesh;
};

type TopoHandles = {
  plane: THREE.Mesh;
  planeGeo: THREE.PlaneGeometry;
  planeMat: THREE.MeshBasicMaterial;
  stars: THREE.Points;
  starsMat: THREE.PointsMaterial;
  rings: THREE.Line[];
};

function GlobalWebGLBackground({
  signal = { accent: "cyan", intensity: 0.75, speed: 0.9 },
  variant = "nebula",
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

    // WebGL support check
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

    const clock = new THREE.Clock();

    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.x = e.clientX / window.innerWidth - 0.5;
      mouseTarget.y = e.clientY / window.innerHeight - 0.5;
    };

    let nebula: NebulaHandles | null = null;
    let topo: TopoHandles | null = null;

    const setupNebula = (s: THREE.Scene) => {
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

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xcffafe,
        size: preferredReducedMotion ? 0.04 : 0.05,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particleSystem = new THREE.Points(
        particleGeometry,
        particleMaterial,
      );
      s.add(particleSystem);

      const linesGroup = new THREE.Group();
      s.add(linesGroup);

      const lines: THREE.Line[] = [];
      const lineCount = preferredReducedMotion ? 2 : 4;

      for (let li = 0; li < lineCount; li++) {
        const pts: THREE.Vector3[] = [];
        const segments = 120;
        const radiusBase = 3.6 + li * 1.15;

        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          pts.push(
            new THREE.Vector3(
              Math.cos(t + li * 0.35) * radiusBase,
              Math.sin(t * (1.35 + li * 0.12)) * (0.7 + li * 0.16),
              Math.sin(t + li * 0.8) * (0.7 + li * 0.22),
            ),
          );
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
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

      const glowA = new THREE.Mesh(
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
      s.add(glowA);

      const glowB = new THREE.Mesh(
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
      s.add(glowB);

      return {
        particleSystem,
        particleMaterial,
        linesGroup,
        lines,
        glowA,
        glowB,
      };
    };

    const setupTopo = (s: THREE.Scene) => {
      // Star field (different feel)
      const count = preferredReducedMotion ? 240 : 520;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] = (Math.random() - 0.5) * 40;
        pos[i3 + 1] = (Math.random() - 0.5) * 22;
        pos[i3 + 2] = -8 - Math.random() * 22;
      }
      const starsGeo = new THREE.BufferGeometry();
      starsGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const starsMat = new THREE.PointsMaterial({
        color: 0xe2e8f0,
        size: preferredReducedMotion ? 0.02 : 0.03,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const stars = new THREE.Points(starsGeo, starsMat);
      s.add(stars);

      // Topographic wire plane (VERY different pattern)
      const planeGeo = new THREE.PlaneGeometry(42, 24, 120, 70);
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = -Math.PI / 2.35;
      plane.position.set(0, -5.2, -10.5);
      s.add(plane);

      // A few big “contour rings”
      const rings: THREE.Line[] = [];
      for (let i = 0; i < 3; i++) {
        const r = 3.4 + i * 1.25;
        const pts: THREE.Vector3[] = [];
        const seg = 200;
        for (let j = 0; j < seg; j++) {
          const t = (j / seg) * Math.PI * 2;
          pts.push(
            new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r * 0.55, -9.0),
          );
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: i % 2 === 0 ? 0x22d3ee : 0x8b5cf6,
          transparent: true,
          opacity: 0.1 + i * 0.03,
        });
        const line = new THREE.LineLoop(geo, mat);
        line.rotation.z = i * 0.55;
        line.position.y = -1.0 + i * 0.25;
        s.add(line);
        rings.push(line);
      }

      return { plane, planeGeo, planeMat, stars, starsMat, rings };
    };

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

      // Different camera vibe per pattern
      camera.position.set(0, 0, variant === "aurora" ? 10.5 : 12);

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));

      // Build ONE pattern based on variant (aurora = wire grid + stars)
      if (variant === "aurora") topo = setupTopo(scene);
      else nebula = setupNebula(scene);

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

        // section signal smoothing (colors/intensity)
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

        // mouse smoothing
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

        // camera drift
        camera.position.x = lerp(camera.position.x, mouseCurrent.x * 0.7, 0.04);
        camera.position.y = lerp(
          camera.position.y,
          -mouseCurrent.y * 0.45,
          0.04,
        );
        camera.lookAt(0, 0, 0);

        // === Pattern A: Nebula ===
        if (nebula) {
          const {
            particleSystem,
            particleMaterial,
            linesGroup,
            lines,
            glowA,
            glowB,
          } = nebula;

          particleSystem.rotation.y = elapsed * 0.02 * speed;
          particleSystem.rotation.x =
            Math.sin(elapsed * 0.12) * 0.03 * intensity;
          particleSystem.position.x = mouseCurrent.x * 0.25;
          particleSystem.position.y = -mouseCurrent.y * 0.18;

          particleMaterial.opacity = 0.18 + intensity * 0.22;
          particleMaterial.size =
            (preferredReducedMotion ? 0.04 : 0.05) + intensity * 0.018;
          particleMaterial.color.setRGB(
            current.primaryRGB.r * 0.75 + current.secondaryRGB.r * 0.25,
            current.primaryRGB.g * 0.75 + current.secondaryRGB.g * 0.25,
            current.primaryRGB.b * 0.75 + current.secondaryRGB.b * 0.25,
          );

          linesGroup.rotation.y = elapsed * 0.03 * speed;
          linesGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.06 * intensity;
          linesGroup.position.x = mouseCurrent.x * 0.5;
          linesGroup.position.y = -mouseCurrent.y * 0.35;

          lines.forEach((line, idx) => {
            line.rotation.z += 0.0009 * (idx % 2 === 0 ? 1 : -1) * speed;
            line.rotation.x += 0.00035 * (idx % 2 === 0 ? 1 : -1) * speed;

            const mat = line.material as THREE.LineBasicMaterial;
            const rgb =
              idx % 2 === 0 ? current.primaryRGB : current.secondaryRGB;
            mat.color.setRGB(rgb.r, rgb.g, rgb.b);
            mat.opacity = (0.055 + idx * 0.018) * (0.85 + intensity * 0.9);
          });

          {
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

          {
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
        }

        // === Pattern B: Topographic Waves ===
        if (topo) {
          // Stars drift
          topo.stars.rotation.z = elapsed * 0.01 * speed;

          // Color-reactive stars + plane
          topo.starsMat.color.setRGB(
            current.primaryRGB.r * 0.6 + current.secondaryRGB.r * 0.4,
            current.primaryRGB.g * 0.6 + current.secondaryRGB.g * 0.4,
            current.primaryRGB.b * 0.6 + current.secondaryRGB.b * 0.4,
          );
          topo.starsMat.opacity = 0.16 + intensity * 0.22;

          topo.planeMat.color.setRGB(
            current.primaryRGB.r,
            current.primaryRGB.g,
            current.primaryRGB.b,
          );
          topo.planeMat.opacity = 0.1 + intensity * 0.1;

          // Animate plane vertices (wave field)
          const pos = topo.planeGeo.attributes
            .position as THREE.BufferAttribute;
          const time = elapsed * (0.7 + speed * 0.35);
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            // multiple sine layers = "topographic" motion
            const z =
              Math.sin(x * 0.22 + time) * 0.55 +
              Math.cos(y * 0.28 + time * 0.9) * 0.35 +
              Math.sin((x + y) * 0.12 + time * 1.1) * 0.25;

            pos.setZ(i, z * (0.6 + intensity * 0.7));
          }
          pos.needsUpdate = true;
          topo.planeGeo.computeVertexNormals();

          // Parallax plane
          topo.plane.position.x = mouseCurrent.x * 1.2;
          topo.plane.position.y = -5.2 - mouseCurrent.y * 0.8;

          // Rings motion
          topo.rings.forEach((r, idx) => {
            const mat = r.material as THREE.LineBasicMaterial;
            const rgb =
              idx % 2 === 0 ? current.primaryRGB : current.secondaryRGB;
            mat.color.setRGB(rgb.r, rgb.g, rgb.b);
            mat.opacity = 0.07 + intensity * 0.12;

            r.rotation.z += (idx % 2 === 0 ? 1 : -1) * 0.0009 * speed;
            r.position.x = mouseCurrent.x * 1.6;
            r.position.y = -mouseCurrent.y * 0.9 + (-1.0 + idx * 0.25);
          });
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
          if (Array.isArray(anyObj.material))
            anyObj.material.forEach((m) => m.dispose?.());
          else anyObj.material?.dispose?.();
        });
      }

      renderer?.dispose();

      if (renderer?.domElement && mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [preferredReducedMotion, variant]);

  if (!isSupported) return null;

  const overlays = getOverlayClasses(signal.accent);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      <div ref={mountRef} className="absolute inset-0" />
      <div className={overlays.glow} />
      <div className={overlays.fade} />
    </div>
  );
}

export default GlobalWebGLBackground;
