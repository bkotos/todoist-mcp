import { createTask } from './create-task';
import type { MockedFunction } from "vitest";
import { getTodoistClient } from '../client';

vi.mock('../client');

const mockGetTodoistClient = getTodoistClient as MockedFunction<
  typeof getTodoistClient
>;

describe('createTask', () => {
  it('should create a task successfully with all parameters', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({
        data: {
          id: '12345',
          content: 'Test task',
          description: 'Test description',
          project_id: '67890',
          labels: ['test-label'],
          priority: 3,
          due_date: '2024-01-15',
        },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await createTask({
      title: 'Test task',
      description: 'Test description',
      projectId: '67890',
      labels: ['test-label'],
      priority: 3,
      dueDate: '2024-01-15',
    });

    // assert
    expect(result).toContain('Task created successfully');
    expect(result).toContain('Test task');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks', {
      content: 'Test task',
      description: 'Test description',
      project_id: '67890',
      labels: ['test-label'],
      priority: 3,
      due_date: '2024-01-15',
    });
  });

  it('should create a task with minimal required parameters', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({
        data: {
          id: '12345',
          content: 'Simple task',
        },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await createTask({
      title: 'Simple task',
    });

    // assert
    expect(result).toContain('Task created successfully');
    expect(result).toContain('Simple task');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks', {
      content: 'Simple task',
    });
  });

  it('should handle API errors gracefully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = createTask({
      title: 'Test task',
    });

    // assert
    await expect(promise).rejects.toThrow('Failed to create task: API Error');
  });

  it('should handle axios errors with response data', async () => {
    // arrange
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          error: 'Invalid project ID',
        },
      },
      message: 'Request failed',
    };
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(axiosError),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = createTask({
      title: 'Test task',
      projectId: 'invalid-id',
    });

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to create task: Invalid project ID'
    );
  });

  it('should handle unknown errors', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue('Unknown error'),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = createTask({
      title: 'Test task',
    });

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to create task: Unknown error'
    );
  });
});
