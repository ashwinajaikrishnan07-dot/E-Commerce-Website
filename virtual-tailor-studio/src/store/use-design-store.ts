import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppliedDesign,
  BodyRegion,
  DesignProject,
  GarmentCategory,
  HistoryAction,
} from "@/types";
import { generateId } from "@/lib/utils";

// ============================================================
// DESIGN STORE
// Manages the current design state, undo/redo history,
// and applied customizations per body region.
// ============================================================

/** Default empty design for a body region */
const createEmptyDesign = (region: BodyRegion): AppliedDesign => ({
  regionId: region,
  componentId: null,
  materialOverrides: {},
  textureId: null,
  colorId: null,
  embroideryId: null,
  embroideryColor: null,
});

/** All selectable body regions */
const ALL_REGIONS: BodyRegion[] = [
  "chest",
  "collar",
  "neck",
  "sleeves",
  "shoulders",
  "waist",
  "skirt",
  "legs",
  "dupatta",
  "back",
  "front",
];

/** Create default applied designs for all regions */
const createDefaultDesigns = (): Record<BodyRegion, AppliedDesign> => {
  const designs = {} as Record<BodyRegion, AppliedDesign>;
  ALL_REGIONS.forEach((region) => {
    designs[region] = createEmptyDesign(region);
  });
  return designs;
};

interface DesignState {
  // Current project
  currentProject: DesignProject | null;
  appliedDesigns: Record<BodyRegion, AppliedDesign>;
  garmentCategory: GarmentCategory;

  // History
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  maxHistorySize: number;

  // UI
  isDirty: boolean;
  lastSavedAt: string | null;
}

interface DesignActions {
  // Project management
  createNewProject: (name: string, category: GarmentCategory) => void;
  loadProject: (project: DesignProject) => void;
  saveProject: () => DesignProject;
  setGarmentCategory: (category: GarmentCategory) => void;

  // Design operations
  applyComponent: (region: BodyRegion, componentId: string) => void;
  applyTexture: (region: BodyRegion, textureId: string) => void;
  applyColor: (region: BodyRegion, colorId: string) => void;
  applyEmbroidery: (region: BodyRegion, embroideryId: string, color: string) => void;
  applyMaterialOverride: (region: BodyRegion, overrides: Partial<AppliedDesign["materialOverrides"]>) => void;
  resetRegion: (region: BodyRegion) => void;
  resetAllRegions: () => void;

  // History
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useDesignStore = create<DesignState & DesignActions>()(
  persist(
    (set, get) => ({
      // Initial state
      currentProject: null,
      appliedDesigns: createDefaultDesigns(),
      garmentCategory: "lehenga",
      undoStack: [],
      redoStack: [],
      maxHistorySize: 50,
      isDirty: false,
      lastSavedAt: null,

      // Project management
      createNewProject: (name, category) => {
        const project: DesignProject = {
          id: generateId(),
          name,
          userId: "",
          garmentCategory: category,
          appliedDesigns: createDefaultDesigns(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: false,
          isFavorite: false,
        };
        set({
          currentProject: project,
          appliedDesigns: project.appliedDesigns,
          garmentCategory: category,
          undoStack: [],
          redoStack: [],
          isDirty: false,
        });
      },

      loadProject: (project) =>
        set({
          currentProject: project,
          appliedDesigns: project.appliedDesigns,
          garmentCategory: project.garmentCategory,
          undoStack: [],
          redoStack: [],
          isDirty: false,
        }),

      saveProject: () => {
        const state = get();
        const project: DesignProject = {
          ...(state.currentProject || {
            id: generateId(),
            name: "Untitled Design",
            userId: "",
            createdAt: new Date().toISOString(),
            isPublic: false,
            isFavorite: false,
          }),
          garmentCategory: state.garmentCategory,
          appliedDesigns: state.appliedDesigns,
          updatedAt: new Date().toISOString(),
        };
        set({
          currentProject: project,
          isDirty: false,
          lastSavedAt: new Date().toISOString(),
        });
        return project;
      },

      setGarmentCategory: (category) =>
        set({ garmentCategory: category, isDirty: true }),

      // Design operations with history tracking
      applyComponent: (region, componentId) => {
        const state = get();
        const previousState = { ...state.appliedDesigns[region] };
        const newState: AppliedDesign = {
          ...previousState,
          componentId,
        };

        const action: HistoryAction = {
          id: generateId(),
          timestamp: Date.now(),
          type: "apply_component",
          region,
          previousState,
          newState,
        };

        set({
          appliedDesigns: {
            ...state.appliedDesigns,
            [region]: newState,
          },
          undoStack: [...state.undoStack.slice(-(state.maxHistorySize - 1)), action],
          redoStack: [],
          isDirty: true,
        });
      },

      applyTexture: (region, textureId) => {
        const state = get();
        const previousState = { ...state.appliedDesigns[region] };
        const newState: AppliedDesign = { ...previousState, textureId };

        const action: HistoryAction = {
          id: generateId(),
          timestamp: Date.now(),
          type: "change_texture",
          region,
          previousState,
          newState,
        };

        set({
          appliedDesigns: { ...state.appliedDesigns, [region]: newState },
          undoStack: [...state.undoStack.slice(-(state.maxHistorySize - 1)), action],
          redoStack: [],
          isDirty: true,
        });
      },

      applyColor: (region, colorId) => {
        const state = get();
        const previousState = { ...state.appliedDesigns[region] };
        const newState: AppliedDesign = { ...previousState, colorId };

        const action: HistoryAction = {
          id: generateId(),
          timestamp: Date.now(),
          type: "change_color",
          region,
          previousState,
          newState,
        };

        set({
          appliedDesigns: { ...state.appliedDesigns, [region]: newState },
          undoStack: [...state.undoStack.slice(-(state.maxHistorySize - 1)), action],
          redoStack: [],
          isDirty: true,
        });
      },

      applyEmbroidery: (region, embroideryId, color) => {
        const state = get();
        const previousState = { ...state.appliedDesigns[region] };
        const newState: AppliedDesign = {
          ...previousState,
          embroideryId,
          embroideryColor: color,
        };

        const action: HistoryAction = {
          id: generateId(),
          timestamp: Date.now(),
          type: "change_embroidery",
          region,
          previousState,
          newState,
        };

        set({
          appliedDesigns: { ...state.appliedDesigns, [region]: newState },
          undoStack: [...state.undoStack.slice(-(state.maxHistorySize - 1)), action],
          redoStack: [],
          isDirty: true,
        });
      },

      applyMaterialOverride: (region, overrides) => {
        const state = get();
        const previousState = { ...state.appliedDesigns[region] };
        const newState: AppliedDesign = {
          ...previousState,
          materialOverrides: { ...previousState.materialOverrides, ...overrides },
        };

        const action: HistoryAction = {
          id: generateId(),
          timestamp: Date.now(),
          type: "change_material",
          region,
          previousState,
          newState,
        };

        set({
          appliedDesigns: { ...state.appliedDesigns, [region]: newState },
          undoStack: [...state.undoStack.slice(-(state.maxHistorySize - 1)), action],
          redoStack: [],
          isDirty: true,
        });
      },

      resetRegion: (region) => {
        const state = get();
        const previousState = { ...state.appliedDesigns[region] };
        const newState = createEmptyDesign(region);

        const action: HistoryAction = {
          id: generateId(),
          timestamp: Date.now(),
          type: "reset_region",
          region,
          previousState,
          newState,
        };

        set({
          appliedDesigns: { ...state.appliedDesigns, [region]: newState },
          undoStack: [...state.undoStack.slice(-(state.maxHistorySize - 1)), action],
          redoStack: [],
          isDirty: true,
        });
      },

      resetAllRegions: () =>
        set({
          appliedDesigns: createDefaultDesigns(),
          undoStack: [],
          redoStack: [],
          isDirty: true,
        }),

      // History operations
      undo: () => {
        const state = get();
        const lastAction = state.undoStack[state.undoStack.length - 1];
        if (!lastAction) return;

        set({
          appliedDesigns: {
            ...state.appliedDesigns,
            [lastAction.region]: lastAction.previousState,
          },
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, lastAction],
          isDirty: true,
        });
      },

      redo: () => {
        const state = get();
        const nextAction = state.redoStack[state.redoStack.length - 1];
        if (!nextAction) return;

        set({
          appliedDesigns: {
            ...state.appliedDesigns,
            [nextAction.region]: nextAction.newState,
          },
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, nextAction],
          isDirty: true,
        });
      },

      clearHistory: () => set({ undoStack: [], redoStack: [] }),

      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,
    }),
    {
      name: "vts-design-store",
      partialize: (state) => ({
        appliedDesigns: state.appliedDesigns,
        garmentCategory: state.garmentCategory,
        currentProject: state.currentProject,
      }),
    }
  )
);
