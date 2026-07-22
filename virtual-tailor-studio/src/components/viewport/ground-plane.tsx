"use client";

import { useViewportStore } from "@/store";
import { Grid } from "@react-three/drei";

/**
 * GroundPlane
 * Optional grid visualization for spatial reference.
 * Only shown when user toggles grid in viewport controls.
 */
export function GroundPlane() {
  const showGrid = useViewportStore((s) => s.showGrid);

  if (!showGrid) return null;

  return (
    <Grid
      position={[0, -0.01, 0]}
      args={[20, 20]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#4a4a6a"
      sectionSize={2}
      sectionThickness={1}
      sectionColor="#6a6a8a"
      fadeDistance={15}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid
    />
  );
}
