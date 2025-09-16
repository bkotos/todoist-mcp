import {
  listBeckyTimeSensitiveTasksTool,
  listBeckyInboxPerBrianTasksTool,
  listBrianTimeSensitiveTasksTool,
  listBrianInboxPerBeckyTasksTool,
  listPersonalInboxTasksTool,
} from './personal-tasks';
import type { MockedFunction } from 'vitest';
import {
  listBeckyTimeSensitiveTasks,
  listBeckyInboxPerBrianTasks,
  listBrianTimeSensitiveTasks,
  listBrianInboxPerBeckyTasks,
  listPersonalInboxTasks,
} from '../services/tasks/task-retrieval';

vi.mock('../services/tasks/task-retrieval');

const mockListBeckyTimeSensitiveTasks =
  listBeckyTimeSensitiveTasks as MockedFunction<
    typeof listBeckyTimeSensitiveTasks
  >;
const mockListBeckyInboxPerBrianTasks =
  listBeckyInboxPerBrianTasks as MockedFunction<
    typeof listBeckyInboxPerBrianTasks
  >;
const mockListBrianTimeSensitiveTasks =
  listBrianTimeSensitiveTasks as MockedFunction<
    typeof listBrianTimeSensitiveTasks
  >;
const mockListBrianInboxPerBeckyTasks =
  listBrianInboxPerBeckyTasks as MockedFunction<
    typeof listBrianInboxPerBeckyTasks
  >;
const mockListPersonalInboxTasks = listPersonalInboxTasks as MockedFunction<
  typeof listPersonalInboxTasks
>;

describe('Personal Tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listBeckyTimeSensitiveTasksTool', () => {
    it('should return JSON formatted Becky time sensitive tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Test Becky time sensitive task 1',
          description: 'Test description 1',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due_date: '2024-01-01',
          url: 'https://todoist.com/task/1',
          comment_count: 2,
        },
        {
          id: 2,
          content: 'Test Becky time sensitive task 2',
          description: 'Test description 2',
          is_completed: false,
          labels: ['label2'],
          priority: 2,
          due_date: null,
          url: 'https://todoist.com/task/2',
          comment_count: 0,
        },
      ];
      const mockResponse = {
        tasks: mockTasks,
        total_count: 2,
      };
      mockListBeckyTimeSensitiveTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBeckyTimeSensitiveTasksTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBeckyTimeSensitiveTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockListBeckyTimeSensitiveTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBeckyTimeSensitiveTasksTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBeckyTimeSensitiveTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      mockListBeckyTimeSensitiveTasks.mockRejectedValue(new Error('API Error'));

      // act
      const promise = listBeckyTimeSensitiveTasksTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
      expect(mockListBeckyTimeSensitiveTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('listBeckyInboxPerBrianTasksTool', () => {
    it('should return Becky inbox per Brian tasks', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Becky task for Brian',
          description: 'Task description',
          is_completed: false,
          labels: ['becky'],
          priority: 1,
          due_date: '2024-01-01',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
      ];
      const mockResponse = {
        tasks: mockTasks,
        total_count: 1,
      };
      mockListBeckyInboxPerBrianTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBeckyInboxPerBrianTasksTool.handler();

      // assert
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBeckyInboxPerBrianTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockListBeckyInboxPerBrianTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBeckyInboxPerBrianTasksTool.handler();

      // assert
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBeckyInboxPerBrianTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      mockListBeckyInboxPerBrianTasks.mockRejectedValue(new Error('API Error'));

      // act
      const promise = listBeckyInboxPerBrianTasksTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
    });
  });

  describe('listBrianTimeSensitiveTasksTool', () => {
    it('should return JSON formatted Brian time sensitive tasks when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Test Brian time sensitive task 1',
          description: 'Test description 1',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due_date: '2024-01-01',
          url: 'https://todoist.com/task/1',
          comment_count: 2,
        },
        {
          id: 2,
          content: 'Test Brian time sensitive task 2',
          description: 'Test description 2',
          is_completed: false,
          labels: ['label2'],
          priority: 2,
          due_date: null,
          url: 'https://todoist.com/task/2',
          comment_count: 0,
        },
      ];
      const mockResponse = {
        tasks: mockTasks,
        total_count: 2,
      };
      mockListBrianTimeSensitiveTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBrianTimeSensitiveTasksTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBrianTimeSensitiveTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockListBrianTimeSensitiveTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBrianTimeSensitiveTasksTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBrianTimeSensitiveTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      mockListBrianTimeSensitiveTasks.mockRejectedValue(new Error('API Error'));

      // act
      const promise = listBrianTimeSensitiveTasksTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
      expect(mockListBrianTimeSensitiveTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('listBrianInboxPerBeckyTasksTool', () => {
    it('should return Brian inbox per Becky tasks', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Brian task for Becky',
          description: 'Task description',
          is_completed: false,
          labels: ['brian'],
          priority: 1,
          due_date: '2024-01-01',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
      ];
      const mockResponse = {
        tasks: mockTasks,
        total_count: 1,
      };
      mockListBrianInboxPerBeckyTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBrianInboxPerBeckyTasksTool.handler();

      // assert
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBrianInboxPerBeckyTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockListBrianInboxPerBeckyTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listBrianInboxPerBeckyTasksTool.handler();

      // assert
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListBrianInboxPerBeckyTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      mockListBrianInboxPerBeckyTasks.mockRejectedValue(new Error('API Error'));

      // act
      const promise = listBrianInboxPerBeckyTasksTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
    });
  });

  describe('listPersonalInboxTasksTool', () => {
    it('should return personal inbox tasks', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Personal task',
          description: 'Task description',
          is_completed: false,
          labels: ['personal'],
          priority: 1,
          due_date: '2024-01-01',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
      ];
      const mockResponse = {
        tasks: mockTasks,
        total_count: 1,
      };
      mockListPersonalInboxTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listPersonalInboxTasksTool.handler();

      // assert
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListPersonalInboxTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockListPersonalInboxTasks.mockResolvedValue(mockResponse);

      // act
      const result = await listPersonalInboxTasksTool.handler();

      // assert
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListPersonalInboxTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      mockListPersonalInboxTasks.mockRejectedValue(new Error('API Error'));

      // act
      const promise = listPersonalInboxTasksTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
    });
  });
});
