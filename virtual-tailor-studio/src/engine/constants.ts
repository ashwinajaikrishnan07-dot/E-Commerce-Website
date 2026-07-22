import type { BodyRegion } from "@/types";

// ============================================================
// 3D ENGINE CONSTANTS
// Centralized configuration for the rendering pipeline
// ============================================================

/** Default mannequin model path */
export const DEFAULT_MANNEQUIN_PATH = "/models/mannequin.glb";

/** HDRI environment map path */
export const HDRI_PATH = "/hdri/studio_small_09_1k.hdr";

/** Highlight color when hovering over a selectable region */
export const HIGHLIGHT_COLOR = "#a78bfa"; // violet-400

/** Selected region color */
export const SELECTED_COLOR = "#7c3aed"; // violet-600

/** Region mesh name mapping — maps GLB mesh names to body regions */
export const REGION_MESH_MAP: Record<string, BodyRegion> = {
  mesh_chest: "chest",
  mesh_collar: "collar",
  mesh_neck: "neck",
  mesh_sleeve_left: "sleeves",
  mesh_sleeve_right: "sleeves",
  mesh_shoulder_left: "shoulders",
  mesh_shoulder_right: "shoulders",
  mesh_waist: "waist",
  mesh_skirt: "skirt",
  mesh_leg_left: "legs",
  mesh_leg_right: "legs",
  mesh_dupatta: "dupatta",
  mesh_back: "back",
  mesh_front: "front",
};

/** Human-readable labels for body regions */
export const REGION_LABELS: Record<BodyRegion, string> = {
  chest: "Chest",
  collar: "Collar",
  neck: "Neckline",
  sleeves: "Sleeves",
  shoulders: "Shoulders",
  waist: "Waist",
  skirt: "Skirt",
  legs: "Legs",
  dupatta: "Dupatta",
  back: "Back",
  front: "Front",
};

/** Shadow configuration */
export const SHADOW_CONFIG = {
  mapSize: 2048,
  bias: -0.0001,
  normalBias: 0.02,
  radius: 4,
  blurSamples: 8,
} as const;

/** Light configuration */
export const LIGHTING_CONFIG = {
  ambient: { intensity: 0.4, color: "#ffffff" },
  directional: {
    intensity: 1.2,
    position: [5, 8, 5] as [number, number, number],
    color: "#ffffff",
  },
  fill: {
    intensity: 0.3,
    position: [-3, 2, -3] as [number, number, number],
    color: "#e8e0ff",
  },
  rim: {
    intensity: 0.6,
    position: [0, 3, -5] as [number, number, number],
    color: "#ffeedd",
  },
} as const;

/** Post-processing configuration */
export const POST_PROCESSING_CONFIG = {
  bloom: {
    intensity: 0.1,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.025,
  },
  vignette: {
    offset: 0.3,
    darkness: 0.6,
  },
  toneMappingExposure: 1.1,
} as const;

/** Performance budgets */
export const PERFORMANCE_BUDGET = {
  maxDrawCalls: 100,
  maxTriangles: 500000,
  maxTextureMemoryMB: 256,
  targetFPS: 60,
  lodDistances: [5, 15, 30],
} as const;

/** Draco decoder path for compressed models */
export const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

/** KTX2 transcoder path for compressed textures */
export const KTX2_TRANSCODER_PATH = "https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/";
