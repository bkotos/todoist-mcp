import type { MockedFunction, Mocked } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getChoresDueTodayHandler } from './get-chores-due-today';
import { getChoresDueToday } from '../services/tasks/task-retrieval';

vi.mock('../services/tasks/task-retrieval');

const mockGetChoresDueToday = vi.mocked(getChoresDueToday);

describe('getChoresDueToday tool', () => {
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
    mockGetChoresDueToday.mockResolvedValue(mockTasks);

    // act
    const result = await getChoresDueTodayHandler();

    // assert
    expect(result.content[0].text).toBe(JSON.stringify(mockTasks, null, 2));
    expect(mockGetChoresDueToday).toHaveBeenCalledWith();
  });

  it('should return empty array when no chores are due', async () => {
    // arrange
    mockGetChoresDueToday.mockResolvedValue([]);

    // act
    const result = await getChoresDueTodayHandler();

    // assert
    expect(result.content[0].text).toBe('[]');
    expect(mockGetChoresDueToday).toHaveBeenCalledWith();
  });

  it('should handle service errors gracefully', async () => {
    // arrange
    mockGetChoresDueToday.mockRejectedValue(new Error('Service Error'));

    // act
    const promise = getChoresDueTodayHandler();

    // assert
    await expect(promise).rejects.toThrow('Service Error');
  });
});
