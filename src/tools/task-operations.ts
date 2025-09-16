import {
  createTask,
  updateTask,
  moveTask,
  completeTask,
  uncompleteTask,
  completeBeckyTask,
} from '../services/tasks/task-update';
import type { Tool } from './types';

// Create Task Tool
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

// Update Task Tool
export const updateTaskTool: Tool = {
  schema: {
    name: 'update_task',
    description:
      'Update a Todoist task with new title, description, labels, priority, or due string. All fields are optional - only provided fields will be updated.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to update (required)',
        },
        title: {
          type: 'string',
          description: 'New title for the task',
        },
        description: {
          type: 'string',
          description: 'New description for the task',
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
        due_string: {
          type: 'string',
          description:
            'Human defined task due date (ex.: "next Monday", "Tomorrow"). Value is set using local (not UTC) time. Using "no date" or "no due date" removes the date.',
        },
      },
      required: ['task_id'],
    },
  },
  handler: async (args: {
    task_id: string;
    title?: string;
    description?: string;
    labels?: string[];
    priority?: number;
    due_string?: string;
  }): Promise<{
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }> => {
    console.error('Executing update_task...');
    const { task_id, title, description, labels, priority, due_string } = args;

    if (!task_id) {
      throw new Error('task_id is required');
    }

    try {
      // Build service parameters with only provided fields
      const serviceParams: any = {
        taskId: task_id,
      };

      if (title !== undefined) {
        serviceParams.title = title;
      }

      if (description !== undefined) {
        serviceParams.description = description;
      }

      if (labels !== undefined) {
        serviceParams.labels = labels;
      }

      if (priority !== undefined) {
        serviceParams.priority = priority;
      }

      if (due_string !== undefined) {
        serviceParams.dueString = due_string;
      }

      const result = await updateTask(serviceParams);
      console.error('update_task completed successfully');

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error('update_task error:', error);
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

// Move Task Tool
export const moveTaskTool: Tool = {
  schema: {
    name: 'move_task',
    description: 'Move a task from one project to another',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The task ID to move',
        },
        project_id: {
          type: 'string',
          description: 'The project ID to move the task to',
        },
      },
      required: ['task_id', 'project_id'],
    },
  },
  handler: async (args: {
    task_id: string;
    project_id: string;
  }): Promise<{
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }> => {
    console.error('Executing move_task...');
    const { task_id, project_id } = args;

    if (!task_id) {
      throw new Error('task_id is required');
    }

    if (!project_id) {
      throw new Error('project_id is required');
    }

    try {
      await moveTask(task_id, project_id);
      console.error('move_task completed successfully');

      return {
        content: [
          {
            type: 'text',
            text: `Task ${task_id} successfully moved to project ${project_id}`,
          },
        ],
      };
    } catch (error) {
      console.error('move_task error:', error);
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

// Complete Task Tool
export const completeTaskTool: Tool = {
  schema: {
    name: 'complete_task',
    description: 'Complete a task by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to complete',
        },
      },
      required: ['task_id'],
    },
  },
  handler: async (args: { task_id: string }) => {
    try {
      const result = await completeTask(args.task_id);
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
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

// Uncomplete Task Tool
export const uncompleteTaskTool: Tool = {
  schema: {
    name: 'uncomplete_task',
    description: 'Uncomplete (reopen) a task by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to uncomplete',
        },
      },
      required: ['task_id'],
    },
  },
  handler: async (args: { task_id: string }) => {
    try {
      await uncompleteTask(args.task_id);
      return {
        content: [
          {
            type: 'text',
            text: 'Task uncompleted successfully',
          },
        ],
      };
    } catch (error) {
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

// Complete Becky Task Tool
export const completeBeckyTaskTool: Tool = {
  schema: {
    name: 'complete_becky_task',
    description:
      'Complete a Brian shared task (assigned to Brian from Becky) by setting due date to today, adding a completion comment, and moving it to Becky inbox project',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to complete',
        },
      },
      required: ['task_id'],
    },
  },
  handler: async (args: { task_id: string }) => {
    try {
      console.error('Executing complete_becky_task...');
      await completeBeckyTask(args.task_id);
      console.error('complete_becky_task completed successfully');

      return {
        content: [
          {
            type: 'text',
            text: 'Task completed successfully. Due date set to today, completion comment added, and task moved to Becky inbox project.',
          },
        ],
      };
    } catch (error) {
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
