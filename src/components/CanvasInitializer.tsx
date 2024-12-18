import { useEffect } from "react";
import { Canvas as FabricCanvas, PencilBrush, IText } from "fabric";

interface CanvasInitializerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setFabricCanvas: (canvas: FabricCanvas) => void;
  activeTool: string;
  historyManagerRef: any;
  toolsManagerRef: any;
}

export const CanvasInitializer = ({
  canvasRef,
  setFabricCanvas,
  activeTool,
  historyManagerRef,
  toolsManagerRef,
}: CanvasInitializerProps) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "#2563eb";
    canvas.freeDrawingBrush.width = 2;

    canvas.on('selection:created', (e) => {
      const event = new CustomEvent('objectSelected', { detail: e.selected?.[0] });
      window.dispatchEvent(event);
    });
    canvas.on('selection:updated', (e) => {
      const event = new CustomEvent('objectSelected', { detail: e.selected?.[0] });
      window.dispatchEvent(event);
    });
    canvas.on('selection:cleared', () => {
      const event = new CustomEvent('objectSelected', { detail: null });
      window.dispatchEvent(event);
    });
    canvas.on('object:modified', () => {
      historyManagerRef.current?.saveState();
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  return null;
};