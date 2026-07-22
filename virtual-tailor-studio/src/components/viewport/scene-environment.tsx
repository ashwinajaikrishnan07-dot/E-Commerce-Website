"use client";

import { Environment, ContactShadows } from "@react-three/drei";

/**
 * SceneEnvironment
 * HDRI environment for realistic reflections and ambient occlusion shadows.
 */
export function SceneEnvironment() {
  return (
    <>
      {/* HDRI environment map for PBR reflections */}
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={0.6}
      />

      {/* Contact shadows — soft ground shadow beneath the mannequin */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={8}
        blur={2.5}
        far={4}
        color="#1a1a2e"
      />
    </>
  );
}
