import { updateTask } from './task-updates';
import type { MockedFunction } from "vitest";
import { getTodoistClient } from './client';
import { getTaskName, setTaskName } from './task-cache';
import { addTaskRenameComment } from './comments';

// Mock the client module
vi.mock('./client');
vi.mock('./task-cache');
vi.mock('./comments');

const mockGetTodoistClient = getTodoistClient as MockedFunction<
  typeof getTodoistClient
>;
const mockGetTaskName = getTaskName as MockedFunction<typeof getTaskName>;
const mockSetTaskName = setTaskName as MockedFunction<typeof setTaskName>;
const mockAddTaskRenameComment = addTaskRenameComment as MockedFunction<
  typeof addTaskRenameComment
>;

describe('updateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update task title successfully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({
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
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({
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
      get: vi.fn(),
      post: vi
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
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({ data: { id: '123', priority: 3 } }),
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
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({
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

  it('should update multiple fields successfully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({
        data: {
          id: '123',
          content: 'Updated Title',
          description: 'Updated description',
          priority: 2,
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
    });

    // assert
    expect(result).toContain('Task updated successfully');
    expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
      content: 'Updated Title',
      description: 'Updated description',
      priority: 2,
    });
  });

  it('should handle API error gracefully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(new Error('API Error')),
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
      get: vi.fn(),
      post: vi
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

  describe('when updating task title', () => {
    it('should fetch old title from cache when updating title', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
          data: { id: '123', content: 'New Task Title' },
        }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockGetTaskName.mockResolvedValue('Old Task Title');

      // act
      const result = await updateTask({
        taskId: '123',
        title: 'New Task Title',
      });

      // assert
      expect(mockGetTaskName).toHaveBeenCalledWith('123');
    });

    it('should create rename comment when title is updated', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
          data: { id: '123', content: 'New Task Title' },
        }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockGetTaskName.mockResolvedValue('Old Task Title');
      mockAddTaskRenameComment.mockResolvedValue({
        id: 1,
        content: 'Task renamed from `Old Task Title` to `New Task Title`',
        posted: '2024-01-01T00:00:00Z',
        posted_uid: 'user123',
        attachment: null,
      });

      // act
      const result = await updateTask({
        taskId: '123',
        title: 'New Task Title',
      });

      // assert
      expect(mockAddTaskRenameComment).toHaveBeenCalledWith(
        '123',
        'Old Task Title',
        'New Task Title'
      );
    });

    it('should update task cache with new title after successful update', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
          data: { id: '123', content: 'New Task Title' },
        }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockGetTaskName.mockResolvedValue('Old Task Title');
      mockAddTaskRenameComment.mockResolvedValue({
        id: 1,
        content: 'Task renamed from `Old Task Title` to `New Task Title`',
        posted: '2024-01-01T00:00:00Z',
        posted_uid: 'user123',
        attachment: null,
      });

      // act
      const result = await updateTask({
        taskId: '123',
        title: 'New Task Title',
      });

      // assert
      expect(mockSetTaskName).toHaveBeenCalledWith('123', 'New Task Title');
    });

    it('should not create rename comment when title is not being updated', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
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
      expect(mockAddTaskRenameComment).not.toHaveBeenCalled();
      expect(mockGetTaskName).not.toHaveBeenCalled();
      expect(mockSetTaskName).not.toHaveBeenCalled();
    });

    it('should handle cache fetch error gracefully when updating title', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
          data: { id: '123', content: 'New Task Title' },
        }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockGetTaskName.mockRejectedValue(new Error('Cache error'));

      // act
      const promise = updateTask({
        taskId: '123',
        title: 'New Task Title',
      });

      // assert
      await expect(promise).rejects.toThrow('Failed to update task');
    });

    it('should handle comment creation error gracefully when updating title', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
          data: { id: '123', content: 'New Task Title' },
        }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockGetTaskName.mockResolvedValue('Old Task Title');
      mockAddTaskRenameComment.mockRejectedValue(
        new Error('Comment creation failed')
      );

      // act
      const promise = updateTask({
        taskId: '123',
        title: 'New Task Title',
      });

      // assert
      await expect(promise).rejects.toThrow('Failed to update task');
    });
  });
});
