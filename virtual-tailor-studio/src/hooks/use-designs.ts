"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { DesignProject, ApiResponse } from "@/types";

// ============================================================
// DESIGNS HOOKS
// React Query hooks for design project CRUD operations.
// ============================================================

const DESIGNS_KEY = ["designs"] as const;

/** Fetch all design projects for the current user */
export function useDesigns(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...DESIGNS_KEY, page, pageSize],
    queryFn: () =>
      api.get<ApiResponse<DesignProject[]>>("/designs", { page, pageSize }),
  });
}

/** Fetch a single design project by ID */
export function useDesign(id: string | null) {
  return useQuery({
    queryKey: [...DESIGNS_KEY, id],
    queryFn: () => api.get<DesignProject>(`/designs/${id}`),
    enabled: !!id,
  });
}

/** Create a new design project */
export function useCreateDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; garmentCategory: string }) =>
      api.post<DesignProject>("/designs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGNS_KEY });
    },
  });
}

/** Update a design project */
export function useUpdateDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      api.put<DesignProject>(`/designs/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...DESIGNS_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: DESIGNS_KEY });
    },
  });
}

/** Delete a design project */
export function useDeleteDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/designs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGNS_KEY });
    },
  });
}

/** Duplicate a design project */
export function useDuplicateDesign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post<DesignProject>(`/designs/${id}/duplicate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGNS_KEY });
    },
  });
}

/** Toggle favorite status */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post(`/designs/${id}/favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGNS_KEY });
    },
  });
}
