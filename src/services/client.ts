import axios from 'axios';

export interface TodoistClient {
  get: <T>(url: string) => Promise<{ data: T }>;
  post?: <T>(url: string, data?: any) => Promise<{ data: T }>;
}

// Create axios client
export function createTodoistClient(apiToken: string): TodoistClient {
  return axios.create({
    baseURL: 'https://api.todoist.com/rest/v2',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });
}

// Get the default client
export function getTodoistClient(): TodoistClient {
  const apiToken = process.env.TODOIST_API_TOKEN;
  if (!apiToken) {
    throw new Error('TODOIST_API_TOKEN environment variable is required');
  }

  return createTodoistClient(apiToken);
}
