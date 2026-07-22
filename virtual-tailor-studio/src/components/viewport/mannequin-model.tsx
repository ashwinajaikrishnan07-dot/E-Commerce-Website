"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useViewportStore, useDesignStore } from "@/store";
import { useMaterialEngine } from "@/engine/use-material-engine";
import { REGION_MESH_MAP, HIGHLIGHT_COLOR, SELECTED_COLOR } from "@/engine/constants";
import type { BodyRegion } from "@/types";

// ============================================================
// MANNEQUIN MODEL
// Core 3D component that renders the mannequin with
// interactive body regions, hover effects, and selection.
// ============================================================

interface MannequinModelProps {
  modelPath?: string;
  onRegionClick?: (region: BodyRegion) => void;
}

export function MannequinModel({
  modelPath = "/models/mannequin.glb",
  onRegionClick,
}: MannequinModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const { applyHighlight, removeHighlight } = useMaterialEngine();

  // Store references
  const hoveredRegion = useViewportStore((s) => s.hoveredRegion);
  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const setHoveredRegion = useViewportStore((s) => s.setHoveredRegion);
  const setSelectedRegion = useViewportStore((s) => s.setSelectedRegion);

  // Track meshes per region
  const regionMeshesRef = useRef<Map<BodyRegion, THREE.Mesh[]>>(new Map());

  // Initialize mesh tagging on mount
  useEffect(() => {
    if (!scene) return;

    const regionMeshes = new Map<BodyRegion, THREE.Mesh[]>();

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Find body region from mesh name
        const meshName = child.name.toLowerCase();
        let assignedRegion: BodyRegion | null = null;

        // Check exact match first
        if (REGION_MESH_MAP[meshName]) {
          assignedRegion = REGION_MESH_MAP[meshName];
        } else {
          // Check partial match
          for (const [key, region] of Object.entries(REGION_MESH_MAP)) {
            if (meshName.includes(key.replace("mesh_", ""))) {
              assignedRegion = region;
              break;
            }
          }
        }

        if (assignedRegion) {
          child.userData.bodyRegion = assignedRegion;
          child.userData.selectable = true;

          // Store original material
          if (child.material) {
            child.userData.originalMaterial = (
              child.material as THREE.Material
            ).clone();
          }

          // Add to region map
          if (!regionMeshes.has(assignedRegion)) {
            regionMeshes.set(assignedRegion, []);
          }
          regionMeshes.get(assignedRegion)!.push(child);
        } else {
          // Non-selectable mesh (base body, etc.)
          child.userData.selectable = false;
        }

        // Optimize material settings
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 0.7;
          child.material.roughness = Math.max(child.material.roughness, 0.3);
        }
      }
    });

    regionMeshesRef.current = regionMeshes;
  }, [scene]);

  // Handle hover highlight
  useEffect(() => {
    const regionMeshes = regionMeshesRef.current;

    // Remove all highlights first
    regionMeshes.forEach((meshes) => {
      removeHighlight(meshes);
    });

    // Apply hover highlight
    if (hoveredRegion && hoveredRegion !== selectedRegion) {
      const meshes = regionMeshes.get(hoveredRegion);
      if (meshes) {
        applyHighlight(meshes, HIGHLIGHT_COLOR, 0.2);
      }
    }

    // Apply selection highlight
    if (selectedRegion) {
      const meshes = regionMeshes.get(selectedRegion);
      if (meshes) {
        applyHighlight(meshes, SELECTED_COLOR, 0.4);
      }
    }
  }, [hoveredRegion, selectedRegion, applyHighlight, removeHighlight]);

  // Pointer event handlers
  const handlePointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const mesh = event.object as THREE.Mesh;
      if (mesh.userData.selectable && mesh.userData.bodyRegion) {
        setHoveredRegion(mesh.userData.bodyRegion as BodyRegion);
        document.body.style.cursor = "pointer";
      }
    },
    [setHoveredRegion]
  );

  const handlePointerOut = useCallback(() => {
    setHoveredRegion(null);
    document.body.style.cursor = "default";
  }, [setHoveredRegion]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      const mesh = event.object as THREE.Mesh;
      if (mesh.userData.selectable && mesh.userData.bodyRegion) {
        const region = mesh.userData.bodyRegion as BodyRegion;
        setSelectedRegion(region);
        onRegionClick?.(region);
      }
    },
    [setSelectedRegion, onRegionClick]
  );

  return (
    <group ref={groupRef} dispose={null}>
      <primitive
        object={scene}
        scale={1}
        position={[0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}
