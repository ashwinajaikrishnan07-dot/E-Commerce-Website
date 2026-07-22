"use client";

import { Suspense, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import { DemoMannequin } from "./demo-mannequin";
import { CameraController } from "./camera-controller";
import { GroundPlane } from "./ground-plane";
import { ViewportLoader } from "./viewport-loader";
import { useViewportStore, useUIStore } from "@/store";
import type { BodyRegion } from "@/types";

interface ViewportCanvasProps {
  className?: string;
}

export function ViewportCanvas({ className }: ViewportCanvasProps) {
  const qualityLevel = useViewportStore((s) => s.qualityLevel);

  // Suppress Three.js deprecation warnings
  useEffect(() => {
    const origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (msg.includes("THREE.") && msg.includes("deprecated")) return;
      if (msg.includes("cannot be represented")) return;
      origWarn.apply(console, args);
    };
    return () => { console.warn = origWarn; };
  }, []);

  const dprRange: [number, number] =
    qualityLevel === "low" ? [0.5, 1] :
    qualityLevel === "medium" ? [0.75, 1.5] :
    qualityLevel === "ultra" ? [1.5, 2.5] : [1, 2];

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows
        dpr={dprRange}
        camera={{ position: [0, 1.2, 2.8], fov: 40, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ scene, gl }) => {
          scene.background = new THREE.Color("#0d0d14");
          gl.setClearColor("#0d0d14", 1);
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Camera */}
        <CameraController />

        {/* Lighting — premium 3-point setup */}
        <ambientLight intensity={0.35} color="#e8e0ff" />
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-3, 4, -3]} intensity={0.4} color="#e8e0ff" />
        <pointLight position={[0, 3, -4]} intensity={0.5} color="#ffeedd" distance={10} />
        <pointLight position={[0, -0.5, 2]} intensity={0.15} color="#faf5ff" distance={5} />

        {/* Mannequin */}
        <Suspense fallback={<ViewportLoader />}>
          <DemoMannequin />
        </Suspense>

        {/* Grid (toggleable) */}
        <GroundPlane />

        <Preload all />
      </Canvas>
    </div>
  );
}
