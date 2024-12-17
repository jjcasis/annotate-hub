import { Button } from "@/components/ui/button";

interface LevelSelectorProps {
  selectedLevel: string;
  onLevelSelect: (level: string) => void;
}

const levels = ["Nivel 1", "Nivel 2", "Nivel 3"];

export const LevelSelector = ({ selectedLevel, onLevelSelect }: LevelSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      {levels.map((level) => (
        <Button
          key={level}
          variant={selectedLevel === level ? "default" : "outline"}
          onClick={() => onLevelSelect(level)}
          className="min-w-[100px]"
        >
          {level}
        </Button>
      ))}
    </div>
  );
};