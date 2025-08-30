import { updateTask } from '../services/task-updates';

export const updateTaskSchema = {
  name: 'update_task',
  description:
    'Update a Todoist task with new title, description, labels, priority, due date, or project. All fields are optional - only provided fields will be updated.',
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
      due_date: {
        type: 'string',
        description: 'Due date in YYYY-MM-DD format',
      },
      project_id: {
        type: 'string',
        description: 'The ID of the project to move the task to',
      },
    },
    required: ['task_id'],
  },
};

export const updateTaskHandler = async (args: {
  task_id: string;
  title?: string;
  description?: string;
  labels?: string[];
  priority?: number;
  due_date?: string;
  project_id?: string;
}): Promise<{
  content: Array<{
    type: 'text';
    text: string;
  }>;
}> => {
  console.error('Executing update_task...');
  const {
    task_id,
    title,
    description,
    labels,
    priority,
    due_date,
    project_id,
  } = args;

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

    if (due_date !== undefined) {
      serviceParams.dueDate = due_date;
    }

    if (project_id !== undefined) {
      serviceParams.projectId = project_id;
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
};
