import { useRef } from "react";
import * as THREE from "three";
import { useThreeRenderer } from "@/hooks/useThreeRenderer";
import { useThemeMode } from "@/components/theme/ThemeProvider";
import { cn } from "@/utils/cn";

function ContactWebGLCard() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const { resolvedTheme } = useThemeMode();
  const isLight = resolvedTheme === "light";

  const { supported } = useThreeRenderer(mountRef, {
    onSetup: ({ scene, camera, renderer, mountEl, prefersReducedMotion }) => {
      let root: THREE.Group | null = null;

      let earth: THREE.Mesh | null = null;
      let clouds: THREE.Mesh | null = null;
      let atmosphere: THREE.Mesh | null = null;
      let orbitRing: THREE.LineLoop | null = null;
      let stars: THREE.Points | null = null;

      camera.position.set(0, 0, 6.6);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      root = new THREE.Group();
      scene.add(root);

      // Lighting
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

      // Orbit ring
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

      // Textures and globe
      const manager = new THREE.LoadingManager();
      const loader = new THREE.TextureLoader(manager);

      const tex = {
        day: loader.load("/textures/earth/earth_day.jpg"),
        bump: loader.load("/textures/earth/earth_bump.jpg"),
        spec: loader.load("/textures/earth/earth_spec.jpg"),
        clouds: loader.load("/textures/earth/earth_clouds.png"),
      };

      tex.day.colorSpace = THREE.SRGBColorSpace;
      tex.clouds.colorSpace = THREE.SRGBColorSpace;
      Object.values(tex).forEach((t) => (t.anisotropy = 8));

      manager.onLoad = () => {
        if (!root) return;

        const radius = 2.18;
        const earthGeo = new THREE.SphereGeometry(radius, 96, 96);

        const earthMat = new THREE.MeshStandardMaterial({
          map: tex.day,
          normalMap: tex.bump,
          normalScale: new THREE.Vector2(0.6, 0.6),
          roughness: 0.86,
          metalness: 0.06,
          roughnessMap: tex.spec,
        });

        earth = new THREE.Mesh(earthGeo, earthMat);
        earth.position.z = -0.15;
        earth.rotation.y = Math.PI * 0.35;
        root.add(earth);

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

      const onMouseMove = (e: MouseEvent) => {
        const rect = mountEl.getBoundingClientRect();
        mouseTarget.current.x = (e.clientX - rect.left) / rect.width - 0.5;
        mouseTarget.current.y = (e.clientY - rect.top) / rect.height - 0.5;
      };

      mountEl.addEventListener("mousemove", onMouseMove);

      return {
        onAnimate: (t: number) => {
          if (!root) return;

          const speed = prefersReducedMotion ? 0.15 : 1;

          mouseCurrent.current.x +=
            (mouseTarget.current.x - mouseCurrent.current.x) * 0.06;
          mouseCurrent.current.y +=
            (mouseTarget.current.y - mouseCurrent.current.y) * 0.06;

          root.position.x = mouseCurrent.current.x * 0.55;
          root.position.y = -mouseCurrent.current.y * 0.4;

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
        },
        onBeforeDispose: () => {
          mountEl.removeEventListener("mousemove", onMouseMove);
        },
      };
    },
  });

  return (
    <div
      className={cn(
        "relative h-[340px] overflow-hidden rounded-2xl border md:h-[380px]",
        isLight
          ? "border-slate-200/70 bg-slate-50/90"
          : "border-white/10 bg-[#0b1220]/55",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: isLight
            ? "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)"
            : "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          isLight
            ? "bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.0),rgba(0,0,0,0.25))]"
            : "bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.0),rgba(0,0,0,0.62))]",
        )}
      />

      {supported ? (
        <div ref={mountRef} className="absolute inset-0" />
      ) : (
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div>
            <p className={cn("text-xs uppercase tracking-[0.2em]", isLight ? "text-slate-500" : "text-gray-400")}>
              WebGL
            </p>
            <p className={cn("mt-2 text-sm", isLight ? "text-slate-600" : "text-gray-200")}>
              Visual not available in this environment.
            </p>
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent",
          isLight ? "via-violet-400/30" : "via-violet-300/40",
        )}
      />
    </div>
  );
}

export default ContactWebGLCard;
