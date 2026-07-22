"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import type { BodyRegion, PBRMaterial, FabricTexture } from "@/types";

// ============================================================
// MATERIAL ENGINE HOOK
// Manages PBR material creation, texture application,
// and real-time material swapping on mesh regions.
// ============================================================

/** Cache for loaded textures to prevent redundant loads */
const textureCache = new Map<string, THREE.Texture>();

/** Cache for created materials */
const materialCache = new Map<string, THREE.MeshStandardMaterial>();

export function useMaterialEngine() {
  const textureLoader = useRef(new THREE.TextureLoader());

  /**
   * Create a PBR material from configuration.
   * Uses MeshStandardMaterial for physically accurate rendering.
   */
  const createMaterial = useCallback(
    (config: PBRMaterial): THREE.MeshStandardMaterial => {
      const cacheKey = JSON.stringify(config);
      if (materialCache.has(cacheKey)) {
        return materialCache.get(cacheKey)!.clone();
      }

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.baseColor),
        metalness: config.metalness,
        roughness: config.roughness,
        opacity: config.opacity,
        transparent: config.transparent,
        side: THREE.DoubleSide,
        envMapIntensity: 0.8,
      });

      if (config.emissiveColor) {
        material.emissive = new THREE.Color(config.emissiveColor);
        material.emissiveIntensity = config.emissiveIntensity ?? 0;
      }

      materialCache.set(cacheKey, material);
      return material.clone();
    },
    []
  );

  /**
   * Load a texture with caching and optimized settings.
   */
  const loadTexture = useCallback(
    (url: string, options?: { repeat?: [number, number]; rotation?: number }): Promise<THREE.Texture> => {
      if (textureCache.has(url)) {
        const cached = textureCache.get(url)!;
        return Promise.resolve(cached.clone());
      }

      return new Promise((resolve, reject) => {
        textureLoader.current.load(
          url,
          (texture) => {
            // Optimize texture settings
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = 16;

            if (options?.repeat) {
              texture.repeat.set(options.repeat[0], options.repeat[1]);
            }
            if (options?.rotation) {
              texture.rotation = options.rotation;
            }

            textureCache.set(url, texture);
            resolve(texture.clone());
          },
          undefined,
          reject
        );
      });
    },
    []
  );

  /**
   * Apply a fabric texture to a set of meshes.
   */
  const applyFabricTexture = useCallback(
    async (meshes: THREE.Mesh[], fabric: FabricTexture) => {
      const diffuseMap = await loadTexture(fabric.diffuseMapUrl, {
        repeat: [fabric.repeatX, fabric.repeatY],
        rotation: fabric.rotation,
      });

      let normalMap: THREE.Texture | undefined;
      if (fabric.normalMapUrl) {
        normalMap = await loadTexture(fabric.normalMapUrl, {
          repeat: [fabric.repeatX, fabric.repeatY],
          rotation: fabric.rotation,
        });
      }

      let roughnessMap: THREE.Texture | undefined;
      if (fabric.roughnessMapUrl) {
        roughnessMap = await loadTexture(fabric.roughnessMapUrl, {
          repeat: [fabric.repeatX, fabric.repeatY],
          rotation: fabric.rotation,
        });
      }

      meshes.forEach((mesh) => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.isMeshStandardMaterial) {
          material.map = diffuseMap;
          if (normalMap) material.normalMap = normalMap;
          if (roughnessMap) material.roughnessMap = roughnessMap;
          material.needsUpdate = true;
        }
      });
    },
    [loadTexture]
  );

  /**
   * Apply a solid color to meshes in a region.
   */
  const applyColor = useCallback((meshes: THREE.Mesh[], hexColor: string) => {
    const color = new THREE.Color(hexColor);
    meshes.forEach((mesh) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material.isMeshStandardMaterial) {
        material.color = color;
        material.needsUpdate = true;
      }
    });
  }, []);

  /**
   * Apply highlight effect to meshes (hover state).
   */
  const applyHighlight = useCallback(
    (meshes: THREE.Mesh[], color: string = "#a78bfa", intensity: number = 0.3) => {
      meshes.forEach((mesh) => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.isMeshStandardMaterial) {
          material.emissive = new THREE.Color(color);
          material.emissiveIntensity = intensity;
          material.needsUpdate = true;
        }
      });
    },
    []
  );

  /**
   * Remove highlight from meshes.
   */
  const removeHighlight = useCallback((meshes: THREE.Mesh[]) => {
    meshes.forEach((mesh) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material.isMeshStandardMaterial) {
        material.emissive = new THREE.Color(0x000000);
        material.emissiveIntensity = 0;
        material.needsUpdate = true;
      }
    });
  }, []);

  /**
   * Reset meshes to their original material.
   */
  const resetMaterial = useCallback((meshes: THREE.Mesh[]) => {
    meshes.forEach((mesh) => {
      if (mesh.userData.originalMaterial) {
        mesh.material = (mesh.userData.originalMaterial as THREE.Material).clone();
      }
    });
  }, []);

  /**
   * Dispose all cached materials and textures.
   */
  const dispose = useCallback(() => {
    materialCache.forEach((mat) => mat.dispose());
    materialCache.clear();
    textureCache.forEach((tex) => tex.dispose());
    textureCache.clear();
  }, []);

  return {
    createMaterial,
    loadTexture,
    applyFabricTexture,
    applyColor,
    applyHighlight,
    removeHighlight,
    resetMaterial,
    dispose,
  };
}
