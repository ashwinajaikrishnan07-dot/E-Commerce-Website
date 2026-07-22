"use client";

import { useEffect } from "react";
import { useDesignStore, useViewportStore, useUIStore } from "@/store";

// ============================================================
// KEYBOARD SHORTCUTS HOOK
// Global keyboard shortcuts for power users.
// ============================================================

export function useKeyboardShortcuts() {
  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const saveProject = useDesignStore((s) => s.saveProject);
  const resetCamera = useViewportStore((s) => s.resetCamera);
  const toggleFullscreen = useViewportStore((s) => s.toggleFullscreen);
  const toggleGrid = useViewportStore((s) => s.toggleGrid);
  const clearSelection = useViewportStore((s) => s.clearSelection);
  const toggleCustomizationPanel = useUIStore((s) => s.toggleCustomizationPanel);
  const addNotification = useUIStore((s) => s.addNotification);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Ctrl+Z — Undo
      if (isCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Shift+Z or Ctrl+Y — Redo
      if ((isCtrl && e.shiftKey && e.key === "z") || (isCtrl && e.key === "y")) {
        e.preventDefault();
        redo();
      }

      // Ctrl+S — Save
      if (isCtrl && e.key === "s") {
        e.preventDefault();
        saveProject();
        addNotification({
          type: "success",
          title: "Saved",
          message: "Design saved",
          duration: 2000,
        });
      }

      // Escape — Clear selection / close panel
      if (e.key === "Escape") {
        clearSelection();
      }

      // F — Fullscreen
      if (e.key === "f" && !isCtrl && !e.target) {
        toggleFullscreen();
      }

      // G — Toggle grid
      if (e.key === "g" && !isCtrl) {
        const active = document.activeElement;
        if (active?.tagName !== "INPUT" && active?.tagName !== "TEXTAREA") {
          toggleGrid();
        }
      }

      // R — Reset camera
      if (e.key === "r" && !isCtrl) {
        const active = document.activeElement;
        if (active?.tagName !== "INPUT" && active?.tagName !== "TEXTAREA") {
          resetCamera();
        }
      }

      // P — Toggle panel
      if (e.key === "p" && !isCtrl) {
        const active = document.activeElement;
        if (active?.tagName !== "INPUT" && active?.tagName !== "TEXTAREA") {
          toggleCustomizationPanel();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    saveProject,
    resetCamera,
    toggleFullscreen,
    toggleGrid,
    clearSelection,
    toggleCustomizationPanel,
    addNotification,
  ]);
}
