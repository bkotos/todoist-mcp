import { getWaitingTasks } from '../services/waiting-tasks';

export const getWaitingTasksSchema = {
  name: 'get_waiting_tasks',
  description:
    'Get all waiting tasks from Todoist using the filter "#Waiting | #Brian waiting | #Ansonia Waiting". Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

export const getWaitingTasksHandler = async () => {
  console.error('Executing get_waiting_tasks...');
  const result = await getWaitingTasks();
  console.error('get_waiting_tasks completed successfully');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
};
