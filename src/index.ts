#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { TodoistService } from './services/todoist.js';
import { config } from 'dotenv';

// Load environment variables
config();

const server = new Server(
  {
    name: 'todoist-mcp',
    version: '1.0.0',
  }
);

// Initialize Todoist service
const todoistService = new TodoistService();

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_inbox_tasks',
        description: 'List all tasks from specified inbox projects',
        inputSchema: {
          type: 'object',
          properties: {
            project_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of project IDs to fetch tasks from (optional, uses env config if not provided)',
            },
          },
        },
      },
      {
        name: 'create_task',
        description: 'Create a new task in Todoist',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The content/title of the task',
            },
            project_id: {
              type: 'string',
              description: 'The project ID where to create the task (optional)',
            },
            due_string: {
              type: 'string',
              description: 'Due date string (e.g., "today", "tomorrow", "next week") (optional)',
            },
            priority: {
              type: 'number',
              description: 'Priority level (1-4, where 1 is highest) (optional)',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'update_task',
        description: 'Update an existing task in Todoist',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: {
              type: 'string',
              description: 'The ID of the task to update',
            },
            content: {
              type: 'string',
              description: 'New content for the task (optional)',
            },
            due_string: {
              type: 'string',
              description: 'New due date string (optional)',
            },
            priority: {
              type: 'number',
              description: 'New priority level (1-4) (optional)',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of label names to assign to the task (optional)',
            },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'close_task',
        description: 'Close/complete a task in Todoist',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: {
              type: 'string',
              description: 'The ID of the task to close',
            },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'list_projects',
        description: 'List all projects in Todoist',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_inbox_tasks':
        return {
          content: [
            {
              type: 'text',
              text: await todoistService.listInboxTasks(args?.project_ids as string[] | undefined),
            },
          ],
        };

      case 'create_task':
        return {
          content: [
            {
              type: 'text',
              text: await todoistService.createTask(args as any),
            },
          ],
        };

      case 'update_task':
        return {
          content: [
            {
              type: 'text',
              text: await todoistService.updateTask(args?.task_id as string, args as any),
            },
          ],
        };

      case 'close_task':
        return {
          content: [
            {
              type: 'text',
              text: await todoistService.closeTask(args?.task_id as string),
            },
          ],
        };

      case 'list_projects':
        return {
          content: [
            {
              type: 'text',
              text: await todoistService.listProjects(),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport);

console.error('Todoist MCP server started');
