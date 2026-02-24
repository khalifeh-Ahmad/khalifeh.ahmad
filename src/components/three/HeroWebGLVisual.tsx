import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function HeroWebGLVisual() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Mouse interaction refs
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

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
    let coreWire: THREE.Mesh | null = null;

    const clock = new THREE.Clock();

    const onMouseMove = (e: MouseEvent) => {
      const rect = mountEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouse.current = { x, y };
    };

    const onMouseLeave = () => {
      targetMouse.current = { x: 0, y: 0 };
    };

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

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);

      const cyanLight = new THREE.DirectionalLight(0x22d3ee, 1.2);
      cyanLight.position.set(2, 2, 4);
      scene.add(cyanLight);

      const violetLight = new THREE.DirectionalLight(0x8b5cf6, 0.9);
      violetLight.position.set(-2, -1, 3);
      scene.add(violetLight);

      // Core wireframe object
      const coreGeometry = new THREE.IcosahedronGeometry(1.35, 1);
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x93c5fd,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });

      coreWire = new THREE.Mesh(coreGeometry, wireMaterial);
      group.add(coreWire);

      // Orbit line
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

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 1.8 + Math.random() * 1.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
        positions[i3 + 2] = radius * Math.cos(phi);
      }

      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
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

      // Halo 1
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

      // Halo 2
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

      // Resize
      const onResize = () => {
        if (!renderer || !camera) return;

        const width = mountEl.clientWidth;
        const height = mountEl.clientHeight || 1;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(mountEl);

      // Mouse listeners
      mountEl.addEventListener("mousemove", onMouseMove);
      mountEl.addEventListener("mouseleave", onMouseLeave);

      // Animate
      const animate = () => {
        if (!renderer || !scene || !camera || !group) return;

        const elapsed = clock.getElapsedTime();
        const speed = prefersReducedMotion ? 0.15 : 1;

        // Smooth mouse interpolation
        currentMouse.current.x +=
          (targetMouse.current.x - currentMouse.current.x) * 0.06;
        currentMouse.current.y +=
          (targetMouse.current.y - currentMouse.current.y) * 0.06;

        // Base motion
        const baseRotY = elapsed * 0.22 * speed;
        const baseRotX = Math.sin(elapsed * 0.35) * 0.08;

        // Add mouse-reactive motion
        group.rotation.y = baseRotY + currentMouse.current.x * 0.45;
        group.rotation.x = baseRotX + -currentMouse.current.y * 0.25;

        if (line) {
          line.rotation.x =
            elapsed * 0.35 * speed + currentMouse.current.y * 0.15;
          line.rotation.y =
            elapsed * 0.25 * speed + currentMouse.current.x * 0.15;
        }

        if (points) {
          points.rotation.y = -elapsed * 0.12 * speed;
          points.rotation.z = elapsed * 0.06 * speed;

          const scale = 1 + Math.sin(elapsed * 1.2) * 0.015;
          points.scale.setScalar(scale);

          // Pulse opacity for more life
          const pm = points.material as THREE.PointsMaterial;
          pm.opacity = 0.75 + Math.sin(elapsed * 1.8) * 0.12;
        }

        if (haloMesh) {
          haloMesh.rotation.z = 0.35 + elapsed * 0.18 * speed;
        }

        if (coreWire) {
          const s = 1 + Math.sin(elapsed * 1.1) * 0.03;
          coreWire.scale.setScalar(s);
          coreWire.rotation.x = elapsed * 0.08 * speed;
          coreWire.rotation.y = -elapsed * 0.12 * speed;
        }

        // Camera drift + slight mouse influence
        camera.position.x =
          Math.sin(elapsed * 0.3) * 0.18 + currentMouse.current.x * 0.35;
        camera.position.y =
          Math.cos(elapsed * 0.22) * 0.12 + -currentMouse.current.y * 0.2;
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

      mountEl.removeEventListener("mousemove", onMouseMove);
      mountEl.removeEventListener("mouseleave", onMouseLeave);

      if (scene) {
        scene.traverse((obj) => {
          const anyObj = obj as THREE.Object3D & {
            geometry?: THREE.BufferGeometry;
            material?:
              | THREE.Material
              | THREE.Material[]
              | THREE.PointsMaterial
              | undefined;
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_42%),radial-gradient(circle_at_85%_18%,rgba(139,92,246,0.12),transparent_44%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0.00))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"
      />

      <div ref={mountRef} className="absolute inset-0" />

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
