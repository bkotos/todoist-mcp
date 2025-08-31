import { createTaskComment } from '../services/comments';

export const createTaskCommentSchema = {
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
};

export const createTaskCommentHandler = async (args: {
  task_id: string;
  content: string;
}) => {
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
};
