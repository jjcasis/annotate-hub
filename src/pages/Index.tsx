import { useState } from "react";
import { ModuleSelector } from "@/components/ModuleSelector";
import { LevelSelector } from "@/components/LevelSelector";
import { ToolPanel } from "@/components/ToolPanel";
import { PDFViewer } from "@/components/PDFViewer";

const Index = () => {
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [activeTool, setActiveTool] = useState("select");

  const handleExport = () => {
    // To be implemented
    console.log("Export functionality to be implemented");
  };

  const handleClear = () => {
    // To be implemented
    console.log("Clear functionality to be implemented");
  };

  const handleUndo = () => {
    // To be implemented
    console.log("Undo functionality to be implemented");
  };

  const handleRedo = () => {
    // To be implemented
    console.log("Redo functionality to be implemented");
  };

  return (
    <div className="min-h-screen bg-accent p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Proyecto UJR Panamá Oeste
        </h1>
        <p className="text-secondary">PDF Inspection and Annotation Tool</p>
      </header>

      <div className="mb-6">
        <ModuleSelector
          selectedModule={selectedModule}
          onModuleSelect={setSelectedModule}
        />
        {selectedModule && (
          <LevelSelector
            selectedLevel={selectedLevel}
            onLevelSelect={setSelectedLevel}
          />
        )}
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-6">
        <ToolPanel
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          onClear={handleClear}
          onExport={handleExport}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
        <PDFViewer
          module={selectedModule}
          level={selectedLevel}
          activeTool={activeTool}
        />
      </div>
    </div>
  );
};

export default Index;