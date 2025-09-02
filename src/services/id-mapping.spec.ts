import type { MockedFunction } from 'vitest';
import { convertV2IdToV1 } from './id-mapping';
import { getTodoistV1Client } from './client';

// Mock the client module
vi.mock('./client');

const mockGetTodoistV1Client = getTodoistV1Client as MockedFunction<
  typeof getTodoistV1Client
>;

describe('ID Mapping Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('convertV2IdToV1', () => {
    it('should successfully convert task ID from v2 to v1 format', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({
          data: [{ new_id: 'v1_task_123', old_id: 'task_123' }],
        }),
        post: vi.fn(),
      };
      mockGetTodoistV1Client.mockReturnValue(mockClient);

      // act
      const result = await convertV2IdToV1('tasks', 'task_123');

      // assert
      expect(result).toBe('v1_task_123');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/tasks/task_123'
      );
    });

    it('should successfully convert project ID from v2 to v1 format', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({
          data: [{ new_id: 'v1_project_456', old_id: 'project_456' }],
        }),
        post: vi.fn(),
      };
      mockGetTodoistV1Client.mockReturnValue(mockClient);

      // act
      const result = await convertV2IdToV1('projects', 'project_456');

      // assert
      expect(result).toBe('v1_project_456');
      expect(mockClient.get).toHaveBeenCalledWith(
        '/api/v1/id_mappings/projects/project_456'
      );
    });

    it('should handle empty response array gracefully', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({
          data: [],
        }),
        post: vi.fn(),
      };
      mockGetTodoistV1Client.mockReturnValue(mockClient);

      // act
      const promise = convertV2IdToV1('tasks', 'nonexistent_task');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to convert ID: No mapping found'
      );
    });

    it('should handle API errors gracefully', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
        post: vi.fn(),
      };
      mockGetTodoistV1Client.mockReturnValue(mockClient);

      // act
      const promise = convertV2IdToV1('tasks', 'task_123');

      // assert
      await expect(promise).rejects.toThrow('Failed to convert ID: API Error');
    });
  });
});
