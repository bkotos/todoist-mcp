#!/bin/bash

# Change to the script's directory to ensure correct working directory
cd "$(dirname "$0")"

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Create logs directory if it doesn't exist (only if we have write access)
if [ -w . ]; then
    mkdir -p logs 2>/dev/null || true
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    LOG_FILE="logs/mcp_${TIMESTAMP}.log"
    # Start the MCP server using tsx and log only stderr
    exec 2> >(tee -a "$LOG_FILE" >&2)
else
    # If we can't write to logs, just log to stderr
    echo "Warning: Cannot create logs directory, logging to stderr only" >&2
fi

# Start the MCP server
npx tsx src/index.ts
