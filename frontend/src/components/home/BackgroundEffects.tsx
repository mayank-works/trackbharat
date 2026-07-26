import { memo } from 'react';
import ThreadsBackground from '../effects/ThreadsBackground';

function BackgroundEffects() {
  return <ThreadsBackground />;
}

export default memo(BackgroundEffects);