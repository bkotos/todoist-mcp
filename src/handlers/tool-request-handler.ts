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

export interface ToolRequestArgs {
  [key: string]: any;
}

export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export async function handleToolRequest(
  request: CallToolRequest
): Promise<ToolResponse> {
  const { name, arguments: args } = request.params;

  console.error(
    `Tool called: ${name} with args:`,
    JSON.stringify(args, null, 2)
  );

  try {
    switch (name) {
      case 'get_task_comments':
        return await getTaskCommentsHandler(args as { task_id: string });

      case 'list_personal_inbox_tasks':
        return await listPersonalInboxTasksHandler();

      case 'list_brian_inbox_per_becky_tasks':
        return await listBrianInboxPerBeckyTasksHandler();

      case 'list_becky_inbox_per_brian_tasks':
        return await listBeckyInboxPerBrianTasksHandler();

      case 'list_next_actions':
        return await listNextActionsHandler();

      case 'get_brian_only_projects':
        return await getBrianOnlyProjectsHandler();

      case 'get_brian_shared_projects':
        return await getBrianSharedProjectsHandler();

      case 'get_becky_shared_projects':
        return await getBeckySharedProjectsHandler();

      case 'get_inbox_projects':
        return await getInboxProjectsHandler();

      case 'create_project_label':
        return await createProjectLabelHandler(
          args as { project_name: string }
        );

      case 'create_task_comment':
        return await createTaskCommentHandler(
          args as { task_id: string; content: string }
        );

      case 'update_task':
        return await updateTaskHandler(
          args as {
            task_id: string;
            title?: string;
            description?: string;
            labels?: string[];
            priority?: number;
            due_date?: string;
          }
        );

      case 'create_task':
        return await createTaskHandler(
          args as {
            title: string;
            description?: string;
            project_id?: string;
            labels?: string[];
            priority?: number;
            due_date?: string;
          }
        );

      case 'move_task':
        return await moveTaskHandler(
          args as {
            task_id: string;
            project_id: string;
          }
        );

      case 'get_context_labels':
        return await getContextLabelsHandler();

      case 'get_tasks_with_label':
        return await getTasksWithLabelHandler(args as { label: string });

      case 'complete_task':
        return await completeTaskHandler(args as { task_id: string });

      case 'search_tasks':
        return await searchTasksHandler(args as { query: string });

      case 'search_tasks_using_and':
        return await searchTasksUsingAndHandler(
          args as { search_terms: string[] }
        );

      case 'search_tasks_using_or':
        return await searchTasksUsingOrHandler(
          args as { search_terms: string[] }
        );

      case 'get_chores_due_today':
        return await getChoresDueTodayHandler();

      case 'get_tasks_due_tomorrow':
        return await getTasksDueTomorrowHandler();

      case 'get_tasks_due_this_week':
        return await getTasksDueThisWeekHandler();

      case 'get_tickler_tasks':
        return await getTicklerTasksHandler();

      case 'get_gtd_projects':
        return await getGtdProjectsHandler();

      case 'get_waiting_tasks':
        return await getWaitingTasksHandler();

      case 'get_recent_media':
        return await getRecentMediaHandler();

      case 'get_areas_of_focus':
        return await getAreasOfFocusHandler();

      case 'get_shopping_list':
        return await getShoppingListHandler();

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
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
