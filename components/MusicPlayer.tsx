import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Music4 } from 'lucide-react';
import { TapeData } from '../types';

interface Props {
  currentTape: TapeData | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  currentTime: number;
  duration: number;
}

// Hand-drawn style dandelion component using SVG filters
export const PencilDandelion = ({ className, style, color = "currentColor" }: { className?: string, style?: React.CSSProperties, color?: string }) => (
  <div className={`pointer-events-none ${className}`} style={style}>
    <svg viewBox="0 0 100 100" fill="none" stroke={color} className="w-full h-full">
      <g filter="url(#pencil-texture)">
        {/* Stem - multiple strokes for sketch effect */}
        <path d="M50 95 Q 52 70 50 50" strokeWidth="0.8" opacity="0.8" />
        <path d="M49.5 95 Q 51.5 70 49.5 50" strokeWidth="0.5" opacity="0.6" />
        
        {/* Seed Center */}
        <circle cx="50" cy="50" r="2" fill={color} opacity="0.4" stroke="none" />
        <circle cx="50" cy="50" r="2.2" fill="none" strokeWidth="0.5" opacity="0.8" />
        
        {/* Fluff / Seeds - Sketchy lines */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const wobble = (Math.random() - 0.5) * 5;
          const len = 30 + Math.random() * 10;
          const x2 = 50 + Math.cos(angle) * len;
          const y2 = 50 + Math.sin(angle) * len;
          
          const cpX = 50 + Math.cos(angle) * (len * 0.5) + wobble;
          const cpY = 50 + Math.sin(angle) * (len * 0.5) + wobble;

          return (
            <g key={i}>
              <path d={`M50 50 Q ${cpX} ${cpY} ${x2} ${y2}`} strokeWidth="0.4" opacity="0.7" />
              {/* Extra light stroke for detail */}
              <path d={`M50 50 Q ${cpX+1} ${cpY+1} ${x2} ${y2}`} strokeWidth="0.2" opacity="0.4" />
              
              {/* Seed tip */}
              <path d={`M${x2} ${y2} l ${Math.cos(angle)*2} ${Math.sin(angle)*2}`} strokeWidth="0.8" opacity="0.6" />
            </g>
          );
        })}
        
        {/* Flying seeds */}
        <path d="M60 40 Q 65 35 70 32" strokeWidth="0.4" opacity="0.6" />
        <path d="M70 32 l 2 -1" strokeWidth="0.8" opacity="0.6" />
        
        <path d="M35 30 Q 30 25 25 22" strokeWidth="0.4" opacity="0.5" />
        <path d="M25 22 l -2 -1" strokeWidth="0.8" opacity="0.5" />
      </g>
    </svg>
  </div>
);

export const MusicPlayer: React.FC<Props> = ({ 
  currentTape, 
  isPlaying, 
  onPlayPause, 
  onStop,
  currentTime,
  duration
}) => {
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(16).fill(10));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualizerBars(prev => prev.map(() => Math.random() * 80 + 10));
      }, 100);
    } else {
      setVisualizerBars(new Array(16).fill(5));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-2 md:p-4 perspective-1000">
      
      {/* Chassis - Improved Depth & Texture */}
      <div className="relative bg-[#d7ccc8] rounded-2xl p-4 md:p-6 shadow-[0_20px_40px_-5px_rgba(62,39,35,0.4),0_8px_10px_-6px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.4)] overflow-hidden border border-[#bcaaa4]">
        
        {/* Subtle Gradient Overlay for roundness */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5 pointer-events-none z-0 rounded-2xl"></div>
        
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 bg-[#eefeef] opacity-5 mix-blend-multiply pointer-events-none z-0" style={{ filter: 'url(#noiseFilter)' }}></div>
        <div className="absolute inset-0 wood-pattern opacity-20 mix-blend-multiply z-0"></div>

        {/* Hand Drawn Stickers - Integrated better */}
        <PencilDandelion 
          className="absolute bottom-8 right-4 w-32 h-32 rotate-[-10deg] opacity-60 mix-blend-multiply z-0 hidden md:block" 
          color="#5d4037"
        />
        <PencilDandelion 
          className="absolute top-[-10px] left-[-10px] w-24 h-24 rotate-[20deg] opacity-30 mix-blend-multiply z-0" 
          color="#8d6e63"
        />

        {/* Stamp Sticker - "PANIC" - Breeze Animation - Scaled down for mobile */}
        <div className={`absolute top-2 right-2 md:top-4 md:right-4 z-30 drop-shadow-md origin-top-right transition-transform duration-1000 ${isPlaying ? 'animate-breeze' : 'rotate-6'} scale-75 md:scale-100`}>
           <div className="bg-[#fdfbf7] p-1 shadow-[1px_1px_2px_rgba(0,0,0,0.2)] w-[100px] h-[120px] flex items-center justify-center relative overflow-hidden rounded-[2px]"
                style={{
                  maskImage: `radial-gradient(circle at 4px 4px, transparent 3px, black 3.5px)`,
                  maskPosition: '-4px -4px',
                  maskSize: '12px 12px',
                  maskRepeat: 'repeat',
                  WebkitMaskImage: `radial-gradient(circle at 4px 4px, transparent 3px, black 3.5px)`,
                  WebkitMaskPosition: '-4px -4px',
                  WebkitMaskSize: '12px 12px',
                  WebkitMaskRepeat: 'repeat',
                }}
           >
             <div className="absolute inset-0 border-2 border-[#fdfbf7] opacity-50 pointer-events-none"></div>

             <div className="bg-[#5d4037] w-full h-full flex flex-col p-1.5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ filter: 'url(#noiseFilter)' }}></div>
                
                <div className="flex justify-between items-start text-[#fdfbf7]">
                    <div className="text-[6px] font-serif leading-[1.1] opacity-90 text-left">
                       Beomgyu's<br/>Mixtape
                    </div>
                    <div className="text-[14px] font-serif font-bold tracking-wide leading-none mt-0.5">
                       PANIC
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative my-1">
                   <div className="relative w-14 h-14 text-[#fdfbf7] opacity-90" style={{ filter: 'url(#pencil-texture)' }}>
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
                          <g transform="translate(5, 5) scale(0.9)">
                              <ellipse cx="75" cy="72" rx="12" ry="10" transform="rotate(-10 75 72)" opacity="0.9"/>
                              <path d="M45,40 Q30,60 40,85 Q60,95 80,85 Q88,60 65,40 Z" />
                              <circle cx="50" cy="30" r="22" />
                              <circle cx="32" cy="18" r="7" />
                              <circle cx="68" cy="18" r="7" />
                              <ellipse cx="32" cy="82" rx="12" ry="14" transform="rotate(30 32 82)" />
                              <ellipse cx="38" cy="55" rx="10" ry="18" transform="rotate(20 38 55)" />
                              <path d="M45,35 Q50,40 55,35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                          </g>
                      </svg>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24">
                         <path d="M6 6l12 12M18 6l-12 12M8 12h8" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                      </svg>
                   </div>
                </div>

                <div className="flex justify-between items-end text-[#fdfbf7] mt-auto">
                    <div className="text-[7px] font-mono opacity-80">#001</div>
                    <div className="text-[7px] font-mono opacity-80">2025.03</div>
                </div>
             </div>
           </div>
        </div>

        {/* Metal Trim Effect */}
        <div className="absolute inset-0 rounded-2xl border-[4px] border-[#a1887f]/20 pointer-events-none z-20 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]"></div>

        {/* Top Section */}
        <div className="flex justify-center md:justify-between items-center mb-4 md:mb-6 px-2 relative z-10 md:mr-0">
          {/* Hide decorative lights on mobile to save space and prevent squishing */}
          <div className="hidden md:grid w-20 h-12 grid-cols-5 gap-1.5 opacity-60">
             {[...Array(20)].map((_, i) => (
               <div key={`l-${i}`} className="bg-[#4e342e] rounded-full w-1.5 h-1.5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
             ))}
          </div>
          <div className="text-center relative">
             <div className="text-[#4e342e] font-serif font-bold tracking-widest text-lg md:text-xl border-b-2 border-[#8d6e63]/40 pb-1 drop-shadow-sm">RETRO-SONIC</div>
             <div className="text-[8px] md:text-[10px] text-[#8d6e63] font-mono mt-1 tracking-[0.2em] uppercase">Analog Series</div>
          </div>
          <div className="hidden md:grid w-20 h-12 grid-cols-5 gap-1.5 opacity-60">
             {[...Array(20)].map((_, i) => (
               <div key={`r-${i}`} className="bg-[#4e342e] rounded-full w-1.5 h-1.5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
             ))}
          </div>
        </div>

        {/* Main Interface */}
        <div className="bg-[#efebe9] rounded-lg p-3 md:p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)] border border-white/50 relative z-10">
          
          {/* LCD Screen - More Realistic */}
          <div className="bg-[#78887b] w-full h-24 md:h-28 rounded-sm mb-4 md:mb-6 border-4 border-[#8d6e63] shadow-[inset_0_0_15px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center justify-center p-3 md:p-4 group">
            {/* Screen Inner Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] pointer-events-none z-20"></div>
            {/* Pixel Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none z-0 opacity-30"></div>
            
            {/* Backlight Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-[#a5d6a7]/20 to-transparent opacity-50 z-0"></div>

            {currentTape ? (
              <>
                <div className="flex w-full justify-between items-start mb-auto z-10 w-full relative overflow-hidden">
                   <div className="flex flex-col text-[#1a1a1a] w-full">
                     <h2 className="text-sm md:text-lg font-mono font-bold truncate w-full tracking-tighter drop-shadow-sm opacity-90">{currentTape.title || "Unknown Track"}</h2>
                     <h3 className="text-[10px] md:text-xs font-mono text-[#2e4c2e] truncate w-full opacity-80">{currentTape.artist || "Unknown Artist"}</h3>
                   </div>
                </div>

                <div className="flex w-full justify-between items-end z-10 relative">
                    {/* Visualizer */}
                    <div className="flex items-end h-6 md:h-8 gap-0.5 opacity-80 flex-1 mr-4">
                      {visualizerBars.map((height, i) => (
                        <div 
                          key={i} 
                          className="bg-[#1a1a1a] w-full opacity-80"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="text-right font-mono text-[#1a1a1a] text-lg md:text-xl tracking-widest opacity-90">
                        {formatTime(currentTime)}
                    </div>
                </div>
              </>
            ) : (
              <div className="text-[#2e4c2e]/60 font-mono text-xs md:text-sm tracking-widest z-10 animate-pulse">
                NO TAPE
              </div>
            )}
            
            {/* Glass Glare */}
            <div className="absolute top-[-80%] right-[-50%] w-[150%] h-[200%] bg-gradient-to-l from-white/20 to-transparent pointer-events-none rotate-12 z-20"></div>
          </div>

          {/* Tape Deck Window */}
          <div className="bg-[#3e2723] w-full h-32 md:h-36 rounded-sm mb-4 md:mb-6 relative overflow-hidden border-2 border-[#5d4037] shadow-[inset_0_6px_20px_rgba(0,0,0,0.6)] flex items-center justify-center">
            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/10 pointer-events-none z-20"></div>
            
            {currentTape ? (
              <div className={`relative w-40 md:w-44 h-24 md:h-28 bg-[#2b2b2b] rounded flex items-center justify-center transform transition-transform duration-700 ${isPlaying ? 'scale-[1.01]' : 'scale-100'} shadow-[0_4px_10px_rgba(0,0,0,0.5)]`}>
                 {/* Tape Texture */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-50"></div>
                 
                 {/* Reels */}
                 <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 md:w-10 h-8 md:h-10 rounded-full border-[3px] border-[#757575] flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''} bg-[#1a1a1a]`}>
                    <div className="w-1.5 h-1.5 bg-[#757575] rounded-full"></div>
                    <div className="absolute w-full h-0.5 bg-[#757575]"></div>
                    <div className="absolute h-full w-0.5 bg-[#757575]"></div>
                 </div>
                 <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 md:w-10 h-8 md:h-10 rounded-full border-[3px] border-[#757575] flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''} bg-[#1a1a1a]`}>
                    <div className="w-1.5 h-1.5 bg-[#757575] rounded-full"></div>
                    <div className="absolute w-full h-0.5 bg-[#757575]"></div>
                    <div className="absolute h-full w-0.5 bg-[#757575]"></div>
                 </div>

                 {/* Tape Window */}
                 <div className="h-6 md:h-8 w-16 md:w-20 bg-[#1a1a1a] rounded-sm relative overflow-hidden border border-[#444] shadow-inner">
                    <div className="w-full h-full bg-gradient-to-r from-[#111] via-[#2a2a2a] to-[#111] opacity-90"></div>
                 </div>

                 {/* Tape Label Strip */}
                 <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-24 md:w-28 h-4 md:h-5 rounded-sm opacity-90 shadow-sm
                    ${currentTape.color === 'amber' ? 'bg-[#d7aefb] mix-blend-color' : 
                      currentTape.color === 'olive' ? 'bg-[#e6ee9c] mix-blend-color' : 'bg-[#ef9a9a] mix-blend-color'}
                 `}></div>
              </div>
            ) : (
              <div className="text-[#a1887f] font-mono text-xs tracking-widest opacity-30 select-none">EMPTY DECK</div>
            )}
          </div>

          {/* Controls - Tactile Feel */}
          <div className="flex justify-center gap-4 md:gap-8 items-center">
            <button 
              onClick={onStop}
              disabled={!currentTape}
              className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-[#efebe9] to-[#d7ccc8] shadow-[0_4px_0_#a1887f,0_6px_10px_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_#a1887f,inset_0_2px_5px_rgba(0,0,0,0.1)] active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-[#fff]"
            >
               <Square className="text-[#5d4037] fill-[#5d4037]" size={16} />
            </button>

            <button 
              onClick={onPlayPause}
              disabled={!currentTape}
              className="group w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-[#ffe0b2] to-[#ffcc80] shadow-[0_5px_0_#ef6c00,0_8px_15px_rgba(239,108,0,0.25)] active:shadow-[0_2px_0_#ef6c00,inset_0_2px_5px_rgba(0,0,0,0.1)] active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-[#fff3e0]"
            >
               {isPlaying ? <Pause className="text-[#bf360c] fill-[#bf360c]" size={28} /> : <Play className="text-[#bf360c] fill-[#bf360c] ml-1" size={28} />}
            </button>
            
            <button 
              className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-[#efebe9] to-[#d7ccc8] shadow-[0_4px_0_#a1887f,0_6px_10px_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_#a1887f] active:translate-y-1 opacity-60 cursor-not-allowed transition-all flex items-center justify-center border border-[#fff]"
            >
               <Music4 className="text-[#5d4037]" size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};