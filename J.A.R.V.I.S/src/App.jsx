import { useMediaStore } from './stores/useMediaStore';
import { useFileReader } from './hooks/useFileReader';
import { useItemSelection } from './hooks/useItemSelection';
import { getFileType } from './utils/fileUtils';
import { getMediaDimensions, loadImageDimensions, loadVideoDimensions } from './utils/mediaUtils';
import { CanvasDropZone } from './components/canvas/CanvasDropZone';
import { Canvas } from './components/canvas/Canvas';
import './App.css';

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
        if (fileType === 'image') {
          try {
            dimensions = await loadImageDimensions(url);
            aspectRatio = dimensions.width / dimensions.height;
            // Scale down if too large
            const maxSize = 600;
            if (dimensions.width > maxSize || dimensions.height > maxSize) {
              const scale = Math.min(maxSize / dimensions.width, maxSize / dimensions.height);
              dimensions = {
                width: dimensions.width * scale,
                height: dimensions.height * scale,
              };
            }
          } catch (err) {
            console.error('Failed to load image dimensions:', err);
          }
        } else if (fileType === 'video') {
          try {
            dimensions = await loadVideoDimensions(url);
            aspectRatio = dimensions.width / dimensions.height;
            // Scale down if too large
            const maxSize = 600;
            if (dimensions.width > maxSize || dimensions.height > maxSize) {
              const scale = Math.min(maxSize / dimensions.width, maxSize / dimensions.height);
              dimensions = {
                width: dimensions.width * scale,
                height: dimensions.height * scale,
              };
            }
          } catch (err) {
            console.error('Failed to load video dimensions:', err);
          }
        } else if (fileType === 'audio') {
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
          content: content || '',
          file,
        });
      } catch (err) {
        console.error('Failed to process file:', file.name, err);
      }
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden" id="app">
      <CanvasDropZone onFilesDropped={handleFilesDropped}>
        <Canvas />
      </CanvasDropZone>
    </div>
  );
}

export default App;
