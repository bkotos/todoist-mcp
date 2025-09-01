#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import {
  getTaskCommentsSchema,
  getTaskCommentsHandler,
  listPersonalInboxTasksSchema,
  listPersonalInboxTasksHandler,
  listBrianInboxPerBeckyTasksSchema,
  listBrianInboxPerBeckyTasksHandler,
  listBeckyInboxPerBrianTasksSchema,
  listBeckyInboxPerBrianTasksHandler,
  listNextActionsSchema,
  listNextActionsHandler,
  getBrianOnlyProjectsSchema,
  getBrianOnlyProjectsHandler,
  getBrianSharedProjectsSchema,
  getBrianSharedProjectsHandler,
  getBeckySharedProjectsSchema,
  getBeckySharedProjectsHandler,
  getInboxProjectsSchema,
  getInboxProjectsHandler,
  createProjectLabelSchema,
  createProjectLabelHandler,
  createTaskCommentSchema,
  createTaskCommentHandler,
  updateTaskSchema,
  updateTaskHandler,
  createTaskSchema,
  createTaskHandler,
  moveTaskSchema,
  moveTaskHandler,
  getContextLabelsSchema,
  getContextLabelsHandler,
  getTasksWithLabelSchema,
  getTasksWithLabelHandler,
  completeTaskSchema,
  completeTaskHandler,
  searchTasksSchema,
  searchTasksHandler,
  searchTasksUsingAndSchema,
  searchTasksUsingAndHandler,
  searchTasksUsingOrSchema,
  searchTasksUsingOrHandler,
  getChoresDueTodaySchema,
  getChoresDueTodayHandler,
  getTasksDueTomorrowSchema,
  getTasksDueTomorrowHandler,
  getTasksDueThisWeekSchema,
  getTasksDueThisWeekHandler,
  getTicklerTasksSchema,
  getTicklerTasksHandler,
  getGtdProjectsSchema,
  getGtdProjectsHandler,
  getWaitingTasksSchema,
  getWaitingTasksHandler,
  getRecentMediaSchema,
  getRecentMediaHandler,
  getAreasOfFocusSchema,
  getAreasOfFocusHandler,
} from './tools';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

console.error('Loading .env file from:', envPath);
config({ path: envPath });

// Validate required environment variables
const requiredEnvVars = ['TODOIST_API_TOKEN'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    'Missing required environment variables:',
    missingVars.join(', ')
  );
  console.error('Please create a .env file with the required variables.');
  process.exit(1);
}

const server = new Server({
  name: 'todoist-mcp',
  version: '1.0.0',
  capabilities: {
    tools: {},
  },
});

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      getTaskCommentsSchema,
      listPersonalInboxTasksSchema,
      listBrianInboxPerBeckyTasksSchema,
      listBeckyInboxPerBrianTasksSchema,
      listNextActionsSchema,
      getBrianOnlyProjectsSchema,
      getBrianSharedProjectsSchema,
      getBeckySharedProjectsSchema,
      getInboxProjectsSchema,
      createProjectLabelSchema,
      createTaskCommentSchema,
      updateTaskSchema,
      createTaskSchema,
      moveTaskSchema,
      getContextLabelsSchema,
      getTasksWithLabelSchema,
      completeTaskSchema,
      searchTasksSchema,
      searchTasksUsingAndSchema,
      searchTasksUsingOrSchema,
      getChoresDueTodaySchema,
      getTasksDueTomorrowSchema,
      getTasksDueThisWeekSchema,
      getTicklerTasksSchema,
      getGtdProjectsSchema,
      getWaitingTasksSchema,
      getRecentMediaSchema,
      getAreasOfFocusSchema,
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
});

// Start the server
console.error('Creating transport...');
const transport = new StdioServerTransport();
console.error('Connecting server to transport...');
server.connect(transport);

console.error('Todoist MCP server started');
console.error('Server ready to handle requests...');

// Keep the server alive by preventing stdin from closing
process.stdin.resume();

// Keep the process alive
process.on('SIGINT', () => {
  console.error('Received SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM, shutting down...');
  process.exit(0);
});

// Add global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
