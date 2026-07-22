"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { POST_PROCESSING_CONFIG } from "@/engine/constants";

/**
 * PostProcessing
 * Premium post-processing effects for cinematic quality.
 * Subtle bloom for material sheen, vignette for focus,
 * and ACES tone mapping for filmic colors.
 */
export function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={POST_PROCESSING_CONFIG.bloom.intensity}
        luminanceThreshold={POST_PROCESSING_CONFIG.bloom.luminanceThreshold}
        luminanceSmoothing={POST_PROCESSING_CONFIG.bloom.luminanceSmoothing}
        mipmapBlur
      />
      <Vignette
        offset={POST_PROCESSING_CONFIG.vignette.offset}
        darkness={POST_PROCESSING_CONFIG.vignette.darkness}
      />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  );
}
