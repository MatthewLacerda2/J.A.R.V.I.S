import YouTube from "react-youtube";
import { MediaItem as MediaItemType } from "../../types/media";
import { extractYouTubeVideoId } from "../../utils/youtubeUtils";

interface YouTubeItemProps {
  item: MediaItemType;
}

export function YouTubeItem({ item }: YouTubeItemProps) {
  const videoId = extractYouTubeVideoId(item.url);

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white rounded">
        Invalid YouTube URL
      </div>
    );
  }

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
    },
  };

  return (
    <div className="w-full h-full rounded overflow-hidden">
      <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
    </div>
  );
}
