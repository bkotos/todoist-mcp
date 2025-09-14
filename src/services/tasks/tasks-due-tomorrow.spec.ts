import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getTasksDueTomorrow } from './tasks-due-tomorrow';
import * as clientModule from '../client';

// Mock the client module
vi.mock('../client');

const mockGetTodoistClient = vi.mocked(clientModule.getTodoistClient);

// Define the expected filter for better readability and reuse
const EXPECTED_FILTER = [
  'tomorrow',
  '& (!##Tickler)',
  '& (!##Chores)',
  '& (!##Brian tickler)',
  '& (!##Ansonia Tickler)',
  '& (!##Project - Meal prep)',
  '& (!shared | assigned to: Brian | ##Brian acknowledged | ##Project - Meal prep | ##Shopping list)',
  '& (!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & !##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & !##CarPreparation & !##Food & !##Before Hospital Stay)',
].join(' ');

describe('getTasksDueTomorrow', () => {
  it('should return tasks due tomorrow with the correct filter', async () => {
    // arrange
    const mockTasks = [
      {
        id: '123',
        content: 'Review project proposal',
        description: 'Go through the Q4 proposal',
        is_completed: false,
        labels: ['work', 'priority'],
        priority: 3,
        due: {
          date: '2024-01-16',
          string: 'tomorrow',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/showTask?id=123',
        comment_count: 2,
        created_at: '2024-01-14T10:00:00Z',
        updated_at: '2024-01-14T10:00:00Z',
        project_id: '456',
      },
      {
        id: '124',
        content: 'Team meeting prep',
        description: "Prepare agenda for tomorrow's meeting",
        is_completed: false,
        labels: ['work'],
        priority: 2,
        due: {
          date: '2024-01-16',
          string: 'tomorrow',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/showTask?id=124',
        comment_count: 0,
        created_at: '2024-01-14T11:00:00Z',
        updated_at: '2024-01-14T11:00:00Z',
        project_id: '789',
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksDueTomorrow();

    // assert
    expect(result).toEqual(mockTasks);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(EXPECTED_FILTER)}`
    );
  });

  it('should handle API errors gracefully', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTasksDueTomorrow();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tasks due tomorrow: API Error'
    );
  });

  it('should handle empty response', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksDueTomorrow();

    // assert
    expect(result).toEqual([]);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(EXPECTED_FILTER)}`
    );
  });
});
