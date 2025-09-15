import { getWaitingTasks } from '../services/tasks/task-retrieval';
import type { MockedFunction } from 'vitest';

// Mock the waiting-tasks service
vi.mock('../services/tasks/task-retrieval');

const mockGetWaitingTasks = getWaitingTasks as MockedFunction<
  typeof getWaitingTasks
>;

describe('get-waiting-tasks tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return waiting tasks data', async () => {
    // arrange
    const mockTasks = [
      {
        id: 123,
        content: 'Wait for client feedback',
        description: 'Project is on hold until client responds',
        is_completed: false,
        labels: ['Waiting', 'work'],
        priority: 2,
        due_date: null,
        url: 'https://todoist.com/showTask?id=123',
        comment_count: 0,
      },
      {
        id: 456,
        content: 'Wait for vendor quote',
        description: 'Need pricing before proceeding',
        is_completed: false,
        labels: ['Brian waiting', 'business'],
        priority: 3,
        due_date: null,
        url: 'https://todoist.com/showTask?id=456',
        comment_count: 1,
      },
    ];
    const mockResult = {
      tasks: mockTasks,
      total_count: 2,
    };
    mockGetWaitingTasks.mockResolvedValue(mockResult);

    // act
    const result = await getWaitingTasks();

    // assert
    expect(result).toEqual(mockResult);
    expect(mockGetWaitingTasks).toHaveBeenCalledTimes(1);
  });

  it('should handle error when service fails', async () => {
    // arrange
    mockGetWaitingTasks.mockRejectedValue(new Error('API Error'));

    // act
    const promise = getWaitingTasks();

    // assert
    await expect(promise).rejects.toThrow('API Error');
  });
});
