import { useTheme } from "next-themes";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface Track {
  // id: number;
  name: string;
  artist: string;
  album: string;
  cover?: string;
  formattedDuration: string;
  duration: number;
  url: string;
}

interface PlaylistContextType {
  playlist: Track[];
  currentTrackId: number | null;
  isPlaying: boolean;
  volume: number;
  audioContext: AudioContext | null;
  analyzer: AnalyserNode | null;
  dataArray: Uint8Array | null;
  bufferLength: number | null;
  audioRef: HTMLAudioElement | null;
  toggleIsPlaying: () => void;
  addTrack: (track: Omit<Track, "id">) => void;
  removeTrack: (trackId: number) => void;
  clearPlaylist: () => void;
  playTrack: (trackId: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  changeVolume: (value: number) => void;
  toggleMute: () => void;
  updateTime: (value: number) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const usePlaylist = (): PlaylistContextType => {
  const context = useContext(PlaylistContext);
  if (!context)
    throw new Error("usePlaylist must be used within a PlaylistProvider");

  return context;
};

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);
  const [updateSrc, setUpdateSrc] = useState(true);
  // const idCounter = useRef<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferLengthRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const analizerRef = useRef<AnalyserNode | null>(null);
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();

    if (audioRef.current) {
      const source = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );

      const analizer = audioContextRef.current.createAnalyser();
      analizer.fftSize = 32;
      bufferLengthRef.current = analizer.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(analizer.frequencyBinCount);
      analizerRef.current = analizer;

      const gainNode = audioContextRef.current.createGain();
      gainRef.current = gainNode;
      source
        .connect(gainRef.current)
        .connect(analizerRef.current)
        .connect(audioContextRef.current.destination);
    }

    audioRef.current?.addEventListener(
      "ended",
      () => {
        playNext();
      },
      false
    );

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = isMute ? 0 : volume;
  }, [isMute, volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (currentTrackId !== null && playlist.length > 0) {
        if (updateSrc) {
          audioRef.current.src = playlist[currentTrackId].url;
          setUpdateSrc(false);
        }
        isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
      } else {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    }
    // if (!audioRef.current || currentTrackId === null || playlist.length < 0)
    //   return;
    // audioRef.current.src = playlist[currentTrackId].url;
    // isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
  }, [currentTrackId, updateSrc]);

  useEffect(() => {
    if (!audioRef.current || currentTrackId === null) return;
    audioRef.current.src = playlist[currentTrackId].url;
    isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current?.play() : audioRef.current?.pause();
  }, [isPlaying]);

  const addTrack = (track: Track) => {
    // const newTrack: Track = { ...track, id: idCounter.current };
    // const newTrack: Track = track;
    // idCounter.current++;
    setPlaylist((prevPlaylist) => {
      const newPlaylist = [...prevPlaylist, track];
      if (prevPlaylist.length === 0) playTrack(0);
      return newPlaylist;
    });
    // console.log(currentTrackId);
    // if (currentTrackId == -1) setCurrentTrackId(0);
  };

  const removeTrack = (trackId: number) => {
    // if (currentTrackId === trackId) toggleIsPlaying();
    // setPlaylist(playlist.filter((track) => track.id !== trackId));
    if (currentTrackId === null) return;
    setPlaylist((prevPlaylist) => {
      const newPlaylist = [...prevPlaylist];
      newPlaylist.splice(trackId, 1);
      if (newPlaylist.length === 0) {
        setCurrentTrackId(null); // Set to null if the playlist is empty
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
          setIsPlaying(true);
        }
      } else if (trackId === currentTrackId) {
        // console.log("jump to next");
        setCurrentTrackId(
          (prevIndex) => (prevIndex! + newPlaylist.length) % newPlaylist.length
        ); // Adjust current song index if a preceding song is removed
        setUpdateSrc(true);
      } else if (trackId < currentTrackId) {
        setCurrentTrackId(
          (prevIndex) =>
            (prevIndex! + newPlaylist.length - 1) % newPlaylist.length
        ); // Adjust current song index if a preceding song is removed
      }
      return newPlaylist;
    });
  };

  const clearPlaylist = () => {
    setPlaylist([]);
  };

  const toggleIsPlaying = () => {
    if (currentTrackId === null) return;
    setIsPlaying((state) => !state);
  };

  const playTrack = (trackId: number) => {
    // console.log(trackId);
    setCurrentTrackId(trackId);
    setUpdateSrc(true);
    if (!isPlaying) setIsPlaying(true);
    // const trackToPlay = playlist.find((track) => track.id === trackId);
    // if (trackToPlay) audioRef.current?.play();
  };

  const playNext = () => {
    // const currentIndex = playlist.findIndex((t) => t.id === currentTrackId);
    // const nextIndex = (currentIndex + 1) % playlist.length;
    // setCurrentTrackId(nextIndex);
    if (playlist.length > 0 && currentTrackId !== null) {
      setCurrentTrackId((prevIndex) => (prevIndex! + 1) % playlist.length);
      setUpdateSrc(true);
    }
  };

  const playPrevious = () => {
    // const currentIndex = playlist.findIndex((t) => t.id === currentTrackId);
    // let previousIndex = (currentIndex - 1) % playlist.length;
    // if (previousIndex < 0) {
    //   previousIndex = playlist.length - 1;
    // }
    // setCurrentTrackId(playlist[previousIndex].id);
    if (playlist.length > 0 && currentTrackId !== null) {
      setCurrentTrackId(
        (prevIndex) => (prevIndex! + playlist.length - 1) % playlist.length
      );
      setUpdateSrc(true);
    }
  };

  const changeVolume = (value: number) => {
    if (isMute) setIsMute(false);
    // console.log(volume);
    setVolume(value);
  };

  const toggleMute = () => {
    setIsMute((prev) => !prev);
  };

  const updateTime = (value: number) => {
    if (!audioRef.current || currentTrackId === null) return;
    audioRef.current.currentTime = value;
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        currentTrackId,
        isPlaying,
        volume: isMute ? 0 : volume,
        audioContext: audioContextRef.current,
        analyzer: analizerRef.current,
        dataArray: dataArrayRef.current,
        bufferLength: bufferLengthRef.current,
        audioRef: audioRef.current,
        toggleIsPlaying,
        addTrack,
        removeTrack,
        clearPlaylist,
        playTrack,
        playNext,
        playPrevious,
        changeVolume,
        toggleMute,
        updateTime,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        id="audio-element"
        // src={playlist.find((t) => t.id == currentTrackId)?.url ?? ""}
        // src={currentTrackId !== null ? playlist[currentTrackId].url : ""}
      />
    </PlaylistContext.Provider>
  );
};

export const useAudioVisualizer = () => {
  const { analyzer, dataArray, bufferLength } = usePlaylist();
  const { theme } = useTheme();
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // console.log(audioContext);
    const canvas = document.getElementById(
      "audioVisualizerCanvas"
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const draw = () => {
      if (!analyzer || !dataArray || !bufferLength) return;

      analyzer.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      canvasCtx.clearRect(0, 0, width, height);

      const barWidth = width / 2 / bufferLength;
      let barHeight;
      let firstx = 0;
      let secondx = bufferLength * barWidth;
      canvasCtx.fillStyle = theme == "dark" ? "#1f1f32" : "#fffafa";

      for (let i = 0; i < bufferLength!; i++) {
        barHeight = Math.max(1, (dataArray[i] / 300) * height);

        canvasCtx.fillRect(
          width / 2 - firstx,
          height - barHeight,
          barWidth,
          barHeight
        );
        firstx += barWidth;
        canvasCtx.fillRect(secondx, height - barHeight, barWidth, barHeight);
        secondx += barWidth;
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [analyzer, theme]);
};
