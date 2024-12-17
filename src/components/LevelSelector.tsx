import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { levelMappings } from "@/config/pdfMappings";

interface LevelSelectorProps {
  selectedModule: string;
  selectedLevel: string;
  selectedView: "POST" | "FRONT";
  onLevelSelect: (level: string) => void;
  onViewToggle: (view: "POST" | "FRONT") => void;
}

export const LevelSelector = ({ 
  selectedModule, 
  selectedLevel, 
  selectedView,
  onLevelSelect,
  onViewToggle 
}: LevelSelectorProps) => {
  const levels = selectedModule ? levelMappings[selectedModule] : [];

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <div className="flex gap-2">
        {levels.map((level) => (
          <div key={level.label} className="flex flex-col gap-2">
            <Button
              variant={selectedLevel === level.label ? "default" : "outline"}
              onClick={() => onLevelSelect(level.label)}
              className="min-w-[100px]"
            >
              {level.label}
            </Button>
            {level.hasToggle && selectedLevel === level.label && (
              <div className="flex gap-2 justify-center">
                <Toggle
                  pressed={selectedView === "POST"}
                  onPressedChange={() => onViewToggle("POST")}
                  size="sm"
                >
                  POST
                </Toggle>
                <Toggle
                  pressed={selectedView === "FRONT"}
                  onPressedChange={() => onViewToggle("FRONT")}
                  size="sm"
                >
                  FRONT
                </Toggle>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};