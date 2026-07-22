import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { BodyRegion, CameraState, InteractionMode } from "@/types";

// ============================================================
// VIEWPORT STORE
// Manages 3D viewport state: camera, selection, interaction mode
// ============================================================

interface ViewportState {
  // Camera
  camera: CameraState;
  isAnimating: boolean;

  // Selection
  hoveredRegion: BodyRegion | null;
  selectedRegion: BodyRegion | null;

  // Interaction
  interactionMode: InteractionMode;
  isFullscreen: boolean;
  showGrid: boolean;
  showWireframe: boolean;

  // Performance
  qualityLevel: "low" | "medium" | "high" | "ultra";
  fps: number;
}

interface ViewportActions {
  // Camera
  setCamera: (camera: Partial<CameraState>) => void;
  resetCamera: () => void;
  focusOnRegion: (region: BodyRegion) => void;
  setIsAnimating: (animating: boolean) => void;

  // Selection
  setHoveredRegion: (region: BodyRegion | null) => void;
  setSelectedRegion: (region: BodyRegion | null) => void;
  clearSelection: () => void;

  // Interaction
  setInteractionMode: (mode: InteractionMode) => void;
  toggleFullscreen: () => void;
  toggleGrid: () => void;
  toggleWireframe: () => void;

  // Performance
  setQualityLevel: (level: ViewportState["qualityLevel"]) => void;
  setFps: (fps: number) => void;
}

const DEFAULT_CAMERA: CameraState = {
  position: [0, 1.2, 3.5],
  target: [0, 1.0, 0],
  zoom: 1,
  fov: 45,
};

/** Camera presets for focusing on specific body regions */
const REGION_CAMERA_PRESETS: Record<BodyRegion, CameraState> = {
  chest: { position: [0, 1.3, 2.0], target: [0, 1.3, 0], zoom: 1.5, fov: 45 },
  collar: { position: [0, 1.5, 1.8], target: [0, 1.5, 0], zoom: 1.8, fov: 45 },
  neck: { position: [0, 1.55, 1.6], target: [0, 1.55, 0], zoom: 2.0, fov: 45 },
  sleeves: { position: [1.2, 1.2, 2.0], target: [0.4, 1.2, 0], zoom: 1.5, fov: 45 },
  shoulders: { position: [0, 1.45, 2.2], target: [0, 1.45, 0], zoom: 1.4, fov: 45 },
  waist: { position: [0, 1.0, 2.0], target: [0, 1.0, 0], zoom: 1.5, fov: 45 },
  skirt: { position: [0, 0.6, 2.5], target: [0, 0.6, 0], zoom: 1.3, fov: 45 },
  legs: { position: [0, 0.4, 2.8], target: [0, 0.4, 0], zoom: 1.2, fov: 45 },
  dupatta: { position: [0.8, 1.3, 2.5], target: [0, 1.2, 0], zoom: 1.2, fov: 45 },
  back: { position: [0, 1.2, -3.0], target: [0, 1.2, 0], zoom: 1.0, fov: 45 },
  front: { position: [0, 1.2, 3.5], target: [0, 1.0, 0], zoom: 1.0, fov: 45 },
};

export const useViewportStore = create<ViewportState & ViewportActions>()(
  subscribeWithSelector((set) => ({
    // Initial state
    camera: DEFAULT_CAMERA,
    isAnimating: false,
    hoveredRegion: null,
    selectedRegion: null,
    interactionMode: "orbit",
    isFullscreen: false,
    showGrid: false,
    showWireframe: false,
    qualityLevel: "high",
    fps: 60,

    // Camera actions
    setCamera: (camera) =>
      set((state) => ({ camera: { ...state.camera, ...camera } })),

    resetCamera: () => set({ camera: DEFAULT_CAMERA, isAnimating: true }),

    focusOnRegion: (region) =>
      set({
        camera: REGION_CAMERA_PRESETS[region],
        isAnimating: true,
      }),

    setIsAnimating: (animating) => set({ isAnimating: animating }),

    // Selection actions
    setHoveredRegion: (region) => set({ hoveredRegion: region }),

    setSelectedRegion: (region) =>
      set({ selectedRegion: region, interactionMode: "select" }),

    clearSelection: () =>
      set({ selectedRegion: null, interactionMode: "orbit" }),

    // Interaction actions
    setInteractionMode: (mode) => set({ interactionMode: mode }),
    toggleFullscreen: () =>
      set((state) => ({ isFullscreen: !state.isFullscreen })),
    toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
    toggleWireframe: () =>
      set((state) => ({ showWireframe: !state.showWireframe })),

    // Performance actions
    setQualityLevel: (level) => set({ qualityLevel: level }),
    setFps: (fps) => set({ fps }),
  }))
);
