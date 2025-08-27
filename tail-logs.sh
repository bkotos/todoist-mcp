#!/bin/bash

# Find the latest MCP log file
LATEST_LOG=$(ls -t logs/mcp_*.log 2>/dev/null | head -1)

if [ -z "$LATEST_LOG" ]; then
    echo "No MCP log files found in logs/ directory"
    echo "Start the MCP server first with: ./start-mcp.sh"
    exit 1
fi

echo "Tailing latest log file: $LATEST_LOG"
echo "Press Ctrl+C to stop tailing"
echo "----------------------------------------"

# Tail the latest log file with follow (-f) and show line numbers (-n)
tail -f -n +1 "$LATEST_LOG"
