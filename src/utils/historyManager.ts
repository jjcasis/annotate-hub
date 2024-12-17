import { Canvas as FabricCanvas } from 'fabric';

export class HistoryManager {
  private canvas: FabricCanvas;
  private undoStack: string[] = [];
  private redoStack: string[] = [];

  constructor(canvas: FabricCanvas) {
    this.canvas = canvas;
    this.saveState();
  }

  saveState() {
    const json = JSON.stringify(this.canvas.toJSON(['selectable', 'hasControls']));
    this.undoStack.push(json);
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop();
      if (currentState) {
        this.redoStack.push(currentState);
      }
      const previousState = this.undoStack[this.undoStack.length - 1];
      if (previousState) {
        this.canvas.loadFromJSON(previousState, () => {
          this.canvas.renderAll();
        });
      }
    }
  }

  redo() {
    const nextState = this.redoStack.pop();
    if (nextState) {
      this.undoStack.push(nextState);
      this.canvas.loadFromJSON(nextState, () => {
        this.canvas.renderAll();
      });
    }
  }
}