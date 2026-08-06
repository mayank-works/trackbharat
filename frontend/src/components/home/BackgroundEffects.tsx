// frontend/src/components/home/BackgroundEffects.tsx
import { memo } from 'react';
import GradientWaves from '../common/GradientWaves';

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10">
      <GradientWaves
        horizonColor="#7a7a7b"
        waveColor="#5d5d5d"
        crestColor="#f8f5f5"
        speed={0.3}
        amplitude={2.0}
        waveScale={0.8}
        waveRatio={0.9}
        swell={25}
        turbulence={15}
        tilt={1.2}
        zoom={0.8}
        height={3}
        fogDepth={35}
        detail="low"
        brightness={0.8}
        opacity={1}
        mouseInteraction={true}
        parallaxStrength={0.3}
        grain={true}
        grainIntensity={0.03}
        className="h-full w-full"
      />
    </div>
  );
}

export default memo(BackgroundEffects);