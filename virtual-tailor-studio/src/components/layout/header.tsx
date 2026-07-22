"use client";

import {
  Save,
  Share2,
  Download,
  FolderOpen,
  Settings,
  Menu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useDesignStore, useUIStore } from "@/store";

// ============================================================
// HEADER
// Top navigation bar with project name, save/share/export actions.
// Premium glassmorphism design.
// ============================================================

export function Header() {
  const isDirty = useDesignStore((s) => s.isDirty);
  const saveProject = useDesignStore((s) => s.saveProject);
  const currentProject = useDesignStore((s) => s.currentProject);
  const openProjectsPanel = useUIStore((s) => s.openProjectsPanel);
  const openSettingsPanel = useUIStore((s) => s.openSettingsPanel);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const addNotification = useUIStore((s) => s.addNotification);

  const handleSave = () => {
    saveProject();
    addNotification({
      type: "success",
      title: "Saved",
      message: "Design saved successfully",
      duration: 3000,
    });
  };

  const handleShare = () => {
    addNotification({
      type: "info",
      title: "Share",
      message: "Share link copied to clipboard",
      duration: 3000,
    });
  };

  const handleExport = () => {
    addNotification({
      type: "info",
      title: "Export",
      message: "Generating high-resolution screenshot...",
      duration: 3000,
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      {/* Glass background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-b border-white/10" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-6">
        {/* Left: Logo + Project name */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-white tracking-tight">
                Virtual Tailor Studio
              </h1>
              <p className="text-[10px] text-white/40 -mt-0.5">
                {currentProject?.name || "Untitled Design"}
                {isDirty && (
                  <span className="ml-1.5 text-amber-400">• Unsaved</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Status badge */}
        <div className="hidden md:flex items-center">
          <Badge variant="secondary" className="text-[10px]">
            3D Preview
          </Badge>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1">
          <Tooltip content="My Projects" side="bottom">
            <Button variant="ghost" size="icon-sm" onClick={openProjectsPanel} aria-label="Projects">
              <FolderOpen className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Save" side="bottom">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleSave}
              aria-label="Save"
            >
              <Save className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Share" side="bottom">
            <Button variant="ghost" size="icon-sm" onClick={handleShare} aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Export" side="bottom">
            <Button variant="ghost" size="icon-sm" onClick={handleExport} aria-label="Export">
              <Download className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Settings" side="bottom">
            <Button variant="ghost" size="icon-sm" onClick={openSettingsPanel} aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
