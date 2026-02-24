import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useThemeMode } from "@/components/theme/ThemeProvider";

function GlobalWebGLBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const { resolvedTheme } = useThemeMode();

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // WebGL support check
    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");
    if (!gl) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let resizeObserver: ResizeObserver | null = null;

    let particles: THREE.Points | null = null;
    let line1: THREE.Line | null = null;
    let line2: THREE.Line | null = null;
    let glow1: THREE.Mesh | null = null;
    let glow2: THREE.Mesh | null = null;

    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseTarget.x = x;
      mouseTarget.y = y;
    };

    const onMouseLeave = () => {
      mouseTarget.x = 0;
      mouseTarget.y = 0;
    };

    const clock = new THREE.Clock();

    // Theme-aware palette
    const palette =
      resolvedTheme === "light"
        ? {
            pointColor: 0x0ea5e9, // sky-ish
            lineColor1: 0x0891b2, // cyan-ish
            lineColor2: 0x7c3aed, // violet
            glow1: 0x06b6d4,
            glow2: 0x8b5cf6,
            pointOpacity: 0.28,
            lineOpacity1: 0.12,
            lineOpacity2: 0.1,
            glowOpacity1: 0.04,
            glowOpacity2: 0.035,
          }
        : {
            pointColor: 0xcffafe,
            lineColor1: 0x22d3ee,
            lineColor2: 0x8b5cf6,
            glow1: 0x22d3ee,
            glow2: 0x8b5cf6,
            pointOpacity: 0.38,
            lineOpacity1: 0.16,
            lineOpacity2: 0.12,
            glowOpacity1: 0.06,
            glowOpacity2: 0.05,
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
        48,
        window.innerWidth / Math.max(window.innerHeight, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 18);

      // Ambient particle field
      const particleCount = prefersReducedMotion ? 90 : 160;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 26; // x
        positions[i3 + 1] = (Math.random() - 0.5) * 20; // y
        positions[i3 + 2] = (Math.random() - 0.5) * 8; // z
      }

      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      const particlesMaterial = new THREE.PointsMaterial({
        color: palette.pointColor,
        size: resolvedTheme === "light" ? 0.06 : 0.05,
        transparent: true,
        opacity: palette.pointOpacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Flowing line helper
      const makeWaveLine = (
        amplitudeY: number,
        amplitudeZ: number,
        color: number,
        opacity: number,
        yOffset: number,
      ) => {
        const points: THREE.Vector3[] = [];
        const segments = 160;

        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * 2 - 1; // -1..1
          const x = t * 15;
          const y = Math.sin(t * Math.PI * 2) * amplitudeY + yOffset;
          const z = Math.cos(t * Math.PI * 1.5) * amplitudeZ;
          points.push(new THREE.Vector3(x, y, z));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
        });

        return new THREE.Line(geometry, material);
      };

      line1 = makeWaveLine(
        1.2,
        1.0,
        palette.lineColor1,
        palette.lineOpacity1,
        2.8,
      );
      line2 = makeWaveLine(
        1.0,
        1.2,
        palette.lineColor2,
        palette.lineOpacity2,
        -3.0,
      );

      line1.rotation.z = 0.12;
      line2.rotation.z = -0.08;

      scene.add(line1);
      scene.add(line2);

      // Big soft glows (3D planes)
      const glowGeo1 = new THREE.CircleGeometry(5.2, 48);
      const glowMat1 = new THREE.MeshBasicMaterial({
        color: palette.glow1,
        transparent: true,
        opacity: palette.glowOpacity1,
        depthWrite: false,
      });
      glow1 = new THREE.Mesh(glowGeo1, glowMat1);
      glow1.position.set(-5.5, 4.2, -3);
      scene.add(glow1);

      const glowGeo2 = new THREE.CircleGeometry(4.4, 48);
      const glowMat2 = new THREE.MeshBasicMaterial({
        color: palette.glow2,
        transparent: true,
        opacity: palette.glowOpacity2,
        depthWrite: false,
      });
      glow2 = new THREE.Mesh(glowGeo2, glowMat2);
      glow2.position.set(6.0, -3.5, -2.2);
      scene.add(glow2);

      // Resize handling
      const onResize = () => {
        if (!renderer || !camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight || 1;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(document.body);

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave);

      // Animation
      const animate = () => {
        if (!renderer || !scene || !camera) return;

        const t = clock.getElapsedTime();
        const speed = prefersReducedMotion ? 0.15 : 1;

        // Mouse smoothing
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.03;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.03;

        // Particles
        if (particles) {
          particles.rotation.y = t * 0.015 * speed;
          particles.rotation.x = Math.sin(t * 0.08) * 0.03 * speed;

          particles.position.x = mouseCurrent.x * 0.9;
          particles.position.y = -mouseCurrent.y * 0.5;

          const pm = particles.material as THREE.PointsMaterial;
          pm.opacity =
            palette.pointOpacity +
            Math.sin(t * 0.9) * (prefersReducedMotion ? 0.01 : 0.03);
        }

        // Flow lines
        if (line1) {
          line1.position.x = mouseCurrent.x * 1.2;
          line1.position.y = 2.8 + Math.sin(t * 0.5) * 0.25 * speed;
          line1.rotation.z = 0.12 + Math.sin(t * 0.25) * 0.03 * speed;
          line1.rotation.y = mouseCurrent.x * 0.08;
        }

        if (line2) {
          line2.position.x = -mouseCurrent.x * 1.0;
          line2.position.y = -3.0 + Math.cos(t * 0.45) * 0.22 * speed;
          line2.rotation.z = -0.08 + Math.cos(t * 0.22) * 0.03 * speed;
          line2.rotation.y = -mouseCurrent.x * 0.06;
        }

        // Glow drift
        if (glow1) {
          glow1.position.x =
            -5.5 + Math.sin(t * 0.22) * 0.5 + mouseCurrent.x * 0.8;
          glow1.position.y =
            4.2 + Math.cos(t * 0.18) * 0.45 - mouseCurrent.y * 0.6;
          glow1.scale.setScalar(1 + Math.sin(t * 0.5) * 0.03);
        }

        if (glow2) {
          glow2.position.x =
            6.0 + Math.cos(t * 0.2) * 0.45 - mouseCurrent.x * 0.6;
          glow2.position.y =
            -3.5 + Math.sin(t * 0.24) * 0.35 + mouseCurrent.y * 0.5;
          glow2.scale.setScalar(1 + Math.cos(t * 0.55) * 0.025);
        }

        // Camera micro drift
        camera.position.x = mouseCurrent.x * 0.18;
        camera.position.y = -mouseCurrent.y * 0.12;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        frameRef.current = window.requestAnimationFrame(animate);
      };

      animate();
    } catch {
      // graceful fail — no background scene
    }

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      resizeObserver?.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);

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
  }, [resolvedTheme]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div ref={mountRef} className="absolute inset-0" />
      {/* extra soft overlay for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.02),transparent_48%)]" />
    </div>
  );
}

export default GlobalWebGLBackground;
