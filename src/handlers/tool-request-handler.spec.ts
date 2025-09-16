import type { MockedFunction } from 'vitest';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { handleToolRequest } from './tool-request-handler';

// Mock all tool handlers
vi.mock('../tools', () => ({
  getTaskCommentsTool: { handler: vi.fn() },
  listPersonalInboxTasksTool: { handler: vi.fn() },
  listBrianInboxPerBeckyTasksTool: { handler: vi.fn() },
  listBeckyInboxPerBrianTasksTool: { handler: vi.fn() },
  listNextActionsTool: { handler: vi.fn() },
  getBrianOnlyProjectsTool: { handler: vi.fn() },
  getBrianSharedProjectsTool: { handler: vi.fn() },
  getBeckySharedProjectsTool: { handler: vi.fn() },
  getInboxProjectsTool: { handler: vi.fn() },
  createProjectLabelTool: { handler: vi.fn() },
  createTaskCommentTool: { handler: vi.fn() },
  updateTaskTool: { handler: vi.fn() },
  createTaskTool: { handler: vi.fn() },
  moveTaskTool: { handler: vi.fn() },
  getContextLabelsTool: { handler: vi.fn() },
  getTasksWithLabelTool: { handler: vi.fn() },
  completeTaskTool: { handler: vi.fn() },
  uncompleteTaskTool: { handler: vi.fn() },
  searchTasksTool: { handler: vi.fn() },
  searchTasksUsingAndTool: { handler: vi.fn() },
  searchTasksUsingOrTool: { handler: vi.fn() },
  getChoresDueTodayTool: { handler: vi.fn() },
  getTasksDueTomorrowTool: { handler: vi.fn() },
  getTasksDueThisWeekTool: { handler: vi.fn() },
  getTicklerTasksTool: { handler: vi.fn() },
  listGtdProjectsTool: { handler: vi.fn() },
  getWaitingTasksTool: { handler: vi.fn() },
  getRecentMediaTool: { handler: vi.fn() },
  getAreasOfFocusTool: { handler: vi.fn() },
  getShoppingListTool: { handler: vi.fn() },
  completeBeckyTaskTool: { handler: vi.fn() },
  listBrianTimeSensitiveTasksTool: { handler: vi.fn() },
  listBeckyTimeSensitiveTasksTool: { handler: vi.fn() },
}));

// Import mocked functions
import {
  getTaskCommentsTool,
  listPersonalInboxTasksTool,
  listBrianInboxPerBeckyTasksTool,
  listBeckyInboxPerBrianTasksTool,
  listNextActionsTool,
  getBrianOnlyProjectsTool,
  getBrianSharedProjectsTool,
  getBeckySharedProjectsTool,
  getInboxProjectsTool,
  createProjectLabelTool,
  createTaskCommentTool,
  updateTaskTool,
  createTaskTool,
  moveTaskTool,
  getContextLabelsTool,
  getTasksWithLabelTool,
  completeTaskTool,
  uncompleteTaskTool,
  searchTasksTool,
  searchTasksUsingAndTool,
  searchTasksUsingOrTool,
  getChoresDueTodayTool,
  getTasksDueTomorrowTool,
  getTasksDueThisWeekTool,
  getTicklerTasksTool,
  listGtdProjectsTool,
  getWaitingTasksTool,
  getRecentMediaTool,
  getAreasOfFocusTool,
  getShoppingListTool,
  completeBeckyTaskTool,
  listBrianTimeSensitiveTasksTool,
  listBeckyTimeSensitiveTasksTool,
} from '../tools';

// Test configuration for all tools
const toolTestConfig = [
  {
    toolName: 'get_task_comments',
    handler: getTaskCommentsTool.handler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
  {
    toolName: 'create_project_label',
    handler: createProjectLabelTool.handler,
    args: { project_name: 'Test Project' },
    expectedCall: { project_name: 'Test Project' },
  },
  {
    toolName: 'create_task_comment',
    handler: createTaskCommentTool.handler,
    args: { task_id: '123', content: 'Test comment' },
    expectedCall: { task_id: '123', content: 'Test comment' },
  },
  {
    toolName: 'update_task',
    handler: updateTaskTool.handler,
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
    handler: createTaskTool.handler,
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
    handler: moveTaskTool.handler,
    args: { task_id: '123', project_id: '456' },
    expectedCall: { task_id: '123', project_id: '456' },
  },
  {
    toolName: 'get_tasks_with_label',
    handler: getTasksWithLabelTool.handler,
    args: { label: 'work' },
    expectedCall: { label: 'work' },
  },
  {
    toolName: 'complete_task',
    handler: completeTaskTool.handler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
  {
    toolName: 'uncomplete_task',
    handler: uncompleteTaskTool.handler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
  {
    toolName: 'search_tasks',
    handler: searchTasksTool.handler,
    args: { query: 'search query' },
    expectedCall: { query: 'search query' },
  },
  {
    toolName: 'search_tasks_using_and',
    handler: searchTasksUsingAndTool.handler,
    args: { search_terms: ['term1', 'term2'] },
    expectedCall: { search_terms: ['term1', 'term2'] },
  },
  {
    toolName: 'search_tasks_using_or',
    handler: searchTasksUsingOrTool.handler,
    args: { search_terms: ['term1', 'term2'] },
    expectedCall: { search_terms: ['term1', 'term2'] },
  },
  {
    toolName: 'complete_becky_task',
    handler: completeBeckyTaskTool.handler,
    args: { task_id: '123' },
    expectedCall: { task_id: '123' },
  },
];

// Test configuration for tools without parameters
const noParamToolTestConfig = [
  {
    toolName: 'list_personal_inbox_tasks',
    handler: listPersonalInboxTasksTool.handler,
  },
  {
    toolName: 'list_brian_inbox_per_becky_tasks',
    handler: listBrianInboxPerBeckyTasksTool.handler,
  },
  {
    toolName: 'list_becky_inbox_per_brian_tasks',
    handler: listBeckyInboxPerBrianTasksTool.handler,
  },
  {
    toolName: 'list_next_actions',
    handler: listNextActionsTool.handler,
  },
  {
    toolName: 'get_brian_only_projects',
    handler: getBrianOnlyProjectsTool.handler,
  },
  {
    toolName: 'get_brian_shared_projects',
    handler: getBrianSharedProjectsTool.handler,
  },
  {
    toolName: 'get_becky_shared_projects',
    handler: getBeckySharedProjectsTool.handler,
  },
  {
    toolName: 'get_inbox_projects',
    handler: getInboxProjectsTool.handler,
  },
  {
    toolName: 'get_context_labels',
    handler: getContextLabelsTool.handler,
  },
  {
    toolName: 'get_chores_due_today',
    handler: getChoresDueTodayTool.handler,
  },
  {
    toolName: 'get_tasks_due_tomorrow',
    handler: getTasksDueTomorrowTool.handler,
  },
  {
    toolName: 'get_tasks_due_this_week',
    handler: getTasksDueThisWeekTool.handler,
  },
  {
    toolName: 'get_tickler_tasks',
    handler: getTicklerTasksTool.handler,
  },
  {
    toolName: 'list_gtd_projects',
    handler: listGtdProjectsTool.handler,
  },
  {
    toolName: 'get_waiting_tasks',
    handler: getWaitingTasksTool.handler,
  },
  {
    toolName: 'get_recent_media',
    handler: getRecentMediaTool.handler,
  },
  {
    toolName: 'get_areas_of_focus',
    handler: getAreasOfFocusTool.handler,
  },
  {
    toolName: 'get_shopping_list',
    handler: getShoppingListTool.handler,
  },
  {
    toolName: 'list_brian_time_sensitive_tasks',
    handler: listBrianTimeSensitiveTasksTool.handler,
  },
  {
    toolName: 'list_becky_time_sensitive_tasks',
    handler: listBeckyTimeSensitiveTasksTool.handler,
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
      (getTaskCommentsTool.handler as MockedFunction<any>).mockRejectedValue(
        error
      );

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
      (getTaskCommentsTool.handler as MockedFunction<any>).mockRejectedValue(
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
      (getTaskCommentsTool.handler as MockedFunction<any>).mockResolvedValue(
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
      (getTaskCommentsTool.handler as MockedFunction<any>).mockRejectedValue(
        error
      );

      // act
      await handleToolRequest(mockRequest);

      // assert
      expect(consoleSpy).toHaveBeenCalledWith('Tool execution error:', error);
      consoleSpy.mockRestore();
    });
  });
});
