"use client";
// TaskManagerContext.tsx
import React, { createContext, useContext } from 'react';
import { Task, TaskHistoryEntry, useTaskManagerService } from './client';

interface TaskManagerContextType {
    addSyncTask: (description: string, executeFn: () => Promise<void>) => void;
    addAsyncTask: (description: string, executeFn: () => Promise<void>) => void;
    taskHistory: TaskHistoryEntry[];
    syncTasks: Task[];
    asyncTasks: Task[];
}

// Create a context with an undefined initial value
const TaskManagerContext = createContext<TaskManagerContextType | undefined>(undefined);

// Create a provider component
export const TaskManagerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const taskManager = useTaskManagerService();

    return (
        <TaskManagerContext.Provider value={taskManager}>
            {children}
        </TaskManagerContext.Provider>
    );
};

// Custom hook to use the task manager context
export const useTaskManager = (): TaskManagerContextType => {
    const context = useContext(TaskManagerContext);
    if (context === undefined) {
        throw new Error('useTaskManagerContext must be used within a TaskManagerProvider');
    }
    return context;
};
