import axios from 'axios';
import { getTodoistClient } from './client';

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

interface CommentAttachment {
  resource_type: string;
  file_name: string;
  file_size: number;
  file_url: string;
  upload_state: string;
}

interface CommentResult {
  id: number;
  content: string;
  posted: string;
  posted_uid: string;
  attachment: CommentAttachment | null;
}

interface CommentsResponse {
  comments: CommentResult[];
  total_count: number;
}

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// Helper function to create a comment with common logic
async function createCommentInternal(
  taskId: string,
  content: string
): Promise<CommentResult> {
  const todoistClient = getTodoistClient();

  if (!todoistClient.post) {
    throw new Error('POST method not available on client');
  }

  const response = await todoistClient.post<TodoistComment>('/comments', {
    task_id: taskId,
    content,
  });

  return {
    id: parseInt(response.data.id),
    content: response.data.content,
    posted: response.data.posted,
    posted_uid: response.data.posted_uid,
    attachment: response.data.attachment,
  };
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

// Create task comment function - creates a new comment on a specific task
export async function createTaskComment(
  taskId: string,
  content: string
): Promise<CommentResult> {
  try {
    const commentContent = `${content}\n\n*(commented using Claude)*`;
    return await createCommentInternal(taskId, commentContent);
  } catch (error) {
    throw new Error(`Failed to create task comment: ${getErrorMessage(error)}`);
  }
}

// Add task rename comment function - creates a comment noting the task was renamed
export async function addTaskRenameComment(
  taskId: string,
  oldTitle: string,
  newTitle: string
): Promise<CommentResult> {
  try {
    const commentContent = `Task renamed from \`${oldTitle}\` to \`${newTitle}\`\n\n*(renamed using Claude)*`;
    return await createCommentInternal(taskId, commentContent);
  } catch (error) {
    throw new Error(
      `Failed to add task rename comment: ${getErrorMessage(error)}`
    );
  }
}

// Create automated task comment function - creates a comment with automated signature
export async function createAutomatedTaskComment(
  taskId: string,
  content: string
): Promise<CommentResult> {
  try {
    const commentContent = `${content}\n\n*(automated comment from Claude)*`;
    return await createCommentInternal(taskId, commentContent);
  } catch (error) {
    throw new Error(
      `Failed to create automated task comment: ${getErrorMessage(error)}`
    );
  }
}

// Export types for testing
export type {
  TodoistComment,
  CommentsResponse,
  CommentResult,
  CommentAttachment,
};
