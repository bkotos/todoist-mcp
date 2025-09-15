import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getTicklerTasksHandler } from './get-tickler-tasks';
import { getTicklerTasks } from '../services/tasks/task-retrieval';

vi.mock('../services/tasks/task-retrieval');

const mockGetTicklerTasks = vi.mocked(getTicklerTasks);

describe('getTicklerTasksHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return tickler tasks in MCP format', async () => {
    // arrange
    const mockTicklerTasks = [
      {
        id: '1',
        project_id: '123',
        content: 'Review insurance policies',
        description: '',
        is_completed: false,
        labels: ['Tickler'],
        priority: 1,
        due: {
          date: '2024-01-15',
          string: '2024-01-15',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/task/1',
        comment_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
    mockGetTicklerTasks.mockResolvedValue(mockTicklerTasks);

    // act
    const result = await getTicklerTasksHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockTicklerTasks, null, 2),
        },
      ],
    });
    expect(mockGetTicklerTasks).toHaveBeenCalledOnce();
  });

  it('should handle empty results', async () => {
    // arrange
    mockGetTicklerTasks.mockResolvedValue([]);

    // act
    const result = await getTicklerTasksHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify([], null, 2),
        },
      ],
    });
  });

  it('should log execution start and completion', async () => {
    // arrange
    const mockTicklerTasks: any[] = [];
    mockGetTicklerTasks.mockResolvedValue(mockTicklerTasks);
    const consoleSpy = vi.spyOn(console, 'error');

    // act
    await getTicklerTasksHandler();

    // assert
    expect(consoleSpy).toHaveBeenCalledWith('Executing get_tickler_tasks...');
    expect(consoleSpy).toHaveBeenCalledWith(
      'get_tickler_tasks completed successfully'
    );
  });
});
