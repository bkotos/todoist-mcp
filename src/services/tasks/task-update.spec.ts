import axios from 'axios';
import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  updateTask,
  uncompleteTask,
  moveTask,
  completeTask,
  createTask,
} from './task-update';
import { getTodoistClient, getTodoistV1Client } from '../client';
import { getTaskName, setTaskName } from '../cache/task-cache';
import { addTaskRenameComment } from './comments';
import { getTaskById } from './task-retrieval';
import { listProjects } from '../projects/projects';
import { isBrianSharedProject } from '../../utils/project-filters';
import { TodoistProject } from '../../types';

// Mock the client module
vi.mock('../client');
vi.mock('../cache/task-cache');
vi.mock('./comments');
vi.mock('./task-retrieval');
vi.mock('../projects/projects');
// Don't mock isBrianSharedProject since it's a pure function

const mockGetTodoistClient = vi.mocked(getTodoistClient);
const mockGetTodoistV1Client = vi.mocked(getTodoistV1Client);
const mockGetTaskName = vi.mocked(getTaskName);
const mockSetTaskName = vi.mocked(setTaskName);
const mockAddTaskRenameComment = vi.mocked(addTaskRenameComment);
const mockGetTaskById = vi.mocked(getTaskById);
const mockListProjects = vi.mocked(listProjects);

describe('Task Update Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateTask', () => {
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
        post: vi.fn().mockResolvedValue({
          data: { id: '123', labels: ['work', 'urgent'] },
        }),
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

    it('should update task due string successfully', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({
          data: { id: '123', due: { string: 'next Monday' } },
        }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await updateTask({
        taskId: '123',
        dueString: 'next Monday',
      });

      // assert
      expect(result).toContain('Task updated successfully');
      expect(mockClient.post).toHaveBeenCalledWith('/tasks/123', {
        due_string: 'next Monday',
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

  describe('uncompleteTask', () => {
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
        'Failed to move task: Failed to convert ID: Task not found'
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
        'Failed to move task: Failed to convert ID: Project not found'
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
        'Failed to move task: Failed to convert ID: API Error'
      );
    });
  });

  describe('completeTask', () => {
    beforeEach(() => {
      // Set up default mocks for the new service calls
      mockGetTaskById.mockResolvedValue({
        id: '123',
        project_id: '456',
        content: 'Test task',
        description: '',
        is_completed: false,
        labels: [],
        priority: 1,
        due: null,
        url: 'https://todoist.com/task/123',
        comment_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });
      mockListProjects.mockResolvedValue({
        projects: [
          {
            id: '456',
            name: 'Personal Project',
            url: 'https://todoist.com/project/456',
            is_favorite: false,
            is_inbox_project: false,
          } as TodoistProject,
        ],
        total_count: 1,
      });
    });

    it('should complete a task successfully', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({ data: { ok: true } }),
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
        get: vi.fn(),
        post: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = completeTask('123');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to complete task: API Error'
      );
    });

    it('should handle client without post method', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = completeTask('123');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to complete task: POST method not available on client'
      );
    });

    it('should complete a task successfully when not in Brian shared project', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({ data: { ok: true } }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await completeTask('123');

      // assert
      expect(result).toBe('Task completed successfully');
    });

    it('should throw exception when task is in Brian shared project', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn(),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockGetTaskById.mockResolvedValue({
        id: '123',
        project_id: '789',
        content: 'Test task',
        description: '',
        is_completed: false,
        labels: [],
        priority: 1,
        due: null,
        url: 'https://todoist.com/task/123',
        comment_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });
      mockListProjects.mockResolvedValue({
        projects: [
          {
            id: '789',
            name: 'Brian inbox - per Becky',
            url: 'https://todoist.com/project/789',
            is_favorite: false,
            is_inbox_project: true,
          } as TodoistProject,
        ],
        total_count: 1,
      });

      // act
      const promise = completeTask('123');

      // assert
      await expect(promise).rejects.toThrow(
        'This task is in a Brian shared project. Please use the tool for completing Becky tasks instead.'
      );
    });
  });

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
});
