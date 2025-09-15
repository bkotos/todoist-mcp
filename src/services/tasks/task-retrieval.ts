import { getTodoistClient } from '../client';
import { setTaskName } from '../cache/task-cache';
import { ProjectNames, getErrorMessage } from '../../utils';
import { TodoistTask, TasksResponse } from '../../types';

// Baby project exclusion filter - used across multiple functions
const BABY_PROJECTS_EXCLUSION = [
  '(!##BABY',
  '& !###BrianBabyFocus',
  '& !##Home Preparation',
  '& !##Cards',
  '& !##Hospital Preparation',
  '& !##Baby Care Book',
  '& !##To Pack',
  '& !##Hospital Stay',
  '& !##Post Partum',
  '& !##Questions and Concerns',
  '& !##Research',
  '& !##BabyClassNotes',
  '& !##CarPreparation',
  '& !##Food',
  '& !##Before Hospital Stay)',
].join(' ');

// Define the filter query for better readability
const DUE_TODAY_FILTER = [
  '(today | overdue)',
  '& !##Tickler',
  '& !##Brian tickler',
  '& !##Ansonia Tickler',
  '& !##Someday',
  '& !##Brian someday',
  '& !##Brian inbox - per Becky',
  '& !##Becky inbox - per Brian',
  '& !##Shopping list',
  '& !##Becky acknowledged',
  '& !##Chores',
  '& !##rent',
  `& ${BABY_PROJECTS_EXCLUSION}`,
  '& !##Daily Chores',
  '& !##Baby Research',
  '& !##Becky someday',
].join(' ');

// Define the filter query for better readability
const WAITING_FILTER = '#Waiting | #Brian waiting | #Ansonia Waiting';

// Define the filter query for better readability
const RECENT_MEDIA_FILTER = `##${ProjectNames.MEDIA} & !subtask & (created after: 30 days ago) & !@watched`;

// Tomorrow filter - complex filter for tasks due tomorrow
const TOMORROW_FILTER = [
  'tomorrow',
  '& (!##Tickler)',
  '& (!##Chores)',
  '& (!##Brian tickler)',
  '& (!##Ansonia Tickler)',
  '& (!##Project - Meal prep)',
  '& (!shared | assigned to: Brian | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list)',
  `& ${BABY_PROJECTS_EXCLUSION}`,
].join(' ');

// This week filter - complex filter for tasks due this week
const THIS_WEEK_FILTER = [
  'next 7 days & (!##Tickler) & (!##Ansonia Tickler) & (!##Project - Meal prep) &',
  '(!shared | assigned to: Brian | ##Brian inbox - per Becky | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list) &',
  BABY_PROJECTS_EXCLUSION,
].join(' ');

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

// Generic private function to fetch tasks with a specific filter
async function fetchTasksByFilter(filter: string): Promise<TasksResponse> {
  const todoistClient = getTodoistClient();
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
}

// Get tasks due today function - returns structured data for tasks due today
export async function getTasksDueToday(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(DUE_TODAY_FILTER);
  } catch (error) {
    throw new Error(`Failed to get tasks due today: ${getErrorMessage(error)}`);
  }
}

export async function getTasksDueTomorrow(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(TOMORROW_FILTER)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get tasks due tomorrow: ${getErrorMessage(error)}`
    );
  }
}

export async function getTasksDueThisWeek(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(THIS_WEEK_FILTER)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get tasks due this week: ${getErrorMessage(error)}`
    );
  }
}

export async function getChoresDueToday(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const filter = '(today | overdue) & ##Chores';
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to get chores due today: ${getErrorMessage(error)}`
    );
  }
}

export async function getTicklerTasks(): Promise<TodoistTask[]> {
  const client = getTodoistClient();

  try {
    const filter =
      '(today | overdue) & (#Tickler | #Ansonia Tickler | #Brian tickler)';
    const response = await client.get<TodoistTask[]>(
      `/tasks?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get tickler tasks: ${getErrorMessage(error)}`);
  }
}

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

// Get waiting tasks function - returns structured data for waiting tasks
export async function getWaitingTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(WAITING_FILTER);
  } catch (error) {
    throw new Error(`Failed to get waiting tasks: ${getErrorMessage(error)}`);
  }
}

// List personal inbox tasks function - returns structured data for personal inbox tasks
export async function listPersonalInboxTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(`##${ProjectNames.INBOX} & !subtask`);
  } catch (error) {
    throw new Error(
      `Failed to list personal inbox tasks: ${getErrorMessage(error)}`
    );
  }
}

// List Brian inbox per Becky tasks function - returns structured data for Brian inbox per Becky tasks
export async function listBrianInboxPerBeckyTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      `##${ProjectNames.BRIAN_INBOX_PER_BECKY} & !subtask`
    );
  } catch (error) {
    throw new Error(
      `Failed to list Brian inbox per Becky tasks: ${getErrorMessage(error)}`
    );
  }
}

// List Becky inbox per Brian tasks function - returns structured data for Becky inbox per Brian tasks
export async function listBeckyInboxPerBrianTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      `##${ProjectNames.BECKY_INBOX_PER_BRIAN} & !subtask`
    );
  } catch (error) {
    throw new Error(
      `Failed to list Becky inbox per Brian tasks: ${getErrorMessage(error)}`
    );
  }
}

// List next actions function - returns structured data for next actions tasks
export async function listNextActions(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      '(##Next actions | ##Brian acknowledged) & !subtask'
    );
  } catch (error) {
    throw new Error(`Failed to list next actions: ${getErrorMessage(error)}`);
  }
}

// List GTD projects function - returns structured data for GTD projects tasks
export async function listGtdProjects(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      `(#Projects | #Brian projects | #Ansonia Projects) & !subtask & ${BABY_PROJECTS_EXCLUSION}`
    );
  } catch (error) {
    throw new Error(`Failed to list GTD projects: ${getErrorMessage(error)}`);
  }
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
  try {
    const filter = label.startsWith('context:')
      ? `@${label}`
      : `@${label} & !##Brian projects & !##Projects`;

    return await fetchTasksByFilter(filter);
  } catch (error) {
    throw new Error(
      `Failed to get tasks with label: ${getErrorMessage(error)}`
    );
  }
}

// Get tasks from Areas of focus project function - returns structured data for Areas of focus tasks
export async function getAreasOfFocus(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(`##${ProjectNames.AREAS_OF_FOCUS}`);
  } catch (error) {
    throw new Error(
      `Failed to get tasks from Areas of focus project: ${getErrorMessage(
        error
      )}`
    );
  }
}

// Get tasks from Shopping list project function - returns structured data for Shopping list tasks
export async function getShoppingList(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(`##${ProjectNames.SHOPPING_LIST}`);
  } catch (error) {
    throw new Error(
      `Failed to get tasks from Shopping list project: ${getErrorMessage(
        error
      )}`
    );
  }
}

// List Brian time sensitive tasks function - returns structured data for Brian time sensitive tasks
export async function listBrianTimeSensitiveTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      `##${ProjectNames.BRIAN_TIME_SENSITIVE} & !subtask`
    );
  } catch (error) {
    throw new Error(
      `Failed to list Brian time sensitive tasks: ${getErrorMessage(error)}`
    );
  }
}

// List Becky time sensitive tasks function - returns structured data for Becky time sensitive tasks
export async function listBeckyTimeSensitiveTasks(): Promise<TasksResponse> {
  try {
    return await fetchTasksByFilter(
      `##${ProjectNames.BECKY_TIME_SENSITIVE} & !subtask`
    );
  } catch (error) {
    throw new Error(
      `Failed to list Becky time sensitive tasks: ${getErrorMessage(error)}`
    );
  }
}
