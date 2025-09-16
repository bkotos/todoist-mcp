import {
  getChoresDueTodayTool,
  getShoppingListTool,
  getTicklerTasksTool,
  getRecentMediaTool,
  getAreasOfFocusTool,
  listNextActionsTool,
} from './workflows-tasks';
import type { MockedFunction } from 'vitest';
import {
  getChoresDueToday,
  getShoppingList,
  getTicklerTasks,
  getRecentMedia,
  getAreasOfFocus,
  listNextActions,
} from '../services/tasks/task-retrieval';

vi.mock('../services/tasks/task-retrieval');

const mockGetChoresDueToday = getChoresDueToday as MockedFunction<
  typeof getChoresDueToday
>;
const mockGetShoppingList = getShoppingList as MockedFunction<
  typeof getShoppingList
>;
const mockGetTicklerTasks = getTicklerTasks as MockedFunction<
  typeof getTicklerTasks
>;
const mockGetRecentMedia = getRecentMedia as MockedFunction<
  typeof getRecentMedia
>;
const mockGetAreasOfFocus = getAreasOfFocus as MockedFunction<
  typeof getAreasOfFocus
>;
const mockListNextActions = listNextActions as MockedFunction<
  typeof listNextActions
>;

describe('Workflows Tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChoresDueTodayTool', () => {
    it('should return chores due today or overdue', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          content: 'Do laundry',
          due: { date: '2024-01-15' },
          project_id: '123',
          labels: ['chore'],
        },
        {
          id: '2',
          content: 'Clean kitchen',
          due: { date: '2024-01-14' },
          project_id: '123',
          labels: ['chore'],
        },
      ];
      mockGetChoresDueToday.mockResolvedValue(mockTasks);

      // act
      const result = await getChoresDueTodayTool.handler();

      // assert
      expect(result.content[0].text).toBe(JSON.stringify(mockTasks, null, 2));
      expect(mockGetChoresDueToday).toHaveBeenCalledWith();
    });

    it('should return empty array when no chores are due', async () => {
      // arrange
      mockGetChoresDueToday.mockResolvedValue([]);

      // act
      const result = await getChoresDueTodayTool.handler();

      // assert
      expect(result.content[0].text).toBe('[]');
      expect(mockGetChoresDueToday).toHaveBeenCalledWith();
    });

    it('should handle service errors gracefully', async () => {
      // arrange
      mockGetChoresDueToday.mockRejectedValue(new Error('Service Error'));

      // act
      const promise = getChoresDueTodayTool.handler();

      // assert
      await expect(promise).rejects.toThrow('Service Error');
    });
  });

  describe('getShoppingListTool', () => {
    it('should return shopping list tasks successfully', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Milk',
          description: 'Organic whole milk',
          is_completed: false,
          labels: ['dairy'],
          priority: 1,
          due_date: '2024-01-15',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
        {
          id: 2,
          content: 'Bread',
          description: 'Whole grain bread',
          is_completed: false,
          labels: ['bakery'],
          priority: 2,
          due_date: '2024-01-15',
          url: 'https://todoist.com/task/2',
          comment_count: 0,
        },
      ];
      mockGetShoppingList.mockResolvedValue({
        tasks: mockTasks,
        total_count: 2,
      });

      // act
      const result = await getShoppingListTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                tasks: mockTasks,
                total_count: 2,
              },
              null,
              2
            ),
          },
        ],
      });
      expect(mockGetShoppingList).toHaveBeenCalled();
    });

    it('should handle empty response', async () => {
      // arrange
      mockGetShoppingList.mockResolvedValue({
        tasks: [],
        total_count: 0,
      });

      // act
      const result = await getShoppingListTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                tasks: [],
                total_count: 0,
              },
              null,
              2
            ),
          },
        ],
      });
      expect(mockGetShoppingList).toHaveBeenCalled();
    });

    it('should handle errors from service', async () => {
      // arrange
      mockGetShoppingList.mockRejectedValue(new Error('Service error'));

      // act
      const promise = getShoppingListTool.handler();

      // assert
      await expect(promise).rejects.toThrow('Service error');
      expect(mockGetShoppingList).toHaveBeenCalled();
    });
  });

  describe('getTicklerTasksTool', () => {
    it('should return tickler tasks in MCP format', async () => {
      // arrange
      const mockTicklerTasks = [
        {
          id: '1',
          project_id: '123',
          content: 'Review insurance policies',
          description: '',
          is_completed: false,
          labels: ['Tickler'],
          priority: 1,
          due: {
            date: '2024-01-15',
            string: '2024-01-15',
            lang: 'en',
            is_recurring: false,
          },
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];
      mockGetTicklerTasks.mockResolvedValue(mockTicklerTasks);

      // act
      const result = await getTicklerTasksTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockTicklerTasks, null, 2),
          },
        ],
      });
      expect(mockGetTicklerTasks).toHaveBeenCalledOnce();
    });

    it('should handle empty results', async () => {
      // arrange
      mockGetTicklerTasks.mockResolvedValue([]);

      // act
      const result = await getTicklerTasksTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify([], null, 2),
          },
        ],
      });
    });
  });

  describe('getRecentMediaTool', () => {
    it('should return formatted JSON response', async () => {
      // arrange
      const mockTasks = [
        {
          id: '1',
          content: 'Watch The Matrix',
          project_id: '123',
          labels: ['Media', 'Movie'],
          created_at: '2024-01-15T10:00:00Z',
          due: null,
          parent_id: null,
          description: '',
          is_completed: false,
          priority: 1,
          url: 'https://todoist.com/task/1',
          comment_count: 0,
          updated_at: '2024-01-15T10:00:00Z',
        },
      ];
      mockGetRecentMedia.mockResolvedValue(mockTasks);

      // act
      const result = await getRecentMediaTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockTasks, null, 2),
          },
        ],
      });
      expect(mockGetRecentMedia).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      // arrange
      mockGetRecentMedia.mockResolvedValue([]);

      // act
      const result = await getRecentMediaTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: '[]',
          },
        ],
      });
      expect(mockGetRecentMedia).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // arrange
      mockGetRecentMedia.mockRejectedValue(new Error('Service Error'));

      // act
      const promise = getRecentMediaTool.handler();

      // assert
      await expect(promise).rejects.toThrow('Service Error');
      expect(mockGetRecentMedia).toHaveBeenCalled();
    });
  });

  describe('getAreasOfFocusTool', () => {
    it('should return areas of focus tasks successfully', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Review quarterly goals',
          description: 'Strategic planning task',
          is_completed: false,
          labels: ['focus'],
          priority: 1,
          due_date: '2024-01-15',
          url: 'https://todoist.com/task/1',
          comment_count: 0,
        },
        {
          id: 2,
          content: 'Plan strategic initiatives',
          description: 'Long-term planning',
          is_completed: false,
          labels: ['planning'],
          priority: 2,
          due_date: '2024-01-20',
          url: 'https://todoist.com/task/2',
          comment_count: 1,
        },
      ];
      mockGetAreasOfFocus.mockResolvedValue({
        tasks: mockTasks,
        total_count: 2,
      });

      // act
      const result = await getAreasOfFocusTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                tasks: mockTasks,
                total_count: 2,
              },
              null,
              2
            ),
          },
        ],
      });
      expect(mockGetAreasOfFocus).toHaveBeenCalled();
    });

    it('should handle empty response', async () => {
      // arrange
      mockGetAreasOfFocus.mockResolvedValue({
        tasks: [],
        total_count: 0,
      });

      // act
      const result = await getAreasOfFocusTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                tasks: [],
                total_count: 0,
              },
              null,
              2
            ),
          },
        ],
      });
      expect(mockGetAreasOfFocus).toHaveBeenCalled();
    });

    it('should handle errors from service', async () => {
      // arrange
      mockGetAreasOfFocus.mockRejectedValue(new Error('Service error'));

      // act
      const promise = getAreasOfFocusTool.handler();

      // assert
      await expect(promise).rejects.toThrow('Service error');
      expect(mockGetAreasOfFocus).toHaveBeenCalled();
    });
  });

  describe('listNextActionsTool', () => {
    it('should return JSON formatted next actions when API call succeeds', async () => {
      // arrange
      const mockTasks = [
        {
          id: 1,
          content: 'Test next action task 1',
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
          content: 'Test next action task 2',
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
      mockListNextActions.mockResolvedValue(mockResponse);

      // act
      const result = await listNextActionsTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListNextActions).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', async () => {
      // arrange
      const mockResponse = {
        tasks: [],
        total_count: 0,
      };
      mockListNextActions.mockResolvedValue(mockResponse);

      // act
      const result = await listNextActionsTool.handler();

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        JSON.stringify(mockResponse, null, 2)
      );
      expect(mockListNextActions).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      mockListNextActions.mockRejectedValue(new Error('API Error'));

      // act
      const promise = listNextActionsTool.handler();

      // assert
      await expect(promise).rejects.toThrow('API Error');
      expect(mockListNextActions).toHaveBeenCalledTimes(1);
    });
  });
});
