"use client";

import { Html } from "@react-three/drei";

/**
 * ViewportLoader
 * 3D-space loading indicator displayed while the mannequin loads.
 * Uses Html from Drei to render DOM elements inside the canvas.
 */
export function ViewportLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
        </div>
        <div className="text-sm text-white/60 font-medium tracking-wide">
          Loading Model...
        </div>
      </div>
    </Html>
  );
}
