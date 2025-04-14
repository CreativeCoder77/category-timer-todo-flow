
import React, { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClassBadge from "./ClassBadge";

interface NewTaskFormProps {
  onComplete: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onComplete }) => {
  const { addTask, categories, customClasses, activeCategory } = useTodo();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(activeCategory || "default");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        description,
        completed: false,
        categoryId,
        classIds: selectedClasses,
      });
      setTitle("");
      setDescription("");
      setCategoryId(activeCategory || "default");
      setSelectedClasses([]);
      onComplete();
    }
  };

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Task Title</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          autoFocus
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description (Optional)</Label>
        <Textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center">
                  <span
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {customClasses.length > 0 && (
        <div className="space-y-2">
          <Label>Classes</Label>
          <div className="flex flex-wrap gap-2">
            {customClasses.map((cls) => (
              <ClassBadge
                key={cls.id}
                customClass={cls}
                selected={selectedClasses.includes(cls.id)}
                onClick={() => toggleClass(cls.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default NewTaskForm;
