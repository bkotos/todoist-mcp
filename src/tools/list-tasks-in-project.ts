import { listTasksInProject } from '../services/todoist';

export const listTasksInProjectSchema = {
  name: 'list_tasks_in_project',
  description:
    'List all tasks in a specific Todoist project. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {
      project_id: {
        type: 'string',
        description: 'The ID of the project to list tasks from',
      },
    },
    required: ['project_id'],
  },
};

export const listTasksInProjectHandler = async (args: {
  project_id: string;
}) => {
  console.error('Executing list_tasks_in_project...');
  const { project_id } = args;
  if (!project_id) {
    throw new Error('project_id is required');
  }
  const result = await listTasksInProject(project_id);
  console.error('list_tasks_in_project completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
