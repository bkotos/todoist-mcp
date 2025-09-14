import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getTasksDueThisWeekHandler } from './get-tasks-due-this-week';
import * as todoistService from '../services/tasks/tasks-due-this-week';

vi.mock('../services/tasks/tasks-due-this-week');

const mockGetTasksDueThisWeek = vi.mocked(todoistService.getTasksDueThisWeek);

describe('getTasksDueThisWeekHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return tasks due this week in MCP format', async () => {
    // arrange
    const mockTasks = [
      { id: 1, content: 'Task 1', due: { date: '2024-01-15' } },
      { id: 2, content: 'Task 2', due: { date: '2024-01-16' } },
    ];
    mockGetTasksDueThisWeek.mockResolvedValue(mockTasks);

    // act
    const result = await getTasksDueThisWeekHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockTasks, null, 2),
        },
      ],
    });
    expect(mockGetTasksDueThisWeek).toHaveBeenCalledOnce();
  });

  it('should log execution start and completion', async () => {
    // arrange
    const mockTasks = [];
    mockGetTasksDueThisWeek.mockResolvedValue(mockTasks);
    const consoleSpy = vi.spyOn(console, 'error');

    // act
    await getTasksDueThisWeekHandler();

    // assert
    expect(consoleSpy).toHaveBeenCalledWith(
      'Executing get_tasks_due_this_week...'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'get_tasks_due_this_week completed successfully'
    );
  });

  it('should handle empty results', async () => {
    // arrange
    const mockTasks = [];
    mockGetTasksDueThisWeek.mockResolvedValue(mockTasks);

    // act
    const result = await getTasksDueThisWeekHandler();

    // assert
    expect(result.content[0].text).toBe('[]');
    expect(mockGetTasksDueThisWeek).toHaveBeenCalledOnce();
  });
});
