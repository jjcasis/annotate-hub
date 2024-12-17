import { useState } from "react";
import { ModuleSelector } from "@/components/ModuleSelector";
import { LevelSelector } from "@/components/LevelSelector";
import { ToolPanel } from "@/components/ToolPanel";
import { PDFViewer } from "@/components/PDFViewer";
import { levelMappings } from "@/config/pdfMappings";

const Index = () => {
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedView, setSelectedView] = useState<"POST" | "FRONT">("POST");
  const [activeTool, setActiveTool] = useState("select");

  const handleExport = () => {
    console.log("Export functionality to be implemented");
  };

  const handleClear = () => {
    console.log("Clear functionality to be implemented");
  };

  const handleUndo = () => {
    console.log("Undo functionality to be implemented");
  };

  const handleRedo = () => {
    console.log("Redo functionality to be implemented");
  };

  const getPDFPath = () => {
    if (!selectedModule || !selectedLevel) return "";
    
    const levelConfig = levelMappings[selectedModule]?.find(
      (level) => level.label === selectedLevel
    );

    if (!levelConfig) return "";

    if (typeof levelConfig.fileName === "string") {
      return `/pdfs/${levelConfig.fileName}`;
    }

    return `/pdfs/${levelConfig.fileName[selectedView]}`;
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
            selectedModule={selectedModule}
            selectedLevel={selectedLevel}
            selectedView={selectedView}
            onLevelSelect={setSelectedLevel}
            onViewToggle={setSelectedView}
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
          pdfPath={getPDFPath()}
          activeTool={activeTool}
        />
      </div>
    </div>
  );
};

export default Index;