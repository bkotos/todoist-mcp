# Connecting Claude Desktop to stdio MCP Server

To connect Claude Desktop to your stdio MCP server, you'll need to configure it in Claude Desktop's settings. Here's how:

## 1. Locate the Configuration File

Claude Desktop uses a configuration file to define MCP servers:

**On macOS:**

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**On Windows:**

```
%APPDATA%/Claude/claude_desktop_config.json
```

## 2. Configure Your MCP Server

Create or edit the `claude_desktop_config.json` file with this structure:

```json
{
  "mcpServers": {
    "your-server-name": {
      "command": "node",
      "args": ["path/to/your/server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

Replace:

- `"your-server-name"` with a descriptive name for your server
- `"node"` with the appropriate runtime (could be `python`, `node`, or direct path to executable)
- `"path/to/your/server.js"` with the actual path to your server script
- Add any necessary environment variables in the `env` object

## 3. Example Configurations

**For a Node.js server:**

```json
{
  "mcpServers": {
    "my-stdio-server": {
      "command": "node",
      "args": ["/Users/username/my-mcp-server/index.js"]
    }
  }
}
```

**For a Python server:**

```json
{
  "mcpServers": {
    "my-python-server": {
      "command": "python",
      "args": ["/path/to/your/server.py"]
    }
  }
}
```

**For a compiled executable:**

```json
{
  "mcpServers": {
    "my-executable-server": {
      "command": "/path/to/your/executable"
    }
  }
}
```

## 4. Restart Claude Desktop

After saving the configuration file, restart Claude Desktop completely for the changes to take effect.

## 5. Verify Connection

Once restarted, Claude Desktop should automatically attempt to connect to your MCP server. You can verify the connection is working by trying to use any tools or resources your server provides.

## Troubleshooting Tips

- Ensure your server executable/script has proper permissions
- Check that all file paths are absolute and correct
- Make sure your server properly implements the MCP stdio protocol
- Look at Claude Desktop's logs if the connection fails (usually found in the same directory as the config file)

Your stdio MCP server should implement the standard MCP protocol for initialization, capability negotiation, and message handling over stdin/stdout.
