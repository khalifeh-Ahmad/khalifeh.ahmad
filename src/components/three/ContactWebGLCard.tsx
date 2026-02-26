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

    let root: THREE.Group | null = null;

    let globe: THREE.Mesh | null = null;
    let globeWire: THREE.LineSegments | null = null;
    let atmosphere: THREE.Mesh | null = null;
    let orbitRing: THREE.LineLoop | null = null;
    let stars: THREE.Points | null = null;

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
        45,
        mountEl.clientWidth / Math.max(mountEl.clientHeight, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 7.2);

      root = new THREE.Group();
      scene.add(root);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));

      const key = new THREE.DirectionalLight(0x22d3ee, 0.95);
      key.position.set(2.5, 2.0, 5.0);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0x8b5cf6, 0.55);
      fill.position.set(-2.2, -1.2, 4.0);
      scene.add(fill);

      // ===== Stars (subtle) =====
      {
        const count = prefersReducedMotion ? 140 : 240;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3] = (Math.random() - 0.5) * 18;
          positions[i3 + 1] = (Math.random() - 0.5) * 12;
          positions[i3 + 2] = -3 - Math.random() * 6;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
          color: 0xcffafe,
          size: prefersReducedMotion ? 0.03 : 0.04,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        stars = new THREE.Points(geo, mat);
        root.add(stars);
      }

      // ===== Globe =====
      const globeRadius = 2.15;
      {
        // Base globe material (dark “planet”)
        const sphereGeo = new THREE.SphereGeometry(globeRadius, 48, 48);

        const sphereMat = new THREE.MeshStandardMaterial({
          color: 0x0b1220,
          roughness: 0.92,
          metalness: 0.08,
          transparent: true,
          opacity: 0.95,
        });

        globe = new THREE.Mesh(sphereGeo, sphereMat);
        globe.position.z = -0.35;
        root.add(globe);

        // Wireframe overlay (lat/long vibe)
        const wireGeo = new THREE.WireframeGeometry(sphereGeo);
        const wireMat = new THREE.LineBasicMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: 0.14,
        });

        globeWire = new THREE.LineSegments(wireGeo, wireMat);
        globeWire.position.copy(globe.position);
        root.add(globeWire);

        // Atmosphere glow
        const atmoGeo = new THREE.SphereGeometry(globeRadius * 1.04, 48, 48);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0x22d3ee,
          transparent: true,
          opacity: 0.1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.BackSide,
        });

        atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
        atmosphere.position.copy(globe.position);
        root.add(atmosphere);
      }

      // ===== Orbit Ring (like your old ring, now orbital) =====
      {
        const ringRadius = 2.95;
        const segments = 260;
        const pts: THREE.Vector3[] = [];

        for (let i = 0; i < segments; i++) {
          const t = (i / segments) * Math.PI * 2;
          pts.push(
            new THREE.Vector3(
              Math.cos(t) * ringRadius,
              Math.sin(t) * ringRadius,
              0,
            ),
          );
        }

        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: 0xa855f7,
          transparent: true,
          opacity: 0.85,
        });

        orbitRing = new THREE.LineLoop(geo, mat);
        orbitRing.position.z = 0.15;
        orbitRing.rotation.x = Math.PI / 2.25; // tilt ring like orbit
        orbitRing.rotation.z = -0.25;
        root.add(orbitRing);
      }

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
        if (!renderer || !scene || !camera || !root) return;

        const t = clock.getElapsedTime();
        const speed = prefersReducedMotion ? 0.18 : 1;

        // Smooth mouse follow
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

        // subtle root parallax
        root.position.x = mouseCurrent.x * 0.6;
        root.position.y = -mouseCurrent.y * 0.42;

        // globe rotation
        if (globe) globe.rotation.y = t * 0.22 * speed;
        if (globeWire) globeWire.rotation.y = t * 0.24 * speed;

        // atmosphere “breathing”
        if (atmosphere) {
          const s =
            1 + Math.sin(t * 1.05) * (prefersReducedMotion ? 0.002 : 0.008);
          atmosphere.scale.setScalar(s);
          (atmosphere.material as THREE.MeshBasicMaterial).opacity =
            0.08 + Math.sin(t * 0.9) * 0.02;
        }

        // orbit motion
        if (orbitRing) {
          orbitRing.rotation.z = -0.25 + t * 0.08 * speed;
          const ringScale =
            1 + Math.sin(t * 1.25) * (prefersReducedMotion ? 0.002 : 0.006);
          orbitRing.scale.setScalar(ringScale);
        }

        // stars drift (very subtle)
        if (stars) stars.rotation.z = t * 0.01 * speed;

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
      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.0),rgba(0,0,0,0.60))]"
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
