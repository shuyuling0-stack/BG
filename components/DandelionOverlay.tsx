import React, { useEffect, useRef } from 'react';

interface Props {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number; // Horizontal drift (wind)
  vy: number; // Vertical fall speed
  size: number;
  wobbleOffset: number; // Slight variation phase
  wobbleSpeed: number;  // Speed of the subtle vibration
  tilt: number;         // Static tilt based on drift
  opacity: number;
  fluffCount: number;
  stemCurve: number;
  fluffSpread: number;
}

export const DandelionOverlay: React.FC<Props> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const timeRef = useRef<number>(0);

  const initParticle = (width: number, height: number, startAtTop = true): Particle => {
    // Determine a random drift direction (left or right)
    // Range: -0.4 to 0.4 pixels per frame (Gentle wind)
    const drift = (Math.random() - 0.5) * 0.8; 

    return {
      x: Math.random() * width,
      y: startAtTop ? -60 : Math.random() * height, // Start slightly above screen
      vx: drift,
      // VERY SLOW falling speed: 0.15 to 0.35 pixels per frame
      vy: Math.random() * 0.2 + 0.15, 
      size: Math.random() * 15 + 15,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
      // Tilt opposes drift slightly (drag) + random variation
      tilt: -drift * 0.5 + (Math.random() - 0.5) * 0.2, 
      opacity: Math.random() * 0.3 + 0.5,
      fluffCount: Math.floor(Math.random() * 6) + 8,
      stemCurve: (Math.random() - 0.5) * 15,
      fluffSpread: 0.7 + Math.random() * 0.4,
    };
  };

  // Draws a single dandelion seed
  const drawSeed = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    
    // Add a tiny, barely perceptible sway to the rotation for "life"
    const microRotation = Math.sin(timeRef.current * p.wobbleSpeed + p.wobbleOffset) * 0.05;
    ctx.rotate(p.tilt + microRotation); 
    
    ctx.globalAlpha = p.opacity;

    // Retro Brown Sketch Color
    ctx.strokeStyle = '#5d4037'; 
    ctx.fillStyle = '#5d4037';
    
    // Scale drawing
    const s = p.size / 20; 
    ctx.scale(s, s);

    // --- Draw The Seed (Bottom weight) ---
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(1.5, 18);
    ctx.lineTo(0, 20);
    ctx.lineTo(-1.5, 18);
    ctx.closePath();
    ctx.fill();

    // --- Draw The Stem (Beak) ---
    ctx.beginPath();
    ctx.moveTo(0, 15);
    // Slight curve
    ctx.quadraticCurveTo(p.stemCurve * 0.3, 5, 0, -5); 
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // --- Draw The Fluff (Pappus) ---
    const { fluffCount, fluffSpread } = p;
    ctx.lineWidth = 0.5;
    
    for(let i = 0; i < fluffCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, -5);
        
        const spread = Math.PI * fluffSpread; 
        const baseAngle = -Math.PI/2 + (i / (fluffCount - 1) - 0.5) * spread;
        const angle = baseAngle + (Math.random() - 0.5) * 0.1;
        const length = 14 + Math.random() * 8;
        
        const cpX = Math.cos(angle) * (length * 0.6) + (Math.random() - 0.5) * 3;
        const cpY = -5 + Math.sin(angle) * (length * 0.6);
        const endX = Math.cos(angle) * length;
        const endY = -5 + Math.sin(angle) * length;

        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.stroke();
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    if (particles.current.length === 0) {
      for (let i = 0; i < 9; i++) {
        particles.current.push(initParticle(canvas.width, canvas.height, false));
      }
    }

    const render = () => {
      if (!active) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return; 
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 1;

      particles.current.forEach((p, index) => {
        // Natural Linear Drift
        // Instead of S-shape sine wave, we use constant velocity (p.vx)
        // plus a tiny micro-movement (wobble) to prevent it looking robotic
        const microWobble = Math.sin(timeRef.current * p.wobbleSpeed + p.wobbleOffset) * 0.2;
        
        p.x += p.vx + microWobble;
        p.y += p.vy;

        // Wrap around
        if (p.y > canvas.height + 60) {
          particles.current[index] = initParticle(canvas.width, canvas.height, true);
        }
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.x < -50) p.x = canvas.width + 50;

        drawSeed(ctx, p);
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    if (active) {
        render();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [active]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-1000"
      style={{ opacity: active ? 1 : 0 }}
    />
  );
};