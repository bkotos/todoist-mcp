import {
  listPersonalInboxTasks,
  listBrianInboxPerBeckyTasks,
  listBeckyInboxPerBrianTasks,
} from './todoist';
import { getTodoistClient } from './client';
import fs from 'fs';
import path from 'path';

// Mock the client module
jest.mock('./client');
// Mock fs module
jest.mock('fs');
jest.mock('path');

const mockGetTodoistClient = getTodoistClient as jest.MockedFunction<
  typeof getTodoistClient
>;
const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('Todoist Functions', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
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
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
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
        get: jest.fn().mockResolvedValue({ data: [] }),
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
        get: jest.fn().mockRejectedValue(new Error('API Error')),
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
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
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
        get: jest.fn().mockResolvedValue({ data: [] }),
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
        get: jest.fn().mockRejectedValue(new Error('API Error')),
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
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
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
        get: jest.fn().mockResolvedValue({ data: [] }),
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
        get: jest.fn().mockRejectedValue(new Error('API Error')),
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
});
