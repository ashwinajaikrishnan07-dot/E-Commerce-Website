"use client";

import { useRef, useCallback, useMemo } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useViewportStore, useDesignStore, useUIStore } from "@/store";
import type { BodyRegion } from "@/types";
import { HIGHLIGHT_COLOR, SELECTED_COLOR } from "@/engine/constants";

// ============================================================
// REALISTIC DEMO MANNEQUIN
// Human-proportioned mannequin using Lathe/parametric geometry.
// Each body region is anatomically correct and independently
// selectable with proper hover/selection states.
// ============================================================

/** Color palette for the garment (default Indian bridal lehenga) */
const GARMENT_COLORS: Record<BodyRegion, string> = {
  neck: "#e8d5c4",       // skin tone
  collar: "#8B0000",     // deep maroon collar
  chest: "#CC0000",      // rich red blouse
  shoulders: "#8B0000",  // maroon shoulder
  sleeves: "#CC0000",    // matching red sleeves
  waist: "#D4AF37",      // gold waistband
  skirt: "#CC0000",      // red lehenga skirt
  legs: "#CC0000",       // lower skirt
  dupatta: "#FF6B00",    // orange dupatta
  back: "#8B0000",       // back panel
  front: "#CC0000",      // front panel
};

interface RegionMeshProps {
  region: BodyRegion;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

function RegionMesh({ region, children, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }: RegionMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const setHoveredRegion = useViewportStore((s) => s.setHoveredRegion);
  const setSelectedRegion = useViewportStore((s) => s.setSelectedRegion);
  const openCustomizationPanel = useUIStore((s) => s.openCustomizationPanel);
  const focusOnRegion = useViewportStore((s) => s.focusOnRegion);

  const appliedDesigns = useDesignStore((s) => s.appliedDesigns);
  const design = appliedDesigns[region];

  const isHovered = hoveredRegion === region;
  const isSelected = selectedRegion === region;

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

  // Determine color based on state and applied design
  const baseColor = GARMENT_COLORS[region];
  const emissiveColor = isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000";
  const emissiveIntensity = isSelected ? 0.2 : isHovered ? 0.12 : 0;

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      userData={{ bodyRegion: region, selectable: true }}
    >
      {children}
      {/* Outline glow on selection */}
      {isSelected && (
        <group scale={[1.02, 1.02, 1.02]}>
          {children}
        </group>
      )}
    </group>
  );
}

/** Creates a lathe profile for body parts */
function createLathePoints(points: [number, number][], segments = 32): THREE.LatheGeometry {
  const vectors = points.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(vectors, segments);
}

/** Head and neck - skin colored */
function Head() {
  return (
    <group position={[0, 1.62, 0]}>
      {/* Skull */}
      <mesh castShadow position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.09, 32, 24]} />
        <meshStandardMaterial color="#e8d5c4" roughness={0.7} metalness={0} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 0.13, -0.01]}>
        <sphereGeometry args={[0.092, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Neck region */
function NeckRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "neck";
  const isSelected = selectedRegion === "neck";

  return (
    <RegionMesh region="neck" position={[0, 1.53, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.08, 24]} />
        <meshStandardMaterial
          color="#e8d5c4"
          roughness={0.7}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Necklace/jewelry hint */}
      <mesh position={[0, -0.02, 0.04]} castShadow>
        <torusGeometry args={[0.045, 0.004, 8, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
    </RegionMesh>
  );
}

/** Collar/Neckline region */
function CollarRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "collar";
  const isSelected = selectedRegion === "collar";

  return (
    <RegionMesh region="collar" position={[0, 1.47, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.04, 32]} />
        <meshStandardMaterial
          color="#8B0000"
          roughness={0.4}
          metalness={0.05}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Collar embroidery detail */}
      <mesh position={[0, 0, 0.07]} castShadow>
        <planeGeometry args={[0.12, 0.03]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.6}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </RegionMesh>
  );
}

/** Shoulders */
function ShouldersRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "shoulders";
  const isSelected = selectedRegion === "shoulders";

  const mat = (
    <meshStandardMaterial
      color="#8B0000"
      roughness={0.45}
      metalness={0.05}
      emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
      emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
    />
  );

  return (
    <RegionMesh region="shoulders" position={[0, 1.42, 0]}>
      {/* Left shoulder */}
      <mesh castShadow position={[-0.13, 0, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.05, 16, 12]} />
        {mat}
      </mesh>
      {/* Right shoulder */}
      <mesh castShadow position={[0.13, 0, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.05, 16, 12]} />
        {mat}
      </mesh>
      {/* Shoulder bridge */}
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.04, 0.1]} />
        {mat}
      </mesh>
    </RegionMesh>
  );
}

/** Chest/Blouse region */
function ChestRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "chest";
  const isSelected = selectedRegion === "chest";

  return (
    <RegionMesh region="chest" position={[0, 1.32, 0]}>
      {/* Main torso */}
      <mesh castShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.16, 32]} />
        <meshStandardMaterial
          color="#CC0000"
          roughness={0.35}
          metalness={0.05}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Blouse front detail / embroidery panel */}
      <mesh position={[0, 0, 0.09]} castShadow>
        <planeGeometry args={[0.14, 0.12]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.5}
          roughness={0.35}
          side={THREE.DoubleSide}
          opacity={0.7}
          transparent
        />
      </mesh>
    </RegionMesh>
  );
}

/** Sleeves */
function SleevesRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "sleeves";
  const isSelected = selectedRegion === "sleeves";

  const mat = (
    <meshStandardMaterial
      color="#CC0000"
      roughness={0.4}
      metalness={0.05}
      emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
      emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
    />
  );

  return (
    <RegionMesh region="sleeves" position={[0, 1.34, 0]}>
      {/* Left sleeve - upper arm */}
      <mesh castShadow position={[-0.19, -0.02, 0]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.04, 0.035, 0.18, 16]} />
        {mat}
      </mesh>
      {/* Left sleeve - forearm */}
      <mesh castShadow position={[-0.23, -0.15, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.033, 0.025, 0.14, 16]} />
        {mat}
      </mesh>
      {/* Right sleeve - upper arm */}
      <mesh castShadow position={[0.19, -0.02, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.04, 0.035, 0.18, 16]} />
        {mat}
      </mesh>
      {/* Right sleeve - forearm */}
      <mesh castShadow position={[0.23, -0.15, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.033, 0.025, 0.14, 16]} />
        {mat}
      </mesh>
      {/* Sleeve border detail (gold) */}
      <mesh castShadow position={[-0.24, -0.22, 0]} rotation={[0, 0, 0.1]}>
        <torusGeometry args={[0.026, 0.004, 8, 24]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh castShadow position={[0.24, -0.22, 0]} rotation={[0, 0, -0.1]}>
        <torusGeometry args={[0.026, 0.004, 8, 24]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
      </mesh>
    </RegionMesh>
  );
}

/** Waist/Belt region */
function WaistRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "waist";
  const isSelected = selectedRegion === "waist";

  return (
    <RegionMesh region="waist" position={[0, 1.18, 0]}>
      {/* Waistband */}
      <mesh castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.06, 32]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.25}
          metalness={0.6}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Belt ornament */}
      <mesh position={[0, 0, 0.1]} castShadow>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
    </RegionMesh>
  );
}

/** Skirt (upper lehenga) */
function SkirtRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "skirt";
  const isSelected = selectedRegion === "skirt";

  return (
    <RegionMesh region="skirt" position={[0, 0.92, 0]}>
      {/* Flared skirt - conical shape */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.22, 0.45, 48, 1, true]} />
        <meshStandardMaterial
          color="#CC0000"
          roughness={0.4}
          metalness={0.02}
          side={THREE.DoubleSide}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Skirt bottom border */}
      <mesh castShadow position={[0, -0.22, 0]}>
        <torusGeometry args={[0.22, 0.008, 8, 48]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Embroidery band */}
      <mesh castShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.175, 0.19, 0.04, 48]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.4}
          roughness={0.4}
          opacity={0.6}
          transparent
        />
      </mesh>
    </RegionMesh>
  );
}

/** Legs (lower skirt/lehenga) */
function LegsRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "legs";
  const isSelected = selectedRegion === "legs";

  return (
    <RegionMesh region="legs" position={[0, 0.4, 0]}>
      {/* Lower lehenga */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.6, 48, 1, true]} />
        <meshStandardMaterial
          color="#AA0000"
          roughness={0.45}
          metalness={0.02}
          side={THREE.DoubleSide}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Bottom hem */}
      <mesh castShadow position={[0, -0.3, 0]}>
        <torusGeometry args={[0.25, 0.012, 8, 48]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Feet hint */}
      <mesh position={[0, -0.32, 0.05]}>
        <sphereGeometry args={[0.03, 12, 8]} />
        <meshStandardMaterial color="#e8d5c4" roughness={0.8} />
      </mesh>
    </RegionMesh>
  );
}

/** Dupatta (draped fabric) */
function DupattaRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "dupatta";
  const isSelected = selectedRegion === "dupatta";

  // Create a flowing dupatta shape using a curved plane
  const dupattaShape = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, 1.45, 0.08),
      new THREE.Vector3(-0.15, 1.3, 0.1),
      new THREE.Vector3(-0.1, 1.1, 0.12),
      new THREE.Vector3(0.05, 0.9, 0.14),
      new THREE.Vector3(0.15, 0.7, 0.12),
      new THREE.Vector3(0.2, 0.5, 0.1),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.06, 4, false);
    return tubeGeo;
  }, []);

  return (
    <RegionMesh region="dupatta" position={[0, 0, 0]}>
      {/* Main drape */}
      <mesh castShadow geometry={dupattaShape}>
        <meshStandardMaterial
          color="#FF6B00"
          roughness={0.5}
          metalness={0.02}
          side={THREE.DoubleSide}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
          opacity={0.85}
          transparent
        />
      </mesh>
      {/* Dupatta border */}
      <mesh castShadow position={[0.18, 0.52, 0.1]}>
        <boxGeometry args={[0.12, 0.01, 0.005]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.3} />
      </mesh>
    </RegionMesh>
  );
}

/** Back panel */
function BackRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "back";
  const isSelected = selectedRegion === "back";

  return (
    <RegionMesh region="back" position={[0, 1.32, -0.08]}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.16, 0.02]} />
        <meshStandardMaterial
          color="#6B0000"
          roughness={0.4}
          metalness={0.05}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Back lacing detail */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.02, 0.14]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </RegionMesh>
  );
}

/** Front panel */
function FrontRegion() {
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const isHovered = hoveredRegion === "front";
  const isSelected = selectedRegion === "front";

  return (
    <RegionMesh region="front" position={[0, 1.32, 0.09]}>
      <mesh castShadow>
        <boxGeometry args={[0.18, 0.14, 0.01]} />
        <meshStandardMaterial
          color="#CC0000"
          roughness={0.35}
          metalness={0.05}
          emissive={isSelected ? SELECTED_COLOR : isHovered ? HIGHLIGHT_COLOR : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : isHovered ? 0.12 : 0}
        />
      </mesh>
      {/* Front embroidery pattern */}
      <mesh position={[0, 0, 0.006]}>
        <planeGeometry args={[0.12, 0.1]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.5}
          roughness={0.35}
          side={THREE.DoubleSide}
          opacity={0.5}
          transparent
        />
      </mesh>
    </RegionMesh>
  );
}

/** Main mannequin assembly */
export function DemoMannequin() {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle idle breathing animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.003;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Non-selectable parts */}
      <Head />

      {/* Selectable garment regions */}
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

      {/* Ground shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} receiveShadow>
        <circleGeometry args={[0.6, 48]} />
        <shadowMaterial opacity={0.15} />
      </mesh>
    </group>
  );
}
