import { memo } from 'react';
import DotGrid from '../effects/DotGrid';

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10">
      <DotGrid
        dotSize={3.5}
        gap={16}
        baseColor="#222222"
        activeColor="#666666"
        proximity={120}
        shockRadius={150}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />
    </div>
  );
}

export default memo(BackgroundEffects); 