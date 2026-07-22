"use client";

import { useRef } from "react";
import * as THREE from "three";
import { LIGHTING_CONFIG, SHADOW_CONFIG } from "@/engine/constants";

/**
 * SceneLighting
 * Premium multi-point lighting setup for the 3D viewport.
 * Includes key light, fill light, rim light, and ambient.
 */
export function SceneLighting() {
  const directionalRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Ambient fill — soft overall illumination */}
      <ambientLight
        intensity={LIGHTING_CONFIG.ambient.intensity}
        color={LIGHTING_CONFIG.ambient.color}
      />

      {/* Key light — main directional with shadows */}
      <directionalLight
        ref={directionalRef}
        intensity={LIGHTING_CONFIG.directional.intensity}
        position={LIGHTING_CONFIG.directional.position}
        color={LIGHTING_CONFIG.directional.color}
        castShadow
        shadow-mapSize-width={SHADOW_CONFIG.mapSize}
        shadow-mapSize-height={SHADOW_CONFIG.mapSize}
        shadow-bias={SHADOW_CONFIG.bias}
        shadow-normalBias={SHADOW_CONFIG.normalBias}
        shadow-radius={SHADOW_CONFIG.radius}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={4}
        shadow-camera-bottom={-1}
      />

      {/* Fill light — soften shadows from opposite side */}
      <directionalLight
        intensity={LIGHTING_CONFIG.fill.intensity}
        position={LIGHTING_CONFIG.fill.position}
        color={LIGHTING_CONFIG.fill.color}
      />

      {/* Rim light — edge separation from background */}
      <directionalLight
        intensity={LIGHTING_CONFIG.rim.intensity}
        position={LIGHTING_CONFIG.rim.position}
        color={LIGHTING_CONFIG.rim.color}
      />

      {/* Ground bounce — subtle upward light for fabric underside */}
      <pointLight
        intensity={0.15}
        position={[0, -0.5, 0]}
        color="#faf5ff"
        distance={4}
        decay={2}
      />
    </>
  );
}
