#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
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
} from './tools';
import { handleToolRequest } from './handlers/tool-request-handler';
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
      getTaskCommentsTool.schema,
      listPersonalInboxTasksTool.schema,
      listBrianInboxPerBeckyTasksTool.schema,
      listBeckyInboxPerBrianTasksTool.schema,
      listNextActionsTool.schema,
      getBrianOnlyProjectsTool.schema,
      getBrianSharedProjectsTool.schema,
      getBeckySharedProjectsTool.schema,
      getInboxProjectsTool.schema,
      createProjectLabelTool.schema,
      createTaskCommentTool.schema,
      updateTaskTool.schema,
      createTaskTool.schema,
      moveTaskTool.schema,
      getContextLabelsTool.schema,
      getTasksWithLabelTool.schema,
      completeTaskTool.schema,
      uncompleteTaskTool.schema,
      searchTasksTool.schema,
      searchTasksUsingAndTool.schema,
      searchTasksUsingOrTool.schema,
      getChoresDueTodayTool.schema,
      getTasksDueTomorrowTool.schema,
      getTasksDueThisWeekTool.schema,
      getTicklerTasksTool.schema,
      listGtdProjectsTool.schema,
      getWaitingTasksTool.schema,
      getRecentMediaTool.schema,
      getAreasOfFocusTool.schema,
      getShoppingListTool.schema,
      completeBeckyTaskTool.schema,
      listBrianTimeSensitiveTasksTool.schema,
      listBeckyTimeSensitiveTasksTool.schema,
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, handleToolRequest as any);

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
