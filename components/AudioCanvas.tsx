import { useAudioVisualizer } from "@/contexts/PlaylistContext";
import React from "react";

export const AudioCanvas = () => {
  useAudioVisualizer();
  return (
    <div className="flex justify-center items-center mx-auto my-[10%]">
      <canvas
        id="audioVisualizerCanvas"
        width={800}
        height={400}
      />
    </div>
  );
};
