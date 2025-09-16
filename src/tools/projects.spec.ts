import {
  getInboxProjectsTool,
  getBeckySharedProjectsTool,
  getBrianSharedProjectsTool,
  getBrianOnlyProjectsTool,
  listGtdProjectsTool,
  createProjectLabelTool,
} from './projects';
import type { MockedFunction } from 'vitest';
import {
  getInboxProjects,
  getBeckySharedProjects,
  getBrianSharedProjects,
  getBrianOnlyProjects,
} from '../services/project-filters';
import { listGtdProjects } from '../services/tasks/task-retrieval';
import { createProjectLabel } from '../services/labels/labels';

vi.mock('../services/project-filters');
vi.mock('../services/tasks/task-retrieval');
vi.mock('../services/labels/labels');

const mockGetInboxProjects = getInboxProjects as MockedFunction<
  typeof getInboxProjects
>;
const mockGetBeckySharedProjects = getBeckySharedProjects as MockedFunction<
  typeof getBeckySharedProjects
>;
const mockGetBrianSharedProjects = getBrianSharedProjects as MockedFunction<
  typeof getBrianSharedProjects
>;
const mockGetBrianOnlyProjects = getBrianOnlyProjects as MockedFunction<
  typeof getBrianOnlyProjects
>;
const mockListGtdProjects = listGtdProjects as MockedFunction<
  typeof listGtdProjects
>;
const mockCreateProjectLabel = createProjectLabel as MockedFunction<
  typeof createProjectLabel
>;

describe('Projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getInboxProjectsTool', () => {
    it('should return inbox projects data', async () => {
      // arrange
      const mockProjects = [
        {
          id: '2',
          name: 'Inbox',
          url: 'https://todoist.com/project/2',
          is_favorite: false,
          is_inbox_project: true,
          color: 'charcoal',
          order: 1,
          comment_count: 0,
          is_shared: false,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '16',
          name: 'Brian inbox - per Becky',
          url: 'https://todoist.com/project/16',
          is_favorite: false,
          is_inbox_project: false,
          color: 'blue',
          order: 2,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '24',
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/24',
          is_favorite: false,
          is_inbox_project: false,
          color: 'green',
          order: 3,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockResult = {
        projects: mockProjects,
        total_count: 3,
      };
      mockGetInboxProjects.mockResolvedValue(mockResult);

      // act
      const result = await getInboxProjectsTool.handler();

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResult, null, 2));
      expect(mockGetInboxProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when service fails', async () => {
      // arrange
      mockGetInboxProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getInboxProjectsTool.handler();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get inbox projects: API Error'
      );
    });
  });

  describe('getBeckySharedProjectsTool', () => {
    it('should return Becky shared projects data', async () => {
      // arrange
      const mockProjects = [
        {
          id: '23',
          name: 'Becky someday',
          url: 'https://todoist.com/project/23',
          is_favorite: false,
          is_inbox_project: false,
          color: 'purple',
          order: 3,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '24',
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/24',
          is_favorite: false,
          is_inbox_project: false,
          color: 'green',
          order: 4,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '25',
          name: 'Becky acknowledged',
          url: 'https://todoist.com/project/25',
          is_favorite: false,
          is_inbox_project: false,
          color: 'blue',
          order: 5,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '26',
          name: 'Becky In Progress',
          url: 'https://todoist.com/project/26',
          is_favorite: false,
          is_inbox_project: false,
          color: 'orange',
          order: 6,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '27',
          name: 'Becky time sensitive (per Brian)',
          url: 'https://todoist.com/project/27',
          is_favorite: false,
          is_inbox_project: false,
          color: 'red',
          order: 7,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockResult = {
        projects: mockProjects,
        total_count: 5,
      };
      mockGetBeckySharedProjects.mockResolvedValue(mockResult);

      // act
      const result = await getBeckySharedProjectsTool.handler();

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResult, null, 2));
      expect(mockGetBeckySharedProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when service fails', async () => {
      // arrange
      mockGetBeckySharedProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getBeckySharedProjectsTool.handler();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get Becky shared projects: API Error'
      );
    });
  });

  describe('getBrianSharedProjectsTool', () => {
    it('should return Brian shared projects data', async () => {
      // arrange
      const mockProjects = [
        {
          id: '16',
          name: 'Brian inbox - per Becky',
          url: 'https://todoist.com/project/16',
          is_favorite: false,
          is_inbox_project: false,
          color: 'blue',
          order: 1,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '17',
          name: 'Brian acknowledged',
          url: 'https://todoist.com/project/17',
          is_favorite: false,
          is_inbox_project: false,
          color: 'green',
          order: 2,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '18',
          name: 'Brian projects',
          url: 'https://todoist.com/project/18',
          is_favorite: false,
          is_inbox_project: false,
          color: 'purple',
          order: 3,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '28',
          name: 'Brian time sensitive (per Becky)',
          url: 'https://todoist.com/project/28',
          is_favorite: false,
          is_inbox_project: false,
          color: 'red',
          order: 4,
          comment_count: 0,
          is_shared: true,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockResult = {
        projects: mockProjects,
        total_count: 4,
      };
      mockGetBrianSharedProjects.mockResolvedValue(mockResult);

      // act
      const result = await getBrianSharedProjectsTool.handler();

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResult, null, 2));
      expect(mockGetBrianSharedProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when service fails', async () => {
      // arrange
      mockGetBrianSharedProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getBrianSharedProjectsTool.handler();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get Brian shared projects: API Error'
      );
    });
  });

  describe('getBrianOnlyProjectsTool', () => {
    it('should return Brian-only projects data', async () => {
      // arrange
      const mockProjects = [
        {
          id: '1',
          name: 'Areas of focus',
          url: 'https://todoist.com/project/1',
          is_favorite: false,
          is_inbox_project: false,
          color: 'charcoal',
          order: 1,
          comment_count: 0,
          is_shared: false,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Inbox',
          url: 'https://todoist.com/project/2',
          is_favorite: false,
          is_inbox_project: true,
          color: 'charcoal',
          order: 2,
          comment_count: 0,
          is_shared: false,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: '3',
          name: 'Media',
          url: 'https://todoist.com/project/3',
          is_favorite: false,
          is_inbox_project: false,
          color: 'blue',
          order: 3,
          comment_count: 0,
          is_shared: false,
          is_team_inbox: false,
          view_style: 'list',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockResult = {
        projects: mockProjects,
        total_count: 3,
      };
      mockGetBrianOnlyProjects.mockResolvedValue(mockResult);

      // act
      const result = await getBrianOnlyProjectsTool.handler();

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResult, null, 2));
      expect(mockGetBrianOnlyProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle error when service fails', async () => {
      // arrange
      mockGetBrianOnlyProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getBrianOnlyProjectsTool.handler();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get Brian-only projects: API Error'
      );
    });
  });

  describe('listGtdProjectsTool', () => {
    it('should return JSON formatted GTD projects when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Test GTD project task 1',
          description: 'Test description 1',
          is_completed: false,
          labels: ['label1'],
          priority: 1,
          due_date: '2024-01-01',
          url: 'https://todoist.com/task/1',
          comment_count: 2,
        },
        {
          id: 2,
          content: 'Test GTD project task 2',
          description: 'Test description 2',
          is_completed: false,
          labels: ['label2'],
          priority: 2,
          due_date: null,
          url: 'https://todoist.com/task/2',
          comment_count: 0,
        },
      ];
      const mockResponse = {
        tasks: mockTasks,
        total_count: 2,
      };
      mockListGtdProjects.mockResolvedValue(mockResponse);

      // act
      const result = await listGtdProjectsTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListGtdProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockListGtdProjects.mockResolvedValue(mockResponse);

      // act
      const result = await listGtdProjectsTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListGtdProjects).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      mockListGtdProjects.mockRejectedValue(new Error('API Error'));

      // act
      const promise = listGtdProjectsTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
      expect(mockListGtdProjects).toHaveBeenCalledTimes(1);
    });
  });

  describe('createProjectLabelTool', () => {
    it('should create a project label successfully', async () => {
      // arrange
      const mockResult = {
        id: 123,
        name: 'PROJECT: New Website',
        color: 'charcoal',
        order: 1,
        is_favorite: false,
      };
      mockCreateProjectLabel.mockResolvedValue(mockResult);

      // act
      const result = await createProjectLabelTool.handler({
        project_name: 'PROJECT: New Website',
      });

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockResult, null, 2),
          },
        ],
      });
      expect(mockCreateProjectLabel).toHaveBeenCalledWith(
        'PROJECT: New Website'
      );
    });

    it('should handle missing project_name parameter', async () => {
      // arrange
      mockCreateProjectLabel.mockResolvedValue({
        id: 123,
        name: 'PROJECT: Test',
        color: 'charcoal',
        order: 1,
        is_favorite: false,
      });

      // act
      const promise = createProjectLabelTool.handler({ project_name: '' });

      // assert
      await expect(promise).rejects.toThrow('project_name is required');
      expect(mockCreateProjectLabel).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // arrange
      mockCreateProjectLabel.mockRejectedValue(
        new Error('Project label name must start with "PROJECT: "')
      );

      // act
      const promise = createProjectLabelTool.handler({
        project_name: 'Invalid Name',
      });

      // assert
      await expect(promise).rejects.toThrow(
        'Project label name must start with "PROJECT: "'
      );
      expect(mockCreateProjectLabel).toHaveBeenCalledWith('Invalid Name');
    });

    it('should handle API errors from the service', async () => {
      // arrange
      mockCreateProjectLabel.mockRejectedValue(
        new Error('Failed to create project label: API Error')
      );

      // act
      const promise = createProjectLabelTool.handler({
        project_name: 'PROJECT: Test Project',
      });

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to create project label: API Error'
      );
      expect(mockCreateProjectLabel).toHaveBeenCalledWith(
        'PROJECT: Test Project'
      );
    });
  });
});
