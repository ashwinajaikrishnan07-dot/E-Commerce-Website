"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useViewportStore } from "@/store";

// ============================================================
// CAMERA CONTROLLER
// Manages orbit controls with smooth GSAP-style transitions
// when focusing on body regions.
// ============================================================

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const cameraState = useViewportStore((s) => s.camera);
  const isAnimating = useViewportStore((s) => s.isAnimating);
  const setIsAnimating = useViewportStore((s) => s.setIsAnimating);
  const interactionMode = useViewportStore((s) => s.interactionMode);

  // Smooth camera transition
  const targetPosition = useRef(new THREE.Vector3(...cameraState.position));
  const targetLookAt = useRef(new THREE.Vector3(...cameraState.target));

  useEffect(() => {
    targetPosition.current.set(...cameraState.position);
    targetLookAt.current.set(...cameraState.target);
  }, [cameraState]);

  useFrame(() => {
    if (!isAnimating || !controlsRef.current) return;

    // Smooth interpolation (damped spring feel)
    const lerpFactor = 0.05;

    camera.position.lerp(targetPosition.current, lerpFactor);
    controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
    controlsRef.current.update();

    // Check if animation is complete
    const positionDelta = camera.position.distanceTo(targetPosition.current);
    const targetDelta = controlsRef.current.target.distanceTo(
      targetLookAt.current
    );

    if (positionDelta < 0.01 && targetDelta < 0.01) {
      setIsAnimating(false);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      // Constraints
      minDistance={1.5}
      maxDistance={8}
      minPolarAngle={Math.PI * 0.1}
      maxPolarAngle={Math.PI * 0.85}
      // Damping for smooth feel
      enableDamping
      dampingFactor={0.08}
      // Interaction control
      enablePan={interactionMode === "pan" || interactionMode === "orbit"}
      enableRotate={interactionMode === "orbit" || interactionMode === "select"}
      enableZoom
      // Touch settings
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
      // Mouse buttons
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}
