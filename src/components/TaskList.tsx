
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import { useTodo } from "@/context/TodoContext";
import { ListFilter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TaskList: React.FC = () => {
  const { tasks, categories, customClasses, activeCategory, reorderTasks } = useTodo();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  
  // Filter tasks by category, search term, and completion status
  let filteredTasks = activeCategory
    ? tasks.filter((task) => task.categoryId === activeCategory)
    : tasks;
  
  if (searchTerm) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (filterCompleted !== null) {
    filteredTasks = filteredTasks.filter((task) => task.completed === filterCompleted);
  }
  
  // Sort tasks by their order
  filteredTasks.sort((a, b) => a.order - b.order);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterCompleted === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCompleted(null)}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={filterCompleted === false ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCompleted(false)}
            className="text-xs"
          >
            Active
          </Button>
          <Button
            variant={filterCompleted === true ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCompleted(true)}
            className="text-xs"
          >
            Completed
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <ListFilter className="h-8 w-8 mx-auto mb-2" />
          <p>No tasks found</p>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <TaskItem
                        task={task}
                        categories={categories}
                        customClasses={customClasses}
                        isDragging={snapshot.isDragging}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
