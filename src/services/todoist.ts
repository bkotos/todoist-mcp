import axios from 'axios';
import { getTodoistClient, TodoistClient } from './client';
import fs from 'fs';
import path from 'path';

interface TodoistTask {
  id: string;
  project_id: string;
  content: string;
  description: string;
  is_completed: boolean;
  labels: string[];
  priority: number;
  due: {
    date: string;
    string: string;
    lang: string;
    is_recurring: boolean;
  } | null;
  url: string;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface TasksResponse {
  tasks: Array<{
    id: number;
    content: string;
    description: string;
    is_completed: boolean;
    labels: string[];
    priority: number;
    due_date: string | null;
    url: string;
    comment_count: number;
  }>;
  total_count: number;
}

interface TodoistComment {
  id: string;
  task_id: string;
  project_id: string;
  posted: string;
  content: string;
  attachment: {
    resource_type: string;
    file_name: string;
    file_size: number;
    file_url: string;
    upload_state: string;
  } | null;
  posted_uid: string;
  uids_to_notify: string[];
  is_rtl: boolean;
  reactions: Record<string, any>;
}

interface CommentsResponse {
  comments: Array<{
    id: number;
    content: string;
    posted: string;
    posted_uid: string;
    attachment: {
      resource_type: string;
      file_name: string;
      file_size: number;
      file_url: string;
      upload_state: string;
    } | null;
  }>;
  total_count: number;
}

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// List personal inbox tasks function - returns structured data for personal inbox tasks
export async function listPersonalInboxTasks(): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();

  try {
    const filter = '##Inbox & !subtask';
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
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
    throw new Error(
      `Failed to list personal inbox tasks: ${getErrorMessage(error)}`
    );
  }
}

// List Brian inbox per Becky tasks function - returns structured data for Brian inbox per Becky tasks
export async function listBrianInboxPerBeckyTasks(): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();

  try {
    const filter = '##Brian inbox - per Becky & !subtask';
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
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
    throw new Error(
      `Failed to list Brian inbox per Becky tasks: ${getErrorMessage(error)}`
    );
  }
}

// List Becky inbox per Brian tasks function - returns structured data for Becky inbox per Brian tasks
export async function listBeckyInboxPerBrianTasks(): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();

  try {
    const filter = '##Becky inbox - per Brian & !subtask';
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
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
    throw new Error(
      `Failed to list Becky inbox per Brian tasks: ${getErrorMessage(error)}`
    );
  }
}

// Get task comments function - returns structured data for comments on a specific task
export async function getTaskComments(
  taskId: string
): Promise<CommentsResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistComment[]>(
      `/comments?task_id=${taskId}`
    );
    const comments = response.data.map((comment) => ({
      id: parseInt(comment.id),
      content: comment.content,
      posted: comment.posted,
      posted_uid: comment.posted_uid,
      attachment: comment.attachment,
    }));

    return {
      comments,
      total_count: comments.length,
    };
  } catch (error) {
    throw new Error(`Failed to get task comments: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistTask, TasksResponse, TodoistComment, CommentsResponse };
