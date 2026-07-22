"use client";

import { useCallback } from "react";
import { useUIStore } from "@/store";

// ============================================================
// SCREENSHOT HOOK
// Captures the 3D viewport canvas as a high-resolution image.
// ============================================================

export function useScreenshot() {
  const addNotification = useUIStore((s) => s.addNotification);

  const captureScreenshot = useCallback(
    (options?: { quality?: number; format?: "png" | "jpeg"; scale?: number }) => {
      const { quality = 1.0, format = "png", scale = 2 } = options || {};

      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      if (!canvas) {
        addNotification({
          type: "error",
          title: "Screenshot Failed",
          message: "No canvas element found",
        });
        return null;
      }

      try {
        // For higher resolution, we'd need to resize and re-render
        // For now, capture at current resolution
        const mimeType = format === "png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, quality);

        return dataUrl;
      } catch (error) {
        addNotification({
          type: "error",
          title: "Screenshot Failed",
          message: "Could not capture the viewport",
        });
        return null;
      }
    },
    [addNotification]
  );

  const downloadScreenshot = useCallback(
    (filename = "design-export") => {
      const dataUrl = captureScreenshot({ quality: 1.0, format: "png", scale: 2 });
      if (!dataUrl) return;

      const link = document.createElement("a");
      link.download = `${filename}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      addNotification({
        type: "success",
        title: "Exported",
        message: "Screenshot saved to downloads",
        duration: 3000,
      });
    },
    [captureScreenshot, addNotification]
  );

  return { captureScreenshot, downloadScreenshot };
}
