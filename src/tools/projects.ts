import {
  getInboxProjects,
  getBeckySharedProjects,
  getBrianSharedProjects,
  getBrianOnlyProjects,
} from '../services/project-filters';
import { listGtdProjects } from '../services/tasks/task-retrieval';
import { createProjectLabel } from '../services/labels/labels';
import type { Tool } from './types';

// Get Inbox Projects Tool
export const getInboxProjectsTool: Tool = {
  schema: {
    name: 'get_inbox_projects',
    description:
      'Get the three inbox projects: Inbox, Brian inbox - per Becky, and Becky inbox - per Brian',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_inbox_projects...');
    try {
      const result = await getInboxProjects();
      console.error('get_inbox_projects completed successfully');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to get inbox projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};

// Get Becky Shared Projects Tool
export const getBeckySharedProjectsTool: Tool = {
  schema: {
    name: 'get_becky_shared_projects',
    description:
      'Get projects that belong to Becky and are shared for tasks in her ballpark to handle per Brian',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_becky_shared_projects...');
    try {
      const result = await getBeckySharedProjects();
      console.error('get_becky_shared_projects completed successfully');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to get Becky shared projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};

// Get Brian Shared Projects Tool
export const getBrianSharedProjectsTool: Tool = {
  schema: {
    name: 'get_brian_shared_projects',
    description:
      'Get projects that belong to Brian and are shared for tasks in his ballpark to handle per Becky',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_brian_shared_projects...');
    try {
      const result = await getBrianSharedProjects();
      console.error('get_brian_shared_projects completed successfully');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to get Brian shared projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};

// Get Brian Only Projects Tool
export const getBrianOnlyProjectsTool: Tool = {
  schema: {
    name: 'get_brian_only_projects',
    description: 'Get projects that belong only to Brian and are NOT shared',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_brian_only_projects...');
    try {
      const result = await getBrianOnlyProjects();
      console.error('get_brian_only_projects completed successfully');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to get Brian-only projects: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
};

// List GTD Projects Tool
export const listGtdProjectsTool: Tool = {
  schema: {
    name: 'list_gtd_projects',
    description:
      'List all GTD projects from Todoist using the (#Projects | #Brian projects | #Ansonia Projects) & !subtask filter, excluding baby-related projects. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_gtd_projects...');
    const result = await listGtdProjects();
    console.error('list_gtd_projects completed successfully');
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
};

// Create Project Label Tool
export const createProjectLabelTool: Tool = {
  schema: {
    name: 'create_project_label',
    description:
      'Create a new project label in Todoist. The label name must start with "PROJECT: " (with a space after the colon). The label will be created with charcoal color.',
    inputSchema: {
      type: 'object',
      properties: {
        project_name: {
          type: 'string',
          description:
            'The name of the project label. Must start with "PROJECT: " (e.g., "PROJECT: Website Redesign")',
        },
      },
      required: ['project_name'],
    },
  },
  handler: async (args: { project_name: string }) => {
    console.error('Executing create_project_label...');
    const { project_name } = args;
    if (!project_name) {
      throw new Error('project_name is required');
    }
    const result = await createProjectLabel(project_name);
    console.error('create_project_label completed successfully');
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
};
