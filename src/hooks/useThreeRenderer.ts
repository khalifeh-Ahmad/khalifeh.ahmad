import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeRendererContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  mountEl: HTMLDivElement;
  prefersReducedMotion: boolean;
}

interface ThreeRendererHandlers {
  onAnimate: (elapsed: number) => void;
  onBeforeDispose?: () => void;
}

interface UseThreeRendererOptions {
  /**
   * Called once after renderer/scene/camera are created.
   * Return animation and optional cleanup handlers.
   */
  onSetup: (context: ThreeRendererContext) => ThreeRendererHandlers;
}

export function useThreeRenderer(
  mountRef: React.RefObject<HTMLDivElement | null>,
  { onSetup }: UseThreeRendererOptions,
) {
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
    let handlers: ThreeRendererHandlers | null = null;

    const clock = new THREE.Clock();

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });

      const width = mountEl.clientWidth || 1;
      const height = mountEl.clientHeight || 1;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mountEl.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
      camera.position.set(0, 0, 6.5);

      handlers = onSetup({
        renderer,
        scene,
        camera,
        mountEl,
        prefersReducedMotion,
      });

      const onResize = () => {
        if (!renderer || !camera) return;

        const w = mountEl.clientWidth || 1;
        const h = mountEl.clientHeight || 1;

        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(mountEl);

      const animate = () => {
        if (!renderer || !scene || !camera || !handlers) return;

        const elapsed = clock.getElapsedTime();

        handlers.onAnimate(elapsed);

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

      if (handlers?.onBeforeDispose) {
        handlers.onBeforeDispose();
      }

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
  }, [mountRef, onSetup]);

  return { supported };
}

