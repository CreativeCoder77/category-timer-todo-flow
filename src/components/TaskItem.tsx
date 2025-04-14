
import React, { useState } from "react";
import { Pencil, Trash, GripVertical, Check, Square } from "lucide-react";
import { Task, Category, CustomClass } from "@/types";
import { useTodo } from "@/context/TodoContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ClassBadge from "./ClassBadge";

interface TaskItemProps {
  task: Task;
  categories: Category[];
  customClasses: CustomClass[];
  isDragging?: boolean;
  dragHandleProps?: any;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  categories,
  customClasses,
  isDragging,
  dragHandleProps,
}) => {
  const { toggleTaskCompletion, updateTask, deleteTask, setActiveTask } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  
  const category = categories.find((cat) => cat.id === task.categoryId);
  const taskClasses = customClasses.filter((cls) => task.classIds.includes(cls.id));

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTask({ ...task, title: editedTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "task-card group flex items-center gap-3",
        isDragging && "opacity-50 bg-secondary",
        task.completed && "opacity-75 bg-secondary/30"
      )}
    >
      <div {...dragHandleProps} className="drag-handle">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="p-0 h-6 w-6"
        onClick={() => toggleTaskCompletion(task.id)}
      >
        {task.completed ? (
          <Check className="h-5 w-5 text-primary" />
        ) : (
          <Square className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>

      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full p-1 rounded border focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        ) : (
          <div
            className={cn(
              "text-sm font-medium",
              task.completed && "line-through text-muted-foreground"
            )}
            onClick={() => setActiveTask(task)}
          >
            {task.title}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-1">
          {category && (
            <span
              className="category-pill"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              {category.name}
            </span>
          )}
          {taskClasses.map((cls) => (
            <ClassBadge key={cls.id} customClass={cls} />
          ))}
        </div>
      </div>

      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteTask(task.id)}
          className="h-8 w-8 text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
