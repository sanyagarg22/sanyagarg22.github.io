"use client";

import { Tool, OutlineStyle, FillStyle } from "./types";
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
  outlineStyle: OutlineStyle;
  onOutlineStyleChange: (style: OutlineStyle) => void;
  fillStyle: FillStyle;
  onFillStyleChange: (style: FillStyle) => void;
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
  outlineStyle,
  onOutlineStyleChange,
  fillStyle,
  onFillStyleChange,
}: RibbonProps) {
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [showOutlineMenu, setShowOutlineMenu] = useState(false);
  const [showFillMenu, setShowFillMenu] = useState(false);
  const [showColorEditor, setShowColorEditor] = useState(false);
  const [editingColor, setEditingColor] = useState<'primary' | 'secondary'>('primary');
  const [tempColor, setTempColor] = useState('#000000');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const sizeButtonRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const outlineButtonRef = useRef<HTMLDivElement>(null);
  const outlineMenuRef = useRef<HTMLDivElement>(null);
  const fillButtonRef = useRef<HTMLDivElement>(null);
  const fillMenuRef = useRef<HTMLDivElement>(null);
  const colorEditorRef = useRef<HTMLDivElement>(null);

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

  // Close outline menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        outlineMenuRef.current && 
        !outlineMenuRef.current.contains(event.target as Node) &&
        outlineButtonRef.current &&
        !outlineButtonRef.current.contains(event.target as Node)
      ) {
        setShowOutlineMenu(false);
      }
    };

    if (showOutlineMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOutlineMenu]);

  // Close fill menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fillMenuRef.current && 
        !fillMenuRef.current.contains(event.target as Node) &&
        fillButtonRef.current &&
        !fillButtonRef.current.contains(event.target as Node)
      ) {
        setShowFillMenu(false);
      }
    };

    if (showFillMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFillMenu]);

  // Helper functions for color conversion
  const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const openColorEditor = (colorType: 'primary' | 'secondary') => {
    const color = colorType === 'primary' ? primaryColor : secondaryColor;
    setEditingColor(colorType);
    setTempColor(color);
    const hsl = hexToHSL(color);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setShowColorEditor(true);
  };

  const applyColor = () => {
    if (editingColor === 'primary') {
      onPrimaryColorChange(tempColor);
    } else {
      onSecondaryColorChange(tempColor);
    }
    setShowColorEditor(false);
  };

  // Update temp color when HSL changes
  useEffect(() => {
    if (showColorEditor) {
      setTempColor(hslToHex(hue, saturation, lightness));
    }
  }, [hue, saturation, lightness, showColorEditor]);

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
          <GroupLabel>Tools</GroupLabel>
        </div>

        <GroupDivider />

        {/* Shapes Group */}
        <div className="flex flex-col items-center h-full">
          <div className="flex gap-1 flex-1">
            <div className="grid grid-cols-3 gap-0.5 content-start">
              <ToolButton tool="line" icon="╱" label="Line" />
              <ToolButton tool="arc" icon="⌒" label="Arc" />
              <ToolButton tool="rectangle" icon="▭" label="Rectangle" />
              <ToolButton tool="triangle" icon="△" label="Triangle" />
              {/* <ToolButton tool="arrow" icon="▷" label="Arrow" /> */}
              <ToolButton tool="diamond" icon="◇" label="Diamond" />
              <ToolButton tool="circle" icon="⬭" label="Ellipse" />
            </div>
            <div className="flex flex-col gap-0.5">
              {/* Outline Dropdown */}
              <div className="relative" ref={outlineButtonRef}>
                <button 
                  onClick={() => setShowOutlineMenu(!showOutlineMenu)}
                  className={`flex items-center justify-between px-2 h-6 w-20 rounded-sm text-[10px] border transition-colors font-medium whitespace-nowrap
                    ${showOutlineMenu 
                      ? "bg-[#c4daf3] border-[#7eb4ea]" 
                      : "hover:bg-[#e5e5e5] border-gray-300 bg-white"
                    }`}
                  title="Outline style"
                >
                  <span>○ Outline</span>
                  <span className="text-[9px]">▼</span>
                </button>

                {/* Outline Menu Dropdown */}
                {showOutlineMenu && (
                  <div 
                    ref={outlineMenuRef}
                    className="absolute top-full left-0 mt-1 bg-white border-2 border-[#b8d0ec] rounded shadow-lg z-50 w-36"
                  >
                    <button
                      onClick={() => {
                        onOutlineStyleChange("none");
                        setShowOutlineMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-[#e5e5e5] transition-colors
                        ${outlineStyle === "none" ? "bg-[#c4daf3]" : ""}`}
                    >
                      <div className="w-8 h-1"></div>
                      <span className="font-medium">No outline</span>
                    </button>
                    <button
                      onClick={() => {
                        onOutlineStyleChange("solid");
                        setShowOutlineMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-[#e5e5e5] transition-colors
                        ${outlineStyle === "solid" ? "bg-[#c4daf3]" : ""}`}
                    >
                      <div className="w-8 h-0.5 bg-black"></div>
                      <span className="font-medium">Solid</span>
                    </button>
                    <button
                      onClick={() => {
                        onOutlineStyleChange("dashed");
                        setShowOutlineMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-[#e5e5e5] transition-colors
                        ${outlineStyle === "dashed" ? "bg-[#c4daf3]" : ""}`}
                    >
                      <div className="w-8 h-0.5 border-t-2 border-dashed border-black"></div>
                      <span className="font-medium">Dashed</span>
                    </button>
                    <button
                      onClick={() => {
                        onOutlineStyleChange("dotted");
                        setShowOutlineMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-[#e5e5e5] transition-colors
                        ${outlineStyle === "dotted" ? "bg-[#c4daf3]" : ""}`}
                    >
                      <div className="w-8 h-0.5 border-t-2 border-dotted border-black"></div>
                      <span className="font-medium">Dotted</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Fill Dropdown */}
              <div className="relative" ref={fillButtonRef}>
                <button 
                  onClick={() => setShowFillMenu(!showFillMenu)}
                  className={`flex items-center justify-between px-2 h-6 w-20 rounded-sm text-[10px] border transition-colors font-medium whitespace-nowrap
                    ${showFillMenu 
                      ? "bg-[#c4daf3] border-[#7eb4ea]" 
                      : "hover:bg-[#e5e5e5] border-gray-300 bg-white"
                    }`}
                  title="Fill style"
                >
                  <span>▣ Fill</span>
                  <span className="text-[9px]">▼</span>
                </button>

                {/* Fill Menu Dropdown */}
                {showFillMenu && (
                  <div 
                    ref={fillMenuRef}
                    className="absolute top-full left-0 mt-1 bg-white border-2 border-[#b8d0ec] rounded shadow-lg z-50 w-36"
                  >
                    <button
                      onClick={() => {
                        onFillStyleChange("none");
                        setShowFillMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-[#e5e5e5] transition-colors
                        ${fillStyle === "none" ? "bg-[#c4daf3]" : ""}`}
                    >
                      <div className="w-4 h-4 border border-black"></div>
                      <span className="font-medium">No fill</span>
                    </button>
                    <button
                      onClick={() => {
                        onFillStyleChange("solid");
                        setShowFillMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-[#e5e5e5] transition-colors
                        ${fillStyle === "solid" ? "bg-[#c4daf3]" : ""}`}
                    >
                      <div className="w-4 h-4 bg-black border border-black"></div>
                      <span className="font-medium">Solid fill</span>
                    </button>
                  </div>
                )}
              </div>
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
                  <div className="flex gap-1 justify-center pt-1 border-t border-[#d0d0d0]">
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
                  className="w-7 h-7 border-2 border-gray-400 cursor-pointer shadow-inner hover:border-[#0078d7] transition-colors"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => openColorEditor('primary')}
                  title="Color 1 - Click to edit"
                />
                <span className="text-[9px] text-gray-600 mt-0.5">Color</span>
                <span className="text-[9px] text-gray-600">1</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 border-2 border-gray-400 cursor-pointer shadow-inner hover:border-[#0078d7] transition-colors"
                  style={{ backgroundColor: secondaryColor }}
                  onClick={() => openColorEditor('secondary')}
                  title="Color 2 - Click to edit"
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
              <button 
                onClick={() => openColorEditor('primary')}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#e5e5e5] rounded-sm border border-gray-300"
                title="Edit colors"
              >
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
              <span className="text-[9px] text-gray-500">Clear</span>
            </button>
          </div>
          <GroupLabel>Canvas</GroupLabel>
        </div>
      </div>
      )}

      {/* Color Editor Popup */}
      {showColorEditor && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            ref={colorEditorRef}
            className="bg-white border-2 border-[#b8d0ec] rounded shadow-2xl w-96"
          >
            {/* Title bar */}
            <div className="bg-[#dce8f5] border-b-2 border-[#b8d0ec] px-3 py-2.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">Edit Colors</span>
              <button 
                onClick={() => setShowColorEditor(false)}
                className="hover:bg-[#c4daf3] w-6 h-6 flex items-center justify-center rounded text-lg text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 bg-[#f5f6f7]">
              {/* Color preview */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Current</div>
                  <div 
                    className="w-full h-12 border-2 border-[#d0d0d0] rounded shadow-inner"
                    style={{ backgroundColor: editingColor === 'primary' ? primaryColor : secondaryColor }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-600 mb-1">New</div>
                  <div 
                    className="w-full h-12 border-2 border-[#d0d0d0] rounded shadow-inner"
                    style={{ backgroundColor: tempColor }}
                  />
                </div>
              </div>

              {/* Color sliders */}
              <div className="space-y-3">
                {/* Hue */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">Hue</label>
                    <span className="text-xs font-bold text-[#2b579a]">{hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                    }}
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">Saturation</label>
                    <span className="text-xs font-bold text-[#2b579a]">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`
                    }}
                  />
                </div>

                {/* Lightness */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">Lightness</label>
                    <span className="text-xs font-bold text-[#2b579a]">{lightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={lightness}
                    onChange={(e) => setLightness(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`
                    }}
                  />
                </div>
              </div>

              {/* Hex input */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Hex Color</label>
                <input
                  type="text"
                  value={tempColor}
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                      setTempColor(hex);
                      if (hex.length === 7) {
                        const hsl = hexToHSL(hex);
                        setHue(hsl.h);
                        setSaturation(hsl.s);
                        setLightness(hsl.l);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-[#d0d0d0] rounded text-sm font-mono uppercase focus:border-[#7eb4ea] focus:outline-none transition-colors"
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>

              {/* Preset colors */}
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Basic Colors</div>
                <div className="grid grid-cols-10 gap-1">
                  {PRESET_COLORS.map((color, index) => (
                    <button
                      key={index}
                      className="w-6 h-6 border border-gray-400 hover:scale-110 hover:border-[#7eb4ea] transition-all rounded"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setTempColor(color);
                        const hsl = hexToHSL(color);
                        setHue(hsl.h);
                        setSaturation(hsl.s);
                        setLightness(hsl.l);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-2 border-t border-[#d0d0d0]">
                <button
                  onClick={applyColor}
                  className="px-6 py-2 bg-[#7eb4ea] hover:bg-[#6ba3d9] text-white text-sm font-semibold rounded border border-[#6ba3d9] shadow-sm transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowColorEditor(false)}
                  className="px-6 py-2 bg-white hover:bg-[#e5e5e5] text-gray-700 text-sm font-semibold rounded border-2 border-[#d0d0d0] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

