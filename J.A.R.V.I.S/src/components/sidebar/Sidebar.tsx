import { MediaList } from './MediaList';

export function Sidebar() {
  return (
    <div className="w-82 h-screen bg-black border-r border-gray-800 flex flex-col">
      <div className="px-3 py-3 border-b border-gray-900">
        <h2 className="text-xl font-semibold text-white">Files</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MediaList />
      </div>
    </div>
  );
}
