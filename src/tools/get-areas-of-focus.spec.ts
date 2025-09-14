import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getAreasOfFocusHandler } from './get-areas-of-focus';
import { getAreasOfFocus } from '../services/tasks/tasks';

vi.mock('../services/tasks/tasks');

const mockGetAreasOfFocus = vi.mocked(getAreasOfFocus);

describe('getAreasOfFocusHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return areas of focus tasks successfully', async () => {
    // arrange
    const mockTasks = [
      {
        id: 1,
        content: 'Review quarterly goals',
        description: 'Strategic planning task',
        is_completed: false,
        labels: ['focus'],
        priority: 1,
        due_date: '2024-01-15',
        url: 'https://todoist.com/task/1',
        comment_count: 0,
      },
      {
        id: 2,
        content: 'Plan strategic initiatives',
        description: 'Long-term planning',
        is_completed: false,
        labels: ['planning'],
        priority: 2,
        due_date: '2024-01-20',
        url: 'https://todoist.com/task/2',
        comment_count: 1,
      },
    ];
    mockGetAreasOfFocus.mockResolvedValue({
      tasks: mockTasks,
      total_count: 2,
    });

    // act
    const result = await getAreasOfFocusHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              tasks: mockTasks,
              total_count: 2,
            },
            null,
            2
          ),
        },
      ],
    });
    expect(mockGetAreasOfFocus).toHaveBeenCalled();
  });

  it('should handle empty response', async () => {
    // arrange
    mockGetAreasOfFocus.mockResolvedValue({
      tasks: [],
      total_count: 0,
    });

    // act
    const result = await getAreasOfFocusHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              tasks: [],
              total_count: 0,
            },
            null,
            2
          ),
        },
      ],
    });
    expect(mockGetAreasOfFocus).toHaveBeenCalled();
  });

  it('should handle errors from service', async () => {
    // arrange
    mockGetAreasOfFocus.mockRejectedValue(new Error('Service error'));

    // act
    const promise = getAreasOfFocusHandler();

    // assert
    await expect(promise).rejects.toThrow('Service error');
    expect(mockGetAreasOfFocus).toHaveBeenCalled();
  });
});
