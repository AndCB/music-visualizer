import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface PlaylistContextProps {
  play: () => void;
  pause: () => void;
  audioContext: AudioContext | null;
  analyzer: AnalyserNode | null;
  dataArray: Uint8Array | null;
  bufferLength: number | null;
}

const defaultValue: PlaylistContextProps = {
  play: () => {},
  pause: () => {},
  audioContext: null,
  analyzer: null,
  dataArray: null,
  bufferLength: null,
};

const PlaylistContext = createContext<PlaylistContextProps>(defaultValue);

interface AudioProviderProps {
  audioFile: string;
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
  audioFile,
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const bufferLengthRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const setupAudioContext = async () => {
      const AudioContextClass = (window.AudioContext ||
        (window as any).webkitAudioContext) as typeof AudioContext;
      const context = new AudioContextClass();
      setAudioContext(context);

      const audio = new Audio(audioFile);
      audioRef.current = audio;

      const source = context.createMediaElementSource(audio);

      const analyzer = context.createAnalyser();
      analyzer.fftSize = 256;
      bufferLengthRef.current = analyzer.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLengthRef.current);
      analyzerRef.current = analyzer;

      source.connect(analyzer);
      analyzer.connect(context.destination);
    };

    setupAudioContext();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioFile]);

  const contextValue: PlaylistContextProps = {
    play,
    pause,
    audioContext,
    analyzer: analyzerRef.current,
    dataArray: dataArrayRef.current,
    bufferLength: bufferLengthRef.current,
  };

  return (
    <PlaylistContext.Provider value={contextValue}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const useAudio = (): PlaylistContextProps => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const useAudioVisualizer = () => {
  const { analyzer, dataArray, bufferLength, audioContext } = useAudio();
  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node !== null && audioContext) {
        const canvasCtx = node.getContext("2d");
        if (!canvasCtx) return;

        const draw = () => {
          requestAnimationFrame(draw);

          if (analyzer && dataArray) {
            analyzer.getByteFrequencyData(dataArray);

            const width = node.width;
            const height = node.height;

            canvasCtx.clearRect(0, 0, width, height);

            const barWidth = (width / bufferLength!) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength!; i++) {
              barHeight = dataArray[i];
              canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
              canvasCtx.fillRect(
                x,
                height - barHeight / 2,
                barWidth,
                barHeight / 2
              );

              x += barWidth + 1;
            }
          }
        };

        draw();
      }
    },
    [analyzer, dataArray, bufferLength, audioContext]
  );

  return canvasRef;
};
