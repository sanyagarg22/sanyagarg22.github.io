"use client";

import { Tool } from "./types";
import { useState, useRef, useEffect } from "react";

interface RibbonProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClearStart: () => void;
}

const PRESET_COLORS = [
  "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc", "#a349a4",
  "#ffffff", "#c3c3c3", "#b97a57", "#ffaec9", "#ffc90e", "#efe4b0", "#b5e61d", "#99d9ea", "#7092be", "#c8bfe7",
];


export function Ribbon({
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  primaryColor,
  secondaryColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onSave,
  onUndo,
  onRedo,
  activeTab,
  onTabChange,
  onClearStart,
}: RibbonProps) {
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const sizeButtonRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Close slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sliderRef.current && 
        !sliderRef.current.contains(event.target as Node) &&
        sizeButtonRef.current &&
        !sizeButtonRef.current.contains(event.target as Node)
      ) {
        setShowSizeSlider(false);
      }
    };

    if (showSizeSlider) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSizeSlider]);

  const ToolButton = ({ 
    tool, 
    icon, 
    label,
    size = "small"
  }: { 
    tool: Tool; 
    icon: React.ReactNode; 
    label: string;
    size?: "small" | "large";
  }) => (
    <button
      onClick={() => onToolChange(tool)}
      className={`flex flex-col items-center justify-center rounded-sm
        ${size === "large" ? "w-12 h-14 px-1" : "w-7 h-7"}
        ${activeTool === tool
          ? "bg-[#c4daf3] border border-[#7eb4ea]"
          : "hover:bg-[#e5e5e5] border border-transparent"
        }`}
      title={label}
    >
      <span className={size === "large" ? "text-xl" : "text-sm"}>{icon}</span>
      {size === "large" && <span className="text-[9px] mt-0.5">{label}</span>}
    </button>
  );

  const GroupLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[10px] text-gray-500 text-center mt-auto border-t border-[#e0e0e0] pt-0.5 w-full">
      {children}
    </div>
  );

  const GroupDivider = () => (
    <div className="w-px h-16 bg-[#d0d0d0] mx-1" />
  );

  return (
    <div className="bg-[#f5f6f7] border-b border-[#d0d0d0]">
      <div className="flex items-end bg-[#dce8f5] border-b-2 border-[#b8d0ec] px-4 pt-3">
        <div className="flex items-end gap-4">
          <button 
            onClick={() => onTabChange("Home")}
            className="px-4 py-2 text-md font-semibold text-[#948ab8] rounded-t transition-colors flex items-center gap-2 mb-0"
          >
            <img
              src="/sg2.png"
              alt="hello doodle"
              className="w-10 h-6 object-cover"
            />
          </button>
          
          <nav className="flex items-end gap-0.5">
            <button
              onClick={() => onTabChange("Home")}
              className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all relative ${
                activeTab === "Home"
                  ? "bg-[#f5f6f7] text-[#2b579a] border-x border-t border-[#d0d0d0] -mb-px z-10 shadow-sm"
                  : "text-gray-700 hover:bg-[#c4daf3] hover:text-[#2b579a] bg-[#dce8f5]"
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onTabChange("About Me")}
              className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all relative ${
                activeTab === "About Me"
                  ? "bg-[#f5f6f7] text-[#2b579a] border-x border-t border-[#d0d0d0] -mb-px z-10 shadow-sm"
                  : "text-gray-700 hover:bg-[#c4daf3] hover:text-[#2b579a] bg-[#dce8f5]"
              }`}
            >
              About
            </button>
            <button 
              onClick={() => onTabChange("Projects")}
              className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all relative ${
                activeTab === "Projects"
                  ? "bg-[#f5f6f7] text-[#2b579a] border-x border-t border-[#d0d0d0] -mb-px z-10 shadow-sm"
                  : "text-gray-700 hover:bg-[#c4daf3] hover:text-[#2b579a] bg-[#dce8f5]"
              }`}
            >
              Projects
            </button>
            <button 
              onClick={() => onTabChange("Free Paint")}
              className={`px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all relative ${
                activeTab === "Free Paint"
                  ? "bg-[#f5f6f7] text-[#2b579a] border-x border-t border-[#d0d0d0] -mb-px z-10 shadow-sm"
                  : "text-gray-700 hover:bg-[#c4daf3] hover:text-[#2b579a] bg-[#dce8f5]"
              }`}
            >
              Canvas
            </button>
          </nav>
        </div>
        <div className="flex items-center ml-auto">
        </div>
      </div>

      {/* Canvas Controls */}
      {activeTab !== "Projects" && activeTab !== "About Me" && (
      <div className="flex items-stretch px-2 py-1 h-[90px]">
        {/* Clipboard Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex items-start gap-0.5 flex-1">
            <button className="flex flex-col items-center justify-center w-11 h-14 hover:bg-[#e5e5e5] rounded-sm border border-transparent">
              <span className="text-2xl">📋</span>
              <span className="text-[9px]">Paste</span>
              <span className="text-[8px]">▼</span>
            </button>
            <div className="flex flex-col gap-0.5">
              <button className="flex items-center gap-1 px-1 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]">
                ✂️ Cut
              </button>
              <button className="flex items-center gap-1 px-1 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]">
                📄 Copy
              </button>
            </div>
          </div>
          <GroupLabel>Clipboard</GroupLabel>
        </div>

        <GroupDivider />

        {/* Edit Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-col items-center gap-1 flex-1 justify-center">
            <button
              onClick={onSave}
              className="flex flex-col items-center justify-center w-11 h-10 hover:bg-[#e5e5e5] rounded-sm border border-transparent"
              title="Save (Ctrl+S)"
            >
              <span className="text-xl">💾</span>
            </button>
            <div className="flex gap-0.5">
              <button
                onClick={onUndo}
                className="flex items-center justify-center w-8 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]"
                title="Undo (Ctrl+Z)"
              >
                ↩
              </button>
              <button
                onClick={onRedo}
                className="flex items-center justify-center w-8 h-5 hover:bg-[#e5e5e5] rounded-sm text-[10px]"
                title="Redo (Ctrl+Y)"
              >
                ↪
              </button>
            </div>
          </div>
          <GroupLabel>Edit</GroupLabel>
        </div>

        <GroupDivider />

      
        {/* Tools Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex flex-wrap gap-0.5 w-24 flex-1 content-start">
            <ToolButton tool="pencil" icon="✏️" label="Pencil" />
            <ToolButton tool="fill" icon="🪣" label="Fill" />
            <ToolButton tool="text" icon={<span className="font-serif font-bold text-base">A</span>} label="Text" />
            <ToolButton tool="eraser" icon="🧽" label="Eraser" />
            <ToolButton tool="picker" icon="💧" label="Color picker" />
            <ToolButton tool="magnifier" icon="🔍" label="Magnifier" />
          </div>
          <div className="flex items-center gap-0.5 mb-0.5">
            {/* <button
              onClick={() => onToolChange("brush")}
              className={`flex flex-col items-center justify-center w-12 h-9 rounded-sm
                ${activeTool === "brush"
                  ? "bg-[#fce4b0] border border-[#e5c47b]"
                  : "hover:bg-[#e5e5e5] border border-transparent"
                }`}
            >
              <BrushIcon className="w-5 h-5" />
              <span className="text-[8px]">Brushes ▼</span>
            </button> */}
          </div>
          <GroupLabel>Tools</GroupLabel>
        </div>

        <GroupDivider />

        {/* Shapes Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex gap-1 flex-1">
            <div className="grid grid-cols-4 gap-0.5 content-start">
              <ToolButton tool="line" icon="╱" label="Line" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">⌒</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">⬭</button>
              <ToolButton tool="rectangle" icon="▭" label="Rectangle" />
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">△</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">▷</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">◇</button>
              <ToolButton tool="ellipse" icon="⬭" label="Ellipse" />
              {/* <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">⭐</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">💬</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-sm">❤️</button>
              <button className="w-7 h-7 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm text-[8px]">▼</button> */}
            </div>
            <div className="flex flex-col gap-0.5">
              <button className="flex items-center gap-1 px-1 h-6 hover:bg-[#e5e5e5] rounded-sm text-[10px] border border-gray-300">
                ○ Outline ▼
              </button>
              <button className="flex items-center gap-1 px-1 h-6 hover:bg-[#e5e5e5] rounded-sm text-[10px] border border-gray-300">
                ▣ Fill ▼
              </button>
            </div>
          </div>
          <GroupLabel>Shapes</GroupLabel>
        </div>

        <GroupDivider />

        {/* Size Group */}
        <div className="flex flex-col items-center h-full" ref={sizeButtonRef}>
          <div className="flex flex-col items-center gap-1 flex-1 pt-1 relative">
            <button 
              onClick={() => setShowSizeSlider(!showSizeSlider)}
              className={`w-14 h-10 flex flex-col items-center justify-center rounded-sm border transition-colors
                ${showSizeSlider 
                  ? "bg-[#c4daf3] border-[#7eb4ea]" 
                  : "hover:bg-[#e5e5e5] border-gray-300"
                }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-10 h-[1px] bg-black"></div>
                <div className="w-10 h-[2px] bg-black"></div>
                <div className="w-10 h-[3px] bg-black"></div>
                <div className="w-10 h-[4px] bg-black"></div>
              </div>
            </button>
            <span className="text-[9px] text-gray-600">{brushSize}px</span>
            
            {/* Size Slider Popup */}
            {showSizeSlider && (
              <div 
                ref={sliderRef}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border-2 border-[#b8d0ec] rounded shadow-lg p-3 z-50 w-48"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Brush Size</span>
                    <span className="text-xs font-bold text-[#2b579a]">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #2b579a 0%, #2b579a ${(brushSize / 50) * 100}%, #e5e5e5 ${(brushSize / 50) * 100}%, #e5e5e5 100%)`
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>1px</span>
                    <span>50px</span>
                  </div>
                  {/* Quick size presets */}
                  <div className="flex gap-1 justify-center pt-1 border-t border-gray-200">
                    {[1, 3, 5, 8, 12, 16].map((size) => (
                      <button
                        key={size}
                        onClick={() => onBrushSizeChange(size)}
                        className={`w-8 h-8 flex items-center justify-center rounded border transition-all
                          ${brushSize === size 
                            ? "bg-[#c4daf3] border-[#7eb4ea]" 
                            : "bg-white border-gray-300 hover:bg-[#e5e5e5]"
                          }`}
                        title={`${size}px`}
                      >
                        <div 
                          className="rounded-full bg-black"
                          style={{ 
                            width: `${Math.min(size * 2, 20)}px`, 
                            height: `${Math.min(size * 2, 20)}px` 
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <GroupLabel>Size</GroupLabel>
        </div>

        <GroupDivider />

        {/* Colors Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex items-start gap-2 flex-1 pt-1">
            {/* Color 1 & 2 */}
            <div className="flex gap-1">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 border-2 border-gray-400 cursor-pointer shadow-inner"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "color";
                    input.value = primaryColor;
                    input.onchange = (e) => onPrimaryColorChange((e.target as HTMLInputElement).value);
                    input.click();
                  }}
                  title="Color 1"
                />
                <span className="text-[9px] text-gray-600 mt-0.5">Color</span>
                <span className="text-[9px] text-gray-600">1</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 border-2 border-gray-400 cursor-pointer shadow-inner"
                  style={{ backgroundColor: secondaryColor }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "color";
                    input.value = secondaryColor;
                    input.onchange = (e) => onSecondaryColorChange((e.target as HTMLInputElement).value);
                    input.click();
                  }}
                  title="Color 2"
                />
                <span className="text-[9px] text-gray-600 mt-0.5">Color</span>
                <span className="text-[9px] text-gray-600">2</span>
              </div>
            </div>

            {/* Color Palette */}
            <div className="grid grid-cols-10 gap-[1px]">
              {PRESET_COLORS.map((color, index) => (
                <button
                  key={index}
                  className="w-4 h-4 border border-gray-400 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => onPrimaryColorChange(color)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onSecondaryColorChange(color);
                  }}
                  title={color}
                />
              ))}
            </div>

            {/* Edit Colors */}
            <div className="flex flex-col items-center">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm border border-gray-300">
                <span className="text-lg">🎨</span>
              </button>
              <span className="text-[8px] text-gray-600 mt-0.5">Edit</span>
              <span className="text-[8px] text-gray-600">colors</span>
            </div>
          </div>
          <GroupLabel>Colors</GroupLabel>
        </div>

        <GroupDivider />

        <div className="flex flex-col items-center h-full">
          <div className="flex items-start gap-0.5 flex-1">
            <button
              onClick={onClearStart}
              className="flex flex-col items-center justify-center w-11 h-14 hover:bg-[#e5e5e5] rounded-sm border border-transparent"
              title="Clear Canvas"
            >
              <span className="text-xl">🗑️</span>
              <span className="text-[9px]">Clear</span>
            </button>
          </div>
          <GroupLabel>Canvas</GroupLabel>
        </div>
      </div>
      )}
    </div>
  );
}

