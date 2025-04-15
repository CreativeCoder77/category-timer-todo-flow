
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTodo } from "@/context/TodoContext";
import { ListTodo, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NewCategoryForm from "./NewCategoryForm";

const CategoryList: React.FC = () => {
  const { categories, activeCategory, setActiveCategory, tasks, deleteCategory } = useTodo();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Count tasks per category
  const taskCounts = categories.reduce((acc, category) => {
    acc[category.id] = tasks.filter((task) => task.categoryId === category.id).length;
    return acc;
  }, {} as Record<string, number>);
  
  // All tasks count
  const allTasksCount = tasks.length;

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      if (activeCategory === categoryToDelete) {
        setActiveCategory(null);
      }
      setCategoryToDelete(null);
    }
  };

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
          <div key={category.id} className="flex items-center">
            <Button
              variant={activeCategory === category.id ? "default" : "ghost"}
              className={cn("w-full justify-start rounded-r-none", 
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
            
            {/* Don't allow deletion of the default category */}
            {category.id !== "default" && (
              <Button 
                variant="ghost"
                size="icon"
                className="h-10 w-8 rounded-l-none hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
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

      <AlertDialog open={categoryToDelete !== null} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? All tasks in this category will be moved to Uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryList;
