import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
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

export interface ToolRequestArgs {
  [key: string]: any;
}

export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// Tool registries - separate objects for tools with and without arguments
const toolsWithArgs: Record<string, (args: any) => Promise<ToolResponse>> = {
  get_task_comments: getTaskCommentsTool.handler,
  create_project_label: createProjectLabelTool.handler,
  create_task_comment: createTaskCommentTool.handler,
  update_task: updateTaskTool.handler,
  create_task: createTaskTool.handler,
  move_task: moveTaskTool.handler,
  get_tasks_with_label: getTasksWithLabelTool.handler,
  complete_task: completeTaskTool.handler,
  uncomplete_task: uncompleteTaskTool.handler,
  search_tasks: searchTasksTool.handler,
  search_tasks_using_and: searchTasksUsingAndTool.handler,
  search_tasks_using_or: searchTasksUsingOrTool.handler,
  complete_becky_task: completeBeckyTaskTool.handler,
};

const toolsWithoutArgs: Record<string, () => Promise<ToolResponse>> = {
  list_personal_inbox_tasks: listPersonalInboxTasksTool.handler,
  list_brian_inbox_per_becky_tasks: listBrianInboxPerBeckyTasksTool.handler,
  list_becky_inbox_per_brian_tasks: listBeckyInboxPerBrianTasksTool.handler,
  list_next_actions: listNextActionsTool.handler,
  get_brian_only_projects: getBrianOnlyProjectsTool.handler,
  get_brian_shared_projects: getBrianSharedProjectsTool.handler,
  get_becky_shared_projects: getBeckySharedProjectsTool.handler,
  get_inbox_projects: getInboxProjectsTool.handler,
  get_context_labels: getContextLabelsTool.handler,
  get_chores_due_today: getChoresDueTodayTool.handler,
  get_tasks_due_tomorrow: getTasksDueTomorrowTool.handler,
  get_tasks_due_this_week: getTasksDueThisWeekTool.handler,
  get_tickler_tasks: getTicklerTasksTool.handler,
  list_gtd_projects: listGtdProjectsTool.handler,
  get_waiting_tasks: getWaitingTasksTool.handler,
  get_recent_media: getRecentMediaTool.handler,
  get_areas_of_focus: getAreasOfFocusTool.handler,
  get_shopping_list: getShoppingListTool.handler,
  list_brian_time_sensitive_tasks: listBrianTimeSensitiveTasksTool.handler,
  list_becky_time_sensitive_tasks: listBeckyTimeSensitiveTasksTool.handler,
};

export async function handleToolRequest(
  request: CallToolRequest
): Promise<ToolResponse> {
  const { name, arguments: args } = request.params;

  console.error(
    `Tool called: ${name} with args:`,
    JSON.stringify(args, null, 2)
  );

  try {
    // Check if tool requires arguments
    if (name in toolsWithArgs) {
      return await toolsWithArgs[name](args);
    }

    // Check if tool doesn't require arguments
    if (name in toolsWithoutArgs) {
      return await toolsWithoutArgs[name]();
    }

    // Tool not found in either registry
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    console.error('Tool execution error:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        },
      ],
    };
  }
}
