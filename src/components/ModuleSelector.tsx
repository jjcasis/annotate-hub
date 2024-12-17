import { Button } from "@/components/ui/button";

interface ModuleSelectorProps {
  selectedModule: string;
  onModuleSelect: (module: string) => void;
}

const modules = ["Módulo A", "Módulo B", "Módulo C"];

export const ModuleSelector = ({ selectedModule, onModuleSelect }: ModuleSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      {modules.map((module) => (
        <Button
          key={module}
          variant={selectedModule === module ? "default" : "outline"}
          onClick={() => onModuleSelect(module)}
          className="min-w-[120px]"
        >
          {module}
        </Button>
      ))}
    </div>
  );
};