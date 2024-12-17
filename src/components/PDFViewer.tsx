import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, Image, Circle, IText } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";
import { PropertiesBar } from "./PropertiesBar";

interface PDFViewerProps {
  module: string;
  level: string;
  activeTool: string;
}

export const PDFViewer = ({ module, level, activeTool }: PDFViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush explicitly
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "#2563eb";
    canvas.freeDrawingBrush.width = 2;

    // Set up object selection event
    canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0]));
    canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0]));
    canvas.on('selection:cleared', () => setSelectedObject(null));

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = "#2563eb";
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    // Handle cursor tool
    if (activeTool === "select") {
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = "default";
      fabricCanvas.hoverCursor = "move";
    }

    // Handle text tool
    if (activeTool === "text") {
      fabricCanvas.defaultCursor = "text";
      fabricCanvas.on('mouse:down', (options) => {
        if (activeTool === "text") {
          const pointer = fabricCanvas.getPointer(options.e);
          const text = new IText('Click to edit', {
            left: pointer.x,
            top: pointer.y,
            fontSize: 20,
            fill: '#2563eb',
          });
          fabricCanvas.add(text);
          fabricCanvas.setActiveObject(text);
          text.enterEditing();
          fabricCanvas.renderAll();
        }
      });
    }

    // Handle pin tool
    if (activeTool === "pin") {
      fabricCanvas.defaultCursor = "crosshair";
      fabricCanvas.on('mouse:down', (options) => {
        if (activeTool === "pin") {
          const pointer = fabricCanvas.getPointer(options.e);
          const circle = new Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 10,
            fill: '#2563eb',
            originX: 'center',
            originY: 'center',
          });
          fabricCanvas.add(circle);
          fabricCanvas.renderAll();
        }
      });
    }
  }, [activeTool, fabricCanvas]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const url = `/placeholder.pdf`;
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        
        if (fabricCanvas) {
          const img = await new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = canvas.toDataURL();
            img.onload = () => resolve(img);
          });
          
          fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
        }
        
        toast("PDF loaded successfully");
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Error loading PDF");
      }
    };

    if (fabricCanvas && module && level) {
      loadPDF();
    }
  }, [module, level, fabricCanvas]);

  const handleUndo = () => {
    if (fabricCanvas && fabricCanvas.historyUndo) {
      fabricCanvas.undo();
    }
  };

  const handleRedo = () => {
    if (fabricCanvas && fabricCanvas.historyRedo) {
      fabricCanvas.redo();
    }
  };

  const handleClear = () => {
    if (fabricCanvas) {
      fabricCanvas.getObjects().forEach((obj) => {
        if (obj !== fabricCanvas.backgroundImage) {
          fabricCanvas.remove(obj);
        }
      });
      fabricCanvas.renderAll();
      toast("Canvas cleared!");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {selectedObject && (
        <PropertiesBar
          object={selectedObject}
          onUpdate={() => fabricCanvas?.renderAll()}
        />
      )}
      <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
    </div>
  );
};