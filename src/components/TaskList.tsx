
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import { useTodo } from "@/context/TodoContext";
import { ListFilter, Search, Calendar, Flag, SortDesc, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type SortField = "order" | "dueDate" | "priority" | "title";
type SortDir = "asc" | "desc";

const TaskList: React.FC = () => {
  const { tasks, categories, customClasses, activeCategory, reorderTasks } = useTodo();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [sortField, setSortField] = useState<SortField>("order");
  const [sortDirection, setSortDirection] = useState<SortDir>("asc");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  
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
  
  if (filterPriority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === filterPriority);
  }
  
  // Sort tasks
  filteredTasks.sort((a, b) => {
    if (sortField === "order") {
      return sortDirection === "asc" ? a.order - b.order : b.order - a.order;
    }
    
    if (sortField === "title") {
      if (!a.title || !b.title) return 0;
      return sortDirection === "asc" 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    }
    
    if (sortField === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return sortDirection === "asc" ? 1 : -1;
      if (!b.dueDate) return sortDirection === "asc" ? -1 : 1;
      
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 };
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      return sortDirection === "asc" ? priorityA - priorityB : priorityB - priorityA;
    }
    
    return 0;
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        
        <div className="flex gap-2 flex-wrap">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Flag className="h-3 w-3 mr-1" />
                Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterPriority(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("high")}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("medium")}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("low")}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                {sortDirection === "asc" ? (
                  <SortAsc className="h-3 w-3 mr-1" />
                ) : (
                  <SortDesc className="h-3 w-3 mr-1" />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSortField("order"); toggleSortDirection(); }}>
                Manual Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField("title"); toggleSortDirection(); }}>
                Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField("dueDate"); toggleSortDirection(); }}>
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField("priority"); toggleSortDirection(); }}>
                Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                      className="animate-fade-in"
                      style={{
                        ...provided.draggableProps.style,
                        transitionDelay: `${index * 50}ms`
                      }}
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
