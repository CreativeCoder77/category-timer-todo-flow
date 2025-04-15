
import React, { useState } from "react";
import { Pencil, Trash, GripVertical, Check, Square, Clock, Flag } from "lucide-react";
import { Task, Category, CustomClass } from "@/types";
import { useTodo } from "@/context/TodoContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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
  
  // Check if task is due soon (within next 24 hours) or overdue
  const isTaskDueSoon = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000;
  };
  
  const isTaskOverdue = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < new Date();
  };
  
  // Get priority class
  const getPriorityClass = () => {
    if (!task.priority) return "";
    return `priority-${task.priority}`;
  };

  return (
    <div
      className={cn(
        "task-card group flex items-center gap-3",
        isDragging && "opacity-50 bg-secondary",
        task.completed && "opacity-75 bg-secondary/30",
        getPriorityClass()
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
          
          {task.priority && (
            <span className="flex items-center gap-1 text-xs">
              <Flag className={cn(
                "h-3 w-3",
                task.priority === 'high' && "text-red-500",
                task.priority === 'medium' && "text-amber-500",
                task.priority === 'low' && "text-blue-500"
              )} />
              <span>{task.priority}</span>
            </span>
          )}
        </div>
        
        {task.dueDate && (
          <div className={cn(
            "text-xs mt-1 flex items-center gap-1",
            isTaskDueSoon() && "due-soon",
            isTaskOverdue() && "overdue"
          )}>
            <Clock className="h-3 w-3" />
            <span>
              {isTaskOverdue() ? "Overdue: " : "Due: "}
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          </div>
        )}
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
