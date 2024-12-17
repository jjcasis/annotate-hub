import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { toast } from "sonner";

interface PDFViewerProps {
  module: string;
  level: string;
  activeTool: string;
}

export const PDFViewer = ({ module, level, activeTool }: PDFViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    canvas.freeDrawingBrush.color = "#2563eb";
    canvas.freeDrawingBrush.width = 2;

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
  }, [activeTool, fabricCanvas]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // In a real app, this would be a dynamic URL based on module and level
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
        
        // Set the PDF as background image of the Fabric canvas
        fabricCanvas?.setBackgroundImage(canvas.toDataURL(), fabricCanvas.renderAll.bind(fabricCanvas));
        
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

  return (
    <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
};