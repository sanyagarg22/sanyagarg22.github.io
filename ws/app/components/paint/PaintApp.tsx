"use client";

import { useState, useCallback } from "react";
import { Ribbon } from "./Ribbon";
import { Canvas } from "./Canvas";
import { StatusBar } from "./StatusBar";
import { Tool } from "./types";

export function PaintApp() {
  // Tool state
  const [activeTool, setActiveTool] = useState<Tool>("pencil");
  const [brushSize, setBrushSize] = useState(5);
  
  // Color state
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  
  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | undefined>();
  const [zoom, setZoom] = useState(100);

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("Home");

  const [toClear, setToClear] = useState(false);

  const handleCanvasSizeChange = useCallback((width: number, height: number) => {
    setCanvasSize({ width, height });
  }, []);

  const handleCursorPositionChange = useCallback((x: number, y: number) => {
    setCursorPosition({ x, y });
  }, []);

  const handleNewCanvas = () => {
    if (confirm("Reset the canvas? Unsaved changes will be lost.")) {
      window.location.reload();
    }
  };

  const handleSave = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "paint-image.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleUndo = () => {
    // TODO: Implement undo
  };

  const handleRedo = () => {
    // TODO: Implement redo
  };

  const handleColorPick = (color: string) => {
    setPrimaryColor(color);
    setActiveTool("pencil");
  };

  const handleTabChange = (tab: string) => {
    setActiveTool("pencil");
    setActiveTab(tab);
  };

  const startClear = () => {
    setToClear(true);
  };

  const endClear = () => {
    setToClear(false);
  };


  return (
    <div className="flex flex-col h-screen bg-[#f0f0f0] font-['Segoe_UI',sans-serif]">
      {/* Ribbon (includes title bar) */}
      <Ribbon
        activeTool={activeTool}
        onToolChange={setActiveTool}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onPrimaryColorChange={setPrimaryColor}
        onSecondaryColorChange={setSecondaryColor}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onClearStart={startClear}
      />
      
      {/* Canvas Area */}
      <Canvas
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        activeTool={activeTool}
        activeTab={activeTab}
        brushSize={brushSize}
        toClear={toClear}
        onColorPick={handleColorPick}
        onSizeChange={handleCanvasSizeChange}
        onCursorMove={handleCursorPositionChange}
        onClearEnd={endClear}
      />
      
      {/* Status Bar */}
      <StatusBar
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
        cursorPosition={cursorPosition}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  );
}
