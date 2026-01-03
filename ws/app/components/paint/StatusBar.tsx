"use client";

interface StatusBarProps {
  canvasWidth: number;
  canvasHeight: number;
  cursorPosition?: { x: number; y: number };
  zoom: number;
  onZoomChange?: (zoom: number) => void;
}

export function StatusBar({ 
  canvasWidth, 
  canvasHeight, 
  cursorPosition, 
  zoom,
  onZoomChange 
}: StatusBarProps) {
  return (
    <div className="flex items-center justify-between h-6 px-1 bg-[#f0f0f0] border-t border-[#d0d0d0] text-[11px] text-gray-600">
      {/* Left side - cursor position and selection */}
      <div className="flex items-center gap-3">
        {cursorPosition && (
          <div className="flex items-center gap-1">
            <span className="text-gray-400">+</span>
            <span>{cursorPosition.x}, {cursorPosition.y}px</span>
          </div>
        )}
      </div>

      {/* Center - copyright */}
      <div className="flex-1 text-center">
        <span className="text-gray-500">© sanya garg 2026</span>
      </div>

      {/* Right side - canvas size and zoom */}
      <div className="flex items-center gap-2">
        {/* Canvas size */}
        <div className="flex items-center gap-1 px-2 border-l border-r border-gray-300">
          <span className="text-gray-400">📐</span>
          <span>{canvasWidth} × {canvasHeight}px</span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onZoomChange?.(Math.max(10, zoom - 10))}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded text-gray-500"
          >
            −
          </button>
          
          <input
            type="range"
            min="10"
            max="500"
            value={zoom}
            onChange={(e) => onZoomChange?.(Number(e.target.value))}
            className="w-20 h-1 accent-gray-400"
          />
          
          <button 
            onClick={() => onZoomChange?.(Math.min(500, zoom + 10))}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded text-gray-500"
          >
            +
          </button>

          <span className="w-10 text-right">{zoom}%</span>
        </div>
      </div>
    </div>
  );
}
