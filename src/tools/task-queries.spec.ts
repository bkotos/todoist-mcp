import {
  getTasksDueTodayTool,
  getTasksDueTomorrowTool,
  getTasksDueThisWeekTool,
  getTasksWithLabelTool,
  getWaitingTasksTool,
  searchTasksTool,
  searchTasksUsingAndTool,
  searchTasksUsingOrTool,
} from './task-queries';
import type { MockedFunction } from 'vitest';
import {
  getTasksDueToday,
  getTasksDueTomorrow,
  getTasksDueThisWeek,
  getTasksWithLabel,
  getWaitingTasks,
} from '../services/tasks/task-retrieval';
import {
  searchTasks,
  searchTasksUsingAnd,
  searchTasksUsingOr,
} from '../services/tasks/task-search';

vi.mock('../services/tasks/task-retrieval');
vi.mock('../services/tasks/task-search');

const mockGetTasksDueToday = getTasksDueToday as MockedFunction<
  typeof getTasksDueToday
>;
const mockGetTasksDueTomorrow = getTasksDueTomorrow as MockedFunction<
  typeof getTasksDueTomorrow
>;
const mockGetTasksDueThisWeek = getTasksDueThisWeek as MockedFunction<
  typeof getTasksDueThisWeek
>;
const mockGetTasksWithLabel = getTasksWithLabel as MockedFunction<
  typeof getTasksWithLabel
>;
const mockGetWaitingTasks = getWaitingTasks as MockedFunction<
  typeof getWaitingTasks
>;
const mockSearchTasks = searchTasks as MockedFunction<typeof searchTasks>;
const mockSearchTasksUsingAnd = searchTasksUsingAnd as MockedFunction<
  typeof searchTasksUsingAnd
>;
const mockSearchTasksUsingOr = searchTasksUsingOr as MockedFunction<
  typeof searchTasksUsingOr
>;

describe('Task Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasksDueTodayTool', () => {
    it('should return tasks due today data', async () => {
      // arrange
      const mockTasks = [
        {
          id: 123,
          content: 'Complete project report',
          description: 'Finish the quarterly report',
          is_completed: false,
          labels: ['work', 'priority'],
          priority: 3,
          due_date: '2024-01-15',
          url: 'https://todoist.com/showTask?id=123',
          comment_count: 0,
        },
        {
          id: 456,
          content: 'Buy groceries',
          description: 'Milk, bread, eggs',
          is_completed: false,
          labels: ['personal'],
          priority: 2,
          due_date: '2024-01-15',
          url: 'https://todoist.com/showTask?id=456',
          comment_count: 1,
        },
      ];
      const mockResult = {
        tasks: mockTasks,
        total_count: 2,
      };
      mockGetTasksDueToday.mockResolvedValue(mockResult);

      // act
      const result = await getTasksDueTodayTool.handler();

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResult, null, 2));
      expect(mockGetTasksDueToday).toHaveBeenCalledTimes(1);
    });

    it('should handle error when service fails', async () => {
      // arrange
      mockGetTasksDueToday.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getTasksDueTodayTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
    });
  });

  describe('getTasksDueTomorrowTool', () => {
    it('should return formatted JSON response with tasks due tomorrow', async () => {
      // arrange
      const mockTasks = [
        {
          id: '123',
          content: 'Review project proposal',
          due: { date: '2024-01-16' },
          project_id: '456',
          labels: ['work', 'priority'],
        },
        {
          id: '124',
          content: 'Team meeting prep',
          due: { date: '2024-01-16' },
          project_id: '789',
          labels: ['work'],
        },
      ];

      mockGetTasksDueTomorrow.mockResolvedValue(mockTasks);

      // act
      const result = await getTasksDueTomorrowTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockTasks, null, 2),
          },
        ],
      });
      expect(mockGetTasksDueTomorrow).toHaveBeenCalledOnce();
    });

    it('should handle empty response', async () => {
      // arrange
      mockGetTasksDueTomorrow.mockResolvedValue([]);

      // act
      const result = await getTasksDueTomorrowTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: '[]',
          },
        ],
      });
    });

    it('should handle service errors', async () => {
      // arrange
      const errorMessage = 'API Error';
      mockGetTasksDueTomorrow.mockRejectedValue(new Error(errorMessage));

      // act
      const promise = getTasksDueTomorrowTool.handler();

      // assert
      await expect(promise).rejects.toThrow(errorMessage);
    });
  });

  describe('getTasksDueThisWeekTool', () => {
    it('should return tasks due this week in MCP format', async () => {
      // arrange
      const mockTasks = [
        { id: 1, content: 'Task 1', due: { date: '2024-01-15' } },
        { id: 2, content: 'Task 2', due: { date: '2024-01-16' } },
      ];
      mockGetTasksDueThisWeek.mockResolvedValue(mockTasks);

      // act
      const result = await getTasksDueThisWeekTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockTasks, null, 2),
          },
        ],
      });
      expect(mockGetTasksDueThisWeek).toHaveBeenCalledOnce();
    });

    it('should handle empty results', async () => {
      // arrange
      const mockTasks = [];
      mockGetTasksDueThisWeek.mockResolvedValue(mockTasks);

      // act
      const result = await getTasksDueThisWeekTool.handler();

      // assert
      expect(result.content[0].text).toBe('[]');
      expect(mockGetTasksDueThisWeek).toHaveBeenCalledOnce();
    });
  });

  describe('getTasksWithLabelTool', () => {
    it('should return JSON formatted tasks with label when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Test task with urgent label',
          description: 'Test description 1',
          is_completed: false,
          labels: ['urgent'],
          priority: 1,
          due_date: '2024-01-01',
          url: 'https://todoist.com/task/1',
          comment_count: 2,
        },
        {
          id: 2,
          content: 'Another urgent task',
          description: 'Test description 2',
          is_completed: false,
          labels: ['urgent', 'work'],
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
      mockGetTasksWithLabel.mockResolvedValue(mockResponse);

      // act
      const result = await getTasksWithLabelTool.handler({ label: 'urgent' });

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockGetTasksWithLabel).toHaveBeenCalledWith('urgent');
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockGetTasksWithLabel.mockResolvedValue(mockResponse);

      // act
      const result = await getTasksWithLabelTool.handler({
        label: 'nonexistent',
      });

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockGetTasksWithLabel).toHaveBeenCalledWith('nonexistent');
    });

    it('should handle API errors', async () => {
      // arrange
      mockGetTasksWithLabel.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getTasksWithLabelTool.handler({ label: 'urgent' });

      // assert
      await expect(promise).rejects.toThrow('API Error');
      expect(mockGetTasksWithLabel).toHaveBeenCalledWith('urgent');
    });
  });

  describe('getWaitingTasksTool', () => {
    it('should return waiting tasks data', async () => {
      // arrange
      const mockTasks = [
        {
          id: 123,
          content: 'Wait for client feedback',
          description: 'Project is on hold until client responds',
          is_completed: false,
          labels: ['Waiting', 'work'],
          priority: 2,
          due_date: null,
          url: 'https://todoist.com/showTask?id=123',
          comment_count: 0,
        },
        {
          id: 456,
          content: 'Wait for vendor quote',
          description: 'Need pricing before proceeding',
          is_completed: false,
          labels: ['Brian waiting', 'business'],
          priority: 3,
          due_date: null,
          url: 'https://todoist.com/showTask?id=456',
          comment_count: 1,
        },
      ];
      const mockResult = {
        tasks: mockTasks,
        total_count: 2,
      };
      mockGetWaitingTasks.mockResolvedValue(mockResult);

      // act
      const result = await getWaitingTasksTool.handler();

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResult, null, 2));
      expect(mockGetWaitingTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle error when service fails', async () => {
      // arrange
      mockGetWaitingTasks.mockRejectedValue(new Error('API Error'));

      // act
      const promise = getWaitingTasksTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
    });
  });

  describe('searchTasksTool', () => {
    it('should return search results', async () => {
      // arrange
      const mockResults = [
        {
          id: 1,
          content: 'Meeting with team',
          description: 'Weekly team sync',
          is_completed: false,
          labels: ['work'],
          priority: 2,
          due_date: '2024-01-15',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
      ];
      mockSearchTasks.mockResolvedValue(mockResults);

      // act
      const result = await searchTasksTool.handler({ query: 'meeting' });

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResults, null, 2));
      expect(mockSearchTasks).toHaveBeenCalledWith('meeting');
    });

    it('should handle search errors', async () => {
      // arrange
      mockSearchTasks.mockRejectedValue(new Error('Search failed'));

      // act
      const promise = searchTasksTool.handler({ query: 'meeting' });

      // assert
      await expect(promise).rejects.toThrow('Search failed');
    });
  });

  describe('searchTasksUsingAndTool', () => {
    it('should return AND search results', async () => {
      // arrange
      const mockResults = [
        {
          id: 1,
          content: 'Weekly team meeting',
          description: 'Team sync meeting',
          is_completed: false,
          labels: ['work', 'meeting'],
          priority: 2,
          due_date: '2024-01-15',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
      ];
      mockSearchTasksUsingAnd.mockResolvedValue(mockResults);

      // act
      const result = await searchTasksUsingAndTool.handler({
        search_terms: ['meeting', 'team'],
      });

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResults, null, 2));
      expect(mockSearchTasksUsingAnd).toHaveBeenCalledWith(['meeting', 'team']);
    });

    it('should handle AND search errors', async () => {
      // arrange
      mockSearchTasksUsingAnd.mockRejectedValue(new Error('AND search failed'));

      // act
      const promise = searchTasksUsingAndTool.handler({
        search_terms: ['meeting', 'team'],
      });

      // assert
      await expect(promise).rejects.toThrow('AND search failed');
    });
  });

  describe('searchTasksUsingOrTool', () => {
    it('should return OR search results', async () => {
      // arrange
      const mockResults = [
        {
          id: 1,
          content: 'Meeting with team',
          description: 'Team sync',
          is_completed: false,
          labels: ['work'],
          priority: 2,
          due_date: '2024-01-15',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
        {
          id: 2,
          content: 'Team building event',
          description: 'Company team event',
          is_completed: false,
          labels: ['team'],
          priority: 3,
          due_date: '2024-01-20',
          url: 'https://todoist.com/task/2',
          comment_count: 1,
        },
      ];
      mockSearchTasksUsingOr.mockResolvedValue(mockResults);

      // act
      const result = await searchTasksUsingOrTool.handler({
        search_terms: ['meeting', 'team'],
      });

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockResults, null, 2));
      expect(mockSearchTasksUsingOr).toHaveBeenCalledWith(['meeting', 'team']);
    });

    it('should handle OR search errors', async () => {
      // arrange
      mockSearchTasksUsingOr.mockRejectedValue(new Error('OR search failed'));

      // act
      const promise = searchTasksUsingOrTool.handler({
        search_terms: ['meeting', 'team'],
      });

      // assert
      await expect(promise).rejects.toThrow('OR search failed');
    });
  });
});
