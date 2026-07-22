"use client";

import { Suspense, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents, Stats } from "@react-three/drei";
import * as THREE from "three";
import { SceneLighting } from "./scene-lighting";
import { SceneEnvironment } from "./scene-environment";
import { DemoMannequin } from "./demo-mannequin";
import { CameraController } from "./camera-controller";
import { PostProcessing } from "./post-processing";
import { GroundPlane } from "./ground-plane";
import { ViewportLoader } from "./viewport-loader";
import { useViewportStore, useUIStore } from "@/store";
import type { BodyRegion } from "@/types";

// ============================================================
// VIEWPORT CANVAS
// Main 3D rendering canvas. Orchestrates all scene components.
// Performance-optimized with adaptive DPR and event handling.
// ============================================================

interface ViewportCanvasProps {
  className?: string;
  showStats?: boolean;
}

export function ViewportCanvas({ className, showStats = false }: ViewportCanvasProps) {
  const qualityLevel = useViewportStore((s) => s.qualityLevel);
  const openCustomizationPanel = useUIStore((s) => s.openCustomizationPanel);
  const focusOnRegion = useViewportStore((s) => s.focusOnRegion);

  // DPR mapping based on quality level
  const dprRange: [number, number] = (() => {
    switch (qualityLevel) {
      case "low": return [0.5, 1];
      case "medium": return [0.75, 1.5];
      case "high": return [1, 2];
      case "ultra": return [1.5, 2.5];
      default: return [1, 2];
    }
  })();

  const handleRegionClick = useCallback(
    (region: BodyRegion) => {
      focusOnRegion(region);
      openCustomizationPanel();
    },
    [focusOnRegion, openCustomizationPanel]
  );

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={dprRange}
        camera={{
          position: [0, 1.2, 3.5],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        {/* Performance optimizations */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Camera controls */}
        <CameraController />

        {/* Environment and lighting */}
        <SceneEnvironment />
        <SceneLighting />

        {/* Main content with loading fallback */}
        <Suspense fallback={<ViewportLoader />}>
          {/* 
            Production: <MannequinModel onRegionClick={handleRegionClick} />
            Development: Using procedural demo mannequin 
          */}
          <DemoMannequin />
        </Suspense>

        {/* Helpers */}
        <GroundPlane />

        {/* Post-processing */}
        <PostProcessing />

        {/* Preload assets */}
        <Preload all />

        {/* Dev stats */}
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
}
