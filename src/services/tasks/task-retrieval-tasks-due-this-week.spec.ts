import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getTasksDueThisWeek } from './task-retrieval';
import * as client from '../client';

vi.mock('../client');

const mockGetTodoistClient = vi.mocked(client.getTodoistClient);

describe('getTasksDueThisWeek', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get tasks due this week with complex filter', async () => {
    // arrange
    const mockTasks = [
      { id: 1, content: 'Task 1', due: { date: '2024-01-15' } },
      { id: 2, content: 'Task 2', due: { date: '2024-01-16' } },
    ];
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksDueThisWeek();

    // assert
    expect(result).toEqual(mockTasks);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(
        'next 7 days & (!##Tickler) & (!##Ansonia Tickler) & (!##Project - Meal prep) & ' +
          '(!shared | assigned to: Brian | ##Brian inbox - per Becky | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list) & ' +
          '(!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & ' +
          '!##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & ' +
          '!##CarPreparation & !##Food & !##Before Hospital Stay)'
      )}`
    );
  });

  it('should handle API errors gracefully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTasksDueThisWeek();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tasks due this week: API Error'
    );
  });

  it('should return empty array when no tasks found', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksDueThisWeek();

    // assert
    expect(result).toEqual([]);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(
        'next 7 days & (!##Tickler) & (!##Ansonia Tickler) & (!##Project - Meal prep) & ' +
          '(!shared | assigned to: Brian | ##Brian inbox - per Becky | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list) & ' +
          '(!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & ' +
          '!##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & ' +
          '!##CarPreparation & !##Food & !##Before Hospital Stay)'
      )}`
    );
  });
});
