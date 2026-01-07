import React, { useRef } from 'react';
import { TapeData } from '../types';
import { Upload, Trash2 } from 'lucide-react';

interface Props {
  tape: TapeData;
  isActive: boolean;
  onUpload: (file: File) => void;
  onUpdateMeta: (title: string, artist: string) => void;
  onSelect: () => void;
  onClear: () => void;
}

export const CassetteTape: React.FC<Props> = ({ 
  tape, 
  isActive, 
  onUpload, 
  onUpdateMeta, 
  onSelect,
  onClear
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!tape.audioUrl) {
      fileInputRef.current?.click();
    } else {
      onSelect();
    }
  };

  // Muted, retro colors
  const colorStyles = {
    amber: "bg-[#8d6e63] border-[#5d4037]",
    olive: "bg-[#795548] border-[#4e342e]",
    burgundy: "bg-[#5d4037] border-[#3e2723]"
  };

  const labelColors = {
    amber: "bg-[#ffe0b2]",
    olive: "bg-[#dcedc8]",
    burgundy: "bg-[#ffcdd2]"
  };

  return (
    <div 
      className={`
        relative w-full max-w-[320px] h-44 rounded-xl shadow-lg transition-all duration-300 transform 
        ${colorStyles[tape.color]} border-b-[6px] border-r-[6px]
        ${isActive ? '-translate-y-3 scale-105 shadow-xl ring-2 ring-[#a1887f]' : 'hover:-translate-y-1 hover:shadow-xl'}
        cursor-pointer group select-none overflow-hidden
      `}
      onClick={handleClick}
    >
      {/* Matte Texture Overlay */}
      <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay pointer-events-none"></div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="audio/mp3,audio/mpeg" 
        className="hidden" 
      />

      {/* Screws */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#d7ccc8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center"><div className="w-full h-0.5 bg-[#8d6e63] rotate-45"></div></div>
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#d7ccc8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center"><div className="w-full h-0.5 bg-[#8d6e63] rotate-45"></div></div>
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#d7ccc8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center"><div className="w-full h-0.5 bg-[#8d6e63] rotate-45"></div></div>
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#d7ccc8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center"><div className="w-full h-0.5 bg-[#8d6e63] rotate-45"></div></div>

      {/* Top Section (Reels area) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-[#3e2723] rounded flex items-center justify-center overflow-hidden border border-[#5d4037] shadow-inner">
        {/* Transparent Window */}
        <div className="w-[65%] h-full bg-[#4e342e]/80 flex justify-between items-center px-3 relative border-l border-r border-[#5d4037]">
          {/* Left Reel */}
          <div className={`w-9 h-9 rounded-full border-[3px] border-[#d7ccc8] bg-[#272727] relative ${isActive && tape.audioUrl ? 'animate-spin-slow' : ''}`}>
             <div className="absolute inset-0 m-auto w-3 h-3 bg-white/20 rounded-full"></div>
             <div className="absolute w-full h-0.5 top-1/2 -translate-y-1/2 bg-[#d7ccc8]"></div>
             <div className="absolute h-full w-0.5 left-1/2 -translate-x-1/2 bg-[#d7ccc8]"></div>
          </div>
          {/* Tape between reels */}
          <div className="flex-1 h-full mx-2 flex items-center justify-center">
             <div className="w-full h-6 bg-[#1a1a1a] rounded-sm opacity-90"></div>
          </div>
          {/* Right Reel */}
          <div className={`w-9 h-9 rounded-full border-[3px] border-[#d7ccc8] bg-[#272727] relative ${isActive && tape.audioUrl ? 'animate-spin-slow' : ''}`}>
             <div className="absolute inset-0 m-auto w-3 h-3 bg-white/20 rounded-full"></div>
             <div className="absolute w-full h-0.5 top-1/2 -translate-y-1/2 bg-[#d7ccc8]"></div>
             <div className="absolute h-full w-0.5 left-1/2 -translate-x-1/2 bg-[#d7ccc8]"></div>
          </div>
        </div>
      </div>

      {/* Label Area - Paper Texture */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-16 ${labelColors[tape.color]} rounded shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-1 flex flex-col justify-center items-center`}>
         {/* Subtle stain/texture on label */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
         
        {tape.audioUrl ? (
          <div className="w-full space-y-0.5 text-center relative z-10" onClick={(e) => e.stopPropagation()}>
            <input 
              type="text" 
              value={tape.title} 
              onChange={(e) => onUpdateMeta(e.target.value, tape.artist)}
              className={`w-full bg-transparent text-center font-['Permanent_Marker'] text-base text-[#3e2723] border-b border-dashed border-[#8d6e63]/50 focus:outline-none focus:border-[#5d4037] placeholder-[#8d6e63]/50`}
              placeholder="Track Title"
            />
            <input 
              type="text" 
              value={tape.artist} 
              onChange={(e) => onUpdateMeta(tape.title, e.target.value)}
              className={`w-full bg-transparent text-center font-['Courier_Prime'] text-[10px] font-bold text-[#5d4037] focus:outline-none placeholder-[#8d6e63]/50 tracking-wider`}
              placeholder="ARTIST"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center text-[#8d6e63]/60">
            <Upload size={20} className="mb-0.5" />
            <span className="text-[10px] font-bold font-mono tracking-wider">REC / UPLOAD</span>
          </div>
        )}
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 w-full h-3 bg-black/10 rounded-b-xl"></div>
      
      {/* Clear Button */}
      {tape.audioUrl && (
        <button 
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#efebe9] p-1 rounded-full shadow border border-[#d7ccc8] text-[#8d6e63] hover:text-[#bf360c] transition-colors z-20"
          title="Eject / Clear"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
};