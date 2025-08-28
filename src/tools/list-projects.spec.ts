import { listProjectsHandler } from './list-projects';
import { listProjects } from '../services/todoist';

// Mock the services
jest.mock('../services/todoist');

const mockListProjects = listProjects as jest.MockedFunction<
  typeof listProjects
>;

describe('list-projects Tool', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('listProjectsHandler', () => {
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
      const response = await listProjectsHandler();

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        JSON.stringify(mockProjectsData, null, 2)
      );
      expect(mockListProjects).toHaveBeenCalled();
    });

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
      mockListProjects.mockResolvedValue(mockProjectsData);

      // act
      const response = await listProjectsHandler();
      const stringified = response.content[0].text;

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
      mockListProjects.mockResolvedValue(mockEmptyData);

      // act
      const response = await listProjectsHandler();
      const stringified = response.content[0].text;

      // assert
      expect(stringified).toContain('"projects": []');
      expect(stringified).toContain('"total_count": 0');
    });
  });
});
