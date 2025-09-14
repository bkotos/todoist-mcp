import { getTasksDueToday } from '../services/tasks/tasks-due-today';
import type { MockedFunction } from 'vitest';

// Mock the tasks-due-today service
vi.mock('../services/tasks/tasks-due-today');

const mockGetTasksDueToday = getTasksDueToday as MockedFunction<
  typeof getTasksDueToday
>;

describe('get-tasks-due-today tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return tasks due today data', async () => {
    // arrange
    const mockTasks = [
      {
        id: 123,
        content: 'Complete project report',
        description: 'Finish the quarterly report',
        is_completed: false,
        labels: ['work', 'priority'],
        priority: 3,
        due_date: '2024-01-15',
        url: 'https://todoist.com/showTask?id=123',
        comment_count: 0,
      },
      {
        id: 456,
        content: 'Buy groceries',
        description: 'Milk, bread, eggs',
        is_completed: false,
        labels: ['personal'],
        priority: 2,
        due_date: '2024-01-15',
        url: 'https://todoist.com/showTask?id=456',
        comment_count: 1,
      },
    ];
    const mockResult = {
      tasks: mockTasks,
      total_count: 2,
    };
    mockGetTasksDueToday.mockResolvedValue(mockResult);

    // act
    const result = await getTasksDueToday();

    // assert
    expect(result).toEqual(mockResult);
    expect(mockGetTasksDueToday).toHaveBeenCalledTimes(1);
  });

  it('should handle error when service fails', async () => {
    // arrange
    mockGetTasksDueToday.mockRejectedValue(new Error('API Error'));

    // act
    const promise = getTasksDueToday();

    // assert
    await expect(promise).rejects.toThrow('API Error');
  });
});
