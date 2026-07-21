import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { usePlaylist } from "@/contexts/PlaylistContext";
import {
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";

const AudioPlayer = () => {
  const [animate, setAnimate] = useState(false);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState<number>(0);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const {
    playlist,
    isPlaying,
    toggleIsPlaying,
    currentTrackId,
    audioRef,
    playNext,
    playPrevious,
    toggleMute,
    updateTime,
    volume,
    changeVolume,
  } = usePlaylist();
  const togglePlay = () => {
    toggleIsPlaying();
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 200);
  };

  // const currentTrack = playlist.find((track) => track.id === currentTrackId);
  const currentTrack = playlist[currentTrackId!] ?? undefined;

  // Close volume popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeRef.current &&
        !volumeRef.current.contains(event.target as Node)
      ) {
        setShowVolumePopup(false);
      }
    };

    if (showVolumePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVolumePopup]);

  // Smooth progress update via requestAnimationFrame
  useEffect(() => {
    if (!audioRef || currentTrackId === null) return;

    const updateProgress = () => {
      if (audioRef) {
        setCurrentTimeInSeconds(audioRef.currentTime);
      }
      animFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animFrameRef.current)
        cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentTrackId, audioRef]);

  return (
    <div className="p-4 w-screen h-1/6 flex items-center justify-center flex-col gap-2">
      <div className="flex justify-between md:justify-evenly items-center w-[100%]">
        <div className="w-1/6"></div>
        <div className="w-3/6 md:w-2/6 flex justify-center">
          <div className="flex items-center justify-around w-60">
            <button
              onClick={playPrevious}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <SkipBack className="w-7 h-7" />
            </button>
            <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              <div
                className={`max-w-16 max-h-16 min-w-10 min-h-10 h-[16vw] w-[16vw] bg-white rounded-full flex items-center justify-center filter drop-shadow-md transition-transform duration-200 ${
                  animate ? "scale-90" : ""
                }`}
              >
                {isPlaying ? (
                  <Pause className="text-purple-700 w-1/2 h-1/2" />
                ) : (
                  <Play className="text-purple-700 w-1/2 h-1/2 ml-0.5" />
                )}
              </div>
            </button>
            <button
              onClick={playNext}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Next"
            >
              <SkipForward className="w-7 h-7" />
            </button>
          </div>
        </div>
        <div ref={volumeRef} className="w-1/6 flex md:justify-center gap-2 flex-col-reverse items-center h-full md:flex-row relative">
          <button
            onClick={
              window.innerWidth < 768
                ? () => setShowVolumePopup(!showVolumePopup)
                : toggleMute
            }
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Volume"
          >
            {volume === 0 ? (
              <VolumeX className="w-7 h-7" />
            ) : (
              <Volume2 className="w-7 h-7" />
            )}
          </button>
          {/* Desktop: volume bar */}
          <div className="hidden md:block w-24 lg:w-40">
            <ProgressBar
              current={volume}
              duration={1}
              showLabels={false}
              onSeek={changeVolume}
            />
          </div>
          {/* Mobile: volume popup with custom vertical slider */}
          {showVolumePopup && (
            <div
              className="md:hidden absolute bottom-full mb-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-xl z-50"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Custom vertical volume slider */}
                <div className="relative h-28 w-8 flex items-center justify-center">
                  {/* Track background */}
                  <div className="absolute bottom-0 w-1.5 h-full bg-white/20 rounded-full" />
                  {/* Filled portion */}
                  <div
                    className="absolute bottom-0 w-1.5 bg-white/70 rounded-full transition-all duration-75"
                    style={{ height: `${volume * 100}%` }}
                  />
                  {/* Thumb indicator */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-75"
                    style={{ bottom: `calc(${volume * 100}% - 0.5rem)` }}
                  />
                  {/* Hidden native input for interaction */}
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    style={{ writingMode: "vertical-lr", direction: "rtl" } as React.CSSProperties}
                  />
                </div>
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  {volume === 0 ? (
                    <VolumeX className="text-white" size={20} />
                  ) : (
                    <Volume2 className="text-white" size={20} />
                  )}
                </button>
                <span className="text-xs text-white/70 font-medium">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center flex-col w-full max-w-xl px-4">
        <ProgressBar
          current={currentTimeInSeconds}
          duration={currentTrack?.duration ?? 0}
          onSeek={(time) => {
            if (audioRef) {
              audioRef.currentTime = time;
              setCurrentTimeInSeconds(time);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
