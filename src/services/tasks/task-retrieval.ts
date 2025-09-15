import { getTodoistClient } from '../client';
import { setTaskName } from '../cache/task-cache';
import { ProjectNames, getErrorMessage } from '../../utils';
import { TodoistTask, TasksResponse } from '../../types';
import {
  BABY_PROJECTS_EXCLUSION,
  DUE_TODAY_FILTER,
  WAITING_FILTER,
  RECENT_MEDIA_FILTER,
  TOMORROW_FILTER,
  THIS_WEEK_FILTER,
} from './task-retrieval-filters';

// Helper function to transform TodoistTask[] to structured format
function transformTasks(tasks: TodoistTask[]) {
  return tasks.map((task) => ({
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
}

// Generic private function to fetch tasks with a specific filter and optional error handling
async function fetchTasksByFilter(
  filter: string,
  operationName: string
): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    const tasks = transformTasks(response.data);

    // Store task names in cache
    tasks.forEach((task) => {
      setTaskName(task.id.toString(), task.content);
    });

    return {
      tasks,
      total_count: tasks.length,
    };
  } catch (error) {
    throw new Error(`Failed to ${operationName}: ${getErrorMessage(error)}`);
  }
}

// Generic private function to fetch raw tasks with optional error handling
async function fetchRawTasksByFilter(
  filter: string,
  operationName: string
): Promise<TodoistTask[]> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to ${operationName}: ${getErrorMessage(error)}`);
  }
}

// Get tasks due today function - returns structured data for tasks due today
export async function getTasksDueToday(): Promise<TasksResponse> {
  return await fetchTasksByFilter(DUE_TODAY_FILTER, 'get tasks due today');
}

export async function getTasksDueTomorrow(): Promise<TodoistTask[]> {
  return await fetchRawTasksByFilter(TOMORROW_FILTER, 'get tasks due tomorrow');
}

export async function getTasksDueThisWeek(): Promise<TodoistTask[]> {
  return await fetchRawTasksByFilter(
    THIS_WEEK_FILTER,
    'get tasks due this week'
  );
}

export async function getChoresDueToday(): Promise<TodoistTask[]> {
  return await fetchRawTasksByFilter(
    '(today | overdue) & ##Chores',
    'get chores due today'
  );
}

export async function getTicklerTasks(): Promise<TodoistTask[]> {
  return await fetchRawTasksByFilter(
    '(today | overdue) & (#Tickler | #Ansonia Tickler | #Brian tickler)',
    'get tickler tasks'
  );
}

// Get recent media tasks function - returns raw JSON data for recent media tasks
export async function getRecentMedia(): Promise<TodoistTask[]> {
  return await fetchRawTasksByFilter(RECENT_MEDIA_FILTER, 'get recent media');
}

// Get waiting tasks function - returns structured data for waiting tasks
export async function getWaitingTasks(): Promise<TasksResponse> {
  return await fetchTasksByFilter(WAITING_FILTER, 'get waiting tasks');
}

// List personal inbox tasks function - returns structured data for personal inbox tasks
export async function listPersonalInboxTasks(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `##${ProjectNames.INBOX} & !subtask`,
    'list personal inbox tasks'
  );
}

// List Brian inbox per Becky tasks function - returns structured data for Brian inbox per Becky tasks
export async function listBrianInboxPerBeckyTasks(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `##${ProjectNames.BRIAN_INBOX_PER_BECKY} & !subtask`,
    'list Brian inbox per Becky tasks'
  );
}

// List Becky inbox per Brian tasks function - returns structured data for Becky inbox per Brian tasks
export async function listBeckyInboxPerBrianTasks(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `##${ProjectNames.BECKY_INBOX_PER_BRIAN} & !subtask`,
    'list Becky inbox per Brian tasks'
  );
}

// List next actions function - returns structured data for next actions tasks
export async function listNextActions(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    '(##Next actions | ##Brian acknowledged) & !subtask',
    'list next actions'
  );
}

// List GTD projects function - returns structured data for GTD projects tasks
export async function listGtdProjects(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `(#Projects | #Brian projects | #Ansonia Projects) & !subtask & ${BABY_PROJECTS_EXCLUSION}`,
    'list GTD projects'
  );
}

// Get task by id function - returns a single task by its ID
export async function getTaskById(taskId: string): Promise<TodoistTask> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistTask>(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get task by id: ${getErrorMessage(error)}`);
  }
}

// Get tasks with specific label function - returns tasks with label excluding Brian projects and Projects
// unless label starts with 'context:' in which case project tasks are included
export async function getTasksWithLabel(label: string): Promise<TasksResponse> {
  const filter = label.startsWith('context:')
    ? `@${label}`
    : `@${label} & !##Brian projects & !##Projects`;

  return await fetchTasksByFilter(filter, 'get tasks with label');
}

// Get tasks from Areas of focus project function - returns structured data for Areas of focus tasks
export async function getAreasOfFocus(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `##${ProjectNames.AREAS_OF_FOCUS}`,
    'get tasks from Areas of focus project'
  );
}

// Get tasks from Shopping list project function - returns structured data for Shopping list tasks
export async function getShoppingList(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `##${ProjectNames.SHOPPING_LIST}`,
    'get tasks from Shopping list project'
  );
}

// List Brian time sensitive tasks function - returns structured data for Brian time sensitive tasks
export async function listBrianTimeSensitiveTasks(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `##${ProjectNames.BRIAN_TIME_SENSITIVE} & !subtask`,
    'list Brian time sensitive tasks'
  );
}

// List Becky time sensitive tasks function - returns structured data for Becky time sensitive tasks
export async function listBeckyTimeSensitiveTasks(): Promise<TasksResponse> {
  return await fetchTasksByFilter(
    `##${ProjectNames.BECKY_TIME_SENSITIVE} & !subtask`,
    'list Becky time sensitive tasks'
  );
}
