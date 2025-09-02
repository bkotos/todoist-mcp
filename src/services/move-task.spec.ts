import axios from 'axios';
import type { MockedFunction } from 'vitest';
import { getTodoistClient, getTodoistV1Client } from './client';
import { moveTask } from './move-task';

// Mock the client module
vi.mock('./client');

const mockGetTodoistV1Client = getTodoistV1Client as MockedFunction<
  typeof getTodoistV1Client
>;

describe('Move Task Functions', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('moveTask', () => {
    it('should successfully move a task to a new project', async () => {
      // arrange
      const mockTaskIdMapping = [
        { new_id: 'v1_task_id_123', old_id: 'task_123' },
      ];
      const mockProjectIdMapping = [
        { new_id: 'v1_project_id_456', old_id: 'project_456' },
      ];
      const mockMoveResponse = { success: true };

      const mockV1Client = {
        get: vi
          .fn()
          .mockResolvedValueOnce({ data: mockTaskIdMapping })
          .mockResolvedValueOnce({ data: mockProjectIdMapping }),
        post: vi.fn().mockResolvedValue({ data: mockMoveResponse }),
      };
      mockGetTodoistV1Client.mockReturnValue(mockV1Client);

      // act
      await moveTask('task_123', 'project_456');

      // assert
      // Function should complete without throwing an error
      expect(mockV1Client.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/tasks/task_123'
      );
      expect(mockV1Client.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/projects/project_456'
      );
      expect(mockV1Client.post).toHaveBeenCalledWith(
        '/api/v1/tasks/v1_task_id_123/move',
        {
          project_id: 'v1_project_id_456',
        }
      );
    });

    it('should handle task ID mapping error', async () => {
      // arrange
      const mockV1Client = {
        get: vi.fn().mockRejectedValue(new Error('Task not found')),
        post: vi.fn(),
      };
      mockGetTodoistV1Client.mockReturnValue(mockV1Client);

      // act
      const promise = moveTask('invalid_task', 'project_456');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to move task: Task not found'
      );
      expect(mockV1Client.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/tasks/invalid_task'
      );
    });

    it('should handle project ID mapping error', async () => {
      // arrange
      const mockTaskIdMapping = [
        { new_id: 'v1_task_id_123', old_id: 'task_123' },
      ];
      const mockV1Client = {
        get: vi
          .fn()
          .mockResolvedValueOnce({ data: mockTaskIdMapping })
          .mockRejectedValueOnce(new Error('Project not found')),
        post: vi.fn(),
      };
      mockGetTodoistV1Client.mockReturnValue(mockV1Client);

      // act
      const promise = moveTask('task_123', 'invalid_project');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to move task: Project not found'
      );
      expect(mockV1Client.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/tasks/task_123'
      );
      expect(mockV1Client.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/projects/invalid_project'
      );
    });

    it('should handle move operation error', async () => {
      // arrange
      const mockTaskIdMapping = [
        { new_id: 'v1_task_id_123', old_id: 'task_123' },
      ];
      const mockProjectIdMapping = [
        { new_id: 'v1_project_id_456', old_id: 'project_456' },
      ];
      const mockV1Client = {
        get: vi
          .fn()
          .mockResolvedValueOnce({ data: mockTaskIdMapping })
          .mockResolvedValueOnce({ data: mockProjectIdMapping }),
        post: vi.fn().mockRejectedValue(new Error('Move operation failed')),
      };
      mockGetTodoistV1Client.mockReturnValue(mockV1Client);

      // act
      const promise = moveTask('task_123', 'project_456');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to move task: Move operation failed'
      );
      expect(mockV1Client.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/tasks/task_123'
      );
      expect(mockV1Client.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/projects/project_456'
      );
      expect(mockV1Client.post).toHaveBeenCalledWith(
        '/api/v1/tasks/v1_task_id_123/move',
        {
          project_id: 'v1_project_id_456',
        }
      );
    });

    it('should handle axios error responses', async () => {
      // arrange
      const axiosError = new axios.AxiosError('API Error');
      axiosError.response = {
        data: { error: 'Invalid task ID' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      const mockV1Client = {
        get: vi.fn().mockRejectedValue(axiosError),
        post: vi.fn(),
      };
      mockGetTodoistV1Client.mockReturnValue(mockV1Client);

      // act
      const promise = moveTask('invalid_task', 'project_456');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to move task: Invalid task ID'
      );
    });
  });
});
