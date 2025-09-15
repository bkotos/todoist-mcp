import { completeTask } from './task-update';
import type { MockedFunction } from 'vitest';
import { getTodoistClient } from '../client';
import { getTaskById } from './task-retrieval';
import { listProjects } from '../projects/projects';
import { isBrianSharedProject } from '../../utils/project-filters';
import { TodoistProject } from '../../types';

vi.mock('../client');
vi.mock('./task-retrieval');
vi.mock('../projects/projects');
// Don't mock isBrianSharedProject since it's a pure function

const mockGetTodoistClient = getTodoistClient as MockedFunction<
  typeof getTodoistClient
>;
const mockGetTaskById = getTaskById as MockedFunction<typeof getTaskById>;
const mockListProjects = listProjects as MockedFunction<typeof listProjects>;

describe('completeTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    await expect(promise).rejects.toThrow('Failed to complete task: API Error');
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
});

// New tests for Brian shared project logic
describe('completeTask - Brian shared project validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
