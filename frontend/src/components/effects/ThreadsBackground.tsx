import { memo } from 'react';
import Threads from './Threads';

function ThreadsBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,        
        background: '#050505',
      }}
    >
      <Threads
        color={[0.043, 0.455, 0.796]}
        amplitude={1}
        distance={0}
        enableMouseInteraction
      />
    </div>
  );
}

export default memo(ThreadsBackground);