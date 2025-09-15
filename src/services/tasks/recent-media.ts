import { getTodoistClient } from '../client';
import { ProjectNames, getErrorMessage } from '../../utils';
import { TodoistTask } from '../../types';

// Define the filter query for better readability
const RECENT_MEDIA_FILTER = `##${ProjectNames.MEDIA} & !subtask & (created after: 30 days ago) & !@watched`;

// Get recent media tasks function - returns raw JSON data for recent media tasks
export async function getRecentMedia(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(RECENT_MEDIA_FILTER)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get recent media: ${getErrorMessage(error)}`);
  }
}
