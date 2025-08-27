# Development Guide

## Patterns and Examples

### Adding a New Todoist API Function

#### 1. Test Pattern

```typescript
describe('functionName', () => {
  it('should handle success case', async () => {
    // arrange
    const mockClient = {
      get: jest.fn().mockResolvedValue({ data: mockData }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await functionName();

    // assert
    expect(result).toContain('expected output');
    expect(mockClient.get).toHaveBeenCalledWith('/endpoint');
  });

  it('should handle error case', async () => {
    // arrange
    const mockClient = {
      get: jest.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = functionName();

    // assert
    await expect(promise).rejects.toThrow('Failed to...');
  });
});
```

#### 2. Function Pattern

```typescript
export async function functionName(): Promise<string> {
  const client = getTodoistClient();

  try {
    const response = await client.get<ResponseType[]>('/endpoint');
    return formatResponse(response.data);
  } catch (error) {
    throw new Error(`Failed to functionName: ${getErrorMessage(error)}`);
  }
}
```

#### 3. MCP Tool Pattern

```typescript
// In tools array
{
  name: 'function_name',
  description: 'Clear description of what this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Description of parameter'
      }
    },
    required: ['param1']
  }
}

// In switch statement
case 'function_name':
  return {
    content: [
      {
        type: 'text',
        text: await functionName()
      }
    ]
  };
```

### Error Handling Pattern

```typescript
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}
```

### Formatting Pattern

```typescript
function formatList(items: any[], itemName: string): string {
  if (items.length === 0) {
    return `No ${itemName} found.`;
  }

  const formattedItems = items.map((item) => formatItem(item)).join('\n\n');

  return `Found ${items.length} ${itemName}(s):\n\n${formattedItems}`;
}
```

## Common Todoist API Endpoints

- `GET /projects` - List all projects
- `GET /tasks` - List all tasks
- `POST /tasks` - Create a new task
- `POST /tasks/{id}` - Update a task
- `POST /tasks/{id}/close` - Close a task

## Testing Best Practices

1. **Mock at module level** - Use `jest.mock('./client')`
2. **Test both paths** - Success and error cases
3. **Verify API calls** - Check that correct endpoints are called
4. **Test formatting** - Verify output format is correct
5. **Isolate tests** - Each test should be independent

### AAA Test Pattern

**Always follow this exact structure:**

```typescript
it('should do something', async () => {
  // arrange
  const mockClient = {
    /* setup */
  };
  mockGetTodoistClient.mockReturnValue(mockClient);

  // act
  const result = await functionName();

  // assert
  expect(result).toContain('expected');
});
```

**Rules:**

- ✅ **Separate blocks**: Always use distinct `// arrange`, `// act`, `// assert` blocks
- ✅ **No blank lines within blocks**: All statements in each block must be consecutive
- ✅ **Blank lines between blocks**: Only use blank lines between AAA blocks
- ❌ **Never combine**: No `// act & assert` - always separate blocks
- ❌ **No internal spacing**: No blank lines within arrange/act/assert blocks
