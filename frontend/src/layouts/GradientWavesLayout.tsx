// frontend/src/components/layout/GradientWavesLayout.tsx
import type { ReactNode } from 'react';
import GradientWaves from '../common/GradientWaves';

interface GradientWavesLayoutProps {
  children: ReactNode;
}

export default function GradientWavesLayout({ children }: GradientWavesLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <GradientWaves
          horizonColor="#0a0a1a"
          waveColor="#2d1b69"
          crestColor="#6b3fa0"
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
      
      {/* Content layer with semi-transparent overlay for readability */}
      <div className="relative z-10 min-h-screen">
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        {children}
      </div>
    </div>
  );
}