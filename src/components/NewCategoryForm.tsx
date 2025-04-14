
import React, { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewCategoryFormProps {
  onComplete: () => void;
}

const PRESET_COLORS = [
  "#9b87f5", // Primary purple
  "#6E59A5", // Secondary purple
  "#ea384c", // Red
  "#f97316", // Orange
  "#0EA5E9", // Blue
  "#10B981", // Green
];

const NewCategoryForm: React.FC<NewCategoryFormProps> = ({ onComplete }) => {
  const { addCategory } = useTodo();
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [customColor, setCustomColor] = useState(PRESET_COLORS[0]);
  const [isCustomColor, setIsCustomColor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addCategory({
        name: name.trim(),
        color: isCustomColor ? customColor : color,
      });
      setName("");
      setColor(PRESET_COLORS[0]);
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-name">Category Name</Label>
        <Input
          id="category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Category Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              className={`w-8 h-8 rounded-full ${
                color === presetColor && !isCustomColor
                  ? "ring-2 ring-offset-2 ring-primary"
                  : ""
              }`}
              style={{ backgroundColor: presetColor }}
              onClick={() => {
                setColor(presetColor);
                setIsCustomColor(false);
              }}
            />
          ))}
          <button
            type="button"
            className={`w-8 h-8 rounded-full bg-white border ${
              isCustomColor ? "ring-2 ring-offset-2 ring-primary" : ""
            }`}
            onClick={() => setIsCustomColor(true)}
          >
            <span className="text-xs">+</span>
          </button>
        </div>
      </div>

      {isCustomColor && (
        <div className="space-y-2">
          <Label htmlFor="custom-color">Custom Color</Label>
          <div className="flex gap-2">
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: customColor }}
            />
            <Input
              id="custom-color"
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-full h-10"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          Create Category
        </Button>
      </div>
    </form>
  );
};

export default NewCategoryForm;
