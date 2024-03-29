import useTaskManagerService from '@/utils/task-manager/client';
import { useTaskManager } from '@/utils/task-manager/provider';
import React from 'react';

export const TaskComponent: React.FC = () => {
    const { addTask, tasks } =  useTaskManager()

    const handleAddTask = () => {
        addTask('Example Task', async () => {
            // Task execution logic here
            console.log('Task is executing');
        });
    };

    return (
        <div>
            <button onClick={handleAddTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.description} - {task.status}</li>
                ))}
            </ul>
        </div>
    );
};

