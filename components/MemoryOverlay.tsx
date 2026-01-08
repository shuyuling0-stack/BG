import React, { useEffect, useState, useRef } from 'react';

interface Props {
  images: string[];
  texts: string[];
  active: boolean;
}

interface FloatingMemory {
  id: number;
  type: 'image' | 'text';
  content: string;
  x: number;
  y: number;
  rotationStart: number;
  rotationMid: number;
  rotationEnd: number;
  size: number;
  duration: number;
}

export const MemoryOverlay: React.FC<Props> = ({ images, texts, active }) => {
  const [memories, setMemories] = useState<FloatingMemory[]>([]);
  const nextId = useRef(0);
  const memoriesRef = useRef<FloatingMemory[]>([]);

  // Keep ref synchronized with state to access current items inside setInterval
  useEffect(() => {
    memoriesRef.current = memories;
  }, [memories]);

  useEffect(() => {
    if (!active || (images.length === 0 && texts.length === 0)) {
      setMemories([]);
      return;
    }

    // Spawn a new memory every 3 seconds
    const interval = setInterval(() => {
      // 1. Identify currently displayed content
      const activeContents = new Set(memoriesRef.current.map(m => m.content));

      // 2. Filter available items to those NOT currently displayed
      const availableImages = images.filter(img => !activeContents.has(img));
      const availableTexts = texts.filter(txt => !activeContents.has(txt));

      // 3. Determine what to spawn based on what is available
      const availableTypes: ('image' | 'text')[] = [];
      if (availableImages.length > 0) availableTypes.push('image');
      if (availableTexts.length > 0) availableTypes.push('text');
      
      // If nothing is available (all memories are currently on screen), skip spawning
      if (availableTypes.length === 0) return;

      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      let content = "";
      
      if (type === 'image') {
        content = availableImages[Math.floor(Math.random() * availableImages.length)];
      } else {
        content = availableTexts[Math.floor(Math.random() * availableTexts.length)];
      }

      // Check for mobile width
      const isMobile = window.innerWidth < 768;
      
      // Determine size range based on device
      let baseSize = isMobile ? 80 : 140;
      let sizeVariance = isMobile ? 60 : 80;

      // Make text containers slightly wider to accommodate phrases better without cramping
      if (type === 'text') {
         baseSize = isMobile ? 150 : 250;
         sizeVariance = isMobile ? 100 : 150;
      }

      const size = Math.random() * sizeVariance + baseSize;

      const newMemory: FloatingMemory = {
        id: nextId.current++,
        type,
        content,
        // Position: Randomly across width (10% to 90%) and height (20% to 80%)
        x: Math.random() * 80 + 10, 
        y: Math.random() * 60 + 20, 
        rotationStart: (Math.random() - 0.5) * 10,
        rotationMid: (Math.random() - 0.5) * 20,
        rotationEnd: (Math.random() - 0.5) * 30,
        size: size, 
        duration: 8 + Math.random() * 5, // 8-13 seconds duration
      };

      setMemories(prev => [...prev, newMemory]);

      // Cleanup old memories after they finish
      setTimeout(() => {
        setMemories(prev => prev.filter(m => m.id !== newMemory.id));
      }, newMemory.duration * 1000);

    }, 3000);

    return () => clearInterval(interval);
  }, [active, images, texts]);

  if (!active || (images.length === 0 && texts.length === 0)) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {memories.map(m => {
        // Check if content has Chinese characters
        const isChinese = /[\u4e00-\u9fa5]/.test(m.content);

        return (
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
            {m.type === 'image' ? (
              /* Sepia & Feathered Image Container */
              <div className="w-full h-full p-2 bg-white/10 shadow-lg transform -translate-x-1/2 -translate-y-1/2 rotate-2">
                <img 
                  src={m.content} 
                  alt="Memory" 
                  className="w-full h-full object-cover sepia-[0.6] contrast-[0.85] brightness-[0.9] rounded-sm opacity-90"
                  style={{
                    maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)'
                  }}
                />
              </div>
            ) : (
              /* Transparent Handwritten Text */
              <div className="w-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <p 
                    className="text-[#3e2723] text-center leading-tight break-words" 
                    style={{ 
                      // Reduced font size
                      fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', 
                      // Switch font based on content language
                      fontFamily: isChinese ? '"ZCOOL KuaiLe", cursive' : '"Gaegu", cursive',
                      fontWeight: 700,
                      // Removed shadows
                      textShadow: 'none',
                      filter: 'none'
                    }}
                  >
                      {m.content}
                  </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};