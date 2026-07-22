"use client";

import { useRef, useCallback } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useViewportStore, useUIStore } from "@/store";
import type { BodyRegion } from "@/types";
import { HIGHLIGHT_COLOR, SELECTED_COLOR } from "@/engine/constants";

// ============================================================
// DEMO MANNEQUIN
// Procedural mannequin built from primitives for development.
// Replace with GLB model in production.
// Each body part is a separate mesh tagged with a body region.
// ============================================================

interface BodyPartProps {
  region: BodyRegion;
  position: [number, number, number];
  args: [number, number, number] | [number, number, number, number];
  geometry: "box" | "cylinder" | "sphere";
  color?: string;
  rotation?: [number, number, number];
}

function BodyPart({ region, position, args, geometry, color = "#d4c5b9", rotation }: BodyPartProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const setHoveredRegion = useViewportStore((s) => s.setHoveredRegion);
  const setSelectedRegion = useViewportStore((s) => s.setSelectedRegion);
  const openCustomizationPanel = useUIStore((s) => s.openCustomizationPanel);
  const focusOnRegion = useViewportStore((s) => s.focusOnRegion);

  const isHovered = hoveredRegion === region;
  const isSelected = selectedRegion === region;

  const materialColor = isSelected
    ? SELECTED_COLOR
    : isHovered
    ? HIGHLIGHT_COLOR
    : color;

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredRegion(region);
      document.body.style.cursor = "pointer";
    },
    [region, setHoveredRegion]
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredRegion(null);
      document.body.style.cursor = "default";
    },
    [setHoveredRegion]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      setSelectedRegion(region);
      focusOnRegion(region);
      openCustomizationPanel();
    },
    [region, setSelectedRegion, focusOnRegion, openCustomizationPanel]
  );

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation ? rotation.map((r) => (r * Math.PI) / 180) as [number, number, number] : undefined}
      castShadow
      receiveShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      userData={{ bodyRegion: region, selectable: true }}
    >
      {geometry === "box" && <boxGeometry args={args as [number, number, number]} />}
      {geometry === "cylinder" && (
        <cylinderGeometry args={args as [number, number, number, number]} />
      )}
      {geometry === "sphere" && (
        <sphereGeometry args={[args[0], 32, 32]} />
      )}
      <meshStandardMaterial
        color={materialColor}
        roughness={0.6}
        metalness={0.05}
        envMapIntensity={0.5}
        emissive={isHovered || isSelected ? materialColor : "#000000"}
        emissiveIntensity={isSelected ? 0.15 : isHovered ? 0.08 : 0}
      />
    </mesh>
  );
}

export function DemoMannequin() {
  return (
    <group position={[0, 0, 0]}>
      {/* Head (not selectable, just for visual reference) */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#e8d5c4" roughness={0.5} />
      </mesh>

      {/* Neck */}
      <BodyPart
        region="neck"
        position={[0, 1.58, 0]}
        args={[0.05, 0.05, 0.08, 16]}
        geometry="cylinder"
        color="#e8d5c4"
      />

      {/* Collar */}
      <BodyPart
        region="collar"
        position={[0, 1.52, 0]}
        args={[0.2, 0.04, 0.08]}
        geometry="box"
        color="#c9a87c"
      />

      {/* Shoulders */}
      <BodyPart
        region="shoulders"
        position={[0, 1.44, 0]}
        args={[0.44, 0.06, 0.16]}
        geometry="box"
        color="#8b5e3c"
      />

      {/* Chest */}
      <BodyPart
        region="chest"
        position={[0, 1.3, 0]}
        args={[0.34, 0.2, 0.18]}
        geometry="box"
        color="#cc4444"
      />

      {/* Sleeves - Left */}
      <BodyPart
        region="sleeves"
        position={[-0.28, 1.3, 0]}
        args={[0.06, 0.06, 0.22, 16]}
        geometry="cylinder"
        color="#993333"
      />

      {/* Sleeves - Right */}
      <BodyPart
        region="sleeves"
        position={[0.28, 1.3, 0]}
        args={[0.06, 0.06, 0.22, 16]}
        geometry="cylinder"
        color="#993333"
      />

      {/* Waist */}
      <BodyPart
        region="waist"
        position={[0, 1.1, 0]}
        args={[0.28, 0.14, 0.16]}
        geometry="box"
        color="#d4af37"
      />

      {/* Skirt */}
      <BodyPart
        region="skirt"
        position={[0, 0.82, 0]}
        args={[0.2, 0.12, 0.4, 16]}
        geometry="cylinder"
        color="#cc4444"
      />

      {/* Legs */}
      <BodyPart
        region="legs"
        position={[0, 0.45, 0]}
        args={[0.14, 0.14, 0.35, 16]}
        geometry="cylinder"
        color="#993333"
      />

      {/* Dupatta (draped fabric indicator) */}
      <BodyPart
        region="dupatta"
        position={[0.2, 1.35, 0.12]}
        args={[0.08, 0.6, 0.02]}
        geometry="box"
        color="#ff9933"
        rotation={[0, 0, -15]}
      />

      {/* Back panel (subtle) */}
      <BodyPart
        region="back"
        position={[0, 1.25, -0.1]}
        args={[0.3, 0.35, 0.02]}
        geometry="box"
        color="#7a3030"
      />

      {/* Front panel */}
      <BodyPart
        region="front"
        position={[0, 1.25, 0.1]}
        args={[0.3, 0.35, 0.02]}
        geometry="box"
        color="#aa3333"
      />

      {/* Ground shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </group>
  );
}
