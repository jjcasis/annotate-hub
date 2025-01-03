import * as pdfjsLib from "pdfjs-dist";
import { Canvas as FabricCanvas, Image as FabricImage } from "fabric";
import { toast } from "sonner";

// Initialize PDF.js worker
const initializeWorker = () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const workerUrl = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  }
};

export const loadPDFIntoCanvas = async (
  pdfPath: string,
  fabricCanvas: FabricCanvas
): Promise<void> => {
  try {
    initializeWorker();
    
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) {
      throw new Error("Could not get canvas context");
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    const dataUrl = canvas.toDataURL();
    
    fabricCanvas.backgroundColor = null;
    
    return new Promise((resolve, reject) => {
      FabricImage.fromURL(
        dataUrl,
        function(img) {
          if (img) {
            const scale = fabricCanvas.width! / viewport.width;
            img.scale(scale);
            fabricCanvas.backgroundImage = img;
            fabricCanvas.renderAll();
            toast("PDF loaded successfully");
            resolve();
          } else {
            reject(new Error("Failed to load image"));
          }
        },
        {
          crossOrigin: 'anonymous'
        }
      );
    });
  } catch (error) {
    console.error("Error loading PDF:", error);
    toast.error("Error loading PDF");
    throw error;
  }
};