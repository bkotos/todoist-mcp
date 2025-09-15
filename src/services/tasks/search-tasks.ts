import { getTodoistClient } from '../client';
import { setTaskName } from '../cache/task-cache';
import { TodoistTask, TasksResponse } from '../../types';
import { getErrorMessage } from '../../utils';

// Search tasks function - returns structured data for tasks matching the search query
// Supports Todoist search syntax:
// - Basic search: search:meeting
// - Wildcards: search:*report*
// - Exact phrases: search:"buy groceries"
export async function searchTasks(query: string): Promise<TasksResponse> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(`search:${query}`)}`
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

    // Store task names in cache
    tasks.forEach((task) => {
      setTaskName(task.id.toString(), task.content);
    });

    return {
      tasks,
      total_count: tasks.length,
    };
  } catch (error) {
    throw new Error(`Failed to search tasks: ${getErrorMessage(error)}`);
  }
}

// Search tasks using AND operator - chains multiple search terms with "&" operator
// Each term is wrapped with search: prefix for proper Todoist search syntax
export async function searchTasksUsingAnd(
  searchTerms: string[]
): Promise<TasksResponse> {
  if (searchTerms.length === 0) {
    throw new Error('At least one search term is required');
  }

  // Validate that all search terms are non-empty after trimming
  const trimmedTerms = searchTerms.map((term) => term.trim());
  if (trimmedTerms.some((term) => term === '')) {
    throw new Error('All search terms must be non-empty');
  }

  const todoistClient = getTodoistClient();

  try {
    // Build the filter string by joining terms with " & " operator
    const filterString = trimmedTerms
      .map((term) => `search:${term}`)
      .join(' & ');

    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filterString)}`
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

    // Store task names in cache
    tasks.forEach((task) => {
      setTaskName(task.id.toString(), task.content);
    });

    return {
      tasks,
      total_count: tasks.length,
    };
  } catch (error) {
    throw new Error(`Failed to and search tasks: ${getErrorMessage(error)}`);
  }
}

// Search tasks using OR operator - chains multiple search terms with "|" operator
// Each term is wrapped with search: prefix for proper Todoist search syntax
export async function searchTasksUsingOr(
  searchTerms: string[]
): Promise<TasksResponse> {
  if (searchTerms.length === 0) {
    throw new Error('At least one search term is required');
  }

  // Validate that all search terms are non-empty after trimming
  const trimmedTerms = searchTerms.map((term) => term.trim());
  if (trimmedTerms.some((term) => term === '')) {
    throw new Error('All search terms must be non-empty');
  }

  const todoistClient = getTodoistClient();

  try {
    // Build the filter string by joining terms with " | " operator
    const filterString = trimmedTerms
      .map((term) => `search:${term}`)
      .join(' | ');

    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filterString)}`
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

    // Store task names in cache
    tasks.forEach((task) => {
      setTaskName(task.id.toString(), task.content);
    });

    return {
      tasks,
      total_count: tasks.length,
    };
  } catch (error) {
    throw new Error(`Failed to or search tasks: ${getErrorMessage(error)}`);
  }
}
