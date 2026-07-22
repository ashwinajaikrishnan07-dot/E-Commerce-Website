"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// ============================================================
// COMPONENTS HOOKS
// React Query hooks for fetching available customization options.
// ============================================================

/** Fetch clothing components by body part */
export function useComponentsByBodyPart(bodyPart: string | null, categoryId?: string) {
  return useQuery({
    queryKey: ["components", bodyPart, categoryId],
    queryFn: () =>
      api.get(`/components/by-body-part/${bodyPart}`, { categoryId }),
    enabled: !!bodyPart,
  });
}

/** Fetch all fabric textures */
export function useTextures(categoryId?: string) {
  return useQuery({
    queryKey: ["textures", categoryId],
    queryFn: () => api.get("/components/textures", { categoryId }),
  });
}

/** Fetch all color swatches */
export function useColors(category?: string) {
  return useQuery({
    queryKey: ["colors", category],
    queryFn: () => api.get("/components/colors", { category }),
  });
}

/** Fetch embroidery patterns */
export function useEmbroidery(bodyPart?: string, categoryId?: string) {
  return useQuery({
    queryKey: ["embroidery", bodyPart, categoryId],
    queryFn: () => api.get("/components/embroidery", { bodyPart, categoryId }),
  });
}

/** Fetch all body parts */
export function useBodyParts() {
  return useQuery({
    queryKey: ["bodyParts"],
    queryFn: () => api.get("/components/body-parts"),
  });
}

/** Fetch categories */
export function useCategories(parentId?: string) {
  return useQuery({
    queryKey: ["categories", parentId],
    queryFn: () => api.get("/components/categories", { parentId }),
  });
}
