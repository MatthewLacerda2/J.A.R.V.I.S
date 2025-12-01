# Project Architecture Design

## Overview
A drag-and-drop media file webapp that allows users to upload, position, resize, and manage media files (mp4, mp3, jpg, png, txt) on a canvas with a sidebar for file management. Future features include a drawing tool (Instagram stories-style) and an AI chatbot assistant with tool calling

Drawing features: change pen width and pick color
AI features:
- explaining, deleting (images and text)d
- moving, resizing (all files)
- editing (text)

---

## Project Structure

```
J.A.R.V.I.S/
├── src/
│   ├── components/
│   │   ├── ui/                    # Existing shadcn/ui components
│   │   ├── canvas/
│   │   │   ├── Canvas.tsx         # Main canvas container
│   │   │   └── CanvasDropZone.tsx # Drag-and-drop zone wrapper
│   │   ├── media-items/
│   │   │   ├── MediaItem.tsx      # Base media item component
│   │   │   ├── ImageItem.tsx      # Image file renderer
│   │   │   ├── VideoItem.tsx      # Video file renderer
│   │   │   ├── AudioItem.tsx      # Audio file renderer
│   │   │   └── TextItem.tsx       # Text file renderer (editable)
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx        # Main sidebar container
│   │   │   ├── MediaList.tsx      # List of media items
│   │   │   ├── MediaListItem.tsx  # Individual list item row
│   │   │   └── chatbot/           # AI Chatbot components (future)
│   │   │       ├── ChatbotPanel.tsx      # Main chatbot panel
│   │   │       ├── ChatMessage.tsx       # Individual message component
│   │   │       ├── ChatInput.tsx         # Message input component
│   │   │       └── ToolCallIndicator.tsx # Tool calling status indicator
│   │   ├── drawing/               # Drawing feature components (future)
│   │   │   ├── DrawingToolbar.tsx # Pen, color, thickness controls
│   │   │   ├── DrawingCanvas.tsx  # Drawing layer overlay
│   │   │   ├── DrawingStroke.tsx  # Individual stroke component
│   │   │   └── StrokeSelector.tsx # Stroke selection/deletion UI
│   │   └── resize-handle/
│   │       └── ResizeHandle.tsx   # Resize handle component
│   ├── stores/                    # Zustand state stores
│   │   ├── useMediaStore.ts       # Media items state
│   │   ├── useSelectionStore.ts   # Selection state
│   │   ├── useDrawingStore.ts     # Drawing state (future)
│   │   └── useChatbotStore.ts     # Chatbot state (future)
│   ├── hooks/
│   │   ├── use-mobile.ts          # Existing hook
│   │   ├── useDragAndDrop.ts      # File drag-and-drop logic
│   │   ├── useItemDrag.ts         # Dragging items on canvas
│   │   ├── useItemResize.ts       # Resizing items on canvas
│   │   ├── useItemSelection.ts    # Selection and keyboard shortcuts
│   │   ├── useFileReader.ts       # Reading file contents
│   │   ├── useDrawing.ts          # Drawing functionality (future)
│   │   └── useChatbot.ts          # Chatbot integration (future)
│   ├── utils/
│   │   ├── utils.ts               # Existing utility functions
│   │   ├── fileUtils.ts           # File type detection, validation
│   │   ├── mediaUtils.ts          # Media-specific utilities
│   │   ├── positionUtils.ts       # Position calculations, bounds checking
│   │   ├── resizeUtils.ts         # Resize calculations, aspect ratio
│   │   ├── drawingUtils.ts        # Drawing calculations, path smoothing (future)
│   │   └── chatbotUtils.ts        # Chatbot helpers, tool calling (future)
│   ├── types/
│   │   ├── media.ts               # Media item types and interfaces
│   │   ├── drawing.ts             # Drawing types (future)
│   │   └── chatbot.ts             # Chatbot types (future)
│   ├── constants/
│   │   ├── mediaTypes.ts          # File type constants, MIME types
│   │   ├── drawing.ts             # Drawing constants (colors, sizes) (future)
│   │   └── chatbot.ts             # Chatbot constants (future)
│   ├── services/                  # External service integrations (future)
│   │   └── chatbotService.ts      # AI chatbot API integration
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # App styles
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── public/
└── ... (config files)
```
