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

    let earth: THREE.Mesh | null = null;
    let clouds: THREE.Mesh | null = null;
    let atmosphere: THREE.Mesh | null = null;
    let orbitRing: THREE.LineLoop | null = null;
    let stars: THREE.Points | null = null;

    const clock = new THREE.Clock();
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = mountEl.getBoundingClientRect();
      mouseTarget.x = (e.clientX - rect.left) / rect.width - 0.5;
      mouseTarget.y = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const disposeMat = (m: THREE.Material | THREE.Material[] | undefined) => {
      if (!m) return;
      if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
      else m.dispose?.();
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

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      mountEl.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        45,
        mountEl.clientWidth / Math.max(mountEl.clientHeight, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 6.6);

      root = new THREE.Group();
      scene.add(root);

      // Lighting (make sure we never get black)
      scene.add(new THREE.AmbientLight(0xffffff, 0.32));

      const sun = new THREE.DirectionalLight(0xffffff, 1.65);
      sun.position.set(5.2, 2.0, 6.0);
      scene.add(sun);

      const rim = new THREE.DirectionalLight(0x38bdf8, 0.55);
      rim.position.set(-5.0, -1.4, 6.2);
      scene.add(rim);

      // Stars
      {
        const count = prefersReducedMotion ? 160 : 300;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3] = (Math.random() - 0.5) * 18;
          positions[i3 + 1] = (Math.random() - 0.5) * 12;
          positions[i3 + 2] = -3 - Math.random() * 7;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
          color: 0xe2e8f0,
          size: prefersReducedMotion ? 0.03 : 0.04,
          transparent: true,
          opacity: 0.33,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        stars = new THREE.Points(geo, mat);
        root.add(stars);
      }

      // Orbit ring (already visible, keep it)
      {
        const ringRadius = 3.05;
        const segments = 320;
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
          opacity: 0.55,
        });

        orbitRing = new THREE.LineLoop(geo, mat);
        orbitRing.position.z = 0.25;
        orbitRing.rotation.x = Math.PI / 2.08;
        orbitRing.rotation.z = -0.25;
        root.add(orbitRing);
      }

      // === Load textures with LoadingManager, THEN build globe ===
      const manager = new THREE.LoadingManager();
      const loader = new THREE.TextureLoader(manager);

      const tex = {
        day: loader.load("/textures/earth/earth_day.jpg"),
        bump: loader.load("/textures/earth/earth_bump.jpg"),
        spec: loader.load("/textures/earth/earth_spec.jpg"),
        clouds: loader.load("/textures/earth/earth_clouds.png"),
      };

      // Correct colorSpace
      tex.day.colorSpace = THREE.SRGBColorSpace;
      tex.clouds.colorSpace = THREE.SRGBColorSpace;
      // bump/spec stay linear (default)

      Object.values(tex).forEach((t) => (t.anisotropy = 8));

      manager.onLoad = () => {
        if (!root) return;

        // Earth
        const radius = 2.18;
        const earthGeo = new THREE.SphereGeometry(radius, 96, 96);

        const earthMat = new THREE.MeshStandardMaterial({
          map: tex.day,
          normalMap: tex.bump,
          normalScale: new THREE.Vector2(0.6, 0.6),
          roughness: 0.86,
          metalness: 0.06,
          // Use spec as roughness variation (oceans smoother)
          roughnessMap: tex.spec,
        });

        earth = new THREE.Mesh(earthGeo, earthMat);
        earth.position.z = -0.15;
        earth.rotation.y = Math.PI * 0.35;
        root.add(earth);

        // Clouds
        const cloudsGeo = new THREE.SphereGeometry(2.24, 96, 96);
        const cloudsMat = new THREE.MeshLambertMaterial({
          map: tex.clouds,
          transparent: true,
          opacity: 0.52,
          depthWrite: false,
        });

        clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
        clouds.position.z = -0.15;
        clouds.rotation.y = Math.PI * 0.37;
        root.add(clouds);

        // Atmosphere
        const atmoGeo = new THREE.SphereGeometry(2.32, 96, 96);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.09,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.BackSide,
        });

        atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
        atmosphere.position.z = -0.15;
        root.add(atmosphere);
      };

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
        const speed = prefersReducedMotion ? 0.15 : 1;

        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

        root.position.x = mouseCurrent.x * 0.55;
        root.position.y = -mouseCurrent.y * 0.4;

        if (earth) earth.rotation.y = Math.PI * 0.35 + t * 0.14 * speed;
        if (clouds) clouds.rotation.y = Math.PI * 0.37 + t * 0.22 * speed;

        if (atmosphere) {
          const s =
            1 + Math.sin(t * 1.05) * (prefersReducedMotion ? 0.002 : 0.008);
          atmosphere.scale.setScalar(s);
          (atmosphere.material as THREE.MeshBasicMaterial).opacity =
            0.08 + Math.sin(t * 0.9) * 0.02;
        }

        if (orbitRing) orbitRing.rotation.z = -0.25 + t * 0.06 * speed;
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
          disposeMat(anyObj.material);
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.0),rgba(0,0,0,0.62))]"
      />

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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent"
      />
    </div>
  );
}

export default ContactWebGLCard;
