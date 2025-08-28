import { listProjects, listInboxProjects } from './todoist';
import { getTodoistClient } from './client';

// Mock the client module
jest.mock('./client');

const mockGetTodoistClient = getTodoistClient as jest.MockedFunction<
  typeof getTodoistClient
>;

describe('Todoist Functions', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('listProjects', () => {
    it('should list all projects successfully', async () => {
      // arrange
      const mockProjects = [
        {
          id: '1',
          name: 'Personal',
          color: 'charcoal',
          order: 1,
          comment_count: 0,
          is_shared: false,
          is_favorite: false,
          is_inbox_project: true,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Work',
          color: 'blue',
          order: 2,
          comment_count: 0,
          is_shared: false,
          is_favorite: true,
          is_inbox_project: false,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/2',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockProjects }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listProjects();

      // assert
      expect(result).toEqual({
        projects: [
          {
            id: 1,
            name: 'Personal',
            url: 'https://todoist.com/project/1',
            is_favorite: false,
            is_inbox: true,
          },
          {
            id: 2,
            name: 'Work',
            url: 'https://todoist.com/project/2',
            is_favorite: true,
            is_inbox: false,
          },
        ],
        total_count: 2,
      });
      expect(mockClient.get).toHaveBeenCalledWith('/projects');
    });

    it('should handle empty projects list', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listProjects();

      // assert
      expect(result).toEqual({
        projects: [],
        total_count: 0,
      });
    });

    it('should handle API errors gracefully', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list projects: API Error'
      );
    });

    it('should throw error when client creation fails', async () => {
      // arrange
      mockGetTodoistClient.mockImplementation(() => {
        throw new Error('TODOIST_API_TOKEN environment variable is required');
      });

      // act
      const promise = listProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'TODOIST_API_TOKEN environment variable is required'
      );
    });
  });

  describe('listInboxProjects', () => {
    it('should list inbox projects successfully', async () => {
      // arrange
      const mockProjects = [
        {
          id: '1',
          name: 'Inbox',
          color: 'charcoal',
          order: 1,
          comment_count: 0,
          is_shared: false,
          is_favorite: false,
          is_inbox_project: true,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Brian inbox - per Becky',
          color: 'blue',
          order: 2,
          comment_count: 0,
          is_shared: false,
          is_favorite: true,
          is_inbox_project: false,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/2',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '3',
          name: 'Becky inbox - per Brian',
          color: 'green',
          order: 3,
          comment_count: 0,
          is_shared: false,
          is_favorite: false,
          is_inbox_project: false,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/3',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '4',
          name: 'Work Project',
          color: 'red',
          order: 4,
          comment_count: 0,
          is_shared: false,
          is_favorite: false,
          is_inbox_project: false,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/4',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockProjects }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listInboxProjects();

      // assert
      expect(result).toEqual({
        projects: [
          {
            id: 1,
            name: 'Inbox',
            url: 'https://todoist.com/project/1',
            is_favorite: false,
            is_inbox: true,
          },
          {
            id: 2,
            name: 'Brian inbox - per Becky',
            url: 'https://todoist.com/project/2',
            is_favorite: true,
            is_inbox: false,
          },
          {
            id: 3,
            name: 'Becky inbox - per Brian',
            url: 'https://todoist.com/project/3',
            is_favorite: false,
            is_inbox: false,
          },
        ],
        total_count: 3,
      });
      expect(mockClient.get).toHaveBeenCalledWith('/projects');
    });

    it('should handle empty inbox projects list', async () => {
      // arrange
      const mockProjects = [
        {
          id: '1',
          name: 'Work Project',
          color: 'red',
          order: 1,
          comment_count: 0,
          is_shared: false,
          is_favorite: false,
          is_inbox_project: false,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockProjects }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listInboxProjects();

      // assert
      expect(result).toEqual({
        projects: [],
        total_count: 0,
      });
    });

    it('should handle API errors gracefully', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listInboxProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list inbox projects: API Error'
      );
    });

    it('should throw error when client creation fails', async () => {
      // arrange
      mockGetTodoistClient.mockImplementation(() => {
        throw new Error('TODOIST_API_TOKEN environment variable is required');
      });

      // act
      const promise = listInboxProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'TODOIST_API_TOKEN environment variable is required'
      );
    });
  });
});
