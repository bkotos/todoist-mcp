import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';
import { getRecentMedia } from './task-retrieval';
import { getTodoistClient } from '../client';

vi.mock('../client');

const mockGetTodoistClient = vi.mocked(getTodoistClient);

describe('getRecentMedia', () => {
  it('should return recent media tasks from last 30 days', async () => {
    // arrange
    const mockTasks = [
      {
        id: '1',
        content: 'Watch The Matrix',
        project_id: '123',
        labels: ['Media', 'Movie'],
        created: '2024-01-15T10:00:00Z',
        due: null,
        parent_id: null,
      },
      {
        id: '2',
        content: 'Read Dune',
        project_id: '124',
        labels: ['Media', 'Book'],
        created: '2024-01-10T10:00:00Z',
        due: null,
        parent_id: null,
      },
    ];
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getRecentMedia();

    // assert
    expect(result).toEqual(mockTasks);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(
        '##Media & !subtask & (created after: 30 days ago) & !@watched'
      )}`
    );
  });

  it('should handle empty results', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getRecentMedia();

    // assert
    expect(result).toEqual([]);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(
        '##Media & !subtask & (created after: 30 days ago) & !@watched'
      )}`
    );
  });

  it('should handle API errors', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getRecentMedia();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get recent media: API Error'
    );
  });
});
