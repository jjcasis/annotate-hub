import { Canvas as FabricCanvas, Circle, Rect } from 'fabric';
import { HistoryManager } from './historyManager';

interface CustomFabricObject extends fabric.Object {
  isTemp?: boolean;
}

export class ToolsManager {
  private canvas: FabricCanvas;
  private historyManager: HistoryManager;
  private isDrawing: boolean = false;
  private startPoint: { x: number; y: number } | null = null;
  private tempRect: Rect | null = null;

  constructor(canvas: FabricCanvas, historyManager: HistoryManager) {
    this.canvas = canvas;
    this.historyManager = historyManager;
  }

  handlePin(pointer: { x: number; y: number }) {
    const circle = new Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 10,
      fill: '#2563eb',
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: true,
    });
    this.canvas.add(circle);
    this.canvas.renderAll();
    this.historyManager.saveState();
  }

  startRectangle(pointer: { x: number; y: number }) {
    this.isDrawing = true;
    this.startPoint = pointer;
  }

  updateRectangle(pointer: { x: number; y: number }) {
    if (!this.isDrawing || !this.startPoint) return;

    if (this.tempRect) {
      this.canvas.remove(this.tempRect);
    }

    this.tempRect = new Rect({
      left: Math.min(this.startPoint.x, pointer.x),
      top: Math.min(this.startPoint.y, pointer.y),
      width: Math.abs(this.startPoint.x - pointer.x),
      height: Math.abs(this.startPoint.y - pointer.y),
      fill: 'transparent',
      stroke: '#2563eb',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
    });

    this.canvas.add(this.tempRect);
    this.canvas.renderAll();
  }

  finishRectangle() {
    if (!this.isDrawing) return false;

    // Keep the last rectangle as permanent
    this.tempRect = null;
    this.isDrawing = false;
    this.startPoint = null;
    this.canvas.renderAll();
    this.historyManager.saveState();
    return true;
  }
}
