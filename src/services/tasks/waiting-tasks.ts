import { getTodoistClient } from '../client';
import { TodoistTask, TasksResponse } from '../../types';
import { getErrorMessage } from '../../utils';

// Define the filter query for better readability
const WAITING_FILTER = '#Waiting | #Brian waiting | #Ansonia Waiting';

// Get waiting tasks function - returns structured data for waiting tasks
export async function getWaitingTasks(): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(WAITING_FILTER)}`
    );

    const tasks = response.data.map((task) => ({
      id: parseInt(task.id),
      content: task.content,
      description: task.description,
      is_completed: task.is_completed,
      labels: task.labels,
      priority: task.priority,
      due_date: task.due?.date || null,
      url: task.url,
      comment_count: task.comment_count,
    }));

    return {
      tasks,
      total_count: tasks.length,
    };
  } catch (error) {
    throw new Error(`Failed to get waiting tasks: ${getErrorMessage(error)}`);
  }
}
