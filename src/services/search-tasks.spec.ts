import axios from 'axios';
import { getTodoistClient } from './client';
import {
  searchTasks,
  searchTasksUsingAnd,
  searchTasksUsingOr,
} from './search-tasks';
import * as taskCache from './task-cache';

// Mock the client module
jest.mock('./client');
// Mock task-cache module
jest.mock('./task-cache');

const mockGetTodoistClient = getTodoistClient as jest.MockedFunction<
  typeof getTodoistClient
>;
const mockTaskCache = taskCache as jest.Mocked<typeof taskCache>;

describe('Search Tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchTasks', () => {
    it('should search tasks with basic query when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Meeting with team',
          description: 'Discuss project updates',
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
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasks('meeting');

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Meeting with team');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:meeting')
      );
    });

    it('should throw an error when empty query is provided', async () => {
      // arrange
      const emptyQuery = '';

      // act
      const promise = searchTasks(emptyQuery);

      // assert
      await expect(promise).rejects.toThrow('Search query cannot be empty');
    });

    it('should search tasks with wildcard query', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Weekly report due Friday',
          description: 'Complete weekly report',
          is_completed: false,
          labels: ['work'],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasks('*report*');

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].content).toBe('Weekly report due Friday');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:*report*')
      );
    });

    it('should search tasks with exact phrase query', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'buy groceries',
          description: 'Get milk, bread, eggs',
          is_completed: false,
          labels: ['shopping'],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasks('"buy groceries"');

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].content).toBe('buy groceries');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:"buy groceries"')
      );
    });

    it('should handle empty search results', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasks('nonexistent');

      // assert
      expect(result.tasks).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:nonexistent')
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = searchTasks('meeting');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to search tasks: API Error'
      );
    });

    it('should handle axios errors with response data', async () => {
      // arrange
      const axiosError = new Error('Network Error') as any;
      axiosError.isAxiosError = true;
      axiosError.response = { data: { error: 'Rate limit exceeded' } };

      const mockClient = {
        get: jest.fn().mockRejectedValue(axiosError),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = searchTasks('report');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to search tasks: Rate limit exceeded'
      );
    });

    it('should store task names in cache for found tasks', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Buy groceries',
          description: 'Test description',
          is_completed: false,
          labels: [],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      await searchTasks('groceries');

      // assert
      expect(mockTaskCache.setTaskName).toHaveBeenCalledWith(
        '1',
        'Buy groceries'
      );
    });
  });

  describe('searchTasksUsingAnd', () => {
    it('should search tasks with multiple terms using AND operator when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Meeting with team about project',
          description: 'Discuss project updates',
          is_completed: false,
          labels: ['work', 'important'],
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
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasksUsingAnd(['meeting', 'team']);

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Meeting with team about project');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:meeting & search:team')
      );
    });

    it('should search tasks with three terms using AND operator', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Weekly report due Friday',
          description: 'Complete weekly report',
          is_completed: false,
          labels: ['work', 'urgent'],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasksUsingAnd(['weekly', 'report', 'friday']);

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].content).toBe('Weekly report due Friday');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' +
          encodeURIComponent('search:weekly & search:report & search:friday')
      );
    });

    it('should handle empty array of search terms', async () => {
      // arrange
      const emptyTerms: string[] = [];

      // act
      const promise = searchTasksUsingAnd(emptyTerms);

      // assert
      await expect(promise).rejects.toThrow(
        'At least one search term is required'
      );
    });

    it('should handle array with empty strings', async () => {
      // arrange
      const termsWithEmpty = ['meeting', '', 'team'];

      // act
      const promise = searchTasksUsingAnd(termsWithEmpty);

      // assert
      await expect(promise).rejects.toThrow(
        'All search terms must be non-empty'
      );
    });

    it('should handle array with whitespace-only strings', async () => {
      // arrange
      const termsWithWhitespace = ['meeting', '   ', 'team'];

      // act
      const promise = searchTasksUsingAnd(termsWithWhitespace);

      // assert
      await expect(promise).rejects.toThrow(
        'All search terms must be non-empty'
      );
    });

    it('should handle single search term', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Single term task',
          description: 'Test description',
          is_completed: false,
          labels: [],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasksUsingAnd(['single']);

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].content).toBe('Single term task');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:single')
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = searchTasksUsingAnd(['meeting', 'team']);

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to and search tasks: API Error'
      );
    });

    it('should store task names in cache for found tasks', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Cached and search task',
          description: 'Test description',
          is_completed: false,
          labels: [],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      await searchTasksUsingAnd(['cached', 'search']);

      // assert
      expect(mockTaskCache.setTaskName).toHaveBeenCalledWith(
        '1',
        'Cached and search task'
      );
    });
  });

  describe('searchTasksUsingOr', () => {
    it('should search tasks with multiple terms using OR operator when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Meeting with team about project',
          description: 'Discuss project updates',
          is_completed: false,
          labels: ['work', 'important'],
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
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasksUsingOr(['meeting', 'team']);

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].id).toBe(1);
      expect(result.tasks[0].content).toBe('Meeting with team about project');
      expect(result.total_count).toBe(1);
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:meeting | search:team')
      );
    });

    it('should search tasks with three terms using OR operator', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Weekly report due Friday',
          description: 'Complete weekly report',
          is_completed: false,
          labels: ['work', 'urgent'],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasksUsingOr(['weekly', 'report', 'friday']);

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].content).toBe('Weekly report due Friday');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' +
          encodeURIComponent('search:weekly | search:report | search:friday')
      );
    });

    it('should handle empty array of search terms', async () => {
      // arrange
      const emptyTerms: string[] = [];

      // act
      const promise = searchTasksUsingOr(emptyTerms);

      // assert
      await expect(promise).rejects.toThrow(
        'At least one search term is required'
      );
    });

    it('should handle array with empty strings', async () => {
      // arrange
      const termsWithEmpty = ['meeting', '', 'team'];

      // act
      const promise = searchTasksUsingOr(termsWithEmpty);

      // assert
      await expect(promise).rejects.toThrow(
        'All search terms must be non-empty'
      );
    });

    it('should handle array with whitespace-only strings', async () => {
      // arrange
      const termsWithWhitespace = ['meeting', '   ', 'team'];

      // act
      const promise = searchTasksUsingOr(termsWithWhitespace);

      // assert
      await expect(promise).rejects.toThrow(
        'All search terms must be non-empty'
      );
    });

    it('should handle single search term', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Single term task',
          description: 'Test description',
          is_completed: false,
          labels: [],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await searchTasksUsingOr(['single']);

      // assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].content).toBe('Single term task');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/tasks?filter=' + encodeURIComponent('search:single')
      );
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = searchTasksUsingOr(['meeting', 'team']);

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to or search tasks: API Error'
      );
    });

    it('should store task names in cache for found tasks', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Cached or search task',
          description: 'Test description',
          is_completed: false,
          labels: [],
          priority: 1,
          due: null,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      await searchTasksUsingOr(['cached', 'search']);

      // assert
      expect(mockTaskCache.setTaskName).toHaveBeenCalledWith(
        '1',
        'Cached or search task'
      );
    });
  });
});
