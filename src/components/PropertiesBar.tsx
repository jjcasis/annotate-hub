import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

interface PropertiesBarProps {
  object: any;
  onUpdate: () => void;
}

export const PropertiesBar = ({ object, onUpdate }: PropertiesBarProps) => {
  const [color, setColor] = useState(object.fill || "#000000");
  const [fontSize, setFontSize] = useState(object.fontSize || 20);
  const [opacity, setOpacity] = useState((object.opacity || 1) * 100);
  const [isEditable, setIsEditable] = useState(object.selectable || false);

  useEffect(() => {
    if (object) {
      setColor(object.fill || "#000000");
      setFontSize(object.fontSize || 20);
      setOpacity((object.opacity || 1) * 100);
      setIsEditable(object.selectable || false);
    }
  }, [object]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    object.set('fill', newColor);
    onUpdate();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    if (object.type === 'i-text') {
      object.set('fontSize', newSize);
      onUpdate();
    }
  };

  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0];
    setOpacity(newOpacity);
    object.set('opacity', newOpacity / 100);
    onUpdate();
  };

  const handleEditableChange = (checked: boolean) => {
    setIsEditable(checked);
    object.set('selectable', checked);
    object.set('hasControls', checked);
    onUpdate();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={color}
          onChange={handleColorChange}
          className="h-10 w-20"
        />
      </div>

      {object.type === 'i-text' && (
        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Input
            id="fontSize"
            type="number"
            min="8"
            max="72"
            value={fontSize}
            onChange={handleFontSizeChange}
            className="w-20"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="opacity">Opacity</Label>
        <Slider
          id="opacity"
          min={0}
          max={100}
          step={1}
          value={[opacity]}
          onValueChange={handleOpacityChange}
          className="w-48"
        />
      </div>

      {(object.type === 'path' || object.type === 'circle') && (
        <div className="flex items-center space-x-2">
          <Switch
            id="editable"
            checked={isEditable}
            onCheckedChange={handleEditableChange}
          />
          <Label htmlFor="editable">Enable editing</Label>
        </div>
      )}
    </div>
  );
};