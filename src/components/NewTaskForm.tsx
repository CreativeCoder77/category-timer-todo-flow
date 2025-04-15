
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Flag } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        description,
        completed: false,
        categoryId: categoryId || "default",
        classIds: selectedClasses,
        dueDate,
        priority,
      });
      setTitle("");
      setDescription("");
      setCategoryId(activeCategory || "default");
      setSelectedClasses([]);
      setDueDate(undefined);
      setPriority(undefined);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label>Due Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "No due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority (Optional)</Label>
          <Select 
            value={priority || ""} 
            onValueChange={(value) => setPriority(value === "" ? undefined : value as "low" | "medium" | "high")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Set priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span>No priority</span>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2 text-red-500" />
                  <span>High</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center">
                  <Flag className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Low</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {customClasses.length > 0 && (
          <div className="space-y-2">
            <Label>Classes</Label>
            <div className="flex flex-wrap gap-2 mt-2 p-2 border rounded-md bg-secondary/20 min-h-[42px]">
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
      </div>

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
