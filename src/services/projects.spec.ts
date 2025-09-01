import { listProjects } from './projects';
import type { MockedFunction, Mocked } from 'vitest';
import { getTodoistClient } from './client';
import fs from 'fs';
import path from 'path';

// Mock the client module
vi.mock('./client');
// Mock fs module
vi.mock('fs');
vi.mock('path');

const mockGetTodoistClient = getTodoistClient as MockedFunction<
  typeof getTodoistClient
>;
const mockFs = fs as Mocked<typeof fs>;
const mockPath = path as Mocked<typeof path>;

describe('Projects Service', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    // Reset path mock
    mockPath.join.mockReturnValue('.cache/projects.json');
    mockPath.dirname.mockReturnValue('.cache');
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
        get: vi.fn().mockResolvedValue({ data: mockProjects }),
        post: vi.fn(),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined);
      mockFs.writeFileSync.mockImplementation(() => undefined);

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
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/projects');
    });

    it('should handle empty projects list', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined);
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await listProjects();

      // assert
      expect(result).toEqual({
        projects: [],
        total_count: 0,
        cached_at: expect.any(String),
      });
    });

    it('should handle API errors gracefully', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined);

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
      mockFs.existsSync.mockReturnValue(false);

      // act
      const promise = listProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'TODOIST_API_TOKEN environment variable is required'
      );
    });

    it('should fetch from API and cache when no cache file exists', async () => {
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
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockProjects }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined);
      mockFs.writeFileSync.mockImplementation(() => undefined);

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
        ],
        total_count: 1,
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/projects');
      expect(mockFs.existsSync).toHaveBeenCalledWith('.cache');
      expect(mockFs.mkdirSync).toHaveBeenCalledWith('.cache', {
        recursive: true,
      });
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '.cache/projects.json',
        expect.stringContaining('"projects"')
      );
    });

    it('should read from cache when cache file is less than one day old', async () => {
      // arrange
      const cachedData = {
        projects: [
          {
            id: 1,
            name: 'Cached Project',
            url: 'https://todoist.com/project/1',
            is_favorite: true,
            is_inbox: false,
          },
        ],
        total_count: 1,
        cached_at: new Date().toISOString(),
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(cachedData));

      // act
      const result = await listProjects();

      // assert
      expect(result).toEqual(cachedData);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        '.cache/projects.json',
        'utf8'
      );
    });

    it('should fetch from API when cache file is older than one day', async () => {
      // arrange
      const mockProjects = [
        {
          id: '2',
          name: 'New Project',
          color: 'blue',
          order: 1,
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
        get: vi.fn().mockResolvedValue({ data: mockProjects }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isFile: () => true,
      } as any);
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await listProjects();

      // assert
      expect(result).toEqual({
        projects: [
          {
            id: 2,
            name: 'New Project',
            url: 'https://todoist.com/project/2',
            is_favorite: true,
            is_inbox: false,
          },
        ],
        total_count: 1,
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/projects');
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '.cache/projects.json',
        expect.stringContaining('"projects"')
      );
    });

    it('should handle cache file read errors by falling back to API', async () => {
      // arrange
      const mockProjects = [
        {
          id: '3',
          name: 'Fallback Project',
          color: 'red',
          order: 1,
          comment_count: 0,
          is_shared: false,
          is_favorite: false,
          is_inbox_project: true,
          is_team_inbox: false,
          view_style: 'list',
          url: 'https://todoist.com/project/3',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockProjects }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await listProjects();

      // assert
      expect(result).toEqual({
        projects: [
          {
            id: 3,
            name: 'Fallback Project',
            url: 'https://todoist.com/project/3',
            is_favorite: false,
            is_inbox: true,
          },
        ],
        total_count: 1,
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/projects');
    });

    it('should handle invalid JSON in cache file by falling back to API', async () => {
      // arrange
      const mockProjects = [
        {
          id: '4',
          name: 'JSON Error Project',
          color: 'green',
          order: 1,
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
        get: vi.fn().mockResolvedValue({ data: mockProjects }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockReturnValue('invalid json content');
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await listProjects();

      // assert
      expect(result).toEqual({
        projects: [
          {
            id: 4,
            name: 'JSON Error Project',
            url: 'https://todoist.com/project/4',
            is_favorite: false,
            is_inbox: false,
          },
        ],
        total_count: 1,
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/projects');
    });

    it('should handle API errors when cache is invalid', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockReturnValue('invalid json content');

      // act
      const promise = listProjects();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to list projects: API Error'
      );
    });
  });
});
