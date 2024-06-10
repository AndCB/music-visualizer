import { useAudioVisualizer } from "@/contexts/PlaylistContext";

export const AudioCanvas = () => {
  useAudioVisualizer();

  return (
    <div className="flex justify-center items-center h-3/6 w-11/12 self-center">
      <canvas
        id="audioVisualizerCanvas"
        width={800}
        height={400}
        className="w-full h-full"
      />
    </div>
  );
};
