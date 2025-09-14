import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getTasksDueTomorrowHandler } from './get-tasks-due-tomorrow';
import * as serviceModule from '../services/tasks/tasks-due-tomorrow';

// Mock the service module
vi.mock('../services/tasks/tasks-due-tomorrow');

const mockGetTasksDueTomorrow = vi.mocked(serviceModule.getTasksDueTomorrow);

describe('getTasksDueTomorrowHandler', () => {
  it('should return formatted JSON response with tasks due tomorrow', async () => {
    // arrange
    const mockTasks = [
      {
        id: '123',
        content: 'Review project proposal',
        due: { date: '2024-01-16' },
        project_id: '456',
        labels: ['work', 'priority'],
      },
      {
        id: '124',
        content: 'Team meeting prep',
        due: { date: '2024-01-16' },
        project_id: '789',
        labels: ['work'],
      },
    ];

    mockGetTasksDueTomorrow.mockResolvedValue(mockTasks);

    // act
    const result = await getTasksDueTomorrowHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockTasks, null, 2),
        },
      ],
    });
    expect(mockGetTasksDueTomorrow).toHaveBeenCalledOnce();
  });

  it('should handle empty response', async () => {
    // arrange
    mockGetTasksDueTomorrow.mockResolvedValue([]);

    // act
    const result = await getTasksDueTomorrowHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: '[]',
        },
      ],
    });
  });

  it('should handle service errors', async () => {
    // arrange
    const errorMessage = 'API Error';
    mockGetTasksDueTomorrow.mockRejectedValue(new Error(errorMessage));

    // act
    const promise = getTasksDueTomorrowHandler();

    // assert
    await expect(promise).rejects.toThrow(errorMessage);
  });
});
