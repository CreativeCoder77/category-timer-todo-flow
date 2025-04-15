import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task, Category, CustomClass } from "../types";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";

interface TodoContextType {
  tasks: Task[];
  categories: Category[];
  customClasses: CustomClass[];
  activeCategory: string | null;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  setActiveCategory: (categoryId: string | null) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "order">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addCustomClass: (customClass: Omit<CustomClass, "id">) => void;
  updateCustomClass: (customClass: CustomClass) => void;
  deleteCustomClass: (customClassId: string) => void;
  reorderTasks: (sourceIndex: number, destinationIndex: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: "default", name: "Uncategorized", color: "#9b87f5" },
  { id: "work", name: "Work", color: "#9b87f5" },
  { id: "personal", name: "Personal", color: "#6E59A5" },
];

const defaultClasses: CustomClass[] = [
  { id: "important", name: "Important", color: "#f97316" },
  { id: "urgent", name: "Urgent", color: "#ea384c" },
];

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
      } catch (error) {
        console.error("Error parsing tasks:", error);
        return [];
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  const [customClasses, setCustomClasses] = useState<CustomClass[]>(() => {
    const savedClasses = localStorage.getItem("customClasses");
    return savedClasses ? JSON.parse(savedClasses) : defaultClasses;
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("customClasses", JSON.stringify(customClasses));
  }, [customClasses]);

  const addTask = (task: Omit<Task, "id" | "createdAt" | "order">) => {
    console.log("Adding task:", task);
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      order: tasks.length,
      classIds: task.classIds || [],
    };
    setTasks((prev) => [...prev, newTask]);
    toast("Task created successfully", {
      description: `"${newTask.title}" has been added to your tasks`,
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast("Task updated", {
      description: `"${updatedTask.title}" has been updated`,
    });
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (taskToDelete) {
      toast("Task deleted", {
        description: `"${taskToDelete.title}" has been removed`,
      });
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: uuidv4() };
    setCategories((prev) => [...prev, newCategory]);
    toast("Category created", {
      description: `"${newCategory.name}" category has been created`,
    });
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    toast("Category updated", {
      description: `"${updatedCategory.name}" category has been updated`,
    });
  };

  const deleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
    setTasks((prev) =>
      prev.map((task) =>
        task.categoryId === categoryId
          ? { ...task, categoryId: "default" }
          : task
      )
    );
    if (categoryToDelete) {
      toast("Category deleted", {
        description: `"${categoryToDelete.name}" category has been removed`,
      });
    }
  };

  const addCustomClass = (customClass: Omit<CustomClass, "id">) => {
    const newClass = { ...customClass, id: uuidv4() };
    setCustomClasses((prev) => [...prev, newClass]);
    toast("Class created", {
      description: `"${newClass.name}" class has been created`,
    });
  };

  const updateCustomClass = (updatedClass: CustomClass) => {
    setCustomClasses((prev) =>
      prev.map((customClass) =>
        customClass.id === updatedClass.id ? updatedClass : customClass
      )
    );
    toast("Class updated", {
      description: `"${updatedClass.name}" class has been updated`,
    });
  };

  const deleteCustomClass = (customClassId: string) => {
    const classToDelete = customClasses.find(cls => cls.id === customClassId);
    setCustomClasses((prev) =>
      prev.filter((customClass) => customClass.id !== customClassId)
    );
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        classIds: task.classIds.filter((id) => id !== customClassId),
      }))
    );
    if (classToDelete) {
      toast("Class deleted", {
        description: `"${classToDelete.name}" class has been removed`,
      });
    }
  };

  const reorderTasks = (sourceIndex: number, destinationIndex: number) => {
    const filteredTasks = activeCategory
      ? tasks.filter((task) => task.categoryId === activeCategory)
      : tasks;
    
    const reorderedTasks = [...filteredTasks];
    const [removed] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(destinationIndex, 0, removed);
    
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }));
    
    setTasks((prev) =>
      activeCategory
        ? prev.map(
            (task) =>
              updatedTasks.find((t) => t.id === task.id) || task
          )
        : updatedTasks
    );
  };

  return (
    <TodoContext.Provider
      value={{
        tasks,
        categories,
        customClasses,
        activeCategory,
        activeTask,
        setActiveTask,
        setActiveCategory,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addCategory,
        updateCategory,
        deleteCategory,
        addCustomClass,
        updateCustomClass,
        deleteCustomClass,
        reorderTasks,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
