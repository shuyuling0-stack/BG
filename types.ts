export interface TapeData {
  id: number;
  color: 'amber' | 'olive' | 'burgundy';
  title: string;
  artist: string;
  audioUrl: string | null;
  fileName: string | null;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTapeId: number | null;
  currentTime: number;
  duration: number;
}