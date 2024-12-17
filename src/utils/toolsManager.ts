import { Canvas, Circle, Rect, Object as FabricObject } from "fabric";
import { HistoryManager } from "./historyManager";

export class ToolsManager {
  private canvas: Canvas;
  private historyManager: HistoryManager;
  private tempRect: Rect | null = null;
  private isDrawing = false;

  constructor(canvas: Canvas, historyManager: HistoryManager) {
    this.canvas = canvas;
    this.historyManager = historyManager;
  }

  handlePin(pointer: { x: number; y: number }) {
    const circle = new Circle({
      left: pointer.x,
      top: pointer.y,
      fill: "#2563eb",
      radius: 10,
      selectable: true,
      hasControls: true,
    });

    this.canvas.add(circle);
    this.canvas.renderAll();
    this.historyManager.saveState();
  }

  startRectangle(pointer: { x: number; y: number }) {
    this.isDrawing = true;
    this.tempRect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: "transparent",
      stroke: "#2563eb",
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
    });

    this.canvas.add(this.tempRect);
    this.canvas.renderAll();
  }

  updateRectangle(pointer: { x: number; y: number }) {
    if (!this.isDrawing || !this.tempRect) return;

    const width = pointer.x - this.tempRect.left!;
    const height = pointer.y - this.tempRect.top!;

    this.tempRect.set({
      width: Math.abs(width),
      height: Math.abs(height),
    });

    if (width < 0) {
      this.tempRect.set({ left: pointer.x });
    }
    if (height < 0) {
      this.tempRect.set({ top: pointer.y });
    }

    this.canvas.renderAll();
  }

  finishRectangle(): boolean {
    if (!this.isDrawing || !this.tempRect) return false;

    this.isDrawing = false;
    this.historyManager.saveState();
    this.tempRect = null;
    return true;
  }
}