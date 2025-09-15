import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { uncompleteTask } from './task-update';
import { getTodoistClient } from '../client';

vi.mock('../client');

const mockGetTodoistClient = vi.mocked(getTodoistClient);

describe('uncompleteTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should uncomplete a task successfully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({ data: {} }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);
    const taskId = '12345';

    // act
    const result = await uncompleteTask(taskId);

    // assert
    expect(result).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalledWith(`/tasks/${taskId}/reopen`);
  });

  it('should handle API errors gracefully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);
    const taskId = '12345';

    // act
    const promise = uncompleteTask(taskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to uncomplete task: API Error'
    );
  });

  it('should handle network errors gracefully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(new Error('Network Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);
    const taskId = '12345';

    // act
    const promise = uncompleteTask(taskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to uncomplete task: Network Error'
    );
  });
});
