import React, { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import RangeSlider from "./RangeSlider";
import styles from "../styles/AudioPlayer.module.css";
import SkipPrevious from "./svgs/SkipPrevious";
import { useTheme } from "next-themes";
import SkipNext from "./svgs/SkipNext";
import { usePlaylist } from "@/contexts/PlaylistContext";
import Volume from "./svgs/Volume";

const AudioPlayer = () => {
  const { theme } = useTheme();
  const [animate, setAnimate] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState<number>(0);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!audioRef) {
      console.log("no audio ref");
      return;
    }

    const updateCurrentTime = () => {
      const minutes = Math.floor(audioRef.currentTime / 60);
      const seconds = Math.floor(audioRef.currentTime % 60);
      setCurrentTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      setCurrentTimeInSeconds(audioRef.currentTime);
    };

    if (audioRef) audioRef.addEventListener("timeupdate", updateCurrentTime);

    return () => {
      if (audioRef)
        audioRef.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, [currentTrackId, audioRef]);

  return (
    <div className="p-4 w-screen h-2/6 flex items-center justify-center flex-col gap-6">
      <div className="flex justify-center items-center flex-col w-full flex-1">
        <div className="flex justify-between w-10/12">
          <span className="text-light dark:text-dark">{currentTime}</span>
          <span className="text-light dark:text-dark font-bold">
            {currentTrack?.name}
          </span>
          <span className="text-light dark:text-dark">
            {currentTrack?.formattedDuration ?? "0:00"}
          </span>
        </div>
        <RangeSlider
          min={0}
          max={currentTrack?.duration ?? 100}
          value={currentTimeInSeconds}
          step={1}
          className="w-10/12"
          onChange={updateTime}
        />
      </div>
      <div className="flex justify-between md:justify-evenly items-center w-[100%] flex-1">
        <div className="w-1/6"></div>
        <div className="w-3/6 md:w-2/6 flex justify-center">
          <div className="flex items-center justify-around w-60">
            <IconButton
              className="w-10 h-10"
              icon={<SkipPrevious />}
              onClick={playPrevious}
            />
            <IconButton
              icon={
                <div
                  className={`${
                    styles.audioButton
                  } max-w-16 max-h-16 min-w-10 min-h-10 h-[16vw] w-[16vw] ${
                    isPlaying ? styles.pause : styles.play
                  }
              ${theme != "dark" ? "bg-light" : "bg-dark"}
              ${animate ? styles.animate : ""}`}
                />
              }
              onClick={togglePlay}
            />
            <IconButton
              className="w-10 h-10"
              icon={<SkipNext />}
              onClick={playNext}
            />
          </div>
        </div>
        <div ref={volumeRef} className="w-1/6 flex md:justify-center gap-2 flex-col-reverse items-center h-full md:flex-row relative">
          <IconButton
            icon={<Volume value={volume} />}
            className="h-6 w-6 fill-light dark:fill-dark"
            onClick={
              window.innerWidth < 768
                ? () => setShowVolumePopup(!showVolumePopup)
                : toggleMute
            }
          />
          {/* Desktop: horizontal slider */}
          <div className="hidden md:block">
            <RangeSlider
              min={0}
              max={1}
              value={volume}
              step={0.05}
              className="max-w-60 w-full"
              onChange={changeVolume}
            />
          </div>
          {/* Mobile: volume popup with horizontal slider */}
          {showVolumePopup && (
            <div
              className="md:hidden absolute bottom-full mb-3 bg-light dark:bg-dark border border-primary-light/30 dark:border-primary-dark/30 rounded-xl p-4 shadow-xl z-50"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-full hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors"
                >
                  <Volume value={volume} />
                </button>
                <RangeSlider
                  min={0}
                  max={1}
                  value={volume}
                  step={0.05}
                  className="w-28"
                  onChange={changeVolume}
                />
                <div className="flex items-center gap-2 text-xs text-primary-light dark:text-primary-dark">
                  <span>{Math.round(volume * 100)}%</span>
                  <button
                    onClick={toggleMute}
                    className="opacity-60 hover:opacity-100 transition-opacity underline"
                  >
                    {volume === 0 ? "Unmute" : "Mute"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
