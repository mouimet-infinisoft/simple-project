import React from 'react';
import { useTaskManager } from '@/utils/task-manager/provider';

export const TaskComponent: React.FC = () => {
    const { addSyncTask, addAsyncTask, taskHistory, syncTasks, asyncTasks } = useTaskManager();

    const handleAddSyncTask = () => {
        addSyncTask('Example Sync Task', async () => {
            console.log('Sync task is executing');
            // Simulate task execution delay
            await new Promise(resolve => setTimeout(resolve, 1000));
        });
    };

    const handleAddAsyncTask = () => {
        addAsyncTask('Example Async Task', async () => {
            console.log('Async task is executing');
            // Simulate task execution delay
            await new Promise(resolve => setTimeout(resolve, 1000));
        });
    };

    return (
        <div>
            <button onClick={handleAddSyncTask}>Add Sync Task</button>
            <button onClick={handleAddAsyncTask}>Add Async Task</button>
            <h2>Synchronous Tasks</h2>
            <ul>
                {syncTasks.map(task => (
                    <li key={task.id}>{task.description} - {task.status}</li>
                ))}
            </ul>
            <h2>Asynchronous Tasks</h2>
            <ul>
                {asyncTasks.map(task => (
                    <li key={task.id}>{task.description} - {task.status}</li>
                ))}
            </ul>
            <h2>Task History</h2>
            <ul>
                {taskHistory.map(task => (
                    <li key={task.id}>{task.description} - {task.status} (Completed at: {task.completedAt?.toLocaleString()})</li>
                ))}
            </ul>
        </div>
    );
};
