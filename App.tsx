import React, { useState, useRef, useEffect } from 'react';
import { CassetteTape } from './components/CassetteTape';
import { MusicPlayer } from './components/MusicPlayer';
import { DandelionOverlay } from './components/DandelionOverlay';
import { MemoryOverlay } from './components/MemoryOverlay';
import { TapeData } from './types';
import { Image as ImageIcon, StickyNote, X, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [tapes, setTapes] = useState<TapeData[]>([
    { id: 1, color: 'amber', title: 'Summer Breeze', artist: 'Unknown', audioUrl: null, fileName: null },
    { id: 2, color: 'olive', title: 'Acoustic Soul', artist: 'Anonymous', audioUrl: null, fileName: null },
    { id: 3, color: 'burgundy', title: 'Late Night', artist: 'The Band', audioUrl: null, fileName: null },
  ]);

  const [currentTapeId, setCurrentTapeId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Memory State
  const [memoryImages, setMemoryImages] = useState<string[]>([]);
  const [memoryTexts, setMemoryTexts] = useState<string[]>([]);
  
  // Text Input Modal State
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleUpload = (tapeId: number, file: File) => {
    const url = URL.createObjectURL(file);
    setTapes(prev => prev.map(t => 
      t.id === tapeId 
        ? { ...t, audioUrl: url, fileName: file.name, title: file.name.replace(/\.[^/.]+$/, ""), artist: 'Unknown Artist' } 
        : t
    ));
    if (currentTapeId === tapeId) {
      handleStop();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 20); // Limit to 20
      const newImages = files.map(file => URL.createObjectURL(file as File));
      setMemoryImages(prev => [...prev, ...newImages].slice(0, 20));
    }
  };

  const handleAddNote = () => {
    if (currentNote.trim()) {
      setMemoryTexts(prev => [...prev, currentNote.substring(0, 100)]); // Limit char count
      setCurrentNote("");
      setIsNoteModalOpen(false);
    }
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleUpdateMeta = (tapeId: number, title: string, artist: string) => {
    setTapes(prev => prev.map(t => 
      t.id === tapeId ? { ...t, title, artist } : t
    ));
  };

  const handleClearTape = (tapeId: number) => {
    if (currentTapeId === tapeId) {
        handleStop();
        setCurrentTapeId(null);
    }
    setTapes(prev => prev.map(t => 
        t.id === tapeId ? { ...t, audioUrl: null, fileName: null, title: 'Empty Tape', artist: '' } : t
    ));
  }

  const handleSelectTape = (id: number) => {
    if (currentTapeId === id) return; 

    const tape = tapes.find(t => t.id === id);
    if (!tape?.audioUrl) return; 

    handleStop();
    setCurrentTapeId(id);
    
    audioRef.current.src = tape.audioUrl;
    audioRef.current.load();
  };

  const handlePlayPause = () => {
    if (!currentTapeId) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const currentTape = tapes.find(t => t.id === currentTapeId) || null;

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans selection:bg-[#8d6e63] selection:text-[#ece0d1]">
      
      {/* Interactive Falling Dandelions (When Playing) */}
      <DandelionOverlay active={isPlaying} />

      {/* Memory Images & Text Overlay (When Playing) - Now on Top */}
      <MemoryOverlay images={memoryImages} texts={memoryTexts} active={isPlaying} />

      {/* Note Input Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-[#fdfbf7] p-6 max-w-sm w-full shadow-[0_10px_25px_rgba(0,0,0,0.1)] relative transform rotate-1 border border-[#d7ccc8]">
            {/* Paper Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
            
            <button 
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute top-2 right-2 text-[#8d6e63] hover:text-[#5d4037]"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-[#5d4037] font-['Gaegu'] font-bold text-2xl mb-4 text-center">Jot Down a Memory</h3>
            
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="What are you thinking about? (Max 100 chars)"
              maxLength={100}
              className="w-full h-32 bg-[#efebe9] border border-[#d7ccc8] p-3 font-['Courier_Prime'] text-[#4e342e] text-sm resize-none focus:outline-none focus:border-[#a1887f] mb-4 placeholder-[#a1887f]/50"
            />
            
            <button
              onClick={handleAddNote}
              className="w-full bg-[#8d6e63] text-[#ece0d1] py-2 font-mono text-sm tracking-widest hover:bg-[#6d4c41] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> ADD NOTE
            </button>
          </div>
        </div>
      )}

      <div className="z-10 w-full min-h-screen flex flex-col items-center justify-start md:justify-center p-4 gap-6 md:gap-8 pt-8 md:pt-4">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-2 relative shrink-0 group cursor-default">
          <h1 className="text-4xl md:text-7xl font-['Pinyon_Script'] text-[#4e342e] drop-shadow-sm pr-4 relative z-10 transition-transform duration-700 group-hover:scale-[1.02]" style={{ filter: 'url(#pencil-texture)' }}>
             Beomesdio·🧸
          </h1>
          <p className="text-[#795548] font-mono text-[10px] tracking-[0.4em] uppercase opacity-70 border-t border-b border-[#a1887f] py-1.5 mx-auto w-fit transition-all duration-700 group-hover:tracking-[0.6em]">
            This is My Answer
          </p>
        </div>

        {/* Player Unit */}
        <div className="w-full shrink-0 flex justify-center">
          <MusicPlayer 
            currentTape={currentTape}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onStop={handleStop}
            currentTime={currentTime}
            duration={duration}
          />
        </div>

        {/* Tapes Collection - Flex Column on Mobile, Row on Desktop */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row flex-nowrap justify-center items-center gap-4 md:gap-6 mt-2 perspective-1000 shrink-0 px-2 pb-8">
          {tapes.map(tape => (
            <div key={tape.id} className="w-full max-w-[320px] transition-transform hover:scale-105 hover:-translate-y-2 origin-center md:origin-bottom duration-300">
              <CassetteTape
                tape={tape}
                isActive={currentTapeId === tape.id}
                onUpload={(file) => handleUpload(tape.id, file)}
                onUpdateMeta={(title, artist) => handleUpdateMeta(tape.id, title, artist)}
                onSelect={() => handleSelectTape(tape.id)}
                onClear={() => handleClearTape(tape.id)}
              />
            </div>
          ))}
        </div>

        {/* Memory Upload Section */}
        <div className="flex flex-col items-center gap-3 shrink-0 z-20 pb-8">
          <input 
            type="file" 
            ref={imageInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            multiple 
            className="hidden" 
          />
          
          <div className="flex gap-4">
            <button 
              onClick={triggerImageUpload}
              className="group relative flex items-center justify-center gap-2 px-5 py-2 bg-[#d7ccc8] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_6px_rgba(0,0,0,0.1)] text-[#5d4037] font-mono text-xs hover:bg-[#bcaaa4] transition-all active:scale-95 border border-[#a1887f]/30"
              title="Upload Photos"
            >
              <ImageIcon size={14} className="opacity-70 group-hover:scale-110 transition-transform"/>
              <span className="tracking-widest font-bold">PHOTOS {memoryImages.length > 0 && `(${memoryImages.length})`}</span>
            </button>

            <button 
              onClick={() => setIsNoteModalOpen(true)}
              className="group relative flex items-center justify-center gap-2 px-5 py-2 bg-[#d7ccc8] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_6px_rgba(0,0,0,0.1)] text-[#5d4037] font-mono text-xs hover:bg-[#bcaaa4] transition-all active:scale-95 border border-[#a1887f]/30"
              title="Write a Note"
            >
              <StickyNote size={14} className="opacity-70 group-hover:scale-110 transition-transform"/>
              <span className="tracking-widest font-bold">WRITE NOTE {memoryTexts.length > 0 && `(${memoryTexts.length})`}</span>
            </button>
          </div>
          
          <div className="text-[#8d6e63] text-[10px] font-['Courier_Prime'] opacity-60 mt-1 text-center tracking-wide shrink-0 mix-blend-multiply">
             CLICK TAPE TO LOAD • CLICK DECK TO PLAY
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;