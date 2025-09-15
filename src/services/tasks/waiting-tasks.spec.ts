import { getTodoistClient } from '../client';
import { getWaitingTasks } from './task-retrieval';

// Mock the client module
vi.mock('../client');

const mockGetTodoistClient = getTodoistClient as ReturnType<typeof vi.fn>;

// Define the filter query for better readability
const WAITING_FILTER = '#Waiting | #Brian waiting | #Ansonia Waiting';

describe('getWaitingTasks', () => {
  it('should fetch waiting tasks with the correct filter', async () => {
    // arrange
    const mockTasks = [
      {
        id: '123',
        content: 'Wait for client feedback',
        description: 'Project is on hold until client responds',
        is_completed: false,
        labels: ['Waiting', 'work'],
        priority: 2,
        due: null,
        url: 'https://todoist.com/showTask?id=123',
        comment_count: 0,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
      },
      {
        id: '456',
        content: 'Wait for vendor quote',
        description: 'Need pricing before proceeding',
        is_completed: false,
        labels: ['Brian waiting', 'business'],
        priority: 3,
        due: null,
        url: 'https://todoist.com/showTask?id=456',
        comment_count: 1,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getWaitingTasks();

    // assert
    expect(result.tasks).toHaveLength(2);
    expect(result.total_count).toBe(2);
    expect(result.tasks[0].content).toBe('Wait for client feedback');
    expect(result.tasks[1].content).toBe('Wait for vendor quote');
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(WAITING_FILTER)}`
    );
  });

  it('should handle empty response', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getWaitingTasks();

    // assert
    expect(result.tasks).toHaveLength(0);
    expect(result.total_count).toBe(0);
  });

  it('should handle API error', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getWaitingTasks();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get waiting tasks: API Error'
    );
  });

  it('should handle axios error with response data', async () => {
    // arrange
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { error: 'Rate limit exceeded' },
      },
      message: 'Request failed',
    };
    const mockClient = {
      get: vi.fn().mockRejectedValue(axiosError),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getWaitingTasks();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get waiting tasks: Rate limit exceeded'
    );
  });

  it('should map task properties correctly', async () => {
    // arrange
    const mockTasks = [
      {
        id: '789',
        content: 'Test waiting task',
        description: 'Test description',
        is_completed: false,
        labels: ['Ansonia Waiting', 'test'],
        priority: 1,
        due: null,
        url: 'https://todoist.com/showTask?id=789',
        comment_count: 5,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getWaitingTasks();

    // assert
    expect(result.tasks[0]).toEqual({
      id: 789,
      content: 'Test waiting task',
      description: 'Test description',
      is_completed: false,
      labels: ['Ansonia Waiting', 'test'],
      priority: 1,
      due_date: null,
      url: 'https://todoist.com/showTask?id=789',
      comment_count: 5,
    });
  });
});
