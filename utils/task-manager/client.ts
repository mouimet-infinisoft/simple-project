'use client';
import { useState, useEffect, useCallback } from 'react';
import { createLogger, Logger } from '@brainstack/log';

/**
 * Defines the structure for a task.
 * 
 * @property {string} id - A unique identifier for the task.
 * @property {string} description - A brief description of what the task does.
 * @property {() => Promise<void>} executeFn - The function that will be executed as the task. It returns a promise.
 * @property {'Pending' | 'Processing' | 'Completed'} status - The current status of the task.
 * @property {Date} createdAt - The timestamp when the task was created.
 * @property {Date} [updatedAt] - The timestamp when the task was last updated. Optional.
 * @property {Date} [completedAt] - The timestamp when the task was completed. Optional.
 */

export interface Task {
  id: string;
  description: string;
  executeFn: () => Promise<void>;
  status: 'Pending' | 'Processing' | 'Completed' | 'Aborted';
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

export interface TaskHistoryEntry extends Omit<Task, 'executeFn'> {}

const generateId = (): string => Math.random().toString(36).substr(2, 9);

/**
 * A custom React hook for managing and executing synchronous and asynchronous tasks.
 * 
 * Synchronous tasks are executed one at a time, in the order they were added. They are
 * mainly used for operations that require immediate attention and sequential execution.
 * Asynchronous tasks are executed simultaneously, without waiting for one to finish before
 * starting another, suitable for background actions that do not require immediate attention.
 * 
 * The hook also tracks a history of all completed tasks.
 * 
 * @returns An object containing methods to add sync and async tasks, the current tasks, and their history.
 */
export const useTaskManagerService = () => {
  const [syncTasks, setSyncTasks] = useState<Task[]>([]);
  const [asyncTasks, setAsyncTasks] = useState<Task[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistoryEntry[]>([]);

  const addSyncTask = useCallback(
    (description: string, executeFn: () => Promise<void>) => {
      const newTask: Task = {
        id: generateId(),
        description,
        executeFn,
        status: 'Pending',
        createdAt: new Date()
      };
      setSyncTasks((prev) => [...prev, newTask]);
    },
    []
  );

  const addAsyncTask = useCallback(
    (description: string, executeFn: () => Promise<void>) => {
      const newTask: Task = {
        id: generateId(),
        description,
        executeFn,
        status: 'Pending',
        createdAt: new Date()
      };
      setAsyncTasks((prev) => [...prev, newTask]);
    },
    []
  );

  const abortAllSyncTasks = useCallback(() => {
    setSyncTasks((currentTasks) => {
      const abortedTasks = currentTasks.map((task) => ({
        ...task,
        status: 'Aborted' as const,
        updatedAt: new Date(),
        completedAt: new Date(), // Consider this as the completion time for aborted tasks
      }));
      setTaskHistory((prevHistory) => [...abortedTasks, ...prevHistory]);
      return []; // Clear the syncTasks as they are all aborted
    });
  }, []);
  
  const abortAllAsyncTasks = useCallback(() => {
    setAsyncTasks((currentTasks) => {
      const abortedTasks = currentTasks.map((task) => ({
        ...task,
        status: 'Aborted' as const,
        updatedAt: new Date(),
        completedAt: new Date(), // Consider this as the completion time for aborted tasks
      }));
      setTaskHistory((prevHistory) => [...abortedTasks, ...prevHistory]);
      return []; // Clear the asyncTasks as they are all aborted
    });
  }, []);

  const executeTask = useCallback(async (task: Task, isSync: boolean) => {
    const updateTasks = isSync ? setSyncTasks : setAsyncTasks;
    try {
      updateTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, status: 'Processing', updatedAt: new Date() }
            : t
        )
      );

      await task.executeFn();

      updateTasks((prev) => prev.filter((t) => t.id !== task.id));
      setTaskHistory((prev) => [
        { ...task, status: 'Completed', completedAt: new Date() },
        ...prev
      ]);
    } catch (error) {
      console.error(`Error executing task ${task.id}: ${error}`);
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

  return { addSyncTask, addAsyncTask, abortAllAsyncTasks, abortAllSyncTasks, taskHistory, syncTasks, asyncTasks };
};
