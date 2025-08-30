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
export type { TodoistComment, CommentsResponse };
