import { updateTask } from './task-updates';
import { getTodoistClient } from './client';

// Mock the client module
jest.mock('./client');

const mockGetTodoistClient = getTodoistClient as jest.MockedFunction<
  typeof getTodoistClient
>;

describe('updateTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update task title successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({
        data: { id: '123', content: 'Updated Task Title' },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      title: 'Updated Task Title',
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      content: 'Updated Task Title',
    });
  });

  it('should update task description successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({
        data: { id: '123', description: 'Updated description' },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      description: 'Updated description',
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      description: 'Updated description',
    });
  });

  it('should update task labels successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest
        .fn()
        .mockResolvedValue({ data: { id: '123', labels: ['work', 'urgent'] } }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      labels: ['work', 'urgent'],
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      labels: ['work', 'urgent'],
    });
  });

  it('should update task priority successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({ data: { id: '123', priority: 3 } }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      priority: 3,
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      priority: 3,
    });
  });

  it('should update task due date successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({
        data: { id: '123', due: { date: '2024-01-15' } },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      dueDate: '2024-01-15',
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      due_date: '2024-01-15',
    });
  });

  it('should update task project successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({
        data: { id: '123', project_id: '456' },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      projectId: '456',
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      project_id: '456',
    });
  });

  it('should update multiple fields successfully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockResolvedValue({
        data: {
          id: '123',
          content: 'Updated Title',
          description: 'Updated description',
          priority: 2,
          project_id: '456',
        },
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      title: 'Updated Title',
      description: 'Updated description',
      priority: 2,
      projectId: '456',
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      content: 'Updated Title',
      description: 'Updated description',
      priority: 2,
      project_id: '456',
    });
  });

  it('should handle API error gracefully', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = updateTask({
      taskId: '123',
      title: 'Updated Title',
    });

    // assert
    await expect(promise).rejects.toThrow('Failed to update task');
  });

  it('should only include provided fields in the update request', async () => {
    // arrange
    const mockClient = {
      get: jest.fn(),
      post: jest
        .fn()
        .mockResolvedValue({ data: { id: '123', content: 'Updated Title' } }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await updateTask({
      taskId: '123',
      title: 'Updated Title',
      // Note: other fields are not provided
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      content: 'Updated Title',
    });
    // Ensure no undefined fields are sent
    expect(mockClient.post).not.toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        description: undefined,
        labels: undefined,
        priority: undefined,
        due_date: undefined,
      })
    );
  });
});
