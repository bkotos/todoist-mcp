import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getShoppingListHandler } from './get-shopping-list';
import { getShoppingList } from '../services/tasks';

vi.mock('../services/tasks');

const mockGetShoppingList = vi.mocked(getShoppingList);

describe('getShoppingListHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return shopping list tasks successfully', async () => {
    // arrange
    const mockTasks = [
      {
        id: 1,
        content: 'Milk',
        description: 'Organic whole milk',
        is_completed: false,
        labels: ['dairy'],
        priority: 1,
        due_date: '2024-01-15',
        url: 'https://todoist.com/task/1',
        comment_count: 0,
      },
      {
        id: 2,
        content: 'Bread',
        description: 'Whole grain bread',
        is_completed: false,
        labels: ['bakery'],
        priority: 2,
        due_date: '2024-01-15',
        url: 'https://todoist.com/task/2',
        comment_count: 0,
      },
    ];
    mockGetShoppingList.mockResolvedValue({
      tasks: mockTasks,
      total_count: 2,
    });

    // act
    const result = await getShoppingListHandler();

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
    expect(mockGetShoppingList).toHaveBeenCalled();
  });

  it('should handle empty response', async () => {
    // arrange
    mockGetShoppingList.mockResolvedValue({
      tasks: [],
      total_count: 0,
    });

    // act
    const result = await getShoppingListHandler();

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
    expect(mockGetShoppingList).toHaveBeenCalled();
  });

  it('should handle errors from service', async () => {
    // arrange
    mockGetShoppingList.mockRejectedValue(new Error('Service error'));

    // act
    const promise = getShoppingListHandler();

    // assert
    await expect(promise).rejects.toThrow('Service error');
    expect(mockGetShoppingList).toHaveBeenCalled();
  });
});
