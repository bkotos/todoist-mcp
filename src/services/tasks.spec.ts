import axios from 'axios';
import { getTodoistClient } from './client';
import {
  listPersonalInboxTasks,
  listBrianInboxPerBeckyTasks,
  listBeckyInboxPerBrianTasks,
  listNextActions,
  listGtdProjects,
  getTaskById,
  getTasksWithLabel,
  getAreasOfFocus,
  getShoppingList,
  listBrianTimeSensitiveTasks,
  listBeckyTimeSensitiveTasks,
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

  describe('listGtdProjects', () => {
    it('should return GTD projects tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test GTD project task',
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
      const result = await listGtdProjects();

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Test GTD project task');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=(%23Projects%20%7C%20%23Brian%20projects%20%7C%20%23Ansonia%20Projects)%20%26%20!subtask%20%26%20(!%23%23BABY%20%26%20!%23%23%23BrianBabyFocus%20%26%20!%23%23Home%20Preparation%20%26%20!%23%23Cards%20%26%20!%23%23Hospital%20Preparation%20%26%20!%23%23Baby%20Care%20Book%20%26%20!%23%23To%20Pack%20%26%20!%23%23Hospital%20Stay%20%26%20!%23%23Post%20Partum%20%26%20!%23%23Questions%20and%20Concerns%20%26%20!%23%23Research%20%26%20!%23%23BabyClassNotes%20%26%20!%23%23CarPreparation%20%26%20!%23%23Food%20%26%20!%23%23Before%20Hospital%20Stay)'
      );
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listGtdProjects();

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=(%23Projects%20%7C%20%23Brian%20projects%20%7C%20%23Ansonia%20Projects)%20%26%20!subtask%20%26%20(!%23%23BABY%20%26%20!%23%23%23BrianBabyFocus%20%26%20!%23%23Home%20Preparation%20%26%20!%23%23Cards%20%26%20!%23%23Hospital%20Preparation%20%26%20!%23%23Baby%20Care%20Book%20%26%20!%23%23To%20Pack%20%26%20!%23%23Hospital%20Stay%20%26%20!%23%23Post%20Partum%20%26%20!%23%23Questions%20and%20Concerns%20%26%20!%23%23Research%20%26%20!%23%23BabyClassNotes%20%26%20!%23%23CarPreparation%20%26%20!%23%23Food%20%26%20!%23%23Before%20Hospital%20Stay)'
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listGtdProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list GTD projects: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=(%23Projects%20%7C%20%23Brian%20projects%20%7C%20%23Ansonia%20Projects)%20%26%20!subtask%20%26%20(!%23%23BABY%20%26%20!%23%23%23BrianBabyFocus%20%26%20!%23%23Home%20Preparation%20%26%20!%23%23Cards%20%26%20!%23%23Hospital%20Preparation%20%26%20!%23%23Baby%20Care%20Book%20%26%20!%23%23To%20Pack%20%26%20!%23%23Hospital%20Stay%20%26%20!%23%23Post%20Partum%20%26%20!%23%23Questions%20and%20Concerns%20%26%20!%23%23Research%20%26%20!%23%23BabyClassNotes%20%26%20!%23%23CarPreparation%20%26%20!%23%23Food%20%26%20!%23%23Before%20Hospital%20Stay)'
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

  describe('context label behavior', () => {
    it('should use filter without project exclusions when label starts with context:', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Project task with context label',
          description: 'Test description',
          is_completed: false,
          labels: ['context:work'],
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
      const result = await getTasksWithLabel('context:work');

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Project task with context label');
      expect(result.tasks[0].labels).toContain('context:work');
      expect(result.total_count).toBe(1);
      const expectedFilter = '@context:work';
      expect(mockClient.get).toHaveBeenCalledWith(
        `/tasks?filter=${encodeURIComponent(expectedFilter)}`
      );
    });

    it('should exclude project tasks when label does not start with context:', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Regular task with label',
          description: 'Test description',
          is_completed: false,
          labels: ['work'],
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
      const result = await getTasksWithLabel('work');

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Regular task with label');
      expect(result.tasks[0].labels).toContain('work');
      expect(result.total_count).toBe(1);
      const expectedFilter = '@work & !##Brian projects & !##Projects';
      expect(mockClient.get).toHaveBeenCalledWith(
        `/tasks?filter=${encodeURIComponent(expectedFilter)}`
      );
    });

    it('should use filter without project exclusions for context labels with special characters', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Task with complex context label',
          description: 'Test description',
          is_completed: false,
          labels: ['context:home-office'],
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
      const result = await getTasksWithLabel('context:home-office');

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Task with complex context label');
      expect(result.tasks[0].labels).toContain('context:home-office');
      expect(result.total_count).toBe(1);
      const expectedFilter = '@context:home-office';
      expect(mockClient.get).toHaveBeenCalledWith(
        `/tasks?filter=${encodeURIComponent(expectedFilter)}`
      );
    });
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

describe('getShoppingList', () => {
  it('should return tasks from Shopping list project', async () => {
    // arrange
    const mockTasks = [
      {
        id: '1',
        project_id: '456',
        content: 'Milk',
        description: 'Organic whole milk',
        is_completed: false,
        labels: ['dairy'],
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
        project_id: '456',
        content: 'Bread',
        description: 'Whole grain bread',
        is_completed: false,
        labels: ['bakery'],
        priority: 2,
        due: {
          date: '2024-01-15',
          string: 'Jan 15',
          lang: 'en',
          is_recurring: false,
        },
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

    // act
    const result = await getShoppingList();

    // assert
    expect(result.tasks).toHaveLength(2);
    expect(result.tasks[0].id).toBe(1);
    expect(result.tasks[0].content).toBe('Milk');
    expect(result.tasks[1].id).toBe(2);
    expect(result.tasks[1].content).toBe('Bread');
    expect(result.total_count).toBe(2);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('##Shopping list')}`
    );
  });

  it('should handle empty response', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getShoppingList();

    // assert
    expect(result.tasks).toHaveLength(0);
    expect(result.total_count).toBe(0);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('##Shopping list')}`
    );
  });

  it('should handle API errors', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getShoppingList();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tasks from Shopping list project: API Error'
    );
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('##Shopping list')}`
    );
  });

  describe('listBrianTimeSensitiveTasks', () => {
    const BRIAN_TIME_SENSITIVE_FILTER =
      '##Brian time sensitive (per Becky) & !subtask';

    it('should return Brian time sensitive tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test Brian time sensitive task',
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
      const result = await listBrianTimeSensitiveTasks();

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Test Brian time sensitive task');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        `/tasks?filter=${encodeURIComponent(BRIAN_TIME_SENSITIVE_FILTER)}`
      );
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listBrianTimeSensitiveTasks();

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        `/tasks?filter=${encodeURIComponent(BRIAN_TIME_SENSITIVE_FILTER)}`
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listBrianTimeSensitiveTasks();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list Brian time sensitive tasks: API Error'
      );
    });
  });

  describe('listBeckyTimeSensitiveTasks', () => {
    const BECKY_TIME_SENSITIVE_FILTER =
      '##Becky time sensitive (per Brian) & !subtask';

    it('should return Becky time sensitive tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Test Becky time sensitive task',
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
      const result = await listBeckyTimeSensitiveTasks();

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Test Becky time sensitive task');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        `/tasks?filter=${encodeURIComponent(BECKY_TIME_SENSITIVE_FILTER)}`
      );
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listBeckyTimeSensitiveTasks();

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        `/tasks?filter=${encodeURIComponent(BECKY_TIME_SENSITIVE_FILTER)}`
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listBeckyTimeSensitiveTasks();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list Becky time sensitive tasks: API Error'
      );
    });
  });
});
