import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getGtdProjects } from './get-gtd-projects';

// Mock the client module
vi.mock('./client');

const mockGetTodoistClient = vi.mocked(
  (await import('./client')).getTodoistClient
);

describe('getGtdProjects', () => {
  it('should return projects filtered by GTD filter', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Project Alpha',
            color: 'charcoal',
            parent_id: undefined,
            order: 1,
            comment_count: 0,
            is_shared: false,
            is_favorite: false,
            is_inbox_project: false,
            is_team_inbox: false,
            view_style: 'list',
            url: 'https://todoist.com/showProject?id=1',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            name: 'Project Beta',
            color: 'blue',
            parent_id: undefined,
            order: 2,
            comment_count: 0,
            is_shared: false,
            is_favorite: true,
            is_inbox_project: false,
            is_team_inbox: false,
            view_style: 'list',
            url: 'https://todoist.com/showProject?id=2',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getGtdProjects();

    // assert
    expect(result.projects).toHaveLength(2);
    expect(result.total_count).toBe(2);
    expect(result.projects[0]).toEqual({
      id: 1,
      name: 'Project Alpha',
      url: 'https://todoist.com/showProject?id=1',
      is_favorite: false,
      is_inbox: false,
    });
    expect(result.projects[1]).toEqual({
      id: 2,
      name: 'Project Beta',
      url: 'https://todoist.com/showProject?id=2',
      is_favorite: true,
      is_inbox: false,
    });
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(
        '(#Projects | #Brian projects | #Ansonia Projects) & !subtask & (!##BABY & !###BrianBabyFocus & !##Home Preparation & !##Cards & !##Hospital Preparation & !##Baby Care Book & !##To Pack & !##Hospital Stay & !##Post Partum & !##Questions and Concerns & !##Research & !##BabyClassNotes & !##CarPreparation & !##Food & !##Before Hospital Stay)'
      )}`
    );
  });

  it('should handle empty response', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getGtdProjects();

    // assert
    expect(result.projects).toHaveLength(0);
    expect(result.total_count).toBe(0);
  });

  it('should handle API error', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getGtdProjects();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get GTD projects: API Error'
    );
  });
});
