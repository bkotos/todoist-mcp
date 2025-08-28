# Todoist MCP Server

A TypeScript-based **[Model Context Protocol (MCP)](https://en.wikipedia.org/wiki/Model_Context_Protocol) server** that provides [Todoist](https://www.todoist.com/) task management capabilities to AI assistants. This MCP server is built for use with Claude Desktop and [operates over stdio](https://docs.anthropic.com/en/docs/claude-code/mcp#option-1%3A-add-a-local-stdio-server).

**Note:** This MCP server is tailored to my specific workflow with Todoist and may not align with how others use the tool.

## Getting Started

### Prerequisites

- Node.js 18+
- Todoist account with API access

### Install

```bash
git clone <repository-url>
cd todoist-mcp
npm ci
```

### Configure

```bash
cp env.example .env
# Add your Todoist API token to .env
```

### Connect to Claude Desktop

#### 1. Configure Claude Desktop

Edit your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

#### 2. Add MCP Server Configuration

```json
{
  "mcpServers": {
    "todoist": {
      "command": "$PATH_TO_REPO/start-mcp.sh",
      "args": [],
      "env": {}
    }
  }
}
```

_Replace `$PATH_TO_REPO` with the absolute path of where you cloned this repo._

#### 3. Restart Claude Desktop

Restart Claude Desktop completely for the changes to take effect.

#### 4. Verify Connection

Test the connection by asking Claude to list your Todoist projects or tasks.
