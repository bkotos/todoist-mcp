import axios from 'axios';
import { getTodoistClient } from './client';

interface TodoistLabel {
  id: string;
  name: string;
  color: string;
  order: number;
  is_favorite: boolean;
}

interface LabelsResponse {
  labels: Array<{
    id: number;
    name: string;
    color: string;
    order: number;
    is_favorite: boolean;
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

// Get all labels function - returns structured data for all labels
export async function getAllLabels(): Promise<LabelsResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistLabel[]>('/labels');
    const labels = response.data.map((label) => ({
      id: parseInt(label.id),
      name: label.name,
      color: label.color,
      order: label.order,
      is_favorite: label.is_favorite,
    }));

    return {
      labels,
      total_count: labels.length,
    };
  } catch (error) {
    throw new Error(`Failed to get all labels: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistLabel, LabelsResponse };
