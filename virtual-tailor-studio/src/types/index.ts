// ============================================================
// VIRTUAL TAILOR STUDIO - Core Type Definitions
// ============================================================

/** Body regions that can be selected on the mannequin */
export type BodyRegion =
  | "chest"
  | "collar"
  | "neck"
  | "sleeves"
  | "shoulders"
  | "waist"
  | "skirt"
  | "legs"
  | "dupatta"
  | "back"
  | "front";

/** Supported garment categories */
export type GarmentCategory =
  | "saree"
  | "lehenga"
  | "salwar_kameez"
  | "kurta"
  | "blouse"
  | "dupatta"
  | "anarkali"
  | "sharara"
  | "palazzo";

/** Material types for PBR rendering */
export interface PBRMaterial {
  id: string;
  name: string;
  baseColor: string;
  metalness: number;
  roughness: number;
  normalMapUrl?: string;
  aoMapUrl?: string;
  displacementMapUrl?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
  opacity: number;
  transparent: boolean;
}

/** Texture definition for fabric representation */
export interface FabricTexture {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  diffuseMapUrl: string;
  normalMapUrl?: string;
  roughnessMapUrl?: string;
  repeatX: number;
  repeatY: number;
  rotation: number;
}

/** Color swatch for the color picker */
export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  category: string;
}

/** Embroidery pattern definition */
export interface EmbroideryPattern {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  patternUrl: string;
  defaultColor: string;
  applicableRegions: BodyRegion[];
}

/** A single clothing component that can be applied to a body region */
export interface ClothingComponent {
  id: string;
  name: string;
  category: string;
  bodyRegion: BodyRegion;
  modelUrl: string;
  thumbnailUrl: string;
  defaultMaterial: PBRMaterial;
  compatibleTextures: string[];
  compatibleColors: string[];
  price: number;
  tags: string[];
}

/** Applied design state for a single body region */
export interface AppliedDesign {
  regionId: BodyRegion;
  componentId: string | null;
  materialOverrides: Partial<PBRMaterial>;
  textureId: string | null;
  colorId: string | null;
  embroideryId: string | null;
  embroideryColor: string | null;
}

/** Complete design project state */
export interface DesignProject {
  id: string;
  name: string;
  userId: string;
  garmentCategory: GarmentCategory;
  appliedDesigns: Record<BodyRegion, AppliedDesign>;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  isFavorite: boolean;
}

/** Camera state for the 3D viewport */
export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
  fov: number;
}

/** Undo/Redo action for state history */
export interface HistoryAction {
  id: string;
  timestamp: number;
  type: "apply_component" | "change_material" | "change_texture" | "change_color" | "change_embroidery" | "reset_region";
  region: BodyRegion;
  previousState: AppliedDesign;
  newState: AppliedDesign;
}

/** User preferences */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  currency: string;
  autoSave: boolean;
  highQualityRendering: boolean;
  showGrid: boolean;
  showWireframe: boolean;
}

/** Order item for checkout */
export interface OrderItem {
  designId: string;
  quantity: number;
  measurements: Record<string, number>;
  notes: string;
  price: number;
}

/** Share link configuration */
export interface ShareConfig {
  designId: string;
  shareUrl: string;
  isPublic: boolean;
  expiresAt?: string;
  allowEditing: boolean;
}

/** Asset uploaded by admin */
export interface Asset {
  id: string;
  name: string;
  type: "model" | "texture" | "embroidery" | "color" | "material";
  url: string;
  thumbnailUrl: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  uploadedBy: string;
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** Viewport interaction mode */
export type InteractionMode = "orbit" | "pan" | "select" | "measure";

/** Notification type */
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}
