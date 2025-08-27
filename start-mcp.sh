#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Get current timestamp for log file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="logs/mcp_${TIMESTAMP}.log"

echo "Starting MCP server with logging to: $LOG_FILE"

# Start the MCP server using tsx and log all traffic
# This will capture all stdin/stdout/stderr to the log file
# while still allowing the MCP server to communicate normally
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)

# Start the MCP server
npx tsx src/index.ts
