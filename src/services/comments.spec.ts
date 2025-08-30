import { getTaskComments } from './comments';
import { getTodoistClient } from './client';

jest.mock('./client');

const mockGetTodoistClient = getTodoistClient as jest.MockedFunction<
  typeof getTodoistClient
>;

describe('getTaskComments', () => {
  it('should return structured comments data for a task', async () => {
    // arrange
    const mockTaskId = '123';
    const mockComments = [
      {
        id: '1',
        task_id: '123',
        project_id: '456',
        posted: '2024-01-01T10:00:00Z',
        content: 'Test comment 1',
        attachment: null,
        posted_uid: 'user1',
        uids_to_notify: [],
        is_rtl: false,
        reactions: {},
      },
      {
        id: '2',
        task_id: '123',
        project_id: '456',
        posted: '2024-01-02T11:00:00Z',
        content: 'Test comment 2',
        attachment: {
          resource_type: 'file',
          file_name: 'test.pdf',
          file_size: 1024,
          file_url: 'https://example.com/test.pdf',
          upload_state: 'completed',
        },
        posted_uid: 'user2',
        uids_to_notify: [],
        is_rtl: false,
        reactions: {},
      },
    ];

    const mockClient = {
      get: jest.fn().mockResolvedValue({ data: mockComments }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTaskComments(mockTaskId);

    // assert
    expect(result.comments).toHaveLength(2);
    expect(result.total_count).toBe(2);
    expect(result.comments[0]).toEqual({
      id: 1,
      content: 'Test comment 1',
      posted: '2024-01-01T10:00:00Z',
      posted_uid: 'user1',
      attachment: null,
    });
    expect(result.comments[1]).toEqual({
      id: 2,
      content: 'Test comment 2',
      posted: '2024-01-02T11:00:00Z',
      posted_uid: 'user2',
      attachment: {
        resource_type: 'file',
        file_name: 'test.pdf',
        file_size: 1024,
        file_url: 'https://example.com/test.pdf',
        upload_state: 'completed',
      },
    });
    expect(mockClient.get).toHaveBeenCalledWith(
      `/comments?task_id=${mockTaskId}`
    );
  });

  it('should handle empty comments list', async () => {
    // arrange
    const mockTaskId = '123';
    const mockClient = {
      get: jest.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTaskComments(mockTaskId);

    // assert
    expect(result.comments).toHaveLength(0);
    expect(result.total_count).toBe(0);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/comments?task_id=${mockTaskId}`
    );
  });

  it('should handle API error', async () => {
    // arrange
    const mockTaskId = '123';
    const mockClient = {
      get: jest.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTaskComments(mockTaskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get task comments: API Error'
    );
  });
});
