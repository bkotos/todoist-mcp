import type { MockedFunction, Mocked } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getChoresDueToday } from './task-retrieval';
import { getTodoistClient } from '../client';

vi.mock('../client');

const mockGetTodoistClient = vi.mocked(getTodoistClient);

describe('getChoresDueToday', () => {
  it('should return chores due today or overdue', async () => {
    // arrange
    const mockTasks = [
      {
        id: '1',
        content: 'Do laundry',
        due: { date: '2024-01-15' },
        project_id: '123',
        labels: ['chore'],
      },
      {
        id: '2',
        content: 'Clean kitchen',
        due: { date: '2024-01-14' },
        project_id: '123',
        labels: ['chore'],
      },
    ];
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getChoresDueToday();

    // assert
    expect(result).toEqual(mockTasks);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('(today | overdue) & ##Chores')}`
    );
  });

  it('should return no chores message when no chores are due', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getChoresDueToday();

    // assert
    expect(result).toEqual([]);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent('(today | overdue) & ##Chores')}`
    );
  });

  it('should handle API errors gracefully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getChoresDueToday();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get chores due today: API Error'
    );
  });
});
