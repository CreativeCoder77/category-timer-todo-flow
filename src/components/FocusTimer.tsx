
import React, { useState, useEffect, useCallback } from "react";
import { useTodo } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, PlayCircle, PauseCircle, RotateCcw } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FocusTimerProps {
  onClose: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onClose }) => {
  const { activeTask } = useTodo();
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [cycles, setCycles] = useState(0);

  // Timer settings
  const focusTime = 25 * 60; // 25 minutes in seconds
  const breakTime = 5 * 60; // 5 minutes in seconds

  const maxTime = mode === "focus" ? focusTime : breakTime;
  const progress = (maxTime - timeLeft) / maxTime * 100;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Switch between focus and break modes
  const switchMode = useCallback(() => {
    const newMode = mode === "focus" ? "break" : "focus";
    setMode(newMode);
    setTimeLeft(newMode === "focus" ? focusTime : breakTime);
    setIsRunning(false);
    
    if (newMode === "focus") {
      setCycles(c => c + 1);
      toast("Break ended", {
        description: "Time to focus again!"
      });
    } else {
      toast("Focus session completed", {
        description: "Take a short break."
      });
    }
  }, [mode, focusTime, breakTime]);

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? focusTime : breakTime);
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    
    if (!isRunning && timeLeft === maxTime) {
      toast("Timer started", {
        description: mode === "focus" ? "Focus session started" : "Break time started"
      });
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      switchMode();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, switchMode]);

  return (
    <div className="focus-mode">
      <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          <X className="h-6 w-6" />
        </Button>
        
        <h2 className="text-2xl font-bold mb-2 text-center">
          {mode === "focus" ? "Focus Time" : "Break Time"}
        </h2>
        
        {activeTask && (
          <div className="text-center mb-6">
            <p className="text-muted-foreground">Current task:</p>
            <p className="font-medium">{activeTask.title}</p>
          </div>
        )}
        
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2">{formatTime(timeLeft)}</div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={toggleTimer}
          >
            {isRunning ? (
              <PauseCircle className="h-8 w-8" />
            ) : (
              <PlayCircle className="h-8 w-8" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={resetTimer}
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Cycle: {cycles + 1}</p>
          <p className="mt-1">
            {mode === "focus"
              ? "Stay focused on your task"
              : "Take a short break"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
