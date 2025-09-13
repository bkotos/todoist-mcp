import type { MockedFunction } from 'vitest';
import {
  getBrianOnlyProjects,
  getBrianSharedProjects,
  getBeckySharedProjects,
  getInboxProjects,
} from './project-filters';
import { getTodoistClient } from './client';

// Mock the client module
vi.mock('./client');

// Mock the projects service
vi.mock('./projects');
import { listProjects } from './projects';
const mockListProjects = listProjects as any;

describe('Project Filters', () => {
  // Shared test data with all projects
  const allProjects = [
    {
      id: 1,
      name: 'Areas of focus',
      url: 'https://todoist.com/project/1',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 2,
      name: 'Inbox',
      url: 'https://todoist.com/project/2',
      is_favorite: false,
      is_inbox: true,
    },
    {
      id: 3,
      name: 'Media',
      url: 'https://todoist.com/project/3',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 4,
      name: 'Musings',
      url: 'https://todoist.com/project/4',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 5,
      name: 'Next actions',
      url: 'https://todoist.com/project/5',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 6,
      name: 'Contextual',
      url: 'https://todoist.com/project/6',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 7,
      name: 'Projects',
      url: 'https://todoist.com/project/7',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 8,
      name: 'Calendar',
      url: 'https://todoist.com/project/8',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 9,
      name: 'Tickler',
      url: 'https://todoist.com/project/9',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 10,
      name: 'Someday',
      url: 'https://todoist.com/project/10',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 11,
      name: 'Waiting',
      url: 'https://todoist.com/project/11',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 12,
      name: 'Chores',
      url: 'https://todoist.com/project/12',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 13,
      name: 'Graveyard',
      url: 'https://todoist.com/project/13',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 14,
      name: 'Graveyard - read',
      url: 'https://todoist.com/project/14',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 15,
      name: 'Graveyard - watch',
      url: 'https://todoist.com/project/15',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 16,
      name: 'Brian inbox - per Becky',
      url: 'https://todoist.com/project/16',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 17,
      name: 'Brian acknowledged',
      url: 'https://todoist.com/project/17',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 18,
      name: 'Brian projects',
      url: 'https://todoist.com/project/18',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 19,
      name: 'Brian waiting',
      url: 'https://todoist.com/project/19',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 20,
      name: 'Brian someday',
      url: 'https://todoist.com/project/20',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 21,
      name: 'Brian tickler',
      url: 'https://todoist.com/project/21',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 22,
      name: 'Brian contextual',
      url: 'https://todoist.com/project/22',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 23,
      name: 'Becky someday',
      url: 'https://todoist.com/project/23',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 24,
      name: 'Becky inbox - per Brian',
      url: 'https://todoist.com/project/24',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 25,
      name: 'Becky acknowledged',
      url: 'https://todoist.com/project/25',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 26,
      name: 'Becky In Progress',
      url: 'https://todoist.com/project/26',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 27,
      name: 'Becky time sensitive (per Brian)',
      url: 'https://todoist.com/project/27',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 28,
      name: 'Brian time sensitive (per Becky)',
      url: 'https://todoist.com/project/28',
      is_favorite: false,
      is_inbox: false,
    },
    {
      id: 29,
      name: 'Some other project',
      url: 'https://todoist.com/project/29',
      is_favorite: false,
      is_inbox: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockListProjects.mockResolvedValue({
      projects: allProjects,
      total_count: allProjects.length,
      cached_at: '2024-01-01T00:00:00.000Z',
    });
  });

  describe('getBrianOnlyProjects', () => {
    it('should return only Brian-only projects', async () => {
      // arrange
      const expectedProjects = [
        {
          id: 1,
          name: 'Areas of focus',
          url: 'https://todoist.com/project/1',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 2,
          name: 'Inbox',
          url: 'https://todoist.com/project/2',
          is_favorite: false,
          is_inbox: true,
        },
        {
          id: 3,
          name: 'Media',
          url: 'https://todoist.com/project/3',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 4,
          name: 'Musings',
          url: 'https://todoist.com/project/4',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 5,
          name: 'Next actions',
          url: 'https://todoist.com/project/5',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 6,
          name: 'Contextual',
          url: 'https://todoist.com/project/6',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 7,
          name: 'Projects',
          url: 'https://todoist.com/project/7',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 8,
          name: 'Calendar',
          url: 'https://todoist.com/project/8',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 9,
          name: 'Tickler',
          url: 'https://todoist.com/project/9',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 10,
          name: 'Someday',
          url: 'https://todoist.com/project/10',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 11,
          name: 'Waiting',
          url: 'https://todoist.com/project/11',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 12,
          name: 'Chores',
          url: 'https://todoist.com/project/12',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 13,
          name: 'Graveyard',
          url: 'https://todoist.com/project/13',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 14,
          name: 'Graveyard - read',
          url: 'https://todoist.com/project/14',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 15,
          name: 'Graveyard - watch',
          url: 'https://todoist.com/project/15',
          is_favorite: false,
          is_inbox: false,
        },
      ];

      // act
      const result = await getBrianOnlyProjects();

      // assert
      expect(result.projects).toEqual(expectedProjects);
      expect(result.total_count).toBe(15);
      expect(mockListProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when projects service fails', async () => {
      // arrange
      mockListProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getBrianOnlyProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get Brian-only projects: API Error'
      );
    });
  });

  describe('getBrianSharedProjects', () => {
    it('should return only Brian shared projects', async () => {
      // arrange
      const expectedProjects = [
        {
          id: 16,
          name: 'Brian inbox - per Becky',
          url: 'https://todoist.com/project/16',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 17,
          name: 'Brian acknowledged',
          url: 'https://todoist.com/project/17',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 18,
          name: 'Brian projects',
          url: 'https://todoist.com/project/18',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 19,
          name: 'Brian waiting',
          url: 'https://todoist.com/project/19',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 20,
          name: 'Brian someday',
          url: 'https://todoist.com/project/20',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 21,
          name: 'Brian tickler',
          url: 'https://todoist.com/project/21',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 22,
          name: 'Brian contextual',
          url: 'https://todoist.com/project/22',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 28,
          name: 'Brian time sensitive (per Becky)',
          url: 'https://todoist.com/project/28',
          is_favorite: false,
          is_inbox: false,
        },
      ];

      // act
      const result = await getBrianSharedProjects();

      // assert
      expect(result.projects).toEqual(expectedProjects);
      expect(result.total_count).toBe(8);
      expect(mockListProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when projects service fails', async () => {
      // arrange
      mockListProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getBrianSharedProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get Brian shared projects: API Error'
      );
    });
  });

  describe('getBeckySharedProjects', () => {
    it('should return only Becky shared projects', async () => {
      // arrange
      const expectedProjects = [
        {
          id: 23,
          name: 'Becky someday',
          url: 'https://todoist.com/project/23',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 24,
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/24',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 25,
          name: 'Becky acknowledged',
          url: 'https://todoist.com/project/25',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 26,
          name: 'Becky In Progress',
          url: 'https://todoist.com/project/26',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 27,
          name: 'Becky time sensitive (per Brian)',
          url: 'https://todoist.com/project/27',
          is_favorite: false,
          is_inbox: false,
        },
      ];

      // act
      const result = await getBeckySharedProjects();

      // assert
      expect(result.projects).toEqual(expectedProjects);
      expect(result.total_count).toBe(5);
      expect(mockListProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when projects service fails', async () => {
      // arrange
      mockListProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getBeckySharedProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get Becky shared projects: API Error'
      );
    });
  });

  describe('getInboxProjects', () => {
    it('should return only the three inbox projects', async () => {
      // arrange
      const expectedProjects = [
        {
          id: 2,
          name: 'Inbox',
          url: 'https://todoist.com/project/2',
          is_favorite: false,
          is_inbox: true,
        },
        {
          id: 16,
          name: 'Brian inbox - per Becky',
          url: 'https://todoist.com/project/16',
          is_favorite: false,
          is_inbox: false,
        },
        {
          id: 24,
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/24',
          is_favorite: false,
          is_inbox: false,
        },
      ];

      // act
      const result = await getInboxProjects();

      // assert
      expect(result.projects).toEqual(expectedProjects);
      expect(result.total_count).toBe(3);
      expect(mockListProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when projects service fails', async () => {
      // arrange
      mockListProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getInboxProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get inbox projects: API Error'
      );
    });
  });
});
