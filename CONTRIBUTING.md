# Contributing to Todoist MCP Server

## Development Workflow

### 1. TDD Approach

Always write tests first:

1. **Red** - Write a failing test
2. **Green** - Write minimal code to make it pass
3. **Refactor** - Improve code while keeping tests green

### 2. Adding New Tools

#### Step 1: Write Tests

Create or update `src/services/todoist.spec.ts`:

```typescript
describe('newTool', () => {
  it('should handle success case', async () => {
    // arrange
    const mockClient = {
      /* mock setup */
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await newTool();

    // assert
    expect(result).toContain('expected output');
  });
});
```

#### Step 2: Implement Function

Add to `src/services/todoist.ts`:

```typescript
export async function newTool(): Promise<string> {
  const client = getTodoistClient();
  // implementation
}
```

#### Step 3: Add to MCP Server

Update `src/index.ts`:

```typescript
// Add to tools array
{
  name: 'new_tool',
  description: 'Description of what the tool does',
  inputSchema: { /* schema */ }
}

// Add to switch statement
case 'new_tool':
  return {
    content: [{ type: 'text', text: await newTool() }]
  };
```

### 3. Code Standards

#### Functional Programming

- Use pure functions when possible
- Avoid side effects
- Prefer composition over inheritance
- Use immutable data structures

#### Testing

- Mock at module level: `jest.mock('./client')`
- Test both success and error paths
- Use descriptive test names
- Keep tests isolated and fast
- **AAA Pattern**: Always use `// arrange`, `// act`, `// assert` blocks
- **No blank lines within blocks**: All statements in each block should be consecutive
- **Separate blocks**: Never combine `// act & assert` - always separate blocks
- **Blank lines between blocks**: Only use blank lines between AAA blocks, not within them

#### Error Handling

- Provide context in error messages
- Handle API errors gracefully
- Use consistent error format

### 4. File Structure

```
src/
├── services/
│   ├── client.ts        # API client configuration
│   ├── todoist.ts       # Business logic functions
│   └── todoist.spec.ts  # Tests
└── index.ts             # MCP server entry point
```

### 5. Git Workflow

1. Write tests first
2. Implement functionality
3. Ensure all tests pass
4. Update documentation
