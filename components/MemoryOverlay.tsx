import React, { useEffect, useState, useRef } from 'react';

interface Props {
  images: string[];
  active: boolean;
}

interface FloatingMemory {
  id: number;
  url: string;
  x: number;
  y: number;
  rotationStart: number;
  rotationMid: number;
  rotationEnd: number;
  size: number;
  duration: number;
}

export const MemoryOverlay: React.FC<Props> = ({ images, active }) => {
  const [memories, setMemories] = useState<FloatingMemory[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (!active || images.length === 0) {
      setMemories([]);
      return;
    }

    // Spawn a new memory every 2.5 - 4 seconds
    const interval = setInterval(() => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      
      // Check for mobile width
      const isMobile = window.innerWidth < 768;
      
      // Determine size range based on device
      // Mobile: 80px - 140px
      // Desktop: 140px - 220px
      const baseSize = isMobile ? 80 : 140;
      const sizeVariance = isMobile ? 60 : 80;

      const newMemory: FloatingMemory = {
        id: nextId.current++,
        url: randomImage,
        // Position: Randomly across width (10% to 90%) and height (20% to 80%)
        x: Math.random() * 80 + 10, 
        y: Math.random() * 60 + 20, 
        rotationStart: (Math.random() - 0.5) * 10,
        rotationMid: (Math.random() - 0.5) * 20,
        rotationEnd: (Math.random() - 0.5) * 30,
        size: Math.random() * sizeVariance + baseSize, 
        duration: 8 + Math.random() * 5, // 8-13 seconds duration
      };

      setMemories(prev => [...prev, newMemory]);

      // Cleanup old memories after they finish
      setTimeout(() => {
        setMemories(prev => prev.filter(m => m.id !== newMemory.id));
      }, newMemory.duration * 1000);

    }, 3000);

    return () => clearInterval(interval);
  }, [active, images]);

  if (!active || images.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {memories.map(m => (
        <div
          key={m.id}
          className="absolute animate-memory opacity-0"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: `${m.size}px`,
            // Set CSS variables for the keyframes to use
            '--r-start': `${m.rotationStart}deg`,
            '--r-mid': `${m.rotationMid}deg`,
            '--r-end': `${m.rotationEnd}deg`,
            animationDuration: `${m.duration}s`,
          } as React.CSSProperties}
        >
          {/* Sepia & Feathered Image Container */}
          <div className="w-full h-full p-2 bg-white/10 shadow-lg transform -translate-x-1/2 -translate-y-1/2 rotate-2">
             <img 
               src={m.url} 
               alt="Memory" 
               className="w-full h-full object-cover sepia-[0.6] contrast-[0.85] brightness-[0.9] rounded-sm opacity-90"
               style={{
                 maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
                 WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)'
               }}
             />
          </div>
        </div>
      ))}
    </div>
  );
};