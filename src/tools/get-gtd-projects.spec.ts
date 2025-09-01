import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getGtdProjectsTool, getGtdProjectsHandler } from './get-gtd-projects';

// Mock the service module
vi.mock('../services/get-gtd-projects');

const mockGetGtdProjects = vi.mocked(
  (await import('../services/get-gtd-projects')).getGtdProjects
);

describe('getGtdProjectsTool', () => {
  it('should return projects from service', async () => {
    // arrange
    const mockProjects = {
      projects: [
        {
          id: 1,
          name: 'Project Alpha',
          url: 'https://todoist.com/showProject?id=1',
          is_favorite: false,
          is_inbox: false,
        },
      ],
      total_count: 1,
    };
    mockGetGtdProjects.mockResolvedValue(mockProjects);

    // act
    const result = await getGtdProjectsTool();

    // assert
    expect(result).toEqual(mockProjects);
    expect(mockGetGtdProjects).toHaveBeenCalledOnce();
  });

  it('should handle service error', async () => {
    // arrange
    const serviceError = new Error('Service failed');
    mockGetGtdProjects.mockRejectedValue(serviceError);

    // act
    const promise = getGtdProjectsTool();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get GTD projects: Service failed'
    );
  });
});

describe('getGtdProjectsHandler', () => {
  it('should return formatted response', async () => {
    // arrange
    const mockProjects = {
      projects: [
        {
          id: 1,
          name: 'Project Alpha',
          url: 'https://todoist.com/showProject?id=1',
          is_favorite: false,
          is_inbox: false,
        },
      ],
      total_count: 1,
    };
    mockGetGtdProjects.mockResolvedValue(mockProjects);

    // act
    const result = await getGtdProjectsHandler();

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe(JSON.stringify(mockProjects, null, 2));
  });

  it('should handle service error', async () => {
    // arrange
    const serviceError = new Error('Service failed');
    mockGetGtdProjects.mockRejectedValue(serviceError);

    // act
    const promise = getGtdProjectsHandler();

    // assert
    await expect(promise).rejects.toThrow('Service failed');
  });
});
