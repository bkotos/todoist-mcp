import { listGtdProjects } from '../services/tasks/tasks';

export const listGtdProjectsSchema = {
  name: 'list_gtd_projects',
  description:
    'List all GTD projects from Todoist using the (#Projects | #Brian projects | #Ansonia Projects) & !subtask filter, excluding baby-related projects. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const listGtdProjectsHandler = async () => {
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
};
