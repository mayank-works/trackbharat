import React, { useRef, useEffect, useState } from 'react';

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 4,
  gap = 32,
  baseColor = '#2a2a2a',
  activeColor = '#666666',
  proximity = 150,
  className = '',
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const updateDots = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const cell = dotSize + gap;
      const cols = Math.floor((rect.width + gap) / cell);
      const rows = Math.floor((rect.height + gap) / cell);

      const startX = (rect.width - (cols * cell - gap)) / 2 + dotSize / 2;
      const startY = (rect.height - (rows * cell - gap)) / 2 + dotSize / 2;

      const newDots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          newDots.push({
            x: startX + x * cell,
            y: startY + y * cell,
          });
        }
      }
      setDots(newDots);
    };

    updateDots();
    window.addEventListener('resize', updateDots);

    return () => {
      window.removeEventListener('resize', updateDots);
    };
  }, [dotSize, gap]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getColor = (x: number, y: number) => {
    const dx = x - mousePos.x;
    const dy = y - mousePos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < proximity) {
      const ratio = 1 - dist / proximity;
      return activeColor;
    }
    return baseColor;
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full min-h-screen ${className}`}
      style={style}
    >
      {dots.map((dot, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${dot.x - dotSize / 2}px`,
            top: `${dot.y - dotSize / 2}px`,
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: '50%',
            backgroundColor: getColor(dot.x, dot.y),
            transition: 'background-color 0.15s ease',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default DotGrid;