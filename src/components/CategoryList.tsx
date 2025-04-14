
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTodo } from "@/context/TodoContext";
import { ListTodo, Plus, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewCategoryForm from "./NewCategoryForm";

const CategoryList: React.FC = () => {
  const { categories, activeCategory, setActiveCategory, tasks } = useTodo();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Count tasks per category
  const taskCounts = categories.reduce((acc, category) => {
    acc[category.id] = tasks.filter((task) => task.categoryId === category.id).length;
    return acc;
  }, {} as Record<string, number>);
  
  // All tasks count
  const allTasksCount = tasks.length;

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant={activeCategory === null ? "default" : "ghost"}
          className={cn("w-full justify-start", 
            activeCategory === null ? "bg-primary text-primary-foreground" : ""
          )}
          onClick={() => setActiveCategory(null)}
        >
          <ListTodo className="h-4 w-4 mr-2" />
          <span className="flex-1 text-left">All Tasks</span>
          <span className="text-xs bg-secondary px-2 py-0.5 rounded-md">
            {allTasksCount}
          </span>
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            className={cn("w-full justify-start", 
              activeCategory === category.id ? "bg-primary text-primary-foreground" : ""
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            <span
              className="h-3 w-3 rounded-full mr-2"
              style={{ backgroundColor: category.color }}
            />
            <span className="flex-1 text-left">{category.name}</span>
            <span className="text-xs bg-secondary px-2 py-0.5 rounded-md">
              {taskCounts[category.id] || 0}
            </span>
          </Button>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <NewCategoryForm onComplete={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryList;
