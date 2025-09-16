import { createTaskCommentTool } from './create-task-comment';
import type { MockedFunction } from 'vitest';
import { createTaskComment } from '../services/tasks/comments';

vi.mock('../services/tasks/comments');

const mockCreateTaskComment = createTaskComment as MockedFunction<
  typeof createTaskComment
>;

describe('createTaskCommentHandler', () => {
  it('should create a new comment on a task successfully', async () => {
    // arrange
    const mockTaskId = '123';
    const mockContent = 'This is a test comment';
    const mockComment = {
      id: 456,
      content: 'This is a test comment\n\n*(commented using Claude)*',
      posted: '2024-01-03T12:00:00Z',
      posted_uid: 'user1',
      attachment: null,
    };

    mockCreateTaskComment.mockResolvedValue(mockComment);

    // act
    const result = await createTaskCommentTool.handler({
      task_id: mockTaskId,
      content: mockContent,
    });

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');

    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(true);
    expect(responseData.message).toBe('Comment created successfully');
    expect(responseData.comment.id).toBe(456);
    expect(responseData.comment.content).toBe(
      'This is a test comment\n\n*(commented using Claude)*'
    );
    expect(responseData.comment.posted_uid).toBe('user1');

    expect(mockCreateTaskComment).toHaveBeenCalledWith(mockTaskId, mockContent);
  });

  it('should handle error when creating comment fails', async () => {
    // arrange
    const mockTaskId = '123';
    const mockContent = 'This is a test comment';
    const mockError = new Error('API Error');

    mockCreateTaskComment.mockRejectedValue(mockError);

    // act
    const result = await createTaskCommentTool.handler({
      task_id: mockTaskId,
      content: mockContent,
    });

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');

    const responseData = JSON.parse(result.content[0].text);
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Failed to create comment');
    expect(responseData.error).toBe('API Error');

    expect(mockCreateTaskComment).toHaveBeenCalledWith(mockTaskId, mockContent);
  });
});
