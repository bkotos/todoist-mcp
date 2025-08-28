import {
  listProjects,
  listInboxProjects,
  listTasksInProject,
  getTaskComments,
} from './todoist';
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

  describe('listTasksInProject', () => {
    it('should list tasks in a project successfully', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Complete project setup',
          description: 'Set up the initial project structure',
          is_completed: false,
          labels: ['setup', 'important'],
          priority: 3,
          due: {
            date: '2023-12-31',
            string: 'Dec 31',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/showTask?id=1',
          comment_count: 2,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          project_id: '123',
          content: 'Review documentation',
          description: 'Go through the project documentation',
          is_completed: true,
          labels: ['review'],
          priority: 2,
          due: null,
          url: 'https://todoist.com/showTask?id=2',
          comment_count: 0,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listTasksInProject('123');

      // assert
      expect(result).toEqual({
        tasks: [
          {
            id: 1,
            content: 'Complete project setup',
            description: 'Set up the initial project structure',
            is_completed: false,
            labels: ['setup', 'important'],
            priority: 3,
            due_date: '2023-12-31',
            url: 'https://todoist.com/showTask?id=1',
            comment_count: 2,
          },
          {
            id: 2,
            content: 'Review documentation',
            description: 'Go through the project documentation',
            is_completed: true,
            labels: ['review'],
            priority: 2,
            due_date: null,
            url: 'https://todoist.com/showTask?id=2',
            comment_count: 0,
          },
        ],
        total_count: 2,
      });
      expect(mockClient.get).toHaveBeenCalledWith('/tasks?project_id=123');
    });

    it('should handle empty tasks list', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listTasksInProject('123');

      // assert
      expect(result).toEqual({
        tasks: [],
        total_count: 0,
      });
    });

    it('should handle tasks without optional fields', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Simple task',
          description: '',
          is_completed: false,
          labels: [],
          priority: 1,
          due: null,
          url: 'https://todoist.com/showTask?id=1',
          comment_count: 0,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockTasks }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await listTasksInProject('123');

      // assert
      expect(result).toEqual({
        tasks: [
          {
            id: 1,
            content: 'Simple task',
            description: '',
            is_completed: false,
            labels: [],
            priority: 1,
            due_date: null,
            url: 'https://todoist.com/showTask?id=1',
            comment_count: 0,
          },
        ],
        total_count: 1,
      });
    });

    it('should handle API errors gracefully', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = listTasksInProject('123');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list tasks in project: API Error'
      );
    });

    it('should throw error when client creation fails', async () => {
      // arrange
      mockGetTodoistClient.mockImplementation(() => {
        throw new Error('TODOIST_API_TOKEN environment variable is required');
      });

      // act
      const promise = listTasksInProject('123');

      // assert
      await expect(promise).rejects.toThrow(
        'TODOIST_API_TOKEN environment variable is required'
      );
    });
  });

  describe('getTaskComments', () => {
    it('should get comments for a task successfully', async () => {
      // arrange
      const mockComments = [
        {
          id: '1',
          task_id: '123',
          project_id: '456',
          posted: '2023-01-01T00:00:00Z',
          content: 'This is a comment on the task',
          attachment: null,
          posted_uid: 'user123',
          uids_to_notify: ['user456'],
          is_rtl: false,
          reactions: {},
        },
        {
          id: '2',
          task_id: '123',
          project_id: '456',
          posted: '2023-01-02T00:00:00Z',
          content: 'Another comment with more details',
          attachment: {
            resource_type: 'file',
            file_name: 'document.pdf',
            file_size: 1024,
            file_url: 'https://todoist.com/file/document.pdf',
            upload_state: 'completed',
          },
          posted_uid: 'user456',
          uids_to_notify: ['user123'],
          is_rtl: false,
          reactions: {},
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockComments }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getTaskComments('123');

      // assert
      expect(result).toEqual({
        comments: [
          {
            id: 1,
            content: 'This is a comment on the task',
            posted: '2023-01-01T00:00:00Z',
            posted_uid: 'user123',
            attachment: null,
          },
          {
            id: 2,
            content: 'Another comment with more details',
            posted: '2023-01-02T00:00:00Z',
            posted_uid: 'user456',
            attachment: {
              resource_type: 'file',
              file_name: 'document.pdf',
              file_size: 1024,
              file_url: 'https://todoist.com/file/document.pdf',
              upload_state: 'completed',
            },
          },
        ],
        total_count: 2,
      });
      expect(mockClient.get).toHaveBeenCalledWith('/comments?task_id=123');
    });

    it('should handle empty comments list', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getTaskComments('123');

      // assert
      expect(result).toEqual({
        comments: [],
        total_count: 0,
      });
    });

    it('should handle comments without attachments', async () => {
      // arrange
      const mockComments = [
        {
          id: '1',
          task_id: '123',
          project_id: '456',
          posted: '2023-01-01T00:00:00Z',
          content: 'Simple comment without attachment',
          attachment: null,
          posted_uid: 'user123',
          uids_to_notify: [],
          is_rtl: false,
          reactions: {},
        },
      ];
      const mockClient = {
        get: jest.fn().mockResolvedValue({ data: mockComments }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getTaskComments('123');

      // assert
      expect(result).toEqual({
        comments: [
          {
            id: 1,
            content: 'Simple comment without attachment',
            posted: '2023-01-01T00:00:00Z',
            posted_uid: 'user123',
            attachment: null,
          },
        ],
        total_count: 1,
      });
    });

    it('should handle API errors gracefully', async () => {
      // arrange
      const mockClient = {
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = getTaskComments('123');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get task comments: API Error'
      );
    });

    it('should throw error when client creation fails', async () => {
      // arrange
      mockGetTodoistClient.mockImplementation(() => {
        throw new Error('TODOIST_API_TOKEN environment variable is required');
      });

      // act
      const promise = getTaskComments('123');

      // assert
      await expect(promise).rejects.toThrow(
        'TODOIST_API_TOKEN environment variable is required'
      );
    });
  });
});
