import { listBrianTimeSensitiveTasks } from '../services/tasks/task-retrieval';
import { ProjectNames } from '../utils';
import type { Tool } from './types';

// Single tool object that implements the Tool interface
export const listBrianTimeSensitiveTasksTool: Tool = {
  schema: {
    name: 'list_brian_time_sensitive_tasks',
    description: `List all Brian time sensitive tasks from Todoist using the ##${ProjectNames.BRIAN_TIME_SENSITIVE} & !subtask filter. Returns structured JSON data with task details including id, content, description, completion status, labels, priority, due date, and comment count.`,
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing list_brian_time_sensitive_tasks...');
    const result = await listBrianTimeSensitiveTasks();
    console.error('list_brian_time_sensitive_tasks completed successfully');
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
