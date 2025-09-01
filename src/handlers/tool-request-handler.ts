import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
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

// Tool handler function types
type ToolHandlerWithArgs = (args: any) => Promise<ToolResponse>;
type ToolHandlerWithoutArgs = () => Promise<ToolResponse>;

// Tool registries - separate objects for tools with and without arguments
const toolsWithArgs: Record<string, ToolHandlerWithArgs> = {
  get_task_comments: getTaskCommentsHandler,
  create_project_label: createProjectLabelHandler,
  create_task_comment: createTaskCommentHandler,
  update_task: updateTaskHandler,
  create_task: createTaskHandler,
  move_task: moveTaskHandler,
  get_tasks_with_label: getTasksWithLabelHandler,
  complete_task: completeTaskHandler,
  uncomplete_task: uncompleteTaskHandler,
  search_tasks: searchTasksHandler,
  search_tasks_using_and: searchTasksUsingAndHandler,
  search_tasks_using_or: searchTasksUsingOrHandler,
};

const toolsWithoutArgs: Record<string, ToolHandlerWithoutArgs> = {
  list_personal_inbox_tasks: listPersonalInboxTasksHandler,
  list_brian_inbox_per_becky_tasks: listBrianInboxPerBeckyTasksHandler,
  list_becky_inbox_per_brian_tasks: listBeckyInboxPerBrianTasksHandler,
  list_next_actions: listNextActionsHandler,
  get_brian_only_projects: getBrianOnlyProjectsHandler,
  get_brian_shared_projects: getBrianSharedProjectsHandler,
  get_becky_shared_projects: getBeckySharedProjectsHandler,
  get_inbox_projects: getInboxProjectsHandler,
  get_context_labels: getContextLabelsHandler,
  get_chores_due_today: getChoresDueTodayHandler,
  get_tasks_due_tomorrow: getTasksDueTomorrowHandler,
  get_tasks_due_this_week: getTasksDueThisWeekHandler,
  get_tickler_tasks: getTicklerTasksHandler,
  list_gtd_projects: listGtdProjectsHandler,
  get_waiting_tasks: getWaitingTasksHandler,
  get_recent_media: getRecentMediaHandler,
  get_areas_of_focus: getAreasOfFocusHandler,
  get_shopping_list: getShoppingListHandler,
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
