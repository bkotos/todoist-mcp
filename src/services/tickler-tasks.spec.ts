import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getTicklerTasks } from './tickler-tasks';
import { getTodoistClient } from './client';

vi.mock('./client');

const mockGetTodoistClient = vi.mocked(getTodoistClient);

describe('getTicklerTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return tickler tasks that are due today or overdue', async () => {
    // arrange
    const mockTicklerTasks = [
      {
        id: '1',
        content: 'Review insurance policies',
        due: { date: '2024-01-15' },
        labels: ['Tickler'],
      },
      {
        id: '2',
        content: 'Schedule dentist appointment',
        due: { date: '2024-01-14' },
        labels: ['Ansonia Tickler'],
      },
    ];
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTicklerTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTicklerTasks();

    // assert
    expect(result).toEqual(mockTicklerTasks);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(
        '(today | overdue) & (#Tickler | #Ansonia Tickler | #Brian tickler)'
      )}`
    );
  });

  it('should handle empty results when no tickler tasks are due', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTicklerTasks();

    // assert
    expect(result).toEqual([]);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(
        '(today | overdue) & (#Tickler | #Ansonia Tickler | #Brian tickler)'
      )}`
    );
  });

  it('should throw error when API call fails', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTicklerTasks();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tickler tasks: API Error'
    );
  });
});
