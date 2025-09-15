import { getTaskName, setTaskName, clearCache } from '../cache/task-cache';
import type { MockedFunction } from 'vitest';
import * as tasksService from '../tasks/task-retrieval';

// Mock the tasks service
vi.mock('../tasks/task-retrieval');

const mockGetTaskById = tasksService.getTaskById as MockedFunction<
  typeof tasksService.getTaskById
>;

describe('task-cache', () => {
  beforeEach(() => {
    clearCache();
    vi.clearAllMocks();
  });

  describe('setTaskName', () => {
    it('should store task name in cache', async () => {
      // arrange
      const taskId = '123';
      const taskName = 'Test Task';

      // act
      setTaskName(taskId, taskName);

      // assert
      expect(await getTaskName(taskId)).toBe(taskName);
    });

    it('should overwrite existing task name in cache', async () => {
      // arrange
      const taskId = '123';
      const originalName = 'Original Task';
      const updatedName = 'Updated Task';
      setTaskName(taskId, originalName);

      // act
      setTaskName(taskId, updatedName);

      // assert
      expect(await getTaskName(taskId)).toBe(updatedName);
    });
  });

  describe('getTaskName', () => {
    it('should return cached task name when available', async () => {
      // arrange
      const taskId = '123';
      const taskName = 'Cached Task';
      setTaskName(taskId, taskName);

      // act
      const result = await getTaskName(taskId);

      // assert
      expect(result).toBe(taskName);
      expect(mockGetTaskById).not.toHaveBeenCalled();
    });

    it('should fetch task from API when not in cache', async () => {
      // arrange
      const taskId = '123';
      const taskName = 'Fetched Task';
      mockGetTaskById.mockResolvedValue({
        id: taskId,
        project_id: 'project1',
        content: taskName,
        description: 'Test description',
        is_completed: false,
        labels: [],
        priority: 1,
        due: null,
        url: 'https://todoist.com/task/123',
        comment_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });

      // act
      const result = await getTaskName(taskId);

      // assert
      expect(result).toBe(taskName);
      expect(mockGetTaskById).toHaveBeenCalledWith(taskId);
    });

    it('should cache fetched task name for future requests', async () => {
      // arrange
      const taskId = '123';
      const taskName = 'Fetched Task';
      mockGetTaskById.mockResolvedValue({
        id: taskId,
        project_id: 'project1',
        content: taskName,
        description: 'Test description',
        is_completed: false,
        labels: [],
        priority: 1,
        due: null,
        url: 'https://todoist.com/task/123',
        comment_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });

      // act
      await getTaskName(taskId);
      const cachedResult = await getTaskName(taskId);

      // assert
      expect(cachedResult).toBe(taskName);
      expect(mockGetTaskById).toHaveBeenCalledTimes(1);
    });

    it('should throw error when task not found in API', async () => {
      // arrange
      const taskId = '999';
      mockGetTaskById.mockRejectedValue(new Error('Task not found'));

      // act
      const promise = getTaskName(taskId);

      // assert
      await expect(promise).rejects.toThrow('Task not found');
      expect(mockGetTaskById).toHaveBeenCalledWith(taskId);
    });
  });
});
