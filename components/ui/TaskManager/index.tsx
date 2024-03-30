import React from 'react';
import { useTaskManager } from '@/utils/task-manager/provider';
import { Task, TaskHistoryEntry } from '@/utils/task-manager/client';
import './TaskComponent.css'; 

export const TaskComponent: React.FC = () => {
  const { addSyncTask, addAsyncTask, taskHistory, syncTasks, asyncTasks } =
    useTaskManager();

  const handleAddSyncTask = () => {
    addSyncTask('Example Sync Task', async () => {
      console.log('Sync task is executing');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  };

  const handleAddAsyncTask = () => {
    addAsyncTask('Example Async Task', async () => {
      console.log('Async task is executing');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  };

  const renderTask = (task: Task | TaskHistoryEntry) => (
    <div className="task-card" key={task.id}>
      <div className={`task-status ${task.status.toLowerCase()}`}>
        {task.status}
      </div>
      <div className="task-description">{task.description}</div>
      {task.completedAt && (
        <div className="task-completed">
          Completed at: {task.completedAt.toLocaleString()}
        </div>
      )}
    </div>
  );

  return (
    <div className="task-container">
      <div className="task-actions">
        <button onClick={handleAddSyncTask}>Add Sync Task</button>
        <button onClick={handleAddAsyncTask}>Add Async Task</button>
      </div>
      <div className="task-list">
        <div className="tasks">
          <h2>Synchronous Tasks</h2>
          {syncTasks.map(renderTask)}
        </div>

        <div className="tasks">
          <h2>Asynchronous Tasks</h2>
          {asyncTasks.map(renderTask)}
        </div>

        <div className="tasks">
          <h2>Task History</h2>
          {taskHistory.map(renderTask)}
        </div>
      </div>
    </div>
  );
};
