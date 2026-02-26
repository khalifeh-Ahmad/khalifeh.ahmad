import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function ContactWebGLCard() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [supported, setSupported] = useState(true);

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
      setSupported(false);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let resizeObserver: ResizeObserver | null = null;

    let group: THREE.Group | null = null;
    let ring: THREE.LineLoop | null = null;
    let innerSphere: THREE.Mesh | null = null;
    let particleField: THREE.Points | null = null;

    const clock = new THREE.Clock();
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = mountEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseTarget.x = x;
      mouseTarget.y = y;
    };

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mountEl.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        48,
        mountEl.clientWidth / Math.max(mountEl.clientHeight, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 7.2);

      group = new THREE.Group();
      scene.add(group);

      // Lights (soft)
      scene.add(new THREE.AmbientLight(0xffffff, 0.45));
      const cyan = new THREE.DirectionalLight(0x22d3ee, 0.85);
      cyan.position.set(2, 2, 5);
      scene.add(cyan);

      const violet = new THREE.DirectionalLight(0x8b5cf6, 0.7);
      violet.position.set(-2, -1, 4);
      scene.add(violet);

      // --- Ring (like screenshot) ---
      const ringRadius = 2.75;
      const segments = 220;
      const ringPts: THREE.Vector3[] = [];

      for (let i = 0; i < segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        ringPts.push(
          new THREE.Vector3(
            Math.cos(t) * ringRadius,
            Math.sin(t) * ringRadius,
            0,
          ),
        );
      }

      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xa855f7, // violet-ish ring
        transparent: true,
        opacity: 0.95,
      });

      ring = new THREE.LineLoop(ringGeo, ringMat);
      ring.position.z = 0.2;
      group.add(ring);

      // --- Inner sphere (subtle “planet” feel) ---
      const sphereGeo = new THREE.IcosahedronGeometry(2.15, 2);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0b1220,
        roughness: 0.95,
        metalness: 0.08,
        transparent: true,
        opacity: 0.92,
      });

      innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
      innerSphere.position.z = -0.35;
      group.add(innerSphere);

      // --- Particle field (very subtle) ---
      const particleCount = prefersReducedMotion ? 60 : 110;
      const pos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pos[i3] = (Math.random() - 0.5) * 7.5;
        pos[i3 + 1] = (Math.random() - 0.5) * 5.5;
        pos[i3 + 2] = (Math.random() - 0.5) * 1.8 - 0.6;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xcffafe,
        size: prefersReducedMotion ? 0.045 : 0.055,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      particleField = new THREE.Points(pGeo, pMat);
      particleField.position.z = -0.8;
      group.add(particleField);

      // Resize
      const onResize = () => {
        if (!renderer || !camera) return;
        const w = mountEl.clientWidth;
        const h = mountEl.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(mountEl);

      mountEl.addEventListener("mousemove", onMouseMove);

      const animate = () => {
        if (!renderer || !scene || !camera || !group) return;

        const t = clock.getElapsedTime();
        const speed = prefersReducedMotion ? 0.18 : 1;

        // mouse smoothing
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

        group.rotation.y = t * 0.12 * speed;
        group.rotation.x = Math.sin(t * 0.26) * 0.04;

        group.position.x = mouseCurrent.x * 0.55;
        group.position.y = -mouseCurrent.y * 0.4;

        if (innerSphere) {
          innerSphere.rotation.y = t * 0.08 * speed;
          innerSphere.rotation.x = t * 0.04 * speed;
        }

        if (ring) {
          // tiny “breathing” ring
          const s =
            1 + Math.sin(t * 1.25) * (prefersReducedMotion ? 0.003 : 0.01);
          ring.scale.setScalar(s);
        }

        if (particleField) {
          particleField.rotation.z = t * 0.05 * speed;
        }

        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        frameRef.current = window.requestAnimationFrame(animate);
      };

      animate();
    } catch {
      setSupported(false);
    }

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      resizeObserver?.disconnect();
      mountEl.removeEventListener("mousemove", onMouseMove);

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
  }, []);

  return (
    <div className="relative h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]/55 md:h-[380px]">
      {/* Grid overlay like screenshot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.0),rgba(0,0,0,0.55))]"
      />

      {/* WebGL mount */}
      {supported ? (
        <div ref={mountRef} className="absolute inset-0" />
      ) : (
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
              WebGL
            </p>
            <p className="mt-2 text-sm text-gray-200">
              Visual not available in this environment.
            </p>
          </div>
        </div>
      )}

      {/* Border glow line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent"
      />
    </div>
  );
}

export default ContactWebGLCard;
