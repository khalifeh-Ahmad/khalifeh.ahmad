import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function HeroWebGLVisual() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // Respect reduced motion (we'll still render, but much calmer)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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

    // Objects we animate
    let group: THREE.Group | null = null;
    let line: THREE.Line | null = null;
    let points: THREE.Points | null = null;
    let haloMesh: THREE.Mesh | null = null;

    const clock = new THREE.Clock();

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mountEl.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        48,
        Math.max(mountEl.clientWidth / Math.max(mountEl.clientHeight, 1), 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 6.5);

      // Group root
      group = new THREE.Group();
      scene.add(group);

      // Soft ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);

      // Accent directional lights
      const cyanLight = new THREE.DirectionalLight(0x22d3ee, 1.2);
      cyanLight.position.set(2, 2, 4);
      scene.add(cyanLight);

      const violetLight = new THREE.DirectionalLight(0x8b5cf6, 0.9);
      violetLight.position.set(-2, -1, 3);
      scene.add(violetLight);

      // Core wireframe object (icosahedron)
      const coreGeometry = new THREE.IcosahedronGeometry(1.35, 1);
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x93c5fd,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const coreWire = new THREE.Mesh(coreGeometry, wireMaterial);
      group.add(coreWire);

      // Orbit line (custom curve)
      const curvePoints: THREE.Vector3[] = [];
      const loops = 180;
      for (let i = 0; i <= loops; i++) {
        const t = (i / loops) * Math.PI * 2;
        const x = Math.cos(t) * 2.1;
        const y = Math.sin(t * 2) * 0.6;
        const z = Math.sin(t) * 0.9;
        curvePoints.push(new THREE.Vector3(x, y, z));
      }

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(
        curvePoints,
      );
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.55,
      });
      line = new THREE.Line(lineGeometry, lineMaterial);
      line.rotation.z = 0.4;
      group.add(line);

      // Particle cloud
      const particleCount = 140;
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 1.8 + Math.random() * 1.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
        positions[i3 + 2] = radius * Math.cos(phi);

        sizes[i] = 0.8 + Math.random() * 1.6;
      }

      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      particlesGeometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizes, 1),
      );

      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xcffafe,
        size: 0.04,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      points = new THREE.Points(particlesGeometry, particlesMaterial);
      group.add(points);

      // Halo glow plane (subtle)
      const haloGeometry = new THREE.RingGeometry(1.8, 2.0, 64);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      });
      haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
      haloMesh.rotation.x = Math.PI / 2.2;
      haloMesh.rotation.z = 0.35;
      group.add(haloMesh);

      // Secondary halo
      const haloGeometry2 = new THREE.RingGeometry(2.25, 2.35, 64);
      const haloMaterial2 = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      });
      const haloMesh2 = new THREE.Mesh(haloGeometry2, haloMaterial2);
      haloMesh2.rotation.x = Math.PI / 1.95;
      haloMesh2.rotation.z = -0.2;
      group.add(haloMesh2);

      // Resize handling
      const onResize = () => {
        if (!mountEl || !renderer || !camera) return;
        const width = mountEl.clientWidth;
        const height = mountEl.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(mountEl);

      // Animate
      const animate = () => {
        if (!renderer || !scene || !camera || !group) return;

        const elapsed = clock.getElapsedTime();
        const speed = prefersReducedMotion ? 0.15 : 1;

        group.rotation.y = elapsed * 0.22 * speed;
        group.rotation.x = Math.sin(elapsed * 0.35) * 0.08;

        if (line) {
          line.rotation.x = elapsed * 0.35 * speed;
          line.rotation.y = elapsed * 0.25 * speed;
        }

        if (points) {
          points.rotation.y = -elapsed * 0.12 * speed;
          points.rotation.z = elapsed * 0.06 * speed;

          // tiny breathing effect
          const scale = 1 + Math.sin(elapsed * 1.2) * 0.015;
          points.scale.setScalar(scale);
        }

        if (haloMesh) {
          haloMesh.rotation.z = 0.35 + elapsed * 0.18 * speed;
        }

        // subtle camera drift
        camera.position.x = Math.sin(elapsed * 0.3) * 0.18;
        camera.position.y = Math.cos(elapsed * 0.22) * 0.12;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        frameRef.current = window.requestAnimationFrame(animate);
      };

      animate();
    } catch {
      setIsSupported(false);
    }

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      resizeObserver?.disconnect();

      // Dispose Three resources
      if (scene) {
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if ((mesh as THREE.Points).geometry) {
            (mesh as THREE.Points).geometry.dispose?.();
          }

          const material = (mesh as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose?.());
          } else {
            material?.dispose?.();
          }
        });
      }

      renderer?.dispose();

      if (renderer?.domElement && mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-cyan-400/20 bg-cyan-400/5 p-6 text-center md:min-h-[320px]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            WebGL
          </p>
          <p className="mt-2 text-sm text-gray-200">
            WebGL visual not available in this environment.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            The portfolio still works and degrades gracefully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl md:min-h-[320px]">
      {/* Background overlays for polish */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_42%),radial-gradient(circle_at_85%_18%,rgba(139,92,246,0.12),transparent_44%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0.00))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"
      />

      <div ref={mountRef} className="absolute inset-0" />

      {/* subtle labels */}
      {/* <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200">
          Three.js
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gray-300">
          WebGL
        </span>
      </div> */}
    </div>
  );
}

export default HeroWebGLVisual;
