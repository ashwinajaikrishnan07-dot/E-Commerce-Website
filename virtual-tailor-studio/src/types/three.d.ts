// Three.js module augmentation for custom mesh userData
import { Object3D } from "three";

declare module "three" {
  interface Object3D {
    userData: {
      bodyRegion?: string;
      selectable?: boolean;
      highlightable?: boolean;
      originalMaterial?: THREE.Material | THREE.Material[];
      [key: string]: unknown;
    };
  }
}
