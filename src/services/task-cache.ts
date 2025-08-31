import { getTaskById } from './tasks';

// In-memory cache for task names
const taskNameCache = new Map<string, string>();

/**
 * Store a task name in the cache
 */
export function setTaskName(taskId: string, taskName: string): void {
  taskNameCache.set(taskId, taskName);
}

/**
 * Get a task name from cache or fetch from API if not cached
 */
export async function getTaskName(taskId: string): Promise<string> {
  // Check if task name is in cache
  if (taskNameCache.has(taskId)) {
    return taskNameCache.get(taskId)!;
  }

  // Fetch task from API if not in cache
  try {
    const task = await getTaskById(taskId);
    const taskName = task.content;

    // Cache the task name for future requests
    taskNameCache.set(taskId, taskName);

    return taskName;
  } catch (error) {
    throw error;
  }
}

/**
 * Clear all cached task names (for testing purposes)
 */
export function clearCache(): void {
  taskNameCache.clear();
}
