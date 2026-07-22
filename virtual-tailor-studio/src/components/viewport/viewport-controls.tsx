"use client";

import {
  RotateCcw,
  Maximize2,
  Grid3X3,
  Eye,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer2,
  Camera,
  Undo2,
  Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useViewportStore, useDesignStore } from "@/store";
import type { InteractionMode } from "@/types";

// ============================================================
// VIEWPORT CONTROLS
// Floating toolbar for viewport interaction controls.
// Provides camera reset, zoom, mode switching, undo/redo.
// ============================================================

export function ViewportControls() {
  const interactionMode = useViewportStore((s) => s.interactionMode);
  const setInteractionMode = useViewportStore((s) => s.setInteractionMode);
  const resetCamera = useViewportStore((s) => s.resetCamera);
  const toggleFullscreen = useViewportStore((s) => s.toggleFullscreen);
  const toggleGrid = useViewportStore((s) => s.toggleGrid);
  const showGrid = useViewportStore((s) => s.showGrid);

  const undo = useDesignStore((s) => s.undo);
  const redo = useDesignStore((s) => s.redo);
  const canUndo = useDesignStore((s) => s.canUndo);
  const canRedo = useDesignStore((s) => s.canRedo);

  const modeButtons: { mode: InteractionMode; icon: typeof MousePointer2; label: string }[] = [
    { mode: "orbit", icon: RotateCcw, label: "Orbit" },
    { mode: "pan", icon: Move, label: "Pan" },
    { mode: "select", icon: MousePointer2, label: "Select" },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Interaction mode buttons */}
        {modeButtons.map(({ mode, icon: Icon, label }) => (
          <Tooltip key={mode} content={label} side="top">
            <Button
              variant={interactionMode === mode ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setInteractionMode(mode)}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </Tooltip>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Camera controls */}
        <Tooltip content="Reset Camera" side="top">
          <Button variant="ghost" size="icon-sm" onClick={resetCamera} aria-label="Reset camera">
            <Camera className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Toggle Grid" side="top">
          <Button
            variant={showGrid ? "default" : "ghost"}
            size="icon-sm"
            onClick={toggleGrid}
            aria-label="Toggle grid"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Fullscreen" side="top">
          <Button variant="ghost" size="icon-sm" onClick={toggleFullscreen} aria-label="Fullscreen">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Undo/Redo */}
        <Tooltip content="Undo" side="top">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={undo}
            disabled={!canUndo()}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Redo" side="top">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={redo}
            disabled={!canRedo()}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
