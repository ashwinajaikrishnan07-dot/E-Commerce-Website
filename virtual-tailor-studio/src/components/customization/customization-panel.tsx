"use client";

import { useCallback } from "react";
import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useViewportStore, useDesignStore, useUIStore } from "@/store";
import { REGION_LABELS } from "@/engine/constants";
import { ComponentSelector } from "./component-selector";
import { ColorPicker } from "./color-picker";
import { TextureSelector } from "./texture-selector";
import { EmbroiderySelector } from "./embroidery-selector";
import { cn } from "@/lib/utils";

// ============================================================
// CUSTOMIZATION PANEL
// Slide-in panel that appears when a body region is selected.
// Contains tabs for component, texture, color, and embroidery.
// ============================================================

export function CustomizationPanel() {
  const isOpen = useUIStore((s) => s.isCustomizationPanelOpen);
  const closePanel = useUIStore((s) => s.closeCustomizationPanel);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const selectedRegion = useViewportStore((s) => s.selectedRegion);
  const clearSelection = useViewportStore((s) => s.clearSelection);
  const resetRegion = useDesignStore((s) => s.resetRegion);

  const handleClose = useCallback(() => {
    closePanel();
    clearSelection();
  }, [closePanel, clearSelection]);

  const handleReset = useCallback(() => {
    if (selectedRegion) {
      resetRegion(selectedRegion);
    }
  }, [selectedRegion, resetRegion]);

  const tabs = [
    { id: "components", label: "Design" },
    { id: "textures", label: "Fabric" },
    { id: "colors", label: "Color" },
    { id: "embroidery", label: "Embroidery" },
  ];

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-[380px] z-40 transition-transform duration-500 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Glass panel background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl border-l border-white/10" />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {selectedRegion ? REGION_LABELS[selectedRegion] : "Customize"}
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Select options to customize this region
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleReset}
              aria-label="Reset region"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex px-6 pt-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Separator className="mt-4" />

        {/* Tab content */}
        <ScrollArea className="flex-1 px-6 py-4">
          {activeTab === "components" && <ComponentSelector />}
          {activeTab === "textures" && <TextureSelector />}
          {activeTab === "colors" && <ColorPicker />}
          {activeTab === "embroidery" && <EmbroiderySelector />}
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <Button variant="premium" className="w-full" size="lg">
            Apply Design
          </Button>
        </div>
      </div>
    </div>
  );
}
