import { completeTask } from './complete-task';
import { getTodoistClient } from './client';

jest.mock('./client');

const mockGetTodoistClient = getTodoistClient as jest.MockedFunction<
  typeof getTodoistClient
>;

describe('completeTask', () => {
  it('should complete a task successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({ data: { ok: true } }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await completeTask('123');

    // assert
    expect(result).toBe('Task completed successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123/close');
  });

  it('should handle API error when completing task', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = completeTask('123');

    // assert
    await expect(promise).rejects.toThrow('Failed to complete task: API Error');
  });

  it('should handle client without post method', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = completeTask('123');

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to complete task: POST method not available on client'
    );
  });
});
