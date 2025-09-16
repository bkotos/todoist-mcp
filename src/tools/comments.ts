import { getTaskComments, createTaskComment } from '../services/tasks/comments';
import { getContextLabels } from '../services/labels/labels';
import type { Tool } from './types';

// Get Task Comments Tool
export const getTaskCommentsTool: Tool = {
  schema: {
    name: 'get_task_comments',
    description:
      'Get all comments for a specific Todoist task. Returns structured JSON data with comment details including id, content, posted date, user ID, and any attachments.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to get comments for',
        },
      },
      required: ['task_id'],
    },
  },
  handler: async (args: { task_id: string }) => {
    console.error('Executing get_task_comments...');
    const { task_id } = args;
    if (!task_id) {
      throw new Error('task_id is required');
    }
    const result = await getTaskComments(task_id);
    console.error('get_task_comments completed successfully');
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

// Create Task Comment Tool
export const createTaskCommentTool: Tool = {
  schema: {
    name: 'create_task_comment',
    description:
      'Create a new comment on a specific Todoist task. The comment will automatically include a signature indicating it was created using Claude.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'The ID of the task to add a comment to',
        },
        content: {
          type: 'string',
          description: 'The content of the comment to add',
        },
      },
      required: ['task_id', 'content'],
    },
  },
  handler: async (args: { task_id: string; content: string }) => {
    try {
      const comment = await createTaskComment(args.task_id, args.content);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: 'Comment created successfully',
                comment: {
                  id: comment.id,
                  content: comment.content,
                  posted: comment.posted,
                  posted_uid: comment.posted_uid,
                  attachment: comment.attachment,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: false,
                message: 'Failed to create comment',
                error: error instanceof Error ? error.message : 'Unknown error',
              },
              null,
              2
            ),
          },
        ],
      };
    }
  },
};

// Get Context Labels Tool
export const getContextLabelsTool: Tool = {
  schema: {
    name: 'get_context_labels',
    description:
      'Get all context labels from Todoist. Context labels are labels that start with "context:" and are used to organize tasks by context (e.g., context:home, context:office, context:mobile).',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    console.error('Executing get_context_labels...');
    const result = await getContextLabels();
    console.error('get_context_labels completed successfully');
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
