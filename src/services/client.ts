import axios from 'axios';

export interface TodoistClient {
  get: <T>(url: string) => Promise<{ data: T }>;
  post?: <T>(url: string, data?: any) => Promise<{ data: T }>;
}

export interface TodoistV1Client {
  get: <T>(url: string) => Promise<{ data: T }>;
  post: <T>(url: string, data?: any) => Promise<{ data: T }>;
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

// Create v1 API client for operations that only exist in v1
function createTodoistV1Client(apiToken: string): TodoistV1Client {
  return axios.create({
    baseURL: 'https://api.todoist.com',
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

// Get the v1 client
export function getTodoistV1Client(): TodoistV1Client {
  const apiToken = process.env.TODOIST_API_TOKEN;
  if (!apiToken) {
    throw new Error('TODOIST_API_TOKEN environment variable is required');
  }

  return createTodoistV1Client(apiToken);
}
