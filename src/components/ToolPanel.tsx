import { Button } from "@/components/ui/button";
import { Pencil, Type, MapPin, Eraser, Download, MousePointer, Undo, Redo } from "lucide-react";

interface ToolPanelProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  onClear: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const ToolPanel = ({ activeTool, onToolSelect, onClear, onExport, onUndo, onRedo }: ToolPanelProps) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md">
      <Button
        variant={activeTool === "select" ? "default" : "outline"}
        onClick={() => onToolSelect("select")}
        className="justify-start"
      >
        <MousePointer className="w-4 h-4 mr-2" />
        Select
      </Button>
      <Button
        variant={activeTool === "draw" ? "default" : "outline"}
        onClick={() => onToolSelect("draw")}
        className="justify-start"
      >
        <Pencil className="w-4 h-4 mr-2" />
        Draw
      </Button>
      <Button
        variant={activeTool === "text" ? "default" : "outline"}
        onClick={() => onToolSelect("text")}
        className="justify-start"
      >
        <Type className="w-4 h-4 mr-2" />
        Text
      </Button>
      <Button
        variant={activeTool === "pin" ? "default" : "outline"}
        onClick={() => onToolSelect("pin")}
        className="justify-start"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Pin
      </Button>
      <Button
        variant="outline"
        onClick={onUndo}
        className="justify-start"
      >
        <Undo className="w-4 h-4 mr-2" />
        Undo
      </Button>
      <Button
        variant="outline"
        onClick={onRedo}
        className="justify-start"
      >
        <Redo className="w-4 h-4 mr-2" />
        Redo
      </Button>
      <Button
        variant="outline"
        onClick={onClear}
        className="justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
      >
        <Eraser className="w-4 h-4 mr-2" />
        Clear
      </Button>
      <Button variant="outline" onClick={onExport} className="justify-start">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>
  );
};