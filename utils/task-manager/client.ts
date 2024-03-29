"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { createLogger, Logger } from '@brainstack/log';

export type TaskStatus = 'Pending' | 'Processing' | 'Completed';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  executeFn: () => Promise<void>;
}

export interface TaskManagerState {
  tasks: Task[];
}

// // Utility function to generate unique IDs
function generateId(): string {
    return Math.random().toString(36).substr(2, 9); // Example implementation, not truly unique
  }
  

// Helper function to create a logger
const useLogger = (): Logger => {
  const logger = useMemo(() => createLogger(5), []);
  return logger;
};

export const useTaskManagerService = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const logger = useLogger();

  const addTask = useCallback(
    (description: string, executeFn: () => Promise<void>) => {
      const newTask: Task = {
        id: generateId(),
        description,
        status: 'Pending',
        executeFn,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [],
  );

  const executeTask = useCallback(
    async (task: Task) => {
      try {
        task.status = 'Processing';
        await task.executeFn();
        task.status = 'Completed';
        logger.verbose(`Task ${task.id}: Completed`);
      } catch (error) {
        logger.error(
          `Error executing task ${task.id}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        task.status = 'Completed'; // Marking task as completed even if an error occurs
      }
      // Trigger a state update to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, status: task.status } : t,
        ),
      );
    },
    [logger],
  );

  useEffect(() => {
    const pendingTasks = tasks.filter((task) => task.status === 'Pending');
    if (pendingTasks.length > 0) {
      executeTask(pendingTasks[0]);
    }
  }, [tasks, executeTask]);

  return { addTask, tasks };
};

export default useTaskManagerService;

