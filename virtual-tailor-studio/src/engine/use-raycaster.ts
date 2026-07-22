"use client";

import { useCallback, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useViewportStore } from "@/store";
import type { BodyRegion } from "@/types";

// ============================================================
// RAYCASTER HOOK
// Handles pointer interaction with the 3D mannequin meshes.
// Detects hover and click on selectable body regions.
// ============================================================

interface RaycasterOptions {
  /** Meshes to test against */
  meshes: THREE.Mesh[];
  /** Callback when a region is clicked */
  onRegionClick?: (region: BodyRegion) => void;
  /** Callback when hovering over a region */
  onRegionHover?: (region: BodyRegion | null) => void;
  /** Whether raycasting is enabled */
  enabled?: boolean;
}

export function useRaycaster({
  meshes,
  onRegionClick,
  onRegionHover,
  enabled = true,
}: RaycasterOptions) {
  const { camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  const setHoveredRegion = useViewportStore((s) => s.setHoveredRegion);
  const setSelectedRegion = useViewportStore((s) => s.setSelectedRegion);

  /** Update pointer coordinates from mouse/touch event */
  const updatePointer = useCallback(
    (event: { clientX: number; clientY: number; target: EventTarget | null }) => {
      const canvas = event.target as HTMLCanvasElement;
      if (!canvas?.getBoundingClientRect) return;

      const rect = canvas.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    },
    []
  );

  /** Perform raycast and return the first selectable hit */
  const performRaycast = useCallback((): BodyRegion | null => {
    if (!enabled || meshes.length === 0) return null;

    raycaster.current.setFromCamera(pointer.current, camera);
    const intersects = raycaster.current.intersectObjects(meshes, false);

    for (const intersect of intersects) {
      const mesh = intersect.object as THREE.Mesh;
      if (mesh.userData.selectable && mesh.userData.bodyRegion) {
        return mesh.userData.bodyRegion as BodyRegion;
      }
    }

    return null;
  }, [enabled, meshes, camera]);

  /** Handle pointer move — hover detection */
  const handlePointerMove = useCallback(
    (event: { clientX: number; clientY: number; target: EventTarget | null }) => {
      if (!enabled) return;
      updatePointer(event);
      const region = performRaycast();
      setHoveredRegion(region);
      onRegionHover?.(region);
    },
    [enabled, updatePointer, performRaycast, setHoveredRegion, onRegionHover]
  );

  /** Handle pointer click — selection */
  const handlePointerClick = useCallback(
    (event: { clientX: number; clientY: number; target: EventTarget | null }) => {
      if (!enabled) return;
      updatePointer(event);
      const region = performRaycast();

      if (region) {
        setSelectedRegion(region);
        onRegionClick?.(region);
      }
    },
    [enabled, updatePointer, performRaycast, setSelectedRegion, onRegionClick]
  );

  return {
    handlePointerMove,
    handlePointerClick,
    performRaycast,
    updatePointer,
  };
}
