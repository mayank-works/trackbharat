import { memo } from 'react';
import Threads from './Threads';

function ThreadsBackground() {
  return (
    <Threads
      color={[1, 1, 1]}  // White instead of blue
      amplitude={1}
      distance={0}
      enableMouseInteraction={true}
    />
  );
}

export default memo(ThreadsBackground);