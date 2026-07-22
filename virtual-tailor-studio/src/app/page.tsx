"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Notifications } from "@/components/layout/notifications";
import { CustomizationPanel } from "@/components/customization/customization-panel";
import { ViewportControls } from "@/components/viewport/viewport-controls";
import { RegionIndicator } from "@/components/viewport/region-indicator";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

// ============================================================
// HOME PAGE
// Main application page with 3D viewport, customization panel,
// and all UI chrome. The viewport canvas is dynamically imported
// to prevent SSR issues with Three.js/WebGL.
// ============================================================

/** Dynamic import for the 3D canvas — no SSR for WebGL */
const ViewportCanvas = dynamic(
  () =>
    import("@/components/viewport/viewport-canvas").then(
      (mod) => mod.ViewportCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center viewport-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          </div>
          <p className="text-sm text-white/40 font-medium">
            Initializing 3D Engine...
          </p>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  useKeyboardShortcuts();

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main viewport area */}
      <main className="absolute inset-0 pt-16 lg:pl-16">
        {/* 3D Viewport */}
        <div className="relative h-full w-full viewport-bg">
          <ViewportCanvas className="h-full w-full" />

          {/* Viewport overlay UI */}
          <RegionIndicator />
          <ViewportControls />
        </div>
      </main>

      {/* Customization slide-in panel */}
      <CustomizationPanel />

      {/* Notifications */}
      <Notifications />
    </div>
  );
}
