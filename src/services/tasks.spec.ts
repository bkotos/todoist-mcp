import axios from 'axios';
import { getTodoistClient } from './client';
import {
  listPersonalInboxTasks,
  listBrianInboxPerBeckyTasks,
  listBeckyInboxPerBrianTasks,
  listNextActions,
  getTaskById,
  getTasksWithLabel,
  getAreasOfFocus,
} from './tasks';
import * as taskCache from './task-cache';
import fs from 'fs';
import path from 'path';
import type { MockedFunction, Mocked } from 'vitest';

// Mock the client module
vi.mock('./client');
// Mock fs module
vi.mock('fs');
vi.mock('path');
// Mock task-cache module
vi.mock('./task-cache');

const mockGetTodoistClient = getTodoistClient as MockedFunction<
  typeof getTodoistClient
>;
const mockTaskCache = taskCache as Mocked<typeof taskCache>;
const mockFs = fs as Mocked<typeof fs>;
const mockPath = path as Mocked<typeof path>;

describe('Tasks Functions', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('listPersonalInboxTasks', () => {
    it('should return personal inbox tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test personal inbox task',
          description: 'Test description',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due: {
            date: '2024-01-01',
            string: 'Jan 1',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/task/1',
          comment_count: 2,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listPersonalInboxTasks();

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Test personal inbox task');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Inbox%20%26%20!subtask'
      );
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listPersonalInboxTasks();

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Inbox%20%26%20!subtask'
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listPersonalInboxTasks();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list personal inbox tasks: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Inbox%20%26%20!subtask'
      );
    });
  });

  describe('listBrianInboxPerBeckyTasks', () => {
    it('should return Brian inbox per Becky tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test Brian inbox per Becky task',
          description: 'Test description',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due: {
            date: '2024-01-01',
            string: 'Jan 1',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/task/1',
          comment_count: 2,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listBrianInboxPerBeckyTasks();

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Test Brian inbox per Becky task');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Brian%20inbox%20-%20per%20Becky%20%26%20!subtask'
      );
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listBrianInboxPerBeckyTasks();

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Brian%20inbox%20-%20per%20Becky%20%26%20!subtask'
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listBrianInboxPerBeckyTasks();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list Brian inbox per Becky tasks: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Brian%20inbox%20-%20per%20Becky%20%26%20!subtask'
      );
    });

    it('should store task names in cache when fetching Brian inbox per Becky tasks', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test Brian inbox per Becky task 1',
          description: 'Test description 1',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due: {
            date: '2024-01-01',
            string: 'Jan 1',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/task/1',
          comment_count: 2,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          project_id: '456',
          content: 'Test Brian inbox per Becky task 2',
          description: 'Test description 2',
          is_completed: false,
          labels: ['label2'],
          priority: 2,
          due: null,
          url: 'https://todoist.com/task/2',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockTaskCache.setTaskName = vi.fn();

      // act
      await listBrianInboxPerBeckyTasks();

      // assert
      expect(mockTaskCache.setTaskName).toHaveBeenCalledWith(
        '1',
        'Test Brian inbox per Becky task 1'
      );
      expect(mockTaskCache.setTaskName).toHaveBeenCalledWith(
        '2',
        'Test Brian inbox per Becky task 2'
      );
    });
  });

  describe('listBeckyInboxPerBrianTasks', () => {
    it('should return Becky inbox per Brian tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test Becky inbox per Brian task',
          description: 'Test description',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due: {
            date: '2024-01-01',
            string: 'Jan 1',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/task/1',
          comment_count: 2,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listBeckyInboxPerBrianTasks();

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Test Becky inbox per Brian task');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Becky%20inbox%20-%20per%20Brian%20%26%20!subtask'
      );
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listBeckyInboxPerBrianTasks();

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Becky%20inbox%20-%20per%20Brian%20%26%20!subtask'
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listBeckyInboxPerBrianTasks();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list Becky inbox per Brian tasks: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=%23%23Becky%20inbox%20-%20per%20Brian%20%26%20!subtask'
      );
    });
  });

  describe('listNextActions', () => {
    it('should return next actions tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test next action task',
          description: 'Test description',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due: {
            date: '2024-01-01',
            string: 'Jan 1',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/task/1',
          comment_count: 2,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listNextActions();

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Test next action task');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=(%23%23Next%20actions%20%7C%20%23%23Brian%20acknowledged)%20%26%20!subtask'
      );
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listNextActions();

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=(%23%23Next%20actions%20%7C%20%23%23Brian%20acknowledged)%20%26%20!subtask'
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listNextActions();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list next actions: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=(%23%23Next%20actions%20%7C%20%23%23Brian%20acknowledged)%20%26%20!subtask'
      );
    });
  });
});

describe('getTaskById', () => {
  it('should fetch task by id successfully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          content: 'Test Task',
          description: 'Test Description',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due: {
            date: '2024-01-01',
            string: 'Jan 1',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/task/123',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTaskById('123');

    // assert
    expect(result).toEqual({
      id: '123',
      content: 'Test Task',
      description: 'Test Description',
      is_completed: false,
      labels: ['label1'],
      priority: 1,
      due: {
        date: '2024-01-01',
        string: 'Jan 1',
        lang: 'en',
        is_recurring: false,
      },
      url: 'https://todoist.com/task/123',
      comment_count: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    });
    expect(mockClient.get).toHaveBeenCalledWith('/tasks/123');
  });

  it('should handle API error when task not found', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Task not found')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTaskById('999');

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get task by id: Task not found'
    );
    expect(mockClient.get).toHaveBeenCalledWith('/tasks/999');
  });
});

describe('getTasksWithLabel', () => {
  it('should return tasks with specific label', async () => {
    // arrange
    const mockTasks = [
      {
        id: '1',
        project_id: '123',
        content: 'Test task with label',
        description: 'Test description',
        is_completed: false,
        labels: ['urgent'],
        priority: 1,
        due: {
          date: '2024-01-01',
          string: 'Jan 1',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/task/1',
        comment_count: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksWithLabel('urgent');

    // assert
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].id).toBe(1);
    expect(result.tasks[0].content).toBe('Test task with label');
    expect(result.tasks[0].labels).toContain('urgent');
    expect(result.total_count).toBe(1);
    const expectedFilter = '@urgent & !##Brian projects & !##Projects';
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(expectedFilter)}`
    );
  });

  it('should handle empty response', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksWithLabel('urgent');

    // assert
    expect(result.tasks).toHaveLength(0);
    expect(result.total_count).toBe(0);
    const expectedFilter = '@urgent & !##Brian projects & !##Projects';
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(expectedFilter)}`
    );
  });

  it('should handle API errors', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTasksWithLabel('urgent');

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tasks with label: API Error'
    );
    const expectedFilter = '@urgent & !##Brian projects & !##Projects';
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(expectedFilter)}`
    );
  });
});

describe('getAreasOfFocus', () => {
  it('should return tasks from Areas of focus project', async () => {
    // arrange
    const mockTasks = [
      {
        id: '1',
        project_id: '123',
        content: 'Review quarterly goals',
        description: 'Strategic planning task',
        is_completed: false,
        labels: ['focus'],
        priority: 1,
        due: {
          date: '2024-01-15',
          string: 'Jan 15',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/task/1',
        comment_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        project_id: '123',
        content: 'Plan strategic initiatives',
        description: 'Long-term planning',
        is_completed: false,
        labels: ['planning'],
        priority: 2,
        due: {
          date: '2024-01-20',
          string: 'Jan 20',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/task/2',
        comment_count: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getAreasOfFocus();

    // assert
    expect(result.tasks).toHaveLength(2);
    expect(result.tasks[0].id).toBe(1);
    expect(result.tasks[0].content).toBe('Review quarterly goals');
    expect(result.tasks[1].id).toBe(2);
    expect(result.tasks[1].content).toBe('Plan strategic initiatives');
    expect(result.total_count).toBe(2);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('##Areas of focus')}`
    );
  });

  it('should handle empty response', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getAreasOfFocus();

    // assert
    expect(result.tasks).toHaveLength(0);
    expect(result.total_count).toBe(0);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('##Areas of focus')}`
    );
  });

  it('should handle API errors', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getAreasOfFocus();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tasks from Areas of focus project: API Error'
    );
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('##Areas of focus')}`
    );
  });
});
