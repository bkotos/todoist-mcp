import { listProjects, listInboxProjects } from './services/todoist';

// Mock the services
jest.mock('./services/todoist');

const mockListProjects = listProjects as jest.MockedFunction<
  typeof listProjects
>;
const mockListInboxProjects = listInboxProjects as jest.MockedFunction<
  typeof listInboxProjects
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
  });
});
