
import React, { useState } from "react";
import { TodoProvider } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ListTodo, Check, Timer, Tag } from "lucide-react";
import TaskList from "@/components/TaskList";
import CategoryList from "@/components/CategoryList";
import ClassManager from "@/components/ClassManager";
import FocusTimer from "@/components/FocusTimer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewTaskForm from "@/components/NewTaskForm";

import { useTodo } from "@/context/TodoContext";

const TodoApp = () => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const { activeTask } = useTodo();

  return (
    <>
      <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">TaskFlow</h1>
            <p className="text-muted-foreground">Organize your tasks with ease</p>
          </div>
          
          <div className="flex items-center gap-2">
            {activeTask && (
              <Button
                onClick={() => setShowFocusTimer(true)}
                variant="outline"
                className="flex gap-2 items-center"
              >
                <Timer className="h-4 w-4" />
                <span>Focus Mode</span>
              </Button>
            )}
            <Button onClick={() => setIsNewTaskDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <CategoryList />
            
            <div className="p-4 bg-card rounded-lg border shadow-sm">
              <Tabs defaultValue="stats">
                <TabsList className="w-full">
                  <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
                  <TabsTrigger value="classes" className="flex-1">Classes</TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="space-y-4 pt-4">
                  <TaskStatistics />
                </TabsContent>
                <TabsContent value="classes" className="pt-4">
                  <ClassManager />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="p-4 bg-card rounded-lg border shadow-sm">
              <TaskList />
            </div>
          </div>
        </div>
      </div>
      
      <Dialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <NewTaskForm onComplete={() => setIsNewTaskDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {showFocusTimer && (
        <FocusTimer onClose={() => setShowFocusTimer(false)} />
      )}
    </>
  );
};

// Small component to show task statistics
const TaskStatistics = () => {
  const { tasks } = useTodo();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const completedPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ListTodo className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Total</span>
        </div>
        <span className="font-medium">{totalTasks}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Check className="h-4 w-4 mr-2 text-green-500" />
          <span>Completed</span>
        </div>
        <span className="font-medium">{completedTasks}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-primary" />
          <span>Pending</span>
        </div>
        <span className="font-medium">{pendingTasks}</span>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{completedPercentage}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${completedPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

export default Index;
