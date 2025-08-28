#!/bin/bash

echo "🧪 Testing list_projects tool"
echo "============================"

# Send initialization request, then tools/list, then tools/call for list_projects
(
  echo '{"jsonrpc":"2.0","id":0,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"claude-ai","version":"0.1.0"}}}'
  sleep 1
  echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
  sleep 1
  echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_projects","arguments":{}}}'
) | ./start-mcp.sh
