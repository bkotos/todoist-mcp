# Todoist MCP Server

A Model Context Protocol (MCP) server that provides tools to interact with Todoist's API for task management. This server can be used with Claude and other MCP-compatible AI assistants to manage your Todoist tasks and projects.

## Features

- 📋 List tasks from specific inbox projects
- ➕ Create new tasks with due dates and priorities
- ✏️ Update existing tasks
- ✅ Close/complete tasks
- 📁 List all projects
- 🏷️ Manage task labels
- 📅 Handle due dates with natural language

## Prerequisites

- Node.js 18+ 
- A Todoist account with API access
- Todoist API token

## Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd todoist-mcp
   npm install
   ```

2. **Get your Todoist API token:**
   - Go to [Todoist Settings > Integrations > Developer](https://app.todoist.com/app/settings/integrations/developer)
   - Copy your API token

3. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Todoist API token:
   ```
   TODOIST_API_TOKEN=your_actual_api_token_here
   
   # Optional: Specify project IDs for inbox processing
   INBOX_PROJECT_IDS=project_id_1,project_id_2
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### MCP Configuration

Add this to your MCP client configuration (e.g., Claude Desktop):

**Option 1: Using the shell script (recommended)**
```json
{
  "mcpServers": {
    "todoist": {
      "command": "/path/to/todoist-mcp/start-mcp.sh",
      "args": [],
      "env": {}
    }
  }
}
```

**Option 2: Direct node command with environment variables**
```json
{
  "mcpServers": {
    "todoist": {
      "command": "node",
      "args": ["/path/to/todoist-mcp/dist/index.js"],
      "env": {
        "TODOIST_API_TOKEN": "your_api_token_here",
        "INBOX_PROJECT_IDS": "project_id_1,project_id_2"
      }
    }
  }
}
```

## Available Tools

### `list_inbox_tasks`
Lists all tasks from specified inbox projects.

**Parameters:**
- `project_ids` (optional): Array of project IDs to fetch tasks from

**Example:**
```json
{
  "project_ids": ["123456789", "987654321"]
}
```

### `create_task`
Creates a new task in Todoist.

**Parameters:**
- `content` (required): The content/title of the task
- `project_id` (optional): The project ID where to create the task
- `due_string` (optional): Due date string (e.g., "today", "tomorrow", "next week")
- `priority` (optional): Priority level (1-4, where 1 is highest)

**Example:**
```json
{
  "content": "Review quarterly reports",
  "project_id": "123456789",
  "due_string": "next week",
  "priority": 2
}
```

### `update_task`
Updates an existing task in Todoist.

**Parameters:**
- `task_id` (required): The ID of the task to update
- `content` (optional): New content for the task
- `due_string` (optional): New due date string
- `priority` (optional): New priority level (1-4)
- `labels` (optional): Array of label names to assign

**Example:**
```json
{
  "task_id": "123456789",
  "content": "Updated task content",
  "priority": 1,
  "labels": ["urgent", "work"]
}
```

### `close_task`
Closes/completes a task in Todoist.

**Parameters:**
- `task_id` (required): The ID of the task to close

**Example:**
```json
{
  "task_id": "123456789"
}
```

### `list_projects`
Lists all projects in Todoist.

**Parameters:** None

## Finding Project IDs

To find your project IDs, use the `list_projects` tool. The response will show each project with its ID, which you can then use in other tools or add to your `INBOX_PROJECT_IDS` environment variable.

## Error Handling

The server provides detailed error messages for common issues:
- Missing API token
- Invalid project or task IDs
- API rate limiting
- Network connectivity issues

## Development

### Project Structure
```
src/
├── index.ts              # Main MCP server entry point
└── services/
    └── todoist.ts        # Todoist API service
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm run clean` - Clean build artifacts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

