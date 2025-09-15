import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';
import { getRecentMediaHandler } from './get-recent-media';
import { getRecentMedia } from '../services/tasks/task-retrieval';

vi.mock('../services/tasks/task-retrieval');

const mockGetRecentMedia = vi.mocked(getRecentMedia);

describe('getRecentMediaHandler', () => {
  it('should return formatted JSON response', async () => {
    // arrange
    const mockTasks = [
      {
        id: '1',
        content: 'Watch The Matrix',
        project_id: '123',
        labels: ['Media', 'Movie'],
        created_at: '2024-01-15T10:00:00Z',
        due: null,
        parent_id: null,
        description: '',
        is_completed: false,
        priority: 1,
        url: 'https://todoist.com/task/1',
        comment_count: 0,
        updated_at: '2024-01-15T10:00:00Z',
      },
    ];
    mockGetRecentMedia.mockResolvedValue(mockTasks);

    // act
    const result = await getRecentMediaHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockTasks, null, 2),
        },
      ],
    });
    expect(mockGetRecentMedia).toHaveBeenCalled();
  });

  it('should handle empty results', async () => {
    // arrange
    mockGetRecentMedia.mockResolvedValue([]);

    // act
    const result = await getRecentMediaHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: '[]',
        },
      ],
    });
    expect(mockGetRecentMedia).toHaveBeenCalled();
  });

  it('should handle service errors', async () => {
    // arrange
    mockGetRecentMedia.mockRejectedValue(new Error('Service Error'));

    // act
    const promise = getRecentMediaHandler();

    // assert
    await expect(promise).rejects.toThrow('Service Error');
    expect(mockGetRecentMedia).toHaveBeenCalled();
  });
});
