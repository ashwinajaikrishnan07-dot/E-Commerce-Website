"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { REGION_MESH_MAP } from "./constants";
import type { BodyRegion } from "@/types";

// ============================================================
// MANNEQUIN LOADER HOOK
// Handles GLB loading, mesh tagging, and region identification
// ============================================================

interface MannequinData {
  scene: THREE.Group;
  regionMeshes: Map<BodyRegion, THREE.Mesh[]>;
  allMeshes: THREE.Mesh[];
  isLoaded: boolean;
}

/**
 * Custom hook to load and prepare the mannequin GLB model.
 * Tags meshes with body region metadata for raycasting.
 * Optimizes materials for PBR rendering.
 */
export function useMannequinLoader(modelPath: string): MannequinData {
  const { scene } = useGLTF(modelPath);

  const { regionMeshes, allMeshes } = useMemo(() => {
    const regions = new Map<BodyRegion, THREE.Mesh[]>();
    const meshes: THREE.Mesh[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child);

        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;

        // Tag mesh with body region
        const meshName = child.name.toLowerCase();
        const region = REGION_MESH_MAP[meshName];

        if (region) {
          child.userData.bodyRegion = region;
          child.userData.selectable = true;
          child.userData.highlightable = true;

          // Store original material for highlight/unhighlight
          child.userData.originalMaterial = (child.material as THREE.Material).clone();

          // Add to region map
          if (!regions.has(region)) {
            regions.set(region, []);
          }
          regions.get(region)!.push(child);
        }

        // Optimize material
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 0.8;
          child.material.needsUpdate = true;
        }
      }
    });

    return { regionMeshes: regions, allMeshes: meshes };
  }, [scene]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      allMeshes.forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      });
    };
  }, [allMeshes]);

  return {
    scene,
    regionMeshes,
    allMeshes,
    isLoaded: allMeshes.length > 0,
  };
}

// Preload the mannequin model
useGLTF.preload("/models/mannequin.glb");
