import { useAudioVisualizer } from "@/contexts/PlaylistContext";

export const AudioCanvas = () => {
  useAudioVisualizer();

  return (
    <div className="flex justify-center items-center h-4/6 w-11/12 self-center">
      <canvas
        id="audioVisualizerCanvas"
        width={1000}
        height={500}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
