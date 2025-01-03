import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, IText } from "fabric";
import { toast } from "sonner";
import { PropertiesBar } from "./PropertiesBar";
import { HistoryManager } from "../utils/historyManager";
import { ToolsManager } from "../utils/toolsManager";
import { loadPDFIntoCanvas } from "../utils/pdfLoader";
import { CanvasInitializer } from "./CanvasInitializer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface PDFViewerProps {
  pdfPath: string;
  activeTool: string;
}

export const PDFViewer = ({ pdfPath, activeTool }: PDFViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const historyManagerRef = useRef<HistoryManager | null>(null);
  const toolsManagerRef = useRef<ToolsManager | null>(null);

  useEffect(() => {
    const handleObjectSelected = (event: CustomEvent) => {
      setSelectedObject(event.detail);
    };

    window.addEventListener('objectSelected', handleObjectSelected as EventListener);
    return () => {
      window.removeEventListener('objectSelected', handleObjectSelected as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.off('mouse:down');
    fabricCanvas.off('mouse:move');
    fabricCanvas.off('mouse:up');

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = false;
    fabricCanvas.defaultCursor = "default";
    fabricCanvas.hoverCursor = "default";

    switch (activeTool) {
      case "select":
        fabricCanvas.selection = true;
        fabricCanvas.hoverCursor = "move";
        break;

      case "draw":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "#2563eb";
        fabricCanvas.freeDrawingBrush.width = 2;
        break;

      case "text":
        fabricCanvas.defaultCursor = "text";
        fabricCanvas.on('mouse:down', (options) => {
          if (activeTool === "text") {
            const pointer = fabricCanvas.getPointer(options.e);
            const text = new IText('Click to edit', {
              left: pointer.x,
              top: pointer.y,
              fontSize: 20,
              fill: '#2563eb',
              selectable: true,
            });
            fabricCanvas.add(text);
            fabricCanvas.setActiveObject(text);
            text.enterEditing();
            fabricCanvas.renderAll();
            historyManagerRef.current?.saveState();
          }
        });
        break;

      case "pin":
        fabricCanvas.defaultCursor = "crosshair";
        fabricCanvas.on('mouse:down', (options) => {
          if (activeTool === "pin") {
            const pointer = fabricCanvas.getPointer(options.e);
            toolsManagerRef.current?.handlePin(pointer);
          }
        });
        break;

      case "rectangle":
        fabricCanvas.defaultCursor = "crosshair";
        fabricCanvas.on('mouse:down', (options) => {
          if (activeTool === "rectangle") {
            const pointer = fabricCanvas.getPointer(options.e);
            toolsManagerRef.current?.startRectangle(pointer);
          }
        });

        fabricCanvas.on('mouse:move', (options) => {
          if (activeTool === "rectangle") {
            const pointer = fabricCanvas.getPointer(options.e);
            toolsManagerRef.current?.updateRectangle(pointer);
          }
        });

        fabricCanvas.on('mouse:up', () => {
          if (activeTool === "rectangle") {
            const finished = toolsManagerRef.current?.finishRectangle();
            if (finished) {
              const event = new CustomEvent('toolSelect', { detail: 'select' });
              window.dispatchEvent(event);
            }
          }
        });
        break;
    }
  }, [activeTool, fabricCanvas]);

  useEffect(() => {
    if (!pdfPath || !fabricCanvas) return;
    loadPDFIntoCanvas(pdfPath, fabricCanvas);
  }, [pdfPath, fabricCanvas]);

  const handleClear = () => {
    if (fabricCanvas) {
      const clearCanvas = () => {
        fabricCanvas.getObjects().forEach((obj) => {
          if (obj !== fabricCanvas.backgroundImage) {
            fabricCanvas.remove(obj);
          }
        });
        fabricCanvas.renderAll();
        historyManagerRef.current?.saveState();
        toast("Canvas cleared!");
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger>Clear Canvas</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will clear all annotations from the canvas. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearCanvas}>Clear</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <CanvasInitializer
        canvasRef={canvasRef}
        setFabricCanvas={setFabricCanvas}
        activeTool={activeTool}
        historyManagerRef={historyManagerRef}
        toolsManagerRef={toolsManagerRef}
      />
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
