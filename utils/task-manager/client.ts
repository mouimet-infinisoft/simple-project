'use client';
import { useState, useEffect, useCallback, } from 'react';
import { createLogger, Logger } from '@brainstack/log';


export interface Task {
  id: string;
  description: string;
  executeFn: () => Promise<void>;
  status: 'Pending' | 'Processing' | 'Completed';
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

export interface TaskHistoryEntry extends Omit<Task, 'executeFn'> {}

const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const useTaskManagerService = () => {
  const [syncTasks, setSyncTasks] = useState<Task[]>([]);
  const [asyncTasks, setAsyncTasks] = useState<Task[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistoryEntry[]>([]);

  const addSyncTask = useCallback((description: string, executeFn: () => Promise<void>) => {
    const newTask: Task = {
      id: generateId(),
      description,
      executeFn,
      status: 'Pending',
      createdAt: new Date(),
    };
    setSyncTasks((prev) => [...prev, newTask]);
  }, []);

  const addAsyncTask = useCallback((description: string, executeFn: () => Promise<void>) => {
    const newTask: Task = {
      id: generateId(),
      description,
      executeFn,
      status: 'Pending',
      createdAt: new Date(),
    };
    setAsyncTasks((prev) => [...prev, newTask]);
  }, []);

  const executeTask = useCallback(async (task: Task, isSync: boolean) => {
    const updateTasks = isSync ? setSyncTasks : setAsyncTasks;
    try {
      // Update task to Processing
      updateTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'Processing', updatedAt: new Date() } : t)));

      await task.executeFn();

      // Update task to Completed
      updateTasks((prev) => prev.filter((t) => t.id !== task.id));
      setTaskHistory((prev) => [...prev, { ...task, status: 'Completed', completedAt: new Date() }]);
    } catch (error) {
      console.error(`Error executing task ${task.id}: ${error}`);
      // Optionally handle error status in task and task history
    }
  }, []);

  useEffect(() => {
    if (syncTasks.length > 0 && syncTasks[0].status === 'Pending') {
      executeTask(syncTasks[0], true);
    }
  }, [syncTasks, executeTask]);

  useEffect(() => {
    asyncTasks.forEach((task) => {
      if (task.status === 'Pending') {
        executeTask(task, false);
      }
    });
  }, [asyncTasks, executeTask]);

  return { addSyncTask, addAsyncTask, taskHistory, syncTasks, asyncTasks };
};


// export type TaskStatus = 'Pending' | 'Processing' | 'Completed';

// export interface Task {
//   id: string;
//   description: string;
//   status: TaskStatus;
//   executeFn: () => Promise<void>;
// }

// export interface TaskManagerState {
//   tasks: Task[];
// }

// // // Utility function to generate unique IDs
// function generateId(): string {
//   return Math.random().toString(36).substr(2, 9); // Example implementation, not truly unique
// }

// // Helper function to create a logger
// const useLogger = (): Logger => {
//   const logger = useMemo(() => createLogger(5), []);
//   return logger;
// };

// export const useTaskManagerService = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const logger = useLogger();

//   const addTask = useCallback(
//     (description: string, executeFn: () => Promise<void>) => {
//       const newTask: Task = {
//         id: generateId(),
//         description,
//         status: 'Pending',
//         executeFn
//       };
//       setTasks((prevTasks) => [...prevTasks, newTask]);
//     },
//     []
//   );

//   const executeTask = useCallback(
//     async (task: Task) => {
//       try {
//         // Create a new task object with updated status to 'Processing'
//         const updatedTask: Task = { ...task, status: 'Processing' };
//         // Update the state with this new task object
//         setTasks((prevTasks) =>
//           prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
//         );

//         await task.executeFn();

//         // After successful execution, update the task status to 'Completed'
//       } catch (error) {
//         logger.error(
//           `Error executing task ${task.id}: ${
//             error instanceof Error ? error.message : String(error)
//           }`
//         );
//       } finally {
//         setTasks((prevTasks) =>
//           prevTasks.map((t) =>
//             t.id === task.id ? { ...t, status: 'Completed' } : t
//           )
//         );
//         logger.verbose(`Task ${task.id}: Completed`);
//       }
//     },
//     [logger]
//   );

//   useEffect(() => {
//     const pendingTasks = tasks.filter((task) => task.status === 'Pending');
//     if (pendingTasks.length > 0) {
//       executeTask(pendingTasks[0]);
//     }
//   }, [tasks, executeTask]);

//   return { addTask, tasks };
// };

// export default useTaskManagerService;
