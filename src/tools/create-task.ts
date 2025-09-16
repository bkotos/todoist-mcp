import { createTask } from '../services/tasks/task-update';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const createTaskTool: Tool = {
  schema: {
    name: 'create_task',
    description:
      'Create a new Todoist task with title, description, project, labels, priority, and due date. Only title is required.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title/content of the task (required)',
        },
        description: {
          type: 'string',
          description: 'Description for the task',
        },
        project_id: {
          type: 'string',
          description: 'The ID of the project to create the task in',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of label names to assign to the task',
        },
        priority: {
          type: 'number',
          description: 'Priority level (1-4, where 1 is highest priority)',
        },
        due_date: {
          type: 'string',
          description: 'Due date in YYYY-MM-DD format',
        },
      },
      required: ['title'],
    },
  },
  handler: async (args: {
    title: string;
    description?: string;
    project_id?: string;
    labels?: string[];
    priority?: number;
    due_date?: string;
  }): Promise<{
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }> => {
    console.error('Executing create_task...');
    const { title, description, project_id, labels, priority, due_date } = args;

    if (!title) {
      throw new Error('title is required');
    }

    try {
      // Build service parameters with only provided fields
      const serviceParams: any = {
        title,
      };

      if (description !== undefined) {
        serviceParams.description = description;
      }

      if (project_id !== undefined) {
        serviceParams.projectId = project_id;
      }

      if (labels !== undefined) {
        serviceParams.labels = labels;
      }

      if (priority !== undefined) {
        serviceParams.priority = priority;
      }

      if (due_date !== undefined) {
        serviceParams.dueDate = due_date;
      }

      const result = await createTask(serviceParams);
      console.error('create_task completed successfully');

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error('create_task error:', error);
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
  },
};
