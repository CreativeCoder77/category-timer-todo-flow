
import React, { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PRESET_COLORS = [
  "#9b87f5", // Primary purple
  "#6E59A5", // Secondary purple
  "#ea384c", // Red
  "#f97316", // Orange
  "#0EA5E9", // Blue
  "#10B981", // Green
];

const ClassManager: React.FC = () => {
  const { customClasses, addCustomClass, updateCustomClass, deleteCustomClass } =
    useTodo();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [customColor, setCustomColor] = useState(PRESET_COLORS[0]);
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addCustomClass({
        name: name.trim(),
        color: isCustomColor ? customColor : color,
      });
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && editingClass) {
      updateCustomClass({
        id: editingClass,
        name: name.trim(),
        color: isCustomColor ? customColor : color,
      });
      resetForm();
      setIsEditDialogOpen(false);
    }
  };

  const startEdit = (cls: { id: string; name: string; color: string }) => {
    setEditingClass(cls.id);
    setName(cls.name);
    setColor(cls.color);
    setCustomColor(cls.color);
    setIsCustomColor(!PRESET_COLORS.includes(cls.color));
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setName("");
    setColor(PRESET_COLORS[0]);
    setCustomColor(PRESET_COLORS[0]);
    setIsCustomColor(false);
    setEditingClass(null);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Custom Classes</h2>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            Add Class
          </Button>
        </div>

        {customClasses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No custom classes yet</p>
            <Button
              variant="link"
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-2"
            >
              Create your first class
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {customClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: cls.color }}
                  />
                  <span>{cls.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(cls)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCustomClass(cls.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddClass} className="space-y-4">
            {/* Form fields - same as for edit */}
            <div className="space-y-2">
              <Label htmlFor="class-name">Class Name</Label>
              <Input
                id="class-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter class name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Class Color</Label>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim()}>
                Create Class
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditClass} className="space-y-4">
            {/* Same form fields as add */}
            <div className="space-y-2">
              <Label htmlFor="edit-class-name">Class Name</Label>
              <Input
                id="edit-class-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter class name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Class Color</Label>
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
                <Label htmlFor="edit-custom-color">Custom Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: customColor }}
                  />
                  <Input
                    id="edit-custom-color"
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim()}>
                Update Class
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassManager;
