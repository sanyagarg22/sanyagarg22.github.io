"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Tool } from "./types";
import { Projects } from "./Projects";
import { About } from "./About";

interface CanvasProps {
  primaryColor: string;
  secondaryColor: string;
  activeTool: Tool;
  brushSize: number;
  activeTab: string;
  toClear: boolean;
  onColorPick?: (color: string) => void;
  onSizeChange?: (width: number, height: number) => void;
  onCursorMove?: (x: number, y: number) => void;
  onClearEnd?: () => void;
}

export function Canvas({ 
  primaryColor, 
  secondaryColor, 
  activeTool, 
  brushSize,
  toClear,
  onColorPick,
  onSizeChange,
  onCursorMove,
  activeTab,
  onClearEnd,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [currentColor, setCurrentColor] = useState(primaryColor);
  const [isInitialized, setIsInitialized] = useState(false);
  const padding = 32;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const width = container.clientWidth - padding;
      const height = container.clientHeight - padding;
      
      if (width > 0 && height > 0) {
        // note: we are calling a state setter with a function, so it automatically passes in prev value 
        setCanvasSize(
          (prev) => {
            if (prev.width === width && prev.height === height) {
              return prev;
            }
            return { width, height };
          }
        );
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [activeTab]);

  // Notify PaintApp if the canvas size changes
  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      onSizeChange?.(canvasSize.width, canvasSize.height);
    }
  }, [canvasSize, onSizeChange]);

  // Initialize canvas with white background 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only fill with white on first init, not on every resize to preserve drawing when resizing
    if ((!isInitialized && canvasSize.width > 0 && canvasSize.height > 0) || toClear) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.imageSmoothingEnabled = false;
      setIsInitialized(true);
    }
    if (toClear) {
      onClearEnd?.();
    }
  }, [canvasSize, isInitialized, toClear]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const getPixelColor = useCallback((x: number, y: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    
    const r = pixel[0].toString(16).padStart(2, "0");
    const g = pixel[1].toString(16).padStart(2, "0");
    const b = pixel[2].toString(16).padStart(2, "0");
    
    return `#${r}${g}${b}`;
  }, []);

  const draw = useCallback((x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    color = activeTool === "eraser" ? "#ffffff" : color;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (lastPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [activeTool, brushSize, lastPos]);

  const fill = useCallback((x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    x = Math.floor(x);
    y = Math.floor(y);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const getPixelIndex = (px: number, py: number) => (py * canvas.width + px) * 4;

    const targetIdx = getPixelIndex(x, y);
    const targetRGB = pixels.slice(targetIdx, targetIdx + 3);

    const fillRGB = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16), 255];

    if (targetRGB[0] === fillRGB[0] && targetRGB[1] === fillRGB[1] && targetRGB[2] === fillRGB[2]) return;

    const queue: { x: number; y: number }[] = [];
    const visited: Set<number> = new Set();
    
    queue.push({ x: x, y: y });
    visited.add(y * canvas.width + x);

    const xshift = [0, 0, 1, -1];
    const yshift = [1, -1, 0, 0];

    while (queue.length > 0) {
      const curr = queue.shift();
      if (!curr) continue;
      
      if (curr.x < 0 || curr.x >= canvas.width || curr.y < 0 || curr.y >= canvas.height) continue;
      
      const idx = getPixelIndex(curr.x, curr.y);
      for (let i = 0; i < fillRGB.length; i++) {
        pixels[idx + i] = fillRGB[i];
      }
      
      for (let i = 0; i < 4; i++) { 
        const newx = curr.x + xshift[i];
        const newy = curr.y + yshift[i];
        const key = newy * canvas.width + newx;
        
        if (visited.has(key) || newx < 0 || newx >= canvas.width || newy < 0 || newy >= canvas.height) continue;
        const neighborIdx = getPixelIndex(newx, newy);
        if (pixels[neighborIdx] === targetRGB[0] && 
            pixels[neighborIdx + 1] === targetRGB[1] && 
            pixels[neighborIdx + 2] === targetRGB[2]) {
          queue.push({ x: newx, y: newy });
          visited.add(key);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const color = e.button === 2 ? secondaryColor : primaryColor;
    setCurrentColor(color);

    if (activeTool === "picker") {
      let pickedColor: string | null = getPixelColor(x, y);
      if (!pickedColor) return;
      onColorPick?.(pickedColor);
      return;
    }

    if (activeTool === "fill") {
      fill(x, y, color);
      return;
    }

    if (activeTool === "pencil" || activeTool === "brush" || activeTool === "eraser") {
      // TODO: make the pencil and brush do different things
      setIsDrawing(true);
      setLastPos({ x, y });
      draw(x, y, color);
      return;
    }

  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    onCursorMove?.(Math.round(x), Math.round(y));
    if (!isDrawing) return;
    draw(x, y, currentColor);
    setLastPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };


  const showCanvas = activeTab === "Home" || activeTab === "Free Paint";
  const showProjects = activeTab === "Projects";
  const showAboutMe = activeTab === "About Me";

  return (
    <>
      {/* Canvas - always mounted to preserve drawing, but hidden when not needed */}
      <div 
        ref={containerRef} 
        className={`flex-1 bg-[#c0c0c0] p-4 overflow-hidden ${showCanvas ? '' : 'hidden'}`}
      >
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="bg-white cursor-crosshair shadow-md"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
          />
          {activeTab === "Home" && <Home />}
          {activeTab === "Free Paint" && <FreePaint />}
        </div>
      </div>

      {/* Projects page - shown when Projects tab is active */}
      {showProjects && <Projects />}

      {/* About Me page - shown when About Me tab is active */}
      {showAboutMe && <About />}
    </>
  );
}

export function Home(){
  return (
    <div className="absolute top-1/4 left-1/16 pointer-events-none p-4">

    <div className="text-7xl font-bold pointer-events-none">
        <img
          src="/sanya_cursive.png"
          alt="hello doodle"
          className="w-120 h-40 object-cover -ml-8"
        />
      </div>
        <div className="text-gray-600 text-xl mt-2 pointer-events-none">
          welcome to my personal website inspired by the legacy microsoft paint app!
        </div>
        <div className="text-gray-600 text-xl mt-2 pointer-events-none" style={{ color: "#7092be" }}>
           feel free to make a doodle or two while you're here :)
        </div>
        <Icons />
    </div>
  )
}

export function Icons(){
  return (
    <div className="flex items-center gap-4 mt-6 pointer-events-auto z-10">
      <a 
        href="https://www.linkedin.com/in/sanya-garg/" 
        target="_blank" 
        className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity text-gray-600"
        title="LinkedIn"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
      <a 
        href="mailto:sanya.garg@gmail.com" 
        className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity text-gray-600"
        title="Email"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </a>
      <a 
        href="https://github.com/sanyagarg22" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity text-gray-600"
        title="GitHub"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  )
}


export function FreePaint(){
  return (
    <div className="absolute top-1/3 left-1/16 pointer-events-none p-4">
    </div>
  )
}