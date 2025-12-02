import { Canvas } from "./components/canvas/Canvas";
import { CanvasDropZone } from "./components/canvas/CanvasDropZone";
import { Sidebar } from "./components/sidebar/Sidebar";
import { useFileReader } from "./hooks/useFileReader";
import { useItemSelection } from "./hooks/useItemSelection";
import { useMediaStore } from "./stores/useMediaStore";
import { getFileType } from "./utils/fileUtils";
import {
  getMediaDimensions,
  loadImageDimensions,
  loadVideoDimensions,
} from "./utils/mediaUtils";

function App() {
  const addItem = useMediaStore((state) => state.addItem);
  const { readFile } = useFileReader();
  useItemSelection(); // Initialize keyboard shortcuts

  const handleFilesDropped = async (files) => {
    for (const file of files) {
      try {
        const fileType = getFileType(file);
        if (!fileType) continue;

        const { url, content } = await readFile(file);
        const defaultDimensions = getMediaDimensions({ type: fileType });

        let dimensions = defaultDimensions;
        let aspectRatio;

        // Load actual dimensions for images and videos
        if (fileType === "image") {
          try {
            dimensions = await loadImageDimensions(url);
            aspectRatio = dimensions.width / dimensions.height;
            // Scale down if too large
            const maxSize = 600;
            if (dimensions.width > maxSize || dimensions.height > maxSize) {
              const scale = Math.min(
                maxSize / dimensions.width,
                maxSize / dimensions.height
              );
              dimensions = {
                width: dimensions.width * scale,
                height: dimensions.height * scale,
              };
            }
          } catch (err) {
            console.error("Failed to load image dimensions:", err);
          }
        } else if (fileType === "video") {
          try {
            dimensions = await loadVideoDimensions(url);
            aspectRatio = dimensions.width / dimensions.height;
            // Scale down if too large
            const maxSize = 600;
            if (dimensions.width > maxSize || dimensions.height > maxSize) {
              const scale = Math.min(
                maxSize / dimensions.width,
                maxSize / dimensions.height
              );
              dimensions = {
                width: dimensions.width * scale,
                height: dimensions.height * scale,
              };
            }
          } catch (err) {
            console.error("Failed to load video dimensions:", err);
          }
        } else if (fileType === "audio") {
          aspectRatio = 2; // Fixed aspect ratio for audio
        }

        // Center the item on canvas (approximate center)
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;
        const x = (canvasWidth - dimensions.width) / 2;
        const y = (canvasHeight - dimensions.height) / 2;

        addItem({
          type: fileType,
          name: file.name,
          url,
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio,
          content: content || "",
          file,
        });
      } catch (err) {
        console.error("Failed to process file:", file.name, err);
      }
    }
  };

  const handleImageUrl = async (urlString) => {
    try {
      // Check if URL is an image (jpg, jpeg, or png)
      const urlLower = urlString.toLowerCase().trim();
      const isImageUrl =
        urlLower.endsWith(".jpg") ||
        urlLower.endsWith(".jpeg") ||
        urlLower.endsWith(".png");

      if (!isImageUrl) {
        console.warn("URL is not an image (jpg/png):", urlString);
        return;
      }

      // Load image dimensions
      let dimensions;
      let aspectRatio;
      try {
        dimensions = await loadImageDimensions(urlString);
        aspectRatio = dimensions.width / dimensions.height;
        // Scale down if too large
        const maxSize = 600;
        if (dimensions.width > maxSize || dimensions.height > maxSize) {
          const scale = Math.min(
            maxSize / dimensions.width,
            maxSize / dimensions.height
          );
          dimensions = {
            width: dimensions.width * scale,
            height: dimensions.height * scale,
          };
        }
      } catch (err) {
        console.error("Failed to load image from URL:", err);
        return;
      }

      // Extract filename from URL or use default
      let filename = "image.jpg";
      try {
        const urlObj = new URL(urlString);
        const pathname = urlObj.pathname;
        filename = pathname.split("/").pop() || "image.jpg";
      } catch {
        // If URL parsing fails, try to extract filename from the string
        const urlParts = urlString.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        if (
          lastPart &&
          (lastPart.includes(".jpg") ||
            lastPart.includes(".jpeg") ||
            lastPart.includes(".png"))
        ) {
          filename = lastPart.split("?")[0]; // Remove query parameters
        }
      }

      // Center the item on canvas
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const x = (canvasWidth - dimensions.width) / 2;
      const y = (canvasHeight - dimensions.height) / 2;

      addItem({
        type: "image",
        name: filename,
        url: urlString,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio,
      });
    } catch (err) {
      console.error("Failed to process image URL:", urlString, err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <CanvasDropZone
        onFilesDropped={handleFilesDropped}
        onImageUrl={handleImageUrl}
      >
        <Canvas />
      </CanvasDropZone>
    </div>
  );
}

export default App;
