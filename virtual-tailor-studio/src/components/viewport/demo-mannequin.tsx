"use client";

import { useRef, useMemo } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useViewportStore, useDesignStore, useUIStore } from "@/store";
import { useRegionVisuals } from "@/hooks/use-region-visuals";
import type { BodyRegion } from "@/types";
import { HIGHLIGHT_COLOR, SELECTED_COLOR } from "@/engine/constants";

// ============================================================
// DEMO MANNEQUIN — REACTIVE
// Each body region reacts to applied designs in real-time.
// Colors, roughness, metalness, opacity, and emissive glow
// all change when the user applies designs from the panel.
// ============================================================

/** Shared interactive wrapper for all selectable regions */
function InteractiveRegion({ region, children, position, rotation }: {
  region: BodyRegion;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const setHoveredRegion = useViewportStore((s) => s.setHoveredRegion);
  const setSelectedRegion = useViewportStore((s) => s.setSelectedRegion);
  const openCustomizationPanel = useUIStore((s) => s.openCustomizationPanel);
  const focusOnRegion = useViewportStore((s) => s.focusOnRegion);

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredRegion(region);
    document.body.style.cursor = "pointer";
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredRegion(null);
    document.body.style.cursor = "default";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedRegion(region);
    focusOnRegion(region);
    openCustomizationPanel();
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {children}
    </group>
  );
}

/** Material that reacts to applied designs + hover/selection state */
function RegionMaterial({ region }: { region: BodyRegion }) {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const visuals = useRegionVisuals(region);

  const isHovered = hoveredRegion === region;
  const isSelected = selectedRegion === region;

  // Combine design visuals with interaction state
  const finalEmissive = isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : visuals.emissiveColor;
  const finalEmissiveIntensity = isSelected ? 0.25 : isHovered ? 0.15 : visuals.emissiveIntensity;

  return (
    <meshStandardMaterial
      color={visuals.color}
      roughness={visuals.roughness}
      metalness={visuals.metalness}
      opacity={visuals.opacity}
      transparent={visuals.transparent}
      emissive={finalEmissive}
      emissiveIntensity={finalEmissiveIntensity}
      side={THREE.DoubleSide}
    />
  );
}

/** Gold accent material (jewelry, borders) */
function GoldMaterial() {
  return <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />;
}

function NeckRegion() {
  return (
    <InteractiveRegion region="neck" position={[0, 1.53, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.08, 24]} />
        <RegionMaterial region="neck" />
      </mesh>
      <mesh position={[0, -0.02, 0.04]} castShadow>
        <torusGeometry args={[0.045, 0.004, 8, 32]} />
        <GoldMaterial />
      </mesh>
    </InteractiveRegion>
  );
}

function CollarRegion() {
  return (
    <InteractiveRegion region="collar" position={[0, 1.47, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.04, 32]} />
        <RegionMaterial region="collar" />
      </mesh>
      <mesh position={[0, 0, 0.08]} castShadow>
        <planeGeometry args={[0.14, 0.03]} />
        <GoldMaterial />
      </mesh>
    </InteractiveRegion>
  );
}

function ShouldersRegion() {
  return (
    <InteractiveRegion region="shoulders" position={[0, 1.42, 0]}>
      <mesh castShadow position={[-0.13, 0, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.05, 16, 12]} />
        <RegionMaterial region="shoulders" />
      </mesh>
      <mesh castShadow position={[0.13, 0, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.05, 16, 12]} />
        <RegionMaterial region="shoulders" />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.04, 0.1]} />
        <RegionMaterial region="shoulders" />
      </mesh>
    </InteractiveRegion>
  );
}

function ChestRegion() {
  return (
    <InteractiveRegion region="chest" position={[0, 1.32, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.16, 32]} />
        <RegionMaterial region="chest" />
      </mesh>
      <mesh position={[0, 0, 0.09]} castShadow>
        <planeGeometry args={[0.14, 0.12]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.35} side={THREE.DoubleSide} opacity={0.5} transparent />
      </mesh>
    </InteractiveRegion>
  );
}

function SleevesRegion() {
  return (
    <InteractiveRegion region="sleeves" position={[0, 1.34, 0]}>
      {/* Left arm */}
      <mesh castShadow position={[-0.19, -0.02, 0]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.04, 0.035, 0.18, 16]} />
        <RegionMaterial region="sleeves" />
      </mesh>
      <mesh castShadow position={[-0.23, -0.15, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.033, 0.025, 0.14, 16]} />
        <RegionMaterial region="sleeves" />
      </mesh>
      {/* Right arm */}
      <mesh castShadow position={[0.19, -0.02, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.04, 0.035, 0.18, 16]} />
        <RegionMaterial region="sleeves" />
      </mesh>
      <mesh castShadow position={[0.23, -0.15, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.033, 0.025, 0.14, 16]} />
        <RegionMaterial region="sleeves" />
      </mesh>
      {/* Gold cuffs */}
      <mesh castShadow position={[-0.24, -0.22, 0]} rotation={[0, 0, 0.1]}>
        <torusGeometry args={[0.026, 0.005, 8, 24]} />
        <GoldMaterial />
      </mesh>
      <mesh castShadow position={[0.24, -0.22, 0]} rotation={[0, 0, -0.1]}>
        <torusGeometry args={[0.026, 0.005, 8, 24]} />
        <GoldMaterial />
      </mesh>
    </InteractiveRegion>
  );
}

function WaistRegion() {
  return (
    <InteractiveRegion region="waist" position={[0, 1.18, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.06, 32]} />
        <RegionMaterial region="waist" />
      </mesh>
      <mesh position={[0, 0, 0.1]} castShadow>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
    </InteractiveRegion>
  );
}

function SkirtRegion() {
  return (
    <InteractiveRegion region="skirt" position={[0, 0.92, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.22, 0.45, 48, 1, true]} />
        <RegionMaterial region="skirt" />
      </mesh>
      {/* Bottom gold border */}
      <mesh castShadow position={[0, -0.22, 0]}>
        <torusGeometry args={[0.22, 0.008, 8, 48]} />
        <GoldMaterial />
      </mesh>
      {/* Embroidery band */}
      <mesh castShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.17, 0.19, 0.04, 48]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.4} roughness={0.4} opacity={0.4} transparent />
      </mesh>
    </InteractiveRegion>
  );
}

function LegsRegion() {
  return (
    <InteractiveRegion region="legs" position={[0, 0.4, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.6, 48, 1, true]} />
        <RegionMaterial region="legs" />
      </mesh>
      <mesh castShadow position={[0, -0.3, 0]}>
        <torusGeometry args={[0.25, 0.012, 8, 48]} />
        <GoldMaterial />
      </mesh>
    </InteractiveRegion>
  );
}

function DupattaRegion() {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, 1.45, 0.08),
      new THREE.Vector3(-0.15, 1.3, 0.1),
      new THREE.Vector3(-0.08, 1.1, 0.12),
      new THREE.Vector3(0.05, 0.9, 0.14),
      new THREE.Vector3(0.15, 0.7, 0.12),
      new THREE.Vector3(0.2, 0.5, 0.1),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.06, 4, false);
  }, []);

  return (
    <InteractiveRegion region="dupatta">
      <mesh castShadow geometry={geo}>
        <RegionMaterial region="dupatta" />
      </mesh>
      <mesh castShadow position={[0.18, 0.52, 0.1]}>
        <boxGeometry args={[0.12, 0.008, 0.004]} />
        <GoldMaterial />
      </mesh>
    </InteractiveRegion>
  );
}

function BackRegion() {
  return (
    <InteractiveRegion region="back" position={[0, 1.32, -0.08]}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.16, 0.02]} />
        <RegionMaterial region="back" />
      </mesh>
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.02, 0.14]} />
        <GoldMaterial />
      </mesh>
    </InteractiveRegion>
  );
}

function FrontRegion() {
  return (
    <InteractiveRegion region="front" position={[0, 1.32, 0.09]}>
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.14, 0.01]} />
        <RegionMaterial region="front" />
      </mesh>
      <mesh position={[0, 0, 0.006]}>
        <planeGeometry args={[0.12, 0.1]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.35} side={THREE.DoubleSide} opacity={0.4} transparent />
      </mesh>
    </InteractiveRegion>
  );
}

/** Head — non-interactive, just visual reference */
function Head() {
  return (
    <group position={[0, 1.62, 0]}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.09, 32, 24]} />
        <meshStandardMaterial color="#e8d5c4" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.13, -0.01]}>
        <sphereGeometry args={[0.092, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Main exported mannequin component */
export function DemoMannequin() {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle breathing animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <Head />
      <NeckRegion />
      <CollarRegion />
      <ShouldersRegion />
      <ChestRegion />
      <SleevesRegion />
      <WaistRegion />
      <SkirtRegion />
      <LegsRegion />
      <DupattaRegion />
      <BackRegion />
      <FrontRegion />
      {/* Shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} receiveShadow>
        <circleGeometry args={[0.6, 48]} />
        <shadowMaterial opacity={0.15} />
      </mesh>
    </group>
  );
}
