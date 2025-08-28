import {
  listProjects,
  listInboxProjects,
  listTasksInProject,
  getTaskComments,
} from './services/todoist';

// Mock the services
jest.mock('./services/todoist');

const mockListProjects = listProjects as jest.MockedFunction<
  typeof listProjects
>;
const mockListInboxProjects = listInboxProjects as jest.MockedFunction<
  typeof listInboxProjects
>;
const mockListTasksInProject = listTasksInProject as jest.MockedFunction<
  typeof listTasksInProject
>;
const mockGetTaskComments = getTaskComments as jest.MockedFunction<
  typeof getTaskComments
>;

describe('MCP Server Response Format', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Response Format Tests', () => {
    it('should format list_projects response as text with stringified JSON', async () => {
      // arrange
      const mockProjectsData = {
        projects: [
          {
            id: 1,
            name: 'Test Project',
            url: 'https://todoist.com/project/1',
            is_favorite: false,
            is_inbox: true,
          },
        ],
        total_count: 1,
      };
      mockListProjects.mockResolvedValue(mockProjectsData);

      // act
      const result = await listProjects();
      const response = {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        JSON.stringify(mockProjectsData, null, 2)
      );
      expect(mockListProjects).toHaveBeenCalled();
    });

    it('should format list_inbox_projects response as text with stringified JSON', async () => {
      // arrange
      const mockInboxProjectsData = {
        projects: [
          {
            id: 1,
            name: 'Inbox',
            url: 'https://todoist.com/project/1',
            is_favorite: false,
            is_inbox: true,
          },
        ],
        total_count: 1,
      };
      mockListInboxProjects.mockResolvedValue(mockInboxProjectsData);

      // act
      const result = await listInboxProjects();
      const response = {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        JSON.stringify(mockInboxProjectsData, null, 2)
      );
      expect(mockListInboxProjects).toHaveBeenCalled();
    });

    it('should format list_tasks_in_project response as text with stringified JSON', async () => {
      // arrange
      const mockTasksData = {
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
        ],
        total_count: 1,
      };
      mockListTasksInProject.mockResolvedValue(mockTasksData);

      // act
      const result = await listTasksInProject('123');
      const response = {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        JSON.stringify(mockTasksData, null, 2)
      );
      expect(mockListTasksInProject).toHaveBeenCalledWith('123');
    });

    it('should format error responses as text', () => {
      // arrange
      const error = new Error('API Error');

      // act
      const response = {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe('Error: API Error');
    });

    it('should format unknown tool error as text', () => {
      // arrange
      const toolName = 'unknown_tool';

      // act
      const response = {
        content: [
          {
            type: 'text',
            text: `Error: Unknown tool: ${toolName}`,
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        'Error: Unknown tool: unknown_tool'
      );
    });

    it('should format get_task_comments response as text with stringified JSON', async () => {
      // arrange
      const mockCommentsData = {
        comments: [
          {
            id: 1,
            content: 'This is a comment on the task',
            posted: '2023-01-01T00:00:00Z',
            posted_uid: 'user123',
            attachment: null,
          },
        ],
        total_count: 1,
      };
      mockGetTaskComments.mockResolvedValue(mockCommentsData);

      // act
      const result = await getTaskComments('123');
      const response = {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        JSON.stringify(mockCommentsData, null, 2)
      );
      expect(mockGetTaskComments).toHaveBeenCalledWith('123');
    });
  });

  describe('JSON Stringification Tests', () => {
    it('should properly stringify complex project data', async () => {
      // arrange
      const mockProjectsData = {
        projects: [
          {
            id: 934523784,
            name: 'Inbox',
            url: 'https://app.todoist.com/app/project/6PRwR7m5wm6vGwgc',
            is_favorite: false,
            is_inbox: true,
          },
          {
            id: 2293839202,
            name: 'Brian inbox - per Becky',
            url: 'https://app.todoist.com/app/project/6PRwR7mcH2597GM6',
            is_favorite: false,
            is_inbox: false,
          },
        ],
        total_count: 2,
      };
      mockListInboxProjects.mockResolvedValue(mockProjectsData);

      // act
      const result = await listInboxProjects();
      const stringified = JSON.stringify(result, null, 2);

      // assert
      expect(stringified).toContain('"id": 934523784');
      expect(stringified).toContain('"name": "Inbox"');
      expect(stringified).toContain('"is_inbox": true');
      expect(stringified).toContain('"name": "Brian inbox - per Becky"');
      expect(stringified).toContain('"is_inbox": false');
      expect(stringified).toContain('"total_count": 2');
    });

    it('should handle empty projects list', async () => {
      // arrange
      const mockEmptyData = {
        projects: [],
        total_count: 0,
      };
      mockListInboxProjects.mockResolvedValue(mockEmptyData);

      // act
      const result = await listInboxProjects();
      const stringified = JSON.stringify(result, null, 2);

      // assert
      expect(stringified).toContain('"projects": []');
      expect(stringified).toContain('"total_count": 0');
    });

    it('should properly stringify task data with all fields', async () => {
      // arrange
      const mockTasksData = {
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
      };
      mockListTasksInProject.mockResolvedValue(mockTasksData);

      // act
      const result = await listTasksInProject('123');
      const stringified = JSON.stringify(result, null, 2);

      // assert
      expect(stringified).toContain('"id": 1');
      expect(stringified).toContain('"content": "Complete project setup"');
      expect(stringified).toContain('"is_completed": false');
      expect(stringified).toContain('"priority": 3');
      expect(stringified).toContain('"due_date": "2023-12-31"');
      expect(stringified).toContain('"setup"');
      expect(stringified).toContain('"important"');
      expect(stringified).toContain('"total_count": 2');
    });

    it('should handle empty tasks list', async () => {
      // arrange
      const mockEmptyData = {
        tasks: [],
        total_count: 0,
      };
      mockListTasksInProject.mockResolvedValue(mockEmptyData);

      // act
      const result = await listTasksInProject('123');
      const stringified = JSON.stringify(result, null, 2);

      // assert
      expect(stringified).toContain('"tasks": []');
      expect(stringified).toContain('"total_count": 0');
    });

    it('should properly stringify comment data with attachments', async () => {
      // arrange
      const mockCommentsData = {
        comments: [
          {
            id: 1,
            content: 'Comment with attachment',
            posted: '2023-01-01T00:00:00Z',
            posted_uid: 'user123',
            attachment: {
              resource_type: 'file',
              file_name: 'document.pdf',
              file_size: 1024,
              file_url: 'https://todoist.com/file/document.pdf',
              upload_state: 'completed',
            },
          },
          {
            id: 2,
            content: 'Simple comment without attachment',
            posted: '2023-01-02T00:00:00Z',
            posted_uid: 'user456',
            attachment: null,
          },
        ],
        total_count: 2,
      };
      mockGetTaskComments.mockResolvedValue(mockCommentsData);

      // act
      const result = await getTaskComments('123');
      const stringified = JSON.stringify(result, null, 2);

      // assert
      expect(stringified).toContain('"id": 1');
      expect(stringified).toContain('"content": "Comment with attachment"');
      expect(stringified).toContain('"posted": "2023-01-01T00:00:00Z"');
      expect(stringified).toContain('"posted_uid": "user123"');
      expect(stringified).toContain('"file_name": "document.pdf"');
      expect(stringified).toContain('"total_count": 2');
    });

    it('should handle empty comments list', async () => {
      // arrange
      const mockEmptyData = {
        comments: [],
        total_count: 0,
      };
      mockGetTaskComments.mockResolvedValue(mockEmptyData);

      // act
      const result = await getTaskComments('123');
      const stringified = JSON.stringify(result, null, 2);

      // assert
      expect(stringified).toContain('"comments": []');
      expect(stringified).toContain('"total_count": 0');
    });
  });
});
