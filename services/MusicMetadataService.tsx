import { Track } from "@/contexts/PlaylistContext";
import * as mmb from "music-metadata-browser";

export const getTrackData = async (file: File): Promise<Omit<Track, "id">> => {
  const metadata: mmb.IAudioMetadata = await mmb.parseBlob(file);
  const url = URL.createObjectURL(file);
  const durationInSeconds = metadata.format.duration || 0;
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  // Format duration as mm:ss
  const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    name: metadata.common.title || "Unknown Song",
    artist: metadata.common.artist || "Unknown Artist",
    album: metadata.common.album || "Unknown Album",
    cover: getAlbumCoverUrl(metadata.common.picture),
    formattedDuration: formattedDuration,
    duration: metadata.format.duration || 0,
    url: url,
  };
};

// Function to extract album cover URL from picture metadata
const getAlbumCoverUrl = (
  pictures: mmb.IPicture[] | undefined
): string | undefined => {
  if (!pictures) return undefined;
  // Find the first picture with a MIME type that indicates an image (e.g., 'image/jpeg', 'image/png')
  const picture = pictures.find(
    (p) => p.format === "image/jpeg" || p.format === "image/png"
  );
  // Return the URL of the album cover if found
  return picture
    ? URL.createObjectURL(new Blob([picture.data], { type: picture.format }))
    : undefined;
};
