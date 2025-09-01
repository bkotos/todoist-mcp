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
  uncompleteTaskHandler: vi.fn(),
  searchTasksHandler: vi.fn(),
  searchTasksUsingAndHandler: vi.fn(),
  searchTasksUsingOrHandler: vi.fn(),
  getChoresDueTodayHandler: vi.fn(),
  getTasksDueTomorrowHandler: vi.fn(),
  getTasksDueThisWeekHandler: vi.fn(),
  getTicklerTasksHandler: vi.fn(),
  listGtdProjectsHandler: vi.fn(),
  getWaitingTasksHandler: vi.fn(),
  getRecentMediaHandler: vi.fn(),
  getAreasOfFocusHandler: vi.fn(),
  getShoppingListHandler: vi.fn(),
  completeBeckyTaskHandler: vi.fn(),
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
  uncompleteTaskHandler,
  searchTasksHandler,
  searchTasksUsingAndHandler,
  searchTasksUsingOrHandler,
  getChoresDueTodayHandler,
  getTasksDueTomorrowHandler,
  getTasksDueThisWeekHandler,
  getTicklerTasksHandler,
  listGtdProjectsHandler,
  getWaitingTasksHandler,
  getRecentMediaHandler,
  getAreasOfFocusHandler,
  getShoppingListHandler,
  completeBeckyTaskHandler,
} from '../tools';

// Test configuration for all tools
const toolTestConfig = [
  {
    toolName: 'get_task_comments',
    handler: getTaskCommentsHandler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
  {
    toolName: 'create_project_label',
    handler: createProjectLabelHandler,
    args: { project_name: 'Test Project' },
    expectedCall: { project_name: 'Test Project' },
  },
  {
    toolName: 'create_task_comment',
    handler: createTaskCommentHandler,
    args: { task_id: '123', content: 'Test comment' },
    expectedCall: { task_id: '123', content: 'Test comment' },
  },
  {
    toolName: 'update_task',
    handler: updateTaskHandler,
    args: {
      task_id: '123',
      title: 'Updated Title',
      description: 'Updated description',
      labels: ['label1', 'label2'],
      priority: 2,
      due_date: '2024-01-01',
    },
    expectedCall: {
      task_id: '123',
      title: 'Updated Title',
      description: 'Updated description',
      labels: ['label1', 'label2'],
      priority: 2,
      due_date: '2024-01-01',
    },
  },
  {
    toolName: 'create_task',
    handler: createTaskHandler,
    args: {
      title: 'New Task',
      description: 'Task description',
      project_id: '456',
      labels: ['label1'],
      priority: 1,
      due_date: '2024-01-01',
    },
    expectedCall: {
      title: 'New Task',
      description: 'Task description',
      project_id: '456',
      labels: ['label1'],
      priority: 1,
      due_date: '2024-01-01',
    },
  },
  {
    toolName: 'move_task',
    handler: moveTaskHandler,
    args: { task_id: '123', project_id: '456' },
    expectedCall: { task_id: '123', project_id: '456' },
  },
  {
    toolName: 'get_tasks_with_label',
    handler: getTasksWithLabelHandler,
    args: { label: 'work' },
    expectedCall: { label: 'work' },
  },
  {
    toolName: 'complete_task',
    handler: completeTaskHandler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
  {
    toolName: 'uncomplete_task',
    handler: uncompleteTaskHandler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
  {
    toolName: 'search_tasks',
    handler: searchTasksHandler,
    args: { query: 'search query' },
    expectedCall: { query: 'search query' },
  },
  {
    toolName: 'search_tasks_using_and',
    handler: searchTasksUsingAndHandler,
    args: { search_terms: ['term1', 'term2'] },
    expectedCall: { search_terms: ['term1', 'term2'] },
  },
  {
    toolName: 'search_tasks_using_or',
    handler: searchTasksUsingOrHandler,
    args: { search_terms: ['term1', 'term2'] },
    expectedCall: { search_terms: ['term1', 'term2'] },
  },
  {
    toolName: 'complete_becky_task',
    handler: completeBeckyTaskHandler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
];

// Test configuration for tools without parameters
const noParamToolTestConfig = [
  {
    toolName: 'list_personal_inbox_tasks',
    handler: listPersonalInboxTasksHandler,
  },
  {
    toolName: 'list_brian_inbox_per_becky_tasks',
    handler: listBrianInboxPerBeckyTasksHandler,
  },
  {
    toolName: 'list_becky_inbox_per_brian_tasks',
    handler: listBeckyInboxPerBrianTasksHandler,
  },
  {
    toolName: 'list_next_actions',
    handler: listNextActionsHandler,
  },
  {
    toolName: 'get_brian_only_projects',
    handler: getBrianOnlyProjectsHandler,
  },
  {
    toolName: 'get_brian_shared_projects',
    handler: getBrianSharedProjectsHandler,
  },
  {
    toolName: 'get_becky_shared_projects',
    handler: getBeckySharedProjectsHandler,
  },
  {
    toolName: 'get_inbox_projects',
    handler: getInboxProjectsHandler,
  },
  {
    toolName: 'get_context_labels',
    handler: getContextLabelsHandler,
  },
  {
    toolName: 'get_chores_due_today',
    handler: getChoresDueTodayHandler,
  },
  {
    toolName: 'get_tasks_due_tomorrow',
    handler: getTasksDueTomorrowHandler,
  },
  {
    toolName: 'get_tasks_due_this_week',
    handler: getTasksDueThisWeekHandler,
  },
  {
    toolName: 'get_tickler_tasks',
    handler: getTicklerTasksHandler,
  },
  {
    toolName: 'list_gtd_projects',
    handler: listGtdProjectsHandler,
  },
  {
    toolName: 'get_waiting_tasks',
    handler: getWaitingTasksHandler,
  },
  {
    toolName: 'get_recent_media',
    handler: getRecentMediaHandler,
  },
  {
    toolName: 'get_areas_of_focus',
    handler: getAreasOfFocusHandler,
  },
  {
    toolName: 'get_shopping_list',
    handler: getShoppingListHandler,
  },
];

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

  // Generate tests for tools with parameters
  toolTestConfig.forEach(({ toolName, handler, args, expectedCall }) => {
    describe(toolName, () => {
      it(`should call ${handler.name} with correct args`, async () => {
        // arrange
        mockRequest.params.name = toolName;
        mockRequest.params.arguments = args;
        (handler as MockedFunction<any>).mockResolvedValue(mockResponse);

        // act
        const result = await handleToolRequest(mockRequest);

        // assert
        expect(handler).toHaveBeenCalledWith(expectedCall);
        expect(result).toEqual(mockResponse);
      });
    });
  });

  // Generate tests for tools without parameters
  noParamToolTestConfig.forEach(({ toolName, handler }) => {
    describe(toolName, () => {
      it(`should call ${handler.name} with no args`, async () => {
        // arrange
        mockRequest.params.name = toolName;
        mockRequest.params.arguments = {};
        (handler as MockedFunction<any>).mockResolvedValue(mockResponse);

        // act
        const result = await handleToolRequest(mockRequest);

        // assert
        expect(handler).toHaveBeenCalledWith();
        expect(result).toEqual(mockResponse);
      });
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
