import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { handleToolRequest } from './tool-request-handler';

// Mock all tool handlers
vi.mock('../tools', () => ({
  getTaskCommentsHandler: vi.fn(),
  listPersonalInboxTasksHandler: vi.fn(),
  listBrianInboxPerBeckyTasksHandler: vi.fn(),
  listBeckyInboxPerBrianTasksHandler: vi.fn(),
  listNextActionsHandler: vi.fn(),
  getBrianOnlyProjectsHandler: vi.fn(),
  getBrianSharedProjectsHandler: vi.fn(),
  getBeckySharedProjectsHandler: vi.fn(),
  getInboxProjectsHandler: vi.fn(),
  createProjectLabelHandler: vi.fn(),
  createTaskCommentHandler: vi.fn(),
  updateTaskHandler: vi.fn(),
  createTaskHandler: vi.fn(),
  moveTaskHandler: vi.fn(),
  getContextLabelsHandler: vi.fn(),
  getTasksWithLabelHandler: vi.fn(),
  completeTaskHandler: vi.fn(),
  searchTasksHandler: vi.fn(),
  searchTasksUsingAndHandler: vi.fn(),
  searchTasksUsingOrHandler: vi.fn(),
  getChoresDueTodayHandler: vi.fn(),
  getTasksDueTomorrowHandler: vi.fn(),
  getTasksDueThisWeekHandler: vi.fn(),
  getTicklerTasksHandler: vi.fn(),
  getGtdProjectsHandler: vi.fn(),
  getWaitingTasksHandler: vi.fn(),
  getRecentMediaHandler: vi.fn(),
  getAreasOfFocusHandler: vi.fn(),
  getShoppingListHandler: vi.fn(),
}));

// Import mocked functions
import {
  getTaskCommentsHandler,
  listPersonalInboxTasksHandler,
  listBrianInboxPerBeckyTasksHandler,
  listBeckyInboxPerBrianTasksHandler,
  listNextActionsHandler,
  getBrianOnlyProjectsHandler,
  getBrianSharedProjectsHandler,
  getBeckySharedProjectsHandler,
  getInboxProjectsHandler,
  createProjectLabelHandler,
  createTaskCommentHandler,
  updateTaskHandler,
  createTaskHandler,
  moveTaskHandler,
  getContextLabelsHandler,
  getTasksWithLabelHandler,
  completeTaskHandler,
  searchTasksHandler,
  searchTasksUsingAndHandler,
  searchTasksUsingOrHandler,
  getChoresDueTodayHandler,
  getTasksDueTomorrowHandler,
  getTasksDueThisWeekHandler,
  getTicklerTasksHandler,
  getGtdProjectsHandler,
  getWaitingTasksHandler,
  getRecentMediaHandler,
  getAreasOfFocusHandler,
  getShoppingListHandler,
} from '../tools';

describe('handleToolRequest', () => {
  let mockRequest: CallToolRequest;
  const mockResponse = {
    content: [
      {
        type: 'text',
        text: 'Mock response',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {
      params: {
        name: 'test_tool',
        arguments: {},
      },
    } as CallToolRequest;
  });

  describe('get_task_comments', () => {
    it('should call getTaskCommentsHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'get_task_comments';
      mockRequest.params.arguments = { task_id: '123' };
      (getTaskCommentsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getTaskCommentsHandler).toHaveBeenCalledWith({ task_id: '123' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('list_personal_inbox_tasks', () => {
    it('should call listPersonalInboxTasksHandler', async () => {
      // arrange
      mockRequest.params.name = 'list_personal_inbox_tasks';
      (listPersonalInboxTasksHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(listPersonalInboxTasksHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('list_brian_inbox_per_becky_tasks', () => {
    it('should call listBrianInboxPerBeckyTasksHandler', async () => {
      // arrange
      mockRequest.params.name = 'list_brian_inbox_per_becky_tasks';
      (
        listBrianInboxPerBeckyTasksHandler as MockedFunction<any>
      ).mockResolvedValue(mockResponse);

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(listBrianInboxPerBeckyTasksHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('list_becky_inbox_per_brian_tasks', () => {
    it('should call listBeckyInboxPerBrianTasksHandler', async () => {
      // arrange
      mockRequest.params.name = 'list_becky_inbox_per_brian_tasks';
      (
        listBeckyInboxPerBrianTasksHandler as MockedFunction<any>
      ).mockResolvedValue(mockResponse);

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(listBeckyInboxPerBrianTasksHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('list_next_actions', () => {
    it('should call listNextActionsHandler', async () => {
      // arrange
      mockRequest.params.name = 'list_next_actions';
      (listNextActionsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(listNextActionsHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_brian_only_projects', () => {
    it('should call getBrianOnlyProjectsHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_brian_only_projects';
      (getBrianOnlyProjectsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getBrianOnlyProjectsHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_brian_shared_projects', () => {
    it('should call getBrianSharedProjectsHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_brian_shared_projects';
      (getBrianSharedProjectsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getBrianSharedProjectsHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_becky_shared_projects', () => {
    it('should call getBeckySharedProjectsHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_becky_shared_projects';
      (getBeckySharedProjectsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getBeckySharedProjectsHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_inbox_projects', () => {
    it('should call getInboxProjectsHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_inbox_projects';
      (getInboxProjectsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getInboxProjectsHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create_project_label', () => {
    it('should call createProjectLabelHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'create_project_label';
      mockRequest.params.arguments = { project_name: 'Test Project' };
      (createProjectLabelHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(createProjectLabelHandler).toHaveBeenCalledWith({
        project_name: 'Test Project',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create_task_comment', () => {
    it('should call createTaskCommentHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'create_task_comment';
      mockRequest.params.arguments = {
        task_id: '123',
        content: 'Test comment',
      };
      (createTaskCommentHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(createTaskCommentHandler).toHaveBeenCalledWith({
        task_id: '123',
        content: 'Test comment',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update_task', () => {
    it('should call updateTaskHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'update_task';
      mockRequest.params.arguments = {
        task_id: '123',
        title: 'Updated Title',
        description: 'Updated description',
        labels: ['label1', 'label2'],
        priority: 2,
        due_date: '2024-01-01',
      };
      (updateTaskHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(updateTaskHandler).toHaveBeenCalledWith({
        task_id: '123',
        title: 'Updated Title',
        description: 'Updated description',
        labels: ['label1', 'label2'],
        priority: 2,
        due_date: '2024-01-01',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('create_task', () => {
    it('should call createTaskHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'create_task';
      mockRequest.params.arguments = {
        title: 'New Task',
        description: 'Task description',
        project_id: '456',
        labels: ['label1'],
        priority: 1,
        due_date: '2024-01-01',
      };
      (createTaskHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(createTaskHandler).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description',
        project_id: '456',
        labels: ['label1'],
        priority: 1,
        due_date: '2024-01-01',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('move_task', () => {
    it('should call moveTaskHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'move_task';
      mockRequest.params.arguments = { task_id: '123', project_id: '456' };
      (moveTaskHandler as MockedFunction<any>).mockResolvedValue(mockResponse);

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(moveTaskHandler).toHaveBeenCalledWith({
        task_id: '123',
        project_id: '456',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_context_labels', () => {
    it('should call getContextLabelsHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_context_labels';
      (getContextLabelsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getContextLabelsHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_tasks_with_label', () => {
    it('should call getTasksWithLabelHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'get_tasks_with_label';
      mockRequest.params.arguments = { label: 'work' };
      (getTasksWithLabelHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getTasksWithLabelHandler).toHaveBeenCalledWith({ label: 'work' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('complete_task', () => {
    it('should call completeTaskHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'complete_task';
      mockRequest.params.arguments = { task_id: '123' };
      (completeTaskHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(completeTaskHandler).toHaveBeenCalledWith({ task_id: '123' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('search_tasks', () => {
    it('should call searchTasksHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'search_tasks';
      mockRequest.params.arguments = { query: 'search query' };
      (searchTasksHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(searchTasksHandler).toHaveBeenCalledWith({
        query: 'search query',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('search_tasks_using_and', () => {
    it('should call searchTasksUsingAndHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'search_tasks_using_and';
      mockRequest.params.arguments = { search_terms: ['term1', 'term2'] };
      (searchTasksUsingAndHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(searchTasksUsingAndHandler).toHaveBeenCalledWith({
        search_terms: ['term1', 'term2'],
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('search_tasks_using_or', () => {
    it('should call searchTasksUsingOrHandler with correct args', async () => {
      // arrange
      mockRequest.params.name = 'search_tasks_using_or';
      mockRequest.params.arguments = { search_terms: ['term1', 'term2'] };
      (searchTasksUsingOrHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(searchTasksUsingOrHandler).toHaveBeenCalledWith({
        search_terms: ['term1', 'term2'],
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_chores_due_today', () => {
    it('should call getChoresDueTodayHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_chores_due_today';
      (getChoresDueTodayHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getChoresDueTodayHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_tasks_due_tomorrow', () => {
    it('should call getTasksDueTomorrowHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_tasks_due_tomorrow';
      (getTasksDueTomorrowHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getTasksDueTomorrowHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_tasks_due_this_week', () => {
    it('should call getTasksDueThisWeekHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_tasks_due_this_week';
      (getTasksDueThisWeekHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getTasksDueThisWeekHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_tickler_tasks', () => {
    it('should call getTicklerTasksHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_tickler_tasks';
      (getTicklerTasksHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getTicklerTasksHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_gtd_projects', () => {
    it('should call getGtdProjectsHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_gtd_projects';
      (getGtdProjectsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getGtdProjectsHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_waiting_tasks', () => {
    it('should call getWaitingTasksHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_waiting_tasks';
      (getWaitingTasksHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getWaitingTasksHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_recent_media', () => {
    it('should call getRecentMediaHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_recent_media';
      (getRecentMediaHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getRecentMediaHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_areas_of_focus', () => {
    it('should call getAreasOfFocusHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_areas_of_focus';
      (getAreasOfFocusHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getAreasOfFocusHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get_shopping_list', () => {
    it('should call getShoppingListHandler', async () => {
      // arrange
      mockRequest.params.name = 'get_shopping_list';
      (getShoppingListHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(getShoppingListHandler).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should return error response for unknown tool', async () => {
      // arrange
      mockRequest.params.name = 'unknown_tool';

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'Error: Unknown tool: unknown_tool',
          },
        ],
      });
    });

    it('should handle handler errors and return error response', async () => {
      // arrange
      mockRequest.params.name = 'get_task_comments';
      mockRequest.params.arguments = { task_id: '123' };
      const error = new Error('Handler failed');
      (getTaskCommentsHandler as MockedFunction<any>).mockRejectedValue(error);

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'Error: Handler failed',
          },
        ],
      });
    });

    it('should handle non-Error objects and return generic error message', async () => {
      // arrange
      mockRequest.params.name = 'get_task_comments';
      mockRequest.params.arguments = { task_id: '123' };
      (getTaskCommentsHandler as MockedFunction<any>).mockRejectedValue(
        'String error'
      );

      // act
      const result = await handleToolRequest(mockRequest);

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'Error: Unknown error',
          },
        ],
      });
    });
  });

  describe('logging', () => {
    it('should log tool call with args', async () => {
      // arrange
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockRequest.params.name = 'get_task_comments';
      mockRequest.params.arguments = { task_id: '123' };
      (getTaskCommentsHandler as MockedFunction<any>).mockResolvedValue(
        mockResponse
      );

      // act
      await handleToolRequest(mockRequest);

      // assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'Tool called: get_task_comments with args:',
        JSON.stringify({ task_id: '123' }, null, 2)
      );
      consoleSpy.mockRestore();
    });

    it('should log handler errors', async () => {
      // arrange
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockRequest.params.name = 'get_task_comments';
      mockRequest.params.arguments = { task_id: '123' };
      const error = new Error('Handler failed');
      (getTaskCommentsHandler as MockedFunction<any>).mockRejectedValue(error);

      // act
      await handleToolRequest(mockRequest);

      // assert
      expect(consoleSpy).toHaveBeenCalledWith('Tool execution error:', error);
      consoleSpy.mockRestore();
    });
  });
});
